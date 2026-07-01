"use client";

import React from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import { CreditCard, Calendar, BarChart3 } from "lucide-react";

export default function SubscriptionManagementPage() {
  const { orgs } = useAdmin();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Client Subscriptions & Renewals
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor client subscription tiers billing status, check upcoming renewals, and audit invoices limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of client scopes */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Workspace Subscription Status
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {orgs.map((o) => (
              <div
                key={o.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {o.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Billing cycle status: {o.billingStatus} • Workspaces active: {o.workspacesCount}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-brand-navy dark:text-foreground">
                  Renewal: July 27, 2026
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
