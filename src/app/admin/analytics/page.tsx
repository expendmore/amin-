"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { LineChart, DollarSign, TrendingUp, Percent } from "lucide-react";

export default function PlatformAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Platform Growth & Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze monthly recurring revenue growth rates, track client churn telemetry, and evaluate feature usages ratios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MRR */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Total Platform MRR
            </h3>
            <DollarSign className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            $45,200 USD
          </span>
        </Card>

        {/* ARR */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Platform ARR
            </h3>
            <DollarSign className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            $542,400 USD
          </span>
        </Card>

        {/* Churn */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Logo Churn Rate
            </h3>
            <Percent className="h-4.5 w-4.5 text-error" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            1.8%
          </span>
        </Card>
      </div>
    </div>
  );
}
