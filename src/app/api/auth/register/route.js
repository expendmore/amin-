import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { db } from "@/lib/firebase";

// List of common consumer email domains to block for B2B registration
const PUBLIC_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "mail.com",
  "zoho.com",
  "protonmail.com",
  "proton.me",
  "icloud.com",
  "gmx.com",
  "yandex.com",
];

function isCorporateEmail(email) {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1].toLowerCase();
  return !PUBLIC_EMAIL_DOMAINS.includes(domain);
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { fullName, businessName, email, password } = body;

    // 1. Validate required fields
    if (!fullName || !businessName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 2. Validate corporate email domain
    if (!isCorporateEmail(email)) {
      return NextResponse.json(
        {
          error:
            "Registration is restricted to corporate domains. Please use your work or corporate email address.",
        },
        { status: 400 }
      );
    }

    // 3. Validate password complexity
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // 4. Check if user already exists in Firestore 'users' collection
    const normalizedEmail = email.toLowerCase().trim();
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef.where("email", "==", normalizedEmail).get();

    if (!userSnapshot.empty) {
      return NextResponse.json(
        { error: "This email address is already registered." },
        { status: 409 }
      );
    }

    // 5. Generate secure tenant ID and verification token
    const tenantId = `tnt_${crypto.randomBytes(6).toString("hex")}`;
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // 6. Hash password with bcryptjs
    const passwordHash = await bcrypt.hash(password, 12);

    // 7. Store user document in Firestore
    await usersRef.add({
      tenant_id: tenantId,
      full_name: fullName,
      business_name: businessName,
      email: normalizedEmail,
      password_hash: passwordHash,
      is_email_verified: false,
      auth_provider: "credentials",
      verification_token: verificationToken,
      verification_token_expires: verificationTokenExpires,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 8. Setup Nodemailer Transporter
    const verifyUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/api/auth/verify?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "mock-user",
        pass: process.env.SMTP_PASS || "mock-pass",
      },
    });

    // Premium HTML Layout matching B2B ExpendMore
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify your email address - ExpendMore</title>
        <style>
          body {
            background-color: #020617;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 580px;
            margin: 40px auto;
            padding: 32px;
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          }
          .logo-area {
            text-align: center;
            margin-bottom: 24px;
          }
          .logo-text {
            color: #25d366;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.05em;
            margin: 0;
          }
          .logo-sub {
            color: #ffffff;
          }
          .content-card {
            background-color: #1e293b;
            padding: 24px;
            border-radius: 8px;
            border: 1px solid #334155;
          }
          .title {
            color: #ffffff;
            font-size: 18px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 16px;
          }
          .body-text {
            color: #94a3b8;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .btn-container {
            text-align: center;
            margin: 28px 0;
          }
          .verify-btn {
            background-color: #25d366;
            color: #000000 !important;
            text-decoration: none;
            padding: 12px 28px;
            font-size: 14px;
            font-weight: 700;
            border-radius: 6px;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);
            transition: all 0.2s ease;
          }
          .link-fallback {
            background-color: #020617;
            padding: 12px;
            border-radius: 6px;
            border: 1px dashed #334155;
            font-size: 12px;
            color: #25d366;
            word-break: break-all;
            margin-top: 16px;
          }
          .footer {
            text-align: center;
            margin-top: 32px;
            font-size: 12px;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="logo-area">
            <h1 class="logo-text">EXPEND<span class="logo-sub">MORE</span></h1>
          </div>
          <div class="content-card">
            <h2 class="title">Verify Your Business Account</h2>
            <p class="body-text">Hello <strong>${fullName}</strong>,</p>
            <p class="body-text">
              Welcome to ExpendMore! You've successfully initialized onboarding for <strong>${businessName}</strong>. 
              To activate your multi-tenant instance, secure your access, and connect your WhatsApp Business API configurations, please verify your email address.
            </p>
            <div class="btn-container">
              <a href="${verifyUrl}" class="verify-btn">Activate Account</a>
            </div>
            <p class="body-text" style="font-size: 12px; color: #64748b;">
              If the button doesn't work, copy and paste the verification URL directly into your web browser:
            </p>
            <div class="link-fallback">${verifyUrl}</div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ExpendMore. All rights reserved.</p>
            <p>You received this because an account registration was requested for this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      if (process.env.SMTP_HOST) {
        await transporter.sendMail({
          from: `"ExpendMore" <${process.env.SMTP_FROM || "noreply@expendmore.com"}>`,
          to: normalizedEmail,
          subject: "Activate your B2B ExpendMore Account - ExpendMore",
          html: emailHtml,
        });
      } else {
        console.log("-----------------------------------------");
        console.log("SMTP Environment not configured. Logging mock mailer details:");
        console.log(`Recipient: ${normalizedEmail}`);
        console.log(`Verification URL: ${verifyUrl}`);
        console.log("-----------------------------------------");
      }
    } catch (mailError) {
      console.error("Nodemailer dispatch failed, continuing user creation:", mailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Verification email successfully dispatched. Please check your inbox.",
        tenantId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
