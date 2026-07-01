"use client";

import React, { useMemo } from "react";
import { useBilling } from "@/store/use-billing";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { CreditCard, Wallet, Calendar, HardDrive, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function BillingDashboardPage() {
  const { activePlan, activeInterval, wallet, invoices } = useBilling();

  const latestInvoice = useMemo(() => {
    return invoices[invoices.length - 1];
  }, [invoices]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Billing & Subscriptions
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Manage your subscription tier, check credit wallet balances, and audit payment methods.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/billing/plans">
            <Button variant="success" size="sm" className="font-bold text-white">
              Upgrade Plan
            </Button>
          </Link>
          <Link href="/billing/wallet">
            <Button variant="outline" size="sm" className="font-bold">
              Recharge Credits
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Plan */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Workspace Subscription
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {activePlan} Tier
            </span>
            <span className="text-[10px] text-brand-green font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Active Status
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
        </Card>

        {/* AI Credits */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              AI Token Credits
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {wallet.aiCredits.toLocaleString()}
            </span>
            <span className="text-[10px] text-on-surface-variant/80 font-medium">
              +{wallet.bonusCredits.toLocaleString()} bonus active
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-brand-sky shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
        </Card>

        {/* WhatsApp Credits */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              WhatsApp Broadcast Credits
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {wallet.whatsappCredits.toLocaleString()}
            </span>
            <span className="text-[10px] text-on-surface-variant/80 font-medium">
              Broadcast campaigns buffer nominal
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-brand-green shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
        </Card>

        {/* Next Billing renewal */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Next Invoice Renewal
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              July 27, 2026
            </span>
            <span className="text-[10px] text-on-surface-variant/85 font-medium">
              Upcoming: $49.00 USD
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Invoice panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Latest Billing Statement
          </h3>

          {latestInvoice ? (
            <div className="p-4 border border-brand-border dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl flex items-center justify-between gap-3 text-left font-sans">
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-brand-navy dark:text-foreground">
                  Invoice {latestInvoice.invoiceNumber}
                </span>
                <span className="text-[10px] text-on-surface-variant/80 font-semibold mt-0.5">
                  Amount charged: ${latestInvoice.amount.toFixed(2)} USD • Paid on {new Date(latestInvoice.date).toLocaleDateString()}
                </span>
              </div>

              <Link href="/billing/invoices">
                <button className="h-7 w-7 rounded-md hover:bg-brand-slate dark:hover:bg-zinc-800 flex items-center justify-center text-on-surface-variant hover:text-brand-navy cursor-pointer">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          ) : (
            <span className="text-xs text-on-surface-variant/80 font-medium">
              No invoice history records available.
            </span>
          )}
        </Card>

        {/* Wallet check */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Credits Wallet Status
          </h3>

          <div className="flex flex-col gap-3.5 text-xs font-semibold text-on-surface-variant">
            <div className="flex justify-between items-center">
              <span>Automation Runs Credits</span>
              <span className="font-mono text-brand-navy dark:text-foreground font-bold">{wallet.automationCredits} runs</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-brand-border/60">
              <span>Storage Credits limit</span>
              <span className="font-mono text-brand-navy dark:text-foreground font-bold">{wallet.storageCredits} GB</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
