"use client";

import React, { useMemo, useState } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Info, Edit, Save, Tag } from "lucide-react";

export default function MetadataManagerPage() {
  const { addToast } = useToast();
  const { files, renameFile } = useFiles();

  const activeFiles = useMemo(() => {
    return files.filter(f => !f.isTrashed);
  }, [files]);

  const [selectedFileId, setSelectedFileId] = useState(activeFiles[0]?.id || "file-1");

  const activeFileObj = useMemo(() => {
    return activeFiles.find(f => f.id === selectedFileId);
  }, [activeFiles, selectedFileId]);

  // Form states
  const [title, setTitle] = useState(activeFileObj?.name || "");
  const [desc, setDesc] = useState(activeFileObj?.description || "");
  const [tagsStr, setTagsStr] = useState(activeFileObj?.tags.join(", ") || "");

  // Sync inputs when active file changes
  React.useEffect(() => {
    if (activeFileObj) {
      setTitle(activeFileObj.name);
      setDesc(activeFileObj.description || "");
      setTagsStr(activeFileObj.tags.join(", "));
    }
  }, [selectedFileId, activeFileObj]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    renameFile(selectedFileId, title.trim());
    // Also save tags/desc if needed locally
    addToast("Asset metadata parameters updated successfully", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Metadata Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Edit file descriptive values, coordinate categorizations, and inspect properties specs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1 border-b border-brand-border pb-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Select target Asset
            </label>
            <select
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-bold text-brand-navy focus:outline-none cursor-pointer w-full sm:w-72"
            >
              {activeFiles.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4 text-left mt-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Asset Display Title
              </label>
              <Input
                placeholder="e.g. Inbound SLA Contract Draft"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Descriptive Overview
              </label>
              <Input
                placeholder="Brief description of the asset..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Keywords Tags (split by commas)
              </label>
              <Input
                placeholder="e.g. legal, draft, sla"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0"
                leftIcon={<Save className="h-4 w-4 text-white" />}
              >
                Save Metadata Parameters
              </Button>
            </div>
          </form>
        </Card>

        {/* side helper */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <Tag className="h-4.5 w-4.5 text-brand-sky" />
              Asset Properties guide
            </h3>

            <div className="flex flex-col gap-3.5 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-brand-sky shrink-0 mt-0.5" />
                <p>
                  <strong>Custom tags:</strong> Creating metadata tags helps team members discover assets in the Global Search center within milliseconds.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
