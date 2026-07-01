"use client";

import React, { useMemo } from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Calendar, Trash } from "lucide-react";

export default function SchedulingCenterPage() {
  const { addToast } = useToast();
  const { notifications, cancelScheduledNotification } = useNotifications();

  const scheduled = useMemo(() => {
    return notifications.filter(n => n.status === "scheduled");
  }, [notifications]);

  const handleCancel = (id: string, name: string) => {
    cancelScheduledNotification(id);
    addToast(`Cancelled scheduled dispatch for "${name}"`, "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Scheduling Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor calendar timelines, review scheduled bulk deliveries, and cancel pending queues dispatches.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar queues */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <Calendar className="h-4.5 w-4.5 text-brand-sky" />
            Scheduled Dispatches List
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {scheduled.map((sch) => (
              <div
                key={sch.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {sch.title}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Target Channel: {sch.channel} • Target Time: {sch.scheduledTime ? new Date(sch.scheduledTime).toLocaleString() : "Undated"}
                  </span>
                </div>

                <Button
                  onClick={() => handleCancel(sch.id, sch.title)}
                  variant="outline"
                  size="xs"
                  className="font-bold border-red-200 text-error hover:bg-red-50 shrink-0"
                  leftIcon={<Trash className="h-3.5 w-3.5" />}
                >
                  Cancel
                </Button>
              </div>
            ))}

            {scheduled.length === 0 && (
              <span className="text-xs text-on-surface-variant/80 p-8 text-center font-medium block">
                No notification alerts currently scheduled in calendars timelines.
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
