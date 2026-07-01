"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Send, Terminal } from "lucide-react";

export default function ApiExplorerPage() {
  const { addToast } = useToast();

  const [path, setPath] = useState("/v1/whatsapp/messages/send");
  const [method, setMethod] = useState<"GET" | "POST">("POST");
  const [responseBody, setResponseBody] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Sending mock API request...", "info");

    setTimeout(() => {
      setResponseBody(
        JSON.stringify(
          {
            success: true,
            requestId: `req_${Math.random().toString(36).substring(2, 10)}`,
            message: "Dispatched payload to recipient queue.",
            timestamp: new Date().toISOString()
          },
          null,
          2
        )
      );
      addToast("Request completed (200 OK)", "success");
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            REST API Explorer
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Test live REST endpoints triggers requests, check authorization headers, and inspect response payloads.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request builder */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground border-b border-brand-border pb-3">
            API Request Builder
          </h3>

          <form onSubmit={handleSend} className="flex flex-col gap-4 text-left font-sans">
            <div className="flex items-center gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="bg-brand-slate border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-bold text-brand-navy cursor-pointer w-28 shrink-0"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
              </select>

              <Input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="success" size="sm" className="font-bold text-white shrink-0 animate-none w-fit" leftIcon={<Send className="h-4 w-4 text-white" />}>
              Execute Request
            </Button>
          </form>
        </Card>

        {/* Response viewer */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground border-b border-brand-border pb-3 flex items-center gap-2">
            <Terminal className="h-4.5 w-4.5 text-brand-sky" />
            Response Inspector
          </h3>

          <pre className="p-4 bg-brand-slate dark:bg-zinc-900 rounded-xl text-[10px] font-mono text-brand-navy dark:text-foreground border border-brand-border min-h-[160px] overflow-x-auto select-all leading-relaxed">
            {responseBody || "// Run a request in explorer to inspect raw output responses logs."}
          </pre>
        </Card>
      </div>
    </div>
  );
}
