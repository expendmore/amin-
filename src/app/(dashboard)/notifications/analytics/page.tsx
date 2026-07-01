"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { LineChart, Send, Eye, ShieldCheck } from "lucide-react";

export default function NotificationsAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Engagement Insights & Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review communications click rate performance, audit delivery ratios, and compare top channel outputs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Delivery Rate */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Avg Delivery Success
            </h3>
            <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            99.2%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Across email, whatsapp, & push dispatches
          </span>
        </Card>

        {/* Open Rate */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Avg Open Receipt Rate
            </h3>
            <Eye className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            62.8%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Campaign open confirmation rate
          </span>
        </Card>

        {/* Channels compared */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Avg Click Rate
            </h3>
            <LineChart className="h-4.5 w-4.5 text-purple-500" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            18.4%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            CTR on dynamic payload buttons
          </span>
        </Card>
      </div>
    </div>
  );
}
