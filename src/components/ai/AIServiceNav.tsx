"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sliders,
  Key,
  Cpu,
  Settings,
  Shuffle,
  Terminal,
  FileCode,
  DollarSign,
  Activity,
  ShieldAlert,
  Gauge,
  History,
  Eye,
  Percent,
  Lock
} from "lucide-react";

interface AIServiceNavProps {
  className?: string;
}

export default function AIServiceNav({ className = "" }: AIServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/ai", icon: LayoutDashboard },
    { label: "Providers", href: "/ai/providers", icon: Sliders },
    { label: "API Keys", href: "/ai/keys", icon: Key },
    { label: "Model Library", href: "/ai/library", icon: Cpu },
    { label: "Parameters Config", href: "/ai/config", icon: Settings },
    { label: "Routing Engine", href: "/ai/routing", icon: Shuffle },
    { label: "Prompt Playground", href: "/ai/playground", icon: Terminal },
    { label: "Prompt Templates", href: "/ai/templates", icon: FileCode },
    { label: "Cost Dashboard", href: "/ai/cost", icon: DollarSign },
    { label: "Token Analytics", href: "/ai/tokens", icon: Percent },
    { label: "Health Monitor", href: "/ai/health", icon: Activity },
    { label: "Fallback Config", href: "/ai/fallback", icon: ShieldAlert },
    { label: "Benchmark Center", href: "/ai/benchmark", icon: Gauge },
    { label: "API Usage Logs", href: "/ai/logs", icon: History },
    { label: "Audit Center", href: "/ai/audits", icon: Lock }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          AI Infrastructure
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          AI Provider Hub
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
