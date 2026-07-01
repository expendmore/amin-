"use client";

import React, { useMemo } from "react";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { GoogleSyncButton } from "@/components/google/GoogleSyncButton";
import { useToast } from "@/store/use-toast";
import {
  Mail,
  Calendar,
  FolderOpen,
  Table,
  FileText,
  Users,
  Video,
  Activity,
  ArrowRight,
  TrendingUp,
  HardDrive,
  Users2,
  ShieldCheck,
  Percent,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function GoogleDashboard() {
  const { addToast } = useToast();
  const {
    accounts,
    activeAccountId,
    syncJobs,
    apiMetrics,
    health,
    triggerBulkSync
  } = useGoogleWorkspace();

  const activeAccount = useMemo(() => {
    return accounts.find(a => a.id === activeAccountId) || null;
  }, [accounts, activeAccountId]);

  // Compute stats metrics
  const stats = useMemo(() => {
    const totalAccs = accounts.length;
    const healthAvg = accounts.length > 0
      ? Math.round(accounts.reduce((sum, a) => sum + a.healthScore, 0) / accounts.length)
      : 0;

    // Calculate total calls today across all services
    const totalCalls = Object.values(apiMetrics).reduce((sum, m) => sum + m.callsToday, 0);

    return { totalAccs, healthAvg, totalCalls };
  }, [accounts, apiMetrics]);

  const handleBulkSync = () => {
    triggerBulkSync();
    addToast("Triggered bulk synchronization for all active Google services", "success");
  };

  // Google Service Icons mapping
  const serviceIcons: Record<string, { icon: React.ComponentType<any>; color: string; label: string; href: string }> = {
    gmail: { icon: Mail, color: "text-[#EA4335] bg-red-50 dark:bg-red-950/20", label: "Gmail Inbox", href: "/google/gmail" },
    calendar: { icon: Calendar, color: "text-[#4285F4] bg-blue-50 dark:bg-blue-950/20", label: "Calendar Scheduling", href: "/google/calendar" },
    drive: { icon: FolderOpen, color: "text-[#FBBC05] bg-amber-50 dark:bg-amber-950/20", label: "Drive Storage", href: "/google/drive" },
    sheets: { icon: Table, color: "text-[#34A853] bg-emerald-50 dark:bg-emerald-950/20", label: "Sheets Data", href: "/google/sheets" },
    docs: { icon: FileText, color: "text-[#4285F4] bg-blue-50 dark:bg-blue-950/20", label: "Docs Library", href: "/google/docs" },
    contacts: { icon: Users, color: "text-[#4285F4] bg-blue-50 dark:bg-blue-950/20", label: "Contacts Sync", href: "/google/contacts" },
    meet: { icon: Video, color: "text-[#34A853] bg-emerald-50 dark:bg-emerald-950/20", label: "Meet Conferencing", href: "/google/meet" },
    forms: { icon: FileText, color: "text-[#7248B9] bg-purple-50 dark:bg-purple-950/20", label: "Forms & Responses", href: "/google/forms" }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Google Workspace Integration Hub
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor, sync, and manage your connected enterprise Google workflows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GoogleSyncButton
            status={Object.values(syncJobs).some(j => j.status === "running") ? "running" : "idle"}
            onSync={handleBulkSync}
          />
          <Link href="/google/accounts">
            <Button variant="outline" size="sm" className="font-bold">
              Manage Accounts
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connected Accounts */}
        <Card className="p-4 flex items-center justify-between border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Connected Accounts
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.totalAccs}
            </span>
            <span className="text-[10px] text-brand-green font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Active Handshake
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0">
            <Users2 className="h-5 w-5" />
          </div>
        </Card>

        {/* Storage Capacity */}
        <Card className="p-4 flex items-center justify-between border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Total Storage Synced
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {activeAccount ? `${activeAccount.storageUsedGB.toFixed(1)} GB` : "0.0 GB"}
            </span>
            <span className="text-[10px] text-on-surface-variant/80 font-medium">
              Of {activeAccount ? activeAccount.storageTotalGB : 15} GB limit
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-[#FBBC05] shrink-0">
            <HardDrive className="h-5 w-5" />
          </div>
        </Card>

        {/* Daily API Calls */}
        <Card className="p-4 flex items-center justify-between border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              API Transactions (Today)
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.totalCalls.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#34A853] font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              100% Availability
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-[#4285F4] shrink-0">
            <Activity className="h-5 w-5" />
          </div>
        </Card>

        {/* OAuth Health Score */}
        <Card className="p-4 flex items-center justify-between border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              OAuth Security Index
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.healthAvg}%
            </span>
            <span className={`text-[10px] font-semibold flex items-center gap-1 ${stats.healthAvg > 80 ? "text-[#34A853]" : "text-amber-600"}`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              {stats.healthAvg > 80 ? "Fully Secure" : "Needs Reconnect"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-[#34A853] shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Services Health list */}
        <Card className="lg:col-span-2 p-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Workspace Services Connectivity
            </h3>
            <span className="text-[10px] font-bold text-brand-sky flex items-center gap-1">
              <Activity className="h-3 w-3 animate-pulse" />
              Real-time Polling Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Object.keys(serviceIcons).map((srvKey) => {
              const item = serviceIcons[srvKey];
              const isEnabled = activeAccount?.enabledServices.includes(srvKey as any);
              const job = syncJobs[srvKey as keyof typeof syncJobs];
              const isRunning = job?.status === "running";
              const isErr = activeAccount?.status === "permission_error" || activeAccount?.status === "expired";

              return (
                <div
                  key={srvKey}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isEnabled
                      ? "border-brand-border dark:border-zinc-800 bg-white dark:bg-zinc-900/40"
                      : "border-brand-border/40 dark:border-zinc-800/40 bg-brand-slate/40 dark:bg-zinc-900/10 opacity-65"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
                        {item.label}
                      </span>
                      <span className="text-[9px] text-on-surface-variant/80 font-semibold">
                        {isEnabled
                          ? isRunning
                            ? "Syncing data..."
                            : isErr
                            ? "Handshake Expired"
                            : `Synced ${job?.itemsSynced || 0} nodes`
                          : "Integration disabled"}
                      </span>
                    </div>
                  </div>

                  {isEnabled && (
                    <Link href={item.href}>
                      <button className="h-7 w-7 rounded-md hover:bg-brand-slate dark:hover:bg-zinc-800 flex items-center justify-center text-on-surface-variant hover:text-brand-navy cursor-pointer">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Sync Summary & Telemetry */}
        <Card className="p-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            System Telemetry & Incidents
          </h3>

          <div className="flex flex-col gap-3.5">
            {/* System Health Score */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  Global Integration Health
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold">
                  All systems operating nominally
                </span>
              </div>
              <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {health.overallScore}%
              </span>
            </div>

            {/* Incidents timeline */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                Recent Incidents & Notices
              </span>

              {health.incidents.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {health.incidents.map((incident, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 flex gap-2"
                    >
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-400 capitalize">
                          {incident.service} Notice
                        </span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-500 font-medium">
                          {incident.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-on-surface-variant/80 font-medium py-3 text-center border border-dashed border-brand-border dark:border-zinc-800 rounded-lg">
                  No notifications or incident logs.
                </span>
              )}
            </div>

            {/* Quick configuration parameters */}
            <div className="border-t border-brand-border dark:border-zinc-800/80 pt-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                Workspace Telemetry Status
              </span>
              <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                <span>Auto-sync Status</span>
                <span className="font-bold text-brand-green">Enabled</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                <span>Webhook Signal Endpoint</span>
                <span className="font-bold font-mono text-[10px] truncate max-w-[150px]">
                  https://api.expendmore.com/v1/google/sync
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
