"use client";

import React, { useMemo } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import { BarChart3, TrendingUp, HardDrive, Percent } from "lucide-react";

export default function StorageAnalyticsPage() {
  const { files } = useFiles();

  const activeFiles = useMemo(() => {
    return files.filter(f => !f.isTrashed);
  }, [files]);

  const breakdowns = useMemo(() => {
    let imagesBytes = 0;
    let videosBytes = 0;
    let docsBytes = 0;
    let totalBytes = 0;

    activeFiles.forEach((file) => {
      totalBytes += file.sizeBytes;
      if (file.type === "image") imagesBytes += file.sizeBytes;
      else if (file.type === "video") videosBytes += file.sizeBytes;
      else docsBytes += file.sizeBytes;
    });

    const divisor = totalBytes || 1;
    return {
      imagesPercent: Math.round((imagesBytes / divisor) * 100),
      videosPercent: Math.round((videosBytes / divisor) * 100),
      docsPercent: Math.round((docsBytes / divisor) * 100)
    };
  }, [activeFiles]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Storage & DAM Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Analyze storage growth metrics, inspect file format breakdowns, and evaluate download telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Images */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
            Images Share
          </h3>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {breakdowns.imagesPercent}%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Logo assets, avatars & banners
          </span>
        </Card>

        {/* Videos */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
            Videos Share
          </h3>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {breakdowns.videosPercent}%
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            Broadcast campaign clips
          </span>
        </Card>

        {/* Documents */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
            Documents Share
          </h3>
          <span className="text-2xl font-extrabold text-brand-navy dark:text-foreground">
            {breakdowns.docsPercent}%
          </span>
          <span className="text-[10px] text-[#34A853] font-bold flex items-center gap-0.5">
            <Percent className="h-3.5 w-3.5" />
            PDFs, text files & layouts
          </span>
        </Card>
      </div>

      {/* utilization progress */}
      <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-brand-navy dark:text-foreground text-left">
          Storage Ratio Allocation
        </h3>

        <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800 p-4">
          <div className="py-3 flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
              <span className="text-brand-navy dark:text-foreground">Images</span>
              <span>{breakdowns.imagesPercent}%</span>
            </div>
            <div className="w-full bg-brand-slate h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${breakdowns.imagesPercent}%` }} />
            </div>
          </div>

          <div className="py-3 flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
              <span className="text-brand-navy dark:text-foreground">Videos</span>
              <span>{breakdowns.videosPercent}%</span>
            </div>
            <div className="w-full bg-brand-slate h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-[#4285F4] rounded-full" style={{ width: `${breakdowns.videosPercent}%` }} />
            </div>
          </div>

          <div className="py-3 flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
              <span className="text-brand-navy dark:text-foreground">Documents & Other</span>
              <span>{breakdowns.docsPercent}%</span>
            </div>
            <div className="w-full bg-brand-slate h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-green rounded-full" style={{ width: `${breakdowns.docsPercent}%` }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
