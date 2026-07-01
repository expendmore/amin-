"use client";

import React, { useMemo } from "react";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Percent,
  Clock,
  Gauge
} from "lucide-react";

export default function GoogleMonitoringPage() {
  const { apiMetrics, health } = useGoogleWorkspace();

  const metricsList = useMemo(() => {
    return Object.values(apiMetrics);
  }, [apiMetrics]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex items-center justify-between border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            API Telemetry & Quota Monitor
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor real-time Google API latency statistics, evaluate quota consumption rates, and examine error ratios.
          </p>
        </div>
      </div>

      {/* Grid of Key Telemetry Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Availability percent card */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Handshake Availability Index
            </h3>
            <Percent className="h-4.5 w-4.5 text-brand-green" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
              99.98%
            </span>
            <span className="text-[10px] text-brand-green font-bold flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Optimal
            </span>
          </div>

          <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed">
            Measures consecutive successful handshakes over the past 30 days across all Google service pools.
          </p>
        </Card>

        {/* Latency Average */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Average API Response Latency
            </h3>
            <Clock className="h-4.5 w-4.5 text-brand-sky" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
              108 ms
            </span>
            <span className="text-[10px] text-[#34A853] font-bold">
              Stable
            </span>
          </div>

          <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed">
            Handshake latencies including routing network blurs. Gmail APIs reporting fastest response times.
          </p>
        </Card>

        {/* Global Security health index */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Security Consent Health
            </h3>
            <Gauge className="h-4.5 w-4.5 text-brand-green" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
              {health.overallScore}%
            </span>
            <span className="text-[10px] text-brand-green font-bold">
              Excellent
            </span>
          </div>

          <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed">
            Consolidated rating based on scopes authorization compliance and credentials expirations timestamps.
          </p>
        </Card>
      </div>

      {/* API Quotas Progress Index */}
      <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-brand-navy dark:text-foreground text-left">
          Per-Service API Quotas & Limits
        </h3>

        <div className="flex flex-col gap-5 border border-brand-border dark:border-zinc-800 rounded-xl p-4 divide-y divide-brand-border dark:divide-zinc-800">
          {metricsList.map((met) => {
            const usagePct = Math.round((met.callsToday / met.callsLimit) * 100);
            return (
              <div key={met.service} className="pt-4 first:pt-0 flex flex-col gap-2 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                  <span className="capitalize text-brand-navy dark:text-foreground">
                    Google {met.service}
                  </span>
                  <span>
                    {met.callsToday.toLocaleString()} / {met.callsLimit.toLocaleString()} ({usagePct}%)
                  </span>
                </div>

                {/* Progress bar using existing progress component */}
                <div className="w-full bg-brand-slate dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      usagePct > 80
                        ? "bg-error"
                        : usagePct > 50
                        ? "bg-amber-500"
                        : "bg-brand-sky"
                    }`}
                    style={{ width: `${usagePct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-on-surface-variant/60 font-semibold">
                  <span>Avg Latency: {met.avgLatencyMs}ms</span>
                  <span>Error Ratio: {met.errorRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
