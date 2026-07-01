"use client";

import React, { useState } from "react";
import { useDevops } from "@/store/use-devops";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Settings, Plus, Trash2 } from "lucide-react";

export default function EnvVarsPage() {
  const { addToast } = useToast();
  const { variables, addVariable, deleteVariable } = useDevops();

  const [key, setKey] = useState("");
  const [val, setVal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !val.trim()) return;

    addVariable(key.trim(), val.trim(), false);
    addToast(`Variable "${key}" registered successfully.`, "success");
    setKey("");
    setVal("");
  };

  const handleDelete = (id: string, varKey: string) => {
    deleteVariable(id);
    addToast(`Variable "${varKey}" removed.`, "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Environment Variables
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Define system parameters variables, specify config environment keys, and mask production passwords.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Variables list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Settings className="h-4.5 w-4.5 text-brand-sky" />
            Configured Environment variables
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {variables.map((v) => (
              <div
                key={v.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground font-mono truncate">
                    {v.key}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-mono truncate block mt-0.5">
                    Value: {v.value}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(v.id, v.key)}
                  title="Remove Variable"
                  className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer shrink-0 animate-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Var form */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Define Config Variable
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Variable Key
                </label>
                <Input
                  placeholder="e.g. NEXT_PUBLIC_ANALYTICS_ID"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Variable Value
                </label>
                <Input
                  placeholder="e.g. tracking_128912"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full animate-none" leftIcon={<Plus className="h-4 w-4 text-white" />}>
                Create Variable
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
