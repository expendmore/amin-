"use client";

import React from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { ShieldAlert, Trash2 } from "lucide-react";

export default function OrganizationManagementPage() {
  const { addToast } = useToast();
  const { orgs, toggleOrgStatus, deleteOrg } = useAdmin();

  const handleToggle = (id: string, name: string) => {
    toggleOrgStatus(id);
    addToast(`Organization status toggled for "${name}"`, "success");
  };

  const handleDelete = (id: string, name: string) => {
    deleteOrg(id);
    addToast(`Organization "${name}" deleted from platform`, "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Organization Management
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review active client organizations, suspend workspace accounts, or transfer platform ownership.
          </p>
        </div>
      </div>

      {/* Orgs list */}
      <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left font-sans">
        <div className="divide-y divide-brand-border">
          {orgs.map((o) => (
            <div key={o.id} className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {o.name}
                  </span>
                  <span className={`text-[9px] border px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                    o.status === "active" ? "bg-emerald-50 text-brand-green border-emerald-200" : "bg-red-50 text-error border-red-200"
                  }`}>
                    {o.status}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                  Owner: {o.ownerName} ({o.ownerEmail}) • Workspaces: {o.workspacesCount}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  onClick={() => handleToggle(o.id, o.name)}
                  variant="outline"
                  size="xs"
                  className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0"
                >
                  {o.status === "active" ? "Suspend" : "Activate"}
                </Button>
                <button
                  onClick={() => handleDelete(o.id, o.name)}
                  title="Delete Organization"
                  className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
