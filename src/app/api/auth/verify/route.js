import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(request) {
  try {
    // Parse token from search query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token parameter is missing." },
        { status: 400 }
      );
    }

    // Query Firestore users collection for matching verification token
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef
      .where("verification_token", "==", token)
      .get();

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    if (userSnapshot.empty) {
      return NextResponse.redirect(
        `${baseUrl}/login?verified=false&reason=expired_or_invalid`
      );
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Parse Firestore timestamp into JavaScript Date object
    const expiresAt = userData.verification_token_expires.toDate
      ? userData.verification_token_expires.toDate()
      : new Date(userData.verification_token_expires);

    if (expiresAt < new Date()) {
      return NextResponse.redirect(
        `${baseUrl}/login?verified=false&reason=expired_or_invalid`
      );
    }

    // Activate the user account and delete verification tokens
    await userDoc.ref.update({
      is_email_verified: true,
      verification_token: null,
      verification_token_expires: null,
    });

    // Redirect to login page with verification success query state
    return NextResponse.redirect(`${baseUrl}/login?verified=true`);
  } catch (error) {
    console.error("Verification route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
