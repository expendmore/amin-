"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OTPInput from "@/components/ui/OTPInput";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { ArrowLeft, KeyRound, AlertCircle } from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Timer countdown hook for resending codes
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      addToast("Please enter a complete 6-digit verification code.", "error");
      return;
    }

    setIsLoading(true);
    // Simulate OTP authorization
    setTimeout(() => {
      setIsLoading(false);
      addToast("OTP code authorized successfully!", "success");
      router.push("/auth/account-created");
    }, 1500);
  };

  const handleResend = () => {
    setCountdown(30);
    addToast("A new verification code has been sent to your device.", "info");
  };

  return (
    <div className="flex flex-col gap-6 items-center text-center w-full">
      <div className="text-center select-none">
        <h2 className="text-lg font-bold text-brand-navy dark:text-foreground">
          Enter Security Code
        </h2>
        <p className="text-xs text-on-surface-variant/80 font-medium mt-1">
          A 6-digit OTP code was sent to your email
        </p>
      </div>

      <span className="p-3 bg-brand-navy/5 text-on-surface-variant rounded-full border border-brand-border dark:border-border/50">
        <KeyRound className="h-6 w-6 text-on-surface-variant" />
      </span>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full items-center">
        {/* Reusable OTPInput primitive */}
        <OTPInput value={otp} onChange={setOtp} length={6} disabled={isLoading} />

        <div className="flex flex-col gap-2 w-full text-center">
          <Button type="submit" isLoading={isLoading} className="w-full" variant="primary">
            Verify Code
          </Button>

          {/* Resend trigger link */}
          <div className="text-[10px] md:text-xs font-semibold text-on-surface-variant select-none mt-1">
            Didn't receive the code?{" "}
            {countdown > 0 ? (
              <span className="text-brand-navy dark:text-foreground">Resend in {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-brand-sky hover:underline font-bold focus:outline-none cursor-pointer"
              >
                Resend Code
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Redirect back to Login */}
      <Link
        href="/auth/sign-in"
        className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground select-none transition-colors py-1.5 border border-brand-border dark:border-border rounded-lg bg-brand-slate dark:bg-zinc-800 w-full"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Sign In</span>
      </Link>
    </div>
  );
}
