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
  LineChart
} from "lucide-react";

interface QaServiceNavProps {
  className?: string;
}

export default function QaServiceNav({ className = "" }: QaServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "QA Console", href: "/qa", icon: LayoutDashboard },
    { label: "Suites Library", href: "/qa/suites", icon: Box },
    { label: "Test Explorer", href: "/qa/explorer", icon: Compass },
    { label: "Runs Execution", href: "/qa/runs", icon: Play },
    { label: "QA Reports", href: "/qa/reports", icon: FileText },
    { label: "Code Coverage", href: "/qa/coverage", icon: Activity },
    { label: "Visual Regression", href: "/qa/visual", icon: Eye },
    { label: "WCAG A11y status", href: "/qa/a11y", icon: ShieldCheck },
    { label: "Lighthouse Vitals", href: "/qa/performance", icon: Cpu },
    { label: "Security Scanners", href: "/qa/security", icon: Lock },
    { label: "Browser Matrix", href: "/qa/browsers", icon: Globe },
    { label: "Devices Emulator", href: "/qa/devices", icon: Smartphone },
    { label: "Bug Backlog", href: "/qa/bugs", icon: AlertTriangle },
    { label: "Release Gates", href: "/qa/readiness", icon: ClipboardCheck },
    { label: "QA Metrics Analytics", href: "/qa/analytics", icon: LineChart }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left font-sans">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          ExpendMore Quality
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          QA & Testing
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
