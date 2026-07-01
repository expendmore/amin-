"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Cpu } from "lucide-react";

export default function BuildLogsPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Build Output & Compiler Logs
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review compile warnings checklists, trace server builds stdout errors, and audit artifacts sizes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compiler logs */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Cpu className="h-4.5 w-4.5 text-brand-sky" />
            Build Terminal Output
          </h3>

          <pre className="p-4 bg-brand-slate dark:bg-zinc-900 rounded-xl text-[10px] font-mono text-brand-navy dark:text-foreground border border-brand-border min-h-[160px] overflow-x-auto select-all leading-relaxed font-sans select-none">
            {`▲ Next.js 15.5.19
Creating an optimized production build ...
✓ Compiled successfully in 27.6s
Linting and checking validity of types ...
Collecting page data ...
Prerendered page outputs checked.
Build completed successfully.`}
          </pre>
        </Card>
      </div>
    </div>
  );
}
