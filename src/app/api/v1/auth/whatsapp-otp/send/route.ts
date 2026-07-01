/**
 * POST /api/v1/auth/whatsapp-otp/send
 * Sends a 6-digit OTP to user's WhatsApp number.
 * Stores OTP in Redis with 5-minute expiry.
 *
 * Body: { phone: "+919876543210" }
 */

import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { sendMetaWhatsAppMessage } from "@/lib/whatsapp";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Valid phone number with country code is required." }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const cacheKey = `whatsapp_otp:${phone}`;

    // Store in Redis with 5-minute TTL
    await redis.set(cacheKey, otp, { ex: 300 });

    // Send OTP via WhatsApp
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";

    const sendResult = await sendMetaWhatsAppMessage(phoneNumberId, accessToken, {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: {
        body: `🔐 Your LetsGrow verification code is: *${otp}*\n\nThis code expires in 5 minutes. Do not share it with anyone.`
      }
    });

    if (!sendResult.success) {
      // In development / testing, log OTP to console and return success
      console.log(`[WhatsApp OTP] (DEV MODE) Phone: ${phone} → OTP: ${otp}`);
      return NextResponse.json({
        success: true,
        message: `OTP sent to ${phone}`,
        dev_otp: process.env.NODE_ENV !== "production" ? otp : undefined
      });
    }

    return NextResponse.json({ success: true, message: `OTP sent to WhatsApp number ${phone}` });
  } catch (error: any) {
    console.error("[WhatsApp OTP Send Error]:", error);
    return NextResponse.json({ error: "Failed to send OTP.", message: error.message }, { status: 500 });
  }
}
