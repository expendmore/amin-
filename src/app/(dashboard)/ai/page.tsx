"use client";

import React, { useMemo } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import {
  Sliders,
  Cpu,
  Activity,
  DollarSign,
  Percent,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Flame,
  CheckCircle2,
  Settings
} from "lucide-react";

export default function AIDashboard() {
  const { providers, models, costs, healthHistory } = useAIProvider();

  // Metrics math
  const stats = useMemo(() => {
    const connectedCount = providers.filter((p) => p.status === "connected").length;
    const availableModels = models.filter((m) => m.isEnabled).length;
    
    const avgLatency = Math.round(
      providers.filter(p => p.status === "connected").reduce((sum, p) => sum + p.latencyMs, 0) / (connectedCount || 1)
    );

    const healthAvg = Math.round(
      providers.filter(p => p.status === "connected").reduce((sum, p) => sum + p.healthScore, 0) / (connectedCount || 1)
    );

    const totalCostToday = costs.reduce((sum, c) => sum + c.totalCost, 0);

    const totalTokensToday = costs.reduce((sum, c) => sum + c.promptTokens + c.completionTokens, 0);

    return {
      connectedCount,
      availableModels,
      avgLatency,
      healthAvg,
      totalCostToday,
      totalTokensToday
    };
  }, [providers, models, costs]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Provider Hub Dashboard
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Manage multi-provider LLM pipelines, route requests dynamically, audit budgets, and monitor model latencies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/ai/providers">
            <Button variant="outline" size="sm" className="font-bold">
              Manage Providers
            </Button>
          </Link>
          <Link href="/ai/playground">
            <Button variant="success" size="sm" className="font-bold">
              Prompt Playground
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connected Providers */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Connected Providers
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.connectedCount} / {providers.length}
            </span>
            <span className="text-[10px] text-brand-green font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              API Channels Secure
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0">
            <Sliders className="h-5 w-5" />
          </div>
        </Card>

        {/* Enabled Models */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Available Models
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.availableModels} Active
            </span>
            <span className="text-[10px] text-on-surface-variant/80 font-medium">
              Across reasoning & chat specs
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-brand-sky shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
        </Card>

        {/* Latency Average */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Avg Response Latency
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.avgLatency} ms
            </span>
            <span className="text-[10px] text-[#34A853] font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              Fast route priority active
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-brand-green shrink-0">
            <Activity className="h-5 w-5" />
          </div>
        </Card>

        {/* Total Cost Today */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Daily LLM Spend (Today)
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              ${stats.totalCostToday.toFixed(3)}
            </span>
            <span className="text-[10px] text-on-surface-variant/80 font-medium">
              Of $25.00 daily threshold
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Providers grid status summary */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              AI Provider Endpoint Channels
            </h3>
            <span className="text-[10px] font-bold text-brand-sky flex items-center gap-1">
              <Activity className="h-3 w-3 animate-pulse" />
              Health Checker Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {providers.map((p) => {
              const isConn = p.status === "connected";
              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isConn
                      ? "border-brand-border bg-white dark:bg-zinc-900/40"
                      : "border-brand-border/40 bg-brand-slate/40 dark:bg-zinc-900/10 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 text-left">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-extrabold text-xs uppercase ${
                      isConn ? "bg-brand-slate text-brand-navy dark:bg-zinc-800 dark:text-foreground" : "bg-slate-200 text-slate-400"
                    }`}>
                      {p.id.substring(0, 2)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
                        {p.name}
                      </span>
                      <span className="text-[9px] text-on-surface-variant/80 font-semibold">
                        {isConn ? `${p.latencyMs}ms • Health: ${p.healthScore}%` : "Disconnected"}
                      </span>
                    </div>
                  </div>

                  {isConn && (
                    <Link href={`/ai/config`}>
                      <button className="h-7 w-7 rounded-md hover:bg-brand-slate dark:hover:bg-zinc-800 flex items-center justify-center text-on-surface-variant hover:text-brand-navy cursor-pointer">
                        <Settings className="h-4 w-4" />
                      </button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Failover and recovery panel */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Token & Load Metrics
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  Daily Token Flow
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold">
                  Prompt & completions
                </span>
              </div>
              <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
                {(stats.totalTokensToday / 1000).toFixed(0)}k tkn
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                Active Routing Policy
              </span>
              <div className="flex items-center justify-between text-xs font-semibold p-2.5 bg-brand-slate dark:bg-zinc-900 rounded-lg border border-brand-border/40">
                <span className="capitalize font-bold text-brand-navy dark:text-foreground">
                  Smart Routing Enabled
                </span>
                <span className="text-[10px] text-brand-sky font-bold">
                  Cost Optimized
                </span>
              </div>
            </div>

            <div className="border-t border-brand-border pt-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                Security compliance
              </span>
              <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                <span>Credentials Rotated</span>
                <span className="font-bold text-brand-green">100% Encrypted</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                <span>Default LLM Endpoint</span>
                <span className="font-mono text-[10px] text-brand-navy dark:text-foreground font-bold">
                  gpt-4o
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
