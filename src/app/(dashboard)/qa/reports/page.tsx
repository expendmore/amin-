"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Download, FileText } from "lucide-react";

export default function TestReportsPage() {
  const { addToast } = useToast();

  const handleDownload = () => {
    addToast("Downloading PDF test report. Generating compilation documents...", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            QA Reports & Artifacts Archive
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Export comprehensive QA summary documents, review historical pass rates, and verify performance benchmarks logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports files */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <FileText className="h-4.5 w-4.5 text-brand-sky" />
            Generated QA Execution Reports
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {([
              { title: "ExpendMore Suite run manually executed build checks", date: "June 27, 2026", result: "Passed" }
            ]).map((it) => (
              <div
                key={it.title}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    {it.title}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Completed: {it.date} • Overall Assertion: {it.result}
                  </span>
                </div>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="xs"
                  className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
                  leftIcon={<Download className="h-3.5 w-3.5" />}
                >
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
