"use client";

import React, { useState } from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Plus, Trash2 } from "lucide-react";

export default function TemplateManagerPage() {
  const { addToast } = useToast();
  const { templates, addTemplate, deleteTemplate } = useNotifications();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<"email" | "whatsapp" | "sms" | "push">("email");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !body.trim()) return;

    addTemplate({
      name: name.trim(),
      title: title.trim(),
      body: body.trim(),
      channel,
      category: "updates",
      variables: ["name"]
    });

    addToast(`Template "${name}" registered successfully.`, "success");
    setName("");
    setTitle("");
    setBody("");
  };

  const handleDelete = (id: string, templateName: string) => {
    deleteTemplate(id);
    addToast(`Template "${templateName}" deleted.`, "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Template Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Manage layout templates, audit version histories revisions, and define system dynamic variable structures.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Registered Templates Library
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {templates.map((t) => (
              <div
                key={t.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5">
                    {t.name}
                    <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 text-on-surface-variant/80 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                      {t.channel}
                    </span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Variables: {t.variables.join(", ")} • Version: {t.version}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  title="Delete Template"
                  className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer shrink-0 animate-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Template */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Register New Template
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Template Name
                </label>
                <Input
                  placeholder="e.g. Email Welcome Alert"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Header Title
                </label>
                <Input
                  placeholder="e.g. Welcome onboard, {{name}}"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Body Message Copy
                </label>
                <textarea
                  placeholder="Hello {{name}}, welcome to..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none min-h-[90px] text-brand-navy dark:text-foreground w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Default Target Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                  <option value="push">Mobile Push</option>
                </select>
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full animate-none" leftIcon={<Plus className="h-4 w-4 text-white" />}>
                Create Template
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
