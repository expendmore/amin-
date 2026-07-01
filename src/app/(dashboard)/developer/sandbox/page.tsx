"use client";

import React from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Box, RotateCcw } from "lucide-react";

export default function DeveloperSandboxPage() {
  const { addToast } = useToast();
  const { resetSandboxEnvironment } = useDeveloper();

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your sandbox testing database? All sample records will be seed fresh.")) {
      resetSandboxEnvironment();
      addToast("Developer sandbox environment reset successfully. Seed data populated.", "success");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Developer Sandbox Environment
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Test API triggers inside a safe sandbox environment, toggle test datasets, or execute reset seeds logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reset container */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-start gap-3 bg-brand-slate dark:bg-zinc-900 rounded-xl p-4 border border-brand-border select-none">
            <Box className="h-5 w-5 text-brand-sky shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-col gap-1 text-left">
              <span className="text-xs font-bold text-brand-navy dark:text-foreground">Sandbox Database Isolation</span>
              <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed mt-0.5">
                Executing triggers and mutations inside the sandbox will never affect live client subscriptions, real WhatsApp campaigns limits, or Stripe invoicing systems.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="font-bold border-red-200 text-error hover:bg-red-50 shrink-0 animate-none"
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Reset Testing Environment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
