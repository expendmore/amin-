"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Download, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function OneClickInstallPage() {
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { items, installItem } = useMarketplace();

  const id = searchParams.get("id") || "item-1";

  const itemObj = useMemo(() => {
    return items.find((x) => x.id === id) || items[0];
  }, [items, id]);

  const [workspace, setWorkspace] = useState("Acme Production Space");
  const [progress, setProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstallStart = () => {
    if (!itemObj) return;

    setIsInstalling(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsInstalling(false);
          installItem(itemObj.id);
          addToast(`Template "${itemObj.name}" successfully deployed to workspace.`, "success");
          return 100;
        }
        return prev + 25; // installer increment speed
      });
    }, 200);
  };

  if (!itemObj) {
    return <div className="p-8 text-xs text-on-surface-variant font-medium text-left">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            One-Click Install
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Deploy template recipes directly into your active workspace accounts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace select and progress */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1 border-b border-brand-border pb-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Target Workspace Destination
            </label>
            <select
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              className="bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-bold text-brand-navy focus:outline-none cursor-pointer w-full sm:w-72"
            >
              <option value="Acme Production Space">Acme Production Space</option>
              <option value="Billing sandbox Testing">Billing sandbox Testing</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Dependency check verification
            </h3>
            <div className="flex flex-col gap-2 text-xs font-semibold text-on-surface-variant mt-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green" />
                <span>Webhooks API Connector (Verified)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green" />
                <span>Anthropic Claude credentials adapter (Verified)</span>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-border pt-4 mt-4">
            <Button
              onClick={handleInstallStart}
              variant="success"
              size="sm"
              disabled={isInstalling}
              className="font-bold text-white shrink-0"
              leftIcon={<Download className="h-4 w-4 text-white" />}
            >
              {isInstalling ? `Deploying... ${progress}%` : "Deploy Template"}
            </Button>
          </div>

          {isInstalling && (
            <div className="flex flex-col gap-2 p-4 bg-brand-slate dark:bg-zinc-900 rounded-xl border border-brand-border/40 text-left mt-2">
              <div className="flex justify-between text-xs font-bold text-brand-navy">
                <span className="flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-brand-sky" />
                  Decompressing asset layout bundles...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white dark:bg-zinc-950 h-2 rounded-full overflow-hidden border border-brand-border/30">
                <div className="h-full bg-brand-sky" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </Card>

        {/* side helper rules */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <AlertCircle className="h-4.5 w-4.5 text-brand-sky" />
              Pre-install requirements
            </h3>
            <div className="flex flex-col gap-3 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <p>
                <strong>Workspace limits check:</strong> Check that your subscription plan tier has available empty workflow slots.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
