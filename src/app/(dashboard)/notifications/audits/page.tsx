"use client";

import React from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import { ShieldCheck, Info } from "lucide-react";

export default function NotificationsAuditLogsPage() {
  const { audits } = useNotifications();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Security & Configuration Audits
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review timeline of changes made to notification templates, subscriber settings preferences, and routing rules.
          </p>
        </div>
      </div>

      {/* Audit logs lists */}
      <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left font-sans">
        <div className="divide-y divide-brand-border">
          {audits.map((log) => (
            <div key={log.id} className="p-4 flex items-start gap-3 bg-white dark:bg-zinc-900/10">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-green shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold gap-4">
                  <span className="text-brand-navy dark:text-foreground flex items-center gap-1.5">
                    {log.description}
                    <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 text-on-surface-variant/80 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                      {log.action.replace("_", " ")}
                    </span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant/60 font-semibold shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant/80 font-semibold mt-0.5">
                  Operator: {log.operator} • Target: {log.targetType} ({log.targetId})
                </span>
              </div>
            </div>
          ))}

          {audits.length === 0 && (
            <div className="p-12 text-center text-xs text-on-surface-variant select-none">
              No audit logs captured.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
