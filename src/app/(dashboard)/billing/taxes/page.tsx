"use client";

import React, { useState } from "react";
import { useBilling } from "@/store/use-billing";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Percent, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TaxesReportsPage() {
  const { addToast } = useToast();
  const { taxes } = useBilling();

  const [taxId, setTaxId] = useState("");

  const handleRegisterTaxId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxId.trim()) return;
    addToast("Corporate Tax ID successfully registered for auditing.", "success");
    setTaxId("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Taxes & Compliance Logs
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review tax rates schemas, register local VAT coordinates, and check compliance guidelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tax rates table */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Active Regional Tax Schemas
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {taxes.map((t) => (
              <div
                key={t.id}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    {t.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/80 font-semibold uppercase">
                    Code: {t.regionCode} • Type: {t.type}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-brand-navy dark:text-foreground">
                  {t.ratePercentage}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Register Tax ID */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Register Tax Credentials ID
            </h3>

            <form onSubmit={handleRegisterTaxId} className="flex flex-col gap-3 text-left">
              <Input
                placeholder="e.g. EU-VAT-12345"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                required
              />
              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full">
                Register ID
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
