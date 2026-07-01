/**
 * POST /api/auth/refresh
 *
 * Refreshes the HttpOnly session cookie with a new Firebase ID token.
 * Called when Firebase SDK auto-refreshes the token (every hour).
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyRequestToken } from "@/lib/firebase-admin";

const COOKIE_NAME = "firebase-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken is required" }, { status: 400 });
    }

    const { uid, error } = await verifyRequestToken(idToken);

    if (error || !uid) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, uid }, { status: 200 });

    response.cookies.set(COOKIE_NAME, idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[POST /api/auth/refresh] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
