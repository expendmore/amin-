"use client";

import React from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import FileServiceNav from "@/components/files/FileServiceNav";

export default function FilesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
        {/* Left Sub-sidebar navigation */}
        <FileServiceNav className="hidden md:flex" />

        {/* Scrollable Main Area for DAM features */}
        <div className="flex-1 overflow-y-auto bg-brand-slate dark:bg-zinc-950/20 p-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {children}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
