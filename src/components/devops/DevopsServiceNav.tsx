"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  Compass,
  Play,
  FileText,
  Activity,
  Eye,
  ShieldCheck,
  Cpu,
  Lock,
  Globe,
  Smartphone,
  AlertTriangle,
  ClipboardCheck,
  LineChart,
  Settings,
  Flame,
  History
} from "lucide-react";

interface DevopsServiceNavProps {
  className?: string;
}

export default function DevopsServiceNav({ className = "" }: DevopsServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "DevOps Hub", href: "/devops", icon: LayoutDashboard },
    { label: "Environments", href: "/devops/environments", icon: Box },
    { label: "Deployments", href: "/devops/deployments", icon: Compass },
    { label: "CI/CD Pipelines", href: "/devops/pipelines", icon: Play },
    { label: "Releases Logs", href: "/devops/releases", icon: FileText },
    { label: "Feature Flags", href: "/devops/rollouts", icon: Activity },
    { label: "Blue-Green Splits", href: "/devops/blue-green", icon: Eye },
    { label: "Build Output", href: "/devops/build-logs", icon: Cpu },
    { label: "Environment Vars", href: "/devops/env-vars", icon: Settings },
    { label: "Secrets Vault", href: "/devops/secrets", icon: Lock },
    { label: "Custom Domains", href: "/devops/domains", icon: Globe },
    { label: "SSL Certs", href: "/devops/ssl", icon: ShieldCheck },
    { label: "CDN Asset Purge", href: "/devops/cdn", icon: Smartphone },
    { label: "Database Backups", href: "/devops/backups", icon: History },
    { label: "DR Failover", href: "/devops/disaster-recovery", icon: Flame },
    { label: "DevOps Analytics", href: "/devops/analytics", icon: LineChart },
    { label: "Health endpoints", href: "/devops/health", icon: ClipboardCheck },
    { label: "Maintenance windows", href: "/devops/maintenance", icon: AlertTriangle }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left font-sans">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          ExpendMore Cloud
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          DevOps Platform
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
