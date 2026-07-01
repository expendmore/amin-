"use client";

import React, { useMemo } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useToast } from "@/store/use-toast";
import { Star, Trash2 } from "lucide-react";

export default function FavoritesPage() {
  const { addToast } = useToast();
  const { items, toggleFavoriteItem } = useMarketplace();

  const favorited = useMemo(() => {
    return items.filter((it) => it.isFavorite);
  }, [items]);

  const handleRemove = (id: string) => {
    toggleFavoriteItem(id);
    addToast("Asset template removed from your favorites list.", "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Saved Wishlist
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review templates pinned for review, inspect rating summaries, and install wishlisted assets.
          </p>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorited.map((item) => (
          <Card key={item.id} className="p-4 border border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-3 text-left font-sans">
            <div className="flex flex-col gap-2.5">
              <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 text-on-surface-variant/80 px-2 py-0.5 rounded font-bold uppercase tracking-wider block w-fit">
                {item.category}
              </span>
              <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate block mt-0.5">
                {item.name}
              </span>
              <p className="text-[10px] text-on-surface-variant/80 leading-relaxed font-semibold line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="border-t border-brand-border pt-4 mt-2 flex items-center justify-between gap-3">
              <Link href={`/marketplace/details?id=${item.id}`} className="flex-1">
                <Button variant="outline" size="xs" className="w-full font-bold">
                  Inspect specs
                </Button>
              </Link>

              <button
                onClick={() => handleRemove(item.id)}
                title="Remove Wishlist"
                className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}

        {favorited.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-on-surface-variant select-none">
            No items wishlisted in active library configurations.
          </div>
        )}
      </div>
    </div>
  );
}
