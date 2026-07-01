"use client";

import React, { useMemo, useState } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import { FileImage, Film, Volume2, Bookmark, FolderHeart } from "lucide-react";

export default function MediaLibraryPage() {
  const { files } = useFiles();

  const [activeType, setActiveType] = useState<"all" | "image" | "video" | "audio">("all");

  const mediaFiles = useMemo(() => {
    return files
      .filter((f) => !f.isTrashed)
      .filter((f) => {
        if (activeType === "all") return f.type === "image" || f.type === "video" || f.type === "audio";
        return f.type === activeType;
      });
  }, [files, activeType]);

  const getMediaIcon = (type: string) => {
    if (type === "video") return <Film className="h-5 w-5 text-[#4285F4]" />;
    if (type === "audio") return <Volume2 className="h-5 w-5 text-brand-green" />;
    return <FileImage className="h-5 w-5 text-purple-500" />;
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Media Library
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Browse and organize visual assets libraries, videos and audio tracks.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border gap-6">
        {([
          { label: "All Media", key: "all" },
          { label: "Images", key: "image" },
          { label: "Videos", key: "video" },
          { label: "Audio", key: "audio" }
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveType(tab.key)}
            className={`pb-3 text-xs font-bold capitalize select-none cursor-pointer border-b-2 transition-all duration-150 ${
              activeType === tab.key
                ? "border-brand-navy text-brand-navy dark:text-foreground dark:border-white"
                : "border-transparent text-on-surface-variant/70 hover:text-brand-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mediaFiles.map((file) => (
          <Card key={file.id} className="p-4 border border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-3 text-left font-sans">
            <div className="flex flex-col gap-2.5">
              <div className="aspect-square rounded-lg bg-brand-slate dark:bg-zinc-900/60 border border-brand-border/40 flex items-center justify-center">
                {getMediaIcon(file.type)}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
                  {file.name}
                </span>
                <span className="text-[9px] text-on-surface-variant/60 font-semibold uppercase tracking-wider block mt-0.5">
                  Size: {file.size} • {file.mimeType}
                </span>
              </div>
            </div>
          </Card>
        ))}

        {mediaFiles.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-on-surface-variant select-none">
            No media files indexed in this folder view.
          </div>
        )}
      </div>
    </div>
  );
}
