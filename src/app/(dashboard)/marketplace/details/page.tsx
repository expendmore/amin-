"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useToast } from "@/store/use-toast";
import { Check, Star, Download, ChevronRight, HelpCircle } from "lucide-react";

export default function TemplateDetailsPage() {
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { items, purchaseItem } = useMarketplace();

  const id = searchParams.get("id") || "item-1";

  const itemObj = useMemo(() => {
    return items.find((x) => x.id === id) || items[0];
  }, [items, id]);

  const handlePurchase = () => {
    if (!itemObj) return;
    purchaseItem(itemObj.id);
    addToast("Asset purchased successfully. Now available in library.", "success");
  };

  if (!itemObj) {
    return <div className="p-8 text-xs text-on-surface-variant font-medium text-left">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div className="text-left font-sans flex flex-col gap-1 min-w-0">
          <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block w-fit">
            {itemObj.category}
          </span>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight truncate mt-1">
            {itemObj.name}
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Published by: {itemObj.publisher}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 select-none">
          {itemObj.isPurchased ? (
            <Link href={`/marketplace/install?id=${itemObj.id}`}>
              <Button variant="success" size="sm" className="font-bold text-white">
                One-Click Install
              </Button>
            </Link>
          ) : (
            <Button variant="success" size="sm" className="font-bold text-white" onClick={handlePurchase}>
              Purchase - ${itemObj.price} USD
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex flex-col gap-1">
            <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
              Overview Description
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed font-medium mt-1">
              {itemObj.detailedDescription || itemObj.description}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 border-t border-brand-border pt-4 mt-2">
            <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
              Capabilities included
            </h3>
            <div className="flex flex-col gap-2 text-xs font-semibold text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <span>One-click directory deployment integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <span>Pre-configured workspace permissions mapping</span>
              </div>
            </div>
          </div>
        </Card>

        {/* side panel meta info */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Specifications
            </h3>

            <div className="flex flex-col gap-3.5 text-xs font-semibold text-on-surface-variant">
              <div className="flex justify-between items-center">
                <span>Direct Downloads</span>
                <span className="font-mono text-brand-navy dark:text-foreground font-bold">{itemObj.downloadsCount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-brand-border/60">
                <span>Rating</span>
                <span className="font-mono text-brand-navy dark:text-foreground font-bold">{itemObj.rating} / 5.0</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-brand-border/60">
                <span>License scope</span>
                <span className="font-mono text-brand-navy dark:text-foreground font-bold capitalize">{itemObj.licenseType}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
