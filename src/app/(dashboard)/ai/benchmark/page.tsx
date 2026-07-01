"use client";

import React, { useMemo } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import { Gauge, Sparkles } from "lucide-react";

export default function AIBenchmarkCenterPage() {
  const { models } = useAIProvider();

  const enabledModels = useMemo(() => {
    return models.filter((m) => m.isEnabled);
  }, [models]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Model Benchmark Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Compare model performance indicators, evaluate accuracy indexes, and select best fit LLMs.
          </p>
        </div>
      </div>

      {/* Benchmarks comparison list */}
      <Card className="border-brand-border bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-slate/85 dark:bg-zinc-900 border-b border-brand-border text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3.5 pl-5">Model</th>
                <th className="p-3.5">Accuracy Index</th>
                <th className="p-3.5">Coding capability</th>
                <th className="p-3.5">Writing & Reasoning</th>
                <th className="p-3.5">Vision features</th>
                <th className="p-3.5 pr-5 text-right">Avg Response Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {enabledModels.map((m) => (
                <tr key={m.id} className="hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10 font-medium text-brand-navy dark:text-foreground">
                  <td className="p-3.5 pl-5 font-bold">
                    {m.name}
                  </td>
                  <td className="p-3.5 text-brand-sky font-bold">
                    {m.accuracyPlaceholder}%
                  </td>
                  <td className="p-3.5">
                    <div className="w-20 bg-brand-slate h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-brand-sky rounded-full" style={{ width: m.category === "code" ? "98%" : "85%" }} />
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="w-20 bg-brand-slate h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-brand-sky rounded-full" style={{ width: m.isReasoning ? "99%" : "80%" }} />
                    </div>
                  </td>
                  <td className="p-3.5 font-bold">
                    {m.isVision ? "Yes (100%)" : "No Support"}
                  </td>
                  <td className="p-3.5 pr-5 text-right font-bold text-on-surface-variant">
                    {m.latencyMs} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
