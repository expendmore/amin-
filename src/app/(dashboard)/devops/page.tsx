"use client";

import React from "react";
import { useDevops } from "@/store/use-devops";
import Card from "@/components/ui/Card";
import { Compass, ShieldCheck, Activity } from "lucide-react";

export default function DevopsDashboardPage() {
  const { environments, deployments } = useDevops();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            DevOps Console Overview
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor environment variables lists, verify automated build deployments histories, and check production health.
          </p>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latest version */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Production Version</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              v1.2.0
            </span>
          </div>
          <ShieldCheck className="h-5 w-5 text-brand-green shrink-0" />
        </Card>

        {/* Deployments count */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Completed Builds</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {deployments.length} runs
            </span>
          </div>
          <Compass className="h-5 w-5 text-brand-sky shrink-0" />
        </Card>

        {/* Environments */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Active Environments</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {environments.length} clusters
            </span>
          </div>
          <Activity className="h-5 w-5 text-purple-500 shrink-0" />
        </Card>
      </div>
    </div>
  );
}
