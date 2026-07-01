"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { LineChart, Cpu, ShieldCheck } from "lucide-react";

export default function QaAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            QA Metrics Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze historical test pass rates curves, track code coverage trends, and review regression timelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pass rate */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Avg Pass Rate
            </h3>
            <LineChart className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            99.8%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Calculated across all integration & e2e runs
          </span>
        </Card>

        {/* Coverage Trend */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Coverage Trend
            </h3>
            <Cpu className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            +2.4%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Coverage growth trend since past month
          </span>
        </Card>
      </div>
    </div>
  );
}
