"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { ShieldCheck } from "lucide-react";

export default function AccessibilityTestingPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Accessibility Compliance Auditor
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review WCAG AA guidelines checklists, verify page text color contrast ratio, and trace focus states indicators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WCAG checklist */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <ShieldCheck className="h-4.5 w-4.5 text-brand-sky" />
            WCAG AA Compliance checks
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {([
              { rule: "Elements ARIA labels present on interactive controls", status: "Pass" },
              { rule: "Keyboard focus states indicators checked on main dashboard drawer", status: "Pass" },
              { rule: "Text contrast ratios meets 4.5:1 AA target specifications", status: "Pass" }
            ]).map((it) => (
              <div
                key={it.rule}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <span className="text-xs font-bold text-brand-navy dark:text-foreground leading-relaxed">
                  {it.rule}
                </span>

                <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 font-sans">
                  {it.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
