"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderHeart,
  BookOpen,
  Upload,
  Globe,
  Scissors,
  Database,
  Search,
  Bot,
  Lock,
  RefreshCw,
  ListOrdered,
  BarChart3,
  History,
  Eye
} from "lucide-react";

interface KnowledgeServiceNavProps {
  className?: string;
}

export default function KnowledgeServiceNav({ className = "" }: KnowledgeServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/knowledge", icon: LayoutDashboard },
    { label: "Collections", href: "/knowledge/collections", icon: FolderHeart },
    { label: "Document Library", href: "/knowledge/library", icon: BookOpen },
    { label: "Upload Center", href: "/knowledge/upload", icon: Upload },
    { label: "Website Import", href: "/knowledge/import", icon: Globe },
    { label: "Chunk Viewer", href: "/knowledge/chunks", icon: Scissors },
    { label: "Embedding Manager", href: "/knowledge/embeddings", icon: Database },
    { label: "Semantic Search", href: "/knowledge/search", icon: Search },
    { label: "RAG Playground", href: "/knowledge/playground", icon: Bot },
    { label: "Access Permissions", href: "/knowledge/permissions", icon: Lock },
    { label: "Sync Schedules", href: "/knowledge/sync", icon: RefreshCw },
    { label: "Processing Queue", href: "/knowledge/queue", icon: ListOrdered },
    { label: "Knowledge Analytics", href: "/knowledge/analytics", icon: BarChart3 },
    { label: "Version History", href: "/knowledge/versions", icon: History },
    { label: "Audit Logs", href: "/knowledge/audits", icon: Eye }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          Enterprise Data
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          Knowledge Base Hub
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
