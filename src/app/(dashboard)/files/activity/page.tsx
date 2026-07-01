"use client";

import React from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import { Activity, Clock } from "lucide-react";

export default function ActivityCenterPage() {
  const { activities } = useFiles();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Activity Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Track real-time workspace files modifications, uploads, sharing creations, and deletions.
          </p>
        </div>
      </div>

      {/* Activity list */}
      <Card className="border-brand-border bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="divide-y divide-brand-border">
          {activities.map((act) => (
            <div key={act.id} className="p-4 flex items-start gap-3.5 text-left font-sans">
              <Activity className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold gap-4">
                  <span className="text-brand-navy dark:text-foreground">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/60 font-semibold shrink-0">
                    {new Date(act.timestamp).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant/75 font-semibold capitalize">
                  Event type: {act.type}
                </span>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="p-12 text-center text-xs text-on-surface-variant select-none">
              No folder or files activities listed.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
