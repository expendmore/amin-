"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  FileText,
  Download,
  FolderHeart,
  Layout,
  Upload,
  MessageSquare,
  Bookmark,
  History,
  Key,
  CreditCard,
  Star,
  LineChart,
  ShieldAlert
} from "lucide-react";

interface MarketplaceServiceNavProps {
  className?: string;
}

export default function MarketplaceServiceNav({ className = "" }: MarketplaceServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "Marketplace Home", href: "/marketplace", icon: Home },
    { label: "Browse Store", href: "/marketplace/browse", icon: Compass },
    { label: "Asset Details", href: "/marketplace/details", icon: FileText },
    { label: "One-Click Install", href: "/marketplace/install", icon: Download },
    { label: "My Library", href: "/marketplace/library", icon: FolderHeart },
    { label: "Creator Dashboard", href: "/marketplace/creator", icon: Layout },
    { label: "Upload Wizard", href: "/marketplace/upload", icon: Upload },
    { label: "Reviews & Ratings", href: "/marketplace/reviews", icon: MessageSquare },
    { label: "Store Collections", href: "/marketplace/collections", icon: Bookmark },
    { label: "Version Manager", href: "/marketplace/versions", icon: History },
    { label: "License Keys", href: "/marketplace/license", icon: Key },
    { label: "Purchase Records", href: "/marketplace/purchases", icon: CreditCard },
    { label: "Saved Wishlist", href: "/marketplace/favorites", icon: Star },
    { label: "Store Analytics", href: "/marketplace/analytics", icon: LineChart },
    { label: "Moderation Center", href: "/marketplace/moderation", icon: ShieldAlert }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left font-sans">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          ExpendMore Hub
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          Template Store
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
