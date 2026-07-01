"use client";

import React, { useMemo } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { FolderOpen, FileText, HardDrive, ShieldCheck, Activity, ArrowRight, Upload } from "lucide-react";

export default function StorageDashboardPage() {
  const { files, folders, activities } = useFiles();

  const activeFiles = useMemo(() => {
    return files.filter(f => !f.isTrashed);
  }, [files]);

  const stats = useMemo(() => {
    let totalBytes = 0;
    activeFiles.forEach(f => {
      totalBytes += f.sizeBytes;
    });

    const usedMB = totalBytes / (1024 * 1024);
    const totalGB = 10;
    const usedPercent = (usedMB / (totalGB * 1024)) * 100;

    return {
      usedMB,
      usedPercent,
      totalFolders: folders.length,
      totalFiles: activeFiles.length
    };
  }, [activeFiles, folders]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Storage Dashboard
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Inspect total storage bytes volumes usage, upload media assets, and check sharing links.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/files/upload">
            <Button variant="success" size="sm" className="font-bold text-white" leftIcon={<Upload className="h-4 w-4 text-white" />}>
              Upload Files
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI storage progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Workspace Storage Capacity
            </h3>
            <HardDrive className="h-4.5 w-4.5 text-brand-sky" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between text-xs font-bold text-brand-navy dark:text-foreground">
              <span>{stats.usedMB.toFixed(2)} MB of 10.0 GB used</span>
              <span>{stats.usedPercent.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-brand-slate dark:bg-zinc-900 h-3 rounded-full overflow-hidden border border-brand-border/30">
              <div className="h-full bg-brand-sky" style={{ width: `${stats.usedPercent}%` }} />
            </div>
          </div>
        </Card>

        {/* Counts summary */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left font-sans">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span>Total Folders</span>
            <span className="text-brand-navy dark:text-foreground font-extrabold">{stats.totalFolders}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant pt-2 border-t border-brand-border/60">
            <span>Total Files Index</span>
            <span className="text-brand-navy dark:text-foreground font-extrabold">{stats.totalFiles}</span>
          </div>
        </Card>
      </div>

      {/* Recent Files & Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent files list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Recent Uploads
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {activeFiles.slice(0, 4).map((file) => (
              <div
                key={file.id}
                className="p-3.5 flex items-center justify-between gap-3 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
                      {file.name}
                    </span>
                    <span className="text-[9px] text-on-surface-variant/80 font-semibold">
                      {file.size} • {new Date(file.uploadedTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Link href="/files/browser">
                  <button className="h-7 w-7 rounded-md hover:bg-brand-slate dark:hover:bg-zinc-800 flex items-center justify-center text-on-surface-variant hover:text-brand-navy cursor-pointer">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity timelines logs */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Storage Activity Log
          </h3>

          <div className="flex flex-col gap-3.5">
            {activities.slice(0, 3).map((act) => (
              <div key={act.id} className="flex gap-2.5 text-xs text-left font-sans font-medium text-on-surface-variant">
                <Activity className="h-4 w-4 text-brand-sky shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-brand-navy dark:text-foreground font-bold">{act.title}</span>
                  <span className="text-[9px] text-on-surface-variant/50 font-bold">{new Date(act.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
