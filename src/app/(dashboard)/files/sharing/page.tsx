"use client";

import React, { useMemo, useState } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Share2, Link, Key, Calendar } from "lucide-react";

export default function SharingCenterPage() {
  const { addToast } = useToast();
  const { files, sharingLinks, shareFile } = useFiles();

  const activeFiles = useMemo(() => {
    return files.filter(f => !f.isTrashed);
  }, [files]);

  const [selectedFileId, setSelectedFileId] = useState(activeFiles[0]?.id || "file-1");
  const [password, setPassword] = useState("");
  const [expiration, setExpiration] = useState("");
  const [downloadLimit, setDownloadLimit] = useState("");

  const activeFileObj = useMemo(() => {
    return activeFiles.find(f => f.id === selectedFileId);
  }, [activeFiles, selectedFileId]);

  const activeShareLink = useMemo(() => {
    return sharingLinks.find(link => link.fileId === selectedFileId);
  }, [sharingLinks, selectedFileId]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = downloadLimit ? parseInt(downloadLimit) : undefined;
    const url = shareFile(selectedFileId, password || undefined, expiration || undefined, limit);
    addToast("Sharing link generated successfully", "success");
  };

  const handleCopyLink = () => {
    if (activeShareLink) {
      navigator.clipboard.writeText(activeShareLink.url);
      addToast("Sharing link copied to clipboard", "success");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Sharing Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Generate secure public URL links, configure expiration parameters, and protect with credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <form onSubmit={handleGenerate} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Select target File to Share
              </label>
              <select
                value={selectedFileId}
                onChange={(e) => setSelectedFileId(e.target.value)}
                className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
              >
                {activeFiles.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-brand-border pt-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Password Protect (Optional)
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Expiration date (Optional)
                </label>
                <Input
                  type="date"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Download limits threshold (Optional)
              </label>
              <Input
                type="number"
                placeholder="e.g. 10 downloads"
                value={downloadLimit}
                onChange={(e) => setDownloadLimit(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0"
                leftIcon={<Share2 className="h-4 w-4 text-white" />}
              >
                Generate Link Url
              </Button>
            </div>
          </form>
        </Card>

        {/* share details */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Link Information
            </h3>

            {activeShareLink ? (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-brand-slate rounded-lg border border-brand-border flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase">Public URL</span>
                  <span className="text-xs font-mono font-bold text-brand-navy truncate">{activeShareLink.url}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant pt-2 border-t border-brand-border/60">
                  <span>Current downloads</span>
                  <span className="font-mono text-brand-navy dark:text-foreground font-bold">{activeShareLink.currentDownloads}</span>
                </div>

                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="xs"
                  className="font-bold w-full mt-2"
                >
                  Copy Link Url
                </Button>
              </div>
            ) : (
              <span className="text-xs text-on-surface-variant/80 font-medium select-none">
                No active share link has been configured for the selected file.
              </span>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
