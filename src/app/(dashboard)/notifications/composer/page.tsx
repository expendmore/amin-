"use client";

import React, { useState } from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Send, Eye } from "lucide-react";

export default function NotificationComposerPage() {
  const { addToast } = useToast();
  const { sendNotification } = useNotifications();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<"email" | "whatsapp" | "sms" | "push">("email");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sendNotification({
      recipientId: "bulk-broadcast",
      recipientEmail: "audience@expendmore.ai",
      channel,
      category: "updates",
      subject: subject || undefined,
      title: title.trim(),
      message: message.trim()
    });

    addToast(`Broadcast notification dispatched successfully via ${channel}.`, "success");
    setTitle("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Notification Composer
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Draft customizable bulk broadcasts notifications, select recipient target channels, and preview markdown files.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Form */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Target Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="email">Email Campaign</option>
                  <option value="whatsapp">WhatsApp Template Message</option>
                  <option value="sms">SMS Text Alert</option>
                  <option value="push">Mobile Push Notification</option>
                </select>
              </div>

              {channel === "email" && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Subject Line
                  </label>
                  <Input
                    placeholder="e.g. Monthly Invoices Statement"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Notification Header Title
              </label>
              <Input
                placeholder="e.g. Action Required: Recharge Credits"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Message Content (Markdown supported)
              </label>
              <textarea
                placeholder="Write message copy here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none min-h-[120px] text-brand-navy dark:text-foreground w-full"
                required
              />
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0 animate-none"
                leftIcon={<Send className="h-4 w-4 text-white" />}
              >
                Send Notification
              </Button>
            </div>
          </form>
        </Card>

        {/* Live preview */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 border-b border-brand-border pb-3">
              <Eye className="h-4.5 w-4.5 text-brand-sky" />
              Live Device Preview
            </h3>

            <div className="p-4 bg-brand-slate dark:bg-zinc-900 rounded-2xl border border-brand-border/60 min-h-[150px] flex flex-col gap-2 text-left">
              {title ? (
                <>
                  <span className="text-xs font-extrabold text-brand-navy dark:text-foreground">{title}</span>
                  <p className="text-[10px] text-on-surface-variant/80 leading-relaxed font-semibold mt-1">
                    {message || "No content copy written yet."}
                  </p>
                </>
              ) : (
                <span className="text-xs text-on-surface-variant/60 italic m-auto select-none">
                  Drafting preview will render here.
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
