"use client";

import React, { useMemo, useState } from "react";
import { useKnowledgeBase } from "@/store/use-knowledge-base";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Bot, HelpCircle, Activity, Bookmark, Sparkles } from "lucide-react";

export default function RAGPlaygroundPage() {
  const { addToast } = useToast();
  const { collections, chunks, documents } = useKnowledgeBase();

  const [selectedColId, setSelectedColId] = useState(collections[0]?.id || "col-2");
  const [modelId, setModelId] = useState("gpt-4o");
  const [question, setQuestion] = useState("Explain environment variable setup details for the sandbox.");
  
  // Output states
  const [isAnswering, setIsAnswering] = useState(false);
  const [response, setResponse] = useState("");
  const [retrievedChunks, setRetrievedChunks] = useState<any[]>([]);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsAnswering(true);
    setResponse("");
    setRetrievedChunks([]);

    setTimeout(() => {
      // Find retrieved context chunks in target collection
      const matchedDocs = documents.filter((d) => d.collectionId === selectedColId);
      const matchedChunksList: any[] = [];
      
      matchedDocs.forEach((doc) => {
        const list = chunks[doc.id] || [];
        list.forEach((chk) => {
          matchedChunksList.push({
            ...chk,
            docName: doc.name,
            score: 0.82 + Math.random() * 0.15
          });
        });
      });

      setRetrievedChunks(matchedChunksList);

      const responseTemplate = `Based on the retrieved context files from "${matchedDocs[0]?.name || "Wiki Setup"}", to run the local developer environment, copy the example variables COPY .env.example .env.local and configure port details to 3000.`;

      let idx = 0;
      const interval = setInterval(() => {
        if (idx >= responseTemplate.length) {
          clearInterval(interval);
          setIsAnswering(false);
          addToast("RAG answer generation completed.", "success");
        } else {
          setResponse((prev) => prev + responseTemplate.charAt(idx));
          idx += 5; // speed chunk
        }
      }, 20);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            RAG Chat Playground
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Test prompt completions side-by-side with retrieved context chunks, evaluate models, and audit accuracy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Ask panel */}
        <Card className="lg:col-span-7 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left">
          <form onSubmit={handleAsk} className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Target Knowledge Base
                </label>
                <select
                  value={selectedColId}
                  onChange={(e) => setSelectedColId(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Generative Model Endpoint
                </label>
                <select
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="gpt-4o">OpenAI GPT-4o</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-brand-border pt-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                User Query / Question
              </label>
              <Input
                placeholder="How do we deploy or configure environment variables?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0"
                isLoading={isAnswering}
                leftIcon={<Bot className="h-4 w-4 text-white" />}
              >
                Query RAG Endpoint
              </Button>
            </div>
          </form>

          {/* Answer stream container */}
          <div className="flex-1 flex flex-col gap-3.5 border-t border-brand-border pt-4 mt-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/50">
              Generated Response Output
            </h3>
            <div className="flex-1 min-h-[160px] bg-brand-slate dark:bg-zinc-900/60 p-4 rounded-xl border border-brand-border/40 text-xs font-medium text-on-surface-variant/90 leading-relaxed whitespace-pre-wrap">
              {response || (
                <span className="text-on-surface-variant/40 block text-center py-10 font-semibold select-none">
                  Output will stream here once prompt completion begins.
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Retrieved Chunks side panel */}
        <Card className="lg:col-span-5 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="border-b border-brand-border pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
              Retrieved Context Chunks
            </h3>
            {isAnswering && (
              <span className="text-[10px] font-bold text-brand-sky flex items-center gap-1.5 animate-pulse">
                <Activity className="h-3.5 w-3.5" />
                Querying database...
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3 max-h-[450px] scrollbar-thin">
            {retrievedChunks.map((chk, idx) => (
              <div
                key={idx}
                className="p-3 border border-brand-border dark:border-zinc-800 bg-brand-slate/40 dark:bg-zinc-900/10 rounded-xl flex flex-col gap-1.5 text-left font-sans"
              >
                <div className="flex items-center justify-between text-[9px] font-bold text-on-surface-variant/60">
                  <span className="truncate max-w-[150px]">{chk.docName}</span>
                  <span className="text-brand-sky font-mono font-bold">{(chk.score * 100).toFixed(0)}% Similarity</span>
                </div>
                <p className="text-[11px] text-brand-navy dark:text-foreground font-semibold leading-relaxed">
                  "{chk.content}"
                </p>
              </div>
            ))}

            {retrievedChunks.length === 0 && (
              <div className="py-12 text-center text-xs text-on-surface-variant font-bold select-none">
                No matching chunks retrieved. Trigger query prompts.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
