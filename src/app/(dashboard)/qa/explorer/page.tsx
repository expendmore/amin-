"use client";

import React from "react";
import { useQa } from "@/store/use-qa";
import Card from "@/components/ui/Card";
import { Compass } from "lucide-react";

export default function TestExplorerPage() {
  const { testCases } = useQa();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Test Case Explorer
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Browse individual test assertions, filter cases by owner or suite, and inspect target durations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test cases database list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Compass className="h-4.5 w-4.5 text-brand-sky" />
            Individual Assertions Registry
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {testCases.map((tc) => (
              <div
                key={tc.id}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {tc.title}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Owner: {tc.owner} • Duration: {tc.durationMs}ms
                  </span>
                </div>

                <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 font-sans">
                  {tc.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
