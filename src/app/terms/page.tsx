import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-12 flex flex-col gap-6 bg-background text-foreground relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-brand-500/5 blur-[80px] pointer-events-none" />

      <Link 
        href="/" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors self-start relative z-10"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>

      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-xs text-muted-foreground">Last updated: June 26, 2026</p>
      </div>

      <hr className="border-border/45 relative z-10" />

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-zinc-300 relative z-10">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">1. Account Access and Security</h2>
          <p>
            By creating an account with ExpendMore, you agree to secure your credentials and maintain proper access permissions. You are responsible for all activities occurring under your workspace.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">2. Usage Credit and limits</h2>
          <p>
            Credits are issued daily for Free accounts. Model consumption rates are calculated based on complexity metrics. Abuse of model pipelines or attempts to bypass security boundaries will result in immediate termination.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">3. Liability limits</h2>
          <p>
            ExpendMore is provided "as is" without warranties. We are not liable for operational failures or billing anomalies arising from third-party provider outages.
          </p>
        </section>
      </div>
    </main>
  );
}
