"use client";

import React, { useMemo } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import { Sparkles, TrendingUp, Users, DollarSign } from "lucide-react";

export default function CreatorDashboardPage() {
  const { items, creatorStats } = useMarketplace();

  const published = useMemo(() => {
    return items.filter((it) => it.publisher.includes("Operator") || it.publisher.includes("Aditya"));
  }, [items]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Creator Dashboard
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor downloads trends analytics, inspect revenue logs placeholders, and manage published templates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Total Creator Revenue
            </h3>
            <DollarSign className="h-4.5 w-4.5 text-brand-green" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            ${creatorStats.totalRevenue.toFixed(2)} USD
          </span>
          <span className="text-[10px] text-brand-green font-bold">
            Paid out monthly via Stripe placeholders
          </span>
        </Card>

        {/* Total Downloads */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Template Installs
            </h3>
            <TrendingUp className="h-4.5 w-4.5 text-brand-sky" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {creatorStats.totalDownloads} downloads
          </span>
          <span className="text-[10px] text-brand-sky font-bold">
            +8.4% weekly growth rate
          </span>
        </Card>

        {/* Followers */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Creator Followers
            </h3>
            <Users className="h-4.5 w-4.5 text-purple-500" />
          </div>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {creatorStats.activeFollowers} members
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Notified on new item publishing releases
          </span>
        </Card>
      </div>

      {/* Published list */}
      <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-brand-navy dark:text-foreground text-left">
          Your Published Listings
        </h3>

        <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
          {published.map((it) => (
            <div key={it.id} className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                  {it.name}
                </span>
                <span className="text-[10px] text-on-surface-variant/80 font-semibold uppercase">
                  Category: {it.category} • Price: ${it.price}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-bold text-brand-navy dark:text-foreground">
                  {it.downloadsCount} installs
                </span>
              </div>
            </div>
          ))}

          {published.length === 0 && (
            <span className="text-xs text-on-surface-variant/80 p-8 text-center font-medium block">
              No items published. Access the Upload Wizard to list templates.
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
