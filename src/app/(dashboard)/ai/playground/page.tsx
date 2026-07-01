"use client";

import React, { useMemo, useState } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/store/use-toast";
import { Terminal, Play, Sparkles, Clock, DollarSign, Activity } from "lucide-react";

export default function PromptPlaygroundPage() {
  const { addToast } = useToast();
  const { models, configs } = useAIProvider();

  const enabledModels = useMemo(() => {
    return models.filter((m) => m.isEnabled);
  }, [models]);

  const [selectedModelId, setSelectedModelId] = useState(enabledModels[0]?.id || "gpt-4o");
  const [systemPrompt, setSystemPrompt] = useState("You are an assistant. Be brief.");
  const [userPrompt, setUserPrompt] = useState("Draft support reply for {{customer_name}} regarding {{query}}.");

  // Variables mappings
  const [varCustName, setVarCustName] = useState("Anshuman Enterprises");
  const [varQuery, setVarQuery] = useState("Pricing details for premium modules");

  // Output states
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [latency, setLatency] = useState(0);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [cost, setCost] = useState(0);

  const activeModelObj = useMemo(() => {
    return models.find((m) => m.id === selectedModelId);
  }, [models, selectedModelId]);

  const handleSimulateGeneration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setOutput("");
    setTokensUsed(0);
    setCost(0);

    const start = Date.now();
    const finalUserPrompt = userPrompt
      .replace("{{customer_name}}", varCustName)
      .replace("{{query}}", varQuery);

    const responseTemplate = `Dear ${varCustName},\n\nThank you for reaching out to us. We have received your query regarding "${varQuery}". Our premium modules are structured at flat enterprise tiers with full Azure failover security. A client representative will call you within 15 minutes.\n\nWarm regards,\nExpendMore Support Agent.`;

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx >= responseTemplate.length) {
        clearInterval(interval);
        const end = Date.now();
        setLatency(end - start);
        const inputTkns = Math.round(finalUserPrompt.length / 4);
        const outputTkns = Math.round(responseTemplate.length / 4);
        const totalTkns = inputTkns + outputTkns;
        setTokensUsed(totalTkns);

        const inCost = (inputTkns / 1000000) * (activeModelObj?.inputCostPer1M || 0);
        const outCost = (outputTkns / 1000000) * (activeModelObj?.outputCostPer1M || 0);
        setCost(inCost + outCost);
        setIsGenerating(false);
        addToast("Model completion stream completed successfully.", "success");
      } else {
        setOutput((prev) => prev + responseTemplate.charAt(currentIdx));
        currentIdx += 4; // stream chunk speed
      }
    }, 15);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Prompt Playground Sandbox
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Test prompt variables inputs, inspect token consumption speeds, and preview generation budgets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Editor Inputs Panel */}
        <Card className="lg:col-span-7 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <form onSubmit={handleSimulateGeneration} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Select model to test
                </label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  {enabledModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.providerId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                System prompt instructions
              </label>
              <Textarea
                rows={3}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                User prompt template
              </label>
              <Textarea
                rows={4}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
            </div>

            {/* Dynamic variable inputs mapping */}
            <div className="flex flex-col gap-3.5 border-t border-brand-border pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 block">
                Template Variables values
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-on-surface-variant/80 uppercase">
                    {"{{"}customer_name{"}}"}
                  </label>
                  <Input value={varCustName} onChange={(e) => setVarCustName(e.target.value)} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-on-surface-variant/80 uppercase">
                    {"{{"}query{"}}"}
                  </label>
                  <Input value={varQuery} onChange={(e) => setVarQuery(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0"
                isLoading={isGenerating}
                leftIcon={<Play className="h-4 w-4 text-white" />}
              >
                Run Prompt Completion
              </Button>
            </div>
          </form>
        </Card>

        {/* Output Panel */}
        <Card className="lg:col-span-5 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between overflow-hidden min-h-[400px]">
          <div className="flex-1 flex flex-col overflow-hidden gap-4 text-left">
            <div className="border-b border-brand-border pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
                Model Completion Output
              </h3>
              {isGenerating && (
                <span className="text-[10px] font-bold text-brand-sky flex items-center gap-1.5 animate-pulse">
                  <Activity className="h-3.5 w-3.5" />
                  Streaming Completion...
                </span>
              )}
            </div>

            {/* Completion body */}
            <div className="flex-1 overflow-y-auto font-medium text-xs text-on-surface-variant/90 leading-relaxed bg-brand-slate dark:bg-zinc-900/60 p-4 rounded-xl border border-brand-border/40 whitespace-pre-wrap max-h-[300px]">
              {output || (
                <span className="text-on-surface-variant/50 font-bold block text-center py-12">
                  No completion has been run yet. Tap Run Prompt to simulate model stream outputs.
                </span>
              )}
            </div>
          </div>

          {/* completion stats indicators */}
          {latency > 0 && (
            <div className="grid grid-cols-3 gap-2 py-3 px-2 border-t border-brand-border text-left mt-4">
              <div className="flex flex-col gap-0.5 text-left font-sans">
                <span className="text-[9px] uppercase font-bold text-on-surface-variant/50 flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  Latency
                </span>
                <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                  {latency} ms
                </span>
              </div>

              <div className="flex flex-col gap-0.5 text-left font-sans">
                <span className="text-[9px] uppercase font-bold text-on-surface-variant/50 flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3" />
                  Tokens
                </span>
                <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                  {tokensUsed} tkns
                </span>
              </div>

              <div className="flex flex-col gap-0.5 text-left font-sans">
                <span className="text-[9px] uppercase font-bold text-on-surface-variant/50 flex items-center gap-0.5">
                  <DollarSign className="h-3 w-3" />
                  Spend Cost
                </span>
                <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                  ${cost.toFixed(5)}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
