"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Blocks, CheckCircle2 } from "lucide-react";

export default function IntegrationsControlPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            OAuth Integrations Control
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor client OAuth consent states, evaluate endpoints sync latency, and audit webhooks callbacks logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection logs */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            SaaS Connected Services Telemetry
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {([
              { name: "Google Workspace API", syncRate: "99.8%", status: "Optimal" },
              { name: "Microsoft 365 Graph", syncRate: "99.7%", status: "Optimal" }
            ]).map((it) => (
              <div
                key={it.name}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    {it.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/80 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-brand-green" />
                    Status: {it.status} • Callback Sync Rate: {it.syncRate}
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
