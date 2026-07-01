"use client";

import React from "react";
import { useDevops } from "@/store/use-devops";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { Activity } from "lucide-react";

export default function FeatureRolloutsPage() {
  const { addToast } = useToast();
  const { flags, toggleFlag } = useDevops();

  const handleToggle = (id: string, name: string) => {
    toggleFlag(id);
    addToast(`Feature flag "${name}" toggled`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Canary & Feature Rollouts
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Manage dynamic feature flags configurations, adjust Canary split percentages, and whitelist workspaces tags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flags list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Activity className="h-4.5 w-4.5 text-brand-sky" />
            Configured Feature Flags Rollouts
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {flags.map((f) => (
              <div
                key={f.id}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left font-sans">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground font-mono truncate">
                    {f.key}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold block mt-0.5 leading-relaxed">
                    {f.description}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/75 font-bold block mt-1">
                    Canary Traffic split target: {f.percentage}% users
                  </span>
                </div>

                <Toggle checked={f.isEnabled} onChange={() => handleToggle(f.id, f.key)} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
