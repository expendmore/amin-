"use client";

import React, { useState } from "react";
import { useQa } from "@/store/use-qa";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { AlertTriangle, Plus } from "lucide-react";

export default function BugTrackerPage() {
  const { addToast } = useToast();
  const { bugs, addBug } = useQa();

  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<"critical" | "high" | "medium" | "low">("high");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addBug(title.trim(), severity);
    addToast(`Bug ticket "${title}" recorded successfully.`, "success");
    setTitle("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Vulnerability & Bug Backlog
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review active bug tickets catalog, verify assignment parameters, and monitor severity indexes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bugs list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <AlertTriangle className="h-4.5 w-4.5 text-brand-sky" />
            Bug Backlog List
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {bugs.map((it) => (
              <div
                key={it.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {it.title}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Assigned: {it.assignedTo} • Severity: {it.severity}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/70 font-semibold block mt-0.5">
                    Logged: {new Date(it.createdTime).toLocaleDateString()}
                  </span>
                </div>

                <span className={`text-[9px] border px-1.5 py-0.5 rounded font-bold uppercase shrink-0 font-sans ${
                  it.status === "resolved" ? "bg-emerald-50 text-brand-green border-emerald-200" : "bg-red-50 text-error border-red-200"
                }`}>
                  {it.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* File ticket form */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Report bug ticket
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Bug Title
                </label>
                <Input
                  placeholder="e.g. Next.js dynamic routing path issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Severity level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="critical">Critical (Prod Outage)</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Normal Severity</option>
                  <option value="low">Low Level / Aesthetic</option>
                </select>
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full animate-none" leftIcon={<Plus className="h-4 w-4 text-white" />}>
                Record Ticket
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
