"use client";

import React, { useMemo, useState } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { History, Search, Filter, Download } from "lucide-react";

export default function AIUsageLogsPage() {
  const { addToast } = useToast();
  const { costs, models } = useAIProvider();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterProvider, setFilterProvider] = useState("all");

  const filteredLogs = useMemo(() => {
    return costs.filter((c) => {
      const matchesSearch = c.modelId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProv = filterProvider === "all" || c.providerId === filterProvider;
      return matchesSearch && matchesProv;
    });
  }, [costs, searchQuery, filterProvider]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Endpoint Usage Logs
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review detailed API requests histories, examine latency statistics, and audit token spends.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addToast("Exported usage logs timeline", "success")}
          className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/40"
          leftIcon={<Download className="h-4 w-4" />}
        >
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-brand-slate dark:bg-zinc-900/40 p-4 rounded-xl border border-brand-border/60 justify-between">
        <div className="flex items-center gap-2.5 w-full sm:w-auto bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl">
          <Search className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
          <input
            type="text"
            placeholder="Search by model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full sm:w-64 font-semibold text-brand-navy dark:text-foreground placeholder:text-on-surface-variant/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-navy dark:text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">All Providers</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="deepseek">DeepSeek</option>
          </select>
        </div>
      </div>

      {/* Logs timeline list */}
      <Card className="border-brand-border bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="divide-y divide-brand-border">
          {filteredLogs.map((log, idx) => {
            const mName = models.find(m => m.id === log.modelId)?.name || log.modelId;
            return (
              <div key={idx} className="p-4 flex items-start gap-3.5 text-left font-sans">
                <History className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-bold gap-4">
                    <span className="text-brand-navy dark:text-foreground flex items-center gap-2">
                      API request sent to: {mName}
                      <span className="text-[9px] font-bold bg-slate-100 dark:bg-zinc-800 text-on-surface-variant/80 px-2 py-0.5 rounded uppercase">
                        {log.providerId}
                      </span>
                    </span>
                    <span className="text-[10px] text-on-surface-variant/60 font-semibold shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3.5 text-[10px] font-semibold text-on-surface-variant mt-1">
                    <span>Input: {log.promptTokens} tokens</span>
                    <span>Output: {log.completionTokens} tokens</span>
                    <span className="text-brand-green">Spent: ${log.totalCost.toFixed(5)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center text-xs text-on-surface-variant">
              No usage logs matched query rules.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
