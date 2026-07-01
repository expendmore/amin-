"use client";

import React from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import { ListOrdered, CheckCircle2 } from "lucide-react";

export default function QueueManagerPage() {
  const { jobs } = useAdmin();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Background Queue & Worker Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor background jobs execution pipeline, track active workers capacity, and check retry rules limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <ListOrdered className="h-4.5 w-4.5 text-brand-sky" />
            Background Jobs Logs Queue
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {jobs.map((j) => (
              <div
                key={j.id}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {j.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/80 font-semibold uppercase">
                    Worker: {j.workerType} • Status: {j.status} • Attempts: {j.attempts}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
