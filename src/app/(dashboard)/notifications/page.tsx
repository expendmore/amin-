"use client";

import React, { useMemo } from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import { Send, Eye, ShieldCheck, Mail } from "lucide-react";

export default function NotificationDashboardPage() {
  const { notifications } = useNotifications();

  const stats = useMemo(() => {
    let sentCount = 0;
    let deliveredCount = 0;
    let failedCount = 0;
    let queuedCount = 0;

    notifications.forEach((n) => {
      if (n.status === "delivered" || n.status === "opened" || n.status === "clicked") {
        sentCount++;
        deliveredCount++;
      } else if (n.status === "failed") {
        failedCount++;
      } else if (n.status === "queued" || n.status === "sending") {
        queuedCount++;
      }
    });

    const total = notifications.length || 1;
    const engagementRate = Math.round((deliveredCount / total) * 100);

    return {
      sentCount,
      deliveredCount,
      failedCount,
      queuedCount,
      engagementRate
    };
  }, [notifications]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Notification Dashboard
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor communication channels telemetry, audit delivery rates, and track audience engagement ratios.
          </p>
        </div>
      </div>

      {/* Stats Grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sent Today */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Sent Today</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.sentCount} dispatches
            </span>
          </div>
          <Send className="h-5 w-5 text-brand-sky shrink-0" />
        </Card>

        {/* Delivered */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Delivered</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.deliveredCount} receipts
            </span>
          </div>
          <ShieldCheck className="h-5 w-5 text-brand-green shrink-0" />
        </Card>

        {/* Failed */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Failed</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.failedCount} events
            </span>
          </div>
          <Mail className="h-5 w-5 text-error shrink-0" />
        </Card>

        {/* Engagement Rate */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Engagement Rate</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.engagementRate}%
            </span>
          </div>
          <Eye className="h-5 w-5 text-purple-500 shrink-0" />
        </Card>
      </div>
    </div>
  );
}
