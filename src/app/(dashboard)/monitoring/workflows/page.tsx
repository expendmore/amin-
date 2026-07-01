"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Zap, CheckCircle2 } from "lucide-react";

export default function WorkflowsMonitoringPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Workflow Execution Pipeline
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review live active workflow execution status queues, monitor success rates, and analyze retry delays.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection logs */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Zap className="h-4.5 w-4.5 text-brand-sky" />
            Active Automation Runs Queue
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {([
              { id: "run-8921", workflowName: "Summer Discount Auto Code dispatch", status: "Success", runs: 42 },
              { id: "run-8922", workflowName: "Low Credits Balance SMS Alert rule", status: "Success", runs: 120 }
            ]).map((it) => (
              <div
                key={it.id}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {it.workflowName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Runs Count: {it.runs}
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
