"use client";

import React from "react";
import { useMonitoring } from "@/store/use-monitoring";
import Card from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";

export default function ApplicationMonitoringPage() {
  const { services } = useMonitoring();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Application Status Monitors
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review status index mappings for frontend deployment pods, API routers servers, and background crons.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            ExpendMore Host Services Registry
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {services.map((s) => (
              <div
                key={s.serviceName}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {s.serviceName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Last Health check: {new Date(s.lastChecked).toLocaleTimeString()}
                  </span>
                </div>

                <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
