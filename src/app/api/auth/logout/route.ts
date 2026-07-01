/**
 * POST /api/auth/logout
 *
 * Clears the HttpOnly session cookie on the server.
 * Must be called on logout in addition to Firebase client signOut().
 */

import { NextResponse } from "next/server";

const COOKIE_NAME = "firebase-token";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Clear the cookie by setting maxAge to 0
    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[POST /api/auth/logout] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
