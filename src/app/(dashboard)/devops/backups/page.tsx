"use client";

import React from "react";
import { useDevops } from "@/store/use-devops";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { History, Download, Plus } from "lucide-react";

export default function BackupsPage() {
  const { addToast } = useToast();
  const { backups, addBackup } = useDevops();

  const handleBackup = () => {
    addBackup();
    addToast("Manual postgres database snapshot created successfully.", "success");
  };

  const handleDownload = (fileName: string) => {
    addToast(`Downloading snapshot file: ${fileName}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Database Backups & Snapshot Logs
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review automatic backup snapshots lists, download SQL postgres backups files, or trigger manual db dumps.
          </p>
        </div>
        <Button
          onClick={handleBackup}
          variant="success"
          size="sm"
          className="font-bold text-white shrink-0 animate-none"
          leftIcon={<Plus className="h-4 w-4 text-white" />}
        >
          Create Manual Snapshot
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backups lists */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <History className="h-4.5 w-4.5 text-brand-sky" />
            Database snapshots archive
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {backups.map((it) => (
              <div
                key={it.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate font-mono">
                    {it.fileName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Size: {it.fileSizeMb} MB • Created: {new Date(it.createdTime).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-sans">
                  <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 text-on-surface-variant/80 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                    {it.type}
                  </span>

                  <Button
                    onClick={() => handleDownload(it.fileName)}
                    variant="outline"
                    size="xs"
                    className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
                    leftIcon={<Download className="h-3.5 w-3.5" />}
                  >
                    Download SQL
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
