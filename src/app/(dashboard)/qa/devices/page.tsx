"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Smartphone, CheckCircle2 } from "lucide-react";

export default function DeviceTestingPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Responsive Device Testing
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review layout rendering logs across multiple device form factors, monitor viewport widths, and evaluate checks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device checklist */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Smartphone className="h-4.5 w-4.5 text-brand-sky" />
            Tested Viewport Form Factors
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {([
              { device: "Desktop standard 1440px", size: "1440 x 900", status: "Passed" },
              { device: "Tablet viewport (iPad Pro)", size: "1024 x 1366", status: "Passed" },
              { device: "Mobile viewport (iPhone 15 Pro)", size: "393 x 852", status: "Passed" }
            ]).map((it) => (
              <div
                key={it.device}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {it.device}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Dimensions: {it.size}
                  </span>
                </div>

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
