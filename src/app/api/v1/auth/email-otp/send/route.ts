import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Email OTP authentication is deprecated. Please use Firebase Authentication." },
    { status: 410 }
  );
}
