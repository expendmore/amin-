import React from "react";
import Card from "@/components/ui/Card";

export default function PublicPage() {
  return (
    <div className="flex flex-col gap-6 py-6 font-sans">
      <div className="border-b border-brand-border dark:border-border/50 pb-4">
        <h1 className="text-xl md:text-2xl font-extrabold text-brand-navy dark:text-foreground">
          ExpendMore Public Documentation
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant/80 mt-1">
          Review system specifications, terms guidelines, and model API capability charts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 flex flex-col gap-2 bg-white dark:bg-zinc-900">
          <h2 className="text-sm font-bold text-brand-navy dark:text-foreground">System Specifications</h2>
          <p className="text-xs text-on-surface-variant/90 leading-relaxed">
            ExpendMore is configured on a light-first visual framework. Dynamic light/dark styling transitions run on processed process variables, rendering instantly.
          </p>
        </Card>

        <Card className="p-5 flex flex-col gap-2 bg-white dark:bg-zinc-900">
          <h2 className="text-sm font-bold text-brand-navy dark:text-foreground">Developer APIs</h2>
          <p className="text-xs text-on-surface-variant/90 leading-relaxed">
            Access multi-model endpoints lazily routing OpenAI, Gemini, DeepSeek, and Groq adapters.
          </p>
        </Card>
      </div>
    </div>
  );
}
