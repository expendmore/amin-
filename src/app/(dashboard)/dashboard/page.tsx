"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatusChip from "@/components/ui/StatusChip";
import { useDashboard } from "@/store/use-dashboard";
import { useToast } from "@/store/use-toast";
import {
  AreaChart,
  DonutChart,
  BarChart,
  ActivityGraph
} from "@/components/ui/DashboardCharts";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";
import {
  Bolt,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpRight,
  GitBranch,
  ArrowRight,
  ShieldAlert,
  UserPlus,
  FileText,
  Plus,
  RefreshCw,
  LayoutGrid,
  EyeOff,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Trash2,
  Calendar,
  AlertTriangle,
  FolderOpen,
  Pin,
  Star,
  Settings,
  Bell,
  Sliders,
  Database,
  Users,
  X
} from "lucide-react";

// Widget Layout type definition
interface Widget {
  id: string;
  title: string;
  w: 4 | 6 | 8 | 12; // grid column spans (4: 1/3, 6: 1/2, 8: 2/3, 12: full)
  visible: boolean;
}

// Default layout configuration
const DEFAULT_LAYOUT: Widget[] = [
  { id: "stats", title: "Key Statistics Bento Grid", w: 12, visible: true },
  { id: "analytics", title: "Analytics Metrics Chart", w: 8, visible: true },
  { id: "actions", title: "Direct Quick Actions", w: 4, visible: true },
  { id: "workflows", title: "Automation Workflow Pipeline", w: 6, visible: true },
  { id: "ai_usage", title: "AI Token & Models usage", w: 6, visible: true },
  { id: "whatsapp", title: "WhatsApp Integration Monitor", w: 6, visible: true },
  { id: "timeline", title: "Today's Task Stream Logs", w: 6, visible: true },
  { id: "chats", title: "Recent AI Conversations", w: 6, visible: true },
  { id: "files", title: "Shared Knowledge Base Files", w: 6, visible: true },
  { id: "calendar", title: "Automation Runs Calendar", w: 6, visible: true },
  { id: "notifications", title: "System Inbox Alerts", w: 12, visible: true }
];

export default function DashboardPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { profile } = useDashboard();

  // Layout states
  const [layout, setLayout] = useState<Widget[]>(DEFAULT_LAYOUT);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Simulation states
  const [refreshing, setRefreshing] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);

  // Calendar Widget states
  const [currentMonth, setCurrentMonth] = useState("June 2026");

  // Chart Metric Selection
  const [analyticsMetric, setAnalyticsMetric] = useState<"revenue" | "conversions" | "growth">("revenue");

  // Load layout from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("expendmore_dashboard_layout");
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch (e) {
        setLayout(DEFAULT_LAYOUT);
      }
    }
  }, []);

  // Save layout helper
  const saveLayout = (newLayout: Widget[]) => {
    setLayout(newLayout);
    localStorage.setItem("expendmore_dashboard_layout", JSON.stringify(newLayout));
  };

  // Reset layout helper
  const handleResetLayout = () => {
    saveLayout(DEFAULT_LAYOUT);
    addToast("Dashboard layout reset to default configuration.", "info");
  };

  // Toggle Edit Layout mode
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      addToast("Dashboard layout layout saved successfully!", "success");
    } else {
      addToast("Rearranging mode active. Resize and move widgets below.", "info");
    }
  };

  // Refresh trigger simulation
  const handleRefresh = () => {
    setRefreshing(true);
    addToast("Synchronizing active gateway endpoints...", "info");
    setTimeout(() => {
      setRefreshing(false);
      addToast("Dashboard metrics refreshed successfully!", "success");
    }, 1200);
  };

  // Reordering action (Index Swap)
  const moveWidget = (index: number, direction: "up" | "down" | "left" | "right") => {
    const nextLayout = [...layout];
    const targetIdx = direction === "up" || direction === "left" ? index - 1 : index + 1;

    if (targetIdx >= 0 && targetIdx < nextLayout.length) {
      // Swap items
      const temp = nextLayout[index];
      nextLayout[index] = nextLayout[targetIdx];
      nextLayout[targetIdx] = temp;
      saveLayout(nextLayout);
    }
  };

  // Resize action cycle
  const cycleResize = (id: string) => {
    const nextLayout = layout.map((w) => {
      if (w.id === id) {
        let nextW: 4 | 6 | 8 | 12 = 4;
        if (w.w === 4) nextW = 6;
        else if (w.w === 6) nextW = 8;
        else if (w.w === 8) nextW = 12;
        else nextW = 4;
        return { ...w, w: nextW };
      }
      return w;
    });
    saveLayout(nextLayout);
  };

  // Visibility toggle
  const toggleVisibility = (id: string) => {
    const nextLayout = layout.map((w) => {
      if (w.id === id) {
        return { ...w, visible: !w.visible };
      }
      return w;
    });
    saveLayout(nextLayout);
  };

  // Drag and drop mechanics
  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const sourceIdx = layout.findIndex((w) => w.id === draggedId);
    const targetIdx = layout.findIndex((w) => w.id === targetId);

    if (sourceIdx !== -1 && targetIdx !== -1) {
      const nextLayout = [...layout];
      const [draggedItem] = nextLayout.splice(sourceIdx, 1);
      nextLayout.splice(targetIdx, 0, draggedItem);
      saveLayout(nextLayout);
    }
    setDraggedId(null);
  };

  // Greeting dynamic resolver
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = profile?.full_name ? profile.full_name.split(" ")[0] : "Arjun";

  // Data sets based on simulation state
  const analyticsData = {
    revenue: [
      { label: "Mon", value: isEmptyState ? 0 : 4200 },
      { label: "Tue", value: isEmptyState ? 0 : 6800 },
      { label: "Wed", value: isEmptyState ? 0 : 5100 },
      { label: "Thu", value: isEmptyState ? 0 : 9400 },
      { label: "Fri", value: isEmptyState ? 0 : 12300 },
      { label: "Sat", value: isEmptyState ? 0 : 8500 },
      { label: "Sun", value: isEmptyState ? 0 : 15400 }
    ],
    conversions: [
      { label: "Mon", value: isEmptyState ? 0 : 150 },
      { label: "Tue", value: isEmptyState ? 0 : 340 },
      { label: "Wed", value: isEmptyState ? 0 : 220 },
      { label: "Thu", value: isEmptyState ? 0 : 450 },
      { label: "Fri", value: isEmptyState ? 0 : 580 },
      { label: "Sat", value: isEmptyState ? 0 : 390 },
      { label: "Sun", value: isEmptyState ? 0 : 720 }
    ],
    growth: [
      { label: "Mon", value: isEmptyState ? 0 : 12 },
      { label: "Tue", value: isEmptyState ? 0 : 18 },
      { label: "Wed", value: isEmptyState ? 0 : 14 },
      { label: "Thu", value: isEmptyState ? 0 : 25 },
      { label: "Fri", value: isEmptyState ? 0 : 31 },
      { label: "Sat", value: isEmptyState ? 0 : 28 },
      { label: "Sun", value: isEmptyState ? 0 : 42 }
    ]
  };

  const modelUsageData = [
    { label: "OpenAI GPT-4o", value: isEmptyState ? 0 : 520, color: "#10B981" },
    { label: "Google Gemini 1.5", value: isEmptyState ? 0 : 240, color: "#3B82F6" },
    { label: "Anthropic Claude 3.5", value: isEmptyState ? 0 : 180, color: "#F59E0B" },
    { label: "DeepSeek Coder", value: isEmptyState ? 0 : 60, color: "#8B5CF6" }
  ];

  const tokenUsageData = [
    { label: "Mon", value: isEmptyState ? 0 : 14 },
    { label: "Tue", value: isEmptyState ? 0 : 28 },
    { label: "Wed", value: isEmptyState ? 0 : 18 },
    { label: "Thu", value: isEmptyState ? 0 : 34 },
    { label: "Fri", value: isEmptyState ? 0 : 42 },
    { label: "Sat", value: isEmptyState ? 0 : 12 },
    { label: "Sun", value: isEmptyState ? 0 : 55 }
  ];

  // Calendar dates mock generator
  const daysInMonth = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    hasEvent: !isEmptyState && (i === 11 || i === 14 || i === 23 || i === 27),
    events: i === 11 ? ["Abandoned Cart recovery check"] : i === 27 ? ["CRM sync scheduler run", "Billing billing run"] : []
  }));

  // Workflows List Mock state
  const [workflowsList, setWorkflowsList] = useState([
    { id: "wf1", name: "Abandoned Cart Auto-Followup", status: "success", rate: 98.4 },
    { id: "wf2", name: "Qualify Lead & Send Catalog PDF", status: "running", rate: 100 },
    { id: "wf3", name: "Customer Ticket Router Agent", status: "success", rate: 95.2 },
    { id: "wf4", name: "Weekly Hubspot CRM Sync", status: "failed", rate: 0 }
  ]);

  const handleToggleWorkflow = (id: string, name: string) => {
    setWorkflowsList(prev => prev.map(w => {
      if (w.id === id) {
        const nextStatus = w.status === "success" || w.status === "running" ? "failed" : "success";
        addToast(`Workflow "${name}" state toggled.`, "info");
        return { ...w, status: nextStatus, rate: nextStatus === "failed" ? 0 : 96.5 };
      }
      return w;
    }));
  };

  // Mock Notifications list state
  const [systemNotifications, setSystemNotifications] = useState([
    { id: "n1", title: "Stripe Webhook Sync Complete", msg: "All billing transactions synchronized successfully.", type: "success" },
    { id: "n2", title: "API Quota Alert threshold", msg: "Developer access tokens consumed 82% of credit limits.", type: "warning" },
    { id: "n3", title: "WhatsApp Gateway Maintenance", msg: "System update scheduled for June 28 at 02:00 UTC.", type: "info" }
  ]);

  const handleDismissNotification = (id: string) => {
    setSystemNotifications(prev => prev.filter(n => n.id !== id));
    addToast("Notification dismissed.", "info");
  };

  return (
    <DashboardShell>
      <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6 pb-24 md:pb-12 select-none">
        
        {/* TOP CONTROLS & WELCOME BANNER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-white/[0.06] select-none">
          <div className="flex flex-col gap-1 text-left">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
              {getGreeting()}, {firstName}.
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
              <Database className="h-3.5 w-3.5 text-emerald-400" />
              <span>Workspace: {profile?.company || "Anshuman Enterprises"}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-650" />
              <span className="text-[9px] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md bg-emerald-500/10 font-extrabold uppercase tracking-wider select-none leading-none">
                {profile?.tier || "FREE"} PLAN
              </span>
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            {/* Simulation controls */}
            <button
              onClick={() => {
                setIsEmptyState(!isEmptyState);
                addToast(isEmptyState ? "Loaded active system metrics." : "Simulation empty states active.", "info");
              }}
              className={`px-3.5 h-9 rounded-xl text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer border ${
                isEmptyState
                  ? "bg-emerald-600 text-white border-emerald-500/25 shadow-md shadow-emerald-500/10"
                  : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {isEmptyState ? "Clear Empty State" : "Simulate Empty State"}
            </button>

            <button
              onClick={() => {
                setIsErrorState(!isErrorState);
                addToast(isErrorState ? "Normal states loaded." : "Simulation query errors active.", "warning");
              }}
              className={`px-3.5 h-9 rounded-xl text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer border ${
                isErrorState
                  ? "bg-red-600 text-white border-red-500/25 shadow-md shadow-red-500/10"
                  : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {isErrorState ? "Clear Error State" : "Simulate Error State"}
            </button>

            <button
              onClick={handleRefresh}
              className="h-9 w-9 flex items-center justify-center bg-white/[0.02] border border-white/[0.08] hover:border-white/15 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
              title="Refresh Metrics"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-emerald-450" : ""}`} />
            </button>

            <button
              onClick={handleToggleEdit}
              className={`px-3.5 h-9 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                isEditing
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/25 text-white shadow-md shadow-emerald-500/10"
                  : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{isEditing ? "Save Layout" : "Edit Layout"}</span>
            </button>

            {isEditing && (
              <button
                onClick={handleResetLayout}
                className="px-3.5 h-9 rounded-xl text-[10px] font-bold uppercase border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              >
                Reset Default
              </button>
            )}
          </div>
        </div>

        {/* Hidden widgets bar in Editing Mode */}
        {isEditing && layout.some((w) => !w.visible) && (
          <div className="p-3 bg-brand-sky-light/10 border border-brand-sky/20 rounded-xl flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-brand-sky uppercase tracking-wider">Hidden Widgets:</span>
            {layout
              .filter((w) => !w.visible)
              .map((w) => (
                <button
                  key={w.id}
                  onClick={() => toggleVisibility(w.id)}
                  className="px-2 py-0.5 rounded-full bg-zinc-900 text-white text-[9px] font-bold hover:bg-zinc-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>{w.title}</span>
                  <Plus className="h-3 w-3" />
                </button>
              ))}
          </div>
        )}

        {/* DRAGGABLE & RESIZABLE WIDGETS GRID */}
        {refreshing ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-12 gap-6 items-start">
            <AnimatePresence>
            {layout
              .filter((w) => w.visible)
              .map((w, index) => {
                const isHalf = w.w === 6;
                const isThird = w.w === 4;
                const isTwoThirds = w.w === 8;
                const isFull = w.w === 12;

                const gridColClass = isFull
                  ? "col-span-12"
                  : isTwoThirds
                  ? "col-span-12 lg:col-span-8"
                  : isHalf
                  ? "col-span-12 lg:col-span-6"
                  : "col-span-12 md:col-span-6 lg:col-span-4";

                return (
                  <motion.div
                    key={w.id}
                    layout
                    draggable={isEditing}
                    onDragStart={() => handleDragStart(w.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(w.id)}
                    className={`${gridColClass} transition-all duration-300 relative group/widget ${
                      isEditing ? "cursor-grab active:cursor-grabbing border border-dashed border-brand-sky/40 rounded-2xl bg-brand-sky-light/5" : ""
                    }`}
                  >
                    {/* Rearrange controls overlay during editing mode */}
                    {isEditing && (
                      <div className="absolute top-2 right-2 z-30 bg-zinc-950/90 text-white px-2 py-1 rounded-md flex items-center gap-1.5 shadow-md">
                        <button
                          disabled={index === 0}
                          onClick={() => moveWidget(index, "up")}
                          className="p-1 hover:bg-zinc-850 rounded disabled:opacity-30 cursor-pointer"
                          title="Move Up/Left"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={index === layout.length - 1}
                          onClick={() => moveWidget(index, "down")}
                          className="p-1 hover:bg-zinc-850 rounded disabled:opacity-30 cursor-pointer"
                          title="Move Down/Right"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => cycleResize(w.id)}
                          className="p-1 hover:bg-zinc-850 rounded text-[9px] font-bold font-mono uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                          title="Cycle Size width"
                        >
                          <Maximize2 className="h-3 w-3" />
                          <span>{w.w === 4 ? "1/3" : w.w === 6 ? "1/2" : w.w === 8 ? "2/3" : "Full"}</span>
                        </button>
                        <button
                          onClick={() => toggleVisibility(w.id)}
                          className="p-1 hover:bg-red-500/20 text-red-400 rounded cursor-pointer"
                          title="Hide Widget"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    {/* WIDGET CONTENT RENDERS */}
                    {refreshing ? (
                      <Card className="p-6 h-[260px] flex items-center justify-center select-none">
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw className="h-6 w-6 text-brand-sky animate-spin" />
                          <span className="text-xs text-muted-foreground font-semibold">Updating credentials...</span>
                        </div>
                      </Card>
                    ) : isErrorState ? (
                      <Card className="p-6 h-[260px] border border-red-500/30 bg-red-500/5 flex items-center justify-center select-none">
                        <div className="flex flex-col items-center gap-2 max-w-sm text-center">
                          <AlertTriangle className="h-8 w-8 text-red-500 animate-pulse" />
                          <span className="text-sm font-bold text-foreground">API Sync Failure</span>
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            A network error occurred while establishing webhook tunnels to user server interfaces. Check developer logs.
                          </span>
                        </div>
                      </Card>
                    ) : (
                      <>
                        {w.id === "stats" && renderStatsWidget(isEmptyState)}
                        {w.id === "analytics" && renderAnalyticsWidget(analyticsMetric, setAnalyticsMetric, analyticsData)}
                        {w.id === "actions" && renderActionsWidget(router, addToast)}
                        {w.id === "workflows" && renderWorkflowsWidget(workflowsList, handleToggleWorkflow)}
                        {w.id === "ai_usage" && renderAiUsageWidget(modelUsageData, tokenUsageData, isEmptyState)}
                        {w.id === "whatsapp" && renderWhatsappWidget(isEmptyState)}
                        {w.id === "timeline" && renderTimelineWidget(isEmptyState)}
                        {w.id === "chats" && renderChatsWidget(isEmptyState, router)}
                        {w.id === "files" && renderFilesWidget(isEmptyState, addToast)}
                        {w.id === "calendar" && renderCalendarWidget(daysInMonth, currentMonth, setCurrentMonth, isEmptyState)}
                        {w.id === "notifications" && renderNotificationsWidget(systemNotifications, handleDismissNotification)}
                      </>
                    )}
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
        )}
      </div>
    </DashboardShell>
  );
}

// ==================================================
// WIDGETS RENDERING LOGIC
// ==================================================

// WIDGET A: Stats Bento Grid
function renderStatsWidget(isEmptyState: boolean) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {/* Metric 1 */}
      <Card className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-center text-slate-450">
          <span className="text-[10px] font-bold uppercase tracking-wider">Active AI Agents</span>
          <Sparkles className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="text-3xl font-extrabold text-white font-mono">{isEmptyState ? 0 : 8}</span>
        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          4 healthy, 4 standby
        </span>
      </Card>

      {/* Metric 2 */}
      <Card className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-center text-slate-450">
          <span className="text-[10px] font-bold uppercase tracking-wider">Running Workflows</span>
          <Bolt className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="text-3xl font-extrabold text-white font-mono">{isEmptyState ? 0 : 14}</span>
        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-emerald-400" />
          +12.4% vs last week
        </span>
      </Card>

      {/* Metric 3 */}
      <Card className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-center text-slate-450">
          <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp Status</span>
          <MessageSquare className="h-4 w-4 text-teal-400" />
        </div>
        <span className="text-3xl font-extrabold text-white font-mono">{isEmptyState ? "Offline" : "Connected"}</span>
        <span className="text-[10px] text-slate-400 font-semibold truncate leading-none">
          {isEmptyState ? "No account linked" : "Num: +91 98765..."}
        </span>
      </Card>

      {/* Metric 4 */}
      <Card className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-center text-slate-450">
          <span className="text-[10px] font-bold uppercase tracking-wider">Messages Sent Today</span>
          <MessageSquare className="h-4 w-4 text-slate-500" />
        </div>
        <span className="text-3xl font-extrabold text-white font-mono">{isEmptyState ? 0 : "1.2k"}</span>
        <span className="text-[10px] text-emerald-450 font-semibold flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          +18.2% vs yesterday
        </span>
      </Card>

      {/* Metric 5 */}
      <Card className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-center text-slate-450">
          <span className="text-[10px] font-bold uppercase tracking-wider">Success Rate</span>
          <Bolt className="h-4 w-4 text-emerald-450" />
        </div>
        <span className="text-3xl font-extrabold text-white font-mono">{isEmptyState ? "0.0%" : "99.8%"}</span>
        <span className="text-[10px] text-slate-400 font-semibold">Avg Response: 480ms</span>
      </Card>

      {/* Metric 6 */}
      <Card className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-center text-slate-450">
          <span className="text-[10px] font-bold uppercase tracking-wider">API Requests Today</span>
          <Settings className="h-4 w-4 text-slate-500" />
        </div>
        <span className="text-3xl font-extrabold text-white font-mono">{isEmptyState ? 0 : "48,250"}</span>
        <span className="text-[10px] text-slate-400 font-semibold">Active endpoint hooks</span>
      </Card>

      {/* Metric 7 */}
      <Card className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-center text-slate-450">
          <span className="text-[10px] font-bold uppercase tracking-wider">Credits Remaining</span>
          <Sparkles className="h-4 w-4 text-amber-500" />
        </div>
        <span className="text-3xl font-extrabold text-white font-mono">{isEmptyState ? "$0.00" : "$1,250"}</span>
        <span className="text-[10px] text-amber-400 font-semibold leading-none">Expires in 25 days</span>
      </Card>

      {/* Metric 8 */}
      <Card className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-center text-slate-450">
          <span className="text-[10px] font-bold uppercase tracking-wider">Storage Usage</span>
          <FolderOpen className="h-4 w-4 text-slate-500" />
        </div>
        <span className="text-3xl font-extrabold text-white font-mono">{isEmptyState ? "0.0 GB" : "1.4 GB"}</span>
        <div className="flex flex-col gap-1 w-full mt-0.5 select-none">
          <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden w-full border border-white/[0.04]">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300" style={{ width: isEmptyState ? "0%" : "14%" }} />
          </div>
          <span className="text-[8px] text-slate-500 font-bold leading-none self-end">Limit: 10 GB</span>
        </div>
      </Card>
    </div>
  );
}

// WIDGET B: Analytics Preview Chart
function renderAnalyticsWidget(
  metric: "revenue" | "conversions" | "growth",
  setMetric: (m: "revenue" | "conversions" | "growth") => void,
  chartData: any
) {
  return (
    <Card className="p-6 flex flex-col gap-4 w-full h-[320px] justify-between">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-white">Analytics Overview Performance</span>
          <span className="text-xs text-slate-400">Monitor revenue and customer conversion funnels.</span>
        </div>
        
        {/* Metric tabs */}
        <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.08] p-1 rounded-xl">
          {(["revenue", "conversions", "growth"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                metric === m
                  ? "bg-slate-950 border border-white/10 text-white shadow-sm font-extrabold"
                  : "text-slate-500 hover:text-slate-350"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* SVG rendering */}
      <div className="flex-grow pt-2 select-none">
        <AreaChart
          data={chartData[metric]}
          height={170}
          color={metric === "revenue" ? "#10b981" : metric === "conversions" ? "#14b8a6" : "#8b5cf6"}
          unit={metric === "revenue" ? "$" : ""}
        />
      </div>
    </Card>
  );
}

// WIDGET C: Quick Actions Panel
function renderActionsWidget(router: any, addToast: any) {
  const actions = [
    { label: "Create Agent", href: "/chat/agents", icon: Sparkles, desc: "Deploy custom prompt agents" },
    { label: "New Workflow", href: "/workflows", icon: Bolt, desc: "Build automation flows" },
    { label: "Connect WhatsApp", href: "/whatsapp", icon: MessageSquare, desc: "Sync Meta Cloud gateway" },
    { label: "Invite Member", href: "/settings/team", icon: UserPlus, desc: "Add workspace collaborators" },
    { label: "Upload File", href: "/files", icon: FileText, desc: "Index PDF knowledge assets" },
    { label: "Open AI Chat", href: "/chat", icon: ArrowRight, desc: "Start prompt streams" }
  ];

  const handleActionClick = (label: string, href: string) => {
    addToast(`Navigating to ${label}...`, "info");
    router.push(href);
  };

  return (
    <Card className="p-6 flex flex-col gap-4 w-full h-[320px] justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-white">Direct Shortcuts Panel</span>
        <span className="text-xs text-slate-400">Trigger workspace deployments instantly.</span>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-grow pt-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={() => handleActionClick(act.label, act.href)}
              className="flex flex-col items-start gap-1 p-3 text-left bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 hover:bg-emerald-500/5 rounded-xl transition-all duration-150 cursor-pointer group"
            >
              <Icon className="h-4.5 w-4.5 text-emerald-400 group-hover:scale-105 transition-transform" />
              <span className="text-[10px] font-bold text-white leading-none mt-1">{act.label}</span>
              <span className="text-[8px] text-slate-500 leading-snug truncate w-full mt-0.5">{act.desc}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// WIDGET D: Workflow Overview
function renderWorkflowsWidget(
  workflows: any[],
  onToggle: (id: string, name: string) => void
) {
  return (
    <Card className="p-6 flex flex-col gap-4 w-full h-[320px] justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-white">Automation Pipelines Monitor</span>
        <span className="text-xs text-slate-400">Deploy and pause active webhooks.</span>
      </div>

      <div className="flex flex-col gap-3 flex-grow pt-1.5 overflow-y-auto">
        {workflows.map((w) => (
          <div key={w.id} className="flex items-center justify-between p-2.5 bg-white/[0.01] border border-white/[0.06] rounded-xl">
            <div className="flex flex-col gap-0.5 max-w-[70%] text-left">
              <span className="text-xs font-bold text-white truncate">{w.name}</span>
              <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold font-mono">
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${w.status === "failed" ? "bg-red-400 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
                  {w.status.toUpperCase()}
                </span>
                <span>Success: {w.rate}%</span>
              </div>
            </div>
            
            <button
              onClick={() => onToggle(w.id, w.name)}
              className={`text-[9px] h-7 px-3.5 uppercase font-extrabold shrink-0 rounded-lg transition-all border ${
                w.status === "failed" 
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-500/25 shadow-md shadow-emerald-500/10" 
                  : "bg-white/[0.02] text-slate-300 border-white/10 hover:bg-white/[0.06]"
              }`}
            >
              {w.status === "failed" ? "Restart" : "Pause"}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// WIDGET E: AI Usage
function renderAiUsageWidget(donutData: any[], tokenData: any[], isEmptyState: boolean) {
  return (
    <Card className="p-6 flex flex-col gap-4 w-full h-[320px] justify-between select-none">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-white">AI Token & Model Logs</span>
        <span className="text-xs text-slate-400">Monitor API requests breakdown and daily volumes.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow items-center pt-2">
        {/* Left: Donut Chart */}
        <div className="flex items-center justify-center w-full">
          {isEmptyState ? (
            <div className="text-xs text-slate-500 italic">No models metrics available</div>
          ) : (
            <DonutChart data={donutData} size={90} />
          )}
        </div>

        {/* Right: Daily token usage bar chart */}
        <div className="flex flex-col justify-end w-full h-full pb-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase mb-1 self-center">Daily Token Count (M)</span>
          <BarChart data={tokenData} height={85} color="#10b981" />
        </div>
      </div>
    </Card>
  );
}

// WIDGET F: WhatsApp Performance
function renderWhatsappWidget(isEmptyState: boolean) {
  return (
    <Card className="p-6 flex flex-col gap-4 w-full h-[320px] justify-between select-none">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-white">WhatsApp Hub Gateway</span>
        <span className="text-xs text-slate-400">Monitor Meta Business APIs broadcast logs.</span>
      </div>

      {isEmptyState ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center gap-2">
          <MessageSquare className="h-8 w-8 text-slate-600" />
          <span className="text-xs font-bold text-slate-400">No Account Configured</span>
          <span className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">
            Please link a WhatsApp Business account inside settings.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-grow pt-1 overflow-y-auto">
          {/* Active number card */}
          <div className="p-3 bg-white/[0.01] border border-white/[0.06] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-white">Primary Business Account</span>
                <span className="text-[9px] text-slate-500 font-bold font-mono">+91 98765 43210</span>
              </div>
            </div>
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full select-none">
              Healthy
            </span>
          </div>

          {/* Activity Logs */}
          <div className="flex flex-col gap-2 text-left">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Broadcast Actions</span>
            
            <div className="p-2.5 bg-white/[0.01] border border-white/[0.06] rounded-xl flex justify-between items-center text-[10px]">
              <div className="flex flex-col">
                <span className="font-bold text-white truncate">June Billing Blast Campaign</span>
                <span className="text-[8px] text-slate-500 font-bold">Target count: 450 contacts</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-400 font-mono">Done (100%)</span>
            </div>

            <div className="p-2.5 bg-white/[0.01] border border-white/[0.06] rounded-xl flex justify-between items-center text-[10px]">
              <div className="flex flex-col">
                <span className="font-bold text-white truncate">Support Auto-Response Helper</span>
                <span className="text-[8px] text-slate-500 font-bold">Webhooks active</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-450 font-mono animate-pulse">Listening</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// WIDGET G: Activity Timeline
function renderTimelineWidget(isEmptyState: boolean) {
  const logs = [
    { time: "09:40 AM", title: "Cart Recovery Message Sent", desc: "Auto response delivered to arjun@example.com", type: "success" },
    { time: "09:30 AM", title: "Upcoming Calendar Scheduler Sync", desc: "Weekly CRM contacts database backup pipeline", type: "info" },
    { time: "08:15 AM", title: "API Gateway Execution Failure", desc: "OpenAI endpoint returned limits exceeded", type: "failed" },
    { time: "07:00 AM", title: "Stripe Webhook Awaiting Confirm", desc: "Waiting transaction confirmation details", type: "pending" }
  ];

  return (
    <Card className="p-6 flex flex-col gap-4 w-full h-[320px] justify-between select-none">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-white">Task History Timeline</span>
        <span className="text-xs text-slate-400">Monitor webhook operations logs.</span>
      </div>

      {isEmptyState ? (
        <div className="flex-grow flex flex-col items-center justify-center italic text-xs text-slate-500">
          No task activity logged today.
        </div>
      ) : (
        <div className="flex-grow flex flex-col gap-3 pt-2 overflow-y-auto pl-2 relative border-l border-white/[0.08] ml-1">
          {logs.map((log, idx) => (
            <div key={idx} className="relative pl-5 flex flex-col gap-0.5 text-left">
              {/* Timeline Bullet */}
              <div className={`absolute -left-[5.5px] top-1 w-2.5 h-2.5 rounded-full border border-slate-950 ${
                log.type === "success"
                  ? "bg-emerald-400"
                  : log.type === "failed"
                  ? "bg-red-400"
                  : log.type === "pending"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-teal-400"
              }`} />
              <div className="flex justify-between items-center text-[10px] leading-none">
                <span className="font-bold text-white">{log.title}</span>
                <span className="text-[8px] font-mono text-slate-500 font-bold">{log.time}</span>
              </div>
              <span className="text-[9px] text-slate-400 leading-normal truncate">{log.desc}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// WIDGET H: Recent AI Chats
function renderChatsWidget(isEmptyState: boolean, router: any) {
  const chatsList = [
    { id: "c1", title: "Optimizing React State Reducers", provider: "Claude 3.5", date: "30m ago", fav: true },
    { id: "c2", title: "Landing Page Visual Design Tokens", provider: "GPT-4o", date: "2h ago", fav: false },
    { id: "c3", title: "Marketing Campaign Copy Outline", provider: "Gemini 1.5", date: "3d ago", fav: false }
  ];

  return (
    <Card className="p-6 flex flex-col gap-4 w-full h-[320px] justify-between select-none">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-white">Recent AI Chats Workspace</span>
        <span className="text-xs text-slate-400">Resume prompt streaming histories.</span>
      </div>

      {isEmptyState ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center gap-2">
          <MessageSquare className="h-8 w-8 text-slate-650" />
          <span className="text-xs font-bold text-slate-450">No recent conversations</span>
          <span className="text-[10px] text-slate-500 max-w-[220px]">
            Start a new chat inside the AI assistant page.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-grow pt-1 overflow-y-auto">
          {chatsList.map((c) => (
            <div
              key={c.id}
              onClick={() => router.push(`/chat`)}
              className="p-2.5 bg-white/[0.01] border border-white/[0.06] hover:bg-emerald-500/5 hover:border-emerald-500/20 rounded-xl flex items-center justify-between transition-all duration-150 cursor-pointer text-[11px]"
            >
              <div className="flex items-center gap-2 max-w-[70%] text-left">
                {c.fav ? <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" /> : <MessageSquare className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                <span className="font-semibold text-white truncate">{c.title}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-slate-500 shrink-0">
                <span className="px-1.5 py-0.5 bg-slate-900 border border-white/[0.04] rounded font-bold font-mono text-[8px] text-emerald-400">{c.provider}</span>
                <span>{c.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// WIDGET I: Recent Files
function renderFilesWidget(isEmptyState: boolean, addToast: any) {
  const filesList = [
    { name: "company_logo_pic.png", type: "Image (PNG)", size: "145 KB" },
    { name: "saas_features_guide.pdf", type: "PDF Document", size: "2.4 MB" },
    { name: "draft_outline_notes.txt", type: "Plain Text", size: "4.5 KB" }
  ];

  const handleDownload = (name: string) => {
    addToast(`Simulated download for "${name}" completed successfully.`, "success");
  };

  return (
    <Card className="p-6 flex flex-col gap-4 w-full h-[320px] justify-between select-none">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-white">Knowledge Base Documents</span>
        <span className="text-xs text-slate-400">Manage indexed file vector models.</span>
      </div>

      {isEmptyState ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center gap-2">
          <FolderOpen className="h-8 w-8 text-slate-650" />
          <span className="text-xs font-bold text-slate-450">No vectors uploaded</span>
          <span className="text-[10px] text-slate-500 max-w-[200px]">
            Index raw text or PDF documents to feed AI.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-grow pt-1 overflow-y-auto">
          {filesList.map((f) => (
            <div
              key={f.name}
              onClick={() => handleDownload(f.name)}
              className="p-2.5 bg-white/[0.01] border border-white/[0.06] hover:bg-emerald-500/5 hover:border-emerald-500/20 rounded-xl flex items-center justify-between transition-all duration-150 cursor-pointer text-[11px]"
            >
              <div className="flex items-center gap-2.5 max-w-[70%] text-left">
                <FileText className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white truncate">{f.name}</span>
                  <span className="text-[8px] text-slate-500 font-bold">{f.type}</span>
                </div>
              </div>
              <span className="text-[9px] font-bold font-mono text-slate-400 shrink-0">{f.size}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// WIDGET J: Calendar Widget
function renderCalendarWidget(
  days: any[],
  month: string,
  setMonth: (m: string) => void,
  isEmptyState: boolean
) {
  return (
    <Card className="p-6 flex flex-col gap-4 w-full h-[320px] justify-between select-none">
      <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{month}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMonth(month === "June 2026" ? "May 2026" : "June 2026")}
            className="p-1 hover:bg-white/[0.04] rounded-lg cursor-pointer text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMonth(month === "June 2026" ? "July 2026" : "June 2026")}
            className="p-1 hover:bg-white/[0.04] rounded-lg cursor-pointer text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid days of week */}
      <div className="grid grid-cols-7 text-center text-[9px] font-bold text-slate-500 uppercase pt-1">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>

      {/* Grid days */}
      <div className="grid grid-cols-7 gap-1 flex-grow items-center text-[10px] font-bold">
        {days.map((d) => (
          <div
            key={d.day}
            className={`h-7 w-7 rounded-lg flex items-center justify-center relative transition-all duration-150 cursor-pointer ${
              d.hasEvent
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold hover:bg-emerald-500/20"
                : "hover:bg-white/[0.04] text-slate-400 hover:text-white"
            }`}
            title={d.events.join(", ")}
          >
            <span>{d.day}</span>
            {d.hasEvent && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-450 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// WIDGET K: Notifications Widget
function renderNotificationsWidget(
  notifications: any[],
  onDismiss: (id: string) => void
) {
  return (
    <Card className="p-6 flex flex-col gap-4 w-full h-[280px] justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-white">System Alerts & Inbox</span>
        <span className="text-xs text-slate-400">Recent transaction events and model capacity alerts.</span>
      </div>

      <div className="flex flex-col gap-2.5 flex-grow pt-2 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center italic text-xs text-slate-500 select-none">
            No system notifications active today.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 border rounded-xl flex items-start justify-between gap-3 text-left ${
                n.type === "success"
                  ? "bg-emerald-500/5 border-emerald-500/20 text-slate-200"
                  : n.type === "warning"
                  ? "bg-red-500/5 border-red-500/20 text-slate-200"
                  : "bg-white/[0.02] border-white/[0.08] text-slate-200"
              }`}
            >
              <div className="flex gap-2">
                <Bell className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${
                  n.type === "success"
                    ? "text-emerald-400"
                    : n.type === "warning"
                    ? "text-red-450 animate-bounce"
                    : "text-emerald-400"
                }`} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-white">{n.title}</span>
                  <span className="text-[10px] text-slate-400 leading-normal">{n.msg}</span>
                </div>
              </div>
              <button
                onClick={() => onDismiss(n.id)}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-lg cursor-pointer transition-colors"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
