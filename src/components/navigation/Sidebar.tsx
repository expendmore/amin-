"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Image,
  FileText,
  LayoutDashboard,
  FolderOpen,
  Settings,
  HelpCircle,
  Sparkles,
  Bot,
  User,
  Bolt,
  BarChart2,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Mail,
  UserCheck,
  ChevronDown,
  Layers,
  Calendar,
  ShoppingBag,
  Grid,
  Cpu,
  Blocks,
  Database,
  Chrome,
  CreditCard,
  Compass,
  Terminal,
  Activity,
  ClipboardCheck,
} from "lucide-react";
import { useSidebar } from "@/store/use-sidebar";
import { useToast } from "@/store/use-toast";
import WorkspaceSwitcher from "@/components/ui/WorkspaceSwitcher";
import Tooltip from "@/components/ui/Tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { addToast } = useToast();
  const { isCollapsed, toggleCollapse } = useSidebar();

  // Nested menu open states
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(true);
  const [isWaMenuOpen, setIsWaMenuOpen] = useState(true);

  // Trigger command palette search globally
  const handleOpenSearch = () => {
    // Dispatch standard event or custom shortcut click
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      })
    );
  };

  // Nav categories & items
  const navSections = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "AI Workspace",
      id: "ai",
      isOpen: isAiMenuOpen,
      setOpen: setIsAiMenuOpen,
      items: [
        { label: "AI Assistant", href: "/chat", icon: MessageSquare },
        { label: "AI Agents", href: "/chat/agents", icon: Bot, badge: "New" },
      ],
    },
    {
      title: "WhatsApp Hub",
      id: "wa",
      isOpen: isWaMenuOpen,
      setOpen: setIsWaMenuOpen,
      items: [
        { label: "Live Team Inbox", href: "/whatsapp/inbox", icon: MessageSquare, badge: "New" },
        { label: "Chatbot Builder", href: "/whatsapp/chatbot", icon: Bot, badge: "New" },
        { label: "AI Reply Assistant", href: "/whatsapp/ai-assistant", icon: Sparkles, badge: "New" },
        { label: "WhatsApp Console", href: "/whatsapp", icon: Layers },
        { label: "Campaigns", href: "/whatsapp/campaigns", icon: Mail, badge: "3" },
        { label: "Contacts", href: "/whatsapp/contacts", icon: UserCheck },
        { label: "WhatsApp Manager", href: "/whatsapp/manager", icon: Settings },
      ],
    },
    {
      title: "Tools & Workspace",
      items: [
        { label: "Workflow Builder", href: "/workflows", icon: Bolt },
        { label: "Automation Calendar", href: "/scheduler", icon: Calendar, badge: "New" },
        { label: "Templates", href: "/workflows/templates", icon: BookOpen },
        { label: "Analytics Hub", href: "/analytics", icon: BarChart2 },
        { label: "Commerce Hub", href: "/commerce", icon: ShoppingBag, badge: "New" },
        { label: "Integrations Hub", href: "/integrations", icon: Blocks, badge: "New" },
        { label: "Google Workspace", href: "/google", icon: Chrome, badge: "New" },
        { label: "Microsoft 365", href: "/microsoft", icon: Grid, badge: "New" },
        { label: "AI Provider Hub", href: "/ai", icon: Cpu, badge: "New" },
        { label: "Knowledge Base", href: "/knowledge", icon: Database, badge: "New" },
        { label: "File Manager", href: "/files", icon: FolderOpen },
        { label: "Billing Suite", href: "/billing", icon: CreditCard, badge: "New" },
        { label: "Template Store", href: "/marketplace", icon: Compass, badge: "New" },
        { label: "Developer Hub", href: "/developer", icon: Terminal, badge: "New" },
        { label: "Monitoring Console", href: "/monitoring", icon: Activity, badge: "New" },
        { label: "QA Center", href: "/qa", icon: ClipboardCheck, badge: "New" },
        { label: "DevOps Center", href: "/devops", icon: Layers, badge: "New" },
        { label: "Documents", href: "/documents", icon: FileText },
        { label: "Design System", href: "/design-system", icon: Sparkles },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Team Space", href: "/settings/team", icon: Users },
        { label: "Billing & Plans", href: "/settings/billing", icon: User },
        { label: "Workspace Settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "bg-slate-950/40 backdrop-blur-xl border-r border-white/[0.06] h-screen select-none fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out font-sans flex flex-col justify-between",
        isCollapsed ? "w-[78px]" : "w-[260px]",
        className
      )}
      aria-label="Workspace Navigation Sidebar"
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/[0.06] h-16">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md flex items-center justify-center text-white shrink-0 ring-1 ring-emerald-500/25">
            <Terminal className="h-4.5 w-4.5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white font-sans">
                Expend<span className="font-black text-emerald-400">More</span>
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-0.5">
                Business OS
              </span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="text-slate-400 hover:text-white hover:bg-white/[0.04] p-1.5 rounded-lg transition-all duration-150 cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Switcher & Search Section */}
      <div className="p-3 flex flex-col gap-2 border-b border-white/[0.06]">
        <WorkspaceSwitcher isCollapsed={isCollapsed} />
        
        {/* Cmd+K Search trigger */}
        {isCollapsed ? (
          <Tooltip content="Search Workspace (⌘K)">
            <button
              onClick={handleOpenSearch}
              className="h-10 w-10 flex items-center justify-center bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl transition-all cursor-pointer focus:outline-none"
              aria-label="Search Shortcut"
            >
              <Search className="h-4 w-4 text-slate-400" />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={handleOpenSearch}
            className="flex items-center justify-between w-full h-10 px-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl transition-all text-left text-xs text-slate-400 font-medium cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <span>Search workspace...</span>
            </div>
            <kbd className="h-5 px-1.5 bg-slate-950 border border-white/[0.08] rounded text-[9px] font-bold text-slate-400 flex items-center leading-none">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5 scrollbar-thin">
        {navSections.map((sec, secIdx) => {
          const isCollapsible = "setOpen" in sec;

          return (
            <div key={secIdx} className="flex flex-col gap-1">
              {/* Category Header Label */}
              {!isCollapsed && !isCollapsible && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-550 px-3 mb-1">
                  {sec.title}
                </span>
              )}
              {!isCollapsed && isCollapsible && (
                <button
                  onClick={() => sec.setOpen?.(!sec.isOpen)}
                  className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-wider text-slate-550 hover:text-white px-3 mb-1 cursor-pointer transition-colors text-left"
                >
                  <span>{sec.title}</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      sec.isOpen ? "" : "-rotate-90"
                    )}
                  />
                </button>
              )}

              {/* Render item lists */}
              <AnimatePresence initial={false}>
                {(!isCollapsible || sec.isOpen || isCollapsed) && (
                  <motion.div
                    initial={isCollapsible ? { height: 0, opacity: 0 } : undefined}
                    animate={isCollapsible ? { height: "auto", opacity: 1 } : undefined}
                    exit={isCollapsible ? { height: 0, opacity: 0 } : undefined}
                    className="flex flex-col gap-0.5 overflow-hidden"
                  >
                    {sec.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/chat" &&
                          item.href !== "/dashboard" &&
                          pathname.startsWith(item.href));
                      const Icon = item.icon;

                      const itemElement = (
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center rounded-xl text-xs transition-all duration-150 focus:outline-none cursor-pointer relative group",
                            isCollapsed
                              ? "h-10 w-10 justify-center p-0"
                              : "px-3 py-2.5 gap-3",
                            isActive
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/10 border border-emerald-500/20"
                              : "text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          
                          {!isCollapsed && (
                            <span className="truncate flex-1 font-medium">{item.label}</span>
                          )}

                          {/* Badge tag counts */}
                          {!isCollapsed && item.badge && (
                            <span
                              className={cn(
                                "text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 border",
                                item.badge === "New"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-slate-900 text-slate-400 border-white/[0.06]"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}

                          {/* Collapsed state tiny dot notification alerts */}
                          {isCollapsed && item.badge && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-450 animate-pulse" />
                          )}
                        </Link>
                      );

                      if (isCollapsed) {
                        return (
                          <Tooltip key={item.href} content={item.label} side="right">
                            {itemElement}
                          </Tooltip>
                        );
                      }

                      return <React.Fragment key={item.href}>{itemElement}</React.Fragment>;
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Sidebar Expand Button for Collapsed Mode */}
      {isCollapsed && (
        <div className="p-3 mt-auto border-t border-white/[0.06] flex justify-center">
          <button
            onClick={toggleCollapse}
            className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.04] border border-white/[0.08] rounded-xl transition-all cursor-pointer focus:outline-none"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sidebar Expand Footer Info for Expanded Mode */}
      {!isCollapsed && (
        <div className="p-4 mt-auto border-t border-white/[0.06] flex flex-col gap-2 select-none">
          <Link
            href="/help"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.03] transition-all duration-150 focus:outline-none"
          >
            <HelpCircle className="h-4 w-4 shrink-0 text-slate-500" />
            <span>Support & Guides</span>
          </Link>
          
          <div className="flex items-center justify-between px-3 text-[9px] text-slate-500 font-bold border-t border-white/[0.04] pt-2.5">
            <span>Version 1.2.0</span>
            <span>&copy; 2026 ExpendMore</span>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
