"use client";

import React, { useState } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/store/use-toast";
import { FileCode, Plus, Star, Trash2, Download, Upload, Copy } from "lucide-react";

export default function PromptTemplatesPage() {
  const { addToast } = useToast();
  const {
    templates,
    addPromptTemplate,
    deletePromptTemplate,
    toggleFavoriteTemplate
  } = useAIProvider();

  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New template states
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("General");
  const [systemP, setSystemP] = useState("");
  const [userP, setUserP] = useState("");
  const [vars, setVars] = useState("");

  const filteredTemplates = templates.filter(t => {
    if (activeTab === "favorites") return t.isFavorite;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !systemP || !userP) {
      addToast("Please fill in template title and prompts fields.", "error");
      return;
    }

    const varList = vars ? vars.split(",").map(v => v.trim()).filter(Boolean) : [];
    addPromptTemplate(name, desc, cat, systemP, userP, varList);
    addToast(`Successfully created prompt template: ${name}`, "success");
    setName("");
    setDesc("");
    setCat("General");
    setSystemP("");
    setUserP("");
    setVars("");
    setShowAddModal(false);
  };

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    addToast("Copied template content to clipboard", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Prompt Templates Library
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review prompt template variables indexes, manage version history drafts, and export template JSONs.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addToast("Exported templates catalog", "success")}
            leftIcon={<Download className="h-4 w-4" />}
            className="font-bold"
          >
            Export Catalog
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="h-4 w-4 text-white" />}
            className="font-bold text-white"
          >
            Add Template
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border gap-6">
        {(["all", "favorites"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold capitalize select-none cursor-pointer border-b-2 transition-all duration-150 ${
              activeTab === tab
                ? "border-brand-navy text-brand-navy dark:text-foreground dark:border-white"
                : "border-transparent text-on-surface-variant/70 hover:text-brand-navy"
            }`}
          >
            {tab === "all" ? "All Templates" : "Favorites"}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((t) => (
          <Card key={t.id} className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
                    {t.name}
                  </h3>
                  <span className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider block mt-0.5">
                    Category: {t.category} • Version: {t.version}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleFavoriteTemplate(t.id)}
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-amber-500 cursor-pointer"
                  >
                    <Star className={`h-4 w-4 ${t.isFavorite ? "text-amber-500 fill-amber-500" : ""}`} />
                  </button>
                  <button
                    onClick={() => {
                      deletePromptTemplate(t.id);
                      addToast("Deleted prompt template", "warning");
                    }}
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant font-medium leading-relaxed mt-1">
                {t.description}
              </p>

              <div className="bg-brand-slate dark:bg-zinc-900/60 p-3 rounded-lg border border-brand-border/40 flex flex-col gap-1.5 mt-2">
                <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase">System Instructions</span>
                <p className="text-[10px] text-brand-navy dark:text-foreground font-semibold font-mono truncate">
                  {t.systemPrompt}
                </p>
              </div>

              <div className="bg-brand-slate dark:bg-zinc-900/60 p-3 rounded-lg border border-brand-border/40 flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase">User Prompt Template</span>
                <p className="text-[10px] text-brand-navy dark:text-foreground font-semibold font-mono line-clamp-2">
                  {t.userPromptTemplate}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-auto border-t border-brand-border pt-4">
              <div className="flex flex-wrap gap-1">
                {t.variables.map((v, idx) => (
                  <span key={idx} className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-on-surface-variant/90 px-1.5 py-0.5 rounded font-bold uppercase">
                    {"{{"}{v}{"}}"}
                  </span>
                ))}
              </div>

              <Button
                variant="outline"
                size="xs"
                onClick={() => handleCopy(t.userPromptTemplate)}
                className="font-bold text-[10px]"
                leftIcon={<Copy className="h-3.5 w-3.5" />}
              >
                Copy Template
              </Button>
            </div>
          </Card>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-on-surface-variant">
            No templates configured or favorites saved.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex flex-col gap-0.5 text-left border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                Add Prompt Template
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                Save pre-configured system prompts and user prompt variables patterns.
              </p>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Template Name
                  </label>
                  <Input
                    placeholder="e.g. Lead Qualification"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Category Tag
                  </label>
                  <Input
                    placeholder="e.g. Sales"
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Description
                </label>
                <Input
                  placeholder="e.g. Qualifies inbound client leads"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  System Prompt Instructions
                </label>
                <Textarea
                  placeholder="System role guidelines..."
                  rows={2}
                  value={systemP}
                  onChange={(e) => setSystemP(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  User Prompt Template
                </label>
                <Textarea
                  placeholder="Inbound message: {{lead_message}}"
                  rows={3}
                  value={userP}
                  onChange={(e) => setUserP(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Template Variables (split by commas)
                </label>
                <Input
                  placeholder="e.g. lead_message, industry"
                  value={vars}
                  onChange={(e) => setVars(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3.5 border-t border-brand-border dark:border-zinc-800/80 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
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
                  Save Template
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
