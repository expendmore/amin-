"use client";

import React, { useState } from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Users, Plus } from "lucide-react";

export default function AudienceManagerPage() {
  const { addToast } = useToast();
  const { segments } = useNotifications();

  const [segName, setSegName] = useState("");
  const [expression, setExpression] = useState("tier == 'PRO'");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!segName.trim()) return;

    addToast(`Audience dynamic segment "${segName}" registered. Mapping member matches...`, "success");
    setSegName("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Audience & Segments Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Define target recipient groups, setup dynamic user segments query rules, and review membership lists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segments lists */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <Users className="h-4.5 w-4.5 text-brand-sky" />
            Dynamic Audience Segments
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {segments.map((seg) => (
              <div
                key={seg.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {seg.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Query criteria: {seg.queryExpression} • Segment Members: {seg.userCount} users
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Segment form */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Define Dynamic Segment
            </h3>

            <form onSubmit={handleCreate} className="flex flex-col gap-4 text-left font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Segment Display Name
                </label>
                <Input
                  placeholder="e.g. Pro Plan active accounts"
                  value={segName}
                  onChange={(e) => setSegName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Dynamic query rule expression
                </label>
                <Input
                  placeholder="e.g. tier == 'PRO'"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full animate-none" leftIcon={<Plus className="h-4 w-4 text-white" />}>
                Create Segment
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
