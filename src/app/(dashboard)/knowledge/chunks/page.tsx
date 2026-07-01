"use client";

import React, { useMemo, useState } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import { Scissors, Search, Filter } from "lucide-react";

export default function ChunkViewerPage() {
  const { chunks, documents } = useKnowledgeBase();

  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || "doc-3");
  const [searchQuery, setSearchQuery] = useState("");

  const activeChunks = useMemo(() => {
    const list = chunks[selectedDocId] || [];
    return list.filter((chk) => chk.content.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chunks, selectedDocId, searchQuery]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Document Chunks Viewer
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Inspect split paragraph chunks, evaluate token lengths, and audit document extraction outputs.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-brand-slate dark:bg-zinc-900/40 p-4 rounded-xl border border-brand-border/60 justify-between">
        <div className="flex items-center gap-2.5 w-full sm:w-auto bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl">
          <Search className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
          <input
            type="text"
            placeholder="Search chunk contents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full sm:w-64 font-semibold text-brand-navy dark:text-foreground placeholder:text-on-surface-variant/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-navy dark:text-foreground focus:outline-none cursor-pointer"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chunks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeChunks.map((chk) => (
          <Card key={chk.id} className="p-5 border border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left font-sans">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <span className="text-[10px] font-bold text-brand-sky flex items-center gap-1">
                  <Scissors className="h-3.5 w-3.5" />
                  Chunk ID: {chk.id}
                </span>
                <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-on-surface-variant px-1.5 py-0.5 rounded font-bold uppercase">
                  {chk.tokenCount} tokens
                </span>
              </div>

              <p className="text-xs text-on-surface-variant/90 leading-relaxed font-semibold italic bg-brand-slate/40 dark:bg-zinc-900/10 p-3 rounded-lg border border-brand-border/40 max-h-36 overflow-y-auto">
                "{chk.content}"
              </p>
            </div>

            {/* metadata properties */}
            <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold text-on-surface-variant/65 pt-2 border-t border-brand-border/60">
              {chk.pageNumber && (
                <span>Page: {chk.pageNumber}</span>
              )}
              {Object.entries(chk.metadata).map(([key, val]) => (
                <span key={key} className="capitalize">
                  {key}: {val}
                </span>
              ))}
            </div>
          </Card>
        ))}

        {activeChunks.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-on-surface-variant">
            No chunks registered or found matching search parameters for selected document.
          </div>
        )}
      </div>
    </div>
  );
}
