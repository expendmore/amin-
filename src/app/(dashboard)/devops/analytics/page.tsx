"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { LineChart, Cpu, ShieldCheck } from "lucide-react";

export default function DevOpsAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            DevOps Metrics & Frequencies
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze historical build compile durations, check deploy failure rates, and verify rollback ratios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Build Time */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Avg Build Compile Time
            </h3>
            <Cpu className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            38.4s
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Frontend next build target: under 45s
          </span>
        </Card>

        {/* Deploy success */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Deployment Success Rate
            </h3>
            <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            99.2%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Calculated across production hosting environments
          </span>
        </Card>

        {/* Deploy frequency */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Deployment Frequency
            </h3>
            <LineChart className="h-4.5 w-4.5 text-purple-500" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            12 runs / day
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Daily build release frequency indicators
          </span>
        </Card>
      </div>
    </div>
  );
}
