"use client";

import React, { useMemo, useState } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Search, CheckCircle2, AlertCircle, Bookmark } from "lucide-react";

export default function SemanticSearchPage() {
  const { addToast } = useToast();
  const { chunks, documents } = useKnowledgeBase();

  const [query, setQuery] = useState("How to clone and configure port details?");
  const [threshold, setThreshold] = useState(0.7);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);

    setTimeout(() => {
      // Find matches in all doc chunks
      const matches: any[] = [];
      Object.keys(chunks).forEach((docId) => {
        const doc = documents.find((d) => d.id === docId);
        const list = chunks[docId] || [];
        
        list.forEach((chk) => {
          // simple search contains simulation
          if (chk.content.toLowerCase().includes("clone") || chk.content.toLowerCase().includes("port") || chk.content.toLowerCase().includes("broadcast")) {
            matches.push({
              ...chk,
              docName: doc?.name || "Document",
              score: 0.78 + Math.random() * 0.18 // simulated high similarity
            });
          }
        });
      });

      const filtered = matches.filter((m) => m.score >= threshold).sort((a, b) => b.score - a.score);
      setResults(filtered);
      setIsSearching(false);
      addToast(`Retrieved ${filtered.length} matches from vector space.`, "success");
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Semantic Search Sandbox
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Test natural language queries vector matches, set similarity thresholds, and inspect highlighted contexts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Search query box */}
        <Card className="lg:col-span-4 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Natural Language Query
              </label>
              <Input
                placeholder="Ask something about company policies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>

            {/* Threshold slider */}
            <div className="flex flex-col gap-1 bg-brand-slate p-3 rounded-lg border border-brand-border/40 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/75 flex justify-between">
                <span>Similarity Threshold</span>
                <span className="font-mono text-brand-sky font-bold">{threshold.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="accent-brand-sky w-full cursor-pointer mt-1"
              />
            </div>

            <Button
              type="submit"
              variant="success"
              size="sm"
              className="font-bold text-white w-full mt-2"
              isLoading={isSearching}
              leftIcon={<Search className="h-4 w-4 text-white" />}
            >
              Search Vector Database
            </Button>
          </form>
        </Card>

        {/* Search results list */}
        <Card className="lg:col-span-8 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left min-h-[300px]">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Similarity Matches Timeline
          </h3>

          <div className="flex flex-col gap-3.5">
            {results.map((res, idx) => (
              <div
                key={idx}
                className="p-4 border border-brand-border dark:border-zinc-800 bg-brand-slate/30 rounded-xl flex flex-col gap-2.5 text-left font-sans"
              >
                <div className="flex items-center justify-between gap-3 text-[10px] font-bold border-b border-brand-border pb-2">
                  <span className="text-brand-navy dark:text-foreground flex items-center gap-1.5">
                    <Bookmark className="h-3.5 w-3.5 text-brand-sky" />
                    Source: {res.docName}
                  </span>
                  <span className="text-brand-green font-extrabold font-mono">
                    Score: {(res.score * 100).toFixed(1)}% match
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant/90 leading-relaxed font-semibold italic">
                  "...{res.content}..."
                </p>

                {res.pageNumber && (
                  <span className="text-[9px] font-bold text-on-surface-variant/60 block uppercase">
                    Location: Page {res.pageNumber}
                  </span>
                )}
              </div>
            ))}

            {results.length === 0 && !isSearching && (
              <div className="py-12 text-center text-xs text-on-surface-variant font-medium">
                No matching vectors returned. Adjust similarity thresholds or verify index keywords.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
