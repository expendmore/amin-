"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { auth } from "@/lib/firebase-client";
import {
  Mail,
  RefreshCw,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, sendVerificationEmail, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isVerified, setIsVerified] = useState(false);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Check email verification status on page mount and poll every 4 seconds
  useEffect(() => {
    if (!user) return;

    // Check once immediately
    if (user.emailVerified) {
      setIsVerified(true);
      setTimeout(() => router.push("/chat"), 2000);
      return;
    }

    const interval = setInterval(async () => {
      try {
        await auth.currentUser?.reload();
        const updatedUser = auth.currentUser;
        if (updatedUser?.emailVerified) {
          setIsVerified(true);
          clearInterval(interval);
          setTimeout(() => router.push("/chat"), 2500);
        }
      } catch (err) {
        console.error("Failed to auto-refresh email status:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [user, router]);

  const handleRefresh = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await auth.currentUser?.reload();
      const updatedUser = auth.currentUser;

      if (updatedUser?.emailVerified) {
        setIsVerified(true);
        setSuccess("Email successfully verified! Redirecting to workspace...");
        setTimeout(() => {
          router.push("/chat");
        }, 2000);
      } else {
        setError("Email is not verified yet. Please check your inbox and click the activation link.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to check verification status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);

    try {
      await sendVerificationEmail();
      setSuccess("A new verification link has been sent to your business email.");
      setCountdown(60); // Restart countdown timer
    } catch (err: any) {
      if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please wait before requesting another link.");
      } else {
        setError(err.message || "Failed to dispatch verification email.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isVerified) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center p-6 text-slate-100">
        <div className="w-full max-w-md text-center space-y-6 animate-scale-up">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 animate-bounce">
              <CheckCircle className="h-10 w-10" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Email Verified!</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Thank you! Your email has been successfully confirmed. We are launching your multi-tenant B2B automation workspace now...
          </p>
          <div className="flex justify-center pt-2">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* Visual Column Left (Shared B2B Design) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex border-r border-slate-800">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            SENSY<span className="text-emerald-400">.AI</span>
          </span>
        </div>

        <div className="relative z-10 my-auto max-w-lg">
          <div className="mb-6 rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 w-fit">
            Account Activation Required
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Activate Your Multi-Tenant Instance
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Secure workspace configuration requires confirming your corporate domain. Verify your email to connect the WhatsApp Cloud API and start workflow routing.
          </p>
        </div>

        <div className="relative z-10 flex justify-between text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} ExpendMore Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> AES-256 Meta Cloud Security
          </span>
        </div>
      </div>

      {/* Main Verification Actions Form Right */}
      <div className="relative flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 sm:px-12 lg:px-20 bg-slate-950">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <span className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                <Mail className="h-8 w-8" />
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Verify your business email</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              We have sent a verification link to <strong className="text-slate-200">{user?.email || "your email"}</strong>.
              Please confirm your email address to activate your account.
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg bg-red-500/10 p-4 border border-red-500/20 text-sm text-red-400">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 text-sm text-emerald-400 animate-fade-in">
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Refresh Verification */}
            <button
              onClick={handleRefresh}
              disabled={loading || resendLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors focus:outline-none disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4.5 w-4.5" />
                  I have verified my email
                </>
              )}
            </button>

            {/* Resend Verification */}
            <button
              onClick={handleResend}
              disabled={loading || resendLoading || countdown > 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-3 text-sm font-semibold text-white transition-colors focus:outline-none disabled:opacity-50"
            >
              {resendLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              ) : (
                <>
                  <Send className="h-4.5 w-4.5" />
                  Resend Verification Email {countdown > 0 ? `(${countdown}s)` : ""}
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-805" />
              </div>
            </div>

            {/* Logout/Back */}
            <button
              onClick={handleLogout}
              className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors py-2 focus:outline-none"
            >
              Sign out and try another email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
