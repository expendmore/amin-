"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { TrendingUp, AlertCircle, ShieldAlert } from "lucide-react";

export default function UsageForecastPage() {
  const { addToast } = useToast();

  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [budgetLimit, setBudgetLimit] = useState("100");

  const handleSaveAlerts = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Budget alerts settings saved successfully.", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Usage Forecast & Budget Alerts
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze cost projections based on API usage trajectories, and configure threshold alerts ceilings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projections grids */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-brand-sky" />
            Projected Cost Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="p-4 bg-brand-slate rounded-xl border border-brand-border text-left">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Projected Next Month Cost</span>
              <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground block mt-1">$65.00 USD</span>
              <span className="text-[9px] text-on-surface-variant font-medium block mt-1">Based on Pro Plan + extra wallet top ups</span>
            </div>

            <div className="p-4 bg-brand-slate rounded-xl border border-brand-border text-left">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Projected Tokens Usage</span>
              <span className="text-2xl font-extrabold text-[#34A853] block mt-1">450K tokens</span>
              <span className="text-[9px] text-on-surface-variant font-medium block mt-1">Estimated flow scale growth (+17%)</span>
            </div>
          </div>
        </Card>

        {/* Budget alerts */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <AlertCircle className="h-4.5 w-4.5 text-brand-sky" />
              Configure Alerts
            </h3>

            <form onSubmit={handleSaveAlerts} className="flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-navy dark:text-foreground">Enable budget warnings</span>
                <Toggle checked={alertsEnabled} onChange={() => setAlertsEnabled(!alertsEnabled)} />
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Notify at spend limit ($)
                </label>
                <Input
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  disabled={!alertsEnabled}
                />
              </div>

              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white w-full mt-2"
                disabled={!alertsEnabled}
              >
                Save Alert Rules
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
