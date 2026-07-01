"use client";

import React from "react";
import { InvoiceStatus } from "@/types/billing";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export default function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const styles: Record<InvoiceStatus, string> = {
    paid: "bg-emerald-50 dark:bg-emerald-950/20 text-brand-green border-emerald-200",
    unpaid: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200",
    void: "bg-slate-50 dark:bg-zinc-900/40 text-on-surface-variant border-brand-border",
    refunded: "bg-blue-50 dark:bg-blue-950/20 text-brand-sky border-blue-200"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-tight select-none uppercase font-sans ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "paid" ? "bg-brand-green" :
        status === "unpaid" ? "bg-amber-500" :
        status === "refunded" ? "bg-brand-sky" : "bg-on-surface-variant/60"
      }`} />
      <span>{status}</span>
    </span>
  );
}
