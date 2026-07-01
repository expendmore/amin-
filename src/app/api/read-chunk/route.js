import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", "verify@testcompany.com").get();
    
    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" });
    }

    const userData = snapshot.docs[0].data();
    return NextResponse.json({
      email: userData.email,
      verification_token: userData.verification_token
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
