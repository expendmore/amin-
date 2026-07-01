"use client";

import React, { useMemo, useState } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { Search, Compass, BookOpen, Star, FileText } from "lucide-react";

export default function BrowseMarketplacePage() {
  const { items } = useMarketplace();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "workflows" | "agents" | "prompts" | "chatbots">("all");

  const filteredItems = useMemo(() => {
    return items
      .filter((it) => {
        const matchesSearch = it.name.toLowerCase().includes(query.toLowerCase()) ||
                              it.description.toLowerCase().includes(query.toLowerCase());
        const matchesCat = activeCategory === "all" || it.category === activeCategory;
        return matchesSearch && matchesCat;
      });
  }, [items, query, activeCategory]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Browse Store
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Browse workflow recipes, prompts, and chatbot integrations built by developers.
          </p>
        </div>
      </div>

      {/* Search & filter tabs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-brand-border/60">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-on-surface-variant/65 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg focus:outline-none placeholder:text-on-surface-variant/50 text-brand-navy dark:text-foreground"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 select-none overflow-x-auto">
          {([
            { label: "All Items", key: "all" },
            { label: "Workflows", key: "workflows" },
            { label: "AI Agents", key: "agents" },
            { label: "Prompts", key: "prompts" },
            { label: "Chatbots", key: "chatbots" }
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`h-8 px-3 rounded-lg text-xs font-bold capitalize transition-all duration-150 cursor-pointer shrink-0 ${
                activeCategory === tab.key
                  ? "bg-brand-navy text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                  : "text-on-surface-variant/80 hover:bg-brand-slate/60 hover:text-brand-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="p-5 border border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left font-sans"
          >
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] bg-slate-100 dark:bg-zinc-900 text-on-surface-variant/80 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-bold text-brand-navy dark:text-foreground">
                  {item.pricingType === "free" ? "FREE" : `$${item.price.toFixed(2)}`}
                </span>
              </div>

              <div className="flex flex-col text-left">
                <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
                  {item.name}
                </h3>
                <p className="text-[10px] text-on-surface-variant/80 font-medium mt-1.5 leading-relaxed truncate">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/70 font-semibold mt-1">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{item.rating}</span>
                <span>•</span>
                <span>{item.downloadsCount.toLocaleString()} downloads</span>
              </div>
            </div>

            <div className="border-t border-brand-border pt-4 mt-2">
              <Link href={`/marketplace/details?id=${item.id}`} className="no-underline">
                <button className="w-full text-xs font-bold bg-brand-slate dark:bg-zinc-900 hover:bg-brand-slate/60 text-brand-navy dark:text-foreground py-2 rounded-lg transition-colors border border-brand-border/60 cursor-pointer">
                  Inspect Asset
                </button>
              </Link>
            </div>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-on-surface-variant select-none">
            No matching templates found in template catalog.
          </div>
        )}
      </div>
    </div>
  );
}
