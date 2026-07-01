"use client";

import React, { useMemo } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Compass, Sparkles, TrendingUp, Layout, Star, ArrowRight } from "lucide-react";

export default function MarketplaceHomePage() {
  const { items, creatorStats } = useMarketplace();

  const featuredItems = useMemo(() => {
    return items.filter((it) => it.publisher.includes("Official") || it.pricingType === "free");
  }, [items]);

  const trendingItems = useMemo(() => {
    return items.filter((it) => it.pricingType === "premium");
  }, [items]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            ExpendMore Hub & Template Store
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Discover workflow configurations, download verified chatbot agents, and monetize custom extensions.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/marketplace/browse">
            <Button variant="success" size="sm" className="font-bold text-white" leftIcon={<Compass className="h-4 w-4 text-white" />}>
              Browse Catalog
            </Button>
          </Link>
          <Link href="/marketplace/upload">
            <Button variant="outline" size="sm" className="font-bold">
              Publish Asset
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Published count */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Your Published Templates</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {creatorStats.publishedCount} items
            </span>
          </div>
          <Layout className="h-5 w-5 text-brand-sky shrink-0" />
        </Card>

        {/* Total downloads */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Direct Downloads</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {creatorStats.totalDownloads} installs
            </span>
          </div>
          <TrendingUp className="h-5 w-5 text-brand-green shrink-0" />
        </Card>

        {/* Rating */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Average Rating</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {creatorStats.averageRating} / 5.0
            </span>
          </div>
          <Star className="h-5 w-5 text-amber-500 fill-amber-500 shrink-0" />
        </Card>

        {/* Revenue */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950 font-sans">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">Creator Revenue</span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              ${creatorStats.totalRevenue.toFixed(2)} USD
            </span>
          </div>
          <Sparkles className="h-5 w-5 text-purple-500 shrink-0" />
        </Card>
      </div>

      {/* Featured & Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Items list */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-brand-sky" />
            Featured Templates
          </h3>

          <div className="flex flex-col gap-3">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 border border-brand-border dark:border-zinc-800 bg-brand-slate/40 dark:bg-zinc-900/10 rounded-xl flex items-center justify-between gap-3 text-left font-sans"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/80 font-semibold truncate mt-0.5">
                    Publisher: {item.publisher} • {item.downloadsCount.toLocaleString()} downloads
                  </span>
                </div>

                <Link href="/marketplace/details">
                  <button className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Trending items */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-brand-green" />
            Trending Premium Assets
          </h3>

          <div className="flex flex-col gap-3">
            {trendingItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 border border-brand-border dark:border-zinc-800 bg-brand-slate/40 dark:bg-zinc-900/10 rounded-xl flex items-center justify-between gap-3 text-left font-sans"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/80 font-semibold truncate mt-0.5">
                    Price: ${item.price.toFixed(2)} USD • Rating: {item.rating}
                  </span>
                </div>

                <Link href="/marketplace/details">
                  <button className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
