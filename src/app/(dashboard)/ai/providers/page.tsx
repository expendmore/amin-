"use client";

import React from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AIStatusBadge from "@/components/ai/AIStatusBadge";
import { useToast } from "@/store/use-toast";
import { Sliders, RefreshCw, AlertCircle, HelpCircle, Activity } from "lucide-react";

export default function AIProvidersPage() {
  const { addToast } = useToast();
  const {
    providers,
    toggleProvider,
    updateProviderPriority,
    reconnectProvider
  } = useAIProvider();

  const handleToggle = (id: any) => {
    toggleProvider(id);
    const p = providers.find((pr) => pr.id === id);
    const label = p?.status === "connected" ? "disabled" : "enabled";
    addToast(`Successfully ${label} provider endpoint: ${p?.name}`, "info");
  };

  const handleReconnect = (id: any) => {
    reconnectProvider(id);
    const p = providers.find((pr) => pr.id === id);
    addToast(`Successfully completed test handshake for ${p?.name}`, "success");
  };

  const handlePriorityChange = (id: any, priority: number) => {
    updateProviderPriority(id, priority);
    addToast(`Updated routing priority weight`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Provider Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Toggle API connections, adjust priority weights routing, and trigger test handshakes.
          </p>
        </div>
      </div>

      {/* Warning/Tips banner */}
      <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/20 flex gap-3 text-left">
        <HelpCircle className="h-5 w-5 text-brand-sky shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-bold text-brand-sky">
            How priority weights affect routing
          </h4>
          <p className="text-[11px] text-on-surface-variant/80 font-medium leading-relaxed">
            Routing weights (Priority 1-12) determine failover chains order. In cost/latency optimization modes, lower priorities are evaluated first before reverting to backup nodes.
          </p>
        </div>
      </div>

      {/* Provider List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => {
          const isConnected = p.status === "connected";
          return (
            <Card
              key={p.id}
              className={`p-5 border flex flex-col justify-between gap-5 transition-all duration-200 min-h-[220px] ${
                isConnected
                  ? "border-brand-border bg-white dark:bg-zinc-950"
                  : "border-brand-border/40 bg-brand-slate/40 dark:bg-zinc-900/10 opacity-70"
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex flex-col text-left">
                    <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground leading-snug">
                      {p.name}
                    </h3>
                    <span className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider block mt-0.5">
                      SDK Version: {p.version}
                    </span>
                  </div>

                  <div>
                    <AIStatusBadge status={p.status} />
                  </div>
                </div>

                {isConnected && (
                  <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant border-t border-brand-border/60 pt-3">
                    <span className="flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5 text-brand-green" />
                      Latency
                    </span>
                    <span className="font-bold text-brand-navy dark:text-foreground">
                      {p.latencyMs} ms
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 mt-auto border-t border-brand-border pt-4">
                {/* Weight selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                    Weight
                  </span>
                  <select
                    value={p.priority}
                    onChange={(e) => handlePriorityChange(p.id, parseInt(e.target.value))}
                    disabled={!isConnected}
                    className="bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded p-1 text-[11px] font-semibold text-brand-navy focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => (
                      <option key={w} value={w}>
                        P{w}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {isConnected && (
                    <button
                      onClick={() => handleReconnect(p.id)}
                      className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}

                  <Button
                    variant={isConnected ? "outline" : "success"}
                    size="xs"
                    className="font-bold"
                    onClick={() => handleToggle(p.id)}
                  >
                    {isConnected ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
