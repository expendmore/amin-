"use client";

import React, { useMemo } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import { LineChart, TrendingUp, Download, Percent } from "lucide-react";

export default function MarketplaceAnalyticsPage() {
  const { items } = useMarketplace();

  const ratios = useMemo(() => {
    let workflowDownloads = 0;
    let agentsDownloads = 0;
    let otherDownloads = 0;
    let totalDownloads = 0;

    items.forEach((it) => {
      totalDownloads += it.downloadsCount;
      if (it.category === "workflows") workflowDownloads += it.downloadsCount;
      else if (it.category === "agents") agentsDownloads += it.downloadsCount;
      else otherDownloads += it.downloadsCount;
    });

    const divisor = totalDownloads || 1;
    return {
      workflowPercent: Math.round((workflowDownloads / divisor) * 100),
      agentsPercent: Math.round((agentsDownloads / divisor) * 100),
      otherPercent: Math.round((otherDownloads / divisor) * 100)
    };
  }, [items]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Marketplace Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze templates installation telemetry, check conversion ratios, and inspect top category logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Workflows */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
            Workflows Share
          </h3>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {ratios.workflowPercent}%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Workflow recipes downloads
          </span>
        </Card>

        {/* Agents */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
            AI Agents Share
          </h3>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {ratios.agentsPercent}%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Autonomous agent blueprints
          </span>
        </Card>

        {/* Conversion */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
            Conversion Rate
          </h3>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            18.4%
          </span>
          <span className="text-[10px] text-brand-green font-bold flex items-center gap-0.5">
            <Percent className="h-3.5 w-3.5" />
            +2.5% vs average store conversion
          </span>
        </Card>
      </div>

      {/* utilization progress */}
      <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-brand-navy dark:text-foreground text-left">
          Downloads Share Breakdown
        </h3>

        <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800 p-4">
          <div className="py-3 flex flex-col gap-2 text-left font-sans">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
              <span className="text-brand-navy dark:text-foreground">Workflows Templates</span>
              <span>{ratios.workflowPercent}%</span>
            </div>
            <div className="w-full bg-brand-slate h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-sky rounded-full" style={{ width: `${ratios.workflowPercent}%` }} />
            </div>
          </div>

          <div className="py-3 flex flex-col gap-2 text-left font-sans">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
              <span className="text-brand-navy dark:text-foreground">AI Agents Blueprints</span>
              <span>{ratios.agentsPercent}%</span>
            </div>
            <div className="w-full bg-brand-slate h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-green rounded-full" style={{ width: `${ratios.agentsPercent}%` }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
