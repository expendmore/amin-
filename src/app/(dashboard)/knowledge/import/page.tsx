"use client";

import React, { useMemo, useState } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Globe, RefreshCw, Layers, CheckCircle2 } from "lucide-react";

export default function WebsiteImportPage() {
  const { addToast } = useToast();
  const { collections, uploadDocument } = useKnowledgeBase();

  const [selectedColId, setSelectedColId] = useState(collections[0]?.id || "");
  const [siteUrl, setSiteUrl] = useState("https://docs.expendmore.ai");
  const [crawlDepth, setCrawlDepth] = useState(2);
  const [isCrawling, setIsCrawling] = useState(false);

  const handleStartCrawl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteUrl.trim()) return;
    if (!selectedColId) {
      addToast("Please select a target collection first", "error");
      return;
    }

    setIsCrawling(true);
    setTimeout(() => {
      setIsCrawling(false);
      const host = new URL(siteUrl).hostname;
      const docName = `${host}_sitemap.xml`;
      uploadDocument(docName, "text/xml", "45 KB", selectedColId);
      addToast(`Website crawl on "${siteUrl}" completed. Sitemap documents indexed.`, "success");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Website Import Crawler
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Index public sitemaps urls, set recursive links crawl depths, and exclude paths policies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crawler panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <form onSubmit={handleStartCrawl} className="flex flex-col gap-5 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Target Collection
                </label>
                <select
                  value={selectedColId}
                  onChange={(e) => setSelectedColId(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name} ({col.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Website / Sitemap URL
                </label>
                <Input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Depth slider */}
            <div className="flex flex-col gap-1 bg-brand-slate p-3.5 rounded-xl border border-brand-border/40 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/75 flex justify-between">
                <span>Maximum Crawl Depth</span>
                <span className="font-bold font-mono text-brand-sky">{crawlDepth} levels</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={crawlDepth}
                onChange={(e) => setCrawlDepth(parseInt(e.target.value))}
                className="accent-brand-sky w-full cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0"
                isLoading={isCrawling}
                leftIcon={<Globe className="h-4 w-4 text-white" />}
              >
                Start Crawler Engine
              </Button>
            </div>
          </form>
        </Card>

        {/* Crawler notes */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-brand-sky" />
              Crawling Policies guidelines
            </h3>

            <div className="flex flex-col gap-3.5 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Robot.txt compliance:</strong> Crawlers automatically respect target hostname access regulations and skip protected paths.
                </p>
              </div>

              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Canonical matching:</strong> Duplicate document items matching canonical urls lists are skipped to preserve vector storage.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
