"use client";

import React, { useState } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { FolderHeart, Plus, Archive, Trash2, ShieldCheck, Tag } from "lucide-react";
import { CollectionLabelColor } from "@/types/knowledge-base";

export default function KnowledgeCollectionsPage() {
  const { addToast } = useToast();
  const {
    collections,
    addCollection,
    deleteCollection,
    archiveCollection
  } = useKnowledgeBase();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState<CollectionLabelColor>("navy");
  const [permission, setPermission] = useState<any>("workspace");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCollection(name.trim(), desc.trim(), color, permission);
    addToast(`Successfully created knowledge collection: ${name}`, "success");
    setName("");
    setDesc("");
    setColor("navy");
    setPermission("workspace");
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    deleteCollection(id);
    addToast("Collection deleted", "warning");
  };

  const handleArchive = (id: string) => {
    archiveCollection(id);
    addToast("Collection archived status toggled.", "info");
  };

  const colorClasses: Record<CollectionLabelColor, string> = {
    navy: "bg-[#0F172A]",
    green: "bg-brand-green",
    sky: "bg-brand-sky",
    amber: "bg-amber-500",
    purple: "bg-purple-600",
    rose: "bg-rose-500",
    teal: "bg-teal-500"
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Knowledge Collections
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Organize document indexes by teams tags, set roles permissions, and manage data folders.
          </p>
        </div>
        <Button
          variant="success"
          size="sm"
          className="font-bold text-white"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="h-4 w-4 text-white" />}
        >
          Create Collection
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <Card
            key={col.id}
            className={`p-5 border flex flex-col justify-between gap-4 transition-all duration-200 ${
              col.isArchived
                ? "border-brand-border/40 bg-brand-slate/40 opacity-70"
                : "border-brand-border bg-white dark:bg-zinc-950"
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 font-extrabold uppercase ${colorClasses[col.color]}`}>
                  {col.name.substring(0, 2)}
                </div>
                <div className="flex flex-col min-w-0 text-left font-sans">
                  <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground truncate">
                    {col.name}
                  </h3>
                  <span className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider block mt-0.5">
                    {col.documentCount} documents • {col.permissions} Access
                  </span>
                </div>
              </div>

              {col.description && (
                <p className="text-xs text-on-surface-variant/90 leading-relaxed font-medium mt-1">
                  {col.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-brand-border pt-4 mt-auto">
              <span className="text-[10px] text-on-surface-variant/50 font-bold block">
                Created {new Date(col.createdTime).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleArchive(col.id)}
                  title="Archive"
                  className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer"
                >
                  <Archive className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(col.id)}
                  title="Delete"
                  className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex flex-col gap-0.5 text-left border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                Create Knowledge Collection
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                Create structured collection folders to partition your RAG playground references datasets.
              </p>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Collection Title
                </label>
                <Input
                  placeholder="e.g. Sales Onboarding Guides"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Description
                </label>
                <Input
                  placeholder="e.g. Pricing margins guidelines and competitor slides"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Label Color Tag
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value as any)}
                    className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="navy">Deep Navy</option>
                    <option value="green">WhatsApp Green</option>
                    <option value="sky">Sky Blue</option>
                    <option value="amber">Amber</option>
                    <option value="purple">Purple</option>
                    <option value="rose">Rose</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Access Permission
                  </label>
                  <select
                    value={permission}
                    onChange={(e) => setPermission(e.target.value as any)}
                    className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="workspace">Workspace Shared</option>
                    <option value="team">Team Limited</option>
                    <option value="role">Role Restricted</option>
                    <option value="private">Private (Admin Only)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-brand-slate rounded-lg border border-brand-border/60 flex gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
                <span className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                  Permissions restrict RAG completions prompts contexts from reading files above user privilege levels.
                </span>
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
                  Create Collection
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
