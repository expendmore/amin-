"use client";

import React, { useState } from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { Sliders, Plus } from "lucide-react";

export default function AutomationRulesPage() {
  const { addToast } = useToast();
  const { rules, addRule, toggleRule } = useNotifications();

  const [name, setName] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("stripe_payment_failed");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addRule({
      name: name.trim(),
      triggerEvent,
      conditions: [{ field: "amount", operator: "greater_than", value: "0" }],
      recipients: ["seg-1"],
      channels: ["email"],
      priority,
      delayMinutes: 5,
      maxRetries: 3,
      isActive: true
    });

    addToast(`Automation trigger rule "${name}" registered successfully.`, "success");
    setName("");
  };

  const handleToggle = (id: string, ruleName: string) => {
    toggleRule(id);
    addToast(`Rule "${ruleName}" status toggled`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Automation & Routing Rules
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Configure automated workspace triggers event conditions, setup target channel priority pathways, and rules routing logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <Sliders className="h-4.5 w-4.5 text-brand-sky" />
            Active Automation Trigger Rules
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {rules.map((r) => (
              <div
                key={r.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5">
                    {r.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Trigger event: {r.triggerEvent} • Channels: {r.channels.join(", ")} • Priority: {r.priority}
                  </span>
                </div>

                <Toggle checked={r.isActive} onChange={() => handleToggle(r.id, r.name)} />
              </div>
            ))}
          </div>
        </Card>

        {/* Add Rule */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Register Routing Rule
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Rule Name
                </label>
                <Input
                  placeholder="e.g. Low Credits Alert SMS"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Trigger Event Gate
                </label>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="stripe_payment_failed">Stripe Invoice Unpaid</option>
                  <option value="credits_low">AI Credits Low Balance</option>
                  <option value="workflow_error">Automation Workflow Crash</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Execution Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Normal Priority</option>
                  <option value="high">High Priority (Immediate Send)</option>
                </select>
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full animate-none" leftIcon={<Plus className="h-4 w-4 text-white" />}>
                Create Rule
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
