"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAiAssistant } from "@/store/use-ai-assistant";
import { useToast } from "@/store/use-toast";
import {
  Sparkles,
  Search,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Plus,
  BookOpen,
  HelpCircle,
  Copy,
  ChevronRight,
  TrendingUp,
  Clock,
  UserCheck,
  Languages,
  Check,
  Trash2,
  ListFilter,
  BarChart4,
  Cpu,
  BrainCircuit,
  CornerDownLeft,
  RefreshCw,
  FolderPlus
} from "lucide-react";

export default function AiReplyAssistantPage() {
  const { addToast } = useToast();
  
  // Zustand store variables & actions
  const {
    totalSuggestions,
    acceptedCount,
    rejectedCount,
    averageResponseTimeSec,
    totalSavedHours,
    timeLogs,
    promptTemplates,
    searchResults,
    searchQuery,
    status,
    currentSuggestion,
    currentSentiment,
    translatedText,
    translationLanguage,
    setSearchQuery,
    searchKnowledgeBase,
    savePromptTemplate,
    deletePromptTemplate,
    logSuggestionFeedback,
    analyzeSentiment,
    generateReply,
    rewriteText,
    translateText,
    clearCurrent
  } = useAiAssistant();

  // Navigation tab: dashboard | playground
  const [activeTab, setActiveTab] = useState<"dashboard" | "playground">("dashboard");
  
  // Playground states
  const [promptInput, setPromptInput] = useState("");
  const [selectedTone, setSelectedTone] = useState<"professional" | "friendly" | "support" | "casual">("friendly");
  const [selectedLanguage, setSelectedLanguage] = useState("spanish");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  
  // Custom template modal states
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [newTemplatePrompt, setNewTemplatePrompt] = useState("");
  const [newTemplateCat, setNewTemplateCat] = useState<"welcome" | "support" | "apology" | "sales" | "custom">("custom");

  // KPI calculations
  const acceptanceRate = useMemo(() => {
    if (totalSuggestions === 0) return 0;
    return Math.round((acceptedCount / totalSuggestions) * 100);
  }, [acceptedCount, totalSuggestions]);

  // Handle template insertion
  const handleUseTemplate = (templatePrompt: string) => {
    setPromptInput(templatePrompt);
    addToast("Prompt template loaded into playground", "info");
  };

  // Handle custom template submit
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName || !newTemplatePrompt) {
      addToast("Please fill in template name and content", "warning");
      return;
    }

    savePromptTemplate({
      name: newTemplateName,
      description: newTemplateDesc,
      prompt: newTemplatePrompt,
      category: newTemplateCat
    });

    addToast("Custom template saved successfully", "success");
    setShowAddTemplateModal(false);
    // Reset modal inputs
    setNewTemplateName("");
    setNewTemplateDesc("");
    setNewTemplatePrompt("");
    setNewTemplateCat("custom");
  };

  // Run reply generation
  const handleGenerate = async () => {
    if (!promptInput.trim()) {
      addToast("Please enter a message prompt or customer query", "warning");
      return;
    }

    try {
      await generateReply(promptInput, selectedTone);
      // Run sentiment analysis automatically
      await analyzeSentiment(promptInput);
      addToast("AI draft suggestion generated", "success");
    } catch (err) {
      addToast("Failed to generate AI suggestion", "error");
    }
  };

  // Run rewrite assistant
  const handleRewrite = async (action: "improve" | "simplify" | "shorten" | "expand" | "correct" | "empathy") => {
    const textToRewrite = currentSuggestion || promptInput;
    if (!textToRewrite.trim()) {
      addToast("No draft content available to rewrite", "warning");
      return;
    }

    try {
      await rewriteText(textToRewrite, action);
      addToast(`Draft rewritten: ${action}`, "success");
    } catch (err) {
      addToast("Failed to rewrite draft text", "error");
    }
  };

  // Run translation
  const handleTranslate = async () => {
    const textToTranslate = currentSuggestion || promptInput;
    if (!textToTranslate.trim()) {
      addToast("No draft content to translate", "warning");
      return;
    }

    try {
      await translateText(textToTranslate, selectedLanguage);
      addToast(`Translated draft to ${selectedLanguage}`, "success");
    } catch (err) {
      addToast("Translation failed", "error");
    }
  };

  // Copy text to clipboard helper
  const copyToClipboard = (text: string, message = "Text copied to clipboard") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    addToast(message, "success");
  };

  // Filter templates list
  const filteredTemplates = useMemo(() => {
    if (templateFilter === "all") return promptTemplates;
    return promptTemplates.filter((t) => t.category === templateFilter);
  }, [promptTemplates, templateFilter]);

  // Simulated FAQ Search input change handler
  const handleKbSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchKnowledgeBase(query);
  };

  // Load FAQ context to prompt field
  const handleLoadFaqContext = (content: string) => {
    setPromptInput((prev) => {
      const spacing = prev ? "\n\n" : "";
      return prev + spacing + `[Knowledge Source Context]:\n${content}`;
    });
    addToast("Knowledge context appended to prompt composer", "info");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-brand-border dark:border-border/40 pb-5 gap-4">
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-brand-green/10 text-brand-green rounded-lg border border-brand-green/20">
              <Cpu className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-extrabold text-brand-navy dark:text-foreground tracking-tight">
              AI Reply Assistant
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-navy text-white dark:bg-zinc-800 dark:border dark:border-border rounded-full uppercase">
              Copilot Hub
            </span>
          </div>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400">
            Monitor real-time suggestion acceptance, customize quick-reply prompts, and test semantic translation modules.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-brand-slate/40 dark:bg-zinc-900 border border-brand-border dark:border-border/50 p-1.5 rounded-xl self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-white dark:bg-zinc-800 text-brand-navy dark:text-foreground shadow-sm"
                : "text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BarChart4 className="h-3.5 w-3.5" />
              Metrics Dashboard
            </span>
          </button>
          <button
            onClick={() => setActiveTab("playground")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "playground"
                ? "bg-white dark:bg-zinc-800 text-brand-navy dark:text-foreground shadow-sm"
                : "text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5" />
              Copilot Playground
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: METRICS DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="flex flex-col gap-6">
          
          {/* KPI grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Card className="p-5 flex flex-col gap-2 bg-card select-none text-left">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Suggestions
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-extrabold text-foreground font-mono">
                  {totalSuggestions}
                </span>
                <span className="text-[10px] font-semibold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  +12% wk
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 border-t border-brand-border/50 dark:border-border/30 pt-2">
                Suggestions compiled for team members
              </p>
            </Card>

            <Card className="p-5 flex flex-col gap-2 bg-card select-none text-left">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Acceptance Rate
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-extrabold text-foreground font-mono">
                  {acceptanceRate}%
                </span>
                <span className="text-[10px] font-semibold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  Target &gt;80%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 border-t border-brand-border/50 dark:border-border/30 pt-2">
                {acceptedCount} accepted vs {rejectedCount} rejected suggestions
              </p>
            </Card>

            <Card className="p-5 flex flex-col gap-2 bg-card select-none text-left">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Agent Hours Saved
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-extrabold text-foreground font-mono">
                  {totalSavedHours} hrs
                </span>
                <span className="text-[10px] font-semibold text-brand-navy dark:text-zinc-300 bg-brand-slate dark:bg-zinc-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  ~2.5m/ea
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 border-t border-brand-border/50 dark:border-border/30 pt-2">
                Estimated time saved by typing shortcut automation
              </p>
            </Card>

            <Card className="p-5 flex flex-col gap-2 bg-card select-none text-left">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Avg Response Time
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-extrabold text-foreground font-mono">
                  {averageResponseTimeSec}s
                </span>
                <span className="text-[10px] font-semibold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  -3.4s speedup
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 border-t border-brand-border/50 dark:border-border/30 pt-2">
                Average reply time since active copilot usage
              </p>
            </Card>

          </div>

          {/* SVG usage and saved hours chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <Card className="p-6 lg:col-span-2 flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between border-b border-brand-border dark:border-border/30 pb-3">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">
                    Efficiency Output Trend
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    Daily breakdown of saved agent minutes using AI recommendations.
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-1 rounded-lg">
                  Active Tracking
                </span>
              </div>

              {/* SVG bar chart */}
              <div className="w-full h-64 flex flex-col justify-between mt-2">
                <div className="relative flex-1 flex items-end justify-between px-4 pb-4 border-b border-brand-border/60 dark:border-border/30">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none">
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 text-[9px] text-muted-foreground/50 pt-0.5 text-right pr-2">400m</div>
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 text-[9px] text-muted-foreground/50 pt-0.5 text-right pr-2">300m</div>
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 text-[9px] text-muted-foreground/50 pt-0.5 text-right pr-2">200m</div>
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 text-[9px] text-muted-foreground/50 pt-0.5 text-right pr-2">100m</div>
                  </div>

                  {/* SVG bars */}
                  {timeLogs.map((log) => {
                    const pct = Math.min(100, Math.max(15, (log.minutesSaved / 420) * 100));
                    return (
                      <div key={log.id} className="flex flex-col items-center gap-2 w-10 md:w-16 z-10 group cursor-pointer">
                        <div className="w-full relative flex flex-col justify-end h-40">
                          {/* Accepted bar */}
                          <div
                            style={{ height: `${pct}%` }}
                            className="w-full rounded-t-md bg-gradient-to-t from-brand-navy to-brand-green dark:from-brand-navy/60 dark:to-brand-green/80 relative hover:brightness-105 transition-all shadow-sm"
                          >
                            {/* Hover label tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white dark:bg-zinc-850 text-[10px] font-mono px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                              {log.minutesSaved}m saved ({log.acceptedCount} accepts)
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant font-mono">
                          {log.date}
                        </span>
                      </div>
                    );
                  })}

                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground px-2 pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                    <span>Accepted Suggestion Minutes</span>
                  </div>
                  <span>Showing last 7 operational days</span>
                </div>
              </div>
            </Card>

            {/* AI Accuracy / Actionable Intent Stats */}
            <Card className="p-6 flex flex-col gap-4 text-left">
              <div className="border-b border-brand-border dark:border-border/30 pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">
                  AI Intent Distribution
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  Categories of inbound customer queries processed.
                </span>
              </div>

              <div className="flex flex-col gap-4 flex-1 justify-center">
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy dark:text-zinc-300">
                    <span>Technical Support</span>
                    <span className="font-mono">42% (417 cases)</span>
                  </div>
                  <div className="w-full h-2.5 bg-brand-slate dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-navy rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy dark:text-zinc-300">
                    <span>Sales & Pricing Inquiry</span>
                    <span className="font-mono">28% (278 cases)</span>
                  </div>
                  <div className="w-full h-2.5 bg-brand-slate dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full" style={{ width: "28%" }} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy dark:text-zinc-300">
                    <span>Billing & Refund Request</span>
                    <span className="font-mono">18% (178 cases)</span>
                  </div>
                  <div className="w-full h-2.5 bg-brand-slate dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy dark:text-zinc-300">
                    <span>General Welcome & Setup</span>
                    <span className="font-mono">12% (120 cases)</span>
                  </div>
                  <div className="w-full h-2.5 bg-brand-slate dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-sky rounded-full" style={{ width: "12%" }} />
                  </div>
                </div>

              </div>

              <div className="bg-brand-slate/40 dark:bg-zinc-900 p-3 rounded-lg border border-brand-border dark:border-border/30 text-center">
                <span className="text-[10px] text-muted-foreground block">Overall Auto-Intent Accuracy</span>
                <span className="text-lg font-extrabold text-brand-navy dark:text-foreground font-mono">94.8%</span>
              </div>
            </Card>

          </div>

          {/* Top agent team ranking */}
          <Card className="p-6 text-left">
            <div className="border-b border-brand-border dark:border-border/30 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">
                  Top Team Agents Using AI
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  Performance audit of workspace members accepting suggestions.
                </span>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Updated just now
              </span>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border dark:border-border/30 text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                    <th className="py-2.5 px-4">Agent Name</th>
                    <th className="py-2.5 px-4 font-mono">Total Suggestions</th>
                    <th className="py-2.5 px-4 font-mono">Accepted Suggestions</th>
                    <th className="py-2.5 px-4 font-mono">Rejected Suggestions</th>
                    <th className="py-2.5 px-4">Time Saved</th>
                    <th className="py-2.5 px-4">Acceptance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border dark:divide-border/20">
                  <tr className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-semibold text-brand-navy dark:text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-navy text-white flex items-center justify-center text-[10px] font-bold">SK</div>
                      Sarah Jenkins
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">340</td>
                    <td className="py-3 px-4 font-mono font-semibold text-brand-green">312</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">28</td>
                    <td className="py-3 px-4 font-semibold text-brand-navy dark:text-zinc-200">13.0 hrs</td>
                    <td className="py-3 px-4 font-bold text-brand-green">91.7%</td>
                  </tr>
                  <tr className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-semibold text-brand-navy dark:text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center text-[10px] font-bold">DL</div>
                      David Lee
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">288</td>
                    <td className="py-3 px-4 font-mono font-semibold text-brand-green">240</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">48</td>
                    <td className="py-3 px-4 font-semibold text-brand-navy dark:text-zinc-200">10.0 hrs</td>
                    <td className="py-3 px-4 font-bold text-brand-green">83.3%</td>
                  </tr>
                  <tr className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-semibold text-brand-navy dark:text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-sky text-white flex items-center justify-center text-[10px] font-bold">AS</div>
                      Amit Sharma
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">210</td>
                    <td className="py-3 px-4 font-mono font-semibold text-brand-green">172</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">38</td>
                    <td className="py-3 px-4 font-semibold text-brand-navy dark:text-zinc-200">7.1 hrs</td>
                    <td className="py-3 px-4 font-bold text-brand-green">81.9%</td>
                  </tr>
                  <tr className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-semibold text-brand-navy dark:text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">MG</div>
                      Maria Gomez
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">155</td>
                    <td className="py-3 px-4 font-mono font-semibold text-brand-green">104</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">51</td>
                    <td className="py-3 px-4 font-semibold text-brand-navy dark:text-zinc-200">4.3 hrs</td>
                    <td className="py-3 px-4 font-bold text-amber-500">67.1%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 2: COPOLIT PLAYGROUND */}
      {activeTab === "playground" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: INTERACTIVE COMPOSER, REWRITER, TRANSLATOR */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <Card className="p-6 text-left flex flex-col gap-4 relative overflow-hidden border border-brand-green/20">
              
              {/* Highlight ribbon */}
              <div className="absolute top-0 right-0 bg-brand-green/15 text-brand-green font-bold text-[9px] px-3 py-1 rounded-bl-lg uppercase border-l border-b border-brand-green/20">
                Playground Environment
              </div>

              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4.5 w-4.5 text-brand-green" />
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">
                  Smart Reply Playground Composer
                </h3>
              </div>

              <div className="flex flex-col gap-3 mt-1">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Type a customer question or load a snippet template on the right... (e.g. 'Can you tell me about Growth plan cost?')"
                  className="w-full min-h-[140px] max-h-[220px] p-3 text-sm border rounded-xl bg-white dark:bg-surface border-brand-border dark:border-border dark:text-foreground focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 transition-all text-brand-navy placeholder:text-on-surface-variant/40"
                />

                {/* Tone Selectors */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border/60 dark:border-border/30 pt-3">
                  <div className="flex items-center gap-1.5 bg-brand-slate/40 dark:bg-zinc-900 p-1 rounded-lg border border-brand-border/50 dark:border-border/30">
                    <span className="text-[10px] font-bold text-muted-foreground px-1 uppercase">Tone:</span>
                    {(["friendly", "professional", "support", "casual"] as const).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => setSelectedTone(tone)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded capitalize transition-all cursor-pointer ${
                          selectedTone === tone
                            ? "bg-brand-navy text-white dark:bg-zinc-800 dark:text-foreground"
                            : "text-muted-foreground hover:text-brand-navy dark:hover:text-foreground"
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {promptInput && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPromptInput("");
                          clearCurrent();
                          addToast("Playground reset", "info");
                        }}
                      >
                        Clear
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={status === "thinking" || status === "generating"}
                      onClick={handleGenerate}
                      leftIcon={<Sparkles className="h-3.5 w-3.5 text-brand-green" />}
                    >
                      Generate Reply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* OUTPUT PREVIEW PANEL */}
            {(currentSuggestion || status === "generating" || status === "thinking") && (
              <Card className="p-6 text-left border-l-4 border-l-brand-green flex flex-col gap-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-brand-border/60 dark:border-border/30 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                    <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                      {status === "thinking" ? "Thinking..." : status === "generating" ? "Generating Reply..." : "AI Suggested Response"}
                    </span>
                  </div>
                  {currentSuggestion && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyToClipboard(currentSuggestion, "Copied suggestion draft")}
                        className="p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 rounded transition-colors text-muted-foreground hover:text-brand-navy dark:hover:text-foreground cursor-pointer"
                        title="Copy Suggestion"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          logSuggestionFeedback(`sug-${Date.now()}`, "accept");
                          addToast("Logged feedback: Accepted suggestion!", "success");
                        }}
                        className="p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 rounded transition-colors text-brand-green cursor-pointer"
                        title="Accept Suggestion"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          logSuggestionFeedback(`sug-${Date.now()}`, "reject");
                          addToast("Logged feedback: Rejected suggestion", "warning");
                        }}
                        className="p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 rounded transition-colors text-red-500 cursor-pointer"
                        title="Reject Suggestion"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Response content */}
                <div className="min-h-[60px] bg-brand-slate/30 dark:bg-zinc-900/60 p-4 rounded-xl border border-brand-border/60 dark:border-border/30">
                  {status === "thinking" ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-xs select-none">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing details and reading local wiki FAQ files...
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-brand-navy dark:text-zinc-200 whitespace-pre-wrap">
                      {currentSuggestion || "Awaiting query generation..."}
                    </p>
                  )}
                </div>

                {/* Rewrite quick chips */}
                {currentSuggestion && (
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Rewrite:</span>
                      {(["improve", "simplify", "shorten", "expand", "correct", "empathy"] as const).map((act) => (
                        <button
                          key={act}
                          onClick={() => handleRewrite(act)}
                          disabled={status === "thinking"}
                          className="px-2 py-0.5 border border-brand-border dark:border-border/40 hover:bg-brand-slate dark:hover:bg-zinc-800 text-[10px] font-bold rounded-lg text-brand-navy dark:text-zinc-300 capitalize cursor-pointer disabled:opacity-50"
                        >
                          {act === "correct" ? "Fix Grammar" : act}
                        </button>
                      ))}
                    </div>

                    {/* Translator subdeck */}
                    <div className="flex items-center justify-between border-t border-brand-border/60 dark:border-border/30 pt-3 gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-brand-sky" />
                        <span className="text-xs font-bold text-brand-navy dark:text-zinc-300">Translate Draft:</span>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="text-[11px] font-bold border border-brand-border dark:border-border/40 rounded-lg p-1 bg-white dark:bg-zinc-900 text-brand-navy dark:text-zinc-300 outline-none cursor-pointer"
                        >
                          <option value="spanish">Spanish (Español)</option>
                          <option value="french">French (Français)</option>
                          <option value="german">German (Deutsch)</option>
                          <option value="japanese">Japanese (日本語)</option>
                          <option value="arabic">Arabic (العربية)</option>
                        </select>
                      </div>
                      <Button variant="outline" size="xs" onClick={handleTranslate} isLoading={status === "thinking"}>
                        Translate Outbound
                      </Button>
                    </div>

                    {/* Translated result window */}
                    {translatedText && (
                      <div className="mt-2 bg-brand-sky-light/10 dark:bg-brand-sky-light/5 border border-brand-sky/20 rounded-xl p-3.5 flex flex-col gap-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-brand-sky uppercase tracking-wider">
                            Output Translation ({translationLanguage})
                          </span>
                          <button
                            onClick={() => copyToClipboard(translatedText, "Copied translated text")}
                            className="p-0.5 text-muted-foreground hover:text-brand-navy dark:hover:text-foreground cursor-pointer"
                            title="Copy translation"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-xs text-brand-navy dark:text-zinc-300 font-medium">
                          {translatedText}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* SENTIMENT & INTENT REPORT CARD */}
            {currentSentiment && (
              <Card className="p-6 text-left flex flex-col gap-4 animate-fadeIn bg-brand-slate/20 dark:bg-zinc-950/20">
                <div className="border-b border-brand-border/60 dark:border-border/30 pb-2">
                  <h4 className="text-xs font-extrabold text-brand-navy dark:text-foreground uppercase tracking-wide">
                    Live Input Context Analysis
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Sentiment</span>
                    <span className="text-sm font-extrabold text-brand-navy dark:text-foreground capitalize mt-0.5">
                      {currentSentiment.sentiment}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Confidence Score</span>
                    <span className="text-sm font-mono font-extrabold text-brand-navy dark:text-foreground mt-0.5">
                      {currentSentiment.score}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Urgency Label</span>
                    <span className={`text-xs font-extrabold uppercase mt-1 px-2 py-0.5 rounded-full self-start ${
                      currentSentiment.urgency === "high"
                        ? "bg-red-950/20 text-red-500 border border-red-500/20"
                        : currentSentiment.urgency === "medium"
                        ? "bg-amber-950/20 text-amber-500 border border-amber-500/20"
                        : "bg-green-950/20 text-green-500 border border-green-500/20"
                    }`}>
                      {currentSentiment.urgency}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Language</span>
                    <span className="text-sm font-extrabold text-brand-navy dark:text-foreground mt-0.5">
                      {currentSentiment.detectedLanguage}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground border-t border-brand-border/40 dark:border-border/20 pt-2.5 flex items-center gap-1.5">
                  <Globe className="h-3 w-3" />
                  <span>Real-time local LLM classification pipeline completed.</span>
                </div>
              </Card>
            )}

          </div>

          {/* RIGHT COLUMN: PROMPT TEMPLATES & FAQ KNOWLEDGE BASE */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* PROMPT TEMPLATES WINDOW */}
            <Card className="p-6 text-left flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-brand-border/60 dark:border-border/30 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-brand-navy dark:text-zinc-300" />
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">
                    Prompt Quick Templates
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setShowAddTemplateModal(true)}
                  leftIcon={<Plus className="h-3 w-3" />}
                >
                  Add Custom
                </Button>
              </div>

              {/* Template Category Selectors */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(["all", "welcome", "support", "apology", "sales", "custom"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTemplateFilter(cat)}
                    className={`px-2 py-0.5 text-[10px] font-bold border rounded-lg capitalize transition-all cursor-pointer ${
                      templateFilter === cat
                        ? "bg-brand-navy text-white border-transparent dark:bg-zinc-800 dark:text-foreground"
                        : "text-muted-foreground border-brand-border dark:border-border/40 hover:bg-brand-slate dark:hover:bg-zinc-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Templates List */}
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-xs select-none">
                    No prompt templates registered in this category.
                  </div>
                ) : (
                  filteredTemplates.map((temp) => (
                    <div
                      key={temp.id}
                      className="group border border-brand-border/60 dark:border-border/20 rounded-xl p-3 hover:border-brand-navy dark:hover:border-zinc-500 hover:bg-brand-slate/20 dark:hover:bg-zinc-900/30 transition-all flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-brand-navy dark:text-foreground">{temp.name}</span>
                          <span className="text-[8px] font-bold text-muted-foreground bg-brand-slate dark:bg-zinc-800 border dark:border-border/50 px-1.5 py-0.5 rounded capitalize">
                            {temp.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleUseTemplate(temp.prompt)}
                            className="text-[10px] font-bold text-brand-green hover:underline cursor-pointer"
                          >
                            Load Template
                          </button>
                          {!temp.isSystem && (
                            <button
                              onClick={() => {
                                deletePromptTemplate(temp.id);
                                addToast("Template deleted", "info");
                              }}
                              className="text-muted-foreground hover:text-red-500 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ml-1"
                              title="Delete template"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                        {temp.description}
                      </p>
                      <p className="text-[10px] text-brand-navy dark:text-zinc-300 font-mono bg-brand-slate/30 dark:bg-zinc-950/40 p-2 rounded border border-brand-border/40 dark:border-border/10 line-clamp-2">
                        {temp.prompt}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* SEMANTIC WIKI & FAQ SEARCH */}
            <Card className="p-6 text-left flex flex-col gap-4">
              <div className="border-b border-brand-border/60 dark:border-border/30 pb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4.5 w-4.5 text-brand-navy dark:text-zinc-300" />
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">
                    Knowledge Base FAQs & Policies
                  </h3>
                </div>
              </div>

              {/* Search Bar */}
              <Input
                type="search"
                isAi={true}
                placeholder="Query workspace policies, pricing details, or FAQ wikis..."
                value={searchQuery}
                onChange={handleKbSearchChange}
              />

              {/* FAQ Results */}
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {searchResults.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-xs select-none">
                    No matching FAQ documents found in search index.
                  </div>
                ) : (
                  searchResults.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-brand-border/50 dark:border-border/20 rounded-xl p-3 bg-brand-slate/10 dark:bg-zinc-900/10 flex flex-col gap-1.5 hover:border-brand-navy transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-navy dark:text-foreground">{doc.title}</span>
                        <button
                          onClick={() => handleLoadFaqContext(doc.content)}
                          className="text-[10px] font-bold text-brand-sky hover:underline cursor-pointer"
                        >
                          Use Context
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3">
                        {doc.content}
                      </p>
                      <div className="flex items-center gap-1 flex-wrap mt-0.5">
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[8px] font-bold text-muted-foreground border border-brand-border dark:border-border/30 px-1.5 py-0.2 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

          </div>

        </div>
      )}

      {/* CREATE PROMPT TEMPLATE MODAL */}
      {showAddTemplateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-brand-border dark:border-border/30 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="h-4.5 w-4.5 text-brand-green" />
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">
                  Create Custom Prompt Template
                </h3>
              </div>
              <button
                onClick={() => setShowAddTemplateModal(false)}
                className="text-muted-foreground hover:text-brand-navy dark:hover:text-foreground text-xs cursor-pointer font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="flex flex-col gap-4">
              
              <Input
                label="Template Name"
                placeholder="e.g. Out of Office Auto-reply"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                required
              />

              <Input
                label="Brief Description"
                placeholder="e.g. Reply message sent when customer contacts outside support hours."
                value={newTemplateDesc}
                onChange={(e) => setNewTemplateDesc(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-navy dark:text-foreground select-none">
                  Category Type
                </label>
                <select
                  value={newTemplateCat}
                  onChange={(e) => setNewTemplateCat(e.target.value as any)}
                  className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="welcome">Welcome</option>
                  <option value="support">Support</option>
                  <option value="apology">Apology</option>
                  <option value="sales">Sales</option>
                  <option value="custom">Custom (General)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-navy dark:text-foreground select-none">
                  Template Content
                </label>
                <textarea
                  value={newTemplatePrompt}
                  onChange={(e) => setNewTemplatePrompt(e.target.value)}
                  placeholder="Draft your template context here. You may use tags like [Agent Name], [Customer Name], [Time Frame]."
                  required
                  className="w-full min-h-[100px] max-h-[160px] p-3 text-sm border rounded-lg bg-white dark:bg-zinc-900 border-brand-border dark:border-border dark:text-foreground focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 transition-all text-brand-navy"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-brand-border dark:border-border/30 pt-3">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowAddTemplateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Template
                </Button>
              </div>

            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
