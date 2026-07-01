"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Flame, CheckCircle } from "lucide-react";

export default function DisasterRecoveryPage() {
  const { addToast } = useToast();

  const handleTest = () => {
    addToast("Simulating disaster recovery failover drill checkpoint sequence...", "info");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Disaster Recovery & Replication
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review postgres read-replica cluster status, evaluate recovery RPO/RTO goals, and initiate mock failovers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DR plan details */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-start gap-3 bg-brand-slate dark:bg-zinc-900 rounded-xl p-4 border border-brand-border select-none">
            <Flame className="h-5 w-5 text-brand-sky shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-col gap-1 text-left">
              <span className="text-xs font-bold text-brand-navy dark:text-foreground">Cross-Region DB Replication</span>
              <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed mt-0.5">
                Active replica synchronizing with secondary AWS region. Real-time RPO (Recovery Point Objective) is 4 seconds.
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              onClick={handleTest}
              variant="outline"
              size="sm"
              className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
              leftIcon={<CheckCircle className="h-4 w-4" />}
            >
              Test Failover Drill
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
