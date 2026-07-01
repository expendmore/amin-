"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import AdminServiceNav from "@/components/admin/AdminServiceNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-slate dark:bg-zinc-950 font-sans text-brand-navy dark:text-foreground transition-colors">
      {/* Top Banner indicating Admin Mode */}
      <div className="h-10 w-full bg-destructive text-white flex items-center justify-between px-6 text-xs font-bold select-none shrink-0">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4.5 w-4.5" />
          <span>System Administration Dashboard (Superuser Mode)</span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1 hover:underline text-white/90"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to workspace</span>
        </Link>
      </div>

      {/* Main Admin Console Area */}
      <div className="flex-1 flex h-[calc(100vh-40px)] w-full overflow-hidden">
        {/* Left Sub-sidebar navigation */}
        <AdminServiceNav className="hidden md:flex" />

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto bg-brand-slate dark:bg-zinc-950/20 p-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
