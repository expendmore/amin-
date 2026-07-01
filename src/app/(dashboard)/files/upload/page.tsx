"use client";

import React, { useMemo, useState } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Upload, FileText, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

export default function UploadCenterPage() {
  const { addToast } = useToast();
  const { folders, uploadFile } = useFiles();

  const [selectedFolderId, setSelectedFolderId] = useState(folders[0]?.id || "");
  const [dragActive, setDragActive] = useState(false);

  // Simulated upload status
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleSimulatedUpload = (fileName: string, size: string, sizeBytes: number) => {
    setIsUploading(true);
    setProgress(0);
    setUploadedFile(fileName);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          uploadFile(fileName, size, sizeBytes, "image", "image/png", selectedFolderId || null);
          addToast(`File "${fileName}" uploaded successfully.`, "success");
          return 100;
        }
        return prev + 25; // upload chunks speed
      });
    }, 200);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Upload Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Drag & drop media files, configure directory targets, and monitor synchronization queues.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload box */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Select Destination Folder
            </label>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-bold text-brand-navy focus:outline-none cursor-pointer w-full sm:w-72"
            >
              <option value="">Root directory (/)</option>
              {folders.map((fold) => (
                <option key={fold.id} value={fold.id}>
                  {fold.name}
                </option>
              ))}
            </select>
          </div>

          {/* Drag area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleSimulatedUpload("Company_Asset_Banner.png", "2.4 MB", 2516582);
            }}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 transition-colors text-center cursor-pointer select-none ${
              dragActive
                ? "border-brand-sky bg-brand-sky-light/10"
                : "border-brand-border hover:border-brand-sky/60 bg-brand-slate/40 dark:bg-zinc-900/10"
            }`}
            onClick={() => handleSimulatedUpload("WhatsApp_Ad_Template.png", "640 KB", 655360)}
          >
            <Upload className="h-10 w-10 text-on-surface-variant/60" />
            <div className="flex flex-col gap-0.5 text-xs font-medium text-on-surface-variant/80">
              <span className="font-extrabold text-brand-navy dark:text-foreground">Click to upload or drag files here</span>
              <span>Supported formats: PNG, JPG, MP4, PDF, ZIP up to 100MB</span>
            </div>
          </div>

          {/* Upload progress */}
          {isUploading && (
            <div className="flex flex-col gap-2 p-4 bg-brand-slate dark:bg-zinc-900 rounded-xl border border-brand-border/40 text-left">
              <div className="flex justify-between text-xs font-bold text-brand-navy">
                <span className="flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-brand-sky" />
                  {uploadedFile}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white dark:bg-zinc-950 h-2 rounded-full overflow-hidden border border-brand-border/30">
                <div className="h-full bg-brand-sky" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </Card>

        {/* Upload rules */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
              Secure Storage Scans
            </h3>

            <div className="flex flex-col gap-3.5 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Automatic Virus Check:</strong> All binary asset uploads undergo a secure sandbox check prior to layout indexing.
                </p>
              </div>

              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Checksum Verification:</strong> Prevents duplicate indices of identical media files configurations in workspace accounts.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
