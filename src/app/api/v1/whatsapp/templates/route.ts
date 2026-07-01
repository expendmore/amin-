/**
 * GET  /api/v1/whatsapp/templates  – Sync & return templates (from Meta API or Firestore DB cache)
 * POST /api/v1/whatsapp/templates  – Create a new template (Firestore DB + optionally Meta)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireWorkspaceAccess, apiError, apiSuccess } from "@/lib/api-auth";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { syncMetaWhatsAppTemplates } from "@/lib/whatsapp";

// ── GET: Sync templates from Meta API and return or load from Firestore ──────────────────────
export async function GET(request: NextRequest) {
  try {
    const { uid, error: authErr } = await requireAuth(request);
    if (authErr) return apiError(authErr, 401);

    const workspaceId = request.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId) return apiError("workspaceId query parameter is required", 400);

    const { error: wsErr } = await requireWorkspaceAccess(workspaceId, uid);
    if (wsErr) return apiError(wsErr, 403);

    const forceSync = request.nextUrl.searchParams.get("sync") === "true";

    if (!adminDb) {
      return apiError("Database not available", 500);
    }

    // If sync requested, sync live templates from Meta API
    if (forceSync) {
      // Look up first active WhatsApp account for this workspace
      const accountSnap = await adminDb
        .collection("whatsappAccounts")
        .where("workspaceId", "==", workspaceId)
        .where("status", "==", "active")
        .limit(1)
        .get();

      if (!accountSnap.empty) {
        const account = accountSnap.docs[0].data();
        const { wabaId, accessToken } = account;

        if (wabaId && accessToken) {
          const syncResult = await syncMetaWhatsAppTemplates(wabaId, accessToken);
          if (syncResult.success && syncResult.templates) {
            const batch = adminDb.batch();

            for (const tpl of syncResult.templates) {
              const tplRef = adminDb.collection("templates").doc(`${workspaceId}_${tpl.name}`);
              batch.set(tplRef, {
                id: tpl.id || `${workspaceId}_${tpl.name}`,
                workspaceId,
                metaTemplateId: tpl.id || "",
                name: tpl.name,
                category: tpl.category,
                language: tpl.language || "en_US",
                status: tpl.status,
                components: tpl.components || [],
                updatedAt: FieldValue.serverTimestamp()
              }, { merge: true });
            }

            await batch.commit();

            return apiSuccess({
              source: "meta_api",
              count: syncResult.templates.length,
              templates: syncResult.templates
            });
          }
        }
      }
    }

    // Load templates from Firestore cache
    const snapshot = await adminDb
      .collection("templates")
      .where("workspaceId", "==", workspaceId)
      .get();

    const templates = snapshot.docs.map(doc => doc.data());

    // If cache is empty, return initial mock templates
    if (templates.length === 0) {
      return apiSuccess({
        source: "default_stubs",
        templates: [
          {
            id: "tpl_1",
            name: "order_confirmation",
            category: "UTILITY",
            status: "APPROVED",
            language: "en_US",
            components: []
          }
        ]
      });
    }

    return apiSuccess({
      source: "firestore_cache",
      count: templates.length,
      templates
    });

  } catch (error: any) {
    console.error("[Templates GET Error]:", error);
    return apiError("Failed to fetch templates.", 500);
  }
}

// ── POST: Create a template in Firestore DB ──────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { uid, error: authErr } = await requireAuth(request);
    if (authErr) return apiError(authErr, 401);

    const body = await request.json();
    const { name, category, bodyText, language, workspaceId } = body;

    if (!workspaceId) {
      return apiError("workspaceId is required.", 400);
    }

    if (!name || !bodyText) {
      return apiError("Template name and bodyText are required.", 400);
    }

    const { error: wsErr } = await requireWorkspaceAccess(workspaceId, uid);
    if (wsErr) return apiError(wsErr, 403);

    if (!adminDb) {
      return apiError("Database not available", 500);
    }

    const tplRef = adminDb.collection("templates").doc(`${workspaceId}_${name}`);
    const templateData = {
      id: `${workspaceId}_${name}`,
      workspaceId,
      name,
      category: category || "UTILITY",
      status: "APPROVED",
      language: language || "en_US",
      components: [
        {
          type: "BODY",
          text: bodyText
        }
      ],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    await tplRef.set(templateData);

    return apiSuccess({ success: true, template: templateData }, 201);
  } catch (error: any) {
    console.error("[Templates POST Error]:", error);
    return apiError("Failed to create template.", 500);
  }
}
