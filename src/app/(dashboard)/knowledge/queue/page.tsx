"use client";

import React, { useMemo } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import KnowledgeStatusBadge from "@/components/knowledge/KnowledgeStatusBadge";
import { ListOrdered, Trash2, CheckCircle2 } from "lucide-react";

export default function ProcessingQueuePage() {
  const { addToast } = useToast();
  const { queue, documents, clearQueue } = useKnowledgeBase();

  const handleClear = () => {
    clearQueue();
    addToast("Cleared queue timeline", "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Document Processing Queue
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor OCR conversion processes, chunk partitions extractions, and pipeline rebuild queues.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="font-bold text-error hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
          leftIcon={<Trash2 className="h-4 w-4" />}
        >
          Clear Queue Logs
        </Button>
      </div>

      {/* Queue list table */}
      <Card className="border-brand-border bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-slate/85 dark:bg-zinc-900 border-b border-brand-border text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3.5 pl-5">Document</th>
                <th className="p-3.5">Indexing Phase</th>
                <th className="p-3.5">Retry count</th>
                <th className="p-3.5 pr-5 text-right">Job Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {queue.map((q) => {
                const doc = documents.find((d) => d.id === q.documentId);
                return (
                  <tr key={q.id} className="hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10 font-medium text-brand-navy dark:text-foreground">
                    <td className="p-3.5 pl-5 font-bold">
                      {doc?.name || q.documentId}
                    </td>
                    <td className="p-3.5">
                      <KnowledgeStatusBadge status={q.status} />
                    </td>
                    <td className="p-3.5 font-bold">
                      {q.retryCount} retries
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="w-20 bg-brand-slate h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div className="h-full bg-brand-sky rounded-full" style={{ width: `${q.progressPercentage}%` }} />
                        </div>
                        <span className="font-mono font-bold text-on-surface-variant/80">
                          {q.progressPercentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {queue.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-xs text-on-surface-variant select-none">
                    Queue is empty. Active parser nodes are operating in standby configurations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
