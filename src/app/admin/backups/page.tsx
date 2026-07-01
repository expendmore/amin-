"use client";

import React from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Database, Download, Plus } from "lucide-react";

export default function BackupCenterPage() {
  const { addToast } = useToast();
  const { backups, triggerBackup } = useAdmin();

  const handleBackup = () => {
    triggerBackup();
    addToast("Instant database backup snapshot trigger completed.", "success");
  };

  const handleDownload = (id: string) => {
    addToast(`Downloading backup snapshot dump archive: ${id}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Database Backup Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Schedule automatic database backups, configure snap logs retention settings, and download dumps.
          </p>
        </div>
        <Button
          variant="success"
          size="sm"
          className="font-bold text-white shrink-0"
          onClick={handleBackup}
          leftIcon={<Plus className="h-4 w-4 text-white" />}
        >
          Backup Database
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backups snapshot list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Available DB Backups Snapshots
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {backups.map((bak) => (
              <div key={bak.id} className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5 font-mono">
                    ID: {bak.id}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Size: {bak.databaseSize} • Retention: {bak.retentionDays} days • Cron: {bak.cronPattern}
                  </span>
                </div>

                <button
                  onClick={() => handleDownload(bak.id)}
                  title="Download Backup"
                  className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer shrink-0"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}

            {backups.length === 0 && (
              <span className="text-xs text-on-surface-variant/80 p-8 text-center font-medium block">
                No backup snapshots recorded in system directory indexes.
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
