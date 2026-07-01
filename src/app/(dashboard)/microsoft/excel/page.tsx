"use client";

import React, { useMemo, useState } from "react";
import { useMicrosoft365 } from "@/store/use-microsoft-365";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import {
  Table,
  Plus,
  ArrowRight,
  Search,
  FileSpreadsheet
} from "lucide-react";

export default function ExcelPage() {
  const { addToast } = useToast();
  const {
    excelWorkbooks,
    appendExcelRow
  } = useMicrosoft365();

  const [selectedWorkbookId, setSelectedWorkbookId] = useState<string | null>("od-file-2");
  const [selectedTabId, setSelectedTabId] = useState<string>("ws-1");

  const [showAddRow, setShowAddRow] = useState(false);
  const [rowInputs, setRowInputs] = useState<string[]>(["", "", "", "", ""]);

  const activeWorkbook = useMemo(() => {
    return excelWorkbooks.find(wb => wb.id === selectedWorkbookId) || null;
  }, [excelWorkbooks, selectedWorkbookId]);

  React.useEffect(() => {
    if (activeWorkbook && activeWorkbook.worksheets.length > 0) {
      setSelectedTabId(activeWorkbook.worksheets[0].id);
    }
  }, [selectedWorkbookId, activeWorkbook]);

  const activeRows = useMemo(() => {
    if (!activeWorkbook) return [];
    return activeWorkbook.rowData[selectedTabId] || [];
  }, [activeWorkbook, selectedTabId]);

  const handleAppendRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkbookId) return;

    const newRow = rowInputs.map(input => input.trim() || "-");
    appendExcelRow(selectedWorkbookId, selectedTabId, newRow);
    addToast("Appended transaction details into Excel workbook.", "success");
    setRowInputs(["", "", "", "", ""]);
    setShowAddRow(false);
  };

  const handleInputChange = (idx: number, val: string) => {
    setRowInputs(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Excel Online Integration
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Browse Excel spreadsheets library, preview sheets data, and configure real-time row insertion triggers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Workbook selector */}
        <Card className="lg:col-span-4 p-4 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs text-brand-navy dark:text-foreground uppercase tracking-wider">
            Excel Workbook Library
          </h3>

          <div className="flex flex-col gap-2.5">
            {excelWorkbooks.map((wb) => {
              const isSelected = wb.id === selectedWorkbookId;
              return (
                <div
                  key={wb.id}
                  onClick={() => setSelectedWorkbookId(wb.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? "border-brand-navy bg-brand-slate/60 dark:border-white dark:bg-zinc-900/60"
                      : "border-brand-border dark:border-zinc-800 hover:border-brand-navy/60 bg-white dark:bg-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                        {wb.name}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/80 font-semibold truncate">
                        Modified {new Date(wb.lastModifiedDateTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-on-surface-variant/60" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Sheet preview */}
        <Card className="lg:col-span-8 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 overflow-hidden">
          {activeWorkbook ? (
            <div className="flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border text-left">
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground leading-snug">
                    {activeWorkbook.name}
                  </h3>
                  <a
                    href={activeWorkbook.webUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-brand-sky font-bold hover:underline"
                  >
                    Open in Excel Online
                  </a>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="success"
                    size="xs"
                    onClick={() => setShowAddRow(true)}
                    className="font-bold text-[10px] text-white"
                    leftIcon={<Plus className="h-3.5 w-3.5 text-white" />}
                  >
                    Append Excel Row
                  </Button>
                </div>
              </div>

              {/* Worksheets list */}
              <div className="flex border-b border-brand-border gap-4">
                {activeWorkbook.worksheets.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTabId(tab.id)}
                    className={`pb-2.5 text-xs font-bold capitalize select-none cursor-pointer border-b-2 transition-all duration-150 ${
                      selectedTabId === tab.id
                        ? "border-brand-navy text-brand-navy dark:text-foreground dark:border-white"
                        : "border-transparent text-on-surface-variant/70 hover:text-brand-navy"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Matrix preview */}
              <div className="flex-1 overflow-auto border border-brand-border rounded-xl max-h-[380px]">
                {activeRows.length > 0 ? (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-brand-slate/80 dark:bg-zinc-900 border-b border-brand-border text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                        {activeRows[0].map((cell, idx) => (
                          <th key={idx} className="p-3.5 border-r border-brand-border/40 font-bold whitespace-nowrap">
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/50">
                      {activeRows.slice(1).map((row, rowIdx) => (
                        <tr
                          key={rowIdx}
                          className="hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10 font-medium text-brand-navy dark:text-foreground"
                        >
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="p-3 border-r border-brand-border/40 whitespace-nowrap">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-xs text-on-surface-variant">
                    No rows found inside worksheet.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-2">
              <FileSpreadsheet className="h-10 w-10 text-on-surface-variant/40" />
              <span className="text-xs text-on-surface-variant/80 font-semibold">
                Select a workbook on the left panel.
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* Append Row Modal */}
      {showAddRow && activeWorkbook && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex flex-col gap-0.5 text-left border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                Append Excel Row
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                Add column entries manually into worksheet: <strong className="text-brand-navy dark:text-foreground">{(activeWorkbook.worksheets.find(w=>w.id === selectedTabId))?.name}</strong>
              </p>
            </div>

            <form onSubmit={handleAppendRow} className="flex flex-col gap-4 text-left">
              {activeRows.length > 0 && activeRows[0].map((header, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    {header}
                  </label>
                  <Input
                    placeholder={`Enter value for ${header}`}
                    value={rowInputs[idx] || ""}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                  />
                </div>
              ))}

              <div className="flex items-center justify-end gap-3.5 border-t border-brand-border dark:border-zinc-800/80 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddRow(false)}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  size="sm"
                  className="font-bold text-white"
                >
                  Append Row
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
