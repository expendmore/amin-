"use client";

import React, { useMemo } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import {
  FolderHeart,
  BookOpen,
  Database,
  HardDrive,
  Heart,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2
} from "lucide-react";

export default function KnowledgeDashboard() {
  const { collections, documents, embeddingConfig, syncJobs } = useKnowledgeBase();

  const stats = useMemo(() => {
    const totalCols = collections.length;
    const totalDocs = documents.length;
    const totalVectors = embeddingConfig.vectorCount;
    
    // Sum document sizes
    let totalSizeMB = 0.0;
    documents.forEach(d => {
      if (d.size.includes("KB")) {
        totalSizeMB += parseFloat(d.size) / 1024;
      } else if (d.size.includes("MB")) {
        totalSizeMB += parseFloat(d.size);
      }
    });

    return {
      totalCols,
      totalDocs,
      totalVectors,
      totalSizeMB
    };
  }, [collections, documents, embeddingConfig]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Knowledge Base Overview
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Manage your corporate document indexes, audit vector embeddings models, and coordinate semantic search query pipelines.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/knowledge/upload">
            <Button variant="success" size="sm" className="font-bold text-white">
              Upload Files
            </Button>
          </Link>
          <Link href="/knowledge/search">
            <Button variant="outline" size="sm" className="font-bold">
              Semantic Search
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Collections */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Knowledge Collections
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.totalCols}
            </span>
            <span className="text-[10px] text-brand-green font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Role Permissions Active
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0">
            <FolderHeart className="h-5 w-5" />
          </div>
        </Card>

        {/* Total Documents */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Total Documents
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.totalDocs}
            </span>
            <span className="text-[10px] text-on-surface-variant/80 font-medium">
              Across PDF, DOCX, & Markdown
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-brand-sky shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
        </Card>

        {/* Vectors Count */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Indexed Embeddings Vectors
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.totalVectors.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#34A853] font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              text-embedding-3-small
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-brand-green shrink-0">
            <Database className="h-5 w-5" />
          </div>
        </Card>

        {/* Storage Capacity */}
        <Card className="p-4 flex items-center justify-between border-brand-border bg-white dark:bg-zinc-950">
          <div className="flex flex-col gap-0.5 text-left font-sans">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
              Storage Usage
            </span>
            <span className="text-xl font-extrabold text-brand-navy dark:text-foreground">
              {stats.totalSizeMB.toFixed(2)} MB
            </span>
            <span className="text-[10px] text-on-surface-variant/80 font-medium">
              Of 10.0 GB space limit
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 shrink-0">
            <HardDrive className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collections Overview */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Knowledge Collections
            </h3>
            <span className="text-[10px] font-bold text-brand-sky flex items-center gap-1 animate-pulse">
              <Activity className="h-3 w-3" />
              Sync Engines Idle
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {collections.map((col) => (
              <div
                key={col.id}
                className="p-3.5 border border-brand-border dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl flex items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0 text-left">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-extrabold text-xs uppercase ${
                    col.color === "navy" ? "bg-[#0F172A]" :
                    col.color === "green" ? "bg-brand-green" :
                    col.color === "purple" ? "bg-purple-600" : "bg-brand-sky"
                  }`}>
                    {col.name.substring(0, 2)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
                      {col.name}
                    </span>
                    <span className="text-[9px] text-on-surface-variant/80 font-semibold">
                      {col.documentCount} docs • {col.permissions} permission
                    </span>
                  </div>
                </div>

                <Link href={`/knowledge/library`}>
                  <button className="h-7 w-7 rounded-md hover:bg-brand-slate dark:hover:bg-zinc-800 flex items-center justify-center text-on-surface-variant hover:text-brand-navy cursor-pointer">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Global Health and stats */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Knowledge Health & Syncs
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  Global Index Health
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold">
                  All embedding structures optimized
                </span>
              </div>
              <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
                100%
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                Active Sync Pipelines
              </span>
              <div className="flex flex-col gap-1.5">
                {syncJobs.map((job, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                    <span className="truncate max-w-[130px]">{job.sourceName}</span>
                    <span className="text-[10px] text-brand-green font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="h-3 w-3" />
                      Success
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
