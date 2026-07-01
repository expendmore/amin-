"use client";

import React from "react";
import { DAMFileStatus } from "@/types/files";

interface FileStatusBadgeProps {
  status: DAMFileStatus;
}

export default function FileStatusBadge({ status }: FileStatusBadgeProps) {
  const styles: Record<DAMFileStatus, string> = {
    queued: "bg-slate-50 dark:bg-zinc-900/40 text-on-surface-variant/85 border-brand-border",
    uploading: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200",
    processing: "bg-blue-50 dark:bg-blue-950/20 text-brand-sky border-blue-200",
    completed: "bg-emerald-50 dark:bg-emerald-950/20 text-brand-green border-emerald-200",
    failed: "bg-red-50 dark:bg-red-950/20 text-error border-red-200"
  };

  const labels: Record<DAMFileStatus, string> = {
    queued: "Queued",
    uploading: "Uploading",
    processing: "Processing Node",
    completed: "Completed & Synced",
    failed: "Upload Failed"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-tight select-none uppercase font-sans ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "completed" ? "bg-brand-green" :
        status === "processing" ? "bg-brand-sky" :
        status === "uploading" ? "bg-amber-500" :
        status === "failed" ? "bg-error" : "bg-on-surface-variant/60"
      }`} />
      <span>{labels[status]}</span>
    </span>
  );
}
