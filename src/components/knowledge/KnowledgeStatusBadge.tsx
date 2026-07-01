"use client";

import React from "react";
import { DocumentStatus } from "@/types/knowledge-base";

interface KnowledgeStatusBadgeProps {
  status: DocumentStatus;
}

export default function KnowledgeStatusBadge({ status }: KnowledgeStatusBadgeProps) {
  const styles: Record<DocumentStatus, string> = {
    queued: "bg-slate-50 dark:bg-zinc-900/40 text-on-surface-variant/80 border-brand-border dark:border-zinc-800",
    processing: "bg-blue-50 dark:bg-blue-950/20 text-brand-sky border-blue-200 dark:border-blue-800/50",
    completed: "bg-emerald-50 dark:bg-emerald-950/20 text-brand-green border-emerald-200 dark:border-emerald-800/50",
    failed: "bg-red-50 dark:bg-red-950/20 text-error border-red-200 dark:border-red-800/50"
  };

  const labels: Record<DocumentStatus, string> = {
    queued: "Queued",
    processing: "Processing Node",
    completed: "Completed & Indexed",
    failed: "Failed to Index"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-tight select-none uppercase font-sans ${styles[status]}`}>
      <span className={`w-1 h-1 rounded-full ${
        status === "completed" ? "bg-brand-green" :
        status === "processing" ? "bg-brand-sky" :
        status === "failed" ? "bg-error" : "bg-on-surface-variant/60"
      }`} />
      <span>{labels[status]}</span>
    </span>
  );
}
