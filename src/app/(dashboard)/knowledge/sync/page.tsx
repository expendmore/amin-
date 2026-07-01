"use client";

import React, { useState } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { RefreshCw, Play, CheckCircle2, History } from "lucide-react";

export default function SyncManagerPage() {
  const { addToast } = useToast();
  const { syncJobs, collections, syncCollection } = useKnowledgeBase();

  const [syncingJobId, setSyncingJobId] = useState<string | null>(null);

  const handleSync = (jobId: string, colId: string) => {
    setSyncingJobId(jobId);
    setTimeout(() => {
      syncCollection(colId);
      setSyncingJobId(null);
      addToast("Successfully triggered data source synchronization.", "success");
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Sync Pipelines Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Schedule recurring directory synchronizations (GitHub, OneDrive, Notion) and inspect execution status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sync Jobs list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Active Synchronization Pipelines
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {syncJobs.map((job) => {
              const colName = collections.find((c) => c.id === job.collectionId)?.name || "Folder";
              const isJobSyncing = syncingJobId === job.id;
              return (
                <div
                  key={job.id}
                  className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                      {job.sourceName} → {colName}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                      Schedule: {job.scheduleRate} • Last run: {new Date(job.lastSyncTime).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-0.5">
                      <CheckCircle2 className="h-3 w-3" />
                      Nominal
                    </span>

                    <Button
                      onClick={() => handleSync(job.id, job.collectionId)}
                      variant="outline"
                      size="xs"
                      className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20"
                      isLoading={isJobSyncing}
                      leftIcon={<Play className="h-3.5 w-3.5 text-brand-sky" />}
                    >
                      Sync Now
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Info side panel */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <RefreshCw className="h-4.5 w-4.5 text-brand-sky" />
              Pipeline Guidelines
            </h3>

            <div className="flex flex-col gap-3.5 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Webhooks sync:</strong> Git pushes automatically trigger code repository wiki document rebuilds within 60 seconds.
                </p>
              </div>

              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Failure limit check:</strong> Multiple sync failed notifications suspend auto triggers, requesting administrative credential checkups.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
