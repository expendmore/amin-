"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  FolderOpen,
  Search,
  Bell,
  Menu,
  Plus,
  Sparkles,
  Bolt,
  Bot,
  Mail,
  HelpCircle,
  Briefcase,
  Settings,
  ChevronDown,
  Globe,
} from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { NotificationPanel } from "@/components/ui/NotificationPanel";
import { ProfileMenu } from "@/components/ui/ProfileMenu";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import Sidebar from "./Sidebar";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeWorkspace, setActiveWorkspace] = useState("Personal Workspace");

  const mobileNavItems = [
    { label: "Home", href: "/dashboard", icon: MessageSquare }, // Changed slightly for standard home
    { label: "Chat", href: "/chat", icon: MessageSquare },
    { label: "WhatsApp", href: "/whatsapp", icon: MessageSquare },
    { label: "Files", href: "/files", icon: FolderOpen },
  ];

  const handleOpenSearch = () => {
    // Open Cmd+K command palette globally
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      })
    );
  };

  const workspaces = [
    { name: "Personal Workspace", key: "personal" },
    { name: "Anshuman Enterprises", key: "anshuman" },
  ];

  return (
    <>
      {/* Desktop Header Navigation */}
      <header className="h-16 w-full hidden md:flex items-center justify-between px-6 border-b border-white/[0.06] bg-slate-950/40 backdrop-blur-xl sticky top-0 z-40 select-none transition-colors">
        {/* Left Section: Breadcrumbs */}
        <div className="flex items-center gap-2">
          <Breadcrumbs />
        </div>

        {/* Middle/Right Section: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Workspace selector dropdown in Top Nav */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] rounded-xl text-xs font-semibold text-slate-300 cursor-pointer focus:outline-none">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                <span>{activeWorkspace}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-450" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-slate-900 border border-white/[0.08] rounded-xl">
              <DropdownMenuLabel className="text-slate-400">Switch Workspace</DropdownMenuLabel>
              <DropdownMenuSeparator className="border-white/[0.06]" />
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.key}
                  className="hover:bg-white/[0.04] text-slate-200 focus:bg-white/[0.04] rounded-lg cursor-pointer"
                  onClick={() => {
                    setActiveWorkspace(ws.name);
                    router.push("/dashboard");
                  }}
                >
                  {ws.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Search trigger button */}
          <button
            onClick={handleOpenSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs text-slate-400 rounded-xl w-48 text-left transition-colors cursor-pointer focus:outline-none"
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span>Search workspace...</span>
            <kbd className="h-4 px-1 bg-slate-950 border border-white/[0.08] rounded text-[9px] font-bold text-slate-400 ml-auto leading-none flex items-center">
              ⌘K
            </kbd>
          </button>

          {/* Create New Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/10 rounded-xl text-xs font-bold cursor-pointer shadow-sm focus:outline-none hover:scale-[1.02] active:scale-95 transition-all">
                <Plus className="h-4 w-4" />
                <span>Create</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border border-white/[0.08] rounded-xl">
              <DropdownMenuLabel className="text-slate-400">Create New Asset</DropdownMenuLabel>
              <DropdownMenuSeparator className="border-white/[0.06]" />
              <DropdownMenuItem className="hover:bg-white/[0.04] text-slate-200 focus:bg-white/[0.04] rounded-lg cursor-pointer" onClick={() => router.push("/workflows?create=true")}>
                <Bolt className="mr-2 h-4 w-4 text-slate-450" />
                <span>New Workflow</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/[0.04] text-slate-200 focus:bg-white/[0.04] rounded-lg cursor-pointer" onClick={() => router.push("/chat/agents?create=true")}>
                <Bot className="mr-2 h-4 w-4 text-slate-450" />
                <span>New AI Agent</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/[0.04] text-slate-200 focus:bg-white/[0.04] rounded-lg cursor-pointer" onClick={() => router.push("/whatsapp/campaigns?create=true")}>
                <Mail className="mr-2 h-4 w-4 text-slate-450" />
                <span>New Campaign</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Selector */}
          <ThemeSwitch />

          {/* Notifications List center */}
          <NotificationPanel />

          {/* Divider */}
          <div className="h-5 w-px bg-white/[0.06]" />

          {/* User Profile dropdown */}
          <ProfileMenu showLabel={false} />
        </div>
      </header>

      {/* Mobile Top Header Navigation */}
      <header className="h-14 w-full flex md:hidden items-center justify-between px-4 bg-slate-950/40 border-b border-white/[0.06] z-20 shrink-0 sticky top-0 select-none transition-colors backdrop-blur-xl">
        <div className="flex items-center gap-2">
          {/* Mobile slide sidebar toggle */}
          <Drawer>
            <DrawerTrigger asChild>
              <button
                className="h-9 w-9 flex items-center justify-center bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer focus:outline-none"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="h-5 w-5 text-slate-300" />
              </button>
            </DrawerTrigger>
            <DrawerContent side="left" className="p-0 max-w-[280px] bg-slate-950 border-r border-white/[0.08]">
              <div className="h-full flex flex-col [&>aside]:flex [&>aside]:w-full [&>aside]:border-none [&>aside]:h-full [&>aside]:relative bg-slate-950">
                <Sidebar />
              </div>
            </DrawerContent>
          </Drawer>

          <span className="text-sm font-semibold tracking-tight text-white font-sans">
            Expend<span className="font-black text-emerald-400">More</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenSearch}
            className="h-9 w-9 flex items-center justify-center bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer focus:outline-none"
            aria-label="Global search trigger"
          >
            <Search className="h-4 w-4 text-slate-300" />
          </button>
          
          <NotificationPanel />
        </div>
      </header>

      {/* Mobile Bottom Navigation Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-xl border-t border-white/[0.06] flex md:hidden items-center justify-around z-30 px-2 pb-safe shadow-lg transition-colors">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all duration-150 focus:outline-none",
                isActive
                  ? "text-emerald-400 font-bold"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-[10px] tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all duration-150 focus:outline-none",
            pathname === "/settings"
              ? "text-emerald-400 font-bold"
              : "text-slate-400 hover:text-white"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span className="text-[10px] tracking-tight font-medium">Settings</span>
        </Link>
      </nav>
    </>
  );
}

export default Navbar;
