"use client";

import React from "react";
import { useQa } from "@/store/use-qa";
import Card from "@/components/ui/Card";
import { Play, CheckCircle, AlertTriangle } from "lucide-react";

export default function QaDashboardPage() {
  const { suites, bugs } = useQa();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            QA Command Center Overview
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze code test coverage ratios, track release gate status checkouts, and view active critical bugs.
          </p>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pass rate */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Avg Pass Rate Ratio</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              100%
            </span>
          </div>
          <CheckCircle className="h-5 w-5 text-brand-green shrink-0" />
        </Card>

        {/* Coverage */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Overall Code Coverage</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              92.4%
            </span>
          </div>
          <Play className="h-5 w-5 text-brand-sky shrink-0 animate-none" />
        </Card>

        {/* Active Bugs */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Active Bug Backlog</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {bugs.filter(b => b.status === "open").length} open bugs
            </span>
          </div>
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
        </Card>
      </div>
    </div>
  );
}
