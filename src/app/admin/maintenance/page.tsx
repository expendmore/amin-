"use client";

import React from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { Lock } from "lucide-react";

export default function MaintenanceModePage() {
  const { addToast } = useToast();
  const { maintenanceMode, toggleMaintenanceMode } = useAdmin();

  const handleToggle = () => {
    toggleMaintenanceMode();
    addToast(
      `Platform maintenance mode lock ${!maintenanceMode ? "activated" : "deactivated"} successfully.`,
      "success"
    );
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Platform Maintenance Lock
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Toggle global platform maintenance lock, specify custom message banners, and manage IP whitelist filters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Toggle options */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1 text-left">
              <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                Lock Platform Access
              </span>
              <span className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed">
                When active, non-admin users will be redirected to a custom maintenance landing page.
              </span>
            </div>

            <Toggle checked={maintenanceMode} onChange={handleToggle} />
          </div>
        </Card>
      </div>
    </div>
  );
}
