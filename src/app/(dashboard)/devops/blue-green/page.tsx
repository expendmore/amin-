"use client";

import React from "react";
import { useDevops } from "@/store/use-devops";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Eye, ArrowLeftRight } from "lucide-react";

export default function BlueGreenPage() {
  const { addToast } = useToast();
  const { blueGreenTrafficSplit, setTrafficSplit } = useDevops();

  const handleSwitch = () => {
    const targetSplit = blueGreenTrafficSplit === 100 ? 0 : 100;
    setTrafficSplit(targetSplit);
    addToast(`Switched production route pointer to: ${targetSplit === 100 ? "Green cluster" : "Blue cluster"}. Health checking connections...`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Blue-Green Traffic Control
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Shift production network routes pointer dynamically, execute rolling blue-green deployments, and monitor health stats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Switcher card */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Eye className="h-4.5 w-4.5 text-brand-sky" />
            Live traffic routing split percentage
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-900/10 text-left font-sans">
            <div className="flex justify-between items-center text-xs font-bold text-brand-navy mb-2">
              <span>Blue Cluster (v1.2.0-old): {100 - blueGreenTrafficSplit}%</span>
              <span>Green Cluster (v1.2.0-new): {blueGreenTrafficSplit}%</span>
            </div>
            <div className="w-full bg-blue-500 h-3 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${100 - blueGreenTrafficSplit}%` }} />
              <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${blueGreenTrafficSplit}%` }} />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              onClick={handleSwitch}
              variant="outline"
              size="sm"
              className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
              leftIcon={<ArrowLeftRight className="h-4 w-4" />}
            >
              Switch Routing Pointer
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
