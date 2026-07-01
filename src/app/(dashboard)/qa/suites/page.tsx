"use client";

import React from "react";
import { useQa } from "@/store/use-qa";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Box, Play } from "lucide-react";

export default function TestSuiteManagerPage() {
  const { addToast } = useToast();
  const { suites, runSuite } = useQa();

  const handleRun = (id: string, name: string) => {
    runSuite(id);
    addToast(`Triggered test suite run for: ${name}. Running integration assertions...`, "info");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Test Suite Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review test libraries directories, verify assertions counts, and execute unit/integration test suites runner.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suites list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Box className="h-4.5 w-4.5 text-brand-sky" />
            Registered Assertions Suites Library
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {suites.map((s) => (
              <div
                key={s.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5">
                    {s.name}
                    <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 text-on-surface-variant/80 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                      {s.category}
                    </span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Assertions: {s.testCount} cases • Passes: {s.passCount} • Fails: {s.failCount}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] border px-1.5 py-0.5 rounded font-bold uppercase ${
                    s.status === "passed" ? "bg-emerald-50 text-brand-green border-emerald-200" : "bg-blue-50 text-brand-sky border-blue-200"
                  }`}>
                    {s.status}
                  </span>

                  <Button
                    onClick={() => handleRun(s.id, s.name)}
                    variant="outline"
                    size="xs"
                    className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
                    leftIcon={<Play className="h-3.5 w-3.5" />}
                    disabled={s.status === "running"}
                  >
                    {s.status === "running" ? "Running" : "Run Assertions"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
