"use client";

import React from "react";
import { useMonitoring } from "@/store/use-monitoring";
import Card from "@/components/ui/Card";
import { Terminal } from "lucide-react";

export default function LogsExplorerPage() {
  const { logs } = useMonitoring();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Infrastructure Logs Explorer
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Search application logs streams, examine backend connection payloads, and inspect worker queues.
          </p>
        </div>
      </div>

      {/* Logs stream list */}
      <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left font-sans">
        <div className="divide-y divide-brand-border">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex items-start gap-3 bg-white dark:bg-zinc-900/10 text-left font-sans">
              <Terminal className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold gap-4 font-sans">
                  <span className="text-brand-navy dark:text-foreground font-mono">
                    [{log.service}] {log.message}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/60 font-semibold shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant/80 font-semibold mt-0.5 font-sans">
                  Level: {log.level}
                </span>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="p-12 text-center text-xs text-on-surface-variant select-none">
              No live log streams recorded in session.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
