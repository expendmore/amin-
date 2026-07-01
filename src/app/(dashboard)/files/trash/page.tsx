"use client";

import React, { useMemo } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Trash2, RotateCcw, ShieldAlert, History } from "lucide-react";

export default function RecycleBinPage() {
  const { addToast } = useToast();
  const { files, restoreFile, permanentDeleteFile, clearRecycleBin } = useFiles();

  const trashedFiles = useMemo(() => {
    return files.filter(f => f.isTrashed);
  }, [files]);

  const handleClearRecycle = () => {
    clearRecycleBin();
    addToast("Successfully cleared Recycle Bin history logs", "warning");
  };

  const handleRestore = (id: string) => {
    restoreFile(id);
    addToast("Successfully restored file index", "success");
  };

  const handlePermanentDelete = (id: string) => {
    permanentDeleteFile(id);
    addToast("File permanently deleted", "error");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Recycle Bin
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Inspect trashed assets files directories, restore items to folders, or permanently erase records.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearRecycle}
          className="font-bold shrink-0 text-error hover:bg-red-50 dark:hover:bg-red-950/20"
          leftIcon={<History className="h-4 w-4" />}
        >
          Clear Recycle Bin
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trashed items lists */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Trashed Files Items
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {trashedFiles.length > 0 ? (
              trashedFiles.map((file) => (
                <div key={file.id} className="p-4 flex items-start justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left">
                  <div className="flex flex-col gap-1 text-left min-w-0">
                    <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                      Size: {file.size} • Deleted recently
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleRestore(file.id)}
                      title="Restore File"
                      className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-green hover:bg-emerald-50 dark:hover:bg-emerald-950/25 cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(file.id)}
                      title="Permanent Delete"
                      className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-on-surface-variant/80 p-8 text-center font-medium block">
                No trashed items listed. All assets operating nominal configurations.
              </span>
            )}
          </div>
        </Card>

        {/* safeguard panel */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-brand-sky" />
              Erasing Safeguard
            </h3>

            <div className="flex flex-col gap-3.5 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <p>
                <strong>Auto-purge rules:</strong> Files inside Recycle Bin are permanently deleted after 30 days of inactivity.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
