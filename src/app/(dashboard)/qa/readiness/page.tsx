"use client";

import React from "react";
import { useQa } from "@/store/use-qa";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { ClipboardCheck } from "lucide-react";

export default function ReleaseReadinessPage() {
  const { addToast } = useToast();
  const { readinessChecks, toggleReadiness } = useQa();

  const handleToggle = (id: string, name: string) => {
    toggleReadiness(id);
    addToast(`Gate Check list "${name}" status toggled`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Release Gate Signoff Checklist
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review deployment criteria milestones checklists, verify security clearances, and signoff build releases gates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signoff checkboxes */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans pb-3 border-b border-brand-border">
            <ClipboardCheck className="h-4.5 w-4.5 text-brand-sky" />
            Build Deployment Gates Signoffs
          </h3>

          <div className="flex flex-col gap-4 text-xs font-semibold text-on-surface-variant leading-relaxed">
            {readinessChecks.map((it) => (
              <div key={it.id} className="flex items-center justify-between border-b border-brand-border/60 pb-4">
                <div className="flex flex-col gap-0.5 text-left font-sans">
                  <span className="text-brand-navy dark:text-foreground font-bold">{it.label}</span>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-on-surface-variant/80">Category: {it.category}</span>
                </div>
                <Toggle
                  checked={it.isCompleted}
                  onChange={() => handleToggle(it.id, it.label)}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
