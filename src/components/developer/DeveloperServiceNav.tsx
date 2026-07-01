"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Send,
  Zap,
  Globe,
  Link2,
  Key,
  Download,
  Activity,
  Box,
  Compass,
  Cpu,
  ListOrdered,
  LineChart,
  History,
  Settings
} from "lucide-react";

interface DeveloperServiceNavProps {
  className?: string;
}

export default function DeveloperServiceNav({ className = "" }: DeveloperServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "Developer Hub", href: "/developer", icon: LayoutDashboard },
    { label: "API Reference", href: "/developer/docs", icon: FileText },
    { label: "REST Explorer", href: "/developer/explorer", icon: Send },
    { label: "GraphQL Playground", href: "/developer/graphql", icon: Zap },
    { label: "Webhooks Center", href: "/developer/webhooks", icon: Globe },
    { label: "OAuth Apps", href: "/developer/oauth", icon: Link2 },
    { label: "Access Tokens", href: "/developer/tokens", icon: Key },
    { label: "SDK Center", href: "/developer/sdk", icon: Download },
    { label: "Rate Limits", href: "/developer/rate-limits", icon: Activity },
    { label: "Mock Sandbox", href: "/developer/sandbox", icon: Box },
    { label: "MCP Registry", href: "/developer/mcp-servers", icon: Compass },
    { label: "MCP Clients", href: "/developer/mcp-clients", icon: Cpu },
    { label: "Request Logs", href: "/developer/logs", icon: ListOrdered },
    { label: "Telemetry Insights", href: "/developer/analytics", icon: LineChart },
    { label: "Changelog Notes", href: "/developer/changelog", icon: History },
    { label: "Developer Configs", href: "/developer/settings", icon: Settings }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left font-sans">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          ExpendMore
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          Developer Platform
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
