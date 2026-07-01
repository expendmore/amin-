"use client";

import React, { useMemo, useState } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Search, Folder, FileText, ChevronRight } from "lucide-react";

export default function GlobalSearchPage() {
  const { files, folders } = useFiles();

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video" | "document">("all");

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const matchesFiles = files
      .filter(f => !f.isTrashed)
      .filter((f) => {
        const nameMatch = f.name.toLowerCase().includes(query.toLowerCase());
        const typeMatch = filterType === "all" || f.type === filterType;
        return nameMatch && typeMatch;
      });

    return matchesFiles;
  }, [files, query, filterType]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Global Search Engine
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Search files names, match custom metadata parameters tags, and find files immediately.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Search configurations */}
        <Card className="lg:col-span-4 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Query Keywords
            </label>
            <Input
              placeholder="e.g. Campaign graphics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
            >
              <option value="all">All File Formats</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </Card>

        {/* Results grid */}
        <Card className="lg:col-span-8 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left min-h-[300px]">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Search Results Index
          </h3>

          <div className="flex flex-col gap-3">
            {filteredResults.map((file) => {
              const fold = folders.find((f) => f.id === file.folderId);
              return (
                <div
                  key={file.id}
                  className="p-3.5 border border-brand-border dark:border-zinc-800 bg-brand-slate/40 dark:bg-zinc-900/10 rounded-xl flex items-center justify-between gap-3 text-left font-sans"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-4.5 w-4.5 text-brand-sky shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
                        {file.name}
                      </span>
                      <span className="text-[9px] text-on-surface-variant/80 font-semibold truncate">
                        Folder: {fold?.name || "Root"} • Size: {file.size}
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-on-surface-variant px-2 py-0.5 rounded uppercase font-bold shrink-0">
                    {file.type}
                  </span>
                </div>
              );
            })}

            {filteredResults.length === 0 && (
              <div className="py-12 text-center text-xs text-on-surface-variant font-medium select-none">
                No matching results listed. Input text in query window.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
