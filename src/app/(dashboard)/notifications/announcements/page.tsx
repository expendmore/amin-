"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Bell, CheckCircle2 } from "lucide-react";

export default function AnnouncementCenterPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Announcements & Release Notes
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review platform maintenance windows logs, inspect feature releases, and check security updates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <Bell className="h-4.5 w-4.5 text-brand-sky" />
            Platform Alerts Log
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800 p-4 bg-white dark:bg-zinc-900/10">
            <div className="py-3 flex flex-col gap-2 text-left font-sans">
              <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
                <span>Next.js 15 Migration & Optimization Update</span>
                <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed mt-1">
                Completed Next.js build compilation. All client and server components are fully typed and optimized.
              </p>
              <span className="text-[8px] text-on-surface-variant/50 font-bold mt-1">
                Published on June 27, 2026
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
