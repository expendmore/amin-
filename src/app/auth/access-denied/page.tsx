import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="text-center select-none">
        <h2 className="text-lg font-bold text-brand-navy dark:text-foreground">
          Blocked Area
        </h2>
        <p className="text-xs text-on-surface-variant/80 font-medium mt-1">
          Access is prohibited on this path
        </p>
      </div>

      <span className="p-3 bg-red-500/10 text-danger rounded-full border border-red-500/20">
        <ShieldCheck className="h-6 w-6" />
      </span>

      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
        This resource is restricted by RBAC rules or is currently deactivated by your organization administrator.
      </p>

      <Link
        href="/dashboard"
        className="w-full h-10 px-4 text-xs font-semibold rounded-lg bg-brand-navy dark:bg-white text-white dark:text-brand-navy hover:opacity-90 transition-all duration-150 flex items-center justify-center gap-1.5 focus:outline-none"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Safety</span>
      </Link>
    </div>
  );
}
