"use client";

import React from "react";
import { useQa } from "@/store/use-qa";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Eye, Check, X } from "lucide-react";

export default function VisualRegressionPage() {
  const { addToast } = useToast();
  const { visualChecks, approveVisualBaseline, rejectVisualBaseline } = useQa();

  const handleApprove = (id: string, path: string) => {
    approveVisualBaseline(id);
    addToast(`Approved visual baseline screenshot update for page: ${path}`, "success");
  };

  const handleReject = (id: string, path: string) => {
    rejectVisualBaseline(id);
    addToast(`Rejected visual screenshot layout changes for: ${path}`, "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Visual Regression Testing
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Compare screenshots updates, identify layout pixel differences ratios, and approve visual baseline changes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regression logs */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Eye className="h-4.5 w-4.5 text-brand-sky" />
            Baseline comparison screenshot queue
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {visualChecks.map((it) => (
              <div
                key={it.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground font-mono">
                    Page: {it.pagePath}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold font-sans">
                    Pixel diff threshold: {it.pixelDiffPercent}% • Status: {it.status}
                  </span>
                </div>

                {it.status === "pending_approval" && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      onClick={() => handleReject(it.id, it.pagePath)}
                      variant="outline"
                      size="xs"
                      className="font-bold border-red-200 text-error hover:bg-red-50 shrink-0 animate-none"
                      leftIcon={<X className="h-3.5 w-3.5" />}
                    >
                      Reject
                    </Button>

                    <Button
                      onClick={() => handleApprove(it.id, it.pagePath)}
                      variant="success"
                      size="xs"
                      className="font-bold text-white shrink-0 animate-none"
                      leftIcon={<Check className="h-3.5 w-3.5 text-white" />}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
