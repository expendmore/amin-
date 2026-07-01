"use client";

import React, { useMemo, useState } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useToast } from "@/store/use-toast";
import { FolderHeart, Play, Trash2 } from "lucide-react";

export default function MyLibraryPage() {
  const { addToast } = useToast();
  const { items, uninstallItem } = useMarketplace();

  const [activeTab, setActiveTab] = useState<"installed" | "purchased" | "favorites">("installed");

  const libraryItems = useMemo(() => {
    return items.filter((it) => {
      if (activeTab === "installed") return it.isInstalled;
      if (activeTab === "purchased") return it.isPurchased;
      return it.isFavorite;
    });
  }, [items, activeTab]);

  const handleUninstall = (id: string) => {
    uninstallItem(id);
    addToast("Asset template uninstalled successfully.", "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            My Library
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Manage your purchased workflow assets, active integrations, and wishlist favorites.
          </p>
        </div>
      </div>

      {/* Tabs selectors */}
      <div className="flex border-b border-brand-border gap-6">
        {([
          { label: "Installed Assets", key: "installed" },
          { label: "Purchased Store", key: "purchased" },
          { label: "Saved Favorites", key: "favorites" }
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-xs font-bold capitalize select-none cursor-pointer border-b-2 transition-all duration-150 ${
              activeTab === tab.key
                ? "border-brand-navy text-brand-navy dark:text-foreground dark:border-white"
                : "border-transparent text-on-surface-variant/70 hover:text-brand-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraryItems.map((item) => (
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
                  View Specifications
                </Button>
              </Link>

              {activeTab === "installed" && (
                <button
                  onClick={() => handleUninstall(item.id)}
                  title="Uninstall Template"
                  className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </Card>
        ))}

        {libraryItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-on-surface-variant select-none">
            No items matches active directory tabs.
          </div>
        )}
      </div>
    </div>
  );
}
