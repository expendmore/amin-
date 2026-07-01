"use client";

import React from "react";
import { useDevops } from "@/store/use-devops";
import Card from "@/components/ui/Card";
import { Box } from "lucide-react";

export default function EnvironmentManagerPage() {
  const { environments } = useDevops();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Environment Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review active deployment environments clusters, manage domain mappings, and count config keys.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environments list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Box className="h-4.5 w-4.5 text-brand-sky" />
            Configured Hosting Environments
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {environments.map((it) => (
              <div
                key={it.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5">
                    {it.name}
                    <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 text-on-surface-variant/80 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                      {it.type}
                    </span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-mono truncate block mt-1">
                    URL: {it.url}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/70 font-semibold block mt-0.5">
                    Config Variables count: {it.variablesCount} variables
                  </span>
                </div>

                <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                  {it.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
