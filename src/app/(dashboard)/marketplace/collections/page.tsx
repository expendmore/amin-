"use client";

import React, { useMemo } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { Bookmark, ShieldCheck, Tag, Star, ArrowRight } from "lucide-react";

export default function StoreCollectionsPage() {
  const { items } = useMarketplace();

  const officialItems = useMemo(() => {
    return items.filter((it) => it.publisher.includes("Official"));
  }, [items]);

  const premiumItems = useMemo(() => {
    return items.filter((it) => it.pricingType === "premium");
  }, [items]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Marketplace Collections
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Explore themed template packs verified by ExpendMore QA team members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Official verified */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 border-b border-brand-border pb-3">
            <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
            Official Verified Collections
          </h3>

          <div className="flex flex-col gap-3">
            {officialItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-brand-slate rounded-xl border border-brand-border flex items-center justify-between gap-3 text-left"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">{item.name}</span>
                  <span className="text-[9px] text-on-surface-variant/80 font-semibold block mt-0.5">
                    Uptime SLA guarantee • Free installs
                  </span>
                </div>

                <Link href={`/marketplace/details?id=${item.id}`}>
                  <button className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Premium collections */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 border-b border-brand-border pb-3">
            <Tag className="h-4.5 w-4.5 text-brand-sky" />
            Premium Creator Packs
          </h3>

          <div className="flex flex-col gap-3">
            {premiumItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-brand-slate rounded-xl border border-brand-border flex items-center justify-between gap-3 text-left"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">{item.name}</span>
                  <span className="text-[9px] text-on-surface-variant/80 font-semibold block mt-0.5">
                    Price: ${item.price.toFixed(2)} USD • Author: {item.publisher}
                  </span>
                </div>

                <Link href={`/marketplace/details?id=${item.id}`}>
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
