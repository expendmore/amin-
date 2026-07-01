"use client";

import React, { useMemo, useState } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import FileStatusBadge from "@/components/files/FileStatusBadge";
import { Search, Filter, BookOpen, Trash2, Copy, History, Star, Grid, List, Layers, FileText } from "lucide-react";
import { DAMFileType } from "@/types/files";

export default function FileBrowserPage() {
  const { addToast } = useToast();
  const { files, folders, deleteFile, duplicateFile, toggleFavoriteFile } = useFiles();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<DAMFileType | "all">("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | "all">("all");

  const filteredFiles = useMemo(() => {
    return files
      .filter(f => !f.isTrashed)
      .filter((f) => {
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || f.type === filterType;
        const matchesFolder = selectedFolderId === "all" || f.folderId === selectedFolderId;
        return matchesSearch && matchesType && matchesFolder;
      });
  }, [files, searchQuery, filterType, selectedFolderId]);

  const handleDelete = (id: string) => {
    deleteFile(id);
    addToast("Asset moved to Recycle Bin", "warning");
  };

  const handleDuplicate = (id: string) => {
    duplicateFile(id);
    addToast("Asset duplicated successfully", "success");
  };

  const handleFavorite = (id: string) => {
    toggleFavoriteFile(id);
    addToast("Favorite status updated", "info");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            File Browser
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Search, filter, and inspect files details workspace-wide.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-brand-slate rounded-xl p-1 shrink-0 border border-brand-border/60">
          <button
            onClick={() => setViewMode("grid")}
            className={`h-7 px-2.5 rounded-lg flex items-center justify-center text-xs font-bold gap-1.5 cursor-pointer ${
              viewMode === "grid" ? "bg-white text-brand-navy shadow-sm" : "text-on-surface-variant"
            }`}
          >
            <Grid className="h-4 w-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`h-7 px-2.5 rounded-lg flex items-center justify-center text-xs font-bold gap-1.5 cursor-pointer ${
              viewMode === "list" ? "bg-white text-brand-navy shadow-sm" : "text-on-surface-variant"
            }`}
          >
            <List className="h-4 w-4" /> List
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-brand-slate dark:bg-zinc-900/40 p-4 rounded-xl border border-brand-border/60 justify-between">
        <div className="flex items-center gap-2.5 w-full sm:w-auto bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl">
          <Search className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
          <input
            type="text"
            placeholder="Search by file name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full sm:w-64 font-semibold text-brand-navy dark:text-foreground placeholder:text-on-surface-variant/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-navy dark:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
              <option value="archive">Archives</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-navy dark:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Folders</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid vs List rendering */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className="p-5 border border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground truncate" title={file.name}>
                        {file.name}
                      </h3>
                      <span className="text-[10px] text-on-surface-variant/80 font-bold capitalize mt-0.5 truncate">
                        Type: {file.type}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFavorite(file.id)}
                    className="h-7 w-7 rounded border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-amber-500 cursor-pointer"
                  >
                    <Star className={`h-4 w-4 ${file.isFavorite ? "text-amber-500 fill-amber-500" : ""}`} />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-brand-border/60 pt-3 text-xs font-semibold text-on-surface-variant/90 text-left">
                  <div className="flex justify-between">
                    <span>File size</span>
                    <span className="text-brand-navy dark:text-foreground font-bold">{file.size}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>Status</span>
                    <FileStatusBadge status={file.status} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-brand-border pt-4 mt-auto">
                <span className="text-[9px] text-on-surface-variant/50 font-bold block">
                  Uploaded {new Date(file.uploadedTime).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDuplicate(file.id)}
                    title="Duplicate"
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    title="Delete"
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-brand-border bg-white dark:bg-zinc-950 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-slate/85 dark:bg-zinc-900 border-b border-brand-border text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                  <th className="p-3.5 pl-5">Name</th>
                  <th className="p-3.5">Size</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10 font-medium text-brand-navy dark:text-foreground">
                    <td className="p-3.5 pl-5 font-bold">
                      {file.name}
                    </td>
                    <td className="p-3.5 font-bold">
                      {file.size}
                    </td>
                    <td className="p-3.5 font-bold capitalize">
                      {file.type}
                    </td>
                    <td className="p-3.5">
                      <FileStatusBadge status={file.status} />
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleFavorite(file.id)}
                          className="h-8 w-8 rounded border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-amber-500 cursor-pointer"
                        >
                          <Star className={`h-4 w-4 ${file.isFavorite ? "text-amber-500 fill-amber-500" : ""}`} />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="h-8 w-8 rounded border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
