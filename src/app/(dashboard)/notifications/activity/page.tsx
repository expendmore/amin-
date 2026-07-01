"use client";

import React from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import { History, Info } from "lucide-react";

export default function ActivityTimelinePage() {
  const { events } = useNotifications();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Activity Timeline Logs
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor real-time communication events logs, trace webhook alerts dispatches, and audit connection timeouts.
          </p>
        </div>
      </div>

      {/* Events timeline lists */}
      <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left font-sans">
        <div className="divide-y divide-brand-border">
          {events.map((evt) => (
            <div key={evt.id} className="p-4 flex items-start gap-3 bg-white dark:bg-zinc-900/10">
              <History className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold gap-4">
                  <span className="text-brand-navy dark:text-foreground">
                    {evt.event}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/60 font-semibold shrink-0">
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant/80 font-semibold mt-0.5">
                  Notification ID: {evt.notificationId || "N/A"} • Channel: {evt.channel || "system"}
                </span>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="p-12 text-center text-xs text-on-surface-variant select-none">
              No timeline events traced in history.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
