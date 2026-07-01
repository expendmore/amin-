"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Globe, CheckCircle2 } from "lucide-react";

export default function CrossBrowserTestingPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Cross-Browser Compatibility Matrix
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review compatibility testing logs across major browser engines, check rendering states, and view durations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Browser engines */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Globe className="h-4.5 w-4.5 text-brand-sky" />
            Tested Browser Engines Logs
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {([
              { browser: "Chromium (Google Chrome / MS Edge)", engine: "Blink", status: "Passed", duration: "120s" },
              { browser: "Firefox Engine (Gecko)", engine: "Gecko", status: "Passed", duration: "140s" },
              { browser: "Safari Engine (WebKit)", engine: "WebKit", status: "Passed", duration: "180s" }
            ]).map((it) => (
              <div
                key={it.browser}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {it.browser}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Engine: {it.engine} • Test Duration: {it.duration}
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
