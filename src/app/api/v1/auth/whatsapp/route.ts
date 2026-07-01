import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "WhatsApp OTP is deprecated. Please use Firebase Authentication." },
    { status: 410 }
  );
}
