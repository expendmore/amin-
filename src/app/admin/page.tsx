"use client";

import React from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import { Users, Building, Layers, ShieldCheck } from "lucide-react";

export default function SuperAdminDashboardPage() {
  const { orgs, workspaces, users, metrics } = useAdmin();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Super Admin Control Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor platform health stats, database connections ratios, and check organizations limits.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Total Platform Users</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {users.length} members
            </span>
          </div>
          <Users className="h-5 w-5 text-brand-sky shrink-0" />
        </Card>

        {/* Organizations */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Organizations</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {orgs.length} orgs
            </span>
          </div>
          <Building className="h-5 w-5 text-brand-green shrink-0" />
        </Card>

        {/* Workspaces */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Workspaces</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {workspaces.length} workspaces
            </span>
          </div>
          <Layers className="h-5 w-5 text-purple-500 shrink-0" />
        </Card>

        {/* System Health */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">DB Connection Pool</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground capitalize">
              {metrics.dbHealth}
            </span>
          </div>
          <ShieldCheck className="h-5 w-5 text-[#34A853] shrink-0" />
        </Card>
      </div>
    </div>
  );
}
