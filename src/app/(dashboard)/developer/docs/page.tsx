"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { FileText, Lock, Globe } from "lucide-react";

export default function ApiDocumentationPage() {
  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            API Documentation & Reference
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review authentication instructions, query examples endpoints, and inspect code templates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core doc */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-5 text-left font-sans">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3">
            <Lock className="h-4.5 w-4.5 text-brand-sky" />
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Authentication Guidelines
            </h3>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            All API dispatches must pass your secret personal access token inside the <code>Authorization</code> header using standard Bearer mapping rules.
          </p>

          <pre className="p-4 bg-brand-slate dark:bg-zinc-900 rounded-xl text-[10px] font-mono text-brand-navy dark:text-foreground border border-brand-border overflow-x-auto select-all leading-relaxed">
            {`Authorization: Bearer sk_live_your_secret_token_here`}
          </pre>

          <div className="flex items-center gap-2 border-b border-brand-border pb-3 mt-4">
            <Globe className="h-4.5 w-4.5 text-brand-green" />
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Send WhatsApp message endpoint
            </h3>
          </div>

          <pre className="p-4 bg-brand-slate dark:bg-zinc-900 rounded-xl text-[10px] font-mono text-brand-navy dark:text-foreground border border-brand-border overflow-x-auto select-all leading-relaxed">
            {`POST https://api.expendmore.com/v1/whatsapp/messages/send
Content-Type: application/json

{
  "recipientPhone": "+919876543210",
  "templateName": "welcome_alert",
  "variables": {
    "name": "Aditya"
  }
}`}
          </pre>
        </Card>
      </div>
    </div>
  );
}
