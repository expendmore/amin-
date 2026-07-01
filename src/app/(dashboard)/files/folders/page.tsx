"use client";

import React, { useState } from "react";
import { useFiles } from "@/store/use-files";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { FolderOpen, Plus, Trash2, Edit2, Copy } from "lucide-react";
import { FolderColor } from "@/types/files";

export default function FolderManagerPage() {
  const { addToast } = useToast();
  const { folders, addFolder, deleteFolder, renameFolder, duplicateFolder } = useFiles();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState<FolderColor>("blue");

  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFolder(name.trim(), null, color);
    addToast(`Successfully created folder: ${name}`, "success");
    setName("");
    setColor("blue");
    setShowAddModal(false);
  };

  const handleRenameSubmit = (id: string) => {
    if (!renameValue.trim()) return;
    renameFolder(id, renameValue.trim());
    addToast(`Renamed folder successfully`, "success");
    setRenamingFolderId(null);
    setRenameValue("");
  };

  const colorClasses: Record<FolderColor, string> = {
    blue: "bg-blue-500",
    green: "bg-brand-green",
    purple: "bg-purple-600",
    orange: "bg-orange-500",
    red: "bg-red-500",
    gray: "bg-gray-500"
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Folder Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Organize asset libraries in nested folders, assign custom folder labels, and duplicate layouts.
          </p>
        </div>
        <Button
          variant="success"
          size="sm"
          className="font-bold text-white"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="h-4 w-4 text-white" />}
        >
          Create Folder
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((fold) => (
          <Card
            key={fold.id}
            className="p-5 border border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 font-extrabold uppercase ${colorClasses[fold.color]}`}>
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    {renamingFolderId === fold.id ? (
                      <div className="flex gap-1.5 items-center">
                        <Input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="h-7 text-xs w-32"
                        />
                        <Button
                          variant="success"
                          size="xs"
                          onClick={() => handleRenameSubmit(fold.id)}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground truncate">
                          {fold.name}
                        </h3>
                        <span className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider block mt-0.5">
                          Created {new Date(fold.createdTime).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setRenamingFolderId(fold.id);
                      setRenameValue(fold.name);
                    }}
                    title="Rename"
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      duplicateFolder(fold.id);
                      addToast("Duplicated folder with contents", "success");
                    }}
                    title="Duplicate"
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-navy hover:bg-brand-slate cursor-pointer"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      deleteFolder(fold.id);
                      addToast("Deleted folder", "warning");
                    }}
                    title="Delete"
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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
                Create Folder
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                Set up directory groups for brand assets kits or broadcast logs uploads.
              </p>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Folder Name
                </label>
                <Input
                  placeholder="e.g. Campaign Graphics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Label Color Tag
                </label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value as any)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="blue">Blue</option>
                  <option value="green">WhatsApp Green</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="red">Red</option>
                  <option value="gray">Gray</option>
                </select>
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
                  Create Folder
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
