"use client";

import React, { useState } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Database, RefreshCw, Layers, CheckCircle2 } from "lucide-react";

export default function EmbeddingManagerPage() {
  const { addToast } = useToast();
  const { embeddingConfig, rebuildEmbedding } = useKnowledgeBase();

  const [activeModel, setActiveModel] = useState(embeddingConfig.modelId);
  const [isRebuilding, setIsRebuilding] = useState(false);

  const handleRebuild = () => {
    setIsRebuilding(true);
    setTimeout(() => {
      rebuildEmbedding();
      setIsRebuilding(false);
      addToast("Successfully rebuilt semantic vector indexes", "success");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Vector Embedding Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Configure embedding models parameters, monitor dimensions schemas, and rebuild database indexes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core configuration card */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Index Configuration
          </h3>

          <div className="flex flex-col gap-4 border border-brand-border dark:border-zinc-800 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-semibold text-on-surface-variant">
              <span>Embedding Vector Model</span>
              <select
                value={activeModel}
                onChange={(e) => {
                  setActiveModel(e.target.value);
                  addToast(`Switched active model to ${e.target.value}. Trigger index rebuild.`, "info");
                }}
                className="bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-bold text-brand-navy focus:outline-none cursor-pointer w-full sm:w-60"
              >
                <option value="text-embedding-3-small">OpenAI text-embedding-3-small (1536d)</option>
                <option value="text-embedding-3-large">OpenAI text-embedding-3-large (3072d)</option>
                <option value="cohere-embed-english-v3">Cohere embed-english-v3.0 (1024d)</option>
              </select>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant pt-2 border-t border-brand-border/60">
              <span>Dimensions Size</span>
              <span className="font-mono text-brand-navy dark:text-foreground font-bold">
                {activeModel === "text-embedding-3-large" ? "3,072 dimensions" : activeModel === "cohere-embed-english-v3" ? "1,024 dimensions" : "1,536 dimensions"}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant pt-2 border-t border-brand-border/60">
              <span>Total Index Vectors</span>
              <span className="font-mono text-brand-navy dark:text-foreground font-bold">
                {embeddingConfig.vectorCount.toLocaleString()} elements
              </span>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant pt-2 border-t border-brand-border/60">
              <span>Last Rebuilt Index</span>
              <span className="text-brand-navy dark:text-foreground font-bold">
                {embeddingConfig.lastRebuiltTime ? new Date(embeddingConfig.lastRebuiltTime).toLocaleString() : "Never"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
            <Button
              onClick={handleRebuild}
              variant="success"
              size="sm"
              className="font-bold text-white shrink-0"
              isLoading={isRebuilding}
              leftIcon={<RefreshCw className="h-4 w-4 text-white" />}
            >
              Rebuild Vector Index
            </Button>
          </div>
        </Card>

        {/* guidelines */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <Database className="h-4.5 w-4.5 text-brand-sky" />
              Index Management
            </h3>

            <div className="flex flex-col gap-3.5 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Cosine similarity:</strong> ExpendMore uses cosine similarity indexes comparisons metric values to verify semantic contexts overlaps.
                </p>
              </div>

              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Model Rotations:</strong> Changing the index model requires a complete rebuilding of vectors. Retained caches are invalidated.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
