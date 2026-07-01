import { NextRequest, NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api-auth";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const { uid, error } = await requireAuth(request);
    if (error || !uid) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!adminAuth) {
      return NextResponse.json({ authenticated: false }, { status: 500 });
    }

    const userRecord = await adminAuth.getUser(uid);
    return NextResponse.json({
      authenticated: true,
      user: {
        id: uid,
        email: userRecord.email,
        name: userRecord.displayName
      }
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
