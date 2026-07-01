"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAnalytics } from "@/store/use-analytics";
import { useToast } from "@/store/use-toast";
import {
  BarChart4,
  TrendingUp,
  Clock,
  Sparkles,
  Zap,
  Globe,
  Plus,
  Bookmark,
  Share2,
  Trash2,
  Calendar,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Users,
  Activity,
  Layers,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Mail,
  UserCheck,
  Percent,
  Check
} from "lucide-react";

export default function AnalyticsPage() {
  const { addToast } = useToast();

  // Zustand Store variables
  const {
    executiveMetrics,
    whatsAppMetrics,
    aiMetrics,
    workflowMetrics,
    crmMetrics,
    teamMetrics,
    campaignMetrics,
    customDashboardWidgets,
    savedReports,
    reportSchedules,
    isLiveAutoRefreshActive,
    addCustomWidget,
    removeCustomWidget,
    saveReport,
    scheduleReport,
    toggleLiveRefresh,
    incrementRealTimeMetrics
  } = useAnalytics();

  // Active sub-section tab: overview | whatsapp | ai | workflows | crm | team | builder | custom
  const [activeTab, setActiveTab] = useState<"overview" | "whatsapp" | "ai" | "workflows" | "crm" | "team" | "builder" | "custom">("overview");

  // Global filters
  const [selectedWorkspace, setSelectedWorkspace] = useState("all");
  const [selectedRange, setSelectedRange] = useState<"24h" | "7d" | "30d">("7d");
  const [selectedCountry, setSelectedCountry] = useState("all");

  // Modals state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleReportId, setScheduleReportId] = useState("");
  const [scheduleFreq, setScheduleFreq] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [scheduleEmailsText, setScheduleEmailsText] = useState("");

  // Report Builder Form states
  const [reportTitle, setReportTitle] = useState("");
  const [reportSelectedMetrics, setReportSelectedMetrics] = useState<string[]>([]);
  const [reportAggregation, setReportAggregation] = useState<"sum" | "avg" | "count">("sum");
  const [reportGeneratedData, setReportGeneratedData] = useState<any[] | null>(null);

  // Custom Dashboard Widgets Wizard states
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [newWidgetTitle, setNewWidgetTitle] = useState("");
  const [newWidgetType, setNewWidgetType] = useState<"line" | "bar" | "pie" | "donut" | "funnel" | "gauge">("line");
  const [newWidgetMetric, setNewWidgetMetric] = useState("revenue");
  const [newWidgetSize, setNewWidgetSize] = useState<"sm" | "md" | "lg">("sm");

  // Auto Refresh Interval Loop Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLiveAutoRefreshActive) {
      interval = setInterval(() => {
        incrementRealTimeMetrics();
      }, 2000);
      addToast("Live auto-refresh enabled", "success");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveAutoRefreshActive, incrementRealTimeMetrics]);

  // Export handlers
  const handleExport = (format: "csv" | "pdf" | "json" | "print") => {
    if (format === "print") {
      window.print();
      return;
    }
    addToast(`Exported ${activeTab} metrics in ${format.toUpperCase()} format.`, "success");
  };

  // Schedule Submit
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleEmailsText.trim()) {
      addToast("Please input invitee email addresses", "warning");
      return;
    }
    const emailsList = scheduleEmailsText.split(",").map(em => em.trim()).filter(Boolean);
    
    scheduleReport({
      reportId: scheduleReportId || `rep-${Date.now()}`,
      frequency: scheduleFreq as any,
      emails: emailsList,
      status: "active"
    });

    addToast("Email delivery schedule configured successfully!", "success");
    setShowScheduleModal(false);
    setScheduleEmailsText("");
  };

  // Custom report run
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportSelectedMetrics.length === 0) {
      addToast("Please select at least 1 metric to aggregate", "warning");
      return;
    }

    // Generate mock query aggregator results
    const mockResults = reportSelectedMetrics.map(m => {
      let aggregatedVal = 0;
      if (m === "mrr") aggregatedVal = reportAggregation === "sum" ? 21500 : 7160;
      else if (m === "whatsapp_sent") aggregatedVal = reportAggregation === "sum" ? 412500 : 137500;
      else if (m === "ai_requests") aggregatedVal = reportAggregation === "sum" ? 89400 : 29800;
      else if (m === "crm_leads") aggregatedVal = reportAggregation === "sum" ? 3410 : 1136;

      return {
        metricLabel: m.toUpperCase().replace("_", " "),
        operation: reportAggregation.toUpperCase(),
        result: aggregatedVal,
        confidence: "99.8%"
      };
    });

    setReportGeneratedData(mockResults);
    addToast("Custom report compiled successfully", "success");
  };

  // Save report configuration
  const handleSaveReportConfig = () => {
    if (!reportTitle.trim()) {
      addToast("Please enter a custom report title", "warning");
      return;
    }
    saveReport({
      title: reportTitle,
      metrics: reportSelectedMetrics,
      filters: { workspace: selectedWorkspace, range: selectedRange },
      dateRange: selectedRange
    });
    addToast("Saved report layout in repository config drawer", "success");
    setReportTitle("");
  };

  // Custom Widget Create Wizard
  const handleCreateWidget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWidgetTitle.trim()) return;

    addCustomWidget({
      title: newWidgetTitle,
      type: newWidgetType,
      metric: newWidgetMetric,
      size: newWidgetSize
    });

    addToast("Widget mounted onto custom telemetry grid canvas", "success");
    setShowAddWidgetModal(false);
    setNewWidgetTitle("");
  };

  // Toggle report metrics selection checkboxes
  const handleToggleReportMetric = (metricKey: string) => {
    setReportSelectedMetrics(prev =>
      prev.includes(metricKey) ? prev.filter(m => m !== metricKey) : [...prev, metricKey]
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-sans select-none text-left">
      
      {/* HEADER SECTION WITH GLOBAL FILTERS */}
      <div className="flex flex-col gap-4 border-b border-brand-border dark:border-border/40 pb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-brand-green/10 text-brand-green rounded-lg border border-brand-green/20">
                <BarChart4 className="h-5 w-5" />
              </span>
              <h1 className="text-xl font-extrabold text-brand-navy dark:text-foreground tracking-tight">
                Enterprise Analytics Hub
              </h1>
              {isLiveAutoRefreshActive && (
                <span className="flex items-center gap-1 text-[9px] font-bold bg-brand-green/10 text-brand-green border border-brand-green/20 px-2 py-0.5 rounded-full uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
                  Live Syncing
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant dark:text-zinc-400">
              Correlate database logs, WhatsApp campaign rates, workflow execution heatmaps, and AI agent token costs.
            </p>
          </div>

          {/* Export tools */}
          <div className="flex items-center gap-2 select-none self-start md:self-auto">
            <Button
              variant="outline"
              size="xs"
              onClick={() => toggleLiveRefresh(!isLiveAutoRefreshActive)}
              leftIcon={<RefreshCw className={`h-3 w-3 ${isLiveAutoRefreshActive ? "animate-spin text-brand-green" : ""}`} />}
            >
              {isLiveAutoRefreshActive ? "Stop Live" : "Live Auto Refresh"}
            </Button>
            
            <select
              onChange={(e) => handleExport(e.target.value as any)}
              defaultValue=""
              className="h-8 px-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-[10px] font-bold text-foreground cursor-pointer focus:outline-none"
            >
              <option value="" disabled>📥 Export Dataset</option>
              <option value="csv">Export CSV Sheet</option>
              <option value="pdf">Export PDF Dashboard</option>
              <option value="json">Export JSON Config</option>
              <option value="print">Print view</option>
            </select>

            <Button
              variant="success"
              size="xs"
              onClick={() => setShowScheduleModal(true)}
              leftIcon={<Mail className="h-3.5 w-3.5" />}
            >
              Schedule Report
            </Button>
          </div>
        </div>

        {/* Global filtering bar */}
        <div className="flex flex-wrap items-center gap-4 bg-brand-slate/40 dark:bg-zinc-900/40 border border-brand-border dark:border-border/30 p-3 rounded-xl select-none mt-1">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase">Global Filters:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Workspace:</span>
            <select
              value={selectedWorkspace}
              onChange={(e) => {
                setSelectedWorkspace(e.target.value);
                addToast("Applied workspace context filter", "info");
              }}
              className="h-7 px-2 border border-brand-border dark:border-border/40 rounded text-[9px] font-bold bg-white dark:bg-zinc-950 text-foreground cursor-pointer outline-none"
            >
              <option value="all">All Workspaces</option>
              <option value="marketing">Marketing Hub</option>
              <option value="support">Customer Support Space</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Range:</span>
            <select
              value={selectedRange}
              onChange={(e) => {
                setSelectedRange(e.target.value as any);
                addToast(`Period adjusted to last ${e.target.value}`, "info");
              }}
              className="h-7 px-2 border border-brand-border dark:border-border/40 rounded text-[9px] font-bold bg-white dark:bg-zinc-950 text-foreground cursor-pointer outline-none"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Country:</span>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                addToast("Regional filter loaded", "info");
              }}
              className="h-7 px-2 border border-brand-border dark:border-border/40 rounded text-[9px] font-bold bg-white dark:bg-zinc-950 text-foreground cursor-pointer outline-none"
            >
              <option value="all">Global (All Countries)</option>
              <option value="in">India (+91)</option>
              <option value="us">United States (+1)</option>
              <option value="uk">United Kingdom (+44)</option>
            </select>
          </div>
        </div>
      </div>

      {/* METRIC SUB-SECTIONS TABS ROW */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-brand-border dark:border-border/30 pb-1 shrink-0 select-none">
        {[
          { id: "overview", label: "Executive Overview", icon: Layers },
          { id: "whatsapp", label: "WhatsApp Channels", icon: Activity },
          { id: "ai", label: "AI Agent Performance", icon: Sparkles },
          { id: "workflows", label: "Workflows", icon: Zap },
          { id: "crm", label: "CRM Contacts", icon: Users },
          { id: "team", label: "Team Productivity", icon: UserCheck },
          { id: "builder", label: "Report Builder", icon: SlidersHorizontal },
          { id: "custom", label: "Custom Canvas", icon: Bookmark }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold text-xs transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* RENDER VIEW TAB 1: EXECUTIVE DASHBOARD */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          
          {/* Executive Stats Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            <Card className="p-5 flex flex-col gap-2 text-left bg-card">
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider">Total MRR</span>
              <span className="text-3xl font-extrabold text-foreground font-mono">
                ${executiveMetrics.mrr.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[9px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full self-start flex items-center gap-0.5 mt-1">
                <TrendingUp className="h-3 w-3" />
                +{executiveMetrics.growthPct}% MoM
              </span>
            </Card>

            <Card className="p-5 flex flex-col gap-2 text-left bg-card">
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider">Estimated ARR</span>
              <span className="text-3xl font-extrabold text-foreground font-mono">
                ${executiveMetrics.arr.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[9px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full self-start flex items-center gap-0.5 mt-1">
                Annual forecast LTV
              </span>
            </Card>

            <Card className="p-5 flex flex-col gap-2 text-left bg-card">
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider">Active users</span>
              <span className="text-3xl font-extrabold text-foreground font-mono">
                {executiveMetrics.activeUsers.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground bg-brand-slate dark:bg-zinc-800 border dark:border-border px-2 py-0.5 rounded-full self-start mt-1">
                LTV retention: {executiveMetrics.retentionPct}%
              </span>
            </Card>

            <Card className="p-5 flex flex-col gap-2 text-left bg-card">
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider">Total API calls</span>
              <span className="text-3xl font-extrabold text-foreground font-mono">
                {executiveMetrics.apiCalls.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full self-start flex items-center gap-0.5 mt-1">
                Storage: {executiveMetrics.storageGb} GB
              </span>
            </Card>
          </div>

          {/* Area Chart: Customer Growth LTV trend */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 lg:col-span-2 flex flex-col gap-4 text-left">
              <div className="border-b border-brand-border dark:border-border/30 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Total Customer Growth Trend</h3>
                  <span className="text-[10px] text-muted-foreground">Historical view of registered workspace audience contacts.</span>
                </div>
                <span className="text-xs font-bold text-brand-green font-mono">+{executiveMetrics.growthPct}%</span>
              </div>

              {/* SVG Area Chart drawing coordinates */}
              <div className="w-full h-56 flex flex-col justify-between mt-2 select-none relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-12">
                  <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 text-[9px] text-muted-foreground/40 pt-1 text-right">15,000</div>
                  <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 text-[9px] text-muted-foreground/40 pt-1 text-right">13,000</div>
                  <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 text-[9px] text-muted-foreground/40 pt-1 text-right">11,000</div>
                </div>

                {/* SVG Curve drawing */}
                <div className="flex-1 w-full relative z-10">
                  <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#25D366" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#25D366" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* SVG Area path */}
                    <path
                      d="M 50 130 C 130 110, 200 90, 280 80 C 360 65, 450 50, 550 25 L 550 160 L 50 160 Z"
                      fill="url(#gradient-area)"
                    />
                    {/* SVG Line path */}
                    <path
                      d="M 50 130 C 130 110, 200 90, 280 80 C 360 65, 450 50, 550 25"
                      fill="none"
                      stroke="#25D366"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Data Points */}
                    <circle cx="50" cy="130" r="4.5" fill="#25D366" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="280" cy="80" r="4.5" fill="#25D366" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="550" cy="25" r="4.5" fill="#25D366" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* Axis Labels */}
                <div className="flex items-center justify-between text-[9px] text-muted-foreground px-4 pt-1 z-20 border-t border-brand-border/40">
                  {crmMetrics.customerGrowthHistory.map(hist => (
                    <span key={hist.date} className="font-bold">{hist.date}</span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Credit Optimization recommendation widget */}
            <Card aiGlow className="p-6 text-left flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <span className="p-1 bg-brand-sky-light/40 border border-brand-sky/20 rounded-lg self-start text-brand-sky">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </span>
                <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground mt-2">Executive AI Insights</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  We noticed your Shopify campaigns generate an average 50% reply response rate, but support workflows report high latency during peak hours (11:00 AM - 2:00 PM IST). 
                </p>
                
                <div className="bg-brand-slate/40 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-brand-border/60 dark:border-border/20 text-[9px] text-muted-foreground leading-normal mt-1">
                  💡 Recommendation: Schedule broadcast queues to fire in batches starting at 9:30 AM to lower API threshold latency spikes.
                </div>
              </div>

              <div className="bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-xl p-3 text-center text-xs mt-4">
                <span className="block font-bold">LTV Conversion Increase</span>
                <span className="text-lg font-extrabold font-mono mt-0.5">+4.8%</span>
              </div>
            </Card>
          </div>

        </div>
      )}

      {/* RENDER VIEW TAB 2: WHATSAPP ANALYTICS */}
      {activeTab === "whatsapp" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-left">
          
          {/* WhatsApp metrics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 select-none">
            <Card className="p-4 flex flex-col gap-1 text-left bg-card">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Messages Sent</span>
              <span className="text-xl font-extrabold text-foreground font-mono">{whatsAppMetrics.sent.toLocaleString()}</span>
            </Card>
            <Card className="p-4 flex flex-col gap-1 text-left bg-card">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Delivered</span>
              <span className="text-xl font-extrabold text-foreground font-mono">{whatsAppMetrics.delivered.toLocaleString()}</span>
            </Card>
            <Card className="p-4 flex flex-col gap-1 text-left bg-card">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Read Count</span>
              <span className="text-xl font-extrabold text-foreground font-mono">{whatsAppMetrics.read.toLocaleString()}</span>
            </Card>
            <Card className="p-4 flex flex-col gap-1 text-left bg-card">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Replied (Avg)</span>
              <span className="text-xl font-extrabold text-foreground font-mono">{whatsAppMetrics.replied.toLocaleString()}</span>
            </Card>
            <Card className="p-4 flex flex-col gap-1 text-left bg-card">
              <span className="text-[9px] font-bold text-red-500 uppercase">Failed Runs</span>
              <span className="text-xl font-extrabold text-red-500 font-mono">{whatsAppMetrics.failed}</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* WhatsApp Funnel Chart widget */}
            <Card className="col-span-12 lg:col-span-6 p-6 flex flex-col gap-4 text-left">
              <div className="border-b border-brand-border dark:border-border/30 pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Conversation Conversion Funnel</h3>
                <span className="text-[10px] text-muted-foreground">Percentage drops from message dispatch to reply confirmation.</span>
              </div>

              {/* Visual Funnel Blocks */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-zinc-400 w-16">Sent</span>
                  <div className="flex-1 bg-brand-navy h-6 rounded-md mx-4 relative flex items-center pl-3">
                    <span className="text-white font-mono font-bold text-[9px]">412.5k (100%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-zinc-400 w-16">Delivered</span>
                  <div className="flex-1 bg-[#25D366] h-6 rounded-md mx-4 relative flex items-center pl-3" style={{ maxWidth: "99.5%" }}>
                    <span className="text-white font-mono font-bold text-[9px]">410.4k (99.5%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-zinc-400 w-16">Read</span>
                  <div className="flex-1 bg-brand-sky h-6 rounded-md mx-4 relative flex items-center pl-3" style={{ maxWidth: "79.9%" }}>
                    <span className="text-white font-mono font-bold text-[9px]">328k (79.9%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-zinc-400 w-16">Replied</span>
                  <div className="flex-1 bg-amber-500 h-6 rounded-md mx-4 relative flex items-center pl-3" style={{ maxWidth: "39.8%" }}>
                    <span className="text-white font-mono font-bold text-[9px]">164k (39.8%)</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* HEATMAP CALENDAR MATRIX */}
            <Card className="col-span-12 lg:col-span-6 p-6 flex flex-col gap-4 text-left">
              <div className="border-b border-brand-border dark:border-border/30 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Peak Hours Execution Heatmap</h3>
                  <span className="text-[10px] text-muted-foreground">Workflow execution intensity across days and hours.</span>
                </div>
                <span className="text-[9px] font-bold text-muted-foreground">Hour: 0 - 23</span>
              </div>

              {/* Heatmap Grid canvas */}
              <div className="flex flex-col gap-1 mt-2 overflow-x-auto pr-1">
                {workflowMetrics.heatmapData.map((row, dayIdx) => {
                  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                  return (
                    <div key={dayIdx} className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] font-bold text-muted-foreground w-8 text-left uppercase select-none shrink-0">
                        {days[dayIdx]}
                      </span>
                      <div className="flex items-center gap-1 flex-grow">
                        {row.map((val, hrIdx) => {
                          // Select opacity based on volume
                          let fillClass = "bg-zinc-150 dark:bg-zinc-900";
                          if (val > 60) fillClass = "bg-[#25D366]";
                          else if (val > 30) fillClass = "bg-[#25D366]/60";
                          else if (val > 10) fillClass = "bg-[#25D366]/20";

                          return (
                            <div
                              key={hrIdx}
                              className={`h-4.5 w-4.5 rounded-xs transition-all cursor-pointer hover:ring-1 hover:ring-foreground ${fillClass}`}
                              title={`${days[dayIdx]} at ${hrIdx}:00 - ${val} runs`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

          </div>

        </div>
      )}

      {/* RENDER VIEW TAB 3: AI PERFORMANCE */}
      {activeTab === "ai" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-left">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            <Card className="p-5 flex flex-col gap-2 text-left bg-card">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">AI Requests</span>
              <span className="text-2xl font-extrabold text-foreground font-mono">{aiMetrics.totalRequests.toLocaleString()}</span>
            </Card>
            <Card className="p-5 flex flex-col gap-2 text-left bg-card">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Avg Response Time</span>
              <span className="text-2xl font-extrabold text-foreground font-mono">{aiMetrics.avgResponseTimeSec}s</span>
            </Card>
            <Card className="p-5 flex flex-col gap-2 text-left bg-card">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Average Tokens</span>
              <span className="text-2xl font-extrabold text-foreground font-mono">{aiMetrics.avgTokensPerRequest} tokens</span>
            </Card>
            <Card className="p-5 flex flex-col gap-2 text-left bg-card">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">AI Accuracy Index</span>
              <span className="text-2xl font-extrabold text-foreground font-mono">96.8%</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Model Comparison Matrix Table */}
            <Card className="col-span-12 lg:col-span-8 p-6 text-left">
              <div className="border-b border-brand-border dark:border-border/30 pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">AI LLM Model Allocation Metrics</h3>
                <span className="text-[10px] text-muted-foreground">Detailed telemetry breakdown across registered model instances.</span>
              </div>

              <div className="overflow-x-auto mt-4 select-none">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border dark:border-border/30 text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                      <th className="py-2.5 px-4">Model Name</th>
                      <th className="py-2.5 px-4 font-mono">Total Requests</th>
                      <th className="py-2.5 px-4 font-mono">Total Tokens</th>
                      <th className="py-2.5 px-4">Cost (Est.)</th>
                      <th className="py-2.5 px-4">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border dark:divide-border/20 text-brand-navy dark:text-zinc-300">
                    {aiMetrics.modelSplits.map(model => (
                      <tr key={model.modelName} className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                        <td className="py-3 px-4 font-semibold text-brand-navy dark:text-foreground">
                          {model.provider} ({model.modelName})
                        </td>
                        <td className="py-3 px-4 font-mono text-muted-foreground">{model.requestsCount.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono text-muted-foreground">{(model.totalTokens / 1000000).toFixed(1)}M</td>
                        <td className="py-3 px-4 font-mono font-bold text-brand-navy dark:text-zinc-200">${model.costEstimate.toFixed(2)}</td>
                        <td className="py-3 px-4 font-bold text-brand-green">{model.accuracyPct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Custom Pie/Donut Chart for Models Split */}
            <Card className="col-span-12 lg:col-span-4 p-6 text-left flex flex-col gap-4">
              <div className="border-b border-brand-border dark:border-border/30 pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Model Split Distribution</h3>
                <span className="text-[10px] text-muted-foreground">Ratio of total API query requests per provider.</span>
              </div>

              {/* SVG Donut Chart */}
              <div className="flex flex-col items-center justify-center py-4 relative select-none">
                <svg className="w-36 h-36" viewBox="0 0 36 36">
                  {/* Background track circle */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="rgba(150,150,150,0.1)" strokeWidth="3" />
                  
                  {/* GPT-4o-mini (58%): stroke-dasharray="58 42", stroke-dashoffset="25" */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#0F172A"
                    strokeWidth="3.2"
                    strokeDasharray="58 42"
                    strokeDashoffset="25"
                  />
                  {/* Claude (25%): stroke-dasharray="25 75", stroke-dashoffset="67" */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#3B82F6"
                    strokeWidth="3.2"
                    strokeDasharray="25 75"
                    strokeDashoffset="-33"
                  />
                  {/* Gemini (17%): stroke-dasharray="17 83", stroke-dashoffset="92" */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#25D366"
                    strokeWidth="3.2"
                    strokeDasharray="17 83"
                    strokeDashoffset="-58"
                  />
                </svg>

                {/* Legend list indicators */}
                <div className="flex flex-col gap-2 mt-4 text-[10px] w-full border-t border-brand-border/40 dark:border-border/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-navy" />OpenAI GPTs</span>
                    <span className="font-mono font-bold">58%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-sky" />Claude Projects</span>
                    <span className="font-mono font-bold">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-green" />Gemini Models</span>
                    <span className="font-mono font-bold">17%</span>
                  </div>
                </div>
              </div>
            </Card>

          </div>

        </div>
      )}

      {/* RENDER VIEW TAB 4: AUTOMATION WORKFLOWS */}
      {activeTab === "workflows" && (
        <Card className="p-6 text-left animate-fadeIn">
          <div className="border-b border-brand-border dark:border-border/30 pb-3 flex items-center justify-between select-none">
            <div>
              <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Workflow Execution Hub Statistics</h3>
              <span className="text-[10px] text-muted-foreground">Performance of active webhook nodes and logic triggers.</span>
            </div>
            <span className="text-xs font-bold text-brand-green font-mono">Total Runs: {workflowMetrics.totalRuns.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 select-none">
            <div className="p-3 border border-brand-border dark:border-border/30 rounded-xl flex flex-col bg-zinc-900/5 dark:bg-zinc-900/10">
              <span className="text-[9px] text-muted-foreground uppercase font-bold">Success Rate</span>
              <span className="text-lg font-mono font-extrabold text-brand-green">{workflowMetrics.successRate}%</span>
            </div>
            <div className="p-3 border border-brand-border dark:border-border/30 rounded-xl flex flex-col bg-zinc-900/5 dark:bg-zinc-900/10">
              <span className="text-[9px] text-muted-foreground uppercase font-bold">Failed runs</span>
              <span className="text-lg font-mono font-extrabold text-red-500">{workflowMetrics.failedRuns} runs</span>
            </div>
            <div className="p-3 border border-brand-border dark:border-border/30 rounded-xl flex flex-col bg-zinc-900/5 dark:bg-zinc-900/10">
              <span className="text-[9px] text-muted-foreground uppercase font-bold">Avg Duration</span>
              <span className="text-lg font-mono font-extrabold text-foreground">{workflowMetrics.avgDurationSec}s</span>
            </div>
            <div className="p-3 border border-brand-border dark:border-border/30 rounded-xl flex flex-col bg-zinc-900/5 dark:bg-zinc-900/10">
              <span className="text-[9px] text-muted-foreground uppercase font-bold">Avg Queue Delay</span>
              <span className="text-lg font-mono font-extrabold text-foreground">{workflowMetrics.avgQueueTimeSec}s</span>
            </div>
          </div>

          <div className="overflow-x-auto select-none">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border dark:border-border/30 text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                  <th className="py-2.5 px-4">Workflow Name</th>
                  <th className="py-2.5 px-4 font-mono">Runs Count</th>
                  <th className="py-2.5 px-4">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border dark:divide-border/20 text-brand-navy dark:text-zinc-300">
                {workflowMetrics.topWorkflows.map(wf => (
                  <tr key={wf.name} className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-semibold text-brand-navy dark:text-foreground">{wf.name}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{wf.runsCount.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-brand-green">{wf.successRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* RENDER VIEW TAB 5: CRM CONTACTS */}
      {activeTab === "crm" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none text-left">
            <Card className="p-5 flex flex-col gap-2 bg-card">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">New Contacts added</span>
              <span className="text-2xl font-extrabold text-foreground font-mono">{crmMetrics.newContacts.toLocaleString()}</span>
            </Card>
            <Card className="p-5 flex flex-col gap-2 bg-card">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Returning Contacts</span>
              <span className="text-2xl font-extrabold text-foreground font-mono">{crmMetrics.returningContacts.toLocaleString()}</span>
            </Card>
            <Card className="p-5 flex flex-col gap-2 bg-card">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Top segment tag</span>
              <span className="text-xs font-extrabold text-brand-sky mt-1 select-none">
                #{crmMetrics.topTags[0].name} ({crmMetrics.topTags[0].count} leads)
              </span>
            </Card>
            <Card className="p-5 flex flex-col gap-2 bg-card">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Top Segment label</span>
              <span className="text-xs font-extrabold text-[#25D366] mt-1 select-none">
                {crmMetrics.topLabels[0].name} ({crmMetrics.topLabels[0].count} leads)
              </span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
            
            {/* CRM Lead Sources breakdown table */}
            <Card className="col-span-12 lg:col-span-8 p-6">
              <div className="border-b border-brand-border dark:border-border/30 pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Lead Capture Channels</h3>
                <span className="text-[10px] text-muted-foreground">Volume and estimated revenue LTV synchronized from lead channels.</span>
              </div>

              <div className="overflow-x-auto mt-4 select-none">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border dark:border-border/30 text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                      <th className="py-2.5 px-4">Channel Source</th>
                      <th className="py-2.5 px-4 font-mono">Contacts Count</th>
                      <th className="py-2.5 px-4">Revenue LTV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border dark:divide-border/20 text-brand-navy dark:text-zinc-300">
                    {crmMetrics.leadSources.map(source => (
                      <tr key={source.source} className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                        <td className="py-3 px-4 font-semibold text-brand-navy dark:text-foreground">{source.source}</td>
                        <td className="py-3 px-4 font-mono text-muted-foreground">{source.count.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono font-bold text-brand-green">${source.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Tag/Label Cloud widgets */}
            <Card className="col-span-12 lg:col-span-4 p-6 flex flex-col gap-4 text-left">
              <div className="border-b border-brand-border dark:border-border/30 pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">CRM Metadata Tag Cloud</h3>
                <span className="text-[10px] text-muted-foreground">Most active metadata values assigned in CRM.</span>
              </div>

              <div className="flex flex-col gap-3 mt-1 select-none">
                <div className="flex flex-wrap gap-1.5">
                  {crmMetrics.topTags.map(t => (
                    <span
                      key={t.name}
                      className="px-2.5 py-1 text-[10px] font-bold bg-brand-sky-light/10 text-brand-sky border border-brand-sky/20 rounded-lg"
                    >
                      #{t.name} ({t.count})
                    </span>
                  ))}
                  {crmMetrics.topLabels.map(l => (
                    <span
                      key={l.name}
                      className="px-2.5 py-1 text-[10px] font-bold bg-brand-green/5 text-brand-green border border-brand-green/20 rounded-lg"
                    >
                      {l.name} ({l.count})
                    </span>
                  ))}
                </div>
              </div>
            </Card>

          </div>

        </div>
      )}

      {/* RENDER VIEW TAB 6: TEAM PRODUCTIVITY */}
      {activeTab === "team" && (
        <Card className="p-6 text-left animate-fadeIn">
          <div className="border-b border-brand-border dark:border-border/30 pb-3">
            <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Omnichannel Agent Leaderboard</h3>
            <span className="text-[10px] text-muted-foreground">Weekly productivity audit of resolved WhatsApp conversation queues.</span>
          </div>

          <div className="overflow-x-auto mt-4 select-none">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border dark:border-border/30 text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                  <th className="py-2.5 px-4">Agent Name</th>
                  <th className="py-2.5 px-4 font-mono">Resolved Chats</th>
                  <th className="py-2.5 px-4 font-mono">Pending Tickets</th>
                  <th className="py-2.5 px-4">Avg Speed</th>
                  <th className="py-2.5 px-4">CSAT Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border dark:divide-border/20 text-brand-navy dark:text-zinc-300">
                {teamMetrics.leaderboard.map(agent => (
                  <tr key={agent.agentName} className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-semibold text-brand-navy dark:text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 text-white text-[10px] font-bold flex items-center justify-center">
                        {agent.agentName.charAt(0)}
                      </div>
                      {agent.agentName}
                    </td>
                    <td className="py-3 px-4 font-mono text-brand-green font-bold">{agent.resolvedCount}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{agent.pendingCount}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{agent.avgResponseTimeSec}s</td>
                    <td className="py-3 px-4 font-bold text-amber-500">★ {agent.satisfactionScore} / 5.0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* RENDER VIEW TAB 7: REPORT BUILDER */}
      {activeTab === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn text-left">
          
          {/* Form Composer */}
          <Card className="lg:col-span-4 p-6 flex flex-col gap-4">
            <div className="border-b border-brand-border dark:border-border/30 pb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-brand-green" />
              <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Custom Query Composer</h3>
            </div>

            <form onSubmit={handleGenerateReport} className="flex flex-col gap-4">
              <Input
                label="Custom Report Name"
                placeholder="e.g. Campaign CTR Audit"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                required
              />

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-brand-navy select-none">Select Focus Metrics</label>
                <div className="flex flex-col gap-2 select-none text-xs">
                  {[
                    { key: "mrr", label: "Financial Total MRR" },
                    { key: "whatsapp_sent", label: "WhatsApp Messages Sent" },
                    { key: "ai_requests", label: "AI Copilot Requests count" },
                    { key: "crm_leads", label: "CRM Lead Conversions" }
                  ].map(m => (
                    <label key={m.key} className="flex items-center gap-2 cursor-pointer font-medium text-brand-navy dark:text-zinc-300">
                      <input
                        type="checkbox"
                        checked={reportSelectedMetrics.includes(m.key)}
                        onChange={() => handleToggleReportMetric(m.key)}
                        className="rounded border-gray-300"
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 select-none">
                <label className="text-xs font-semibold text-brand-navy select-none">Aggregation Operator</label>
                <select
                  value={reportAggregation}
                  onChange={(e) => setReportAggregation(e.target.value as any)}
                  className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="sum">SUM (Total Aggregate)</option>
                  <option value="avg">AVERAGE (Mean Output)</option>
                  <option value="count">COUNT (Rows Instances)</option>
                </select>
              </div>

              <Button variant="primary" size="sm" type="submit">
                Compile Custom Report
              </Button>
            </form>
          </Card>

          {/* Table Results */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Generated results grid */}
            {reportGeneratedData ? (
              <Card className="p-6 flex flex-col gap-4">
                <div className="border-b border-brand-border dark:border-border/30 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Compiled Custom Report Table</h3>
                  <Button variant="outline" size="xs" onClick={handleSaveReportConfig}>
                    Save Config Structure
                  </Button>
                </div>

                <div className="overflow-x-auto select-none">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-brand-border dark:border-border/30 text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                        <th className="py-2.5 px-4">Metric Segment</th>
                        <th className="py-2.5 px-4 font-mono">Agg Operator</th>
                        <th className="py-2.5 px-4">Result Value</th>
                        <th className="py-2.5 px-4">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border dark:divide-border/20 text-brand-navy dark:text-zinc-300">
                      {reportGeneratedData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                          <td className="py-3 px-4 font-semibold">{row.metricLabel}</td>
                          <td className="py-3 px-4 font-mono text-muted-foreground">{row.operation}</td>
                          <td className="py-3 px-4 font-mono font-bold text-brand-green">{row.result.toLocaleString()}</td>
                          <td className="py-3 px-4 text-muted-foreground font-semibold">{row.confidence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center text-xs text-muted-foreground select-none italic">
                Choose parameters on the left and click compile to compose reports.
              </Card>
            )}

            {/* Saved layout list templates */}
            <Card className="p-6 text-left flex flex-col gap-3">
              <span className="text-[9px] font-bold text-zinc-400 uppercase select-none pb-2 border-b border-brand-border dark:border-border/30">
                Saved Custom Reports Configs
              </span>

              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {savedReports.map(rep => (
                  <div
                    key={rep.id}
                    className="border border-brand-border/60 dark:border-border/20 rounded-xl p-3 hover:border-brand-navy transition-all flex justify-between items-center"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground">{rep.title}</span>
                      <span className="text-[8px] text-muted-foreground font-semibold uppercase">
                        Metrics: {rep.metrics.join(", ")} • Range: {rep.dateRange}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setReportSelectedMetrics(rep.metrics);
                        setReportTitle(rep.title);
                        addToast("Loaded report config parameters", "info");
                      }}
                    >
                      Configure Layout
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

          </div>

        </div>
      )}

      {/* RENDER VIEW TAB 8: CUSTOM DASHBOARDS CANVAS */}
      {activeTab === "custom" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-left">
          
          <div className="flex items-center justify-between border-b border-brand-border dark:border-border/30 pb-3 select-none">
            <div>
              <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Custom Widgets Canvas Grid</h3>
              <span className="text-[10px] text-muted-foreground">Add, remove, and resize visual gauges to audit key variables.</span>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setShowAddWidgetModal(true)}
              leftIcon={<Plus className="h-3.5 w-3.5 text-brand-green" />}
            >
              Add Widget Card
            </Button>
          </div>

          {/* Customizable Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {customDashboardWidgets.map((wid) => {
              
              // Determine size classes
              let colSpan = "col-span-1";
              if (wid.size === "md") colSpan = "md:col-span-2 col-span-1";
              if (wid.size === "lg") colSpan = "md:col-span-3 col-span-1";

              return (
                <Card key={wid.id} className={`p-6 flex flex-col justify-between relative ${colSpan}`}>
                  
                  {/* Delete widget command button */}
                  <button
                    onClick={() => {
                      removeCustomWidget(wid.id);
                      addToast("Widget card removed", "warning");
                    }}
                    className="absolute top-4 right-4 p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 text-muted-foreground hover:text-red-500 rounded transition-colors cursor-pointer select-none"
                    title="Delete widget card"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex flex-col gap-1 border-b border-brand-border/40 dark:border-border/10 pb-3 text-left">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">{wid.type} Widget ({wid.size})</span>
                    <h4 className="text-xs font-extrabold text-brand-navy dark:text-foreground mt-0.5">{wid.title}</h4>
                  </div>

                  {/* Draw mock gauges or bar vectors based on type */}
                  <div className="flex-1 min-h-[140px] flex items-center justify-center py-4 select-none relative">
                    
                    {/* TYPE 1: DONUT / PIE */}
                    {wid.type === "donut" && (
                      <svg className="w-24 h-24" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="rgba(150,150,150,0.1)" strokeWidth="3" />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="transparent"
                          stroke="#25D366"
                          strokeWidth="3.2"
                          strokeDasharray="79.9 20.1"
                          strokeDashoffset="25"
                        />
                      </svg>
                    )}

                    {/* TYPE 2: GAUGE */}
                    {wid.type === "gauge" && (
                      <div className="flex flex-col items-center">
                        <svg className="w-28 h-16" viewBox="0 0 36 18">
                          {/* Arc track */}
                          <path d="M 3 18 A 15 15 0 0 1 33 18" fill="none" stroke="rgba(150,150,150,0.1)" strokeWidth="3" strokeLinecap="round" />
                          {/* Arc fill */}
                          <path
                            d="M 3 18 A 15 15 0 0 1 33 18"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeDasharray="47 47" // 50% fill
                            strokeDashoffset="47"
                          />
                        </svg>
                        <span className="text-xs font-mono font-bold text-brand-navy dark:text-zinc-200 mt-1">96.8% Efficiency</span>
                      </div>
                    )}

                    {/* TYPE 3: LINE / AREA */}
                    {wid.type === "line" && (
                      <svg className="w-full h-24" viewBox="0 0 300 80" preserveAspectRatio="none">
                        <path
                          d="M 10 70 C 80 60, 140 40, 220 30 C 260 25, 280 20, 290 10"
                          fill="none"
                          stroke="#25D366"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="290" cy="10" r="4.5" fill="#25D366" stroke="#fff" strokeWidth="1.5" />
                      </svg>
                    )}

                    {/* TYPE 4: BAR */}
                    {wid.type === "bar" && (
                      <div className="flex items-end justify-around w-full h-24 px-4 border-b border-brand-border/40">
                        <div className="w-4 bg-brand-navy h-12 rounded-t-sm" />
                        <div className="w-4 bg-brand-navy h-16 rounded-t-sm" />
                        <div className="w-4 bg-brand-green h-20 rounded-t-sm" />
                        <div className="w-4 bg-brand-navy h-10 rounded-t-sm" />
                      </div>
                    )}

                  </div>

                  <div className="text-[8px] font-mono text-zinc-500 text-center border-t border-brand-border/40 dark:border-border/10 pt-2 select-none">
                    Status: Mounted & Syncing • Type: {wid.metric.toUpperCase()}
                  </div>

                </Card>
              );
            })}

          </div>

        </div>
      )}

      {/* MODAL A: EMAIL REPORT SCHEDULER */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-left select-none">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-4 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-brand-border dark:border-border/30 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4.5 w-4.5 text-brand-green" />
                <h3 className="text-xs font-extrabold text-brand-navy dark:text-foreground uppercase tracking-wide">
                  Schedule Email Dispatch Reports
                </h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-muted-foreground hover:text-brand-navy dark:hover:text-foreground text-xs cursor-pointer font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5 select-none">
                <label className="text-xs font-semibold text-brand-navy select-none">Select Report configuration</label>
                <select
                  value={scheduleReportId}
                  onChange={(e) => setScheduleReportId(e.target.value)}
                  className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="">Executive Overview Metrics Summary</option>
                  {savedReports.map(rep => (
                    <option key={rep.id} value={rep.id}>{rep.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 select-none">
                <label className="text-xs font-semibold text-brand-navy select-none">Dispatch Frequency</label>
                <select
                  value={scheduleFreq}
                  onChange={(e) => setScheduleFreq(e.target.value as any)}
                  className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="daily">Daily report email (9:00 AM)</option>
                  <option value="weekly">Weekly digest email (Monday AM)</option>
                  <option value="monthly">Monthly summary email (1st of month)</option>
                </select>
              </div>

              <Input
                label="Invitee Destination Emails"
                placeholder="e.g. boss@expendmore.ai, team@expendmore.ai"
                value={scheduleEmailsText}
                onChange={(e) => setScheduleEmailsText(e.target.value)}
                required
                helperText="Comma separated email addresses."
              />

              <div className="flex items-center justify-end gap-2 border-t border-brand-border dark:border-border/30 pt-3 select-none">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Confirm Schedule
                </Button>
              </div>

            </form>
          </Card>
        </div>
      )}

      {/* MODAL B: ADD CANVAS WIDGET */}
      {showAddWidgetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-left select-none">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-4 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-brand-border dark:border-border/30 pb-3">
              <div className="flex items-center gap-1.5">
                <Plus className="h-4.5 w-4.5 text-brand-green" />
                <h3 className="text-xs font-extrabold text-brand-navy dark:text-foreground uppercase tracking-wide">
                  Add Custom Telemetry Widget
                </h3>
              </div>
              <button
                onClick={() => setShowAddWidgetModal(false)}
                className="text-muted-foreground hover:text-brand-navy dark:hover:text-foreground text-xs cursor-pointer font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateWidget} className="flex flex-col gap-4">
              
              <Input
                label="Widget Title"
                placeholder="e.g. Daily Active Chats"
                value={newWidgetTitle}
                onChange={(e) => setNewWidgetTitle(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5 select-none">
                <label className="text-xs font-semibold text-brand-navy select-none">Chart Presentation Type</label>
                <select
                  value={newWidgetType}
                  onChange={(e) => setNewWidgetType(e.target.value as any)}
                  className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="line">Line Area Vector</option>
                  <option value="bar">Vertical Bar Chart</option>
                  <option value="donut">Ratio Donut Segment</option>
                  <option value="gauge">Semicircle Speedometer Gauge</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 select-none">
                <label className="text-xs font-semibold text-brand-navy select-none">Metric Focus Value</label>
                <select
                  value={newWidgetMetric}
                  onChange={(e) => setNewWidgetMetric(e.target.value)}
                  className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="revenue">Financial Revenue MRR</option>
                  <option value="whatsapp_read">WhatsApp Read Rate %</option>
                  <option value="workflow_success">Workflow Success Rate %</option>
                  <option value="ai_requests">Total AI prompt count</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 select-none">
                <label className="text-xs font-semibold text-brand-navy select-none">Widget Width Dimensions</label>
                <select
                  value={newWidgetSize}
                  onChange={(e) => setNewWidgetSize(e.target.value as any)}
                  className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="sm">Small Card (1 Grid column)</option>
                  <option value="md">Medium Card (2 Grid columns)</option>
                  <option value="lg">Large Card (3 Grid columns / Full-width)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-brand-border dark:border-border/30 pt-3 select-none">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowAddWidgetModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Mount Widget
                </Button>
              </div>

            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
