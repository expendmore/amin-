"use client";

import React, { useState } from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Globe, Plus, Trash2 } from "lucide-react";

export default function WebhooksCenterPage() {
  const { addToast } = useToast();
  const { webhooks, addWebhook, deleteWebhook } = useDeveloper();

  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    addWebhook(url.trim(), ["whatsapp.message_received", "billing.limits_reached"]);
    addToast(`Webhook endpoint registered successfully.`, "success");
    setUrl("");
  };

  const handleDelete = (id: string) => {
    deleteWebhook(id);
    addToast("Webhook endpoint removed.", "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Webhooks & HTTP Subscriptions
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Register webhook callback endpoints, audit verification secrets keys, and select channel event logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <Globe className="h-4.5 w-4.5 text-brand-sky" />
            Registered Webhook endpoints
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {webhooks.map((w) => (
              <div
                key={w.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {w.url}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold font-mono truncate">
                    Secret: {w.secret} • Status: {w.status}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(w.id)}
                  title="Remove Webhook"
                  className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer shrink-0 animate-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Webhook Form */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Register webhook URL
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Callback Target URL
                </label>
                <Input
                  placeholder="e.g. https://your-server.com/hooks"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full animate-none" leftIcon={<Plus className="h-4 w-4 text-white" />}>
                Create Webhook
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
