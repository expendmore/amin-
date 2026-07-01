"use client";

import React from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { ShieldCheck, Trash2, Key, Info, Sliders } from "lucide-react";
import { AIAuditLog } from "@/types/ai-provider";

export default function AIAuditCenterPage() {
  const { addToast } = useToast();
  const { auditLogs, clearLogs } = useAIProvider();

  const handleClear = () => {
    clearLogs();
    addToast("Cleared audit timeline cache", "warning");
  };

  const getAuditIcon = (action: AIAuditLog["action"]) => {
    switch (action) {
      case "key_rotation":
      case "key_revocation":
        return <Key className="h-4.5 w-4.5 text-amber-500 shrink-0" />;
      case "provider_status_change":
        return <Sliders className="h-4.5 w-4.5 text-brand-sky shrink-0" />;
      default:
        return <Info className="h-4.5 w-4.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Security & Configuration Audits
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review timeline of credential rotations, API priority adjustments, and infrastructure changes.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="font-bold shrink-0 text-error hover:bg-red-50 dark:hover:bg-red-950/20"
          leftIcon={<Trash2 className="h-4 w-4" />}
        >
          Clear History
        </Button>
      </div>

      {/* Audit Logs list */}
      <Card className="border-brand-border bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="divide-y divide-brand-border">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start gap-3.5 text-left font-sans">
                {getAuditIcon(log.action)}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-bold gap-4">
                    <span className="text-brand-navy dark:text-foreground flex items-center gap-2 capitalize">
                      {log.description}
                      <span className="text-[9px] font-bold bg-slate-100 dark:bg-zinc-800 text-on-surface-variant/80 px-2 py-0.5 rounded uppercase">
                        {log.action.replace("_", " ")}
                      </span>
                    </span>
                    <span className="text-[10px] text-on-surface-variant/60 font-semibold shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/75 font-semibold">
                    Operator: {log.operator}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-xs text-on-surface-variant">
              No audit records saved.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
