"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { AlertTriangle } from "lucide-react";

export default function ErrorTrackingPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Crash Center & Exception Logs
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review unhandled application exceptions, examine stacktraces error events, and search crash trends logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Errors list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <AlertTriangle className="h-4.5 w-4.5 text-brand-sky" />
            Unhandled client/server exceptions logs
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {([
              { message: "Prerender compile URL parameters mismatch", origin: "supabase-server.ts", count: 2, severity: "warning" }
            ]).map((it) => (
              <div
                key={it.message}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    {it.message}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-mono">
                    Origin file: {it.origin} • Traced counts: {it.count} occurrences
                  </span>
                </div>

                <span className="text-[9px] bg-yellow-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                  {it.severity}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
