"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Lock } from "lucide-react";

export default function SecurityTestingPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Security Gate Scanners
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review security assertion filters, monitor authorization headers, and inspect XSS/CSRF parameters validators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security checks */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Lock className="h-4.5 w-4.5 text-brand-sky" />
            Vulnerability gate scanners checks
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {([
              { check: "CSRF token validation present on API endpoints gateways", result: "Safe" },
              { check: "Input fields XSS payloads filters validation rules checked", result: "Safe" },
              { check: "JWT session token keys expiration cycles verified", result: "Safe" }
            ]).map((it) => (
              <div
                key={it.check}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <span className="text-xs font-bold text-brand-navy dark:text-foreground leading-relaxed">
                  {it.check}
                </span>

                <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 font-sans">
                  {it.result}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
