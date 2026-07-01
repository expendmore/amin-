"use client";

import React from "react";
import { useDevops } from "@/store/use-devops";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Play, History } from "lucide-react";

export default function PipelinesPage() {
  const { addToast } = useToast();
  const { pipelines } = useDevops();

  const handleRetry = (name: string) => {
    addToast(`Retrying CI/CD workflow pipeline: ${name}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            CI/CD Pipelines Workflows
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review automation pipeline tests, check compile durations logs, and manually trigger deployment jobs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipelines list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <History className="h-4.5 w-4.5 text-brand-sky" />
            Configured CI/CD Pipelines
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {pipelines.map((it) => (
              <div
                key={it.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left font-sans">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {it.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold block mt-0.5">
                    Last Run: {new Date(it.lastRun).toLocaleString()} • Duration: {it.durationMs / 1000}s
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase">
                    {it.status}
                  </span>

                  <Button
                    onClick={() => handleRetry(it.name)}
                    variant="outline"
                    size="xs"
                    className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
                    leftIcon={<Play className="h-3.5 w-3.5" />}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
