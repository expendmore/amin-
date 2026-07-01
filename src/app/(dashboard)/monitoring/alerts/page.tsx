"use client";

import React from "react";
import { useMonitoring } from "@/store/use-monitoring";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { Bell } from "lucide-react";

export default function AlertCenterPage() {
  const { addToast } = useToast();
  const { rules, toggleRule } = useMonitoring();

  const handleToggle = (id: string, name: string) => {
    toggleRule(id);
    addToast(`Alert rule "${name}" status toggled`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Alert Rules & Configurations
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Define system-wide critical alert rules, evaluate warning triggers, and configure target notification paths (Email, Slack, WhatsApp).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Bell className="h-4.5 w-4.5 text-brand-sky" />
            Infrastructure Alert Triggers Settings
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {rules.map((r) => (
              <div
                key={r.id}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate font-mono">
                    Condition: {r.metricKey} {r.condition} {r.threshold}%
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold mt-0.5">
                    Channels: Email, WhatsApp, Slack
                  </span>
                </div>

                <Toggle checked={r.isEnabled} onChange={() => handleToggle(r.id, r.metricKey)} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
