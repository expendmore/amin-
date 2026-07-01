"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { History } from "lucide-react";

export default function ReleasesPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Release Notes & Versions History
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review deployment version releases tags history, audit breaking updates, and check milestone guidelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Releases logs */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <History className="h-4.5 w-4.5 text-brand-sky" />
            Official Release Logs Timeline
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {([
              { version: "v1.2.0", date: "June 27, 2026", note: "Model Context Protocol (MCP) server endpoints registry integration and client session managers." }
            ]).map((it) => (
              <div key={it.version} className="p-4 flex flex-col gap-2 bg-white dark:bg-zinc-900/10 text-left font-sans">
                <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
                  <span className="font-mono">{it.version}</span>
                  <span className="text-[10px] text-on-surface-variant/60 font-semibold">{it.date}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed mt-1">
                  {it.note}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
