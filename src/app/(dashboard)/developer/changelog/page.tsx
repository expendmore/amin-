"use client";

import React from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import { History } from "lucide-react";

export default function ChangelogPage() {
  const { changelogs } = useDeveloper();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Developer Release Changelog
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review timeline of platform upgrades releases, breaking changes warnings, and SDK package migrations.
          </p>
        </div>
      </div>

      {/* Revisions logs */}
      <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left font-sans">
        <div className="divide-y divide-brand-border">
          {changelogs.map((item) => (
            <div key={item.version} className="p-4 flex items-start gap-3 bg-white dark:bg-zinc-900/10 text-left">
              <History className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold gap-4">
                  <span className="text-brand-navy dark:text-foreground flex items-center gap-2">
                    {item.title}
                    <span className="text-[9px] font-bold bg-slate-100 dark:bg-zinc-850 text-on-surface-variant px-1.5 py-0.5 rounded font-mono shrink-0">
                      v{item.version}
                    </span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant/60 font-semibold shrink-0">
                    Released: {item.releaseDate}
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed mt-1">
                  {item.notes}
                </p>
              </div>
            </div>
          ))}

          {changelogs.length === 0 && (
            <div className="p-12 text-center text-xs text-on-surface-variant select-none">
              No developer release updates recorded.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
