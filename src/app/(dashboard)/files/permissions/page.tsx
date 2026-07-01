"use client";

import React, { useMemo } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import { useToast } from "@/store/use-toast";
import { Lock, ShieldCheck, Users, HelpCircle, CheckCircle2 } from "lucide-react";

export default function FilePermissionsPage() {
  const { addToast } = useToast();
  const { folders, addAuditLog } = useFiles();

  const handleToggleAccess = (id: string, newAccess: any) => {
    addAuditLog("permission_change", `Adjusted folder access level policy to ${newAccess} for folder ${id}`);
    addToast(`Permission scope changed for target folder.`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Data Access & Permissions
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Define corporate workspace storage permissions scopes and coordinate teams access locks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Permissions list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Folder Access Matrix
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {folders.map((fold) => (
              <div
                key={fold.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {fold.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                    Current access rule: Admin, Editor, Viewer
                  </span>
                </div>

                <select
                  defaultValue="editor"
                  onChange={(e) => handleToggleAccess(fold.id, e.target.value)}
                  className="bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-bold text-brand-navy focus:outline-none cursor-pointer w-full sm:w-48"
                >
                  <option value="owner">Owner Only</option>
                  <option value="admin">Admins Shared</option>
                  <option value="editor">Editors (Admins/Eng)</option>
                  <option value="viewer">Viewers (Support)</option>
                </select>
              </div>
            ))}
          </div>
        </Card>

        {/* Security policies */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
              Corporate Guardrails Policies
            </h3>

            <div className="flex flex-col gap-3.5 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Role Isolation:</strong> Large language models routing checks context windows only matching allowed collection files to prevent data leak exposures.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
