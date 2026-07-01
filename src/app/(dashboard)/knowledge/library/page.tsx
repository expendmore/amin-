"use client";

import React, { useMemo, useState } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useToast } from "@/store/use-toast";
import KnowledgeStatusBadge from "@/components/knowledge/KnowledgeStatusBadge";
import { Search, Filter, BookOpen, Trash2, Copy, History, Plus, FileText } from "lucide-react";
import { DocumentStatus } from "@/types/knowledge-base";

export default function DocumentLibraryPage() {
  const { addToast } = useToast();
  const { documents, collections, deleteDocument, duplicateDocument } = useKnowledgeBase();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCollectionId, setFilterCollectionId] = useState("all");
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | "all">("all");

  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCol = filterCollectionId === "all" || d.collectionId === filterCollectionId;
      const matchesStatus = filterStatus === "all" || d.status === filterStatus;
      return matchesSearch && matchesCol && matchesStatus;
    });
  }, [documents, searchQuery, filterCollectionId, filterStatus]);

  const handleDelete = (id: string) => {
    deleteDocument(id);
    addToast("Document index deleted", "warning");
  };

  const handleDuplicate = (id: string) => {
    duplicateDocument(id);
    addToast("Document duplicated", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Document Library
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Search, sort, filter, and inspect chunk counts for all knowledge documents registered in collections.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/knowledge/upload">
            <Button
              variant="success"
              size="sm"
              className="font-bold text-white"
              leftIcon={<Plus className="h-4 w-4 text-white" />}
            >
              Upload New Documents
            </Button>
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-brand-slate dark:bg-zinc-900/40 p-4 rounded-xl border border-brand-border/60 justify-between">
        <div className="flex items-center gap-2.5 w-full sm:w-auto bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl">
          <Search className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full sm:w-64 font-semibold text-brand-navy dark:text-foreground placeholder:text-on-surface-variant/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
            <select
              value={filterCollectionId}
              onChange={(e) => setFilterCollectionId(e.target.value)}
              className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-navy dark:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Collections</option>
              {collections.map(col => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-navy dark:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="queued">Queued</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          const colName = collections.find((c) => c.id === doc.collectionId)?.name || "Uncategorized";
          return (
            <Card
              key={doc.id}
              className="p-5 border border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground truncate" title={doc.name}>
                        {doc.name}
                      </h3>
                      <span className="text-[10px] text-on-surface-variant/80 font-bold capitalize mt-0.5 truncate">
                        Collection: {colName}
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-on-surface-variant px-2 py-0.5 rounded font-bold shrink-0">
                    {doc.version}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-brand-border/60 pt-3 text-xs font-semibold text-on-surface-variant/90 text-left">
                  <div className="flex justify-between">
                    <span>File size</span>
                    <span className="text-brand-navy dark:text-foreground font-bold">{doc.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Partitions Chunks count</span>
                    <span className="text-brand-navy dark:text-foreground font-bold">{doc.chunkCount}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>Status</span>
                    <KnowledgeStatusBadge status={doc.status} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-brand-border pt-4 mt-auto">
                <span className="text-[9px] text-on-surface-variant/50 font-bold block">
                  Uploaded {new Date(doc.uploadedTime).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDuplicate(doc.id)}
                    title="Duplicate Document"
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    title="Delete Document"
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-on-surface-variant">
            No documents matched search parameters.
          </div>
        )}
      </div>
    </div>
  );
}
