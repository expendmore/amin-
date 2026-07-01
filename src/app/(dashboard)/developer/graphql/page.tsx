"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Zap, Terminal } from "lucide-react";

export default function GraphQLPlaygroundPage() {
  const { addToast } = useToast();

  const [query, setQuery] = useState(`query GetWhatsAppCampaigns {
  campaigns(status: "active") {
    id
    name
    successRate
  }
}`);
  const [response, setResponse] = useState("");

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Executing GraphQL query...", "info");

    setTimeout(() => {
      setResponse(
        JSON.stringify(
          {
            data: {
              campaigns: [
                { id: "wf-1", name: "Summer Discount WhatsApp Flow", successRate: 98 },
                { id: "wf-2", name: "Billing low credits SMS trigger", successRate: 99 }
              ]
            }
          },
          null,
          2
        )
      );
      addToast("GraphQL query success", "success");
    }, 450);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            GraphQL Playground
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Test queries, query mutations blueprints, and explore graph nodes schema definitions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground border-b border-brand-border pb-3 flex items-center gap-2">
            <Zap className="h-4.5 w-4.5 text-brand-sky animate-pulse" />
            Query / Mutation Editor
          </h3>

          <form onSubmit={handleQuery} className="flex flex-col gap-4 text-left font-sans">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-[10px] font-mono focus:outline-none min-h-[160px] text-brand-navy dark:text-foreground w-full"
              required
            />

            <Button type="submit" variant="success" size="sm" className="font-bold text-white shrink-0 animate-none w-fit" leftIcon={<Zap className="h-4 w-4 text-white" />}>
              Run Query
            </Button>
          </form>
        </Card>

        {/* Results */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground border-b border-brand-border pb-3 flex items-center gap-2">
            <Terminal className="h-4.5 w-4.5 text-brand-green" />
            Results Inspector
          </h3>

          <pre className="p-4 bg-brand-slate dark:bg-zinc-900 rounded-xl text-[10px] font-mono text-brand-navy dark:text-foreground border border-brand-border min-h-[160px] overflow-x-auto select-all leading-relaxed animate-none">
            {response || "// Run query to preview JSON results."}
          </pre>
        </Card>
      </div>
    </div>
  );
}
