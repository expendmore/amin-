"use client";

import React, { useMemo, useState } from "react";
import { useBilling } from "@/store/use-billing";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import InvoiceStatusBadge from "@/components/billing/InvoiceStatusBadge";
import { useToast } from "@/store/use-toast";
import { Search, Download, ExternalLink } from "lucide-react";

export default function InvoicesListPage() {
  const { addToast } = useToast();
  const { invoices } = useBilling();

  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "unpaid">("all");

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        const matchesSearch = inv.invoiceNumber.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = filterStatus === "all" || inv.status === filterStatus;
        return matchesSearch && matchesStatus;
      });
  }, [invoices, query, filterStatus]);

  const handleDownload = (id: string) => {
    addToast(`Downloading billing statement index PDF: ${id}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Billing Statements Invoices
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Browse corporate account statements, check payments statuses, and download invoice copies.
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-brand-border/60">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-on-surface-variant/65 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by invoice ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg focus:outline-none placeholder:text-on-surface-variant/50 text-brand-navy dark:text-foreground"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 select-none">
          {([
            { label: "All Statements", key: "all" },
            { label: "Paid", key: "paid" },
            { label: "Unpaid", key: "unpaid" }
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`h-8 px-3 rounded-lg text-xs font-bold capitalize transition-all duration-150 cursor-pointer ${
                filterStatus === tab.key
                  ? "bg-brand-navy text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                  : "text-on-surface-variant/80 hover:bg-brand-slate/60 hover:text-brand-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table grid */}
      <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left">
        <div className="divide-y divide-brand-border">
          {filteredInvoices.map((inv) => (
            <div key={inv.id} className="p-4 flex items-center justify-between gap-4 font-sans text-left bg-white dark:bg-zinc-900/10">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {inv.invoiceNumber}
                  </span>
                  <InvoiceStatusBadge status={inv.status} />
                </div>
                <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                  Billing Period: {new Date(inv.billingPeriodStart).toLocaleDateString()} - {new Date(inv.billingPeriodEnd).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-bold text-brand-navy dark:text-foreground">
                  ${inv.amount.toFixed(2)} {inv.currency}
                </span>

                <button
                  onClick={() => handleDownload(inv.id)}
                  title="Download Statement"
                  className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer shrink-0"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredInvoices.length === 0 && (
            <div className="p-12 text-center text-xs text-on-surface-variant select-none">
              No invoice statement logs listed matching filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
