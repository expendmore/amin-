"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Send,
  FileText,
  Sliders,
  Users,
  Calendar,
  Eye,
  RefreshCw,
  Settings,
  Bell,
  LineChart,
  History,
  ShieldCheck
} from "lucide-react";

interface NotificationServiceNavProps {
  className?: string;
}

export default function NotificationServiceNav({ className = "" }: NotificationServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "Overview Stats", href: "/notifications", icon: LayoutDashboard },
    { label: "Alerts Inbox", href: "/notifications/inbox", icon: Inbox },
    { label: "Composer Editor", href: "/notifications/composer", icon: Send },
    { label: "Templates Hub", href: "/notifications/templates", icon: FileText },
    { label: "Routing Rules", href: "/notifications/rules", icon: Sliders },
    { label: "Target Audience", href: "/notifications/audience", icon: Users },
    { label: "Schedule Center", href: "/notifications/scheduler", icon: Calendar },
    { label: "Delivery Tracking", href: "/notifications/tracking", icon: Eye },
    { label: "Retry Queue", href: "/notifications/retry", icon: RefreshCw },
    { label: "Client Preferences", href: "/notifications/preferences", icon: Settings },
    { label: "Announcements Feed", href: "/notifications/announcements", icon: Bell },
    { label: "Engagement Insights", href: "/notifications/analytics", icon: LineChart },
    { label: "Activity Logs", href: "/notifications/activity", icon: History },
    { label: "Audits timeline", href: "/notifications/audits", icon: ShieldCheck }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title block */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left font-sans">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          Enterprise
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          Notification Center
        </h3>
      </div>

      {/* Navigation List links */}
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
