"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  Play,
  FileImage,
  Edit,
  History,
  Share2,
  Lock,
  Trash2,
  Search,
  BarChart3,
  Activity,
  Eye,
  Layers
} from "lucide-react";

interface FileServiceNavProps {
  className?: string;
}

export default function FileServiceNav({ className = "" }: FileServiceNavProps) {
  const pathname = usePathname();

  const links = [
    { label: "Storage Dashboard", href: "/files", icon: LayoutDashboard },
    { label: "File Browser", href: "/files/browser", icon: Layers },
    { label: "Folder Manager", href: "/files/folders", icon: FolderOpen },
    { label: "Upload Center", href: "/files/upload", icon: Upload },
    { label: "Preview Center", href: "/files/preview", icon: Play },
    { label: "Media Library", href: "/files/media", icon: FileImage },
    { label: "Metadata Manager", href: "/files/metadata", icon: Edit },
    { label: "Version History", href: "/files/versions", icon: History },
    { label: "Sharing Center", href: "/files/sharing", icon: Share2 },
    { label: "Permissions Manager", href: "/files/permissions", icon: Lock },
    { label: "Recycle Bin", href: "/files/trash", icon: Trash2 },
    { label: "Search Engine", href: "/files/search", icon: Search },
    { label: "Storage Analytics", href: "/files/analytics", icon: BarChart3 },
    { label: "Activity Center", href: "/files/activity", icon: Activity },
    { label: "Audit Logs", href: "/files/audits", icon: Eye }
  ];

  return (
    <div className={`w-64 bg-white dark:bg-zinc-950 border-r border-brand-border dark:border-zinc-800/80 flex flex-col h-full overflow-hidden text-left ${className}`}>
      {/* Title */}
      <div className="p-4 border-b border-brand-border dark:border-zinc-800/80 flex flex-col text-left">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
          Digital Asset Hub
        </span>
        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground tracking-tight mt-0.5">
          Enterprise File Manager
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
