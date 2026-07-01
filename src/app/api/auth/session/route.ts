/**
 * POST /api/auth/session
 *
 * Exchanges a Firebase client-side ID token for a secure HttpOnly session cookie.
 * Called immediately after Firebase signIn on the client.
 *
 * Security:
 * - HttpOnly: JS cannot read the cookie (XSS protection)
 * - Secure: HTTPS only in production
 * - SameSite=Strict: CSRF protection
 * - Token is verified by Firebase Admin before cookie is set
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyRequestToken } from "@/lib/firebase-admin";

const COOKIE_NAME = "firebase-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "idToken is required" },
        { status: 400 }
      );
    }

    // Verify with Firebase Admin — rejects expired, revoked, or tampered tokens
    const { uid, error } = await verifyRequestToken(idToken);

    if (error || !uid) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Build response with HttpOnly cookie
    const response = NextResponse.json(
      { success: true, uid },
      { status: 200 }
    );

    response.cookies.set(COOKIE_NAME, idToken, {
      httpOnly: true,        // Cannot be read by JavaScript
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict",    // Prevent CSRF
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[POST /api/auth/session] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
