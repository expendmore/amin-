"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import PageContainer from "@/components/navigation/PageContainer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatusChip from "@/components/ui/StatusChip";
import Card from "@/components/ui/Card";
import { useToast } from "@/store/use-toast";
import { useDashboard } from "@/store/use-dashboard";
import { 
  Bot, 
  Plus, 
  Search, 
  Sliders, 
  Grid, 
  List, 
  Star, 
  Settings, 
  Trash2, 
  Copy, 
  Archive, 
  Play, 
  TrendingUp, 
  Clock, 
  Activity, 
  Brain, 
  Wrench, 
  FileText, 
  Globe, 
  Database, 
  Send,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Shield,
  Layers,
  ChevronDown,
  Info,
  Calendar,
  Mail,
  AlertTriangle,
  FolderOpen,
  MessageSquare
} from "lucide-react";

// Agent Interface
interface Agent {
  id: string;
  name: string;
  category: "Support" | "Development" | "Analytics" | "Creative";
  modelName: string;
  modelProvider: string;
  status: "Draft" | "Published" | "Archived";
  description: string;
  isPinned: boolean;
  isFavorite: boolean;
  runs: number;
  successRate: number;
  latency: string;
  rating: number;
  systemPrompt: string;
  temperature: number;
  memoryShort: boolean;
  memoryLong: boolean;
  tools: string[];
}

// Log Interface
interface ExecutionLog {
  time: string;
  type: "info" | "debug" | "error" | "warn";
  message: string;
}

// Attached File Interface
interface KnowledgeFile {
  id: string;
  name: string;
  size: string;
  progress: number;
}

export default function AgentsPlatformPage() {
  const { addToast } = useToast();
  const { profile } = useDashboard();

  // Navigation state: dashboard | create | details | playground
  const [view, setView] = useState<"dashboard" | "create" | "details" | "playground">("dashboard");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Layout view options
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"runs" | "success" | "name">("runs");

  // Mock initial Agents state
  const [agents, setAgents] = useState<Agent[]>([
    { 
      id: "a1", 
      name: "Abandoned Cart Handler", 
      category: "Support", 
      modelProvider: "openai",
      modelName: "gpt-4o", 
      status: "Published", 
      description: "Engages users who abandon Shopify checkout carts via dynamic WhatsApp reminders.", 
      isPinned: true, 
      isFavorite: true, 
      runs: 450, 
      successRate: 98.4, 
      latency: "320ms", 
      rating: 5.0,
      systemPrompt: "You are a customer success specialist reclaiming abandoned Shopify checkouts via WhatsApp alerts.",
      temperature: 0.7,
      memoryShort: true,
      memoryLong: true,
      tools: ["WhatsApp", "Database"]
    },
    { 
      id: "a2", 
      name: "Hubspot Lead Qualifier", 
      category: "Development", 
      modelProvider: "anthropic",
      modelName: "claude-3-5-sonnet", 
      status: "Published", 
      description: "Qualifies incoming cold leads against BANT budget and authority matrices, updating Hubspot properties.", 
      isPinned: false, 
      isFavorite: true, 
      runs: 120, 
      successRate: 100.0, 
      latency: "450ms", 
      rating: 4.8,
      systemPrompt: "You qualify business prospects using direct CRM integration parameters.",
      temperature: 0.3,
      memoryShort: true,
      memoryLong: false,
      tools: ["CRM", "Email"]
    },
    { 
      id: "a3", 
      name: "Contact Properties Sync Manager", 
      category: "Analytics", 
      modelProvider: "google",
      modelName: "gemini-1.5-flash", 
      status: "Draft", 
      description: "Resolves conflicting webhook metadata updates across active communication lines.", 
      isPinned: false, 
      isFavorite: false, 
      runs: 0, 
      successRate: 0.0, 
      latency: "0ms", 
      rating: 0.0,
      systemPrompt: "You synchronize metadata mappings across active communication platforms.",
      temperature: 0.2,
      memoryShort: false,
      memoryLong: false,
      tools: ["Database", "Webhook"]
    },
    { 
      id: "a4", 
      name: "Stripe Refund Arbitrator", 
      category: "Support", 
      modelProvider: "openai",
      modelName: "gpt-4o", 
      status: "Archived", 
      description: "Validates transaction logs and initiates Stripe portal queries to handle customer disputes.", 
      isPinned: false, 
      isFavorite: false, 
      runs: 340, 
      successRate: 94.2, 
      latency: "380ms", 
      rating: 4.2,
      systemPrompt: "You audit payment transactions and process refund validation steps safely.",
      temperature: 0.1,
      memoryShort: true,
      memoryLong: true,
      tools: ["Database", "API"]
    }
  ]);

  // Selected agent details state
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  // WIZARD CREATION FORM STATES
  const [wizardStep, setWizardStep] = useState(1);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentDesc, setNewAgentDesc] = useState("");
  const [newAgentCat, setNewAgentCat] = useState<"Support" | "Development" | "Analytics" | "Creative">("Support");
  const [newAgentProvider, setNewAgentProvider] = useState("openai");
  const [newAgentModel, setNewAgentModel] = useState("gpt-4o");
  const [newAgentTemp, setNewAgentTemp] = useState(0.7);
  const [newAgentInstructions, setNewAgentInstructions] = useState("");
  const [newAgentMemoryShort, setNewAgentMemoryShort] = useState(true);
  const [newAgentMemoryLong, setNewAgentMemoryLong] = useState(true);
  const [newAgentTools, setNewAgentTools] = useState<string[]>([]);
  const [wizardKnowledge, setWizardKnowledge] = useState<string>("");

  // DETAIL SCREEN TABS STATE: overview | settings | knowledge | logs | analytics
  const [detailTab, setDetailTab] = useState<"overview" | "settings" | "knowledge" | "logs" | "analytics">("overview");
  
  // Knowledge Base upload logs
  const [attachedDocs, setAttachedDocs] = useState<KnowledgeFile[]>([
    { id: "k1", name: "shopify_return_policy.pdf", size: "2.4 MB", progress: 100 },
    { id: "k2", name: "crm_integration_webhooks.txt", size: "120 KB", progress: 100 }
  ]);
  const [newUrlInput, setNewUrlInput] = useState("");

  // Sandbox Playground states
  const [playgroundPrompt, setPlaygroundPrompt] = useState("");
  const [playgroundMessages, setPlaygroundMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [playgroundLogs, setPlaygroundLogs] = useState<ExecutionLog[]>([]);
  const [isSandboxTyping, setIsSandboxTyping] = useState(false);
  const playMessagesEndRef = useRef<HTMLDivElement>(null);
  const playLogsEndRef = useRef<HTMLDivElement>(null);

  // Create wizard transitions
  const handleStartCreate = () => {
    setWizardStep(1);
    setNewAgentName("");
    setNewAgentDesc("");
    setNewAgentCat("Support");
    setNewAgentProvider("openai");
    setNewAgentModel("gpt-4o");
    setNewAgentTemp(0.7);
    setNewAgentInstructions("You are acting as a helpful workspace assistant.");
    setNewAgentMemoryShort(true);
    setNewAgentMemoryLong(true);
    setNewAgentTools([]);
    setWizardKnowledge("");
    setView("create");
  };

  const handleCreatePublish = () => {
    if (!newAgentName.trim()) {
      addToast("Please provide a name for the AI Agent.", "error");
      return;
    }

    const newAgentItem: Agent = {
      id: `a_${Math.random().toString(36).substring(2, 9)}`,
      name: newAgentName,
      category: newAgentCat,
      modelProvider: newAgentProvider,
      modelName: newAgentModel,
      status: "Published",
      description: newAgentDesc || "No description provided.",
      isPinned: false,
      isFavorite: false,
      runs: 0,
      successRate: 100,
      latency: "0ms",
      rating: 5.0,
      systemPrompt: newAgentInstructions,
      temperature: newAgentTemp,
      memoryShort: newAgentMemoryShort,
      memoryLong: newAgentMemoryLong,
      tools: newAgentTools
    };

    setAgents(prev => [newAgentItem, ...prev]);
    addToast(`AI Agent "${newAgentName}" published successfully!`, "success");
    setView("dashboard");
  };

  // Actions handlers
  const handleToggleFavorite = (id: string, name: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        const nextFav = !a.isFavorite;
        addToast(nextFav ? `Added "${name}" to favorites.` : `Removed "${name}" from favorites.`, "info");
        return { ...a, isFavorite: nextFav };
      }
      return a;
    }));
  };

  const handleCloneAgent = (id: string, name: string) => {
    const target = agents.find(a => a.id === id);
    if (!target) return;

    const cloned: Agent = {
      ...target,
      id: `a_${Math.random().toString(36).substring(2, 9)}`,
      name: `Copy of ${target.name}`,
      runs: 0,
      successRate: 100,
      isFavorite: false,
      isPinned: false
    };

    setAgents(prev => [cloned, ...prev]);
    addToast(`Cloned agent "${name}" successfully.`, "success");
  };

  const handleArchiveAgent = (id: string, name: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === "Archived" ? "Published" : "Archived";
        addToast(nextStatus === "Archived" ? `Archived "${name}".` : `Restored "${name}".`, "info");
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const handleDeleteAgent = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete agent "${name}"?`)) {
      setAgents(prev => prev.filter(a => a.id !== id));
      addToast(`Deleted agent "${name}".`, "info");
    }
  };

  // Detail screen changes submit
  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    addToast("Agent configuration settings saved.", "success");
    setView("dashboard");
  };

  // Knowledge base file attachment mock
  const handleUploadKBFile = () => {
    const mockFile: KnowledgeFile = {
      id: `k_${Math.random().toString(36).substring(2, 9)}`,
      name: "custom_source_data.pdf",
      size: "820 KB",
      progress: 0
    };
    setAttachedDocs(prev => [...prev, mockFile]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setAttachedDocs(prev => prev.map(f => f.id === mockFile.id ? { ...f, progress: Math.min(progress, 100) } : f));
      if (progress >= 100) {
        clearInterval(interval);
        addToast("Knowledge base vector file uploaded.", "success");
      }
    }, 200);
  };

  const handleAddUrlKB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlInput.trim()) return;
    addToast(`Crawled URL context details indexed successfully.`, "success");
    setNewUrlInput("");
  };

  const handleRemoveDoc = (id: string, name: string) => {
    setAttachedDocs(prev => prev.filter(d => d.id !== id));
    addToast(`Removed knowledge source "${name}".`, "info");
  };

  // Sandbox Playground Chat stream
  const handleSendPlayground = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playgroundPrompt.trim() || !selectedAgent || isSandboxTyping) return;

    const userText = playgroundPrompt;
    setPlaygroundPrompt("");
    setPlaygroundMessages(prev => [...prev, { role: "user", content: userText }]);
    
    // Add start debug logs
    const newLogs: ExecutionLog[] = [
      { time: new Date().toLocaleTimeString(), type: "info", message: `[Sandbox] Dispatching query to Agent: ${selectedAgent.name}` },
      { time: new Date().toLocaleTimeString(), type: "debug", message: `[Memory] Short-term context loaded (Active: ${selectedAgent.memoryShort ? "YES" : "NO"})` },
      { time: new Date().toLocaleTimeString(), type: "debug", message: `[Memory] Long-term vectors parsed (Active: ${selectedAgent.memoryLong ? "YES" : "NO"})` }
    ];
    setPlaygroundLogs(prev => [...prev, ...newLogs]);

    setIsSandboxTyping(true);

    setTimeout(() => {
      // Simulate tools logs
      const toolsLogs: ExecutionLog[] = selectedAgent.tools.map(tool => ({
        time: new Date().toLocaleTimeString(),
        type: "info",
        message: `[Tools] Invoking secure API parameters for integration: ${tool}`
      }));

      setPlaygroundLogs(prev => [...prev, ...toolsLogs]);
    }, 800);

    setTimeout(() => {
      const completionLogs: ExecutionLog[] = [
        { time: new Date().toLocaleTimeString(), type: "debug", message: `[Gateway] Received token completion from ${selectedAgent.modelProvider}/${selectedAgent.modelName}` },
        { time: new Date().toLocaleTimeString(), type: "info", message: `[Metrics] Query completed in ${selectedAgent.latency || "280ms"}. Consumed 180 tokens.` }
      ];
      setPlaygroundLogs(prev => [...prev, ...completionLogs]);

      const mockReply = `Hello! I am your configured "${selectedAgent.name}" AI Agent, optimized with ${selectedAgent.modelName}. I successfully parsed your prompt and triggered the linked tools (${selectedAgent.tools.join(", ") || "None"}). Ready to assist.`;
      setPlaygroundMessages(prev => [...prev, { role: "assistant", content: mockReply }]);
      setIsSandboxTyping(false);
    }, 1500);
  };

  // Scroll logic in Playground
  useEffect(() => {
    playMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [playgroundMessages]);

  useEffect(() => {
    playLogsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [playgroundLogs]);

  // Filters logic
  const filteredAgents = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedAgents = [...filteredAgents].sort((x, y) => {
    if (sortBy === "runs") return y.runs - x.runs;
    if (sortBy === "success") return y.successRate - x.successRate;
    return x.name.localeCompare(y.name);
  });

  // Tools checklists helpers
  const handleToggleTool = (tool: string) => {
    if (newAgentTools.includes(tool)) {
      setNewAgentTools(prev => prev.filter(t => t !== tool));
    } else {
      setNewAgentTools(prev => [...prev, tool]);
    }
  };

  return (
    <DashboardShell>
      <PageContainer
        title="AI Agent Platform"
        subtitle="Configure system personas, connect external API tools, and audit execution histories."
      >
        <div className="flex flex-col gap-6 max-w-6xl pb-12 select-none">
          
          {/* VIEW 1: AGENT DASHBOARD & LIBRARY */}
          {view === "dashboard" && (
            <div className="flex flex-col gap-6">
              
              {/* Top stats bento grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
                <Card className="p-5 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Total AI Agents</span>
                  <span className="text-3xl font-extrabold text-foreground font-mono">{agents.length}</span>
                  <span className="text-[9px] text-zinc-400">Published or drafts</span>
                </Card>
                <Card className="p-5 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Runs Today</span>
                  <span className="text-3xl font-extrabold text-foreground font-mono">910</span>
                  <span className="text-[9px] text-emerald-500 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +15.5% vs yesterday
                  </span>
                </Card>
                <Card className="p-5 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Average Success %</span>
                  <span className="text-3xl font-extrabold text-foreground font-mono">98.1%</span>
                  <span className="text-[9px] text-zinc-400">Calculated over all runs</span>
                </Card>
                <button
                  onClick={handleStartCreate}
                  className="p-5 border border-brand-sky bg-brand-sky-light/10 hover:bg-brand-sky-light/20 text-brand-sky rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                >
                  <Plus className="h-6 w-6" />
                  <span className="text-xs font-bold uppercase tracking-wider">Create New Agent</span>
                </button>
              </div>

              {/* Favorites row */}
              {agents.some(a => a.isFavorite) && (
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Starred Agents</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.filter(a => a.isFavorite).map(a => (
                      <Card key={a.id} className="p-4 flex justify-between items-start gap-4 hover:border-brand-sky/30 transition-all select-none">
                        <div className="flex flex-col gap-1.5 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4.5 w-4.5 text-brand-sky shrink-0 animate-pulse" />
                            <span className="text-xs font-bold text-foreground truncate">{a.name}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground leading-normal truncate">{a.description}</span>
                          <span className="text-[9px] font-bold font-mono text-brand-sky uppercase tracking-wider">{a.modelName}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-end shrink-0">
                          <button
                            onClick={() => handleToggleFavorite(a.id, a.name)}
                            className="p-1 hover:bg-zinc-800 text-yellow-500 rounded cursor-pointer"
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </button>
                          <Button
                            onClick={() => { setSelectedAgentId(a.id); setPlaygroundMessages([]); setPlaygroundLogs([]); setView("playground"); }}
                            size="xs"
                            className="h-7 text-[9px] px-2 uppercase font-bold"
                          >
                            Run
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Library Controls */}
              <div className="border border-border bg-card rounded-2xl p-6 flex flex-col gap-4">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <span className="text-sm font-bold text-foreground">AI Agent Library</span>
                  
                  {/* Category filters */}
                  <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
                    {["All", "Support", "Development", "Analytics", "Creative"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-brand-sky text-white font-extrabold shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search / Sort toolbar */}
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <div className="flex-grow w-full relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search agents by name, tag, category, or descriptions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs focus:outline-none focus:border-brand-sky"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0 select-none w-full md:w-auto justify-end">
                    {/* Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="h-10 px-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-muted-foreground focus:outline-none cursor-pointer"
                    >
                      <option value="runs">Recently Active (Runs)</option>
                      <option value="success">Success Rate %</option>
                      <option value="name">Alphabetical (A-Z)</option>
                    </select>

                    {/* Grid vs List toggle */}
                    <div className="flex items-center border border-border rounded-lg p-0.5 bg-zinc-950/20">
                      <button
                        onClick={() => setIsGridView(true)}
                        className={`p-1.5 rounded-md cursor-pointer ${isGridView ? "bg-white dark:bg-zinc-800 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIsGridView(false)}
                        className={`p-1.5 rounded-md cursor-pointer ${!isGridView ? "bg-white dark:bg-zinc-800 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rendering Library items */}
                {sortedAgents.length === 0 ? (
                  <div className="p-10 text-center italic text-xs text-muted-foreground">
                    No active agents match your search parameters. Create one above.
                  </div>
                ) : isGridView ? (
                  /* Grid Card View */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {sortedAgents.map((a) => (
                      <div 
                        key={a.id}
                        className="border border-border hover:border-brand-sky/40 bg-zinc-900/10 hover:shadow-md transition-all rounded-xl p-5 flex flex-col justify-between gap-4 select-none relative group/card"
                      >
                        {/* Options trigger dropdown list hover */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center bg-zinc-950/90 border border-border rounded text-muted-foreground select-none overflow-hidden z-20">
                          <button
                            onClick={() => handleToggleFavorite(a.id, a.name)}
                            className={`p-1.5 hover:bg-zinc-800 cursor-pointer ${a.isFavorite ? "text-yellow-500" : ""}`}
                            title="Star Favorite"
                          >
                            <Star className="h-3.5 w-3.5" fill={a.isFavorite ? "currentColor" : "none"} />
                          </button>
                          <button
                            onClick={() => handleCloneAgent(a.id, a.name)}
                            className="p-1.5 hover:bg-zinc-800 hover:text-foreground cursor-pointer"
                            title="Clone agent"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleArchiveAgent(a.id, a.name)}
                            className="p-1.5 hover:bg-zinc-800 hover:text-foreground cursor-pointer"
                            title="Archive / Unarchive"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(a.id, a.name)}
                            className="p-1.5 hover:bg-zinc-800 hover:text-destructive cursor-pointer"
                            title="Delete agent"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Top Info */}
                        <div className="flex flex-col gap-2 text-left">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-zinc-800 text-[10px] font-bold font-mono text-brand-sky flex items-center justify-center select-none uppercase shrink-0">
                              {a.name.charAt(0)}
                            </div>
                            <div className="flex flex-col max-w-[70%]">
                              <span className="font-bold text-foreground text-xs truncate leading-snug">{a.name}</span>
                              <span className="text-[8px] font-bold font-mono text-muted-foreground/80 bg-zinc-800 px-1.5 py-0.5 rounded leading-none w-max uppercase tracking-wider">{a.category}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-normal mt-1 h-14 overflow-hidden text-ellipsis line-clamp-3">
                            {a.description}
                          </p>
                        </div>

                        {/* Stats Summary */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-border/40 select-none">
                          <div className="flex justify-between items-center text-[9px] font-mono font-bold text-muted-foreground uppercase leading-none">
                            <span>Runs: {a.runs}</span>
                            <span>Success: {a.successRate}%</span>
                          </div>
                          
                          {/* Actions */}
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => { setSelectedAgentId(a.id); setDetailTab("overview"); setView("details"); }}
                              className="text-[9px] font-bold uppercase tracking-wider h-8"
                            >
                              Inspect
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => { setSelectedAgentId(a.id); setPlaygroundMessages([]); setPlaygroundLogs([]); setView("playground"); }}
                              className="text-[9px] font-bold uppercase tracking-wider h-8 flex items-center gap-1 justify-center"
                            >
                              <Play className="h-3 w-3 fill-current" />
                              <span>Test Sandbox</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="border border-border rounded-xl overflow-hidden bg-zinc-900/30">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-zinc-900/60 text-muted-foreground select-none">
                          <th className="p-3 font-semibold">Agent Name</th>
                          <th className="p-3 font-semibold">Category</th>
                          <th className="p-3 font-semibold">Model Provider</th>
                          <th className="p-3 font-semibold">Runs</th>
                          <th className="p-3 font-semibold">Success Rate %</th>
                          <th className="p-3 font-semibold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedAgents.map((a) => (
                          <tr key={a.id} className="border-b border-border last:border-0 hover:bg-zinc-900/10">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Bot className="h-4 w-4 text-brand-sky animate-pulse shrink-0" />
                                <span className="font-bold text-foreground">{a.name}</span>
                              </div>
                            </td>
                            <td className="p-3 text-muted-foreground">{a.category}</td>
                            <td className="p-3 font-mono text-zinc-400">{a.modelName}</td>
                            <td className="p-3 text-foreground font-mono">{a.runs}</td>
                            <td className="p-3 text-emerald-400 font-bold font-mono">{a.successRate}%</td>
                            <td className="p-3 text-center flex items-center gap-1.5 justify-center">
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={() => { setSelectedAgentId(a.id); setDetailTab("overview"); setView("details"); }}
                                className="text-[9px] h-7 px-2 uppercase font-bold"
                              >
                                Inspect
                              </Button>
                              <Button
                                size="xs"
                                onClick={() => { setSelectedAgentId(a.id); setPlaygroundMessages([]); setPlaygroundLogs([]); setView("playground"); }}
                                className="text-[9px] h-7 px-2 uppercase font-bold flex items-center gap-1"
                              >
                                <Play className="h-3 w-3 fill-current" />
                                <span>Run</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* VIEW 2: CREATE AGENT WIZARD */}
          {view === "create" && (
            <div className="border border-border bg-card rounded-2xl p-6 flex flex-col gap-6 max-w-2xl mx-auto w-full">
              
              {/* Wizard Header controls */}
              <div className="flex justify-between items-center select-none border-b border-border/40 pb-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-foreground">Create AI Workspace Agent</span>
                  <span className="text-xs text-muted-foreground">Step {wizardStep} of 5: {
                    wizardStep === 1 ? "General Information" :
                    wizardStep === 2 ? "Intelligence Settings" :
                    wizardStep === 3 ? "Knowledge Base Source" :
                    wizardStep === 4 ? "Tools & Integrations" : "Review & Publish"
                  }</span>
                </div>
                
                <button
                  onClick={() => setView("dashboard")}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Cancel Wizard</span>
                </button>
              </div>

              {/* Progress Steps Indicators */}
              <div className="flex items-center gap-2 select-none justify-center px-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <React.Fragment key={idx}>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      wizardStep === idx + 1
                        ? "bg-brand-sky text-white"
                        : wizardStep > idx + 1
                        ? "bg-brand-sky/20 border border-brand-sky/30 text-brand-sky"
                        : "bg-zinc-800 text-muted-foreground border border-border/40"
                    }`}>
                      {idx + 1}
                    </div>
                    {idx < 4 && <div className={`h-0.5 flex-grow ${wizardStep > idx + 1 ? "bg-brand-sky" : "bg-zinc-800"}`} />}
                  </React.Fragment>
                ))}
              </div>

              {/* STEP CONTENT RENDERS */}
              <div className="py-2 flex-grow min-h-[300px]">
                
                {/* STEP 1: General Info */}
                {wizardStep === 1 && (
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Agent Name"
                      placeholder="e.g. Abandoned Cart Assistant"
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                    />
                    
                    <div className="flex flex-col gap-1.5 w-full select-none">
                      <label className="text-xs font-semibold text-brand-navy select-none">
                        Category Classification
                      </label>
                      <select
                        value={newAgentCat}
                        onChange={(e) => setNewAgentCat(e.target.value as any)}
                        className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none"
                      >
                        <option value="Support">Support & Customer Engagement</option>
                        <option value="Development">Development & Webhook Scripts</option>
                        <option value="Analytics">Analytics & CRM Synchronizers</option>
                        <option value="Creative">Creative Writing & Synthesizers</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-semibold text-brand-navy select-none">
                        Role Description
                      </label>
                      <textarea
                        value={newAgentDesc}
                        onChange={(e) => setNewAgentDesc(e.target.value)}
                        className="w-full h-20 p-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs leading-relaxed text-foreground focus:outline-none focus:border-brand-sky resize-none"
                        placeholder="Explain briefly what trigger rules this agent handles..."
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Intelligence & Models */}
                {wizardStep === 2 && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5 w-full select-none">
                      <label className="text-xs font-semibold text-brand-navy select-none">
                        Intelligence Model Provider
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newAgentProvider}
                          onChange={(e) => {
                            setNewAgentProvider(e.target.value);
                            setNewAgentModel(e.target.value === "openai" ? "gpt-4o" : e.target.value === "anthropic" ? "claude-3-5-sonnet" : "gemini-1.5-flash");
                          }}
                          className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none cursor-pointer"
                        >
                          <option value="openai">OpenAI Gateway</option>
                          <option value="anthropic">Anthropic Claude</option>
                          <option value="google">Google Gemini</option>
                        </select>
                        
                        <select
                          value={newAgentModel}
                          onChange={(e) => setNewAgentModel(e.target.value)}
                          className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none cursor-pointer"
                        >
                          {newAgentProvider === "openai" ? (
                            <>
                              <option value="gpt-4o">gpt-4o (Reasoning)</option>
                              <option value="gpt-4o-mini">gpt-4o-mini (Speed)</option>
                            </>
                          ) : newAgentProvider === "anthropic" ? (
                            <option value="claude-3-5-sonnet">claude-3-5-sonnet (Quality)</option>
                          ) : (
                            <option value="gemini-1.5-flash">gemini-1.5-flash (Context)</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 select-none">
                      <div className="flex justify-between items-center text-xs font-semibold text-brand-navy">
                        <span>Temperature Deviation</span>
                        <span className="font-mono text-brand-sky">{newAgentTemp}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={newAgentTemp}
                        onChange={(e) => setNewAgentTemp(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-sky"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-semibold text-brand-navy select-none">
                        System Prompt Instructions
                      </label>
                      <textarea
                        value={newAgentInstructions}
                        onChange={(e) => setNewAgentInstructions(e.target.value)}
                        className="w-full h-32 p-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs leading-relaxed text-foreground focus:outline-none focus:border-brand-sky resize-none"
                        placeholder="Always write in strict TS. Answer in markdown format..."
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Knowledge Base attachment */}
                {wizardStep === 3 && (
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-semibold text-brand-navy select-none">Attach Custom Vector Documents</span>
                    <p className="text-[10px] text-muted-foreground leading-normal -mt-2">
                      Upload text databases to index context variables. Active models consult these sources before response generation.
                    </p>

                    <div className="border border-dashed border-border p-8 rounded-xl text-center bg-zinc-950/5 flex flex-col items-center justify-center gap-3">
                      <FolderOpen className="h-8 w-8 text-brand-sky" />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-foreground">Click to browse file directory</span>
                        <span className="text-[9px] text-muted-foreground">Supports PDF, DOCX, TXT, CSV, JSON (Max 10MB)</span>
                      </div>
                      <Button type="button" variant="outline" size="xs" onClick={() => addToast("Knowledge file attached in draft queue.", "info")} className="text-[9px] font-bold uppercase">
                        Upload Mock PDF
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase select-none">Website URL Indexing</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. https://docs.shopify.com"
                          value={wizardKnowledge}
                          onChange={(e) => setWizardKnowledge(e.target.value)}
                          className="flex-grow h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none"
                        />
                        <Button type="button" size="sm" onClick={() => { if (wizardKnowledge.trim()) { addToast("Domain queued for crawler index.", "success"); setWizardKnowledge(""); } }} className="h-10 text-xs px-4">
                          Index URL
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Tools & Memory */}
                {wizardStep === 4 && (
                  <div className="flex flex-col gap-5 select-none">
                    
                    {/* Memory switches */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-semibold text-brand-navy">AI Agent Memory Layers</span>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="p-3 border border-border rounded-xl flex items-center justify-between cursor-pointer bg-zinc-900/30">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-foreground leading-none">Short-term Memory</span>
                            <span className="text-[8px] text-muted-foreground">Store chat session context</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={newAgentMemoryShort}
                            onChange={(e) => setNewAgentMemoryShort(e.target.checked)}
                            className="rounded border-border text-brand-sky focus:ring-brand-sky h-4 w-4 cursor-pointer"
                          />
                        </label>

                        <label className="p-3 border border-border rounded-xl flex items-center justify-between cursor-pointer bg-zinc-900/30">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-foreground leading-none">Long-term Vectors</span>
                            <span className="text-[8px] text-muted-foreground">Sync long range database summaries</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={newAgentMemoryLong}
                            onChange={(e) => setNewAgentMemoryLong(e.target.checked)}
                            className="rounded border-border text-brand-sky focus:ring-brand-sky h-4 w-4 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    <hr className="border-border/45" />

                    {/* Integrated Tools checklist */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-semibold text-brand-navy">Enable External Actions (Tools API)</span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left">
                        {["WhatsApp", "Email", "Database", "CRM", "Google Sheets", "API Gateway"].map((tool) => (
                          <label key={tool} className="p-3 border border-border rounded-xl flex items-center gap-2 cursor-pointer bg-zinc-900/30">
                            <input
                              type="checkbox"
                              checked={newAgentTools.includes(tool)}
                              onChange={() => handleToggleTool(tool)}
                              className="rounded border-border text-brand-sky focus:ring-brand-sky h-4 w-4 cursor-pointer"
                            />
                            <span className="text-[10px] font-bold text-foreground">{tool}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* STEP 5: Review & Publish */}
                {wizardStep === 5 && (
                  <div className="flex flex-col gap-4 text-xs leading-normal">
                    <span className="text-xs font-bold text-foreground border-b border-border pb-1.5 uppercase select-none">Review Agent Blueprint</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 select-text">
                      <div className="flex flex-col gap-1.5 select-text">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">General Details</span>
                        <span className="text-xs font-bold text-foreground select-text">Name: {newAgentName || "Untitled Agent"}</span>
                        <span className="text-[10px] text-muted-foreground select-text">Description: {newAgentDesc || "None"}</span>
                        <span className="text-[10px] text-brand-sky font-bold font-mono">Category: {newAgentCat.toUpperCase()}</span>
                      </div>

                      <div className="flex flex-col gap-1.5 select-text">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Intelligence & Limits</span>
                        <span className="text-xs font-bold text-foreground">Model: {newAgentProvider}/{newAgentModel}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">Temperature: {newAgentTemp}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">Short Memory: {newAgentMemoryShort ? "YES" : "NO"} | Long Memory: {newAgentMemoryLong ? "YES" : "NO"}</span>
                        <span className="text-[10px] text-brand-sky font-bold">Enabled Tools: {newAgentTools.join(", ") || "None"}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-brand-sky-light/5 border border-brand-sky/20 rounded-xl mt-3 flex gap-2 select-none">
                      <Info className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
                      <span className="text-[10px] text-zinc-300 leading-normal">
                        By clicking "Publish Agent", this agent is deployed and registered inside the active Library grid. You can test it inside the Playground sandbox immediately.
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Wizard navigation footer buttons */}
              <div className="flex items-center justify-between select-none border-t border-border/40 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={wizardStep === 1}
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="text-xs uppercase font-bold"
                >
                  Previous
                </Button>

                {wizardStep < 5 ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (wizardStep === 1 && !newAgentName.trim()) {
                        addToast("Please provide an Agent Name.", "error");
                        return;
                      }
                      setWizardStep(prev => prev + 1);
                    }}
                    className="text-xs uppercase font-bold"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleCreatePublish}
                    className="text-xs uppercase font-bold bg-brand-green hover:bg-brand-green/90 text-white"
                  >
                    Publish Agent
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* VIEW 3: AGENT DETAILS & SETTINGS */}
          {view === "details" && selectedAgent && (
            <div className="flex flex-col gap-6">
              
              {/* Back controls */}
              <div className="flex justify-between items-center select-none">
                <button
                  onClick={() => setView("dashboard")}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Library</span>
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCloneAgent(selectedAgent.id, selectedAgent.name)}
                    className="text-xs uppercase font-bold"
                  >
                    Clone Agent
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => { setPlaygroundMessages([]); setPlaygroundLogs([]); setView("playground"); }}
                    className="text-xs uppercase font-bold flex items-center gap-1"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Run Sandbox</span>
                  </Button>
                </div>
              </div>

              {/* Agent card banner */}
              <Card className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 select-none bg-zinc-950/20">
                <div className="flex items-center gap-4 text-left">
                  <div className="h-14 w-14 rounded-full bg-zinc-800 text-lg font-bold font-mono text-brand-sky flex items-center justify-center select-none uppercase shrink-0">
                    {selectedAgent.name.charAt(0)}
                  </div>
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-foreground leading-none">{selectedAgent.name}</h3>
                      <span className="text-[9px] font-bold font-mono text-brand-sky bg-brand-sky-light/10 border border-brand-sky/20 px-2 py-0.5 rounded-full select-none uppercase">
                        {selectedAgent.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal mt-1">{selectedAgent.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 md:border-l md:border-border/60 md:pl-6 text-xs select-none">
                  <div className="flex flex-col">
                    <span className="text-lg font-extrabold text-foreground font-mono">{selectedAgent.runs}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-bold">Total Runs</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-extrabold text-emerald-400 font-mono">{selectedAgent.successRate}%</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-bold">Success Rate</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-extrabold text-foreground font-mono">{selectedAgent.latency}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-bold">Avg Latency</span>
                  </div>
                </div>
              </Card>

              {/* Details Sub-Tabs */}
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Left Tabs selection sidebar */}
                <div className="w-full md:w-56 shrink-0 flex flex-col gap-1 select-none">
                  {[
                    { id: "overview", label: "Agent Overview", icon: Info },
                    { id: "settings", label: "Model Settings", icon: Settings },
                    { id: "knowledge", label: "Knowledge Sources", icon: FolderOpen },
                    { id: "logs", label: "Execution History Logs", icon: Activity },
                    { id: "analytics", label: "Performance Analytics", icon: TrendingUp }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setDetailTab(tab.id as any)}
                        className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 cursor-pointer ${
                          detailTab === tab.id
                            ? "bg-secondary text-foreground border border-border"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right content details panels */}
                <div className="flex-grow border border-border bg-card rounded-2xl p-6">
                  
                  {/* TAB 1: Overview */}
                  {detailTab === "overview" && (
                    <div className="flex flex-col gap-5 text-xs leading-normal select-text">
                      <div className="flex flex-col gap-1 select-none">
                        <span className="text-xs font-bold text-foreground">Agent Deployment Specifications</span>
                        <span className="text-[10px] text-muted-foreground">Configuration summaries and metadata parameters.</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4 select-text">
                        <div className="flex flex-col gap-1.5 select-text">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">General Info</span>
                          <span className="font-semibold text-foreground select-text">ID: {selectedAgent.id}</span>
                          <span className="text-muted-foreground">Provider: {selectedAgent.modelProvider.toUpperCase()}</span>
                          <span className="text-muted-foreground font-mono">Model Name: {selectedAgent.modelName}</span>
                          <span className="text-muted-foreground">Target Category: {selectedAgent.category}</span>
                        </div>

                        <div className="flex flex-col gap-1.5 select-text">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Configurations</span>
                          <span className="text-muted-foreground font-mono">Temperature: {selectedAgent.temperature}</span>
                          <span className="text-muted-foreground">Memory Short: {selectedAgent.memoryShort ? "ENABLED" : "DISABLED"}</span>
                          <span className="text-muted-foreground">Memory Long: {selectedAgent.memoryLong ? "ENABLED" : "DISABLED"}</span>
                          <span className="text-brand-sky font-bold">Enabled Actions API: {selectedAgent.tools.join(", ") || "None"}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 pt-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase select-none">System Prompt instructions</span>
                        <div className="p-3 bg-zinc-950/60 border border-border rounded-xl font-mono text-[10px] leading-relaxed text-zinc-300 select-text whitespace-pre-wrap">
                          {selectedAgent.systemPrompt}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Settings form update */}
                  {detailTab === "settings" && (
                    <form onSubmit={handleUpdateSettings} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-foreground">Configure Agent Parameters</span>
                        <span className="text-[10px] text-muted-foreground">Edit temperature deviations and instructions manually.</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/40 pt-4">
                        <Input
                          label="Agent Name"
                          defaultValue={selectedAgent.name}
                          className="bg-white dark:bg-zinc-900"
                        />
                        <div className="flex flex-col gap-1.5 select-none">
                          <label className="text-xs font-semibold text-brand-navy">Intelligence Model</label>
                          <select
                            defaultValue={selectedAgent.modelName}
                            className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none cursor-pointer"
                          >
                            <option value="gpt-4o">gpt-4o (OpenAI)</option>
                            <option value="claude-3-5-sonnet">claude-3-5-sonnet (Anthropic)</option>
                            <option value="gemini-1.5-flash">gemini-1.5-flash (Google)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-brand-navy">System Instructions Prompt</label>
                        <textarea
                          defaultValue={selectedAgent.systemPrompt}
                          className="w-full h-24 p-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs leading-relaxed text-foreground focus:outline-none focus:border-brand-sky resize-none"
                        />
                      </div>

                      <div className="flex justify-end mt-2">
                        <Button type="submit" size="sm" className="h-9 px-6 uppercase font-bold text-xs">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* TAB 3: Knowledge Sources list */}
                  {detailTab === "knowledge" && (
                    <div className="flex flex-col gap-5 select-none">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-foreground">Knowledge Base Context Sources</span>
                        <span className="text-[10px] text-muted-foreground">Manage files vectors search repositories.</span>
                      </div>

                      {/* Vector files lists */}
                      <div className="flex flex-col gap-2 border-t border-border/40 pt-4">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Uploaded Vectors</span>
                        <div className="flex flex-col gap-2">
                          {attachedDocs.map(doc => (
                            <div key={doc.id} className="p-3 bg-zinc-900/30 border border-border rounded-xl flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2.5">
                                <FileText className="h-4.5 w-4.5 text-brand-sky shrink-0" />
                                <div className="flex flex-col">
                                  <span className="font-bold text-foreground">{doc.name}</span>
                                  <span className="text-[9px] text-muted-foreground">{doc.size}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {doc.progress < 100 ? (
                                  <span className="text-[9px] font-mono text-brand-sky font-bold animate-pulse">{doc.progress}%</span>
                                ) : (
                                  <span className="text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/10 px-2 py-0.5 rounded-full font-bold select-none">Indexed</span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDoc(doc.id, doc.name)}
                                  className="p-1 hover:bg-zinc-800 text-muted-foreground hover:text-destructive rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* URL add */}
                      <form onSubmit={handleAddUrlKB} className="flex flex-col gap-2 mt-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Crawled URL URL Sources</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. https://github.com/docs"
                            value={newUrlInput}
                            onChange={(e) => setNewUrlInput(e.target.value)}
                            className="flex-grow h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none"
                          />
                          <Button type="submit" size="sm" className="h-10 text-xs px-4">
                            Index URL
                          </Button>
                        </div>
                      </form>

                      <div className="flex justify-start">
                        <Button type="button" variant="outline" size="xs" onClick={handleUploadKBFile} className="text-[9px] uppercase font-bold flex items-center gap-1">
                          <Plus className="h-3 w-3" />
                          <span>Attach Vector Document</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Execution History logs */}
                  {detailTab === "logs" && (
                    <div className="flex flex-col gap-4 select-text">
                      <div className="flex flex-col gap-1 select-none">
                        <span className="text-xs font-bold text-foreground">Secure Action Audit Logs</span>
                        <span className="text-[10px] text-muted-foreground">Historical records of gateway tool executions.</span>
                      </div>

                      {/* Mock log list */}
                      <div className="border border-border rounded-xl bg-zinc-950/80 p-3 h-64 overflow-y-auto flex flex-col gap-1.5 font-mono text-[9px] leading-relaxed text-zinc-300 border-l border-zinc-800">
                        <div className="text-zinc-600 select-none border-b border-border/30 pb-1 mb-1">--- Log trace started ---</div>
                        <div><span className="text-zinc-500 font-bold">[14:00:02]</span> <span className="text-brand-sky font-bold">[INFO]</span> Agent initiated session context checks for super_admin: arjun@aisensy.com</div>
                        <div><span className="text-zinc-500 font-bold">[14:00:03]</span> <span className="text-zinc-400 font-bold">[DEBUG]</span> Pinned context guidelines injected successfully.</div>
                        <div><span className="text-zinc-500 font-bold">[14:00:04]</span> <span className="text-brand-sky font-bold">[INFO]</span> Dispatched trigger hook call to external destination: WhatsApp Meta APIs.</div>
                        <div><span className="text-zinc-500 font-bold">[14:00:05]</span> <span className="text-emerald-400 font-bold">[SUCCESS]</span> Broadcast template returned message status 200 OK.</div>
                        {selectedAgent.runs > 120 && (
                          <>
                            <div><span className="text-zinc-500 font-bold">[13:15:10]</span> <span className="text-brand-sky font-bold">[INFO]</span> CRM connection synchronized. Hubspot contact id updated.</div>
                            <div><span className="text-zinc-500 font-bold">[12:45:00]</span> <span className="text-amber-400 font-bold">[WARN]</span> Database lookup query latency exceeded 1200ms trigger warnings.</div>
                          </>
                        )}
                        <div className="text-zinc-600 select-none border-t border-border/30 pt-1 mt-1">--- End of visual log tail ---</div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: Performance Analytics */}
                  {detailTab === "analytics" && (
                    <div className="flex flex-col gap-4 select-none">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-foreground">Operational Performance Insights</span>
                        <span className="text-[10px] text-muted-foreground">Historical charts of token costs and response times.</span>
                      </div>

                      {/* Analytics stats metrics boxes */}
                      <div className="grid grid-cols-2 gap-3 border-t border-border/40 pt-4 select-none">
                        <div className="p-3 bg-zinc-900/30 border border-border rounded-xl flex items-center justify-between text-xs">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-foreground">Total Tokens Cost</span>
                            <span className="text-[8px] text-zinc-400">Total metrics</span>
                          </div>
                          <span className="font-extrabold text-brand-sky font-mono">${(selectedAgent.runs * 0.0006).toFixed(4)}</span>
                        </div>

                        <div className="p-3 bg-zinc-900/30 border border-border rounded-xl flex items-center justify-between text-xs">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-foreground">Estimated Queries Speed</span>
                            <span className="text-[8px] text-zinc-400">Avg gateway response</span>
                          </div>
                          <span className="font-extrabold text-brand-sky font-mono">{selectedAgent.latency}</span>
                        </div>
                      </div>

                      {/* Mini bar chart */}
                      <div className="mt-2 flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase text-center">Weekly Run Frequency</span>
                        
                        {/* Rendering simple responsive visual bars inline */}
                        <div className="h-20 flex items-end justify-between px-6 border-b border-border/60 pb-1 pt-4">
                          {[
                            { label: "Mon", val: 12 },
                            { label: "Tue", val: 24 },
                            { label: "Wed", val: 18 },
                            { label: "Thu", val: 32 },
                            { label: "Fri", val: 45 },
                            { label: "Sat", val: 8 },
                            { label: "Sun", val: 15 }
                          ].map((d, i) => {
                            const barHeight = (d.val / 45) * 60;
                            return (
                              <div key={i} className="flex flex-col items-center gap-1.5 flex-grow">
                                <div className="w-4 bg-brand-sky rounded-t" style={{ height: `${barHeight}px` }} />
                                <span className="text-[8px] font-bold font-mono text-muted-foreground">{d.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: AGENT PLAYGROUND */}
          {view === "playground" && selectedAgent && (
            <div className="flex flex-col gap-4">
              
              {/* Header */}
              <div className="flex justify-between items-center select-none border-b border-border/40 pb-3">
                <button
                  onClick={() => setView("dashboard")}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Exit Sandbox</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold font-mono text-brand-sky bg-brand-sky-light/10 border border-brand-sky/20 px-2.5 py-0.5 rounded-full select-none">
                    Sandbox: {selectedAgent.name}
                  </span>
                  <button
                    onClick={() => { setPlaygroundMessages([]); setPlaygroundLogs([]); addToast("Sandbox logs wiped.", "info"); }}
                    className="text-[9px] font-bold text-destructive hover:bg-destructive/10 px-2.5 py-1.5 rounded uppercase cursor-pointer"
                  >
                    Wipe State
                  </button>
                </div>
              </div>

              {/* Two Panel sandbox split */}
              <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)] overflow-hidden">
                
                {/* Left panel: Chat console */}
                <div className="flex-grow border border-border bg-card rounded-2xl p-4 flex flex-col justify-between h-full overflow-hidden select-text">
                  <div className="flex flex-col gap-0.5 border-b border-border/50 pb-2 mb-2 select-none shrink-0 text-left">
                    <span className="text-xs font-bold text-foreground">Playground Sandbox Chat</span>
                    <span className="text-[10px] text-muted-foreground">Test prompts directly. Tools are executed in sandbox logging modes.</span>
                  </div>

                  {/* Messages console log */}
                  <div className="flex-grow overflow-y-auto flex flex-col gap-3 pr-1 py-3 scrollbar-thin select-text">
                    {playgroundMessages.length === 0 ? (
                      <div className="flex-grow flex flex-col items-center justify-center text-center gap-2 select-none italic text-xs text-muted-foreground py-10">
                        <MessageSquare className="h-6 w-6 text-muted-foreground/60" />
                        <span>Prompt sandbox empty. Send a message below to test parameters.</span>
                      </div>
                    ) : (
                      playgroundMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`p-3 text-xs border rounded-xl relative select-text ${
                            msg.role === "user"
                              ? "bg-secondary border-border text-foreground self-end rounded-tr-none max-w-[80%]"
                              : "bg-brand-sky-light/5 border-brand-sky/10 text-foreground self-start rounded-tl-none max-w-[80%]"
                          }`}
                        >
                          <div className="text-[8px] font-bold text-muted-foreground uppercase mb-1 select-none">
                            {msg.role === "user" ? "TEST USER" : selectedAgent.name.toUpperCase()}
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap select-text">{msg.content}</p>
                        </div>
                      ))
                    )}
                    
                    {isSandboxTyping && (
                      <div className="p-3 text-xs border bg-brand-sky-light/5 text-foreground border-brand-sky/10 self-start rounded-tl-none max-w-[80%]">
                        <div className="text-[8px] font-bold text-muted-foreground uppercase mb-1 select-none">
                          {selectedAgent.name.toUpperCase()} TYPING
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <div className="h-1.5 w-1.5 bg-brand-sky rounded-full animate-bounce" />
                          <div className="h-1.5 w-1.5 bg-brand-sky rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="h-1.5 w-1.5 bg-brand-sky rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                    <div ref={playMessagesEndRef} />
                  </div>

                  {/* Input panel box */}
                  <form onSubmit={handleSendPlayground} className="flex gap-2 shrink-0 select-none pt-1">
                    <input
                      type="text"
                      placeholder={`Test "${selectedAgent.name}" prompt logic...`}
                      value={playgroundPrompt}
                      onChange={(e) => setPlaygroundPrompt(e.target.value)}
                      disabled={isSandboxTyping}
                      className="flex-grow h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-brand-sky disabled:opacity-50"
                    />
                    <Button type="submit" disabled={!playgroundPrompt.trim() || isSandboxTyping} className="h-10 w-10 p-0 rounded-lg shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                {/* Right panel: Debug logs console */}
                <div className="w-full lg:w-80 shrink-0 border border-border bg-zinc-950/80 rounded-2xl p-4 flex flex-col justify-between h-full overflow-hidden select-text border-l-2 border-zinc-800">
                  <div className="flex flex-col gap-0.5 border-b border-border/20 pb-2 mb-2 select-none text-left">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-brand-sky shrink-0 animate-pulse" />
                      Execution Debug Logs
                    </span>
                    <span className="text-[9px] text-zinc-400">Tail logs output from tools and gateways.</span>
                  </div>

                  {/* Logs list */}
                  <div className="flex-grow overflow-y-auto flex flex-col gap-2 pr-1 font-mono text-[9px] leading-relaxed text-zinc-300 select-text scrollbar-thin">
                    {playgroundLogs.length === 0 ? (
                      <div className="flex-grow flex items-center justify-center italic text-center text-zinc-500 select-none py-10">
                        No operations logged yet. Send sandbox chats to trace execution.
                      </div>
                    ) : (
                      playgroundLogs.map((log, i) => (
                        <div key={i} className="flex flex-col select-text">
                          <span className="text-zinc-500 font-bold select-none">{log.time}</span>
                          <span className={`${
                            log.type === "error"
                              ? "text-red-400"
                              : log.type === "warn"
                              ? "text-amber-400"
                              : log.type === "debug"
                              ? "text-zinc-400 font-semibold"
                              : "text-brand-sky font-bold"
                          } select-text`}>
                            {log.message}
                          </span>
                        </div>
                      ))
                    )}
                    <div ref={playLogsEndRef} />
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </PageContainer>
    </DashboardShell>
  );
}
