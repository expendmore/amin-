"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { ShieldCheck, Gift, CheckCircle2 } from "lucide-react";

export default function EnterpriseContractsPage() {
  const { addToast } = useToast();

  const [company, setCompany] = useState("");
  const [employees, setEmployees] = useState("50-100");

  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    addToast("Custom enterprise quote logged. Sales desk representative will notify shortly.", "success");
    setCompany("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Enterprise Contracts
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review custom workspace volumes, dedicated cluster deployments, and premium security compliance SLA details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom contract capabilities */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <Gift className="h-4.5 w-4.5 text-brand-sky" />
            Dedicated Capabilities
          </h3>

          <div className="flex flex-col gap-3.5 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed mt-1">
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
              <p>
                <strong>Unlimited Workspaces:</strong> Cross-department account grouping configuration matrices.
              </p>
            </div>

            <div className="flex gap-2 border-t border-brand-border/60 pt-3">
              <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
              <p>
                <strong>Dedicated GPU Cluster:</strong> Isolated compute pools to maintain sub-second response times.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact sales */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Request Enterprise Quote
            </h3>

            <form onSubmit={handleRequestQuote} className="flex flex-col gap-3.5 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Company Name
                </label>
                <Input
                  placeholder="e.g. Acme Corporation"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Team Size Scale
                </label>
                <select
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="50-100">50 - 100 employees</option>
                  <option value="100-500">100 - 500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full mt-1">
                Contact Sales desk
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
