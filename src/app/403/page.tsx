"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, MessageSquare, ShieldCheck } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-red-500/10 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />

      <div className="w-full max-w-md text-center space-y-8 relative z-10">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-500 animate-pulse">
            <ShieldAlert className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-center items-center gap-1.5 text-xs font-semibold tracking-widest text-red-400 uppercase">
            <span>HTTP Status Code 403</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Access Denied
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            You do not have the required corporate role or security clearance to view this workspace directory. Please contact your system administrator.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/chat"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-3 text-sm font-bold text-white transition-colors focus:outline-none"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to Workspace
          </Link>
          
          <Link
            href="mailto:support@expendmore.ai"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors focus:outline-none"
          >
            <MessageSquare className="h-4.5 w-4.5" />
            Request Admin Approval
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-900 flex justify-between text-[11px] text-slate-500">
          <span>&copy; {new Date().getFullYear()} ExpendMore Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-red-500" /> Secure Directory Guard
          </span>
        </div>
      </div>
    </div>
  );
}
