"use client";

import React, { useState, useMemo } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { useDashboard } from "@/store/use-dashboard";
import { useCampaigns } from "@/store/use-campaigns";
import { useContacts } from "@/store/use-contacts";
import { Campaign, CampaignTemplate, MediaAsset, CampaignStatus, CampaignLog, CampaignCategory } from "@/types/campaigns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
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
  FileDown,
  Info
} from "lucide-react";

export default function CampaignsPage() {
  const { addToast } = useToast();
  
  // Stores
  const {
    campaigns,
    templates,
    mediaAssets,
    selectedCampaignId,
    setSelectedCampaignId,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    addMediaAsset,
    deleteMediaAsset,
    addTemplate
  } = useCampaigns();

  const { segments } = useContacts();

  // Navigation tab: dashboard | directory | templates | media | scheduler
  const [activeTab, setActiveTab] = useState<"dashboard" | "directory" | "templates" | "media" | "scheduler">("dashboard");

  // Modals visibility states
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);

  // Directory Filters & View Modes
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid" | "compact" | "calendar">("table");

  // Wizard state values
  const [wizardForm, setWizardForm] = useState({
    name: "",
    description: "",
    tags: "",
    category: "marketing" as CampaignCategory,
    owner: "Me" as "Me" | "John" | "Sarah",
    priority: "medium" as "low" | "medium" | "high",
    audienceType: "segment" as any,
    audienceTarget: "",
    templateId: "ct-1",
    templateVariablesMapped: {} as Record<string, string>,
    mediaAssetUrl: "",
    scheduleType: "now" as any,
    scheduleTime: "",
    scheduleTimezone: "IST (UTC+5:30)",
    rateLimitPerMin: 120,
    notes: ""
  });

  // Template Creator State
  const [templateForm, setTemplateForm] = useState({
    name: "",
    category: "marketing" as CampaignCategory,
    bodyText: "",
    language: "English (US)",
    mediaHeaderType: "none" as any,
    variablesString: "" // comma separated
  });

  // Media upload simulation states
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(0);

  // Active Campaign Selector for right panel
  const activeCampaign = useMemo(() => {
    return campaigns.find((c) => c.id === selectedCampaignId) || null;
  }, [campaigns, selectedCampaignId]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === "running").length;
    const draft = campaigns.filter((c) => c.status === "draft").length;
    const scheduled = campaigns.filter((c) => c.status === "scheduled").length;
    const completed = campaigns.filter((c) => c.status === "completed").length;
    const failed = campaigns.filter((c) => c.status === "failed").length;

    let totalSent = 0;
    let totalDelivered = 0;
    let totalRead = 0;
    let totalReplied = 0;
    let totalFailed = 0;

    campaigns.forEach((c) => {
      totalSent += c.stats.sent;
      totalDelivered += c.stats.delivered;
      totalRead += c.stats.read;
      totalReplied += c.stats.replied;
      totalFailed += c.stats.failed;
    });

    const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;
    const readRate = totalDelivered > 0 ? Math.round((totalRead / totalDelivered) * 100) : 0;
    const replyRate = totalRead > 0 ? Math.round((totalReplied / totalRead) * 100) : 0;

    return { total, active, draft, scheduled, completed, failed, totalSent, deliveryRate, readRate, replyRate, totalFailed };
  }, [campaigns]);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [campaigns, searchQuery, statusFilter, categoryFilter]);

  // Handle Wizard Submit (Create Campaign)
  const handleCreateCampaign = () => {
    if (!wizardForm.name) {
      addToast("Campaign Name is required.", "error");
      return;
    }

    // Determine estimated audience size
    let audienceCount = 100;
    if (wizardForm.audienceType === "segment") {
      audienceCount = wizardForm.audienceTarget.includes("VIP") ? 500 : 250;
    } else if (wizardForm.audienceType === "csv") {
      audienceCount = 4500;
    } else if (wizardForm.audienceType === "manual") {
      audienceCount = 10;
    }

    addCampaign({
      name: wizardForm.name,
      description: wizardForm.description,
      status: wizardForm.scheduleType === "now" ? "running" : "scheduled",
      category: wizardForm.category,
      tags: wizardForm.tags.split(",").map((s) => s.trim()).filter(Boolean),
      owner: wizardForm.owner,
      priority: wizardForm.priority,
      audienceType: wizardForm.audienceType,
      audienceTarget: wizardForm.audienceTarget || "General List",
      audienceCount,
      templateId: wizardForm.templateId,
      templateVariablesMapped: wizardForm.templateVariablesMapped,
      mediaAssetUrl: wizardForm.mediaAssetUrl || undefined,
      scheduleType: wizardForm.scheduleType,
      scheduleTime: wizardForm.scheduleTime || undefined,
      scheduleTimezone: wizardForm.scheduleTimezone,
      rateLimitPerMin: wizardForm.rateLimitPerMin,
      notes: wizardForm.notes
    });

    addToast(`Campaign "${wizardForm.name}" created.`, "success");
    setShowWizardModal(false);
    setWizardStep(1);
    
    // Reset Form
    setWizardForm({
      name: "",
      description: "",
      tags: "",
      category: "marketing",
      owner: "Me",
      priority: "medium",
      audienceType: "segment",
      audienceTarget: "",
      templateId: "ct-1",
      templateVariablesMapped: {},
      mediaAssetUrl: "",
      scheduleType: "now",
      scheduleTime: "",
      scheduleTimezone: "IST (UTC+5:30)",
      rateLimitPerMin: 120,
      notes: ""
    });
  };

  // Add Template submit
  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateForm.name || !templateForm.bodyText) return;

    addTemplate({
      name: templateForm.name,
      category: templateForm.category,
      bodyText: templateForm.bodyText,
      language: templateForm.language,
      mediaHeaderType: templateForm.mediaHeaderType,
      variables: templateForm.variablesString.split(",").map((s) => s.trim()).filter(Boolean)
    });

    addToast(`Template "${templateForm.name}" submitted for Meta approvals.`, "info");
    setShowCreateTemplateModal(false);
    setTemplateForm({
      name: "",
      category: "marketing",
      bodyText: "",
      language: "English (US)",
      mediaHeaderType: "none",
      variablesString: ""
    });
  };

  // Upload Media Asset Simulator
  const handleUploadMediaSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    setMediaUploadProgress(0);

    const timer = setInterval(() => {
      setMediaUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsUploadingMedia(false);
          
          let fileType: any = "document";
          if (file.type.startsWith("image/")) fileType = "image";
          else if (file.type.startsWith("video/")) fileType = "video";
          else if (file.type === "application/pdf") fileType = "pdf";

          addMediaAsset({
            name: file.name,
            type: fileType,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            url: fileType === "image" ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300&h=150" : "#"
          });

          addToast(`Uploaded ${file.name} to media library!`, "success");
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // Toggle status of campaign
  const handleToggleStatus = (id: string, currentStatus: CampaignStatus) => {
    let nextStatus: CampaignStatus = "paused";
    if (currentStatus === "paused") nextStatus = "running";
    else if (currentStatus === "running") nextStatus = "paused";
    else return;

    updateCampaign(id, { status: nextStatus });
    addToast(`Campaign status updated to ${nextStatus.toUpperCase()}`, "info");
  };

  // Helpers
  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case "running":
        return "bg-brand-sky/10 text-brand-sky border border-brand-sky/20";
      case "paused":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "completed":
        return "bg-brand-green/10 text-brand-green border border-brand-green/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "scheduled":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "draft":
        return "bg-zinc-800 text-zinc-400 border border-zinc-700/50";
      case "cancelled":
        return "bg-zinc-900 text-zinc-500 border border-zinc-850";
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  };

  const selectedTemplate = useMemo(() => {
    return templates.find((t) => t.id === wizardForm.templateId);
  }, [templates, wizardForm.templateId]);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 max-w-full font-sans select-none pb-12 px-6 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin text-left">
        
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border dark:border-border/40 pb-5 shrink-0">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl font-extrabold text-brand-navy dark:text-foreground tracking-tight">
              Broadcasts & Campaigns Manager
            </h1>
            <p className="text-xs text-on-surface-variant font-medium">
              Create rich WhatsApp alerts campaigns, schedule recurring newsletters and audit real-time analytics.
            </p>
          </div>

          <div className="flex items-center gap-2 select-none">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateTemplateModal(true)}
              className="text-xs font-bold font-sans"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Message Template
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowWizardModal(true)}
              className="text-xs font-bold font-sans animate-pulse"
              leftIcon={<Mail className="h-4 w-4" />}
            >
              New Campaign
            </Button>
          </div>
        </div>

        {/* CAMPAIGN METRICS BENTO */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: "Total Campaigns", value: stats.total, sub: `${stats.active} running now`, icon: Layers, color: "text-brand-sky" },
            { label: "Messages Sent", value: stats.totalSent, sub: `${stats.totalFailed} delivery fails`, icon: Send, color: "text-brand-green" },
            { label: "Delivery Rate", value: stats.deliveryRate + "%", sub: "Target SLA: 98%", icon: CheckCircle2, color: "text-[#10B981]" },
            { label: "Read Rate", value: stats.readRate + "%", sub: "Avg read time: 4m", icon: Eye, color: "text-[#8B5CF6]" },
            { label: "Reply Rate", value: stats.replyRate + "%", sub: "Interaction score", icon: Zap, color: "text-[#EC4899]" },
            { label: "Completed Runs", value: stats.completed, sub: `Draft campaigns: ${stats.draft}`, icon: Award, color: "text-amber-500" }
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
            { id: "dashboard", label: "Overview Dashboard", icon: BarChart3 },
            { id: "directory", label: "Campaigns Directory", icon: Mail },
            { id: "templates", label: "Template Hub", icon: Layers },
            { id: "media", label: "Media Library", icon: FolderOpen },
            { id: "scheduler", label: "Timeline Calendar", icon: CalendarIcon }
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

        {/* CONTENT PANELS */}
        <div className="flex-grow">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Funnel conversion statistics */}
              <Card className="p-5 flex flex-col justify-between h-[360px]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Message Delivery Conversion Funnel</span>
                    <span className="text-[10px] text-muted-foreground">Detailed metrics distribution analysis</span>
                  </div>
                  <TrendingUp className="h-4 w-4 text-brand-sky" />
                </div>
                <div className="flex flex-col gap-3 justify-center flex-grow pr-4 select-none">
                  {[
                    { label: "Messages Sent", count: "100%", val: stats.totalSent, color: "bg-brand-sky" },
                    { label: "Delivered Messages", count: stats.deliveryRate + "%", val: Math.round(stats.totalSent * (stats.deliveryRate / 100)), color: "bg-brand-green" },
                    { label: "Read Messages", count: Math.round(stats.deliveryRate * (stats.readRate / 100)) + "%", val: Math.round(stats.totalSent * (stats.deliveryRate / 100) * (stats.readRate / 100)), color: "bg-purple-500" },
                    { label: "Replied Feedbacks", count: Math.round(stats.deliveryRate * (stats.readRate / 100) * (stats.replyRate / 100)) + "%", val: Math.round(stats.totalSent * (stats.deliveryRate / 100) * (stats.readRate / 100) * (stats.replyRate / 100)), color: "bg-pink-500" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1 w-full text-left">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-foreground">{item.label}</span>
                        <span className="font-mono text-zinc-400">{item.val} ({item.count})</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: item.count }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Performing Campaigns */}
              <Card className="p-5 flex flex-col h-[360px] justify-between">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Top Campaign Performers</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Ranked by read and conversion rate logs</span>
                  </div>
                  <Award className="h-4.5 w-4.5 text-amber-500 animate-bounce" />
                </div>

                <div className="flex flex-col gap-2.5 overflow-y-auto scrollbar-thin flex-grow">
                  {campaigns.slice(0, 3).map((camp) => (
                    <div key={camp.id} className="p-3 border border-border rounded-xl bg-zinc-950/15 flex items-center justify-between text-[10px]">
                      <div className="flex flex-col gap-0.5 text-left truncate max-w-[200px]">
                        <span className="font-extrabold text-foreground truncate">{camp.name}</span>
                        <span className="text-zinc-500 font-mono">Category: {camp.category}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="font-extrabold text-brand-green font-mono">{camp.stats.sent > 0 ? Math.round((camp.stats.read / camp.stats.sent) * 100) : 0}%</span>
                          <span className="text-[8px] text-zinc-500 uppercase font-bold">Read Ratio</span>
                        </div>
                        <span className="bg-zinc-850 px-2 py-0.5 border border-border rounded text-[9px] font-bold text-zinc-400">{camp.stats.sent} sent</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <span className="text-[8px] text-zinc-500 italic mt-3">Calculated dynamically over total delivery statistics log.</span>
              </Card>

            </div>
          )}

          {/* TAB 2: DIRECTORY */}
          {activeTab === "directory" && (
            <div className="flex flex-col gap-4">
              
              {/* Directory Filter row */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/15 p-3 rounded-xl border border-border/40 select-none">
                
                {/* Search */}
                <div className="flex items-center gap-3 flex-grow md:flex-none max-w-sm relative">
                  <Search className="h-4 w-4 absolute left-3 top-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search campaign name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-xl text-xs focus:outline-none focus:border-brand-sky text-foreground"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 select-none">
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-9 px-3.5 bg-white border border-brand-border rounded-xl text-[10px] font-bold text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Drafts</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="running">Active Running</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-9 px-3.5 bg-white border border-brand-border rounded-xl text-[10px] font-bold text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="marketing">Marketing</option>
                    <option value="utility">Utility</option>
                    <option value="authentication">Authentication</option>
                  </select>

                </div>

                {/* View Modes */}
                <div className="flex items-center bg-white border border-brand-border dark:border-border rounded-xl p-0.5 select-none">
                  {[
                    { mode: "table", label: "Table Columns", icon: TableIcon },
                    { mode: "grid", label: "Grid Cards", icon: GridIcon },
                    { mode: "compact", label: "High Density List", icon: ListIcon }
                  ].map((item) => (
                    <button
                      key={item.mode}
                      onClick={() => setViewMode(item.mode as any)}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === item.mode
                          ? "bg-secondary text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={item.label}
                    >
                      <item.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>

              </div>

              {/* Campaign list box */}
              <div className="border border-brand-border dark:border-border/60 bg-card rounded-2xl overflow-hidden min-h-[400px]">
                
                {filteredCampaigns.length === 0 ? (
                  <div className="p-20 text-center italic text-xs text-muted-foreground flex flex-col items-center justify-center gap-3">
                    <Mail className="h-8 w-8 text-zinc-600 animate-pulse" />
                    <span>No active campaigns found matching options.</span>
                  </div>
                ) : (
                  <>
                    {/* View: Table */}
                    {viewMode === "table" && (
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-xs text-left border-collapse select-text">
                          <thead className="bg-zinc-950/20 text-zinc-400 uppercase tracking-wider font-extrabold border-b border-border select-none">
                            <tr>
                              <th className="p-4">Campaign Details</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">Audience</th>
                              <th className="p-4">Owner</th>
                              <th className="p-4 text-center">Delivery / Read / Reply</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCampaigns.map((camp) => (
                              <tr
                                key={camp.id}
                                className="border-b border-border/40 hover:bg-zinc-900/10 cursor-pointer transition-colors duration-150"
                                onClick={() => setSelectedCampaignId(camp.id)}
                              >
                                <td className="p-4">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-extrabold text-foreground">{camp.name}</span>
                                    <span className="text-[10px] text-muted-foreground truncate max-w-[240px]">{camp.description}</span>
                                  </div>
                                </td>
                                
                                <td className="p-4 select-none">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusBadge(camp.status)}`}>
                                    {camp.status}
                                  </span>
                                </td>

                                <td className="p-4">
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="font-extrabold text-foreground">{camp.audienceTarget}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">{camp.audienceCount} targets</span>
                                  </div>
                                </td>

                                <td className="p-4 font-bold text-foreground">👤 {camp.owner}</td>

                                <td className="p-4 select-none">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-2 text-[10px] font-bold font-mono">
                                      <span className="text-zinc-400">{camp.stats.sent} Sent</span>
                                      <span className="text-brand-green">{camp.stats.sent > 0 ? Math.round((camp.stats.delivered / camp.stats.sent) * 100) : 0}% D</span>
                                      <span className="text-brand-sky">{camp.stats.delivered > 0 ? Math.round((camp.stats.read / camp.stats.delivered) * 100) : 0}% R</span>
                                      <span className="text-pink-500">{camp.stats.read > 0 ? Math.round((camp.stats.replied / camp.stats.read) * 100) : 0}% Rp</span>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-4 text-right select-none" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-1.5">
                                    
                                    {(camp.status === "running" || camp.status === "paused") && (
                                      <button
                                        onClick={() => handleToggleStatus(camp.id, camp.status)}
                                        className="p-1.5 hover:bg-zinc-800 rounded text-muted-foreground hover:text-foreground transition-colors"
                                        title={camp.status === "running" ? "Pause Campaign" : "Resume Campaign"}
                                      >
                                        {camp.status === "running" ? <Pause className="h-4 w-4 text-amber-500" /> : <Play className="h-4 w-4 text-brand-green" />}
                                      </button>
                                    )}

                                    <button
                                      onClick={() => {
                                        duplicateCampaign(camp.id);
                                        addToast("Campaign duplicated as draft.", "success");
                                      }}
                                      className="p-1.5 hover:bg-zinc-800 rounded text-muted-foreground hover:text-foreground transition-colors"
                                      title="Duplicate Campaign"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </button>

                                    <button
                                      onClick={() => {
                                        if (confirm("Are you sure you want to delete this campaign?")) {
                                          deleteCampaign(camp.id);
                                          addToast("Campaign deleted.", "success");
                                        }
                                      }}
                                      className="p-1.5 hover:bg-red-950/25 rounded text-muted-foreground hover:text-red-500 transition-colors"
                                      title="Delete Campaign"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>

                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* View: Grid */}
                    {viewMode === "grid" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
                        {filteredCampaigns.map((camp) => (
                          <Card
                            key={camp.id}
                            className="p-5 flex flex-col justify-between h-[230px] hover:border-brand-sky cursor-pointer transition-all duration-200"
                            onClick={() => setSelectedCampaignId(camp.id)}
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <span className="font-extrabold text-foreground text-xs leading-snug">{camp.name}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusBadge(camp.status)}`}>
                                  {camp.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-muted-foreground leading-relaxed truncate">{camp.description}</p>
                              
                              <div className="flex flex-col gap-1 mt-2 text-[10px] text-zinc-400 text-left font-mono">
                                <span>Target: {camp.audienceTarget}</span>
                                <span>Priority: {camp.priority.toUpperCase()} • Priority owner: {camp.owner}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-border/40 pt-3 select-none" onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-3 text-[9px] font-bold font-mono">
                                <span className="text-zinc-500">{camp.stats.sent} Sent</span>
                                <span className="text-brand-green">{camp.stats.sent > 0 ? Math.round((camp.stats.delivered / camp.stats.sent) * 100) : 0}% D</span>
                              </div>
                              
                              <div className="flex gap-1.5 select-none">
                                <button
                                  onClick={() => duplicateCampaign(camp.id)}
                                  className="p-1 hover:bg-zinc-800 rounded text-muted-foreground hover:text-white"
                                  title="Duplicate"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this campaign?")) {
                                      deleteCampaign(camp.id);
                                    }
                                  }}
                                  className="p-1 hover:bg-red-950/20 rounded text-muted-foreground hover:text-red-500"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* View: Compact */}
                    {viewMode === "compact" && (
                      <div className="flex flex-col divide-y divide-border/40 select-text max-h-[500px] overflow-y-auto scrollbar-thin">
                        {filteredCampaigns.map((camp) => (
                          <div
                            key={camp.id}
                            onClick={() => setSelectedCampaignId(camp.id)}
                            className="p-3 flex items-center justify-between gap-4 hover:bg-zinc-900/10 cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-zinc-800 text-[10px] font-mono text-brand-sky flex items-center justify-center shrink-0 uppercase select-none">
                                {camp.name.charAt(0)}
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="font-bold text-foreground text-xs leading-tight">{camp.name}</span>
                                <span className="text-[9px] text-muted-foreground">Category: {camp.category} • targets: {camp.audienceCount}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 select-none" onClick={(e) => e.stopPropagation()}>
                              <span className="text-[10px] font-mono text-zinc-400">{camp.stats.sent} Sent</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusBadge(camp.status)}`}>
                                {camp.status}
                              </span>
                              <ChevronRight className="h-4.5 w-4.5 text-muted-foreground shrink-0" onClick={() => setSelectedCampaignId(camp.id)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </>
                )}

              </div>

            </div>
          )}

          {/* TAB 3: TEMPLATE HUB */}
          {activeTab === "templates" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              {templates.map((tpl) => (
                <Card key={tpl.id} className="p-5 flex flex-col justify-between h-[210px] border border-border">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center select-none border-b border-border/40 pb-2">
                      <span className="font-extrabold text-foreground text-xs">{tpl.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                        tpl.status === "approved"
                          ? "bg-brand-green/10 text-brand-green"
                          : tpl.status === "rejected"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {tpl.status}
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-300 leading-relaxed max-h-[80px] overflow-hidden whitespace-pre-wrap mt-1">
                      {tpl.bodyText}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2 text-[8px] font-mono text-zinc-500 select-none">
                      <span>Cat: {tpl.category}</span>
                      <span>• Lang: {tpl.language}</span>
                      {tpl.mediaHeaderType !== "none" && <span>• Header: {tpl.mediaHeaderType.toUpperCase()}</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-border/40 pt-2 text-[9px] font-bold select-none">
                    <span className="text-zinc-500 flex-grow text-[8px] font-mono self-center">Vars: {tpl.variables.join(", ") || "none"}</span>
                    <Button variant="outline" size="xs" onClick={() => {
                      setWizardForm({ ...wizardForm, templateId: tpl.id });
                      setShowWizardModal(true);
                      setWizardStep(3); // skip straight to preview
                    }} disabled={tpl.status !== "approved"}>
                      Use Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* TAB 4: MEDIA LIBRARY */}
          {activeTab === "media" && (
            <div className="flex flex-col gap-5 text-left select-none">
              
              {/* Media tools */}
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-foreground">Graphics Assets Library</span>
                  <span className="text-[10px] text-muted-foreground">Manage templates header media files</span>
                </div>
                
                {/* Upload Trigger */}
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleUploadMediaSimulate}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    disabled={isUploadingMedia}
                  />
                  <Button variant="primary" size="sm" isLoading={isUploadingMedia} className="text-xs font-bold font-sans">
                    {isUploadingMedia ? `Uploading (${mediaUploadProgress}%)` : "Upload File"}
                  </Button>
                </div>
              </div>

              {/* Uploading indicator */}
              {isUploadingMedia && (
                <div className="w-full bg-zinc-950/20 border border-border p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-foreground">Processing template media attachment...</span>
                    <span className="font-mono text-brand-sky">{mediaUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-sky transition-all duration-300" style={{ width: `${mediaUploadProgress}%` }} />
                  </div>
                </div>
              )}

              {/* Assets Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaAssets.map((asset) => (
                  <Card key={asset.id} className="p-4 flex flex-col justify-between h-[160px] relative group hover:border-brand-sky transition-all">
                    
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-zinc-950/20 border border-border rounded-lg text-zinc-400 shrink-0">
                        {asset.type === "image" && <FileImage className="h-4 w-4 text-brand-green" />}
                        {asset.type === "video" && <FileVideo className="h-4 w-4 text-brand-sky" />}
                        {asset.type === "pdf" && <FileText className="h-4 w-4 text-amber-500" />}
                        {!["image", "video", "pdf"].includes(asset.type) && <FolderOpen className="h-4 w-4 text-zinc-500" />}
                      </div>

                      <button
                        onClick={() => {
                          deleteMediaAsset(asset.id);
                          addToast("Asset removed from library.", "info");
                        }}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        title="Delete asset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-col text-left mt-2">
                      <span className="font-extrabold text-foreground text-[11px] truncate">{asset.name}</span>
                      <span className="text-[9px] text-zinc-500 mt-0.5 font-mono">{asset.size} • uploaded: {asset.uploadedAt}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setWizardForm({ ...wizardForm, mediaAssetUrl: asset.url });
                        addToast(`Selected media asset: ${asset.name}`, "success");
                      }}
                      className="w-full text-[9px] uppercase font-bold mt-2"
                    >
                      Attach to Wizard
                    </Button>

                  </Card>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: TIMELINE CALENDAR */}
          {activeTab === "scheduler" && (
            <div className="flex flex-col gap-4 text-left">
              <span className="text-xs font-bold text-foreground">Upcoming Broadcast Campaigns Timeline</span>
              <div className="border border-border/60 bg-zinc-950/20 rounded-2xl p-5 min-h-[300px] flex flex-col gap-3">
                {campaigns.filter((c) => c.status === "scheduled").length === 0 ? (
                  <div className="text-center italic text-xs text-zinc-500 py-10">No upcoming campaign scheduled.</div>
                ) : (
                  campaigns.filter((c) => c.status === "scheduled").map((camp) => (
                    <div key={camp.id} className="p-3 border border-border bg-card rounded-xl flex items-center justify-between text-xs leading-normal">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-purple-400 shrink-0" />
                        <div className="flex flex-col text-left">
                          <span className="font-extrabold text-foreground">{camp.name}</span>
                          <span className="text-[10px] text-muted-foreground">{camp.audienceTarget} • {camp.audienceCount} targets</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 select-none">
                        <div className="flex flex-col items-end">
                          <span className="font-extrabold text-foreground font-mono">
                            {camp.scheduleTime ? new Date(camp.scheduleTime).toLocaleString() : "TBD"}
                          </span>
                          <span className="text-[8px] text-zinc-500 font-bold uppercase">{camp.scheduleTimezone}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => {
                            updateCampaign(camp.id, { status: "running" });
                            addToast("Campaign started manually now.", "success");
                          }}
                        >
                          Send Now
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* CAMPAIGN DETAIL PANEL (RIGHT DRAWER) */}
        <AnimatePresence>
          {activeCampaign && (
            <motion.aside
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full md:w-[480px] bg-card border-l border-border shadow-2xl z-50 flex flex-col justify-between overflow-hidden text-left font-sans"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-border bg-zinc-950/15 flex justify-between items-center select-none shrink-0">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 text-xs font-bold text-brand-sky flex items-center justify-center shrink-0 uppercase select-none">
                    {activeCampaign.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground truncate max-w-[200px]">{activeCampaign.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase w-max mt-0.5 ${getStatusBadge(activeCampaign.status)}`}>
                      {activeCampaign.status}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedCampaignId(null)}
                  className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Close inspector"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Scroll Body */}
              <div className="flex-grow overflow-y-auto p-5 scrollbar-thin select-text">
                <div className="flex flex-col gap-5 text-left">
                  
                  {/* Campaign stats panel */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Execution Metrics</span>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Sent Count", val: activeCampaign.stats.sent },
                        { label: "Delivery Success", val: activeCampaign.stats.delivered },
                        { label: "Read Checks", val: activeCampaign.stats.read },
                        { label: "Failed Throttles", val: activeCampaign.stats.failed }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 border border-border rounded-xl bg-zinc-950/15 text-[10px] text-left">
                          <span className="text-zinc-500 font-bold uppercase">{item.label}</span>
                          <div className="text-base font-black text-foreground mt-1 font-mono">{item.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-border/40 select-none" />

                  {/* Campaign configuration detail logs */}
                  <div className="flex flex-col gap-3.5 text-left text-xs leading-normal select-text">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Campaign Configuration</span>
                    
                    <div className="flex justify-between items-center text-[10px] border-b border-border/20 pb-1.5">
                      <span className="text-zinc-400 font-bold uppercase">Audience Targets</span>
                      <span className="font-extrabold text-foreground">{activeCampaign.audienceTarget}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] border-b border-border/20 pb-1.5">
                      <span className="text-zinc-400 font-bold uppercase">Priority owner</span>
                      <span className="font-extrabold text-foreground">👤 {activeCampaign.owner} ({activeCampaign.priority} priority)</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] border-b border-border/20 pb-1.5">
                      <span className="text-zinc-400 font-bold uppercase">Throttle Rate Limit</span>
                      <span className="font-extrabold text-foreground">{activeCampaign.rateLimitPerMin} messages / min</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] border-b border-border/20 pb-1.5">
                      <span className="text-zinc-400 font-bold uppercase">Schedule Type</span>
                      <span className="font-extrabold text-foreground uppercase">{activeCampaign.scheduleType}</span>
                    </div>
                  </div>

                  <hr className="border-border/40 select-none" />

                  {/* Delivery Timeline logs */}
                  <div className="flex flex-col gap-3 text-left">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Live Delivery logs</span>
                    
                    {activeCampaign.logs.length === 0 ? (
                      <div className="p-4 border border-dashed border-border rounded-xl text-center text-[10px] text-zinc-500 italic">No message logs logged yet.</div>
                    ) : (
                      <div className="flex flex-col gap-3 pr-1 select-text">
                        {activeCampaign.logs.map((log) => (
                          <div key={log.id} className="p-3 border border-border rounded-xl bg-zinc-950/15 flex flex-col gap-1.5 text-[10px]">
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col text-left">
                                <span className="font-extrabold text-foreground">{log.contactName}</span>
                                <span className="text-zinc-500 font-mono">{log.phoneNumber}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                log.status === "read"
                                  ? "bg-brand-green/10 text-brand-green"
                                  : log.status === "failed"
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}>
                                {log.status}
                              </span>
                            </div>
                            {log.errorMessage && (
                              <div className="bg-red-950/20 border border-red-500/15 text-red-400 p-2 rounded-lg text-[9px] leading-relaxed flex gap-1 items-start text-left select-none">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                <span>{log.errorMessage}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border bg-zinc-950/15 select-none shrink-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-bold text-xs font-sans"
                  onClick={() => {
                    duplicateCampaign(activeCampaign.id);
                    addToast("Campaign duplicated as draft.", "success");
                  }}
                >
                  Duplicate Draft
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-grow font-bold text-xs font-sans"
                  onClick={() => setSelectedCampaignId(null)}
                >
                  Close Analytics
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MODAL: 5-STEP CREATE CAMPAIGN WIZARD */}
        <AnimatePresence>
          {showWizardModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                
                {/* Wizard Header */}
                <div className="p-5 border-b border-border flex justify-between items-center bg-zinc-950/10">
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-foreground text-sm font-sans">Campaign Wizard Setup</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-bold mt-1">Step {wizardStep} of 5</span>
                  </div>
                  <button onClick={() => setShowWizardModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 select-none">
                  <div className="h-full bg-brand-sky transition-all duration-300" style={{ width: `${(wizardStep / 5) * 100}%` }} />
                </div>

                {/* Wizard Steps Form */}
                <div className="p-5 overflow-y-auto max-h-[480px] text-left">
                  
                  {/* Step 1: General Info */}
                  {wizardStep === 1 && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Campaign Name *</label>
                        <input
                          type="text"
                          required
                          value={wizardForm.name}
                          onChange={(e) => setWizardForm({ ...wizardForm, name: e.target.value })}
                          placeholder="e.g. Q3 Summer Sale Alert"
                          className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Campaign Description</label>
                        <input
                          type="text"
                          value={wizardForm.description}
                          onChange={(e) => setWizardForm({ ...wizardForm, description: e.target.value })}
                          placeholder="Brief campaign details log..."
                          className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Category</label>
                          <select
                            value={wizardForm.category}
                            onChange={(e) => setWizardForm({ ...wizardForm, category: e.target.value as CampaignCategory })}
                            className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                          >
                            <option value="marketing">Marketing</option>
                            <option value="utility">Utility</option>
                            <option value="authentication">Authentication</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Priority</label>
                          <select
                            value={wizardForm.priority}
                            onChange={(e) => setWizardForm({ ...wizardForm, priority: e.target.value as any })}
                            className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={wizardForm.tags}
                          onChange={(e) => setWizardForm({ ...wizardForm, tags: e.target.value })}
                          placeholder="e.g. sale, vip, summer"
                          className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Audience Selection */}
                  {wizardStep === 2 && (
                    <div className="flex flex-col gap-4 select-none">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Audience Source</label>
                        <select
                          value={wizardForm.audienceType}
                          onChange={(e) => setWizardForm({ ...wizardForm, audienceType: e.target.value as any, audienceTarget: "" })}
                          className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                        >
                          <option value="segment">CRM Smart Segment</option>
                          <option value="tags">CRM Contact Tags</option>
                          <option value="csv">CSV Spreadsheet File Upload</option>
                          <option value="manual">Manual inputs</option>
                        </select>
                      </div>

                      {wizardForm.audienceType === "segment" && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Select CRM Segment</label>
                          <select
                            value={wizardForm.audienceTarget}
                            onChange={(e) => setWizardForm({ ...wizardForm, audienceTarget: e.target.value })}
                            className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                          >
                            <option value="">Choose segment</option>
                            {segments.map((seg) => (
                              <option key={seg.id} value={`${seg.name} segment`}>{seg.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {wizardForm.audienceType === "tags" && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Tag Value Target</label>
                          <input
                            type="text"
                            value={wizardForm.audienceTarget}
                            onChange={(e) => setWizardForm({ ...wizardForm, audienceTarget: e.target.value })}
                            placeholder="e.g. VIP, Shopify"
                            className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                          />
                        </div>
                      )}

                      {wizardForm.audienceType === "csv" && (
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Spreadsheet name</label>
                          <input
                            type="text"
                            value={wizardForm.audienceTarget}
                            onChange={(e) => setWizardForm({ ...wizardForm, audienceTarget: e.target.value })}
                            placeholder="e.g. black_friday_leads.csv"
                            className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                          />
                        </div>
                      )}

                      {wizardForm.audienceType === "manual" && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">WhatsApp Numbers (comma separated)</label>
                          <textarea
                            value={wizardForm.audienceTarget}
                            onChange={(e) => setWizardForm({ ...wizardForm, audienceTarget: e.target.value })}
                            placeholder="e.g. +91 99999 88888, +1 415-555-2671"
                            className="w-full h-16 p-2 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Template & Media mappings */}
                  {wizardStep === 3 && (
                    <div className="flex flex-col gap-4 text-left">
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase select-none">Select Approved Template</label>
                        <select
                          value={wizardForm.templateId}
                          onChange={(e) => setWizardForm({ ...wizardForm, templateId: e.target.value, templateVariablesMapped: {} })}
                          className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                        >
                          {templates.filter((t) => t.status === "approved").map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>

                      {selectedTemplate && (
                        <div className="p-3 bg-zinc-950/20 border border-border rounded-xl text-[10px] flex flex-col gap-2">
                          <span className="text-zinc-500 font-bold uppercase select-none">Live Template Body Preview</span>
                          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{selectedTemplate.bodyText}</p>
                        </div>
                      )}

                      {/* Map Variables */}
                      {selectedTemplate && selectedTemplate.variables.length > 0 && (
                        <div className="flex flex-col gap-2.5">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase select-none">Map variables parameter</span>
                          <div className="flex flex-col gap-2 bg-zinc-950/20 p-3 border border-border rounded-xl">
                            {selectedTemplate.variables.map((v, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-4 text-[10px]">
                                <span className="font-mono text-zinc-400">Var {"{{"}{idx + 1}{"}}"} ({v})</span>
                                <select
                                  value={wizardForm.templateVariablesMapped[idx + 1] || ""}
                                  onChange={(e) => setWizardForm({
                                    ...wizardForm,
                                    templateVariablesMapped: {
                                      ...wizardForm.templateVariablesMapped,
                                      [idx + 1]: e.target.value
                                    }
                                  })}
                                  className="h-8 bg-zinc-900 border border-brand-border rounded px-2 text-[9px] font-bold text-brand-sky focus:outline-none cursor-pointer"
                                >
                                  <option value="">Choose mapped field</option>
                                  <option value="name">Contact Name</option>
                                  <option value="email">Email</option>
                                  <option value="phone">Phone Number</option>
                                  <option value="company">Company</option>
                                  <option value="designation">Designation</option>
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Media Header asset */}
                      {selectedTemplate && selectedTemplate.mediaHeaderType !== "none" && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase select-none">Media Header Attachment URL</label>
                          <input
                            type="text"
                            value={wizardForm.mediaAssetUrl}
                            onChange={(e) => setWizardForm({ ...wizardForm, mediaAssetUrl: e.target.value })}
                            placeholder="Attach media URL (from Media Library tab or external hosting)..."
                            className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground font-mono"
                          />
                        </div>
                      )}

                    </div>
                  )}

                  {/* Step 4: Schedule */}
                  {wizardStep === 4 && (
                    <div className="flex flex-col gap-4">
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase select-none">Schedule Method</label>
                        <select
                          value={wizardForm.scheduleType}
                          onChange={(e) => setWizardForm({ ...wizardForm, scheduleType: e.target.value as any })}
                          className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                        >
                          <option value="now">Send Immediately Now</option>
                          <option value="later">Schedule for Later Date</option>
                          <option value="recurring">Recurring Schedule</option>
                        </select>
                      </div>

                      {wizardForm.scheduleType === "later" && (
                        <div className="grid grid-cols-2 gap-4 select-none">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase">Target Date / Time</label>
                            <input
                              type="datetime-local"
                              value={wizardForm.scheduleTime}
                              onChange={(e) => setWizardForm({ ...wizardForm, scheduleTime: e.target.value })}
                              className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer"
                            />
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase">Timezone</label>
                            <input
                              type="text"
                              value={wizardForm.scheduleTimezone}
                              onChange={(e) => setWizardForm({ ...wizardForm, scheduleTimezone: e.target.value })}
                              className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                            />
                          </div>
                        </div>
                      )}

                      {/* Throttle Rate Limit */}
                      <div className="flex flex-col gap-2 text-left select-none">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
                          <span>Send Rate Limit Throttling</span>
                          <span className="font-mono text-brand-sky">{wizardForm.rateLimitPerMin} messages / min</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="500"
                          step="10"
                          value={wizardForm.rateLimitPerMin}
                          onChange={(e) => setWizardForm({ ...wizardForm, rateLimitPerMin: Number(e.target.value) })}
                          className="w-full cursor-pointer bg-zinc-800 rounded-lg accent-brand-sky"
                        />
                        <span className="text-[8px] text-zinc-500">Rate-limiting helps conform to Meta's strict template sending thresholds to avoid account restrictions.</span>
                      </div>

                    </div>
                  )}

                  {/* Step 5: Confirmation */}
                  {wizardStep === 5 && (
                    <div className="flex flex-col gap-4 text-left">
                      <span className="text-xs font-bold text-foreground">Campaign Summary Overview</span>
                      
                      <div className="p-4 border border-border rounded-2xl bg-zinc-950/20 flex flex-col gap-2.5 text-[10px]">
                        
                        <div className="flex justify-between items-center border-b border-border/20 pb-1.5">
                          <span className="text-zinc-500 font-bold uppercase">Campaign Name</span>
                          <span className="font-extrabold text-foreground">{wizardForm.name || "Unnamed"}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-border/20 pb-1.5">
                          <span className="text-zinc-500 font-bold uppercase">Target Audience</span>
                          <span className="font-extrabold text-foreground font-mono">
                            {wizardForm.audienceTarget || "Manual Contacts"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-border/20 pb-1.5">
                          <span className="text-zinc-500 font-bold uppercase">Template Assigned</span>
                          <span className="font-extrabold text-foreground">{selectedTemplate?.name || "ct-1"}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-border/20 pb-1.5">
                          <span className="text-zinc-500 font-bold uppercase">Timing Configuration</span>
                          <span className="font-extrabold text-foreground uppercase">{wizardForm.scheduleType}</span>
                        </div>

                        <div className="flex justify-between items-center pb-1.5">
                          <span className="text-zinc-500 font-bold uppercase">Estimated Cost Billing</span>
                          <span className="font-extrabold text-brand-green font-mono">
                            {wizardForm.audienceType === "csv" ? "$35.20" : "$1.80"} (Stitch Free quota)
                          </span>
                        </div>

                      </div>

                      <div className="bg-amber-950/20 border border-amber-500/15 text-amber-400 p-3 rounded-xl text-[10px] leading-relaxed flex gap-2 items-start text-left select-none">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>Confirming this will lock the broadcast queue. Scheduled campaigns will execute automatically.</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Wizard Footer controls */}
                <div className="p-5 border-t border-border bg-zinc-950/10 flex justify-between select-none">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    disabled={wizardStep === 1}
                  >
                    Back
                  </Button>
                  
                  {wizardStep < 5 ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setWizardStep(wizardStep + 1)}
                      disabled={wizardStep === 1 && !wizardForm.name}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" onClick={handleCreateCampaign}>
                      Publish Campaign
                    </Button>
                  )}
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD MESSAGE TEMPLATE */}
        <AnimatePresence>
          {showCreateTemplateModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 border-b border-border flex justify-between items-center bg-zinc-950/10">
                  <span className="font-extrabold text-foreground text-sm font-sans">Submit Template to Meta Console</span>
                  <button onClick={() => setShowCreateTemplateModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleAddTemplate} className="p-5 overflow-y-auto max-h-[480px] flex flex-col gap-4 text-left">
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Template Name *</label>
                    <input
                      type="text"
                      required
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      placeholder="e.g. order_alert_v2"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Category</label>
                      <select
                        value={templateForm.category}
                        onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value as CampaignCategory })}
                        className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                      >
                        <option value="marketing">Marketing</option>
                        <option value="utility">Utility</option>
                        <option value="authentication">Authentication</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Language</label>
                      <input
                        type="text"
                        value={templateForm.language}
                        onChange={(e) => setTemplateForm({ ...templateForm, language: e.target.value })}
                        placeholder="e.g. English (US)"
                        className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Header Media Type</label>
                    <select
                      value={templateForm.mediaHeaderType}
                      onChange={(e) => setTemplateForm({ ...templateForm, mediaHeaderType: e.target.value as any })}
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                    >
                      <option value="none">None</option>
                      <option value="image">Image Banner</option>
                      <option value="video">Video Clip</option>
                      <option value="document">PDF Document</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Body Text *</label>
                    <textarea
                      required
                      value={templateForm.bodyText}
                      onChange={(e) => setTemplateForm({ ...templateForm, bodyText: e.target.value })}
                      placeholder="Use {{1}}, {{2}} for dynamic CRM variables. e.g. Hi {{1}}, order {{2}} confirmed."
                      className="w-full h-24 p-2 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Variables List (comma separated values)</label>
                    <input
                      type="text"
                      value={templateForm.variablesString}
                      onChange={(e) => setTemplateForm({ ...templateForm, variablesString: e.target.value })}
                      placeholder="e.g. name, orderId, price"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="bg-zinc-950/20 border border-border p-3 rounded-xl text-[9px] leading-relaxed flex gap-2 items-start text-left select-none">
                    <Info className="h-4 w-4 shrink-0 text-brand-sky" />
                    <span>Templates submitted undergo automatic validation checks by Meta. Current audit approvals take between 2 to 10 minutes.</span>
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-border mt-3 select-none">
                    <Button variant="outline" size="sm" type="button" onClick={() => setShowCreateTemplateModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Submit Template
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
