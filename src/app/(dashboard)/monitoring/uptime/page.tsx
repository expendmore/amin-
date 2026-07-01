"use client";

import React from "react";
import { useMonitoring } from "@/store/use-monitoring";
import Card from "@/components/ui/Card";
import { ShieldCheck } from "lucide-react";

export default function UptimeDashboardPage() {
  const { uptimeChecks } = useMonitoring();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Uptime & Availability Metrics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor historical uptime levels, review active availability checks timelines, and check response times.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Availability stats */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <ShieldCheck className="h-4.5 w-4.5 text-brand-sky" />
            Core services availability checklist
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {uptimeChecks.map((it) => (
              <div
                key={it.serviceId}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 font-sans text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    {it.serviceName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Avg Response Time: {it.avgResponseTimeMs}ms
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-brand-green shrink-0">
                  {it.availabilityPercent}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
