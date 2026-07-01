"use client";

import React, { useMemo, useState } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Search, Eye, Filter, Sparkles, Cpu, Layers } from "lucide-react";
import { ModelCategory } from "@/types/ai-provider";

export default function ModelLibraryPage() {
  const { addToast } = useToast();
  const { models, providers, toggleModel } = useAIProvider();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<ModelCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "context" | "cost" | "latency">("name");

  const filteredModels = useMemo(() => {
    return models
      .filter((m) => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              m.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = filterCategory === "all" || m.category === filterCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === "context") return b.contextWindow - a.contextWindow;
        if (sortBy === "cost") return a.inputCostPer1M - b.inputCostPer1M;
        if (sortBy === "latency") return a.latencyMs - b.latencyMs;
        return a.name.localeCompare(b.name);
      });
  }, [models, searchQuery, filterCategory, sortBy]);

  const handleToggle = (id: string) => {
    toggleModel(id);
    const m = models.find((mod) => mod.id === id);
    const state = m?.isEnabled ? "disabled" : "enabled";
    addToast(`Successfully ${state} model routing path: ${m?.name}`, "info");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            AI Model Library Catalog
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Browse available foundational and local LLM models, inspect pricing, and enable routing endpoints.
          </p>
        </div>
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-brand-slate dark:bg-zinc-900/40 p-4 rounded-xl border border-brand-border/60 justify-between">
        <div className="flex items-center gap-2.5 w-full sm:w-auto bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl">
          <Search className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
          <input
            type="text"
            placeholder="Search catalog models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full sm:w-64 font-semibold text-brand-navy dark:text-foreground placeholder:text-on-surface-variant/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-navy dark:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="chat">Chat / Conversation</option>
              <option value="reasoning">Reasoning / Thought</option>
              <option value="vision">Vision / Multimodal</option>
              <option value="embedding">Embedding Index</option>
              <option value="code">Code Generation</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider shrink-0">
              Sort
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-navy dark:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="name">Model Name</option>
              <option value="context">Context Window</option>
              <option value="cost">Input Cost (Low-High)</option>
              <option value="latency">Response Latency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((m) => {
          const prov = providers.find((p) => p.id === m.providerId);
          return (
            <Card
              key={m.id}
              className={`p-5 border flex flex-col justify-between gap-4 transition-all duration-200 ${
                m.isEnabled
                  ? "border-brand-border bg-white dark:bg-zinc-950"
                  : "border-brand-border/40 bg-brand-slate/40 dark:bg-zinc-900/10 opacity-70"
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col text-left">
                    <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
                      {m.name}
                      {m.isReasoning && (
                        <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                          Reasoning
                        </span>
                      )}
                    </h3>
                    <span className="text-[10px] text-on-surface-variant/80 font-bold capitalize mt-0.5">
                      Platform: {prov?.name || m.providerId}
                    </span>
                  </div>

                  <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-on-surface-variant px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                    {m.category}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-brand-border/60 pt-3 text-xs font-semibold text-on-surface-variant/90 text-left">
                  <div className="flex justify-between">
                    <span>Context Window</span>
                    <span className="text-brand-navy dark:text-foreground font-bold">
                      {m.contextWindow.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input Cost / 1M tokens</span>
                    <span className="text-brand-navy dark:text-foreground font-bold">
                      ${m.inputCostPer1M.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Output Cost / 1M tokens</span>
                    <span className="text-brand-navy dark:text-foreground font-bold">
                      ${m.outputCostPer1M.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Latency</span>
                    <span className="text-brand-navy dark:text-foreground font-bold">
                      {m.latencyMs} ms
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-auto">
                <Button
                  variant={m.isEnabled ? "outline" : "success"}
                  size="xs"
                  className="font-bold"
                  onClick={() => handleToggle(m.id)}
                >
                  {m.isEnabled ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredModels.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-on-surface-variant">
            No models matched filter parameters in active libraries.
          </div>
        )}
      </div>
    </div>
  );
}
