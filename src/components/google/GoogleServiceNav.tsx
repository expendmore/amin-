import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import { GoogleServiceId } from "@/types/google-workspace";
import {
  LayoutDashboard,
  Mail,
  Calendar,
  FolderOpen,
  Table,
  FileText,
  Users,
  Video,
  ClipboardList,
  Activity,
  History,
  ShieldCheck,
  UserCheck
} from "lucide-react";

interface GoogleServiceNavProps {
  className?: string;
}

export function GoogleServiceNav({ className = "" }: GoogleServiceNavProps) {
  const pathname = usePathname();
  const { syncJobs, accounts, activeAccountId } = useGoogleWorkspace();

  const activeAccount = accounts.find(a => a.id === activeAccountId);

  // 10 Core Google Services plus 4 Manager/Audit links
  const servicesList: Array<{
    id: GoogleServiceId | "dashboard" | "accounts" | "oauth" | "logs" | "monitoring";
    label: string;
    href: string;
    icon: React.ComponentType<any>;
    color: string;
    type: "service" | "manager";
  }> = [
    { id: "dashboard", label: "Dashboard Hub", href: "/google", icon: LayoutDashboard, color: "text-[#4285F4]", type: "manager" },
    { id: "accounts", label: "Account Manager", href: "/google/accounts", icon: UserCheck, color: "text-[#34A853]", type: "manager" },
    { id: "oauth", label: "OAuth & Security", href: "/google/oauth", icon: ShieldCheck, color: "text-[#EA4335]", type: "manager" },
    { id: "gmail", label: "Google Gmail", href: "/google/gmail", icon: Mail, color: "text-[#EA4335]", type: "service" },
    { id: "calendar", label: "Google Calendar", href: "/google/calendar", icon: Calendar, color: "text-[#4285F4]", type: "service" },
    { id: "drive", label: "Google Drive", href: "/google/drive", icon: FolderOpen, color: "text-[#FBBC05]", type: "service" },
    { id: "sheets", label: "Google Sheets", href: "/google/sheets", icon: Table, color: "text-[#34A853]", type: "service" },
    { id: "docs", label: "Google Docs", href: "/google/docs", icon: FileText, color: "text-[#4285F4]", type: "service" },
    { id: "contacts", label: "Google Contacts", href: "/google/contacts", icon: Users, color: "text-[#4285F4]", type: "service" },
    { id: "meet", label: "Google Meet", href: "/google/meet", icon: Video, color: "text-[#34A853]", type: "service" },
    { id: "forms", label: "Google Forms", href: "/google/forms", icon: ClipboardList, color: "text-[#7248B9]", type: "service" },
    { id: "logs", label: "Sync & Error Logs", href: "/google/logs", icon: History, color: "text-[#475569]", type: "manager" },
    { id: "monitoring", label: "Telemetry Monitor", href: "/google/monitoring", icon: Activity, color: "text-[#0F172A]", type: "manager" }
  ];

  return (
    <div className={`w-[260px] bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 h-full flex flex-col select-none shrink-0 ${className}`}>
      {/* Active Account Info Header */}
      {activeAccount && (
        <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex items-center gap-2.5">
          <img
            src={activeAccount.avatarUrl}
            alt={activeAccount.displayName}
            className="w-9 h-9 rounded-full border border-brand-border shrink-0 object-cover"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
              {activeAccount.displayName}
            </span>
            <span className="text-[10px] text-on-surface-variant/80 font-semibold truncate">
              {activeAccount.email}
            </span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-5 scrollbar-thin">
        {/* Navigation - Management Controls */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/50 px-3 mb-1.5 block">
            Management Suite
          </span>
          {servicesList
            .filter(item => item.type === "manager")
            .map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                    isActive
                      ? "bg-brand-navy text-white dark:bg-white dark:text-brand-navy shadow-sm"
                      : "text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground hover:bg-brand-slate dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-current" : item.color}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
        </div>

        {/* Navigation - Synced Services */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/50 px-3 mb-1.5 block">
            Workspace Services
          </span>
          {servicesList
            .filter(item => item.type === "service")
            .map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const isEnabled = activeAccount?.enabledServices.includes(item.id as GoogleServiceId);
              
              // Get sync job state
              const job = syncJobs[item.id as GoogleServiceId];
              const isRunning = job?.status === "running";
              const isErr = activeAccount?.status === "permission_error" || activeAccount?.status === "expired";

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-brand-navy text-white dark:bg-white dark:text-brand-navy shadow-sm"
                      : "text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground hover:bg-brand-slate dark:hover:bg-zinc-900"
                  } ${!isEnabled ? "opacity-50 hover:cursor-not-allowed" : ""}`}
                  onClick={(e) => {
                    if (!isEnabled) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-current" : item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {/* Syncing indicators / Status indicator */}
                  {isEnabled && (
                    <div className="flex items-center shrink-0 ml-1">
                      {isRunning ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                      ) : isErr ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-error" />
                      ) : (
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
        </div>
      </div>

      {/* Connection status footer banner */}
      <div className="p-3 bg-brand-slate dark:bg-zinc-900 border-t border-brand-border dark:border-zinc-800/80 text-[10px] text-on-surface-variant/80 font-semibold flex items-center justify-between">
        <span>Integration Engine</span>
        <span className="text-brand-green font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
          Active
        </span>
      </div>
    </div>
  );
}

export default GoogleServiceNav;
