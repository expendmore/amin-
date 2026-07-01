"use client";

import React, { useMemo, useState } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import { Play, Eye, FileText, ChevronRight } from "lucide-react";

export default function PreviewCenterPage() {
  const { files } = useFiles();

  const activeFiles = useMemo(() => {
    return files.filter((f) => !f.isTrashed);
  }, [files]);

  const [selectedFileId, setSelectedFileId] = useState(activeFiles[0]?.id || "file-1");

  const activeFileObj = useMemo(() => {
    return activeFiles.find((f) => f.id === selectedFileId);
  }, [activeFiles, selectedFileId]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Preview Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Inspect office documents, preview images and SVG outlines, and verify media playback.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Assets Browser side list */}
        <Card className="lg:col-span-4 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
            Available Documents
          </h3>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px]">
            {activeFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`p-3 rounded-lg border flex items-center justify-between gap-2.5 transition-colors cursor-pointer select-none ${
                  selectedFileId === file.id
                    ? "border-brand-sky bg-brand-sky-light/10 text-brand-navy"
                    : "border-brand-border hover:bg-brand-slate/40 text-on-surface-variant"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 shrink-0 text-on-surface-variant/60" />
                  <span className="text-xs font-bold truncate">{file.name}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </div>
            ))}
          </div>
        </Card>

        {/* Preview Frame */}
        <Card className="lg:col-span-8 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between overflow-hidden min-h-[400px] text-left">
          <div className="flex-1 flex flex-col overflow-hidden gap-4">
            <div className="border-b border-brand-border pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
                Document Render Frame: {activeFileObj?.name}
              </h3>
            </div>

            {/* Simulated file viewer frame */}
            <div className="flex-1 flex flex-col items-center justify-center bg-brand-slate dark:bg-zinc-900/60 rounded-xl border border-brand-border/40 p-10 select-none text-center">
              {activeFileObj?.mimeType.startsWith("image/") ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded bg-white dark:bg-zinc-950 border border-brand-border flex items-center justify-center text-brand-navy font-bold text-xs uppercase shadow-sm">
                    Image preview
                  </div>
                  <span className="text-[11px] font-bold text-on-surface-variant">
                    {activeFileObj.name} ({activeFileObj.size})
                  </span>
                </div>
              ) : activeFileObj?.mimeType.startsWith("video/") ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-brand-navy dark:bg-zinc-950 border border-brand-border flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform shadow-md">
                    <Play className="h-6 w-6 text-brand-sky fill-brand-sky" />
                  </div>
                  <span className="text-[11px] font-bold text-on-surface-variant">
                    Tap to play video playback
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <FileText className="h-12 w-12 text-on-surface-variant/60" />
                  <span className="text-[11px] font-bold text-on-surface-variant">
                    PDF / Office Document inline preview
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
