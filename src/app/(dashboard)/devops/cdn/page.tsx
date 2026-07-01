"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Smartphone, RefreshCw } from "lucide-react";

export default function CdnManagerPage() {
  const { addToast } = useToast();

  const handlePurge = () => {
    addToast("Initiated global CDN edge assets cache purge. Refreshing DNS pools...", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Edge CDN Content & Cache Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Purge static dashboard layouts pages asset cache from CDN servers, analyze bandwidth utilization levels, and monitor edge rules.
          </p>
        </div>
        <Button
          onClick={handlePurge}
          variant="success"
          size="sm"
          className="font-bold text-white shrink-0 animate-none"
          leftIcon={<RefreshCw className="h-4 w-4 text-white" />}
        >
          Purge Global Cache
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Edge Bandwidth */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              CDN Bandwidth (Today)
            </h3>
            <Smartphone className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            14.2 GB
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Cache Hit Ratio percentage: 98.4%
          </span>
        </Card>
      </div>
    </div>
  );
}
