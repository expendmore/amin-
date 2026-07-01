"use client";

import React, { useState, useMemo, useRef } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { useDashboard } from "@/store/use-dashboard";
import { useChatbot } from "@/store/use-chatbot";
import { useContacts } from "@/store/use-contacts";
import { BotNode, BotLink, Chatbot, Intent, CrmEntity, GlobalVariable, SimulatorMessage, NodeType } from "@/types/chatbot";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Plus,
  Search,
  Filter,
  Layers,
  Table as TableIcon,
  Grid as GridIcon,
  List as ListIcon,
  Calendar as CalendarIcon,
  Settings,
  ChevronRight,
  ChevronLeft,
  X,
  Copy,
  Archive,
  Trash2,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  StopCircle,
  TrendingUp,
  BarChart3,
  Award,
  Users,
  Eye,
  FileText,
  FileVideo,
  FileImage,
  FolderOpen,
  Send,
  Zap,
  Globe,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Grid3X3,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Sliders,
  Bookmark,
  MessageSquare,
  Lock,
  ArrowRight
} from "lucide-react";

export default function ChatbotBuilderPage() {
  const { addToast } = useToast();
  
  // Chatbot Store
  const {
    bots,
    intents,
    entities,
    variables,
    activeBotId,
    selectedNodeId,
    simulatorMessages,
    simulatorCurrentNodeId,
    simulatorVariables,
    zoomLevel,
    panOffset,
    snapToGrid,
    setActiveBotId,
    setSelectedNodeId,
    setCanvasViewport,
    toggleSnapToGrid,
    addBot,
    updateBot,
    deleteBot,
    duplicateBot,
    addNode,
    updateNode,
    deleteNode,
    addLink,
    deleteLink,
    addIntent,
    deleteIntent,
    addEntity,
    deleteEntity,
    addVariable,
    deleteVariable,
    restartSimulator,
    sendUserMessage,
    executeSimulatorNode
  } = useChatbot();

  // Navigation tab: dashboard | library | builder | intents | entities | variables
  const [activeTab, setActiveTab] = useState<"dashboard" | "library" | "builder" | "intents" | "entities" | "variables">("dashboard");

  // Local inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [simulatorInput, setSimulatorInput] = useState("");

  // Modal controls
  const [showCreateBotModal, setShowCreateBotModal] = useState(false);
  const [showAddIntentModal, setShowAddIntentModal] = useState(false);
  const [showAddVariableModal, setShowAddVariableModal] = useState(false);

  // Forms
  const [newBotForm, setNewBotForm] = useState({
    name: "",
    description: "",
    category: "customer_support" as any,
    tags: ""
  });

  const [newIntentForm, setNewIntentForm] = useState({
    name: "",
    phrases: "",
    confidence: 0.85
  });

  const [newVarForm, setNewVarForm] = useState({
    name: "",
    scope: "global" as any,
    value: "",
    description: ""
  });

  // Simulator Preview State (mobile | desktop | whatsapp)
  const [simulatorPreviewMode, setSimulatorPreviewMode] = useState<"whatsapp" | "mobile" | "desktop">("whatsapp");

  // Selected bot
  const activeBot = useMemo(() => {
    return bots.find((b) => b.id === activeBotId) || null;
  }, [bots, activeBotId]);

  // Selected node config
  const activeNode = useMemo(() => {
    if (!activeBot) return null;
    return activeBot.nodes.find((n) => n.id === selectedNodeId) || null;
  }, [activeBot, selectedNodeId]);

  // Stats calculation
  const dashboardStats = useMemo(() => {
    const total = bots.length;
    const published = bots.filter((b) => b.status === "published").length;
    const draft = bots.filter((b) => b.status === "draft").length;
    
    let totalSessions = 0;
    let totalCompletion = 0;
    let totalFallback = 0;
    
    bots.forEach((b) => {
      totalSessions += b.stats.sessionsCount;
      totalCompletion += b.stats.completionRate;
      totalFallback += b.stats.fallbackRate;
    });

    const completionRate = total > 0 ? Math.round(totalCompletion / total) : 0;
    const fallbackRate = total > 0 ? Math.round(totalFallback / total) : 0;

    return { total, published, draft, totalSessions, completionRate, fallbackRate };
  }, [bots]);

  // Dragging connection link mapping states
  const [dragSourceNodeId, setDragSourceNodeId] = useState<string | null>(null);
  const [dragSourcePortId, setDragSourcePortId] = useState<string | null>(null);

  // Create bot
  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotForm.name) return;

    addBot({
      name: newBotForm.name,
      description: newBotForm.description,
      category: newBotForm.category,
      tags: newBotForm.tags.split(",").map((s) => s.trim()).filter(Boolean),
      status: "draft"
    });

    addToast(`Chatbot "${newBotForm.name}" created.`, "success");
    setShowCreateBotModal(false);
    setActiveTab("builder");
    setNewBotForm({
      name: "",
      description: "",
      category: "customer_support",
      tags: ""
    });
  };

  // Add intent
  const handleAddIntent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIntentForm.name) return;

    addIntent({
      name: newIntentForm.name,
      trainingPhrases: newIntentForm.phrases.split(",").map((s) => s.trim()).filter(Boolean),
      confidenceScore: newIntentForm.confidence,
      priority: "normal"
    });

    addToast(`Intent "${newIntentForm.name}" created.`, "success");
    setShowAddIntentModal(false);
    setNewIntentForm({
      name: "",
      phrases: "",
      confidence: 0.85
    });
  };

  // Add variable
  const handleAddVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarForm.name) return;

    addVariable({
      name: newVarForm.name,
      scope: newVarForm.scope,
      value: newVarForm.value,
      description: newVarForm.description
    });

    addToast(`Variable "${newVarForm.name}" registered.`, "success");
    setShowAddVariableModal(false);
    setNewVarForm({
      name: "",
      scope: "global",
      value: "",
      description: ""
    });
  };

  // Auto layout simulator
  const executeAutoLayout = () => {
    if (!activeBot) return;
    addToast("Auto layout completed. Rearranging nodes.", "info");
    activeBot.nodes.forEach((n, idx) => {
      updateNode(n.id, {
        position: { x: 100 + idx * 250, y: 150 + (idx % 2 === 0 ? 50 : -50) }
      });
    });
  };

  // Canvas zoom
  const adjustZoom = (type: "in" | "out" | "reset") => {
    if (type === "in") setCanvasViewport(Math.min(zoomLevel + 10, 150), panOffset);
    else if (type === "out") setCanvasViewport(Math.max(zoomLevel - 10, 50), panOffset);
    else setCanvasViewport(100, { x: 0, y: 0 });
  };

  // Add Node from sidebar library helper
  const addNodeToCanvas = (type: NodeType) => {
    if (!activeBot) return;
    
    // Add offset based on canvas center
    const x = Math.max(150, 200 + activeBot.nodes.length * 50);
    const y = Math.max(100, 150 + (activeBot.nodes.length % 3) * 60);

    const defaultConfig: any = {
      text: type === "message" ? "Type messaging copy..." : type === "question" ? "Ask a question..." : "",
      buttons: type === "message" ? [] : undefined,
      variableName: type === "question" ? "userResponse" : undefined,
      apiUrl: type === "apiCall" ? "https://api.domain.com/v1" : undefined
    };

    addNode({
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
      position: { x, y },
      config: defaultConfig
    });

    addToast(`Node Added: New ${type}`, "success");
  };

  // Connect links handler click sockets
  const handleSocketClick = (nodeId: string, type: "input" | "output", portId?: string) => {
    if (type === "output") {
      setDragSourceNodeId(nodeId);
      setDragSourcePortId(portId || null);
      addToast("Select target input socket to link.", "info");
    } else {
      // Input clicked. Connect if drag source is active
      if (dragSourceNodeId) {
        if (dragSourceNodeId === nodeId) {
          setDragSourceNodeId(null);
          setDragSourcePortId(null);
          return;
        }

        addLink({
          sourceNodeId: dragSourceNodeId,
          targetNodeId: nodeId,
          sourcePortId: dragSourcePortId || undefined
        });

        addToast("Workflow connection link created.", "success");
        setDragSourceNodeId(null);
        setDragSourcePortId(null);
      }
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 max-w-full font-sans select-none pb-12 px-6 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin text-left">
        
        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border dark:border-border/40 pb-5 shrink-0">
          <div className="flex flex-col gap-1.5 text-left">
            <h1 className="text-xl font-extrabold text-brand-navy dark:text-foreground tracking-tight">
              Visual Chatbot & AI Flow Builder
            </h1>
            <p className="text-xs text-on-surface-variant font-medium">
              Design complex multi-branch WhatsApp workflows, capture CRM variables and test simulation engines.
            </p>
          </div>

          <div className="flex items-center gap-2 select-none">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddIntentModal(true)}
              className="text-xs font-bold font-sans"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Intent
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateBotModal(true)}
              className="text-xs font-bold font-sans"
              leftIcon={<Bot className="h-4 w-4" />}
            >
              New Chatbot
            </Button>
          </div>
        </div>

        {/* METRICS BENTO CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 select-none">
          {[
            { label: "Total Chatbots", value: dashboardStats.total, sub: `${dashboardStats.published} active in production`, icon: Bot, color: "text-brand-sky" },
            { label: "Active Sessions", value: dashboardStats.totalSessions, sub: "Total inbound tests", icon: Users, color: "text-brand-green" },
            { label: "Completion Rate", value: dashboardStats.completionRate + "%", sub: "Goal completion metric", icon: CheckCircle2, color: "text-[#10B981]" },
            { label: "Fallback Rate", value: dashboardStats.fallbackRate + "%", sub: "NLP failover frequency", icon: AlertTriangle, color: "text-red-500" },
            { label: "Intents Indexed", value: intents.length, sub: "NLP matching vocabulary", icon: Zap, color: "text-amber-500" },
            { label: "CSAT Score", value: "4.8 / 5.0", sub: "Customer satisfaction score", icon: Award, color: "text-[#8B5CF6]" }
          ].map((item, idx) => (
            <Card key={idx} className="p-4 flex flex-col justify-between h-[105px]">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{item.label}</span>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="flex flex-col mt-2">
                <span className="text-xl font-black text-foreground">{item.value}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5 font-medium">{item.sub}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="flex border-b border-brand-border dark:border-border/40 select-none pb-0.5">
          {[
            { id: "dashboard", label: "KPIs Dashboard", icon: BarChart3 },
            { id: "library", label: "Bots Catalog", icon: FolderOpen },
            { id: "builder", label: "Visual Canvas Builder", icon: Layers },
            { id: "intents", label: "Intent Trainer", icon: Zap },
            { id: "entities", label: "Entity Matcher", icon: Sliders },
            { id: "variables", label: "Variables Sheet", icon: Sliders }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === t.id
                  ? "border-brand-sky text-brand-sky font-extrabold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* TAB WORKSPACE */}
        <div className="flex-grow">
          
          {/* TAB: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
              
              {/* Bot performance CSAT and Fallback rates */}
              <Card className="p-5 flex flex-col justify-between h-[360px]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Completion vs Fallback Performance</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Monthly rates analysis</span>
                  </div>
                  <TrendingUp className="h-4.5 w-4.5 text-brand-sky" />
                </div>

                <div className="flex items-end justify-between flex-grow h-[200px] border-b border-border/60 pb-2 px-4">
                  {[
                    { bot: "Shopify Auto", comp: 88, fall: 4 },
                    { bot: "FAQ Assist", comp: 72, fall: 12 },
                    { bot: "Promo Gen", comp: 65, fall: 18 }
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-1/4">
                      <div className="flex gap-1.5 items-end justify-center w-full h-[160px]">
                        {/* Completion bar */}
                        <div className="w-4 bg-brand-green rounded-t relative group" style={{ height: `${bar.comp}%` }}>
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-[8px] font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {bar.comp}%
                          </span>
                        </div>
                        {/* Fallback bar */}
                        <div className="w-4 bg-red-500 rounded-t relative group" style={{ height: `${bar.fall}%` }}>
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-[8px] font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {bar.fall}%
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-zinc-400 mt-1">{bar.bot}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 text-[9px] font-bold uppercase text-zinc-400 mt-2">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand-green rounded" /> Completion</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded" /> Fallback Failures</span>
                </div>
              </Card>

              {/* Bot stats audit log list */}
              <Card className="p-5 flex flex-col h-[360px] justify-between">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Interactive Bot Directory</span>
                    <span className="text-[10px] text-muted-foreground font-medium">CSAT score statistics</span>
                  </div>
                  <Award className="h-4.5 w-4.5 text-amber-500 animate-bounce" />
                </div>

                <div className="flex flex-col gap-2.5 overflow-y-auto scrollbar-thin flex-grow">
                  {bots.map((b) => (
                    <div key={b.id} className="p-3 border border-border rounded-xl bg-zinc-950/15 flex items-center justify-between text-[10px]">
                      <div className="flex flex-col gap-0.5 text-left truncate max-w-[200px]">
                        <span className="font-extrabold text-foreground truncate">{b.name}</span>
                        <span className="text-zinc-500 font-mono">Sessions: {b.stats.sessionsCount}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="font-extrabold text-brand-sky font-mono">{b.stats.csatScore} / 5.0</span>
                          <span className="text-[8px] text-zinc-500 uppercase font-bold">CSAT</span>
                        </div>
                        <Button variant="outline" size="xs" onClick={() => {
                          setActiveBotId(b.id);
                          setActiveTab("builder");
                          addToast(`Loaded ${b.name} editor workspace.`, "info");
                        }}>
                          Edit Flow
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          )}

          {/* TAB: BOTS CATALOG */}
          {activeTab === "library" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              {bots.map((b) => (
                <Card key={b.id} className="p-5 flex flex-col justify-between h-[180px] border border-border">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-foreground text-xs">{b.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        b.status === "published" ? "bg-brand-green/10 text-brand-green" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed truncate">{b.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2 select-none">
                      {b.tags.map((t, idx) => (
                        <span key={idx} className="bg-zinc-900/50 border border-border px-2 py-0.5 rounded text-[8px] font-bold text-zinc-300">{t}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end border-t border-border/40 pt-2 text-[9px] font-bold select-none">
                    <button
                      onClick={() => {
                        duplicateBot(b.id);
                        addToast("Bot flow duplicated.", "success");
                      }}
                      className="p-1.5 hover:bg-zinc-800 rounded text-muted-foreground hover:text-white"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${b.name}?`)) {
                          deleteBot(b.id);
                          addToast("Bot deleted.", "success");
                        }
                      }}
                      className="p-1.5 hover:bg-red-950/20 rounded text-muted-foreground hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Button variant="primary" size="xs" onClick={() => {
                      setActiveBotId(b.id);
                      setActiveTab("builder");
                    }}>
                      Edit Flow
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* TAB: VISUAL CANVAS BUILDER */}
          {activeTab === "builder" && activeBot && (
            <div className="grid grid-cols-12 gap-0 border border-brand-border dark:border-border/60 bg-card rounded-2xl overflow-hidden h-[540px] relative">
              
              {/* CANVAS CONTROLS LEFT BAR PANEL */}
              <aside className="col-span-12 md:col-span-2 border-r border-border h-full bg-zinc-950/15 flex flex-col justify-between overflow-y-auto scrollbar-thin select-none">
                <div className="p-3.5 flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Bot Node Library</span>
                    <span className="text-[8px] text-zinc-500">Drag/Click to append node block</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {[
                      { type: "message", label: "Message / Media", color: "border-brand-sky text-brand-sky bg-brand-sky/5" },
                      { type: "question", label: "Question / Input", color: "border-amber-500 text-amber-500 bg-amber-500/5" },
                      { type: "condition", label: "Condition Check", color: "border-[#EC4899] text-[#EC4899] bg-[#EC4899]/5" },
                      { type: "aiPrompt", label: "AI Prompt LLM", color: "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/5" },
                      { type: "apiCall", label: "API Call / Webhook", color: "border-[#10B981] text-[#10B981] bg-[#10B981]/5" },
                      { type: "humanHandoff", label: "Human Handoff", color: "border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/5" },
                      { type: "end", label: "End Workspace", color: "border-zinc-500 text-zinc-500 bg-zinc-500/5" }
                    ].map((item) => (
                      <button
                        key={item.type}
                        onClick={() => addNodeToCanvas(item.type as NodeType)}
                        className={`w-full p-2.5 border rounded-xl text-[10px] font-bold text-left hover:shadow-sm cursor-pointer transition-all ${item.color}`}
                      >
                        + {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 border-t border-border bg-zinc-950/5 flex flex-col gap-2">
                  <Button variant="outline" size="xs" onClick={executeAutoLayout} className="w-full text-[9px] uppercase font-bold">
                    Auto Layout Node Graph
                  </Button>
                </div>
              </aside>

              {/* CANVAS GRAPH CONTAINER CENTER */}
              <section className="col-span-12 md:col-span-7 h-full relative overflow-hidden bg-zinc-900/10 dark:bg-zinc-950/20" style={{ backgroundImage: "radial-gradient(#80808020 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
                
                {/* Canvas viewport zoom overlay toolbar */}
                <div className="absolute top-3 left-3 z-30 bg-card border border-border p-1.5 rounded-xl shadow-md flex items-center gap-1.5 select-none text-[9px] font-bold">
                  <span className="text-zinc-500 px-1 font-mono uppercase">Zoom: {zoomLevel}%</span>
                  <button onClick={() => adjustZoom("in")} className="p-1 hover:bg-zinc-800 rounded cursor-pointer" title="Zoom In"><ZoomIn className="h-3.5 w-3.5" /></button>
                  <button onClick={() => adjustZoom("out")} className="p-1 hover:bg-zinc-800 rounded cursor-pointer" title="Zoom Out"><ZoomOut className="h-3.5 w-3.5" /></button>
                  <button onClick={() => adjustZoom("reset")} className="p-1 hover:bg-zinc-800 rounded cursor-pointer" title="Reset Viewport"><RefreshCw className="h-3.5 w-3.5" /></button>
                  <div className="border-l border-border h-4 mx-1" />
                  <button onClick={toggleSnapToGrid} className={`p-1 hover:bg-zinc-800 rounded cursor-pointer ${snapToGrid ? "text-brand-sky" : "text-zinc-500"}`} title="Toggle Snap Grid">
                    <Grid3X3 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* SVG connection lines rendering layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 select-none">
                  {activeBot.links.map((link) => {
                    const source = activeBot.nodes.find((n) => n.id === link.sourceNodeId);
                    const target = activeBot.nodes.find((n) => n.id === link.targetNodeId);
                    if (!source || !target) return null;

                    // Compute sockets coordinate offsets (nodes have w=150, h=80)
                    const x1 = source.position.x + 150;
                    const y1 = source.position.y + 40;
                    const x2 = target.position.x;
                    const y2 = target.position.y + 40;

                    // Draw cubic bezier curve for React Flow look
                    const dx = Math.abs(x2 - x1) * 0.5;
                    const dpath = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                    return (
                      <g key={link.id}>
                        <path
                          d={dpath}
                          fill="none"
                          stroke="var(--brand-sky)"
                          strokeWidth="2.5"
                          className="animate-pulse"
                        />
                        <circle cx={x2} cy={y2} r="4" fill="var(--brand-sky)" />
                        <foreignObject x={(x1 + x2) / 2 - 8} y={(y1 + y2) / 2 - 8} width="16" height="16" className="pointer-events-auto select-none">
                          <button
                            onClick={() => {
                              deleteLink(link.id);
                              addToast("Link connection removed.", "info");
                            }}
                            className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-[8px] font-bold shrink-0 shadow cursor-pointer border border-white"
                          >
                            ×
                          </button>
                        </foreignObject>
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes rendering layer */}
                <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ transform: `scale(${zoomLevel / 100})` }}>
                  {activeBot.nodes.map((node) => {
                    const isSelected = node.id === selectedNodeId;
                    const isCurrent = node.id === simulatorCurrentNodeId;
                    
                    return (
                      <div
                        key={node.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(node.id);
                        }}
                        className={`absolute w-[160px] p-2 bg-card border rounded-2xl shadow hover:shadow-md cursor-pointer transition-all select-none z-20 ${
                          isCurrent
                            ? "border-brand-green ring-2 ring-brand-green/30"
                            : isSelected
                            ? "border-brand-sky ring-2 ring-brand-sky/30"
                            : "border-border"
                        }`}
                        style={{ left: node.position.x, top: node.position.y }}
                      >
                        {/* Node header bar */}
                        <div className="flex justify-between items-center select-none border-b border-border/40 pb-1.5 mb-1.5">
                          <span className="font-extrabold text-foreground text-[9px] uppercase tracking-wider truncate max-w-[100px]">{node.name}</span>
                          <span className="text-[7px] text-zinc-500 font-mono">({node.type})</span>
                        </div>

                        {/* Input sockets (left) */}
                        {node.type !== "start" && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSocketClick(node.id, "input");
                            }}
                            className="absolute -left-2 top-[40px] w-4 h-4 rounded-full bg-zinc-800 border border-brand-border flex items-center justify-center hover:bg-brand-sky cursor-pointer group shadow-sm z-30"
                            title="Input socket"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-white" />
                          </div>
                        )}

                        {/* Node Text preview */}
                        <div className="text-[9px] text-muted-foreground truncate leading-normal text-left">
                          {node.type === "message" || node.type === "question" || node.type === "end"
                            ? node.config.text || "—"
                            : node.type === "apiCall"
                            ? node.config.apiUrl || "—"
                            : node.type === "humanHandoff"
                            ? node.config.agentQueue || "—"
                            : "NLP active keywords trigger"}
                        </div>

                        {/* Output sockets (right) */}
                        {node.type !== "end" && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSocketClick(node.id, "output");
                            }}
                            className="absolute -right-2 top-[40px] w-4 h-4 rounded-full bg-zinc-800 border border-brand-border flex items-center justify-center hover:bg-brand-sky cursor-pointer group shadow-sm z-30"
                            title="Output socket"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-white" />
                          </div>
                        )}

                        {/* Conditional sockets branch ports */}
                        {node.type === "message" && node.config.buttons && node.config.buttons.length > 0 && (
                          <div className="flex flex-col gap-1.5 mt-2 border-t border-border/20 pt-1.5 select-none">
                            {node.config.buttons.map((btn, bi) => (
                              <div
                                key={bi}
                                className="flex justify-between items-center text-[8px] font-bold text-zinc-400 hover:text-white relative bg-zinc-950/20 px-1.5 py-0.5 rounded border border-border/40"
                              >
                                <span className="truncate max-w-[80px]">{btn}</span>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSocketClick(node.id, "output", btn);
                                  }}
                                  className="w-3 h-3 rounded-full bg-zinc-800 border border-border flex items-center justify-center hover:bg-brand-sky cursor-pointer shrink-0 ml-1"
                                  title={`Branch link socket: ${btn}`}
                                >
                                  <ArrowRight className="h-2 w-2 text-zinc-500" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </section>

              {/* NODE DETAILS INSPECTOR RIGHT DRAW PANEL */}
              <aside className="col-span-12 md:col-span-3 border-l border-border h-full bg-zinc-950/15 flex flex-col justify-between overflow-y-auto scrollbar-thin select-text">
                {activeNode ? (
                  <div className="p-4 flex flex-col gap-4 text-left select-text">
                    
                    <div className="flex justify-between items-center border-b border-border/40 pb-2 select-none">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Node Configuration</span>
                      <button
                        onClick={() => {
                          if (confirm(`Delete node block ${activeNode.name}?`)) {
                            deleteNode(activeNode.id);
                            addToast("Node deleted.", "success");
                          }
                        }}
                        className="p-1 text-muted-foreground hover:text-red-500 rounded transition-colors"
                        title="Delete node block"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5 select-text">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Block Name</label>
                      <input
                        type="text"
                        value={activeNode.name}
                        onChange={(e) => updateNode(activeNode.id, { name: e.target.value })}
                        className="h-8 px-2 bg-zinc-900 border border-brand-border rounded text-xs focus:outline-none text-foreground font-bold"
                      />
                    </div>

                    <hr className="border-border/40 select-none" />

                    {/* Node Config Specific forms */}
                    {(activeNode.type === "message" || activeNode.type === "question" || activeNode.type === "end") && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5 select-text">
                          <label className="text-[9px] uppercase font-bold text-zinc-500">Message Copy Body</label>
                          <textarea
                            value={activeNode.config.text || ""}
                            onChange={(e) => updateNode(activeNode.id, { config: { text: e.target.value } })}
                            className="w-full h-24 p-2 bg-zinc-900 border border-brand-border rounded-xl text-xs focus:outline-none text-foreground leading-relaxed"
                            placeholder="Type prompt text to deliver..."
                          />
                        </div>

                        {activeNode.type === "message" && (
                          <div className="flex flex-col gap-1.5 select-none">
                            <label className="text-[9px] uppercase font-bold text-zinc-500">Quick Reply Buttons (comma separated)</label>
                            <input
                              type="text"
                              value={activeNode.config.buttons?.join(", ") || ""}
                              onChange={(e) => updateNode(activeNode.id, {
                                config: {
                                  buttons: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                                }
                              })}
                              placeholder="e.g. Option A, Option B"
                              className="h-8 px-2 bg-zinc-900 border border-brand-border rounded text-xs focus:outline-none text-foreground font-bold"
                            />
                          </div>
                        )}

                        {activeNode.type === "question" && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase font-bold text-zinc-500">Capture Output Variable</label>
                            <select
                              value={activeNode.config.variableName || ""}
                              onChange={(e) => updateNode(activeNode.id, { config: { variableName: e.target.value } })}
                              className="h-8 px-2 bg-zinc-900 border border-brand-border rounded text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                            >
                              <option value="">Choose variable</option>
                              {variables.map((v) => (
                                <option key={v.id} value={v.name}>{v.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    )}

                    {activeNode.type === "apiCall" && (
                      <div className="flex flex-col gap-3.5">
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="flex flex-col gap-1 col-span-1">
                            <label className="text-[8px] uppercase font-bold text-zinc-500">Method</label>
                            <select
                              value={activeNode.config.apiMethod || "GET"}
                              onChange={(e) => updateNode(activeNode.id, { config: { apiMethod: e.target.value as any } })}
                              className="h-8 px-1.5 bg-zinc-900 border border-brand-border rounded text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                            >
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                            </select>
                          </div>
                          
                          <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-[8px] uppercase font-bold text-zinc-500">Endpoint URL</label>
                            <input
                              type="text"
                              value={activeNode.config.apiUrl || ""}
                              onChange={(e) => updateNode(activeNode.id, { config: { apiUrl: e.target.value } })}
                              placeholder="https://api..."
                              className="h-8 px-2 bg-zinc-900 border border-brand-border rounded text-xs focus:outline-none text-foreground font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeNode.type === "humanHandoff" && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-bold text-zinc-500">Target Queue</label>
                          <input
                            type="text"
                            value={activeNode.config.agentQueue || ""}
                            onChange={(e) => updateNode(activeNode.id, { config: { agentQueue: e.target.value } })}
                            placeholder="e.g. Billing Support Tier 1"
                            className="h-8 px-2 bg-zinc-900 border border-brand-border rounded text-xs focus:outline-none text-foreground font-bold"
                          />
                        </div>
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-bold text-zinc-500">Escalation text message</label>
                          <textarea
                            value={activeNode.config.text || ""}
                            onChange={(e) => updateNode(activeNode.id, { config: { text: e.target.value } })}
                            className="w-full h-16 p-2 bg-zinc-900 border border-brand-border rounded-xl text-xs focus:outline-none text-foreground"
                            placeholder="Deliver transfer alert copy..."
                          />
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="flex-grow flex items-center justify-center p-6 italic text-[10px] text-muted-foreground select-none text-center">
                    Select a canvas node block to audit configuration options.
                  </div>
                )}
                
                {/* Active Bot detail summary */}
                <div className="p-3 border-t border-border bg-zinc-950/20 text-[10px] text-left select-none shrink-0 flex flex-col gap-1.5">
                  <span className="font-extrabold text-foreground leading-none">{activeBot.name}</span>
                  <span className="text-[9px] text-muted-foreground truncate leading-snug">{activeBot.description}</span>
                  <div className="flex justify-between items-center mt-2 border-t border-border/20 pt-2 text-[9px] font-bold">
                    <span className="text-zinc-500">Auto-saved</span>
                    <span className="text-brand-green">● Published Console</span>
                  </div>
                </div>
              </aside>

            </div>
          )}

          {/* TAB: INTENT TRAINER */}
          {activeTab === "intents" && (
            <div className="flex flex-col gap-4 text-left">
              <div className="flex justify-between items-center border-b border-border/40 pb-3 select-none">
                <span className="text-xs font-bold text-foreground">NLP Custom Intents Vocabulary</span>
                <Button variant="outline" size="sm" onClick={() => setShowAddIntentModal(true)} className="text-[10px] font-bold font-sans">
                  Create Intent
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {intents.map((int) => (
                  <Card key={int.id} className="p-5 flex flex-col justify-between h-[180px] border border-border">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center select-none border-b border-border/40 pb-2">
                        <span className="font-extrabold text-foreground text-xs">#{int.name}</span>
                        <button
                          onClick={() => {
                            deleteIntent(int.id);
                            addToast("Intent removed.", "info");
                          }}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-1 select-none">
                        {int.trainingPhrases.slice(0, 3).map((ph, idx) => (
                          <span key={idx} className="bg-zinc-900/50 border border-border px-2 py-0.5 rounded text-[8px] font-bold text-zinc-300 font-mono">
                            "{ph}"
                          </span>
                        ))}
                        {int.trainingPhrases.length > 3 && (
                          <span className="text-[8px] text-zinc-500 font-bold self-center">+{int.trainingPhrases.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] border-t border-border/40 pt-3 select-none">
                      <span className="text-zinc-500 font-bold font-mono">Conf: {int.confidenceScore * 100}%</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                        int.priority === "high" ? "bg-red-500/10 text-red-500" : "bg-zinc-800 text-zinc-400"
                      }`}>{int.priority} Priority</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ENTITY MATCHER */}
          {activeTab === "entities" && (
            <div className="flex flex-col gap-4 text-left">
              <span className="text-xs font-bold text-foreground">Custom Entities extraction slot-matching</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {entities.map((ent) => (
                  <Card key={ent.id} className="p-5 flex flex-col justify-between h-[160px] border border-border">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center select-none border-b border-border/40 pb-2">
                        <span className="font-extrabold text-foreground text-xs">@{ent.name}</span>
                        <button
                          onClick={() => {
                            deleteEntity(ent.id);
                            addToast("Entity removed.", "info");
                          }}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      {ent.regexPattern && (
                        <div className="flex flex-col gap-0.5 mt-1 font-mono text-[9px] text-left">
                          <span className="text-zinc-500 uppercase font-bold">Regex Pattern:</span>
                          <span className="text-brand-sky font-bold">{ent.regexPattern}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-0.5 font-mono text-[9px] text-left mt-2 select-none">
                        <span className="text-zinc-500 uppercase font-bold">Synonyms list:</span>
                        <span className="text-zinc-300 font-bold truncate">{ent.synonymsList}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB: VARIABLES SHEET */}
          {activeTab === "variables" && (
            <div className="flex flex-col gap-4 text-left select-text">
              <div className="flex justify-between items-center border-b border-border/40 pb-3 select-none">
                <span className="text-xs font-bold text-foreground">Global & Session Workspace variables</span>
                <Button variant="outline" size="sm" onClick={() => setShowAddVariableModal(true)} className="text-[10px] font-bold font-sans">
                  Create Variable
                </Button>
              </div>

              <div className="border border-border/60 bg-zinc-950/20 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse select-text">
                  <thead className="bg-zinc-950/40 text-zinc-400 uppercase font-extrabold border-b border-border select-none">
                    <tr>
                      <th className="p-3">Variable Key</th>
                      <th className="p-3">Scope</th>
                      <th className="p-3">Default Value</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variables.map((v) => (
                      <tr key={v.id} className="border-b border-border/40 hover:bg-zinc-900/10">
                        <td className="p-3 font-extrabold text-foreground font-mono">{v.name}</td>
                        <td className="p-3 font-bold select-none uppercase"><span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[8px] font-bold">{v.scope}</span></td>
                        <td className="p-3 font-mono text-zinc-300">{v.value}</td>
                        <td className="p-3 text-zinc-500 leading-normal max-w-[200px] truncate">{v.description || "—"}</td>
                        <td className="p-3 text-right select-none">
                          <button
                            onClick={() => {
                              deleteVariable(v.id);
                              addToast("Variable unregistered.", "info");
                            }}
                            className="p-1 hover:bg-red-950/20 rounded text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* MOCK PREVIEW WHATSAPP SIMULATOR MOBILE FRAME (FLOATING ON BUILDER VIEW) */}
        {activeTab === "builder" && activeBot && (
          <div className="fixed bottom-6 right-6 z-40 bg-zinc-950/95 border border-zinc-800 rounded-3xl shadow-2xl w-[280px] h-[480px] overflow-hidden flex flex-col justify-between select-none text-left backdrop-blur-md font-sans">
            
            {/* Phone header */}
            <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-[10px] font-bold text-brand-green uppercase select-none">
                  {activeBot.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-white text-[10px] truncate max-w-[120px]">{activeBot.name}</span>
                  <span className="text-[7px] text-brand-green font-bold uppercase tracking-wider">WhatsApp Sandbox preview</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={restartSimulator}
                  className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Restart Simulation"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Chat viewport */}
            <div className="flex-grow overflow-y-auto p-3 bg-zinc-900/10 pr-1 flex flex-col gap-2.5 scrollbar-thin select-text">
              {simulatorMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-6 italic text-[9px] text-zinc-500 gap-1.5 h-full select-none">
                  <Play className="h-6 w-6 text-brand-green animate-pulse" />
                  <span>Click refresh button above to start mobile simulator sandbox conversation.</span>
                </div>
              ) : (
                simulatorMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === "user"
                        ? "self-end items-end text-right"
                        : msg.sender === "bot"
                        ? "self-start items-start text-left"
                        : "self-center items-center text-center w-full max-w-full"
                    }`}
                  >
                    
                    {msg.sender === "system" ? (
                      <span className="text-[8px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 border border-zinc-850 rounded-lg select-none">
                        {msg.text}
                      </span>
                    ) : (
                      <>
                        <div className={`p-2.5 rounded-xl text-[10px] leading-relaxed select-text shadow-sm ${
                          msg.sender === "user"
                            ? "bg-[#25D366] text-white rounded-tr-none"
                            : "bg-card border border-zinc-850 text-white rounded-tl-none"
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <span className="text-[7px] font-mono text-zinc-600 mt-0.5 select-none">{msg.timestamp}</span>
                      </>
                    )}

                    {/* Quick reply buttons choices options */}
                    {msg.options && msg.options.length > 0 && (
                      <div className="flex flex-col gap-1 w-full mt-1.5 select-none">
                        {msg.options.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => sendUserMessage(opt)}
                            className="w-full text-center py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-extrabold text-brand-sky hover:bg-zinc-850 cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>

            {/* Input keyboard composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!simulatorInput.trim()) return;
                sendUserMessage(simulatorInput.trim());
                setSimulatorInput("");
              }}
              className="p-2 border-t border-zinc-800 bg-zinc-900/50 flex gap-1.5 items-center shrink-0 select-none"
            >
              <input
                type="text"
                placeholder={simulatorCurrentNodeId ? "Type reply..." : "Simulator offline"}
                disabled={!simulatorCurrentNodeId}
                value={simulatorInput}
                onChange={(e) => setSimulatorInput(e.target.value)}
                className="flex-grow h-8 px-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] focus:outline-none text-white disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!simulatorInput.trim()}
                className="h-8 w-8 bg-brand-sky text-white rounded-lg flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

          </div>
        )}

        {/* MODAL: CREATE BOT */}
        <AnimatePresence>
          {showCreateBotModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="p-5 border-b border-border flex justify-between items-center bg-zinc-950/10">
                  <span className="font-extrabold text-foreground text-sm">Create New Visual Chatbot</span>
                  <button onClick={() => setShowCreateBotModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateBot} className="p-5 flex flex-col gap-4 text-left">
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Chatbot Name *</label>
                    <input
                      type="text"
                      required
                      value={newBotForm.name}
                      onChange={(e) => setNewBotForm({ ...newBotForm, name: e.target.value })}
                      placeholder="e.g. FAQ Lead Capture Assistant"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Description</label>
                    <input
                      type="text"
                      value={newBotForm.description}
                      onChange={(e) => setNewBotForm({ ...newBotForm, description: e.target.value })}
                      placeholder="Brief details about chatbot workflow..."
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Category</label>
                    <select
                      value={newBotForm.category}
                      onChange={(e) => setNewBotForm({ ...newBotForm, category: e.target.value as any })}
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                    >
                      <option value="customer_support">Customer Support</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales Leads</option>
                      <option value="utility">Utility Alert</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={newBotForm.tags}
                      onChange={(e) => setNewBotForm({ ...newBotForm, tags: e.target.value })}
                      placeholder="e.g. support, shopify, automatic"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-border mt-3 select-none">
                    <Button variant="outline" size="sm" type="button" onClick={() => setShowCreateBotModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Create Bot
                    </Button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD NLP INTENT */}
        <AnimatePresence>
          {showAddIntentModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="p-5 border-b border-border flex justify-between items-center bg-zinc-950/10">
                  <span className="font-extrabold text-foreground text-sm">Add NLP Training Phrase Intent</span>
                  <button onClick={() => setShowAddIntentModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleAddIntent} className="p-5 flex flex-col gap-4 text-left">
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Intent Name *</label>
                    <input
                      type="text"
                      required
                      value={newIntentForm.name}
                      onChange={(e) => setNewIntentForm({ ...newIntentForm, name: e.target.value })}
                      placeholder="e.g. Cancel Subscription"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Training Phrases (comma separated)</label>
                    <textarea
                      value={newIntentForm.phrases}
                      onChange={(e) => setNewIntentForm({ ...newIntentForm, phrases: e.target.value })}
                      placeholder="e.g. cancel my service, stop my billing plan, refund account"
                      className="w-full h-16 p-2 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-2 select-none">
                    <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                      <span>Matching Confidence Threshold</span>
                      <span className="font-mono text-brand-sky">{Math.round(newIntentForm.confidence * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="0.99"
                      step="0.05"
                      value={newIntentForm.confidence}
                      onChange={(e) => setNewIntentForm({ ...newIntentForm, confidence: Number(e.target.value) })}
                      className="w-full cursor-pointer bg-zinc-800 rounded-lg accent-brand-sky"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-border mt-3 select-none">
                    <Button variant="outline" size="sm" type="button" onClick={() => setShowAddIntentModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Save Intent
                    </Button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD VARIABLE */}
        <AnimatePresence>
          {showAddVariableModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="p-5 border-b border-border flex justify-between items-center bg-zinc-950/10">
                  <span className="font-extrabold text-foreground text-sm">Register Custom Flow Variable</span>
                  <button onClick={() => setShowAddVariableModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleAddVariable} className="p-5 flex flex-col gap-4 text-left">
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Variable Key Name *</label>
                    <input
                      type="text"
                      required
                      value={newVarForm.name}
                      onChange={(e) => setNewVarForm({ ...newVarForm, name: e.target.value })}
                      placeholder="e.g. user_shipping_address"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Variable Scope</label>
                      <select
                        value={newVarForm.scope}
                        onChange={(e) => setNewVarForm({ ...newVarForm, scope: e.target.value as any })}
                        className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                      >
                        <option value="global">Global variable</option>
                        <option value="user">User attribute</option>
                        <option value="session">Session variable</option>
                        <option value="env">System Environment key</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Default Value</label>
                      <input
                        type="text"
                        value={newVarForm.value}
                        onChange={(e) => setNewVarForm({ ...newVarForm, value: e.target.value })}
                        placeholder="Optional default..."
                        className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Description</label>
                    <input
                      type="text"
                      value={newVarForm.description}
                      onChange={(e) => setNewVarForm({ ...newVarForm, description: e.target.value })}
                      placeholder="Purpose of variable..."
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-border mt-3 select-none">
                    <Button variant="outline" size="sm" type="button" onClick={() => setShowAddVariableModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Save Variable
                    </Button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardShell>
  );
}
