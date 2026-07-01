"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { MessageSquare, CheckCircle2 } from "lucide-react";

export default function SupportCenterPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Support Desk & Escalations
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Oversee active client support tickets, coordinate tickets escalations, and review user feedback.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets queue */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Escalated Tickets Queue
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {([
              { id: "tick-1", subject: "Supabase authentication session pool timeout", user: "dev@acme.com", priority: "High" }
            ]).map((t) => (
              <div
                key={t.id}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    [{t.id}] {t.subject}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/80 font-semibold uppercase">
                    Sender: {t.user} • Priority: {t.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
