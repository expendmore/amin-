"use client";

import React from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import { Activity } from "lucide-react";

export default function ApiRateLimitsPage() {
  const { limits } = useDeveloper();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            API Quota & Rate Limits
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review workspace API execution quotas limits, inspect daily dispatches counts, and trace throttling alerts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Limits breakdown */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <Activity className="h-4.5 w-4.5 text-brand-sky" />
            Workspace API Limits Status
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {limits.map((l) => {
              const ratio = Math.round((l.quotaUsed / l.quotaMax) * 100);
              return (
                <div key={l.key} className="p-4 flex flex-col gap-2 bg-white dark:bg-zinc-900/10 text-left font-sans">
                  <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                    <span className="text-brand-navy dark:text-foreground">{l.name}</span>
                    <span>{l.quotaUsed} / {l.quotaMax} ({ratio}%)</span>
                  </div>
                  <div className="w-full bg-brand-slate h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-sky rounded-full" style={{ width: `${ratio}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
