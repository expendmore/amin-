"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  Globe,
  Sliders,
  PhoneCall,
  Zap,
  ListOrdered,
  AlertTriangle,
  Flame,
  Bell,
  Terminal,
  Activity,
  ShieldCheck,
  History,
  LineChart
} from "lucide-react";

interface MonitoringServiceNavProps {
  className?: string;
}

export default function MonitoringServiceNav({ className = "" }: MonitoringServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "Operations Stats", href: "/monitoring", icon: LayoutDashboard },
    { label: "App Monitoring", href: "/monitoring/apps", icon: Cpu },
    { label: "REST API Stats", href: "/monitoring/api", icon: Globe },
    { label: "AI Endpoints Core", href: "/monitoring/ai-providers", icon: Sliders },
    { label: "WhatsApp Status", href: "/monitoring/whatsapp", icon: PhoneCall },
    { label: "Workflow queues", href: "/monitoring/workflows", icon: Zap },
    { label: "Worker queues", href: "/monitoring/queues", icon: ListOrdered },
    { label: "Crash Center", href: "/monitoring/errors", icon: AlertTriangle },
    { label: "Active Incidents", href: "/monitoring/incidents", icon: Flame },
    { label: "Alert Configs", href: "/monitoring/alerts", icon: Bell },
    { label: "Logs Browser", href: "/monitoring/logs", icon: Terminal },
    { label: "Page Latency", href: "/monitoring/performance", icon: Activity },
    { label: "Uptime checks", href: "/monitoring/uptime", icon: ShieldCheck },
    { label: "Maintenance slots", href: "/monitoring/maintenance", icon: History },
    { label: "Failure trends", href: "/monitoring/analytics", icon: LineChart }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left font-sans">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          Enterprise
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          Observability
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
