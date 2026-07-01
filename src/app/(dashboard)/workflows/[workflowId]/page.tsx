"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import Input from "@/components/ui/Input";
import { useWorkflows } from "@/store/use-workflows";
import { useToast } from "@/store/use-toast";
import { useDashboard } from "@/store/use-dashboard";
import {
  ArrowLeft,
  Play,
  Plus,
  Trash2,
  Settings,
  Bot,
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle,
  Save,
  CreditCard,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Terminal,
  Zap,
  Activity,
  Maximize2,
  Minimize2,
  FolderOpen,
  Users,
  History,
  Send,
  Eye,
  Sliders,
  Database,
  Globe,
  Share2,
  Undo2,
  Redo2,
  Lock,
  Star,
  Copy,
  AlertTriangle,
  FileText,
  Search,
  Grid
} from "lucide-react";
import { WorkflowStep, WorkflowVersion, WorkflowComment } from "@/types/workflows";

export default function WorkflowStudioPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { profile } = useDashboard();
  const workflowId = params?.workflowId as string;

  const {
    workflows,
    runsHistory,
    updateWorkflow,
    addStep,
    updateStep,
    removeStep,
    addConnection,
    removeConnection,
    addWorkflowRun,
    saveVersion,
    rollbackVersion,
    addComment,
    removeComment,
    // Canvas settings
    panOffset,
    setPanOffset,
    zoomLevel,
    setZoomLevel,
    zoomIn,
    zoomOut,
    centerCanvas,
    selectedStepId,
    setSelectedStepId,
    undo,
    redo,
    undoStack,
    redoStack
  } = useWorkflows();

  const currentWf = workflows.find((w) => w.id === workflowId);

  // local panel states
  const [wfName, setWfName] = useState("");
  const [wfDesc, setWfDesc] = useState("");
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [activeStepIdInDebugger, setActiveStepIdInDebugger] = useState<string | null>(null);

  // Sidebar library search & category states
  const [nodeSearchQuery, setNodeSearchQuery] = useState("");
  const [activeNodeCategory, setActiveNodeCategory] = useState<string>("All");

  // Right Side Drawer tab: inspector | version | collaboration
  const [activeRightDrawer, setActiveRightDrawer] = useState<"inspector" | "version" | "collaboration" | null>(null);
  
  // Properties Inspector tab: general | retry | variables | auth
  const [activeInspectorTab, setActiveInspectorTab] = useState<"general" | "retry" | "variables" | "auth">("general");

  // Version Control inputs
  const [newVersionName, setNewVersionName] = useState("");
  const [newVersionDesc, setNewVersionDesc] = useState("");

  // Collaboration Comments inputs
  const [newCommentText, setNewCommentText] = useState("");

  // Infinite Canvas Dragging & Connecting offsets
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);
  const [draggedNodeLabel, setDraggedNodeLabel] = useState("");
  const [draggedNodeIcon, setDraggedNodeIcon] = useState<any>(null);
  const [draggedNodeDesc, setDraggedNodeDesc] = useState("");
  
  // Dragging active node on canvas coordinate
  const [activeDraggingNodeId, setActiveDraggingNodeId] = useState<string | null>(null);
  const [draggingStartOffset, setDraggingStartOffset] = useState({ x: 0, y: 0 });

  // Creating connections variables
  const [drawingConnectionFromId, setDrawingConnectionFromId] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Keyboard shortcut modifiers
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Sync details
  useEffect(() => {
    if (currentWf) {
      setWfName(currentWf.name);
      setWfDesc(currentWf.description);
    }
  }, [currentWf]);

  // Check URL parameter to automatically run test debugger
  useEffect(() => {
    if (searchParams?.get("run") === "true") {
      setTimeout(() => {
        handleTestRun();
      }, 500);
    }
  }, [searchParams]);

  if (!currentWf) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto my-auto gap-4 select-none h-[calc(100vh-100px)] px-4">
          <span className="p-3 bg-red-950/20 text-red-500 rounded-full border border-red-500/10">
            <AlertCircle className="h-6 w-6" />
          </span>
          <div className="flex flex-col gap-1 text-left">
            <h3 className="font-bold text-foreground">Workflow Missing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The active automation builder segment is deleted or invalid.
            </p>
          </div>
          <Link href="/workflows">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to Workflows</span>
            </Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  // Handle header metadata updates
  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfName.trim()) return;
    updateWorkflow(workflowId, { name: wfName, description: wfDesc });
    setIsEditingHeader(false);
    addToast("Workflow configurations updated.", "success");
  };

  // Node Drag and Drop Drop Handler
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData("nodeType");
    const label = e.dataTransfer.getData("label");
    const desc = e.dataTransfer.getData("desc");
    
    if (!nodeType) return;

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    // Calculate drops coordinates adjusted with current panning and zoom offsets
    const clientX = e.clientX - canvasRect.left;
    const clientY = e.clientY - canvasRect.top;
    
    let x = (clientX - panOffset.x) / zoomLevel;
    let y = (clientY - panOffset.y) / zoomLevel;

    // Apply snap to grid if active
    if (snapToGrid) {
      x = Math.round(x / 20) * 20;
      y = Math.round(y / 20) * 20;
    }

    addStep(workflowId, {
      type: nodeType as any,
      label,
      description: desc,
      position: { x, y },
      nextStepIds: [],
      config: {
        provider: "openai",
        modelName: "gpt-4o-mini",
        promptTemplate: "Summarize: {{lastMessage}}",
        retryPolicy: { retries: 3, intervalMs: 2000 }
      }
    });

    addToast(`Added node: ${label}`, "success");
  };

  // Node Library Catalog
  const nodeCategories = [
    {
      title: "AI Core",
      items: [
        { type: "ai_prompt", label: "OpenAI Completion", desc: "Execute prompts via GPT-4o systems.", icon: Bot },
        { type: "ai_prompt", label: "Claude Assistant", desc: "Trigger contextual reasoning cycles.", icon: Sparkles },
        { type: "ai_prompt", label: "Gemini Adapter", desc: "Process wide multimodal vectors.", icon: Zap },
        { type: "ai_prompt", label: "Prompt template", desc: "Format variables templates.", icon: FileText }
      ]
    },
    {
      title: "WhatsApp Hub",
      items: [
        { type: "action", label: "Send WA Template", desc: "Dispatch approved WhatsApp templates.", icon: MessageSquare },
        { type: "action", label: "Send WhatsApp Chat", desc: "Send custom raw messaging alerts.", icon: Send },
        { type: "trigger", label: "WhatsApp Message received", desc: "Trigger pipeline on inbound keywords.", icon: Zap }
      ]
    },
    {
      title: "CRM & DB Sync",
      items: [
        { type: "action", label: "Sync HubSpot Client", desc: "Update properties index parameters.", icon: Users },
        { type: "action", label: "Salesforce CRM sync", desc: "Add leads validation matrices.", icon: Activity },
        { type: "action", label: "Database Insert", desc: "Write rows directly inside SQL databases.", icon: Database }
      ]
    },
    {
      title: "Logic & Routing",
      items: [
        { type: "filter", label: "Conditional split", desc: "Branch executions by custom expressions.", icon: GitBranch },
        { type: "action", label: "Cron trigger", desc: "Schedule timing automation events.", icon: Clock },
        { type: "action", label: "HTTP Client API request", desc: "Trigger external webhooks endpoint.", icon: Globe }
      ]
    }
  ];

  // Drag start from sidebar
  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData("nodeType", item.type);
    e.dataTransfer.setData("label", item.label);
    e.dataTransfer.setData("desc", item.desc);
  };

  // Canvas Panning Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // If clicking on SVG background or grid, enable panning
    const target = e.target as HTMLElement;
    if (target.classList.contains("canvas-bg") || target.tagName === "svg" || target.classList.contains("canvas-grid")) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const currentX = (e.clientX - canvasRect.left - panOffset.x) / zoomLevel;
    const currentY = (e.clientY - canvasRect.top - panOffset.y) / zoomLevel;
    setCursorPosition({ x: currentX, y: currentY });

    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (activeDraggingNodeId) {
      // Dragging node on canvas
      const step = currentWf.steps.find((s) => s.id === activeDraggingNodeId);
      if (step) {
        let nextX = (e.clientX - canvasRect.left - panOffset.x) / zoomLevel - draggingStartOffset.x;
        let nextY = (e.clientY - canvasRect.top - panOffset.y) / zoomLevel - draggingStartOffset.y;
        
        if (snapToGrid) {
          nextX = Math.round(nextX / 20) * 20;
          nextY = Math.round(nextY / 20) * 20;
        }

        updateStep(workflowId, activeDraggingNodeId, {
          position: { x: nextX, y: nextY }
        });
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setActiveDraggingNodeId(null);
    if (drawingConnectionFromId) {
      setDrawingConnectionFromId(null);
    }
  };

  // Node select handler
  const handleNodeMouseDown = (e: React.MouseEvent, stepId: string) => {
    e.stopPropagation();
    setSelectedStepId(stepId);
    setActiveRightDrawer("inspector");
    setActiveDraggingNodeId(stepId);

    const step = currentWf.steps.find((s) => s.id === stepId);
    if (step && step.position) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const cursorOnCanvasX = (e.clientX - canvasRect.left - panOffset.x) / zoomLevel;
      const cursorOnCanvasY = (e.clientY - canvasRect.top - panOffset.y) / zoomLevel;

      setDraggingStartOffset({
        x: cursorOnCanvasX - step.position.x,
        y: cursorOnCanvasY - step.position.y
      });
    }
  };

  // Connection dragging triggers
  const handlePortMouseDown = (e: React.MouseEvent, stepId: string) => {
    e.stopPropagation();
    setDrawingConnectionFromId(stepId);
  };

  const handlePortMouseUp = (e: React.MouseEvent, toStepId: string) => {
    e.stopPropagation();
    if (drawingConnectionFromId && drawingConnectionFromId !== toStepId) {
      addConnection(workflowId, drawingConnectionFromId, toStepId);
      addToast("Connection linked successfully.", "success");
    }
    setDrawingConnectionFromId(null);
  };

  // Run mock workflow debugger simulation
  const handleTestRun = () => {
    if (isTesting) return;
    setIsTesting(true);
    setShowTerminal(true);
    setTerminalLogs(["🚀 Initializing workflow debugging simulation...", "📦 Fetching active credentials and validation rules..."]);

    const stepsList = currentWf.steps;
    if (stepsList.length === 0) {
      setTerminalLogs(prev => [...prev, "❌ Error: Cannot run a workflow with no configured nodes."]);
      setIsTesting(false);
      return;
    }

    const logIdx = 0;
    const runLogs: string[] = [];

    const appendLog = (msg: string) => {
      runLogs.push(msg);
      setTerminalLogs([...runLogs]);
    };

    const runStepSim = (stepIndex: number) => {
      if (stepIndex >= stepsList.length) {
        appendLog(`✅ [SUCCESS] Execution finished cleanly. Status: 200 OK. Consumed 0.002 credits.`);
        setIsTesting(false);
        setActiveStepIdInDebugger(null);
        // Add to Zustand runs history
        addWorkflowRun({
          workflowId,
          status: "success",
          latencyMs: Math.floor(1200 + Math.random() * 600),
          logs: runLogs,
        });
        return;
      }

      const step = stepsList[stepIndex];
      setActiveStepIdInDebugger(step.id);
      setSelectedStepId(step.id);
      
      appendLog(`⚙️ Running step [${stepIndex + 1}/${stepsList.length}]: ${step.label}...`);

      setTimeout(() => {
        if (step.type === "trigger") {
          appendLog(`   • Validated trigger rules. Inbound variables mapped.`);
        } else if (step.type === "ai_prompt") {
          appendLog(`   • Prompt sent to ${step.config.provider || "openai"} / ${step.config.modelName || "gpt-4o"}.`);
          appendLog(`   • Intent analyzed. AI output resolved context.`);
        } else if (step.type === "action") {
          appendLog(`   • Dispatched secure webhook call parameters to action adapter: ${step.config.actionType || "WhatsApp API"}`);
        } else {
          appendLog(`   • Logic gate criteria checked. Active branch followed.`);
        }
        appendLog(`⭐ Node completed successfully in 320ms.`);
        runStepSim(stepIndex + 1);
      }, 1200);
    };

    setTimeout(() => {
      runStepSim(0);
    }, 800);
  };

  // Add Comment handler
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(workflowId, profile.full_name || "Arjun (Dev)", newCommentText, selectedStepId || undefined);
    setNewCommentText("");
    addToast("Comment posted.", "success");
  };

  // Add version creation handler
  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;
    saveVersion(workflowId, newVersionName, newVersionDesc || "No details provided.");
    setNewVersionName("");
    setNewVersionDesc("");
    addToast(`Saved snapshot version.`, "success");
  };

  // Fullscreen view trigger
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const selectedStep = currentWf.steps.find((s) => s.id === selectedStepId);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4 max-w-full font-sans select-none pb-12">
        
        {/* Sub-Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border dark:border-border/50 pb-4 select-none px-6">
          <div className="flex items-center gap-3 text-left">
            <Link href="/workflows" className="text-xs text-muted-foreground hover:text-foreground font-bold flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-zinc-500">/</span>
            {isEditingHeader ? (
              <form onSubmit={handleSaveHeader} className="flex items-center gap-2">
                <input
                  type="text"
                  value={wfName}
                  onChange={(e) => setWfName(e.target.value)}
                  className="px-2 py-1 bg-white dark:bg-zinc-900 border border-brand-border rounded text-xs font-bold text-foreground focus:outline-none"
                  autoFocus
                  required
                />
                <Button type="submit" size="xs" className="h-7 text-[10px] uppercase font-bold">Save</Button>
                <Button variant="ghost" size="xs" onClick={() => setIsEditingHeader(false)} className="h-7 text-[10px] uppercase font-bold">Cancel</Button>
              </form>
            ) : (
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setIsEditingHeader(true)}
                title="Edit name"
              >
                <span className="font-extrabold text-foreground text-xs">{currentWf.name}</span>
                <Settings className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>

          {/* Action row */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => undo(workflowId)}
              disabled={undoStack.length === 0}
              className="text-[10px] uppercase font-bold h-8 px-2 border-border"
              title="Undo action"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => redo(workflowId)}
              disabled={redoStack.length === 0}
              className="text-[10px] uppercase font-bold h-8 px-2 border-border"
              title="Redo action"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
            <div className="border-l border-border h-5 mx-1" />
            
            {/* Tab drawers selectors */}
            <button
              onClick={() => setActiveRightDrawer(activeRightDrawer === "version" ? null : "version")}
              className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${activeRightDrawer === "version" ? "bg-secondary border-border text-brand-sky" : "border-border text-muted-foreground hover:text-foreground"}`}
              title="Version Control History"
            >
              <History className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveRightDrawer(activeRightDrawer === "collaboration" ? null : "collaboration")}
              className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${activeRightDrawer === "collaboration" ? "bg-secondary border-border text-brand-sky" : "border-border text-muted-foreground hover:text-foreground"}`}
              title="Collaboration Comments"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
            <div className="border-l border-border h-5 mx-1" />

            <Button
              variant="primary"
              size="sm"
              onClick={handleTestRun}
              isLoading={isTesting}
              className="text-xs font-bold bg-brand-navy hover:bg-brand-navy/95 text-white flex items-center gap-1.5 h-8"
            >
              <Play className="h-3 w-3 fill-white shrink-0" />
              <span>Simulate Pipeline</span>
            </Button>
          </div>
        </div>

        {/* Studio Editor Canvas Viewport Layout */}
        <div className="grid grid-cols-12 gap-0 border border-brand-border dark:border-border/60 mx-6 bg-card rounded-2xl overflow-hidden h-[calc(100vh-230px)] relative">
          
          {/* COLUMN 1: Node Drag Sidebar Library */}
          <aside className="col-span-3 border-r border-border flex flex-col justify-between h-full bg-zinc-950/15 overflow-hidden z-20">
            <div className="flex flex-col gap-4 p-4 h-full overflow-hidden">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-xs font-bold text-foreground">Node Toolbox Library</span>
                <span className="text-[9px] text-muted-foreground">Drag and drop cards onto the infinite visual canvas.</span>
              </div>
              
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search custom nodes..."
                  value={nodeSearchQuery}
                  onChange={(e) => setNodeSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-[10px] focus:outline-none focus:border-brand-sky text-foreground"
                />
              </div>

              {/* Categorized node lists */}
              <div className="flex-grow overflow-y-auto flex flex-col gap-4 pr-1 scrollbar-thin select-none">
                {nodeCategories.map((cat, catIdx) => {
                  const filteredItems = cat.items.filter(item => 
                    item.label.toLowerCase().includes(nodeSearchQuery.toLowerCase()) ||
                    item.desc.toLowerCase().includes(nodeSearchQuery.toLowerCase())
                  );

                  if (filteredItems.length === 0) return null;

                  return (
                    <div key={catIdx} className="flex flex-col gap-1.5 text-left">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{cat.title}</span>
                      <div className="flex flex-col gap-1.5">
                        {filteredItems.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={idx}
                              draggable
                              onDragStart={(e) => handleDragStart(e, item)}
                              className="p-2.5 border border-border rounded-xl bg-card hover:border-brand-sky/40 cursor-grab active:cursor-grabbing flex items-center gap-2.5 transition-all text-xs"
                            >
                              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-brand-sky">
                                <Icon className="h-4.5 w-4.5" />
                              </div>
                              <div className="flex flex-col gap-0.5 max-w-[80%]">
                                <span className="font-bold text-foreground truncate select-none">{item.label}</span>
                                <span className="text-[8px] text-muted-foreground truncate select-none leading-none">{item.desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Infinite Visual Grid Canvas Viewport */}
          <div 
            className="col-span-9 h-full relative overflow-hidden bg-[#FAFAFA] dark:bg-[#09090B] canvas-bg outline-none"
            ref={canvasRef}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          >
            {/* SVG GRID BACKGROUND */}
            <div 
              className="absolute inset-0 canvas-grid pointer-events-none select-none"
              style={{
                backgroundImage: snapToGrid 
                  ? `radial-gradient(circle, var(--color-zinc-700) 1px, transparent 1px)` 
                  : "none",
                backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
                backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
                opacity: 0.15
              }}
            />

            {/* FLOATING CANVAS CONTROLLERS ROW */}
            <div className="absolute top-4 left-4 z-30 flex items-center border border-border bg-card/90 backdrop-blur-sm rounded-xl p-1 shadow-md select-none">
              <button onClick={zoomIn} className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded cursor-pointer transition-colors" title="Zoom in">
                <Plus className="h-4 w-4" />
              </button>
              <button onClick={zoomOut} className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded cursor-pointer transition-colors" title="Zoom out">
                <Sliders className="h-4 w-4 rotate-90" />
              </button>
              <span className="text-[9px] font-mono font-bold text-muted-foreground px-2 select-none">{Math.round(zoomLevel * 100)}%</span>
              <div className="border-l border-border h-4 mx-1" />
              
              <button onClick={centerCanvas} className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded cursor-pointer transition-colors" title="Reset/Center view">
                <Maximize2 className="h-4 w-4" />
              </button>
              <button onClick={toggleFullscreen} className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded cursor-pointer transition-colors" title="Fullscreen view">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4 rotate-45" />}
              </button>
              <button 
                onClick={() => setSnapToGrid(!snapToGrid)} 
                className={`p-1.5 rounded cursor-pointer transition-all ${snapToGrid ? "text-brand-sky bg-secondary" : "text-muted-foreground hover:text-foreground"}`}
                title="Toggle Snap to Grid"
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>

            {/* NODES GRAPH CANVAS CONTAINER */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transformOrigin: "0px 0px"
              }}
            >
              {/* SVG Link lines between nodes */}
              <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-auto">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" className="fill-brand-border dark:fill-border" />
                  </marker>
                  <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" className="fill-brand-sky" />
                  </marker>
                </defs>

                {currentWf.steps.map((node) => {
                  return (node.nextStepIds || []).map((targetId) => {
                    const targetNode = currentWf.steps.find((s) => s.id === targetId);
                    if (!targetNode || !node.position || !targetNode.position) return null;

                    // Ports coordinates calculations
                    const startX = node.position.x + 220;
                    const startY = node.position.y + 40;
                    const endX = targetNode.position.x;
                    const endY = targetNode.position.y + 40;
                    
                    const cp1 = startX + 80;
                    const cp2 = endX - 80;

                    const isActiveLink = activeStepIdInDebugger === node.id || activeStepIdInDebugger === targetNode.id;

                    return (
                      <g key={`${node.id}-${targetId}`} className="group/link cursor-pointer">
                        {/* Background thick path for easy click selection to delete link */}
                        <path
                          d={`M ${startX} ${startY} C ${cp1} ${startY}, ${cp2} ${endY}, ${endX} ${endY}`}
                          fill="none"
                          stroke="transparent"
                          strokeWidth={12}
                          onClick={() => {
                            if (confirm("Disconnect these nodes?")) {
                              removeConnection(workflowId, node.id, targetId);
                              addToast("Connection removed.", "info");
                            }
                          }}
                        />
                        {/* Visible Link curve */}
                        <path
                          d={`M ${startX} ${startY} C ${cp1} ${startY}, ${cp2} ${endY}, ${endX} ${endY}`}
                          fill="none"
                          stroke={isActiveLink ? "#3B82F6" : "var(--color-zinc-700)"}
                          strokeWidth={2}
                          className={isActiveLink ? "stroke-[3px]" : ""}
                          style={{ strokeDasharray: isActiveLink ? "6, 6" : "none", animation: isActiveLink ? "dash 1s linear infinite" : "none" }}
                          markerEnd={isActiveLink ? "url(#arrow-active)" : "url(#arrow)"}
                        />
                      </g>
                    );
                  });
                })}

                {/* Preview Link during dynamic drawing */}
                {drawingConnectionFromId && (() => {
                  const node = currentWf.steps.find((s) => s.id === drawingConnectionFromId);
                  if (!node || !node.position) return null;
                  
                  const startX = node.position.x + 220;
                  const startY = node.position.y + 40;
                  const endX = cursorPosition.x;
                  const endY = cursorPosition.y;
                  
                  const cp1 = startX + 80;
                  const cp2 = endX - 80;

                  return (
                    <path
                      d={`M ${startX} ${startY} C ${cp1} ${startY}, ${cp2} ${endY}, ${endX} ${endY}`}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      strokeDasharray="4, 4"
                      className="animate-pulse"
                    />
                  );
                })()}
              </svg>

              {/* HTML Interactive Node Cards */}
              <div className="absolute inset-0">
                {currentWf.steps.map((step) => {
                  if (!step.position) return null;

                  const isSelected = selectedStepId === step.id;
                  const isNodeActive = activeStepIdInDebugger === step.id;

                  return (
                    <div
                      key={step.id}
                      onMouseDown={(e) => handleNodeMouseDown(e, step.id)}
                      className={`absolute pointer-events-auto w-56 p-4 rounded-xl border bg-card/95 hover:shadow-lg transition-all duration-150 text-left select-none ${
                        isNodeActive 
                          ? "border-emerald-500 shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                          : isSelected
                          ? "border-brand-sky ring-2 ring-brand-sky/20"
                          : "border-border/80"
                      }`}
                      style={{
                        left: `${step.position.x}px`,
                        top: `${step.position.y}px`,
                      }}
                    >
                      {/* Inputs Port dots on left */}
                      {step.type !== "trigger" && (
                        <div
                          onMouseUp={(e) => handlePortMouseUp(e, step.id)}
                          className="absolute -left-1.5 top-[34px] w-3.5 h-3.5 rounded-full bg-zinc-800 border-2 border-border cursor-pointer flex items-center justify-center hover:bg-brand-sky hover:border-brand-sky transition-colors select-none"
                          title="Input Port"
                        />
                      )}

                      {/* Output Port dots on right */}
                      <div
                        onMouseDown={(e) => handlePortMouseDown(e, step.id)}
                        className="absolute -right-1.5 top-[34px] w-3.5 h-3.5 rounded-full bg-zinc-800 border-2 border-border cursor-pointer flex items-center justify-center hover:bg-brand-sky hover:border-brand-sky transition-colors select-none"
                        title="Output Port"
                      />

                      <div className="flex items-center gap-2.5 select-none">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          step.type === "trigger"
                            ? "bg-brand-green/10 text-brand-green"
                            : step.type === "ai_prompt"
                            ? "bg-brand-sky-light/10 text-brand-sky"
                            : "bg-brand-navy/10 text-brand-navy"
                        }`}>
                          {step.type === "trigger" ? (
                            <Zap className="h-4.5 w-4.5" />
                          ) : step.type === "ai_prompt" ? (
                            <Bot className="h-4.5 w-4.5" />
                          ) : (
                            <Settings className="h-4.5 w-4.5" />
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5 max-w-[70%] select-none">
                          <span className="font-bold text-foreground text-[10px] truncate select-none leading-none">{step.label}</span>
                          <span className="text-[8px] text-muted-foreground select-none leading-none mt-1 uppercase font-semibold font-mono tracking-wider">{step.type}</span>
                        </div>
                      </div>

                      {step.description && (
                        <p className="text-[9px] text-muted-foreground leading-normal mt-2 select-none h-6 overflow-hidden text-ellipsis line-clamp-2">
                          {step.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/40 select-none">
                        <span className="text-[8px] font-bold text-muted-foreground uppercase leading-none font-mono">
                          {step.config.provider || step.config.actionType || "Utility"}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeStep(workflowId, step.id);
                            addToast("Node deleted.", "info");
                          }}
                          className="p-1 text-muted-foreground hover:text-destructive hover:bg-zinc-800 rounded transition-colors select-none"
                          title="Delete Node"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* SLIDEOUT DRAWER: Node Inspector, Version Timeline or Collaboration Comments */}
          {activeRightDrawer && (
            <aside className="absolute right-0 top-0 bottom-0 w-80 border-l border-border bg-card shadow-2xl z-45 flex flex-col justify-between h-full overflow-hidden select-text">
              <div className="flex flex-col gap-4 p-4 h-full overflow-hidden">
                <div className="flex justify-between items-center border-b border-border/40 pb-2.5 select-none">
                  <span className="text-xs font-bold text-foreground">
                    {activeRightDrawer === "inspector" ? "Node Properties Settings" :
                     activeRightDrawer === "version" ? "Timeline Version Rolls" : "Collaboration Thread"}
                  </span>
                  <button 
                    onClick={() => setActiveRightDrawer(null)}
                    className="text-xs text-muted-foreground hover:text-foreground font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* DRAWER 1: Node Properties settings */}
                {activeRightDrawer === "inspector" && selectedStep && (
                  <div className="flex-grow flex flex-col gap-4 h-full overflow-hidden">
                    <div className="flex items-center gap-1 overflow-x-auto border-b border-border select-none shrink-0 pb-1.5">
                      {[
                        { id: "general", label: "General" },
                        { id: "retry", label: "Retry Policy" },
                        { id: "variables", label: "Variables" },
                        { id: "auth", label: "Auth" }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveInspectorTab(tab.id as any)}
                          className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                            activeInspectorTab === tab.id
                              ? "bg-secondary text-foreground font-extrabold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex-grow overflow-y-auto flex flex-col gap-4 pr-1 scrollbar-thin select-text">
                      {/* Inspector: General Settings */}
                      {activeInspectorTab === "general" && (
                        <div className="flex flex-col gap-3">
                          <Input
                            label="Node Label Title"
                            value={selectedStep.label}
                            onChange={(e) => updateStep(workflowId, selectedStep.id, { label: e.target.value })}
                          />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-brand-navy dark:text-foreground uppercase tracking-wider">Node Description Notes</label>
                            <textarea
                              value={selectedStep.description || ""}
                              onChange={(e) => updateStep(workflowId, selectedStep.id, { description: e.target.value })}
                              className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs leading-normal text-foreground focus:outline-none focus:border-brand-sky h-16 resize-none"
                            />
                          </div>

                          {selectedStep.type === "ai_prompt" && (
                            <>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-brand-navy dark:text-foreground uppercase tracking-wider">Model Provider Adapter</label>
                                <select
                                  value={selectedStep.config.provider || "openai"}
                                  onChange={(e) => updateStep(workflowId, selectedStep.id, { config: { ...selectedStep.config, provider: e.target.value as any } })}
                                  className="h-9 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none cursor-pointer"
                                >
                                  <option value="openai">OpenAI Gateway</option>
                                  <option value="anthropic">Anthropic Claude</option>
                                  <option value="google">Google Gemini</option>
                                  <option value="deepseek">DeepSeek model</option>
                                </select>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-brand-navy dark:text-foreground uppercase tracking-wider">AI Instructions Template</label>
                                <textarea
                                  value={selectedStep.config.promptTemplate || ""}
                                  onChange={(e) => updateStep(workflowId, selectedStep.id, { config: { ...selectedStep.config, promptTemplate: e.target.value } })}
                                  className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs leading-relaxed text-foreground focus:outline-none focus:border-brand-sky h-24 resize-none"
                                />
                              </div>
                            </>
                          )}

                          {selectedStep.type === "action" && selectedStep.config.actionType === "whatsapp_template" && (
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-brand-navy dark:text-foreground uppercase tracking-wider">WhatsApp Template ID</label>
                              <input
                                type="text"
                                value={selectedStep.config.templateId || ""}
                                onChange={(e) => updateStep(workflowId, selectedStep.id, { config: { ...selectedStep.config, templateId: e.target.value } })}
                                className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Inspector: Retry Policy */}
                      {activeInspectorTab === "retry" && (
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-brand-navy dark:text-foreground uppercase tracking-wider">Timeout Limit (Seconds)</label>
                            <input
                              type="number"
                              value={selectedStep.timeoutSec || 30}
                              onChange={(e) => updateStep(workflowId, selectedStep.id, { timeoutSec: parseInt(e.target.value) })}
                              className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-brand-navy dark:text-foreground uppercase tracking-wider">Max Execution Retries</label>
                            <input
                              type="number"
                              value={selectedStep.retryPolicy?.retries || 3}
                              onChange={(e) => updateStep(workflowId, selectedStep.id, { retryPolicy: { retries: parseInt(e.target.value), intervalMs: selectedStep.retryPolicy?.intervalMs || 2000 } })}
                              className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Inspector: Local variables */}
                      {activeInspectorTab === "variables" && (
                        <div className="flex flex-col gap-3 text-left">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Local Variable Parameters</span>
                          <div className="p-3 bg-secondary rounded-xl flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-foreground">Reference Tags</span>
                            <span className="text-[9px] text-muted-foreground leading-normal">Use {"{{lastMessage}}"} or {"{{customerPhone}}"} inside variables text input areas.</span>
                          </div>
                        </div>
                      )}

                      {/* Inspector: Authentication credentials */}
                      {activeInspectorTab === "auth" && (
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-brand-navy dark:text-foreground uppercase tracking-wider">Secure Credentials ID</label>
                            <select
                              value={selectedStep.authId || "default"}
                              onChange={(e) => updateStep(workflowId, selectedStep.id, { authId: e.target.value })}
                              className="h-9 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none cursor-pointer"
                            >
                              <option value="default">ExpendMore API Gateway (Default)</option>
                              <option value="whatsapp_meta">WhatsApp Meta key credentials</option>
                              <option value="hubspot_oauth">HubSpot OAuth connection</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* DRAWER 2: Version Timeline lists */}
                {activeRightDrawer === "version" && (
                  <div className="flex-grow flex flex-col gap-4 h-full overflow-hidden text-left">
                    <form onSubmit={handleCreateVersion} className="flex flex-col gap-3 border-b border-border/40 pb-4 shrink-0">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Commit Snapshot Draft</span>
                      <Input
                        label="Version Name"
                        placeholder="e.g. Deploy cart reminders"
                        value={newVersionName}
                        onChange={(e) => setNewVersionName(e.target.value)}
                        required
                      />
                      <Input
                        label="Description"
                        placeholder="Details of updates..."
                        value={newVersionDesc}
                        onChange={(e) => setNewVersionDesc(e.target.value)}
                      />
                      <Button type="submit" size="xs" className="w-full text-xs font-bold bg-brand-navy text-white uppercase h-8 mt-1">
                        Commit Version
                      </Button>
                    </form>

                    <div className="flex-grow overflow-y-auto flex flex-col gap-3 pr-1 scrollbar-thin select-text">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Version Rollback Timeline</span>
                      {(currentWf.versions || []).length === 0 ? (
                        <div className="text-[10px] text-muted-foreground italic text-center py-6">No historical snapshots saved yet.</div>
                      ) : (
                        (currentWf.versions || []).map((ver) => (
                          <div key={ver.id} className="p-3 border border-border rounded-xl bg-secondary flex flex-col gap-1.5 text-xs select-text">
                            <div className="flex justify-between items-start select-text">
                              <span className="font-bold text-foreground">v{ver.versionNumber}: {ver.name}</span>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => {
                                  if (confirm(`Rollback active nodes layout to ${ver.name}?`)) {
                                    rollbackVersion(workflowId, ver.id);
                                    addToast("Workflow rolled back successfully.", "success");
                                  }
                                }}
                                className="h-6 text-[9px] px-1.5 uppercase font-bold"
                              >
                                Rollback
                              </Button>
                            </div>
                            <span className="text-[9px] text-muted-foreground leading-normal select-text">{ver.description}</span>
                            <span className="text-[8px] text-zinc-500 font-mono select-none">{new Date(ver.createdAt).toLocaleDateString()} at {new Date(ver.createdAt).toLocaleTimeString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* DRAWER 3: Collaborative Comments feed */}
                {activeRightDrawer === "collaboration" && (
                  <div className="flex-grow flex flex-col gap-4 h-full overflow-hidden text-left">
                    <form onSubmit={handlePostComment} className="flex gap-2 shrink-0 select-none border-b border-border/40 pb-4">
                      <input
                        type="text"
                        placeholder="Write team sticky note..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="flex-grow h-9 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-[10px] focus:outline-none"
                      />
                      <Button type="submit" size="xs" className="h-9 w-9 p-0 shrink-0">
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </form>

                    <div className="flex-grow overflow-y-auto flex flex-col gap-3 pr-1 scrollbar-thin select-text">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase select-none">Team sticky thread</span>
                      {(currentWf.comments || []).length === 0 ? (
                        <div className="text-[10px] text-muted-foreground italic text-center py-6 select-none">No active sticky notes posted.</div>
                      ) : (
                        (currentWf.comments || []).map((com) => (
                          <div key={com.id} className="p-3 border border-border rounded-xl bg-secondary flex flex-col gap-1.5 text-xs select-text">
                            <div className="flex justify-between items-center select-text">
                              <span className="font-bold text-brand-sky select-text">{com.author}</span>
                              <button
                                onClick={() => removeComment(workflowId, com.id)}
                                className="text-muted-foreground hover:text-destructive cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="text-[10px] text-foreground leading-normal select-text">{com.text}</span>
                            {com.nodeId && (
                              <span className="text-[8px] font-mono font-bold text-muted-foreground uppercase bg-zinc-800 px-1 py-0.5 rounded w-max select-none">Node: {com.nodeId}</span>
                            )}
                            <span className="text-[8px] text-zinc-500 font-mono select-none">{com.date}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>
            </aside>
          )}

          {/* BOTTOM MODAL PANEL: Simulation logs & Execution telemetry logs */}
          {showTerminal && (
            <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-brand-navy bg-black text-emerald-400 font-mono text-xs overflow-hidden h-64 flex flex-col shadow-2xl select-text">
              <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center text-white select-none shrink-0">
                <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span>Pipeline Debug Simulator logs</span>
                </span>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-zinc-400 hover:text-white px-2 py-0.5 hover:bg-zinc-800 rounded text-[10px] font-bold uppercase cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin select-text">
                {terminalLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed whitespace-pre-wrap select-text text-left">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </DashboardShell>
  );
}

function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
