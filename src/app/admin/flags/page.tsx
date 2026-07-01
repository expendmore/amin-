"use client";

import React from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Flag } from "lucide-react";

export default function FeatureFlagsPage() {
  const { addToast } = useToast();
  const { flags, toggleFeatureFlag, updateFlagRollout } = useAdmin();

  const handleToggle = (key: string, name: string) => {
    toggleFeatureFlag(key);
    addToast(`Feature flag "${name}" status toggled`, "success");
  };

  const handleRolloutChange = (key: string, percent: number) => {
    updateFlagRollout(key, percent);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Feature Flags Control
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Toggle beta configurations, specify rollout limits percentage, and execute incremental releases.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flags list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Registered Feature Flags
          </h3>

          <div className="flex flex-col gap-4">
            {flags.map((f) => (
              <div key={f.key} className="p-4 bg-brand-slate/40 dark:bg-zinc-900/10 rounded-xl border border-brand-border flex flex-col gap-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-brand-navy dark:text-foreground flex items-center gap-1.5">
                      {f.name}
                      <span className="text-[9px] font-mono bg-slate-100 dark:bg-zinc-800 text-on-surface-variant px-1.5 py-0.5 rounded font-bold shrink-0">
                        {f.key}
                      </span>
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-medium mt-1">
                      {f.description}
                    </span>
                  </div>

                  <Toggle checked={f.isEnabled} onChange={() => handleToggle(f.key, f.name)} />
                </div>

                <div className="flex flex-col gap-1 border-t border-brand-border/60 pt-3 text-xs font-semibold text-on-surface-variant">
                  <div className="flex justify-between items-center">
                    <span>Rollout Target (percentage)</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={f.rolloutPercent}
                      disabled={!f.isEnabled}
                      onChange={(e) => handleRolloutChange(f.key, parseInt(e.target.value))}
                      className="cursor-pointer bg-brand-sky accent-brand-sky"
                    />
                    <span className="font-mono text-brand-navy dark:text-foreground font-bold">{f.rolloutPercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
