"use client";

import React from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { Shield } from "lucide-react";

export default function RolePermissionManagerPage() {
  const { addToast } = useToast();
  const { roles, toggleRolePermission } = useAdmin();

  const handleToggle = (roleName: string, permissionKey: string) => {
    toggleRolePermission(roleName, permissionKey);
    addToast(`Updated permission settings for role: ${roleName}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Role & Permission Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Define RBAC permissions matrices, customize custom template privileges, and assign inheritance guidelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role list and settings */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Role Access matrix
          </h3>

          <div className="flex flex-col gap-5">
            {roles.map((role) => (
              <div key={role.name} className="flex flex-col gap-3 p-4 bg-brand-slate/40 dark:bg-zinc-900/10 rounded-xl border border-brand-border">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">{role.name}</span>
                  <span className="text-[10px] text-on-surface-variant font-medium mt-0.5">{role.description}</span>
                </div>

                <div className="flex flex-col gap-3.5 border-t border-brand-border/60 pt-3 text-xs font-semibold text-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <span>Full Platform Admin Access (all_access)</span>
                    <Toggle
                      checked={!!role.permissions["all_access"]}
                      onChange={() => handleToggle(role.name, "all_access")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Billing write access permissions (billing_write)</span>
                    <Toggle
                      checked={!!role.permissions["billing_write"]}
                      onChange={() => handleToggle(role.name, "billing_write")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Platform user write access privileges (users_write)</span>
                    <Toggle
                      checked={!!role.permissions["users_write"]}
                      onChange={() => handleToggle(role.name, "users_write")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
