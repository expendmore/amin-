import React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export default function SessionExpiredPage() {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="text-center select-none">
        <h2 className="text-lg font-bold text-brand-navy dark:text-foreground">
          Session Expired
        </h2>
        <p className="text-xs text-on-surface-variant/80 font-medium mt-1">
          Workspace login timed out
        </p>
      </div>

      <span className="p-3 bg-brand-navy/5 text-on-surface-variant rounded-full border border-brand-border dark:border-border/50">
        <Clock className="h-6 w-6 text-on-surface-variant" />
      </span>

      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
        Your active login session has timed out or is no longer valid. Please sign in again to resume automations.
      </p>

      <Link
        href="/auth/sign-in"
        className="w-full h-10 px-4 text-xs font-semibold rounded-lg bg-brand-navy dark:bg-white text-white dark:text-brand-navy hover:opacity-90 transition-all duration-150 flex items-center justify-center gap-1.5 focus:outline-none"
      >
        <span>Sign In Again</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
