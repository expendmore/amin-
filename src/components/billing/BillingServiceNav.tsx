"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Building,
  Wallet,
  Gauge,
  FileText,
  CreditCard,
  Tag,
  Percent,
  RefreshCw,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Eye,
  Gift
} from "lucide-react";

interface BillingServiceNavProps {
  className?: string;
}

export default function BillingServiceNav({ className = "" }: BillingServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "Billing Dashboard", href: "/billing", icon: LayoutDashboard },
    { label: "Subscription Plans", href: "/billing/plans", icon: Layers },
    { label: "Workspace Details", href: "/billing/workspace", icon: Building },
    { label: "Credit Wallet", href: "/billing/wallet", icon: Wallet },
    { label: "Usage Metering", href: "/billing/usage", icon: Gauge },
    { label: "Invoices List", href: "/billing/invoices", icon: FileText },
    { label: "Payment Options", href: "/billing/payments", icon: CreditCard },
    { label: "Coupons Registry", href: "/billing/coupons", icon: Tag },
    { label: "Taxes Reports", href: "/billing/taxes", icon: Percent },
    { label: "Auto Renewal", href: "/billing/renewal", icon: RefreshCw },
    { label: "Refund Center", href: "/billing/refund", icon: RotateCcw },
    { label: "Billing Analytics", href: "/billing/analytics", icon: BarChart3 },
    { label: "Usage Forecast", href: "/billing/forecast", icon: TrendingUp },
    { label: "Audit Logs", href: "/billing/audits", icon: Eye },
    { label: "Enterprise Contracts", href: "/billing/features", icon: Gift }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          Billing Settings
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          Enterprise Billing Suite
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
