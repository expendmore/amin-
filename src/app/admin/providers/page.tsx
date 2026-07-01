"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Cpu, CheckCircle2 } from "lucide-react";

export default function AIProvidersControlPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Provider Control
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor API endpoints health, review model availability scopes, and configure failover limits rules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection logs */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Connected AI Models Gateway
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {([
              { provider: "OpenAI", model: "gpt-4o", latency: "140ms" },
              { provider: "Anthropic", model: "claude-3-5-sonnet", latency: "190ms" },
              { provider: "Google Gemini", model: "gemini-1.5-pro", latency: "160ms" }
            ]).map((it) => (
              <div
                key={it.model}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    {it.provider} - {it.model}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/80 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-brand-green" />
                    Online • Average Latency: {it.latency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
