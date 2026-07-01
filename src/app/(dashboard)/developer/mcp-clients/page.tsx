"use client";

import React from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import { Cpu, CheckCircle2 } from "lucide-react";

export default function McpClientsManagerPage() {
  const { mcpClients } = useDeveloper();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            MCP Client Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review connected AI context agents client tools session keys, audit connection logs, and trace security limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Cpu className="h-4.5 w-4.5 text-brand-sky" />
            Connected AI Context Clients
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {mcpClients.map((c) => (
              <div
                key={c.id}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    Client Permissions: {c.permissions.join(", ")}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/70 font-semibold block mt-0.5">
                    Connected: {new Date(c.lastConnected).toLocaleString()}
                  </span>
                </div>

                <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
