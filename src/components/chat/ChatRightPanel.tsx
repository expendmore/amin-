"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { 
  Settings, 
  Brain, 
  BarChart2, 
  Pin, 
  Plus, 
  Trash2, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Coins,
  ChevronDown,
  Info
} from "lucide-react";

interface PinnedContext {
  id: string;
  rule: string;
}

interface ChatRightPanelProps {
  conversation: {
    id: string;
    title: string;
    modelProvider: string;
    modelName: string;
    createdAt: string;
  };
  onUpdateModel: (provider: string, modelName: string) => void;
  availableModels: Array<{ id: string; name: string; provider: string }>;
  messageCount: number;
}

export function ChatRightPanel({
  conversation,
  onUpdateModel,
  availableModels,
  messageCount
}: ChatRightPanelProps) {
  // Tabs: settings, memory, stats
  const [activeSection, setActiveSection] = useState<"settings" | "memory" | "stats">("settings");

  // Model parameters state
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [systemPrompt, setSystemPrompt] = useState("You are acting as a senior backend platform engineer helping with software setups.");

  // AI Memory Pinned context state
  const [pinnedContexts, setPinnedContexts] = useState<PinnedContext[]>([
    { id: "c1", rule: "Always write code in strict TypeScript." },
    { id: "c2", rule: "Exclude introductory smalltalk; output code directly." },
    { id: "c3", rule: "Prefer tailwind CSS v4 class utilities." }
  ]);
  const [newRuleInput, setNewRuleInput] = useState("");

  // Prompt Templates state
  const [promptTemplates] = useState([
    { name: "Code Optimization", category: "Development", text: "Refactor this component to prevent unnecessary re-renders: {{code}}" },
    { name: "Write SQL Schema", category: "Database", text: "Generate strict PostgreSQL tables DDL migrations for: {{specification}}" },
    { name: "Generate Unit Test", category: "QA", text: "Create vitest unit test cases covering all edge conditions of: {{function}}" }
  ]);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleInput.trim()) return;
    const newRule: PinnedContext = {
      id: `rule_${Math.random().toString(36).substring(2, 9)}`,
      rule: newRuleInput.trim()
    };
    setPinnedContexts(prev => [...prev, newRule]);
    setNewRuleInput("");
  };

  const handleRemoveRule = (id: string) => {
    setPinnedContexts(prev => prev.filter(r => r.id !== id));
  };

  // Calculate Mock token metrics
  const totalTokens = messageCount * 320;
  const estimatedCost = (totalTokens * 0.000002).toFixed(4);

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full select-none shrink-0 overflow-hidden">
      {/* Panel Headers */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5 select-none uppercase">
          <Settings className="h-4 w-4 text-brand-sky" />
          <span>Session Inspector</span>
        </span>
      </div>

      {/* Tabs list */}
      <div className="grid grid-cols-3 border-b border-border bg-zinc-950/20 text-center select-none text-[10px] font-bold">
        <button
          onClick={() => setActiveSection("settings")}
          className={`py-3 transition-colors ${
            activeSection === "settings"
              ? "border-b-2 border-brand-sky text-brand-sky font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Parameters
        </button>
        <button
          onClick={() => setActiveSection("memory")}
          className={`py-3 transition-colors ${
            activeSection === "memory"
              ? "border-b-2 border-brand-sky text-brand-sky font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Context
        </button>
        <button
          onClick={() => setActiveSection("stats")}
          className={`py-3 transition-colors ${
            activeSection === "stats"
              ? "border-b-2 border-brand-sky text-brand-sky font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Performance
        </button>
      </div>

      {/* Interactive Sections Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

        {/* SECTION A: Parameters & Settings */}
        {activeSection === "settings" && (
          <div className="flex flex-col gap-4">
            
            {/* Model Mappings */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Model Selection</span>
              <div className="grid grid-cols-1 gap-2">
                <select
                  value={conversation.modelProvider}
                  onChange={(e) => {
                    const nextProvider = e.target.value;
                    const firstModel = availableModels.find(m => m.provider === nextProvider);
                    if (firstModel) {
                      onUpdateModel(nextProvider, firstModel.id);
                    }
                  }}
                  className="h-9 px-2 bg-zinc-900 border border-border rounded text-[11px] text-foreground focus:outline-none"
                >
                  <option value="openai">OpenAI Adapter</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="google">Google Gemini</option>
                  <option value="deepseek">DeepSeek AI</option>
                </select>

                <select
                  value={conversation.modelName}
                  onChange={(e) => onUpdateModel(conversation.modelProvider, e.target.value)}
                  className="h-9 px-2 bg-zinc-900 border border-border rounded text-[11px] text-foreground focus:outline-none"
                >
                  {availableModels.filter(m => m.provider === conversation.modelProvider).length > 0 ? (
                    availableModels
                      .filter(m => m.provider === conversation.modelProvider)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))
                  ) : (
                    <option value={conversation.modelName}>{conversation.modelName}</option>
                  )}
                </select>
              </div>
            </div>

            <hr className="border-border/45" />

            {/* Temperature slide */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                <span className="uppercase">Temperature</span>
                <span className="font-mono text-brand-sky">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-sky"
              />
              <span className="text-[8px] text-muted-foreground leading-normal">
                Lower values trigger deterministic, factual responses. Higher yields creative results.
              </span>
            </div>

            {/* Top P slide */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                <span className="uppercase">Top P Probability</span>
                <span className="font-mono text-brand-sky">{topP}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-sky"
              />
            </div>

            {/* Max token limits */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                <span className="uppercase">Max Tokens Limit</span>
                <span className="font-mono text-brand-sky">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="256"
                max="8192"
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-sky"
              />
            </div>

            <hr className="border-border/45" />

            {/* Custom System Prompt parameters */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">System Prompt Instructions</span>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full h-24 p-2 bg-zinc-900 border border-border rounded text-[11px] leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-brand-sky resize-none"
                placeholder="E.g. act as a tech reviewer..."
              />
            </div>

          </div>
        )}

        {/* SECTION B: AI Memory & Context */}
        {activeSection === "memory" && (
          <div className="flex flex-col gap-4">
            
            {/* Conversation Memory details */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Brain className="h-3.5 w-3.5" />
                Pinned Context Rules
              </span>
              <p className="text-[9px] text-muted-foreground leading-normal">
                These rules are appended to the system prompt of every response generation in this session.
              </p>

              {/* List of rules */}
              <div className="flex flex-col gap-1.5 mt-1 select-text">
                {pinnedContexts.map((rc) => (
                  <div key={rc.id} className="p-2 bg-zinc-900/40 border border-border rounded-lg flex items-start justify-between gap-2 text-[10px] select-text">
                    <span className="text-zinc-300 leading-normal select-text">{rc.rule}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(rc.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0 cursor-pointer p-0.5"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add rule form */}
              <form onSubmit={handleAddRule} className="flex gap-1.5 mt-1.5">
                <input
                  type="text"
                  placeholder="Pin another context rule..."
                  value={newRuleInput}
                  onChange={(e) => setNewRuleInput(e.target.value)}
                  className="flex-grow h-8 px-2 bg-zinc-900 border border-border rounded text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-brand-sky"
                />
                <Button type="submit" size="xs" className="h-8 shrink-0 w-8 flex items-center justify-center p-0">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>

            <hr className="border-border/45" />

            {/* Prompt Templates */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                Prompt Templates
              </span>
              
              <div className="flex flex-col gap-1.5 mt-1">
                {promptTemplates.map((pt, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const activeTextarea = document.querySelector("textarea#chat-prompt-box") as HTMLTextAreaElement;
                      if (activeTextarea) {
                        activeTextarea.value = pt.text;
                        activeTextarea.dispatchEvent(new Event("input", { bubbles: true }));
                      }
                    }}
                    className="p-2 bg-zinc-900/20 border border-border rounded-lg hover:border-brand-sky/30 hover:bg-brand-sky-light/5 transition-all cursor-pointer text-[10px]"
                  >
                    <div className="flex justify-between items-center mb-0.5 select-none">
                      <span className="font-bold text-foreground">{pt.name}</span>
                      <span className="text-[8px] font-mono font-bold text-brand-sky bg-brand-sky-light/10 border border-brand-sky/20 px-1 rounded uppercase tracking-wider">{pt.category}</span>
                    </div>
                    <span className="text-muted-foreground leading-normal truncate block">{pt.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SECTION C: Performance Statistics */}
        {activeSection === "stats" && (
          <div className="flex flex-col gap-4 select-none">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Metrics Breakdown</span>

            <div className="grid grid-cols-1 gap-2.5">
              
              {/* Metric 1 */}
              <div className="p-3 bg-zinc-900/30 border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-sky" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-foreground">Message Density</span>
                    <span className="text-[8px] text-muted-foreground">Total records count</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-foreground font-mono">{messageCount} msgs</span>
              </div>

              {/* Metric 2 */}
              <div className="p-3 bg-zinc-900/30 border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-brand-sky" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-foreground">Token Consumption</span>
                    <span className="text-[8px] text-muted-foreground">Context size estimate</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-foreground font-mono">~{totalTokens.toLocaleString()} tokens</span>
              </div>

              {/* Metric 3 */}
              <div className="p-3 bg-zinc-900/30 border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-foreground">Estimated Cost</span>
                    <span className="text-[8px] text-muted-foreground">Model usage costs</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-amber-500 font-mono">${estimatedCost}</span>
              </div>

              {/* Metric 4 */}
              <div className="p-3 bg-zinc-900/30 border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-foreground">Average Latency</span>
                    <span className="text-[8px] text-muted-foreground">Active gateway speed</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-400 font-mono">420ms</span>
              </div>

            </div>

            <div className="p-3 bg-brand-sky-light/5 border border-brand-sky/10 rounded-xl flex gap-2">
              <Info className="h-4 w-4 text-brand-sky shrink-0 mt-0.5" />
              <span className="text-[9px] text-muted-foreground leading-normal">
                Cost estimates depend on mock configurations and token allocations. Active logs sync dynamically in Supabase telemetry databases.
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default ChatRightPanel;
