"use client";

import React, { useState } from "react";
import { useBilling } from "@/store/use-billing";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Tag, CheckCircle2, Ticket } from "lucide-react";

export default function CouponsRegistryPage() {
  const { addToast } = useToast();
  const { coupons, applyCoupon } = useBilling();

  const [code, setCode] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const success = applyCoupon(code.trim().toUpperCase());
    if (success) {
      addToast(`Promotional code coupon "${code}" applied successfully.`, "success");
      setCode("");
    } else {
      addToast(`Invalid or expired promotion code.`, "error");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Coupons & Promotions
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Redeem workspace promo codes, evaluate stackable flat discounts, and inspect credits vouchers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Redeem panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <form onSubmit={handleApply} className="flex flex-col gap-4 text-left font-sans">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Input Coupon Code
              </label>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g. SENSY20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="max-w-xs"
                />
                <Button
                  type="submit"
                  variant="success"
                  size="sm"
                  className="font-bold text-white shrink-0"
                >
                  Apply Promo
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Coupons list */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <Ticket className="h-4.5 w-4.5 text-brand-sky" />
              Active Coupons
            </h3>

            <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
              {coupons.map((c) => (
                <div key={c.code} className="p-3 bg-brand-slate/40 dark:bg-zinc-900/10 text-left">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy dark:text-foreground">
                    <span>{c.code}</span>
                    <span className="text-[9px] text-[#34A853] font-bold">
                      {c.value}% OFF
                    </span>
                  </div>
                  <span className="text-[9px] text-on-surface-variant/80 font-semibold block mt-1">
                    Expires: {new Date(c.expirationDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
