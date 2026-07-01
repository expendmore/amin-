"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { LineChart, ShieldCheck } from "lucide-react";

export default function ObservabilityAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Observability Analytics & Trends
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze infrastructure failure trends, evaluate peak usage hours, and audit top error triggers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Peak load */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Peak Traffic Hours
            </h3>
            <LineChart className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            14:00 - 16:00 UTC
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Based on active webhooks callback dispatches
          </span>
        </Card>

        {/* Failure Trend */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              System MTTR
            </h3>
            <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            4.2 mins
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Mean Time To Resolution of resolved incidents
          </span>
        </Card>
      </div>
    </div>
  );
}
