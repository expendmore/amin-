"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { BarChart3, TrendingUp, DollarSign, Percent } from "lucide-react";

export default function BillingAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Billing & Revenue Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze monthly recurring revenue MRR, inspect account growth metrics, and track average pricing telemetry.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MRR */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Monthly Recurring Revenue (MRR)
            </h3>
            <DollarSign className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            $4,900 USD
          </span>
          <span className="text-[10px] text-brand-green font-bold flex items-center gap-0.5">
            <TrendingUp className="h-3.5 w-3.5" />
            +12.4% vs last month
          </span>
        </Card>

        {/* ARR */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Annual Recurring Revenue (ARR)
            </h3>
            <DollarSign className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            $58,800 USD
          </span>
          <span className="text-[10px] text-brand-sky font-bold flex items-center gap-0.5">
            +18.2% projected ARR growth
          </span>
        </Card>

        {/* Churn Rate */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Logo Churn Rate
            </h3>
            <Percent className="h-4.5 w-4.5 text-error" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            2.4%
          </span>
          <span className="text-[10px] text-brand-green font-bold">
            Below 3.5% threshold ceiling
          </span>
        </Card>
      </div>

      {/* growth metrics */}
      <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-brand-navy dark:text-foreground text-left">
          Key Performance Ratios
        </h3>

        <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800 p-4">
          <div className="py-3 flex justify-between items-center text-xs font-bold text-on-surface-variant font-sans">
            <span className="text-brand-navy dark:text-foreground">Average Revenue Per User (ARPU)</span>
            <span>$49.00 USD</span>
          </div>

          <div className="py-3 flex justify-between items-center text-xs font-bold text-on-surface-variant font-sans">
            <span className="text-brand-navy dark:text-foreground">Customer Acquisition Cost (CAC)</span>
            <span>$120.00 USD</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
