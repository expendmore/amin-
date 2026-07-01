"use client";

import React from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Compass, CheckCircle2, XCircle } from "lucide-react";

export default function McpServersRegistryPage() {
  const { addToast } = useToast();
  const { mcpServers, toggleMcpServer } = useDeveloper();

  const handleToggle = (id: string, name: string, active: boolean) => {
    toggleMcpServer(id);
    addToast(`MCP Server "${name}" marked as ${!active ? "Active" : "Disabled"}.`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            MCP Server Registry
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Register Model Context Protocol (MCP) servers, trace health scores, and configure scopes permissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Servers list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Compass className="h-4.5 w-4.5 text-brand-sky" />
            Registered MCP Server Endpoints
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {mcpServers.map((s) => {
              const isOnline = s.status === "online";
              return (
                <div
                  key={s.id}
                  className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5">
                      {s.name}
                      <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 text-on-surface-variant/80 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                        {s.category}
                      </span>
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-medium mt-1 leading-relaxed">
                      {s.description}
                    </span>
                    <span className="text-[9px] text-on-surface-variant/70 font-semibold block mt-0.5 truncate font-mono">
                      URL: {s.url} • Health Score: {s.healthScore}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] border px-1.5 py-0.5 rounded font-bold uppercase ${
                      isOnline ? "bg-emerald-50 text-brand-green border-emerald-200" : "bg-red-50 text-error border-red-200"
                    }`}>
                      {s.status}
                    </span>

                    <Button
                      onClick={() => handleToggle(s.id, s.name, isOnline)}
                      variant="outline"
                      size="xs"
                      className="font-bold shrink-0 animate-none"
                    >
                      {isOnline ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
