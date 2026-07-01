"use client";

import React from "react";
import { AIProviderStatus } from "@/types/ai-provider";

interface AIStatusBadgeProps {
  status: AIProviderStatus;
}

export default function AIStatusBadge({ status }: AIStatusBadgeProps) {
  const styles: Record<AIProviderStatus, string> = {
    connected: "bg-emerald-50 dark:bg-emerald-950/20 text-brand-green border-emerald-200 dark:border-emerald-800/50",
    disconnected: "bg-slate-50 dark:bg-zinc-900/40 text-on-surface-variant/80 border-brand-border dark:border-zinc-800",
    rate_limited: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200 dark:border-amber-800/50",
    maintenance: "bg-blue-50 dark:bg-blue-950/20 text-brand-sky border-blue-200 dark:border-blue-800/50",
    offline: "bg-red-50 dark:bg-red-950/20 text-error border-red-200 dark:border-red-800/50"
  };

  const labels: Record<AIProviderStatus, string> = {
    connected: "Active & Connected",
    disconnected: "Disconnected",
    rate_limited: "Rate Limited (429)",
    maintenance: "Maintenance",
    offline: "Service Offline"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-bold tracking-tight select-none uppercase font-sans ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "connected" ? "bg-brand-green" :
        status === "rate_limited" ? "bg-amber-500" :
        status === "maintenance" ? "bg-brand-sky" :
        status === "offline" ? "bg-error" : "bg-on-surface-variant/60"
      }`} />
      <span>{labels[status]}</span>
    </span>
  );
}
