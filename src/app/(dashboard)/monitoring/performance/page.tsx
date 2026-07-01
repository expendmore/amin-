"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Activity, ShieldCheck, Cpu } from "lucide-react";

export default function PerformanceDashboardPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Performance & Latency Profiler
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze database query latency, monitor server memory allocations, and evaluate page load speeds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core latency */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Avg Page Load Speed
            </h3>
            <Cpu className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            0.8s
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            FCP (First Contentful Paint) benchmark
          </span>
        </Card>

        {/* Slow queries */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Database Queries Delay
            </h3>
            <Activity className="h-4.5 w-4.5 text-purple-500" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            12ms
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Target p95 latency limit: 20ms
          </span>
        </Card>

        {/* Memory status */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Server Memory utilization
            </h3>
            <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            48%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Steady allocation below threshold guidelines
          </span>
        </Card>
      </div>
    </div>
  );
}
