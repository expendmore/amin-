"use client";

import React, { useState } from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Edit2 } from "lucide-react";

export default function WorkspaceManagementPage() {
  const { addToast } = useToast();
  const { workspaces, updateWorkspaceLimits } = useAdmin();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [limitWf, setLimitWf] = useState("20");
  const [limitStorage, setLimitStorage] = useState("10");

  const handleEditClick = (w: any) => {
    setEditingId(w.id);
    setLimitWf(w.limitsWorkflows.toString());
    setLimitStorage(w.limitsStorageGB.toString());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    updateWorkspaceLimits(editingId, {
      workflows: parseInt(limitWf) || 20,
      storage: parseInt(limitStorage) || 10
    });

    addToast("Workspace limits updated successfully.", "success");
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Workspace Limits Management
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Configure system execution boundaries, modify workspace slots thresholds, and verify storage ceilings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspaces list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Active Workspace Directories
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {workspaces.map((w) => (
              <div
                key={w.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {w.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Workflows limit: {w.limitsWorkflows} • Storage limit: {w.limitsStorageGB} GB • Seats: {w.limitsUsers}
                  </span>
                </div>

                <Button
                  onClick={() => handleEditClick(w)}
                  variant="outline"
                  size="xs"
                  className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0"
                  leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                >
                  Adjust Limits
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex flex-col gap-0.5 text-left border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                Adjust Workspace limits
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                Set boundaries limits configurations for database workflows runs.
              </p>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Max Workflows Count
                </label>
                <Input
                  type="number"
                  value={limitWf}
                  onChange={(e) => setLimitWf(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Max Storage Allocation (GB)
                </label>
                <Input
                  type="number"
                  value={limitStorage}
                  onChange={(e) => setLimitStorage(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3.5 border-t border-brand-border dark:border-zinc-800/80 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(null)}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  size="sm"
                  className="font-bold text-white"
                >
                  Save Limits
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
