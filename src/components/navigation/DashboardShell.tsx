"use client";

import React, { createContext, useContext } from "react";
import { useSidebar } from "@/store/use-sidebar";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { CommandPalette } from "@/components/ui/CommandPalette";

// Context to detect nested shell rendering
const DashboardShellContext = createContext(false);

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const isNested = useContext(DashboardShellContext);
  const { isCollapsed } = useSidebar();

  // If this shell is already rendered in a parent layout, bypass double-rendering
  if (isNested) {
    return <>{children}</>;
  }

  return (
    <DashboardShellContext.Provider value={true}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Global Command Palette (Cmd+K) Search Modal */}
        <CommandPalette />

        {/* Collapsible Sidebar Navigation */}
        <Sidebar className="hidden md:flex" />

        {/* Main Content Area Wrapper */}
        <div
          className={`flex flex-col flex-1 h-full overflow-hidden relative pb-16 md:pb-0 transition-[padding] duration-300 ease-in-out ${
            isCollapsed ? "md:pl-[80px]" : "md:pl-[280px]"
          }`}
        >
          {/* Top Navbar Header */}
          <Navbar />

          {/* Scrollable Canvas Body */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative focus:outline-none bg-brand-slate dark:bg-zinc-950/20">
            {children}
          </main>
        </div>
      </div>
    </DashboardShellContext.Provider>
  );
}

export default DashboardShell;
