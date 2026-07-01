import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 items-center justify-center p-6 relative overflow-hidden">
      {/* Background visual cues */}
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/5 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="w-full max-w-md text-center space-y-8 relative z-10">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            <AlertCircle className="h-10 w-10 animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-center items-center gap-1.5 text-xs font-semibold tracking-widest text-slate-500 uppercase">
            <span>HTTP Status Code 404</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Workspace Directory Not Found
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            The requested path does not exist, has been archived, or you may lack correct subtenant privileges to resolve it.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/chat"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors focus:outline-none"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Return to Workspace
          </Link>
          
          <Link
            href="mailto:support@expendmore.ai"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-3 text-sm font-bold text-white transition-colors focus:outline-none"
          >
            <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
            Support Helpdesk
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-900 text-[11px] text-slate-500">
          <span>&copy; {new Date().getFullYear()} ExpendMore Inc. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
