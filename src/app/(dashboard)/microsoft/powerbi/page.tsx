"use client";

import React, { useMemo, useState } from "react";
import { useMicrosoft365 } from "@/store/use-microsoft-365";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import {
  BarChart3,
  RefreshCw,
  TrendingUp,
  LayoutDashboard,
  Activity,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export default function PowerBIPage() {
  const { addToast } = useToast();
  const {
    powerbiReports,
    powerbiDatasets,
    refreshDataset
  } = useMicrosoft365();

  const [selectedReportId, setSelectedReportId] = useState<string | null>("pbi-rep-1");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeReport = useMemo(() => {
    return powerbiReports.find(r => r.id === selectedReportId) || null;
  }, [powerbiReports, selectedReportId]);

  const activeDataset = useMemo(() => {
    if (!activeReport) return null;
    return powerbiDatasets.find(ds => ds.id === activeReport.datasetId) || null;
  }, [activeReport, powerbiDatasets]);

  const handleRefreshDataset = () => {
    if (!activeDataset) return;
    setIsRefreshing(true);
    setTimeout(() => {
      refreshDataset(activeDataset.id);
      setIsRefreshing(false);
      addToast("Successfully triggered Power BI dataset refresh handshake.", "success");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Power BI Reports Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor real-time WhatsApp sales pipelines, run datasets manual updates, and review margins charts dashboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Reports panel list */}
        <Card className="lg:col-span-4 p-4 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs text-brand-navy dark:text-foreground uppercase tracking-wider block">
            Power BI Reports
          </h3>

          <div className="flex flex-col gap-2.5">
            {powerbiReports.map((rep) => {
              const isSelected = rep.id === selectedReportId;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? "border-brand-navy bg-brand-slate/60 dark:border-white dark:bg-zinc-900/60"
                      : "border-brand-border dark:border-zinc-800 hover:border-brand-navy/60 bg-white dark:bg-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BarChart3 className="h-5 w-5 text-amber-500 shrink-0" />
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate font-sans">
                        {rep.name}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-on-surface-variant/60" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Report Preview Embedded */}
        <Card className="lg:col-span-8 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 overflow-hidden text-left justify-between">
          {activeReport ? (
            <div className="flex flex-col gap-4 h-full overflow-hidden text-left">
              {/* Report title and actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
                    {activeReport.name}
                  </h3>
                  <a
                    href={activeReport.webUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-brand-sky font-bold hover:underline flex items-center gap-1 w-fit"
                  >
                    Open report in Power BI Service
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {activeDataset && (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={handleRefreshDataset}
                    isLoading={isRefreshing}
                    className="font-bold text-[10px] border-brand-sky text-brand-sky hover:bg-brand-sky-light/40"
                    leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                  >
                    Refresh Dataset
                  </Button>
                )}
              </div>

              {/* Dataset Status Summary */}
              {activeDataset && (
                <div className="grid grid-cols-2 gap-4 py-2 px-3 bg-brand-slate dark:bg-zinc-900/60 rounded-xl border border-brand-border/40 text-left text-[11px] font-semibold text-on-surface-variant">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant/50 block">
                      Last Dataset Refresh
                    </span>
                    <span className="text-brand-navy dark:text-foreground">
                      {new Date(activeDataset.lastRefreshTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant/50 block">
                      Refresh Status
                    </span>
                    <span className="text-brand-green font-bold flex items-center gap-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Completed Successfully
                    </span>
                  </div>
                </div>
              )}

              {/* Simulated embedded preview */}
              <div className="flex-1 border border-brand-border dark:border-zinc-800 rounded-xl bg-brand-slate/40 dark:bg-zinc-900/20 p-8 flex flex-col items-center justify-center text-center gap-3.5 min-h-[220px]">
                <Activity className="h-10 w-10 text-[#F2C811] animate-pulse" />
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-extrabold text-xs text-brand-navy dark:text-foreground">
                    Interactive Report Sandbox
                  </h4>
                  <p className="text-[10px] text-on-surface-variant/80 max-w-[280px] leading-relaxed font-semibold">
                    To review full sales conversion graphs, customize margin metrics, and filter dates, load report in the main Power BI Service.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 gap-2 h-full">
              <BarChart3 className="h-10 w-10 text-on-surface-variant/40" />
              <span className="text-xs text-on-surface-variant/80 font-semibold">
                Select a report on the left panel registry.
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
