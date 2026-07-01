"use client";

import React, { useMemo, useState } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { Settings, Info, Save } from "lucide-react";

export default function ModelConfigPage() {
  const { addToast } = useToast();
  const { models, configs, updateModelConfig } = useAIProvider();

  const enabledModels = useMemo(() => {
    return models.filter((m) => m.isEnabled);
  }, [models]);

  const [selectedModelId, setSelectedModelId] = useState(enabledModels[0]?.id || "gpt-4o");

  // Local Form state
  const activeConfig = useMemo(() => {
    return configs[selectedModelId] || {
      modelId: selectedModelId,
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 4096,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      reasoningLevel: "medium" as const,
      streaming: true,
      jsonMode: false,
      visionEnabled: false
    };
  }, [configs, selectedModelId]);

  const [temp, setTemp] = useState(activeConfig.temperature);
  const [topP, setTopP] = useState(activeConfig.topP);
  const [maxTokens, setMaxTokens] = useState(activeConfig.maxTokens);
  const [freqPen, setFreqPen] = useState(activeConfig.frequencyPenalty);
  const [presPen, setPresPen] = useState(activeConfig.presencePenalty);
  const [reasoning, setReasoning] = useState<"low" | "medium" | "high">(activeConfig.reasoningLevel);
  const [streaming, setStreaming] = useState(activeConfig.streaming);
  const [jsonMode, setJsonMode] = useState(activeConfig.jsonMode);
  const [vision, setVision] = useState(activeConfig.visionEnabled);

  // Sync state when selected model changes
  React.useEffect(() => {
    setTemp(activeConfig.temperature);
    setTopP(activeConfig.topP);
    setMaxTokens(activeConfig.maxTokens);
    setFreqPen(activeConfig.frequencyPenalty);
    setPresPen(activeConfig.presencePenalty);
    setReasoning(activeConfig.reasoningLevel);
    setStreaming(activeConfig.streaming);
    setJsonMode(activeConfig.jsonMode);
    setVision(activeConfig.visionEnabled);
  }, [selectedModelId, activeConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateModelConfig(selectedModelId, {
      temperature: temp,
      topP,
      maxTokens,
      frequencyPenalty: freqPen,
      presencePenalty: presPen,
      reasoningLevel: reasoning,
      streaming,
      jsonMode,
      visionEnabled: vision
    });
    addToast(`Saved parameter configurations for model: ${selectedModelId}`, "success");
  };

  const activeModelObj = useMemo(() => {
    return models.find((m) => m.id === selectedModelId);
  }, [models, selectedModelId]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex items-center justify-between border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Model Configuration Parameters
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Customize generation defaults temperature, token limits, penalty values, and JSON structures.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters Form Panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5 border-b border-brand-border pb-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Select target Model configuration
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-bold text-brand-navy focus:outline-none cursor-pointer w-full sm:w-72"
            >
              {enabledModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.providerId})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5 text-left mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Temperature slider */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 flex justify-between">
                  <span>Temperature (Creativity)</span>
                  <span className="font-mono text-brand-sky font-bold">{temp}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full accent-brand-sky"
                />
              </div>

              {/* Top P slider */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 flex justify-between">
                  <span>Top P (Nucleus Sampling)</span>
                  <span className="font-mono text-brand-sky font-bold">{topP}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-brand-sky"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Max Tokens input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Max Output Tokens
                </label>
                <Input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2048)}
                />
              </div>

              {/* Frequency Penalty */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Frequency Penalty
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="-2"
                  max="2"
                  value={freqPen}
                  onChange={(e) => setFreqPen(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Presence Penalty */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Presence Penalty
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="-2"
                  max="2"
                  value={presPen}
                  onChange={(e) => setPresPen(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {activeModelObj?.isReasoning && (
              <div className="flex flex-col gap-1.5 p-3.5 bg-brand-slate rounded-xl border border-brand-border/40 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/75 block">
                  Reasoning Effort / Thought Level
                </label>
                <div className="flex gap-4 mt-1">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <label key={level} className="flex items-center gap-1.5 text-xs font-bold text-brand-navy cursor-pointer">
                      <input
                        type="radio"
                        name="reasoning"
                        checked={reasoning === level}
                        onChange={() => setReasoning(level)}
                        className="h-4 w-4 text-brand-navy border-brand-border focus:ring-brand-navy cursor-pointer"
                      />
                      <span className="capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Boolean Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-brand-border pt-4 mt-1">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 block mb-1">
                  Enable Stream Token
                </label>
                <Toggle checked={streaming} onChange={setStreaming} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 block mb-1">
                  Strict JSON Mode
                </label>
                <Toggle checked={jsonMode} onChange={setJSON => setJsonMode(setJSON)} />
              </div>

              {activeModelObj?.isVision && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 block mb-1">
                    Vision Multimodal
                  </label>
                  <Toggle checked={vision} onChange={setVision} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3.5 border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white"
                leftIcon={<Save className="h-4 w-4 text-white" />}
              >
                Save Configuration
              </Button>
            </div>
          </form>
        </Card>

        {/* Configuration tips panel */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <Settings className="h-4.5 w-4.5 text-brand-sky" />
              Settings Guidelines
            </h3>

            <div className="flex flex-col gap-4 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-brand-sky shrink-0 mt-0.5" />
                <p>
                  <strong>Temperature:</strong> Setting this closer to 0 makes model generation highly deterministic. Higher values create creative but fuzzy parameters.
                </p>
              </div>

              <div className="flex gap-2">
                <Info className="h-4 w-4 text-brand-sky shrink-0 mt-0.5" />
                <p>
                  <strong>JSON Mode:</strong> Standard chat endpoints requires explicit formatting rules in System instructions. Ensure you declare schemas correctly.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
