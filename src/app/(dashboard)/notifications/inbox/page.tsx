"use client";

import React, { useMemo, useState } from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Bell, ShieldCheck, Mail, Info, X } from "lucide-react";

type InboxFilter = "all" | "unread" | "system" | "billing" | "security";

export default function AlertsInboxPage() {
  const { addToast } = useToast();
  const { notifications, retryFailedNotification } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<InboxFilter>("all");

  const filteredNotifs = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === "unread") return n.status === "queued" || n.status === "sending";
      if (activeFilter === "system") return n.category === "updates";
      if (activeFilter === "billing") return n.category === "billing";
      if (activeFilter === "security") return n.category === "security";
      return true;
    });
  }, [notifications, activeFilter]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Alerts Inbox
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review transactional notifications, inspect system updates alerts, and manage incoming activity feed.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <Card className="p-4 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-1 text-left font-sans">
          <span className="text-[9px] uppercase font-bold text-on-surface-variant/50 tracking-wider px-2.5 pb-2 border-b border-brand-border select-none">
            Filter Alerts
          </span>
          {(["all", "unread", "system", "billing", "security"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-bold text-left capitalize transition-colors duration-150 cursor-pointer ${
                activeFilter === filter
                  ? "bg-brand-slate text-brand-navy dark:bg-zinc-900/60 dark:text-foreground"
                  : "text-on-surface-variant/80 hover:text-brand-navy hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10 dark:hover:text-foreground"
              }`}
            >
              <Bell className="h-4 w-4 shrink-0 text-on-surface-variant/60" />
              <span>{filter}</span>
            </button>
          ))}
        </Card>

        {/* Alerts feed list */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left font-sans">
            <div className="divide-y divide-brand-border">
              {filteredNotifs.map((n) => (
                <div key={n.id} className="p-4 flex items-start gap-4 bg-white dark:bg-zinc-900/10">
                  <span className="p-2 bg-brand-slate border border-brand-border rounded-xl shrink-0 mt-0.5 select-none">
                    <Info className="h-4 w-4 text-brand-sky" />
                  </span>
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-bold gap-4">
                      <span className="text-brand-navy dark:text-foreground truncate">
                        {n.title}
                      </span>
                      <span className={`text-[9px] border px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                        n.status === "delivered" ? "bg-emerald-50 text-brand-green border-emerald-200" : "bg-red-50 text-error border-red-200"
                      }`}>
                        {n.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant/80 font-medium leading-relaxed mt-0.5">
                      {n.message}
                    </p>
                    {n.errorMessage && (
                      <span className="text-[9px] font-mono text-error font-semibold mt-1 block">
                        Error logs: {n.errorMessage}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredNotifs.length === 0 && (
                <div className="p-12 text-center text-xs text-on-surface-variant select-none">
                  Inbox empty. No notifications recorded under this tab.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
