"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building,
  Layers,
  Users,
  Shield,
  CreditCard,
  Flag,
  Cpu,
  PhoneCall,
  Blocks,
  Key,
  ListOrdered,
  Activity,
  AlertOctagon,
  Eye,
  Bell,
  Database,
  Lock,
  LineChart,
  MessageSquare,
  Settings
} from "lucide-react";

interface AdminServiceNavProps {
  className?: string;
}

export default function AdminServiceNav({ className = "" }: AdminServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "Super Admin", href: "/admin", icon: LayoutDashboard },
    { label: "Organizations", href: "/admin/organizations", icon: Building },
    { label: "Workspaces", href: "/admin/workspaces", icon: Layers },
    { label: "Users Sessions", href: "/admin/users", icon: Users },
    { label: "Role Matrix", href: "/admin/roles", icon: Shield },
    { label: "Subscription limits", href: "/admin/subscriptions", icon: CreditCard },
    { label: "Feature Flags", href: "/admin/flags", icon: Flag },
    { label: "AI Providers control", href: "/admin/providers", icon: Cpu },
    { label: "WhatsApp controls", href: "/admin/whatsapp", icon: PhoneCall },
    { label: "OAuth Integration", href: "/admin/integrations", icon: Blocks },
    { label: "API Gateway rate", href: "/admin/gateway", icon: Key },
    { label: "Queue workers", href: "/admin/queue", icon: ListOrdered },
    { label: "System Telemetry", href: "/admin/monitoring", icon: Activity },
    { label: "Error Exceptions", href: "/admin/errors", icon: AlertOctagon },
    { label: "Audit logs lines", href: "/admin/audits", icon: Eye },
    { label: "Announcements news", href: "/admin/notifications", icon: Bell },
    { label: "Backup schedules", href: "/admin/backups", icon: Database },
    { label: "Maintenance locks", href: "/admin/maintenance", icon: Lock },
    { label: "Growth Analytics", href: "/admin/analytics", icon: LineChart },
    { label: "Support Tickets desk", href: "/admin/support", icon: MessageSquare },
    { label: "Global Configurations", href: "/admin/settings", icon: Settings }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left font-sans">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          Platform Admin
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          Control Center
        </h3>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 scrollbar-thin">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className="no-underline">
              <span
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors select-none cursor-pointer ${
                  isActive
                    ? "bg-brand-slate text-brand-navy dark:bg-zinc-900/60 dark:text-foreground"
                    : "text-on-surface-variant/80 hover:text-brand-navy hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10 dark:hover:text-foreground"
                }`}
              >
                <link.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-brand-navy dark:text-foreground" : "text-on-surface-variant/60"}`} />
                <span>{link.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
