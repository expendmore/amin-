"use client";

import React from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import { useToast } from "@/store/use-toast";
import { CreditCard, Download, ExternalLink } from "lucide-react";

export default function PurchaseRecordsPage() {
  const { addToast } = useToast();
  const { purchases, items } = useMarketplace();

  const handleDownload = (id: string) => {
    addToast(`Downloading purchase receipt copy PDF: ${id}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Purchase History
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review subscription invoices receipts, download statements copies, and submit refund claims.
          </p>
        </div>
      </div>

      {/* Purchases log grid */}
      <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left font-sans">
        <div className="divide-y divide-brand-border">
          {purchases.map((pur) => {
            const item = items.find((x) => x.id === pur.itemId);
            return (
              <div key={pur.id} className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {item?.name || "Premium Asset Template"}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Transaction: {pur.id} • Purchased on {new Date(pur.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-brand-navy dark:text-foreground">
                    ${pur.amount.toFixed(2)} USD
                  </span>

                  <button
                    onClick={() => handleDownload(pur.id)}
                    title="Download Receipt"
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer shrink-0"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {purchases.length === 0 && (
            <div className="p-12 text-center text-xs text-on-surface-variant select-none">
              No store purchase records found in archive.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
