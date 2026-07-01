"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { AlertTriangle } from "lucide-react";

export default function MaintenancePage() {
  const { addToast } = useToast();

  const handleToggle = (optionName: string) => {
    addToast(`Maintenance setting toggled: ${optionName}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Maintenance Window & Locks
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Toggle read-only locks status, configure warning banners alerts, and edit whitelist developer IP ranges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Toggle options */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans border-b border-brand-border pb-3">
            <AlertTriangle className="h-4.5 w-4.5 text-brand-sky" />
            Infrastructure Locks configurations
          </h3>

          <div className="flex flex-col gap-4 text-xs font-semibold text-on-surface-variant leading-relaxed">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5 text-left font-sans">
                <span className="text-brand-navy dark:text-foreground font-bold">Read-Only Database mode</span>
                <span className="text-[10px] text-on-surface-variant/80">Blocks all incoming POST/PUT/DELETE transaction queries</span>
              </div>
              <Toggle
                checked={false}
                onChange={() => handleToggle("Read-Only Mode")}
              />
            </div>

            <div className="flex items-center justify-between border-t border-brand-border/60 pt-4">
              <div className="flex flex-col gap-0.5 text-left font-sans">
                <span className="text-brand-navy dark:text-foreground font-bold">Downtime Banner Announcement</span>
                <span className="text-[10px] text-on-surface-variant/80">Displays a floating indicator message informing users of maintenance</span>
              </div>
              <Toggle
                checked={false}
                onChange={() => handleToggle("Downtime Banner")}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
