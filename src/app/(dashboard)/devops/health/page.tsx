"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { ClipboardCheck } from "lucide-react";

export default function HealthPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Infrastructure Health Status
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review live active system connection health checks indicators, check db read replica status, and verify cache pools.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection logs */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <ClipboardCheck className="h-4.5 w-4.5 text-brand-sky" />
            Infrastructure services connectivity checks
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {([
              { system: "PostgreSQL Database Main Instance", status: "Healthy" },
              { system: "Background Queue Redis Pool", status: "Healthy" },
              { system: "Object Storage CDN Buckets", status: "Healthy" }
            ]).map((it) => (
              <div
                key={it.system}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <span className="text-xs font-bold text-brand-navy dark:text-foreground font-sans">
                  {it.system}
                </span>

                <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 font-sans">
                  {it.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
