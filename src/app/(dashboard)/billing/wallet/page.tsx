"use client";

import React, { useState } from "react";
import { useBilling } from "@/store/use-billing";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Wallet, Plus, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CreditWalletPage() {
  const { addToast } = useToast();
  const { wallet, rechargeWallet } = useBilling();

  const [category, setCategory] = useState<"ai" | "whatsapp" | "automation">("ai");
  const [rechargeAmt, setRechargeAmt] = useState(10000);

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    rechargeWallet(rechargeAmt, category);
    addToast(`Successfully added ${rechargeAmt.toLocaleString()} credits to wallet.`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Credit Wallet Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review category credits, top up automation limits, and configure alert reminders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharge panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <form onSubmit={handleRecharge} className="flex flex-col gap-4 text-left font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Select Wallet Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="ai">AI token credits</option>
                  <option value="whatsapp">WhatsApp broadcast credits</option>
                  <option value="automation">Automation runs credits</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Select credits volume
                </label>
                <select
                  value={rechargeAmt}
                  onChange={(e) => setRechargeAmt(parseInt(e.target.value))}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="10000">10,000 Credits ($10 USD)</option>
                  <option value="50000">50,000 Credits ($45 USD)</option>
                  <option value="100000">100,000 Credits ($80 USD)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0"
                leftIcon={<Plus className="h-4 w-4 text-white" />}
              >
                Confirm Top Up
              </Button>
            </div>
          </form>
        </Card>

        {/* info side */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <Wallet className="h-4.5 w-4.5 text-brand-sky" />
              Wallet Balances Details
            </h3>

            <div className="flex flex-col gap-3.5 text-xs font-semibold text-on-surface-variant">
              <div className="flex justify-between items-center">
                <span>AI Token Wallet</span>
                <span className="font-mono text-brand-navy dark:text-foreground font-bold">{wallet.aiCredits.toLocaleString()} tkns</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-brand-border/60">
                <span>WhatsApp Wallet</span>
                <span className="font-mono text-brand-navy dark:text-foreground font-bold">{wallet.whatsappCredits.toLocaleString()} msgs</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-brand-border/60">
                <span>Automation Runs</span>
                <span className="font-mono text-brand-navy dark:text-foreground font-bold">{wallet.automationCredits.toLocaleString()} runs</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
