"use client";

import React, { useMemo, useState } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { History, RotateCcw, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function DocumentVersionsPage() {
  const { addToast } = useToast();
  const { documents } = useKnowledgeBase();

  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || "doc-1");

  const activeDoc = useMemo(() => {
    return documents.find((d) => d.id === selectedDocId);
  }, [documents, selectedDocId]);

  const handleRestore = (ver: string) => {
    addToast(`Successfully restored document configuration version to ${ver}.`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Document Version History
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review prior snapshots of indexed files, compare chunk counts alterations, and restore previous draft indexes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Versions browser */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex flex-col gap-1 border-b border-brand-border pb-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Select target Document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-bold text-brand-navy focus:outline-none cursor-pointer w-full sm:w-72"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground mt-2">
            Revision Snapshots
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {/* Version 2 */}
            <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-brand-navy dark:text-foreground flex items-center gap-1.5">
                  Version: {activeDoc?.version || "v1.0"} (Active)
                  <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                    Live
                  </span>
                </span>
                <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                  Indexed count: {activeDoc?.chunkCount} chunks • Updated {activeDoc?.uploadedTime ? new Date(activeDoc.uploadedTime).toLocaleDateString() : "Today"}
                </span>
              </div>
            </div>

            {/* Simulated Version 1 */}
            <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                  Version: v1.0 (Prior Draft)
                </span>
                <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                  Indexed count: 12 chunks • Updated 2 weeks ago
                </span>
              </div>

              <Button
                onClick={() => handleRestore("v1.0")}
                variant="outline"
                size="xs"
                className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0"
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              >
                Restore
              </Button>
            </div>
          </div>
        </Card>

        {/* guidelines */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <History className="h-4.5 w-4.5 text-brand-sky" />
              Reversion Safeguards
            </h3>

            <div className="flex flex-col gap-3.5 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Index integrity:</strong> Restoring past draft versions will trigger active vector rebuild jobs to sync databases references.
                </p>
              </div>

              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>History log:</strong> Reversion events are tracked in audit timelines, specifying target document changes operators details.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
