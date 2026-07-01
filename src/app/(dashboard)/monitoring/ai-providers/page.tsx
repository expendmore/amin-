"use client";

import React from "react";
import { useMonitoring } from "@/store/use-monitoring";
import Card from "@/components/ui/Card";
import { Sliders, CheckCircle2 } from "lucide-react";

export default function AiProvidersMonitoringPage() {
  const { providerMetrics } = useMonitoring();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Provider Monitoring
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review connection state for OpenAI, Claude, and Gemini endpoints, evaluate average latencies, and check cost budgets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection health */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Sliders className="h-4.5 w-4.5 text-brand-sky" />
            AI Models Gateway latency logs
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {providerMetrics.map((it) => (
              <div
                key={it.providerName}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    {it.providerName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    State: {it.healthStatus} • Cost: ${it.costAccumulated.toFixed(2)}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-brand-navy dark:text-foreground shrink-0">
                  {it.avgLatencyMs}ms
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
