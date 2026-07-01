"use client";

import React, { useMemo } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import AIStatusBadge from "@/components/ai/AIStatusBadge";
import { Activity, ShieldAlert, Cpu, Heart } from "lucide-react";

export default function AIHealthMonitoringPage() {
  const { healthHistory, providers } = useAIProvider();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Endpoint Health & Availability
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review latency historical records, inspect endpoint availability rates, and check error ratios limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Availability percent card */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              API Channel Availability
            </h3>
            <Heart className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            99.94%
          </span>
          <span className="text-[10px] text-brand-green font-bold">
            All endpoints operating nominally
          </span>
        </Card>

        {/* Latency average */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Avg Handshake Speed
            </h3>
            <Activity className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            135 ms
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Including Groq LPU hyper-speeds
          </span>
        </Card>

        {/* Global Error Rates */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Global Connection Error Rate
            </h3>
            <ShieldAlert className="h-4.5 w-4.5 text-error" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            0.02%
          </span>
          <span className="text-[10px] text-[#34A853] font-bold">
            Well below 1% threshold limit
          </span>
        </Card>
      </div>

      {/* Provider Details list */}
      <Card className="border-brand-border bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-slate/85 dark:bg-zinc-900 border-b border-brand-border text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3.5 pl-5">Provider Channel</th>
                <th className="p-3.5">Status Pill</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5">Availability Rate</th>
                <th className="p-3.5">Error Ratio</th>
                <th className="p-3.5 pr-5 text-right">API Quota Hits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {healthHistory.map((h, idx) => {
                const prov = providers.find((p) => p.id === h.providerId);
                return (
                  <tr key={idx} className="hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10 font-medium text-brand-navy dark:text-foreground">
                    <td className="p-3.5 pl-5 font-bold capitalize">
                      {prov?.name || h.providerId}
                    </td>
                    <td className="p-3.5">
                      <AIStatusBadge status={prov?.status || "disconnected"} />
                    </td>
                    <td className="p-3.5 font-bold">
                      {h.latencyMs} ms
                    </td>
                    <td className="p-3.5 text-brand-green font-bold">
                      {h.availability.toFixed(2)}%
                    </td>
                    <td className="p-3.5 text-error">
                      {h.errorRate.toFixed(2)}%
                    </td>
                    <td className="p-3.5 pr-5 text-right text-on-surface-variant/80 font-bold">
                      {h.rateLimitHits} alerts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
