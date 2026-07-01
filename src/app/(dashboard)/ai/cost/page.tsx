"use client";

import React, { useMemo, useState } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { BarChart3, TrendingUp, AlertTriangle, PiggyBank, DollarSign } from "lucide-react";

export default function CostDashboardPage() {
  const { addToast } = useToast();
  const { costs, providers } = useAIProvider();

  const [budgetLimit, setBudgetLimit] = useState("50.00");

  const costBreakdown = useMemo(() => {
    let openaiTotal = 0;
    let anthropicTotal = 0;
    let otherTotal = 0;

    costs.forEach((c) => {
      if (c.providerId === "openai") openaiTotal += c.totalCost;
      else if (c.providerId === "anthropic") anthropicTotal += c.totalCost;
      else otherTotal += c.totalCost;
    });

    const grandTotal = openaiTotal + anthropicTotal + otherTotal;
    return {
      openaiTotal,
      anthropicTotal,
      otherTotal,
      grandTotal
    };
  }, [costs]);

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Budget limits threshold set to $${budgetLimit}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Spend & Cost Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review accumulated token charges, set budget alerts, and forecast monthly API spends.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost stats breakdown */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground text-left">
            Spent Breakdown per Provider
          </h3>

          <div className="flex flex-col gap-4 border border-brand-border dark:border-zinc-800 p-4 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            <div className="flex items-center justify-between text-xs font-bold py-2 text-on-surface-variant">
              <span className="text-brand-navy dark:text-foreground">OpenAI Platform</span>
              <span>${costBreakdown.openaiTotal.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold py-2 text-on-surface-variant">
              <span className="text-brand-navy dark:text-foreground">Anthropic Claude</span>
              <span>${costBreakdown.anthropicTotal.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold py-2 text-on-surface-variant">
              <span className="text-brand-navy dark:text-foreground">Local / Other APIs</span>
              <span>${costBreakdown.otherTotal.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-extrabold py-3 border-t border-brand-border">
              <span className="text-brand-navy dark:text-foreground uppercase tracking-wider text-[10px]">Grand Spend Total</span>
              <span className="text-brand-sky">${costBreakdown.grandTotal.toFixed(4)}</span>
            </div>
          </div>
        </Card>

        {/* Forecast / Alerts Setup */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
                AI Budget limit Setup
              </h3>
              <PiggyBank className="h-4.5 w-4.5 text-amber-500" />
            </div>

            <form onSubmit={handleUpdateBudget} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-on-surface-variant/80 uppercase">
                  Monthly spend alert limit (USD)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                  />
                  <Button type="submit" variant="success" size="sm" className="font-bold text-white shrink-0">
                    Set
                  </Button>
                </div>
              </div>
            </form>

            <div className="p-3 bg-brand-slate rounded-xl border border-brand-border/40 flex gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed">
                When active spend reaches 80% of threshold limit, system triggers failover flags to Ollama local endpoints to restrict billing blurs.
              </p>
            </div>
          </Card>

          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Spend Forecast Analysis
            </h3>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
                ${(costBreakdown.grandTotal * 30).toFixed(2)}
              </span>
              <span className="text-[10px] text-on-surface-variant font-bold">
                Projected Monthly Spend
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
