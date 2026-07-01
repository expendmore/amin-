"use client";

import React from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Settings } from "lucide-react";

export default function DeveloperSettingsPage() {
  const { addToast } = useToast();
  const { apiVersion, setApiVersion } = useDeveloper();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Developer global parameters updated successfully.", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Developer Settings
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Define system-wide API default header versions, manage testing sandbox endpoints, and review settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings options */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <form onSubmit={handleSave} className="flex flex-col gap-4 text-left font-sans">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Default API Version Header
              </label>
              <select
                value={apiVersion}
                onChange={(e) => setApiVersion(e.target.value)}
                className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full sm:w-72"
              >
                <option value="2026-06-01">2026-06-01 (Active Default)</option>
                <option value="2026-01-15">2026-01-15 (Deprecated)</option>
              </select>
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button type="submit" variant="success" size="sm" className="font-bold text-white shrink-0 animate-none">
                Save Configurations
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
