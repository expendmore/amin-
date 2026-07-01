"use client";

import React, { useMemo, useState } from "react";
import { useMicrosoft365 } from "@/store/use-microsoft-365";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import {
  History,
  Trash2,
  Download,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Search,
  Filter
} from "lucide-react";
import { MSLogType } from "@/types/microsoft-365";

export default function MicrosoftLogsPage() {
  const { addToast } = useToast();
  const {
    logs,
    clearLogs
  } = useMicrosoft365();

  const [filterType, setFilterType] = useState<MSLogType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesType = filterType === "all" || log.type === filterType;
      const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            log.service.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [logs, filterType, searchQuery]);

  const handleExport = () => {
    addToast("Exported integration audit logs successfully", "success");
  };

  const handleClear = () => {
    clearLogs();
    addToast("Cleared M365 logs timeline cache", "warning");
  };

  const getLogIcon = (type: MSLogType) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4.5 w-4.5 text-error shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0" />;
      case "sync":
        return <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />;
      case "oauth":
        return <Info className="h-4.5 w-4.5 text-brand-sky shrink-0" />;
      default:
        return <Info className="h-4.5 w-4.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Microsoft 365 Sync & Consent Logs
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review integration audit parameters, track errors status, and verify Entra ID OAuth handshake records.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/40"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export Logs
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="font-bold text-error hover:bg-red-50 dark:hover:bg-red-950/20"
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Clear Timeline
          </Button>
        </div>
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-brand-slate dark:bg-zinc-900/40 p-4 rounded-xl border border-brand-border/60 justify-between">
        <div className="flex items-center gap-2.5 w-full sm:w-auto bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl">
          <Search className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full sm:w-64 font-semibold text-brand-navy dark:text-foreground placeholder:text-on-surface-variant/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-navy dark:text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">All Logs</option>
            <option value="sync">Sync Event</option>
            <option value="error">Errors</option>
            <option value="warning">Warnings</option>
            <option value="oauth">OAuth Sec</option>
          </select>
        </div>
      </div>

      {/* Logs Index */}
      <Card className="border-brand-border bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="divide-y divide-brand-border">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start gap-3.5 text-left">
                {getLogIcon(log.type)}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-bold gap-4">
                    <span className="text-brand-navy dark:text-foreground capitalize flex items-center gap-2">
                      {log.message}
                      <span className="text-[9px] font-bold bg-slate-100 dark:bg-zinc-800 text-on-surface-variant/80 px-2 py-0.5 rounded uppercase">
                        {log.service}
                      </span>
                    </span>
                    <span className="text-[10px] text-on-surface-variant/60 font-semibold shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-[10px] font-mono text-on-surface-variant bg-brand-slate dark:bg-zinc-900/60 p-2.5 rounded-lg border border-brand-border/40 leading-relaxed max-w-4xl whitespace-pre-wrap mt-1">
                      {log.details}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-xs text-on-surface-variant font-medium">
              No logs matched parameters or empty trail.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
