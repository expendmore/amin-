"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { updateProfile } from "firebase/auth";
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  GitBranch,
} from "lucide-react";



function SignupContent() {
  const router = useRouter();
  const { signup, googleLogin, sendVerificationEmail, isAuthenticated, user, loading: authLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect if already authenticated and verified
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.emailVerified) {
        router.push("/chat");
      } else {
        router.push("/verify-email");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Calculate password strength dynamically
  useEffect(() => {
    let score = 0;
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength(score);
  }, [password]);

  const validateEmail = (emailVal: string) => {
    // Basic format check only — all email providers allowed
    return !!(emailVal && emailVal.includes("@") && emailVal.includes("."));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // 1. Inputs Check
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // 2. Terms Check
    if (!acceptTerms) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      setLoading(false);
      return;
    }

    // 3. Basic Email Format Check
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // 4. Password Complexity Verification (At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must include at least one uppercase letter.");
      setLoading(false);
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must include at least one lowercase letter.");
      setLoading(false);
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must include at least one number.");
      setLoading(false);
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must include at least one special character.");
      setLoading(false);
      return;
    }

    // 5. Password Confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // 6. Firebase Signup
      const userCredential = await signup(email, password);
      
      // Update display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName,
        });

        // 7. Dispatch Firebase Email Verification
        await sendVerificationEmail();
        
        setSuccess("Account successfully created! Verification email sent.");
        router.push("/verify-email");
      }
    } catch (err: any) {
      console.error("Signup failed:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already registered.");
      } else {
        setError(err.message || "Onboarding failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await googleLogin();
      router.push("/chat");
    } catch (err: any) {
      console.error("Google authentication failed:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Failed to sign up with Google. Please try again.");
      }
      setLoading(false);
    }
  };

  // Get color and text for password strength indicator
  const getStrengthMeta = () => {
    if (passwordStrength <= 2) return { color: "bg-red-500", text: "Weak" };
    if (passwordStrength <= 4) return { color: "bg-orange-500", text: "Medium" };
    return { color: "bg-emerald-500", text: "Strong" };
  };

  const strengthMeta = getStrengthMeta();

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* 2-Column Desktop View: Left (Feature Show / Visuals) */}
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

        {/* Dynamic Feature Dashboard Graphic (CSS Visual) */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="mb-6 rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 w-fit flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            B2B Automation Builder
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Automate WhatsApp Campaigns & Bot Flows
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Create visual chat workflows, segment contacts, dispatch custom variables, and analyze message conversions in one shared panel.
          </p>

          {/* Flow Diagram CSS Graphic */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Campaign Flow Builder
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                Drafting
              </span>
            </div>

            {/* Simulated Flow Elements */}
            <div className="space-y-3">
              {/* Trigger */}
              <div className="flex items-center gap-3 rounded-lg bg-slate-900/80 p-3 border border-slate-800">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/20 text-[10px] text-blue-400 font-bold">
                  TR
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-semibold text-white">Inbound Message received</h5>
                  <p className="text-[10px] text-slate-500">Keyword matches "pricing"</p>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-start pl-6">
                <GitBranch className="h-4 w-4 text-slate-600 rotate-90" />
              </div>

              {/* Bot Action */}
              <div className="flex items-center gap-3 rounded-lg bg-emerald-950/20 p-3 border border-emerald-500/20">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/20 text-[10px] text-emerald-400 font-bold">
                  BOT
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-semibold text-white">Dispatch Interactive Menu</h5>
                  <p className="text-[10px] text-slate-400">Template: Pricing_Structure_B2B</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} ExpendMore Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> AES-256 Meta Cloud Security
          </span>
        </div>
      </div>

      {/* Right Column (Sign-Up Form Card UI) */}
      <div className="relative flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 sm:px-12 lg:px-20 bg-slate-950">
        <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-blue-500/5 blur-[90px]" />

        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/20 border border-emerald-500/30">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                EXPEND<span className="text-emerald-400">MORE</span>
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-500/10 p-4 border border-red-500/20 text-sm text-red-400 animate-fade-in">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-3 rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 text-sm text-emerald-400 animate-fade-in">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Signup Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Aditya Tiwari"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 disabled:opacity-50"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                Only corporate business emails accepted. Public domains are blocked.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Password complexity rules apply"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 disabled:opacity-50"
                />
              </div>
              {/* Password strength indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span>Password Strength:</span>
                    <span className="text-slate-200">{strengthMeta.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 border border-slate-850 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthMeta.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Accept Terms Checkbox */}
            <div className="flex items-center py-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={loading}
                  className="rounded mt-0.5 bg-slate-900 border-slate-800 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 accent-emerald-500"
                />
                <span className="text-[11px] text-slate-400 font-medium leading-tight">
                  I accept the{" "}
                  <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Signup submit button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Register Workspace Instance
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-500">Or sign up with</span>
            </div>
          </div>

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-4 py-2.5 text-sm font-medium text-white transition-all focus:outline-none disabled:opacity-50"
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
          <p className="mt-4 text-center text-sm text-slate-500">
            Already have a workspace?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign in to account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
