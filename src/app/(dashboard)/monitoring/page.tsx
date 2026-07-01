"use client";

import React from "react";
import { useMonitoring } from "@/store/use-monitoring";
import Card from "@/components/ui/Card";
import { Activity, ShieldCheck, Cpu } from "lucide-react";

export default function OperationsDashboardPage() {
  const { services, systemMetrics } = useMonitoring();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Operations & Health Dashboard
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review general infrastructure stats, inspect running hosting nodes, and evaluate memory utilization.
          </p>
        </div>
      </div>

      {/* KPI Stats grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU placeholder */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">CPU Core Utilization</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {systemMetrics.cpuPercent}%
            </span>
          </div>
          <Cpu className="h-5 w-5 text-brand-sky shrink-0 animate-none" />
        </Card>

        {/* Memory placeholder */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Memory Allocation</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {systemMetrics.ramPercent}%
            </span>
          </div>
          <Activity className="h-5 w-5 text-purple-500 shrink-0" />
        </Card>

        {/* Services Status */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Active Services Nodes</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {services.length} services
            </span>
          </div>
          <ShieldCheck className="h-5 w-5 text-brand-green shrink-0" />
        </Card>
      </div>
    </div>
  );
}
