"use client";

import React, { useState } from "react";
import { useBilling } from "@/store/use-billing";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Check, ShieldAlert } from "lucide-react";

export default function SubscriptionPlansPage() {
  const { addToast } = useToast();
  const { activePlan, upgradePlan } = useBilling();

  const [interval, setIntervalVal] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    { name: "Starter" as const, desc: "For small teams starting with WhatsApp broadcasts", priceMonthly: 19, priceYearly: 15, features: ["5,000 Messages/mo", "Basic AI node trigger", "1 connected integration"] },
    { name: "Pro" as const, desc: "Recommended tier for advanced workflow setups", priceMonthly: 49, priceYearly: 39, features: ["25,000 Messages/mo", "Smart AI routing engine", "Unlimited active integrations", "Auto-failover paths"] },
    { name: "Business" as const, desc: "SLA configurations for corporate directories", priceMonthly: 99, priceYearly: 79, features: ["100,000 Messages/mo", "RAG playground sandbox", "Advanced permissions rules", "Monthly cost forecasts"] }
  ];

  const handleSelect = (name: any) => {
    upgradePlan(name, interval);
    addToast(`Successfully upgraded subscription tier to ${name}.`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Subscription Plans
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review workspace SLA pricing tiers, switch billing intervals, and upgrade or pause active packages.
          </p>
        </div>

        {/* interval toggles */}
        <div className="flex items-center gap-2 bg-brand-slate rounded-xl p-1 shrink-0 border border-brand-border/60">
          <button
            onClick={() => setIntervalVal("monthly")}
            className={`h-7 px-2.5 rounded-lg flex items-center justify-center text-xs font-bold gap-1.5 cursor-pointer ${
              interval === "monthly" ? "bg-white text-brand-navy shadow-sm" : "text-on-surface-variant"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIntervalVal("yearly")}
            className={`h-7 px-2.5 rounded-lg flex items-center justify-center text-xs font-bold gap-1.5 cursor-pointer ${
              interval === "yearly" ? "bg-white text-brand-navy shadow-sm" : "text-on-surface-variant"
            }`}
          >
            Yearly Billing
          </button>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isActive = activePlan === p.name;
          const price = interval === "monthly" ? p.priceMonthly : p.priceYearly;
          return (
            <Card
              key={p.name}
              className={`p-5 border flex flex-col justify-between gap-4 transition-all duration-200 ${
                isActive
                  ? "border-brand-sky bg-brand-sky-light/5 shadow-sm"
                  : "border-brand-border bg-white dark:bg-zinc-950"
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col text-left font-sans">
                    <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
                      {p.name}
                    </h3>
                    <p className="text-[10px] text-on-surface-variant/80 font-medium leading-relaxed mt-1">
                      {p.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-brand-navy dark:text-foreground">
                    ${price}
                  </span>
                  <span className="text-xs text-on-surface-variant font-bold">
                    / month
                  </span>
                </div>

                <div className="flex flex-col gap-2 border-t border-brand-border/60 pt-4 text-xs font-semibold text-on-surface-variant/90 text-left">
                  {p.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-brand-border pt-4 mt-auto">
                <Button
                  onClick={() => handleSelect(p.name)}
                  variant={isActive ? "outline" : "success"}
                  size="sm"
                  disabled={isActive}
                  className="w-full font-bold"
                >
                  {isActive ? "Active Subscription" : "Upgrade Plan"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
