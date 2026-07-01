"use client";

import React, { useMemo } from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import { Send, Eye, ShieldCheck, Mail } from "lucide-react";

export default function DeveloperDashboardPage() {
  const { apps, webhooks, tokens, logs } = useDeveloper();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Developer Console Overview
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor API dispatches, evaluate connected integrations applications, and check auth token parameters.
          </p>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* API Requests */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">API Requests (Today)</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {logs.length} dispatches
            </span>
          </div>
          <Send className="h-5 w-5 text-brand-sky shrink-0" />
        </Card>

        {/* Active Apps */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Registered OAuth Apps</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {apps.length} clients
            </span>
          </div>
          <ShieldCheck className="h-5 w-5 text-brand-green shrink-0" />
        </Card>

        {/* Webhooks */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Active Webhooks endpoints</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {webhooks.length} endpoints
            </span>
          </div>
          <Mail className="h-5 w-5 text-[#34A853] shrink-0" />
        </Card>

        {/* Tokens */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Personal Access Tokens</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {tokens.length} keys
            </span>
          </div>
          <Eye className="h-5 w-5 text-purple-500 shrink-0" />
        </Card>
      </div>
    </div>
  );
}
