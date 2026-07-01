import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: June 26, 2026</p>
      </div>

      <hr className="border-border/45 relative z-10" />

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-zinc-300 relative z-10">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
          <p>
            We collect registration data (email, name) and usage metrics logs (tokens consumed, image tasks queued) necessary to enforce plan boundaries and handle Stripe billing transactions.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">2. Data Security</h2>
          <p>
            Your user files and conversation tables are strictly isolated via Row-Level Security policies inside Supabase. We do not sell or share private workspace data.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">3. Upstream Data Transfer</h2>
          <p>
            Prompts submitted to active models are processed by OpenAI/Anthropic APIs under their standard developer terms and are not used for public model training datasets.
          </p>
        </section>
      </div>
    </main>
  );
}
