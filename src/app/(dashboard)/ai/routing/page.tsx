"use client";

import React, { useMemo, useState } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Shuffle, HelpCircle, Save, Info } from "lucide-react";
import { RoutingStrategy } from "@/types/ai-provider";

export default function RoutingEnginePage() {
  const { addToast } = useToast();
  const { models, routing, updateRoutingConfig } = useAIProvider();

  const activeModels = useMemo(() => {
    return models.filter((m) => m.isEnabled);
  }, [models]);

  const [strategy, setStrategy] = useState<RoutingStrategy>(routing.strategy);
  const [defaultModelId, setDefaultModelId] = useState(routing.defaultModelId);
  const [gptWeight, setGptWeight] = useState(routing.loadBalanceWeights["gpt-4o"] || 50);
  const [claudeWeight, setClaudeWeight] = useState(routing.loadBalanceWeights["claude-3-5-sonnet"] || 50);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRoutingConfig({
      strategy,
      defaultModelId,
      loadBalanceWeights: {
        "gpt-4o": gptWeight,
        "claude-3-5-sonnet": claudeWeight
      }
    });
    addToast("Routing engine policy configurations saved.", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex items-center justify-between border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Request Routing Engine
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Define routing logic, distribute request workloads, and configure automatic fallback failover strategies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Router Rules form */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <form onSubmit={handleSave} className="flex flex-col gap-5 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/75">
                Active Routing Strategy
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as any)}
                className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="default">Default Model (Manual Direct)</option>
                <option value="smart">Smart Routing (Performance-weighted)</option>
                <option value="fallback">Fallback Chain (Sequential Failover)</option>
                <option value="load_balance">Load Balancing (Weights Split)</option>
                <option value="cost">Cost Optimizer (Least expensive path)</option>
                <option value="latency">Latency Optimizer (Fastest response)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/75">
                Default Primary Model
              </label>
              <select
                value={defaultModelId}
                onChange={(e) => setDefaultModelId(e.target.value)}
                className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {activeModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.providerId})
                  </option>
                ))}
              </select>
            </div>

            {/* Load balance sliders */}
            {strategy === "load_balance" && (
              <div className="flex flex-col gap-3 p-3.5 bg-brand-slate rounded-xl border border-brand-border/40 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/75 block">
                  Workload Weights Distribution
                </span>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-on-surface-variant flex justify-between">
                      <span>GPT-4o weight</span>
                      <span className="font-bold font-mono">{gptWeight}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={gptWeight}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setGptWeight(val);
                        setClaudeWeight(100 - val);
                      }}
                      className="accent-brand-sky w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-on-surface-variant flex justify-between">
                      <span>Claude 3.5 Sonnet weight</span>
                      <span className="font-bold font-mono">{claudeWeight}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={claudeWeight}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setClaudeWeight(val);
                        setGptWeight(100 - val);
                      }}
                      className="accent-brand-sky w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Fallback chain preview */}
            {(strategy === "fallback" || strategy === "smart") && (
              <div className="flex flex-col gap-2 border-t border-brand-border pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 block">
                  Failover Backups Chain Sequence
                </span>
                <div className="flex flex-col gap-1.5 mt-1">
                  {routing.fallbackChain.map((modelId, idx) => {
                    const mName = models.find(m => m.id === modelId)?.name || modelId;
                    return (
                      <div key={idx} className="p-2.5 bg-brand-slate dark:bg-zinc-900 rounded-lg border border-brand-border/40 text-xs font-bold text-brand-navy flex items-center justify-between">
                        <span>{idx + 1}. Backup: {mName}</span>
                        <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-on-surface-variant px-1.5 py-0.5 rounded uppercase">
                          Active
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white"
                leftIcon={<Save className="h-4 w-4 text-white" />}
              >
                Save Policy Parameters
              </Button>
            </div>
          </form>
        </Card>

        {/* Info panel */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <Shuffle className="h-4.5 w-4.5 text-brand-sky" />
              Routing Policies guide
            </h3>

            <div className="flex flex-col gap-4 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-brand-sky shrink-0 mt-0.5" />
                <p>
                  <strong>Smart Routing:</strong> ExpendMore automatically matches user prompt segments requirements to models benchmarks. Simple queries route to Gemini Flash; complex coding issues to Claude Sonnet.
                </p>
              </div>

              <div className="flex gap-2">
                <Info className="h-4 w-4 text-brand-sky shrink-0 mt-0.5" />
                <p>
                  <strong>Failover Sequence:</strong> Sequential fallbacks execute within milliseconds of error alerts logs (e.g. rate limit 429 warnings) to guarantee prompt response transmissions.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
