import React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full bg-slate-950/30 p-6 select-none animate-pulse">
      <div className="flex flex-col gap-6 w-full">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-white/[0.03] border border-white/[0.06] rounded-lg" />
            <div className="h-3 w-48 bg-white/[0.02] border border-white/[0.04] rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-white/[0.03] border border-white/[0.06] rounded-xl" />
            <div className="h-8 w-24 bg-white/[0.03] border border-white/[0.06] rounded-xl" />
          </div>
        </div>

        {/* Content Body Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="h-32 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-white/[0.03] border border-white/[0.04] rounded-md" />
              <div className="h-6 w-6 bg-white/[0.03] border border-white/[0.04] rounded-lg" />
            </div>
            <div className="h-6 w-16 bg-white/[0.04] border border-white/[0.06] rounded-lg" />
          </div>

          {/* Card 2 */}
          <div className="h-32 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-white/[0.03] border border-white/[0.04] rounded-md" />
              <div className="h-6 w-6 bg-white/[0.03] border border-white/[0.04] rounded-lg" />
            </div>
            <div className="h-6 w-20 bg-white/[0.04] border border-white/[0.06] rounded-lg" />
          </div>

          {/* Card 3 */}
          <div className="h-32 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 bg-white/[0.03] border border-white/[0.04] rounded-md" />
              <div className="h-6 w-6 bg-white/[0.03] border border-white/[0.04] rounded-lg" />
            </div>
            <div className="h-6 w-12 bg-white/[0.04] border border-white/[0.06] rounded-lg" />
          </div>
        </div>

        {/* Large Canvas Table/Chart Area Skeleton */}
        <div className="h-80 w-full p-6 bg-white/[0.01] border border-white/[0.05] rounded-2xl flex flex-col gap-4">
          <div className="h-4 w-40 bg-white/[0.02] border border-white/[0.04] rounded-lg" />
          <div className="flex-1 w-full bg-white/[0.01] border border-white/[0.03] rounded-xl flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
