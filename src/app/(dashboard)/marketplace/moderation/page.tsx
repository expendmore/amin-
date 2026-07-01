"use client";

import React from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { ShieldCheck, Info, Check, Trash } from "lucide-react";

export default function ModerationCenterPage() {
  const { addToast } = useToast();
  const { moderationRecords, moderateRecord } = useMarketplace();

  const handleAction = (id: string, decision: "approved" | "rejected") => {
    moderateRecord(id, decision);
    addToast(`Template moderation record status marked as ${decision}.`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Moderation Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review templates reported by users, audit security vulnerabilities flags, and inspect licenses policies violations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Moderation items */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Flagged templates pending audit review
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {moderationRecords.map((m) => (
              <div
                key={m.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {m.itemName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/80 font-semibold uppercase">
                    Status: {m.status} • Reports count: {m.reportsCount}
                  </span>
                </div>

                {m.status === "pending" && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleAction(m.id, "approved")}
                      title="Approve Template"
                      className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-green hover:bg-emerald-50 dark:hover:bg-emerald-950/25 cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAction(m.id, "rejected")}
                      title="Reject Template"
                      className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {moderationRecords.length === 0 && (
              <span className="text-xs text-on-surface-variant/80 p-8 text-center font-medium block">
                No items pending moderation review. Store catalogs operating normal configurations.
              </span>
            )}
          </div>
        </Card>

        {/* side note */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
              SLA Compliance
            </h3>
            <div className="flex flex-col gap-3 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <p>
                <strong>Moderation review checks:</strong> Templates accumulating more than 3 spam logs flags undergo temporary rollback pending manual inspection audit loops.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
