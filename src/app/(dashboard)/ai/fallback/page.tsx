"use client";

import React from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { ShieldAlert, RefreshCw, CheckCircle2, History } from "lucide-react";

export default function AIFallbackManagerPage() {
  const { addToast } = useToast();
  const { failoverLogs, routing, models, clearLogs } = useAIProvider();

  const handleClearLogs = () => {
    clearLogs();
    addToast("Cleared failover audit timeline", "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Fallback & Failover Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review primary endpoints failover configurations, track sequential recovery logs, and verify local backups.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearLogs}
          className="font-bold shrink-0 text-error hover:bg-red-50 dark:hover:bg-red-950/20"
          leftIcon={<History className="h-4 w-4" />}
        >
          Clear Failover Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Failover sequence details card */}
        <Card className="lg:col-span-1 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <ShieldAlert className="h-4.5 w-4.5 text-brand-sky" />
            Active Failover Setup
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
              <span>Primary Endpoint Model</span>
              <span className="font-mono text-brand-navy dark:text-foreground font-bold">{routing.defaultModelId}</span>
            </div>

            <div className="flex flex-col gap-2 border-t border-brand-border pt-3 mt-1 text-left">
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider block">
                Secondary Backups Chain
              </span>

              <div className="flex flex-col gap-1.5">
                {routing.fallbackChain.map((modelId, idx) => {
                  const mName = models.find(m => m.id === modelId)?.name || modelId;
                  return (
                    <div key={idx} className="p-2 bg-brand-slate dark:bg-zinc-900 rounded-lg text-[11px] font-semibold text-brand-navy truncate">
                      {idx + 1}. Failover → {mName}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Failover logs index */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Failover Event Logs Audit
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {failoverLogs.length > 0 ? (
              failoverLogs.map((log) => {
                const primName = models.find(m => m.id === log.primaryModelId)?.name || log.primaryModelId;
                const backName = models.find(m => m.id === log.backupModelId)?.name || log.backupModelId;
                return (
                  <div key={log.id} className="p-4 flex items-start justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground flex items-center gap-1.5">
                        Failover triggered: {primName} → {backName}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/80 font-medium">
                        Reason: {log.reason}
                      </span>
                      <span className="text-[9px] text-on-surface-variant/50 font-semibold block">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                      Recovered
                    </span>
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-on-surface-variant/80 p-8 text-center font-medium block">
                No active failover events listed. All primary endpoints operating nominally.
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
