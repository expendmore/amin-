"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse select-none">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4.5 w-48 bg-zinc-150 dark:bg-zinc-900 rounded" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-9 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border dark:border-border/60 bg-card rounded-xl p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-zinc-250 dark:bg-zinc-850 rounded" />
              <div className="h-4.5 w-4.5 bg-zinc-250 dark:bg-zinc-850 rounded" />
            </div>
            <div className="h-8 w-16 bg-zinc-300 dark:bg-zinc-800 rounded-md" />
            <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-900 rounded" />
          </div>
        ))}
      </div>

      {/* Main Grid Widgets Skeleton */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 border border-border dark:border-border/60 bg-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div className="h-5 w-40 bg-zinc-250 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-900 rounded" />
          </div>
          <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center h-10 border-b border-border last:border-0">
                <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-850 rounded" />
                <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-900 rounded" />
                <div className="h-4.5 w-20 bg-zinc-250 dark:bg-zinc-850 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 border border-border dark:border-border/60 bg-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="h-5 w-32 bg-zinc-250 dark:bg-zinc-800 rounded" />
          <div className="h-40 w-full bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-900 rounded" />
            <div className="h-4 w-2/3 bg-zinc-250 dark:bg-zinc-900 rounded" />
          </div>
          <div className="h-10 w-full bg-zinc-300 dark:bg-zinc-800 rounded-xl mt-2" />
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
