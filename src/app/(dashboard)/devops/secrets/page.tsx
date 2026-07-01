"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Lock, RefreshCw } from "lucide-react";

export default function SecretsPage() {
  const { addToast } = useToast();

  const handleRotate = (secretName: string) => {
    addToast(`Rotated secret key credentials for: ${secretName}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Secret Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Manage API key parameters values, rotate OAuth client secrets keys, and mask database connection credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Secrets list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Lock className="h-4.5 w-4.5 text-brand-sky" />
            Masked System Secrets Keys
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {([
              { name: "SUPABASE_SERVICE_ROLE_KEY", status: "Masked" },
              { name: "META_WABA_GRAPH_TOKEN", status: "Masked" }
            ]).map((it) => (
              <div
                key={it.name}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground font-mono">
                    {it.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-mono">
                    Value: ••••••••
                  </span>
                </div>

                <Button
                  onClick={() => handleRotate(it.name)}
                  variant="outline"
                  size="xs"
                  className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                >
                  Rotate Secret Key
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
