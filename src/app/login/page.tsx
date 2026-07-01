"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import {
  MessageSquare,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  Loader2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, googleLogin, user, isAuthenticated, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already authenticated and email is verified
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.emailVerified) {
        router.push("/chat");
      } else {
        router.push("/verify-email");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all credentials.");
      setLoading(false);
      return;
    }

    try {
      // Set persistence based on "Remember Me" checkbox
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const userCredential = await login(email, password);
      
      if (userCredential.user && !userCredential.user.emailVerified) {
        setSuccess("Login successful. Redirecting to verification...");
        router.push("/verify-email");
      } else {
        router.push("/chat");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      // Friendly messages for Firebase errors
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Account temporarily locked due to too many failed attempts. Please try again later.");
      } else {
        setError(err.message || "An unexpected authentication error occurred.");
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await googleLogin();
      router.push("/chat");
    } catch (err: any) {
      console.error("Google authentication failed:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Failed to sign in with Google. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* 2-Column Desktop View: Left (Branding & Features Show) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex border-r border-slate-800">
        {/* Glow Effects */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            EXPEND<span className="text-emerald-400">MORE</span>
          </span>
        </div>

        {/* Animated Feature Visual (Mock Dashboard UI) */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="mb-6 rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 w-fit">
            WhatsApp Business API Gateway
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Scale Customer Success with Official WhatsApp API
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Empower your support team with automated workspace onboarding, unified chats, CRM integrations, and massive broadcast delivery.
          </p>

          {/* Interactive Metric Widgets */}
          <div className="space-y-4">
            {/* Widget 1 */}
            <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4 border border-slate-800 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Official Gateway</h4>
                  <p className="text-xs text-slate-500">Auto-connecting Meta Cloud API</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Connected
              </div>
            </div>

            {/* Widget 2 */}
            <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4 border border-slate-800 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Campaign Read Rates</h4>
                  <p className="text-xs text-slate-500">Realtime delivery analytical metrics</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-white">98.4%</span>
                <p className="text-[10px] text-blue-400">+12% vs last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} ExpendMore Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Multi-Tenant Architecture
          </span>
        </div>
      </div>

      {/* Right Column (Sign-In Card UI) */}
      <div className="relative flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 sm:px-12 lg:px-20 bg-slate-950">
        <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-emerald-500/5 blur-[90px]" />

        <div className="mx-auto w-full max-w-md">
          {/* Header info */}
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/20 border border-emerald-500/30">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                EXPEND<span className="text-emerald-400">MORE</span>
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Access your workspace and WhatsApp campaigns.
            </p>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-500/10 p-4 border border-red-500/20 text-sm text-red-400 animate-fade-in">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 text-sm text-emerald-400 animate-fade-in">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Business Email
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 py-3 pl-10 pr-12 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 accent-emerald-500"
                />
                <span className="text-xs text-slate-400 font-medium">Remember me on this browser</span>
              </label>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In to Workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-4 py-3 text-sm font-medium text-white transition-all focus:outline-none disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : (
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.48 0-6.3-2.82-6.3-6.3s2.82-6.3 6.3-6.3c1.71 0 3.216.672 4.32 1.77l3.204-3.202C18.6 1.83 15.65 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.12 0 10.87-4.29 10.87-11.085 0-.585-.052-1.155-.152-1.68H12.24Z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Back link */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Start 14-day free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
