"use client";

import React, { useState } from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Bell, Save } from "lucide-react";

export default function AnnouncementsPage() {
  const { addToast } = useToast();
  const { announcements, submitAnnouncement } = useAdmin();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"maintenance" | "announcement" | "update">("announcement");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    submitAnnouncement(title.trim(), type, text.trim());
    addToast("Broadcast announcement logged and dispatched to users.", "success");
    setTitle("");
    setText("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Announcements & Release Notes
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Publish platform announcements banners, coordinate maintenance schedules, and broadcast notes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Broadcast Title
                </label>
                <Input
                  placeholder="e.g. Server Maintenance Slot"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Announcement Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="announcement">General Announcement</option>
                  <option value="maintenance">Maintenance Warning</option>
                  <option value="update">Release Updates Notes</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Message Content Body
              </label>
              <Input
                placeholder="Description details..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0"
                leftIcon={<Save className="h-4 w-4 text-white" />}
              >
                Broadcast Message
              </Button>
            </div>
          </form>
        </Card>

        {/* Announcements list */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <Bell className="h-4.5 w-4.5 text-brand-sky" />
              Published Warnings
            </h3>

            <div className="flex flex-col gap-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 bg-brand-slate rounded-xl border border-brand-border text-left">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
                    <span>{ann.title}</span>
                    <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                      {ann.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/80 font-medium leading-relaxed mt-1.5">
                    {ann.text}
                  </p>
                  <span className="text-[8px] text-on-surface-variant/50 block mt-1.5 font-semibold">
                    Posted by {ann.author}
                  </span>
                </div>
              ))}

              {announcements.length === 0 && (
                <span className="text-xs text-on-surface-variant/80 font-medium">
                  No alerts currently broadcasted.
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
