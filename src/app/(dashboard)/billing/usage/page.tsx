"use client";

import React, { useMemo } from "react";
import { useBilling } from "@/store/use-billing";
import Card from "@/components/ui/Card";
import { Gauge, Percent, BarChart3, Clock } from "lucide-react";

export default function UsageMeteringPage() {
  const { usage } = useBilling();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Usage Metering
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor real-time workspace consumption volumes, API metrics calls count, and bandwidth usage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Token runs */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              AI Tokens consumed
            </h3>
            <Gauge className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {usage.aiTokensCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Across active routing models
          </span>
        </Card>

        {/* Whatsapp messages */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              WhatsApp Broadcasts
            </h3>
            <Gauge className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {usage.whatsappMessagesSent.toLocaleString()} sent
          </span>
          <span className="text-[10px] text-brand-green font-bold">
            All nodes operating normally
          </span>
        </Card>

        {/* API calls */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Graph API Calls
            </h3>
            <Gauge className="h-4.5 w-4.5 text-purple-500" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {usage.apiCallsCount.toLocaleString()} calls
          </span>
          <span className="text-[10px] text-[#34A853] font-bold">
            99.9% uptime reliability
          </span>
        </Card>
      </div>

      {/* Progress Bars */}
      <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-brand-navy dark:text-foreground text-left">
          Workspace Resource Consumption limits
        </h3>

        <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800 p-4">
          {/* Runs */}
          <div className="py-3.5 first:pt-0 flex flex-col gap-2 text-left font-sans">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
              <span className="text-brand-navy dark:text-foreground">Workflow execution runs</span>
              <span>{usage.workflowRunsCount} / 2,000 runs (32.5%)</span>
            </div>
            <div className="w-full bg-brand-slate h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-sky rounded-full" style={{ width: "32.5%" }} />
            </div>
          </div>

          {/* Active members */}
          <div className="py-3.5 flex flex-col gap-2 text-left font-sans">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
              <span className="text-brand-navy dark:text-foreground">Workspace seats (users)</span>
              <span>{usage.activeUsersCount} / 10 seats (40%)</span>
            </div>
            <div className="w-full bg-brand-slate h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-green rounded-full" style={{ width: "40%" }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
