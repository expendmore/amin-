"use client";

import React, { useState } from "react";
import { useBilling } from "@/store/use-billing";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { RotateCcw, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function RefundCenterPage() {
  const { addToast } = useToast();
  const { invoices, refundRequests, submitRefundRequest } = useBilling();

  const [invoiceId, setInvoiceId] = useState(invoices[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId || !amount) return;

    submitRefundRequest(invoiceId, parseFloat(amount), reason);
    addToast("Refund request logged successfully. Processing sandbox verification...", "success");
    setAmount("");
    setReason("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Refund Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Log refund requests, coordinate invoices dispute audits, and inspect transaction parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispute form */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Dispute Transaction
          </h3>

          <form onSubmit={handleRefundSubmit} className="flex flex-col gap-4 text-left mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Select Statement Invoice
                </label>
                <select
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                >
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} (${inv.amount.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Refund Amount ($)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 49.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Reason for dispute
              </label>
              <Input
                placeholder="Brief justification..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0"
                leftIcon={<RotateCcw className="h-4 w-4 text-white" />}
              >
                Log Dispute Request
              </Button>
            </div>
          </form>
        </Card>

        {/* Requests list history */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Logged Requests
            </h3>

            <div className="flex flex-col gap-3">
              {refundRequests.map((req) => (
                <div key={req.id} className="p-3 bg-brand-slate rounded-xl border border-brand-border text-left">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
                    <span>{req.invoiceId}</span>
                    <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded uppercase font-bold">
                      {req.status}
                    </span>
                  </div>
                  <span className="text-[9px] text-on-surface-variant/80 font-semibold block mt-1">
                    Amount: ${req.amount.toFixed(2)} • {req.reason}
                  </span>
                </div>
              ))}

              {refundRequests.length === 0 && (
                <span className="text-xs text-on-surface-variant/80 font-medium">
                  No dispute claims logged.
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
