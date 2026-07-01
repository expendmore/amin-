"use client";

import React from "react";
import { useBilling } from "@/store/use-billing";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { RefreshCw, ShieldAlert } from "lucide-react";

export default function AutoRenewalPage() {
  const { addToast } = useToast();
  const { autoRenewal, toggleAutoRenewal } = useBilling();

  const handleToggle = () => {
    toggleAutoRenewal();
    addToast(
      `Auto-renewal configuration ${!autoRenewal ? "enabled" : "disabled"} successfully.`,
      "success"
    );
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Subscription Auto-Renewal
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Toggle automatic invoice re-billings options, check card renewals timings, and configure recovery alerts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Toggle option card */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1 text-left">
              <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                Automatic Invoice Renewals Re-Billing
              </span>
              <span className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed">
                When enabled, ExpendMore will invoice your default card credentials at the start of each renewal period automatically.
              </span>
            </div>

            <Toggle checked={autoRenewal} onChange={handleToggle} />
          </div>
        </Card>

        {/* Safeguard note */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <RefreshCw className="h-4.5 w-4.5 text-brand-sky" />
              Renewal Timings
            </h3>
            <div className="flex flex-col gap-3 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <p>
                <strong>Reminders email alerts:</strong> ExpendMore sends billing reminder notification emails 7 days prior to any renewal date automatically.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
