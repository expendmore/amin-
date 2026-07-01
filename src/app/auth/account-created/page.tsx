import React from "react";
import Link from "next/link";
import { UserCheck, ArrowRight } from "lucide-react";

export default function AccountCreatedPage() {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="text-center select-none">
        <h2 className="text-lg font-bold text-brand-navy dark:text-foreground">
          Account Created!
        </h2>
        <p className="text-xs text-on-surface-variant/80 font-medium mt-1">
          Welcome to the ExpendMore workspace
        </p>
      </div>

      <span className="p-3 bg-brand-green/10 text-brand-green rounded-full border border-brand-green/20 animate-bounce">
        <UserCheck className="h-6 w-6" />
      </span>

      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
        Your new administrator account and workspace are initialized. Let's get started with configuring multi-provider chat consoles.
      </p>

      <Link
        href="/dashboard"
        className="w-full h-10 px-4 text-xs font-semibold rounded-lg bg-brand-navy dark:bg-white text-white dark:text-brand-navy hover:opacity-90 transition-all duration-150 flex items-center justify-center gap-1.5 focus:outline-none"
      >
        <span>Get Started</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
