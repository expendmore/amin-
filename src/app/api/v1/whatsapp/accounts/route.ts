import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireWorkspaceAccess, apiError, apiSuccess } from "@/lib/api-auth";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    const { uid, error: authError } = await requireAuth(request);
    if (authError) return apiError(authError, 401);

    const workspaceId = request.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId) return apiError("workspaceId query parameter is required", 400);

    const { error: wsError } = await requireWorkspaceAccess(workspaceId, uid);
    if (wsError) return apiError(wsError, 403);

    if (!adminDb) {
      return apiError("Database not available", 500);
    }

    const snapshot = await adminDb
      .collection("whatsappAccounts")
      .where("workspaceId", "==", workspaceId)
      .get();

    const accounts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return apiSuccess({ accounts });
  } catch (err: any) {
    console.error("[GET /api/v1/whatsapp/accounts] Error:", err);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { uid, error: authError } = await requireAuth(request);
    if (authError) return apiError(authError, 401);

    const body = await request.json();
    const { displayName, phoneNumber, phoneNumberId, wabaId, accessToken, workspaceId } = body;

    if (!workspaceId) {
      return apiError("workspaceId is required", 400);
    }

    if (!displayName || !phoneNumber) {
      return apiError("displayName and phoneNumber are required", 400);
    }

    const { role, error: wsError } = await requireWorkspaceAccess(workspaceId, uid);
    if (wsError) return apiError(wsError, 403);

    // Only allow OWNER and ADMIN roles to connect WABA accounts
    if (role !== "owner" && role !== "admin") {
      return apiError("Only administrators can register WhatsApp accounts", 403);
    }

    if (!adminDb) {
      return apiError("Database not available", 500);
    }

    // Provision account in Firestore
    const accountRef = adminDb.collection("whatsappAccounts").doc();
    const accountId = accountRef.id;

    const accountData = {
      id: accountId,
      workspaceId,
      wabaId: wabaId || "",
      phoneNumberId: phoneNumberId || "",
      displayName,
      phoneNumber,
      accessToken: accessToken || "", // TODO: encrypt this token using AES-256
      webhookVerifyToken: `verify_${Math.random().toString(36).substring(2, 15)}`,
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await accountRef.set(accountData);

    // Write audit log
    await adminDb.collection("auditLogs").add({
      workspaceId,
      userId: uid,
      action: `Connected WhatsApp Business Account ${displayName} (${phoneNumber})`,
      timestamp: FieldValue.serverTimestamp(),
    });

    return apiSuccess({ account: { id: accountId, ...accountData } }, 201);
  } catch (err: any) {
    console.error("[POST /api/v1/whatsapp/accounts] Error:", err);
    return apiError("Internal server error", 500);
  }
}
