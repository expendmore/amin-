import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="text-center select-none">
        <h2 className="text-lg font-bold text-brand-navy dark:text-foreground">
          Access Denied
        </h2>
        <p className="text-xs text-on-surface-variant/80 font-medium mt-1">
          Insufficient workspace role clearance
        </p>
      </div>

      <span className="p-3 bg-red-500/10 text-danger rounded-full border border-red-500/20">
        <ShieldAlert className="h-6 w-6" />
      </span>

      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
        Your account role does not have the required permissions to view this directory, path, or administrative resource.
      </p>

      <Link
        href="/dashboard"
        className="w-full h-10 px-4 text-xs font-semibold rounded-lg bg-brand-navy dark:bg-white text-white dark:text-brand-navy hover:opacity-90 transition-all duration-150 flex items-center justify-center gap-1.5 focus:outline-none"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Workspace</span>
      </Link>
    </div>
  );
}
