"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Mail,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Please fill in your email address.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordReset(email);
      setSuccess("If an account exists for this email, we have dispatched a password reset link.");
      setEmail("");
    } catch (err: any) {
      console.error("Password reset dispatch failed:", err);
      if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else {
        setError(err.message || "Failed to dispatch password reset email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* Visual Left Column */}
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
            Account Recovery Gateway
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Recover Access to Your Workspace
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Enter your workspace email address, and we'll dispatch a link to reset your credentials securely. If you use Google SSO, please sign in using your Google credentials instead.
          </p>
        </div>

        <div className="relative z-10 flex justify-between text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} ExpendMore Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> AES-256 Meta Cloud Security
          </span>
        </div>
      </div>

      {/* Main Forms Right Column */}
      <div className="relative flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 sm:px-12 lg:px-20 bg-slate-950">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Forgot password?</h2>
            <p className="mt-2 text-sm text-slate-400">
              Recover access to your ExpendMore workspace.
            </p>
          </div>

          {/* Feedback banners */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg bg-red-500/10 p-4 border border-red-500/20 text-sm text-red-400">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 text-sm text-emerald-400">
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Business Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Send Reset Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors focus:outline-none disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send Password Reset Link"
              )}
            </button>
          </form>

          {/* Go Back Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
