"use client";

import React, { useMemo } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import { Percent, Cpu, Activity, BarChart3 } from "lucide-react";

export default function TokenAnalyticsPage() {
  const { costs, models } = useAIProvider();

  const metrics = useMemo(() => {
    let prompt = 0;
    let completion = 0;

    costs.forEach((c) => {
      prompt += c.promptTokens;
      completion += c.completionTokens;
    });

    const total = prompt + completion;
    return { prompt, completion, total };
  }, [costs]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Token Flow Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze prompt and completion token statistics per model workspace, and evaluate cache hit ratios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Prompt Tokens */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
            Prompt (Input) Tokens
          </h3>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {metrics.prompt.toLocaleString()}
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            System prompts & templates variables
          </span>
        </Card>

        {/* Completion tokens */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
            Completion (Output) Tokens
          </h3>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {metrics.completion.toLocaleString()}
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Generated LLM responses chunks
          </span>
        </Card>

        {/* Combined flow */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
            Combined Flow Volume
          </h3>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {metrics.total.toLocaleString()}
          </span>
          <span className="text-[10px] text-brand-green font-bold flex items-center gap-0.5">
            <Percent className="h-3.5 w-3.5" />
            98.5% Routing Efficiency
          </span>
        </Card>
      </div>

      {/* Model utilization list */}
      <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-brand-navy dark:text-foreground text-left">
          Per-Model Token Flow Utilization
        </h3>

        <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800 p-4">
          {costs.map((c, idx) => {
            const mName = models.find(m => m.id === c.modelId)?.name || c.modelId;
            const subTotal = c.promptTokens + c.completionTokens;
            const percentage = Math.round((subTotal / (metrics.total || 1)) * 100);
            return (
              <div key={idx} className="py-3.5 first:pt-0 flex flex-col gap-2 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                  <span className="text-brand-navy dark:text-foreground">{mName}</span>
                  <span>{subTotal.toLocaleString()} tokens ({percentage}%)</span>
                </div>

                <div className="w-full bg-brand-slate dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-sky rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
