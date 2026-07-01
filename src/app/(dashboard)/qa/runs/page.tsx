"use client";

import React from "react";
import { useQa } from "@/store/use-qa";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Play, History } from "lucide-react";

export default function TestExecutionPage() {
  const { addToast } = useToast();
  const { runLogs, runSuite } = useQa();

  const handleRunAll = () => {
    runSuite("suite-1");
    addToast("Triggered execution run for all suites. Running tests...", "info");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Test Execution & Runner Logs
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Execute manual or scheduled assertion triggers, monitor run logs, and trace system connection states.
          </p>
        </div>
        <Button
          onClick={handleRunAll}
          variant="success"
          size="sm"
          className="font-bold text-white shrink-0 animate-none"
          leftIcon={<Play className="h-4 w-4 text-white" />}
        >
          Execute All Test Suites
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Runs timeline */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <History className="h-4.5 w-4.5 text-brand-sky" />
            Execution Dispatches History logs
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {runLogs.map((it) => (
              <div
                key={it.id}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground font-mono truncate">
                    {it.runName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold font-sans">
                    Triggered by: {it.triggeredBy} • Time: {new Date(it.completedTime).toLocaleTimeString()}
                  </span>
                </div>

                <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 font-sans">
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
