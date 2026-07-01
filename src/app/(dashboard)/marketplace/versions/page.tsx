"use client";

import React, { useMemo, useState } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { History, RotateCcw, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function VersionManagerPage() {
  const { addToast } = useToast();
  const { items } = useMarketplace();

  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || "item-1");

  const activeItemObj = useMemo(() => {
    return items.find((it) => it.id === selectedItemId);
  }, [items, selectedItemId]);

  const handleRollback = (ver: string) => {
    addToast(`Successfully rolled back template logic to ${ver}. Rebuilding routing indexes...`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Version Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review revision histories timeline, rollback updates, and check version release notes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revision browser list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex flex-col gap-1 border-b border-brand-border pb-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Select target Asset
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-bold text-brand-navy focus:outline-none cursor-pointer w-full sm:w-72"
            >
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
          </div>

          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground mt-2">
            Revision Release History
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {activeItemObj?.versions.map((ver, idx) => (
              <div
                key={ver.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground flex items-center gap-1.5">
                    Version: {ver.version} {idx === activeItemObj.versions.length - 1 && "(Active)"}
                    {idx === activeItemObj.versions.length - 1 && (
                      <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                        Live
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                    Notes: {ver.releaseNotes} • Published {new Date(ver.date).toLocaleDateString()}
                  </span>
                </div>

                {idx < activeItemObj.versions.length - 1 && (
                  <Button
                    onClick={() => handleRollback(ver.version)}
                    variant="outline"
                    size="xs"
                    className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0"
                    leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                  >
                    Rollback
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* side note */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <History className="h-4.5 w-4.5 text-brand-sky" />
              Deployment Safety
            </h3>
            <div className="flex flex-col gap-3 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <p>
                <strong>Auto backups:</strong> Rolling back versions auto-creates a diagnostic copy of your current active template variables rules layout.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
