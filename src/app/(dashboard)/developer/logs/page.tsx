"use client";

import React from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import { ListOrdered } from "lucide-react";

export default function ApiLogsPage() {
  const { logs } = useDeveloper();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            API Request Logs
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Trace real-time HTTP requests, monitor path routes latencies, and check response statuses.
          </p>
        </div>
      </div>

      {/* Logs list */}
      <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left font-sans">
        <div className="divide-y divide-brand-border">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10">
              <div className="flex items-start gap-3.5 min-w-0">
                <ListOrdered className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-navy dark:text-foreground font-mono">
                      {log.method} {log.path}
                    </span>
                    <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 text-on-surface-variant/80 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                      {log.latencyMs}ms
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/80 font-semibold mt-0.5 font-mono">
                    IP Address: {log.ipAddress} • Logged: {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <span className={`text-xs font-mono font-bold border px-1.5 py-0.5 rounded ${
                log.statusCode === 200 ? "bg-emerald-50 text-brand-green border-emerald-200" : "bg-red-50 text-error border-red-200"
              }`}>
                {log.statusCode}
              </span>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="p-12 text-center text-xs text-on-surface-variant select-none">
              No API requests currently logged.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
