/**
 * API Authentication Helper
 *
 * Use this in every API route under /api/v1/* to verify the caller is authenticated
 * and belongs to the requested workspace.
 *
 * Usage:
 *   const { uid, error } = await requireAuth(request);
 *   if (error) return NextResponse.json({ error }, { status: 401 });
 *
 *   const { workspaceId, error: wsError } = await requireWorkspaceAccess(request, uid);
 *   if (wsError) return NextResponse.json({ error: wsError }, { status: 403 });
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyRequestToken, adminDb } from "@/lib/firebase-admin";

const COOKIE_NAME = "firebase-token";

type AuthSuccess = { uid: string; error: null };
type AuthFailure = { uid: null; error: string };
type AuthResult = AuthSuccess | AuthFailure;

type WorkspaceSuccess = { workspaceId: string; role: string; error: null };
type WorkspaceFailure = { workspaceId: null; role: null; error: string };
type WorkspaceResult = WorkspaceSuccess | WorkspaceFailure;

/**
 * Verifies the Firebase session cookie and returns the user ID.
 * Handles both HttpOnly cookie (preferred) and Authorization: Bearer header (API clients).
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  // Prefer HttpOnly cookie (browser clients)
  let token = request.cookies.get(COOKIE_NAME)?.value;

  // Fallback: Authorization: Bearer <token> (API clients / mobile)
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    return { uid: null, error: "Authentication required" };
  }

  const { uid, error } = await verifyRequestToken(token);

  if (error || !uid) {
    return { uid: null, error: "Session expired. Please sign in again." };
  }

  return { uid, error: null };
}

/**
 * Verifies the authenticated user is a member of the requested workspace.
 * Always call AFTER requireAuth().
 */
export async function requireWorkspaceAccess(
  workspaceId: string,
  uid: string
): Promise<WorkspaceResult> {
  if (!workspaceId) {
    return { workspaceId: null, role: null, error: "workspaceId is required" };
  }

  if (!adminDb) {
    return { workspaceId: null, role: null, error: "Database not available" };
  }

  try {
    const memberRef = adminDb
      .collection("workspaces")
      .doc(workspaceId)
      .collection("members")
      .doc(uid);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      return {
        workspaceId: null,
        role: null,
        error: "Access denied: you are not a member of this workspace",
      };
    }

    const role = memberSnap.data()?.role ?? "customer";
    return { workspaceId, role, error: null };
  } catch (err) {
    console.error("[requireWorkspaceAccess] Firestore error:", err);
    return { workspaceId: null, role: null, error: "Failed to verify workspace access" };
  }
}

/**
 * Standard error response builder for API routes.
 * Never exposes internal error details to the client.
 */
export function apiError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Standard success response builder for API routes.
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}
