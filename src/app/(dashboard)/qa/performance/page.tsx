"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Cpu, Activity } from "lucide-react";

export default function PerformanceTestingPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Lighthouse & Web Vitals benchmarks
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review bundle sizes optimization logs, check API endpoints latency, and monitor Memory utilization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LCP */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Lighthouse Perf Score
            </h3>
            <Cpu className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            98 / 100
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Core Web Vitals target status: Passed
          </span>
        </Card>

        {/* JS Bundle */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              First Load JS Shared
            </h3>
            <Activity className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            102 kB
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Shared package bundles sizes index
          </span>
        </Card>
      </div>
    </div>
  );
}
