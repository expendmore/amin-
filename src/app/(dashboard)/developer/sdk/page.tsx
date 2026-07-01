"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Download, Terminal } from "lucide-react";

export default function SdkManagerPage() {
  const { addToast } = useToast();

  const handleDownload = (sdk: string) => {
    addToast(`Initiating SDK package download for: ${sdk}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Developer SDK Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Download client SDK libraries packages, copy setup commands, and inspect boilerplate code templates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SDK Packages */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Available Official SDKs
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {([
              { name: "Node.js (TypeScript / JavaScript)", cmd: "npm install @expendmore/sdk", lang: "typescript" },
              { name: "Python Library", cmd: "pip install expendmore-sdk", lang: "python" },
              { name: "Go Module", cmd: "go get github.com/expendmore/sdk-go", lang: "go" }
            ]).map((sdk) => (
              <div
                key={sdk.name}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    {sdk.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-mono bg-brand-slate dark:bg-zinc-900 px-2 py-1.5 rounded border border-brand-border truncate">
                    {sdk.cmd}
                  </span>
                </div>

                <Button
                  onClick={() => handleDownload(sdk.lang)}
                  variant="outline"
                  size="xs"
                  className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
                  leftIcon={<Download className="h-3.5 w-3.5" />}
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
