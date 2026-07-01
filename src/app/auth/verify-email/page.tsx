import React from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="text-center select-none">
        <h2 className="text-lg font-bold text-brand-navy dark:text-foreground">
          Verify Email
        </h2>
        <p className="text-xs text-on-surface-variant/80 font-medium mt-1">
          Activation link dispatched
        </p>
      </div>

      <span className="p-3 bg-brand-green/10 text-brand-green rounded-full border border-brand-green/20 animate-pulse">
        <Mail className="h-6 w-6" />
      </span>

      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
        We have sent a verification link to your registered email address. Please click it to activate your ExpendMore workspace.
      </p>

      <Link
        href="/auth/sign-in"
        className="w-full h-10 px-4 text-xs font-semibold rounded-lg bg-brand-navy dark:bg-white text-white dark:text-brand-navy hover:opacity-90 transition-all duration-150 flex items-center justify-center gap-1.5 focus:outline-none"
      >
        <span>Proceed to Sign In</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
