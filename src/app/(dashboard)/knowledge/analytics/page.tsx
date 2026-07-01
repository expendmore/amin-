"use client";

import React, { useMemo } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import { BarChart3, TrendingUp, HardDrive, Clock, Search } from "lucide-react";

export default function KnowledgeAnalyticsPage() {
  const { collections, documents } = useKnowledgeBase();

  const totalDocumentsCount = documents.length;

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Knowledge Base Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze RAG queries execution speed, evaluate cache hit rates, and monitor vector collections allocation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total searches */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Query Count Today
            </h3>
            <Search className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            342 queries
          </span>
          <span className="text-[10px] text-brand-green font-bold flex items-center gap-0.5">
            <TrendingUp className="h-3.5 w-3.5" />
            +18% since yesterday
          </span>
        </Card>

        {/* Avg processing time */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Avg Indexing Speed
            </h3>
            <Clock className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            4.2 seconds
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Per 1,000 words extracted
          </span>
        </Card>

        {/* Cache hits ratio */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Cache hit ratio
            </h3>
            <HardDrive className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            92.4%
          </span>
          <span className="text-[10px] text-[#34A853] font-bold">
            Conserving generative API costs
          </span>
        </Card>
      </div>

      {/* Popular documents list */}
      <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-brand-navy dark:text-foreground text-left">
          Most Accessed Knowledge References
        </h3>

        <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800 p-4">
          {documents.slice(0, 3).map((d, idx) => {
            const hits = 150 - idx * 45;
            return (
              <div key={d.id} className="py-3 flex items-center justify-between text-xs font-semibold text-on-surface-variant text-left">
                <span className="text-brand-navy dark:text-foreground font-bold">{d.name}</span>
                <span className="font-mono">{hits} hits</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
