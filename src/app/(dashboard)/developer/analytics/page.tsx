"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { LineChart, Send, Eye, ShieldCheck } from "lucide-react";

export default function DeveloperAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Developer Analytics & Insights
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze API endpoint latency trends, compare top request targets, and check success rates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Latency */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Avg API Latency
            </h3>
            <LineChart className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            112ms
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Target p99 latency target: 140ms
          </span>
        </Card>

        {/* Success Rate */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Success Rate (HTTP 200)
            </h3>
            <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            99.8%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Across registered sandbox & production tokens
          </span>
        </Card>

        {/* Calls Today */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              API Requests (Today)
            </h3>
            <Send className="h-4.5 w-4.5 text-purple-500" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            890 calls
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Quota limit: 10,000 requests max
          </span>
        </Card>
      </div>
    </div>
  );
}
