"use client";

import React, { useMemo } from "react";
import { useMicrosoft365 } from "@/store/use-microsoft-365";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { MicrosoftSyncButton } from "@/components/microsoft/MicrosoftSyncButton";
import { useToast } from "@/store/use-toast";
import {
  Mail,
  Calendar,
  FolderOpen,
  Table,
  FileText,
  Users,
  Layers,
  BarChart3,
  Activity,
  ArrowRight,
  TrendingUp,
  HardDrive,
  Users2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function MicrosoftDashboard() {
  const { addToast } = useToast();
  const {
    accounts,
    activeAccountId,
    syncJobs,
    apiMetrics,
    triggerBulkSync
  } = useMicrosoft365();

  const activeAccount = useMemo(() => {
    return accounts.find(a => a.id === activeAccountId) || null;
  }, [accounts, activeAccountId]);

  // Compute metrics
  const stats = useMemo(() => {
    const totalAccs = accounts.length;
    const healthAvg = accounts.length > 0
      ? Math.round(accounts.reduce((sum, a) => sum + a.healthScore, 0) / accounts.length)
      : 0;

    const totalCalls = Object.values(apiMetrics).reduce((sum, m) => sum + m.callsToday, 0);

    return { totalAccs, healthAvg, totalCalls };
  }, [accounts, apiMetrics]);

  const handleBulkSync = () => {
    triggerBulkSync();
    addToast("Triggered bulk synchronization for Microsoft 365 services", "success");
  };

  const serviceIcons: Record<string, { icon: React.ComponentType<any>; color: string; label: string; href: string }> = {
    outlook: { icon: Mail, color: "text-[#0078D4] bg-blue-50 dark:bg-blue-950/20", label: "Outlook Email", href: "/microsoft/outlook" },
    calendar: { icon: Calendar, color: "text-[#0078D4] bg-blue-50 dark:bg-blue-950/20", label: "Outlook Calendar", href: "/microsoft/calendar" },
    onedrive: { icon: FolderOpen, color: "text-[#0078D4] bg-blue-50 dark:bg-blue-950/20", label: "OneDrive Storage", href: "/microsoft/onedrive" },
    excel: { icon: Table, color: "text-[#107C41] bg-emerald-50 dark:bg-emerald-950/20", label: "Excel Online", href: "/microsoft/excel" },
    word: { icon: FileText, color: "text-[#2B579A] bg-blue-50 dark:bg-blue-950/20", label: "Word Documents", href: "/microsoft/word" },
    teams: { icon: Users, color: "text-[#5B5FC7] bg-purple-50 dark:bg-purple-950/20", label: "Microsoft Teams", href: "/microsoft/teams" },
    sharepoint: { icon: Layers, color: "text-[#0078D4] bg-blue-50 dark:bg-blue-950/20", label: "SharePoint Sites", href: "/microsoft/sharepoint" },
    powerbi: { icon: BarChart3, color: "text-[#F2C811] bg-amber-50 dark:bg-amber-950/20", label: "Power BI Reports", href: "/microsoft/powerbi" }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div className="text-left">
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Microsoft 365 Integration Hub
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor, sync, and coordinate your corporate Microsoft 365 tenants and automations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <MicrosoftSyncButton
            status={Object.values(syncJobs).some(j => j.status === "running") ? "running" : "idle"}
            onSync={handleBulkSync}
          />
          <Link href="/microsoft/accounts">
            <Button variant="outline" size="sm" className="font-bold">
              Manage Tenants
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connected Tenants */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Connected Tenants
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.totalAccs}
            </span>
            <span className="text-[10px] text-brand-green font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Entra ID Secure
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0">
            <Users2 className="h-5 w-5" />
          </div>
        </Card>

        {/* Storage Capacity */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              OneDrive Storage Synced
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {activeAccount ? `${activeAccount.storageUsedGB.toFixed(1)} GB` : "0.0 GB"}
            </span>
            <span className="text-[10px] text-on-surface-variant/80 font-medium">
              Of {activeAccount ? activeAccount.storageTotalGB : 1024} GB tenant pool
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-[#0078D4] shrink-0">
            <HardDrive className="h-5 w-5" />
          </div>
        </Card>

        {/* Daily API Transaction Requests */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Microsoft Graph Calls (Today)
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.totalCalls.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#34A853] font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              100% Latency Target
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-[#107C41] shrink-0">
            <Activity className="h-5 w-5" />
          </div>
        </Card>

        {/* Global OAuth Consent Health */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Security Compliance
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.healthAvg}%
            </span>
            <span className={`text-[10px] font-semibold flex items-center gap-1 ${stats.healthAvg > 80 ? "text-[#34A853]" : "text-amber-600"}`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              {stats.healthAvg > 80 ? "Fully Authorized" : "Action Required"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-[#34A853] shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Health Grid */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Microsoft 365 Connected Endpoints
            </h3>
            <span className="text-[10px] font-bold text-brand-sky flex items-center gap-1 animate-pulse">
              <Activity className="h-3 w-3" />
              Graph API Sync Poller Live
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
                      ? "border-brand-border bg-white dark:bg-zinc-900/40"
                      : "border-brand-border/40 bg-brand-slate/40 dark:bg-zinc-900/10 opacity-65"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
                        {item.label}
                      </span>
                      <span className="text-[9px] text-on-surface-variant/80 font-semibold">
                        {isEnabled
                          ? isRunning
                            ? "Syncing data..."
                            : isErr
                            ? "Tenant Re-auth Required"
                            : `Synced ${job?.itemsSynced || 0} nodes`
                          : "Service not authorized"}
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

        {/* Telemetry and Alert Timeline */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Microsoft Graph Incidents & Health
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  Global Tenant Health
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold">
                  All systems operating nominally
                </span>
              </div>
              <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
                100%
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                Entra ID Tenant Policy Alerts
              </span>
              <span className="text-xs text-on-surface-variant/80 font-medium py-3 text-center border border-dashed border-brand-border dark:border-zinc-800 rounded-lg">
                No active notifications or endpoint alert warnings.
              </span>
            </div>

            <div className="border-t border-brand-border pt-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                Active Tenant Settings
              </span>
              <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                <span>Active Enterprise Org</span>
                <span className="font-bold text-brand-sky truncate max-w-[130px]">
                  {activeAccount ? activeAccount.tenantName : "None"}
                </span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                <span>Microsoft Teams Webhook</span>
                <span className="font-bold font-mono text-[9px] truncate max-w-[150px]">
                  https://api.expendmore.com/v1/teams/webhook
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
