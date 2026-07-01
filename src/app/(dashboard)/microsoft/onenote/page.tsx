"use client";

import React, { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Book, FileText, Search } from "lucide-react";

export default function OneNotePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const notebooks = [
    { id: "nb-1", name: "Anshuman Enterprises Wiki", sections: 3, pagesCount: 14 },
    { id: "nb-2", name: "WhatsApp Campaigns Board Notes", sections: 2, pagesCount: 8 }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            OneNote Integration
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Browse OneNote organization notebooks, review campaign minutes, and search team pages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
        {/* Notebooks list */}
        <Card className="lg:col-span-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-brand-border flex items-center gap-2">
            <Search className="h-4 w-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search notebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-xs focus:outline-none text-brand-navy dark:text-foreground font-semibold placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="divide-y divide-brand-border overflow-y-auto max-h-[350px]">
            {notebooks.map((nb) => (
              <div
                key={nb.id}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Book className="h-5 w-5 text-purple-600 shrink-0" />
                  <div className="flex flex-col min-w-0 text-left font-sans">
                    <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                      {nb.name}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                      {nb.sections} sections • {nb.pagesCount} pages
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notebook details page preview */}
        <Card className="lg:col-span-7 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col items-center justify-center text-center gap-3.5 min-h-[300px]">
          <FileText className="h-10 w-10 text-purple-600" />
          <div className="flex flex-col gap-0.5">
            <h4 className="font-extrabold text-xs text-brand-navy dark:text-foreground">
              OneNote Notebook Viewer
            </h4>
            <p className="text-[10px] text-on-surface-variant/80 max-w-[280px] leading-relaxed font-semibold">
              Select any wiki page from the active notebook directory on the left to read notes, meeting transcripts, and project logs.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
