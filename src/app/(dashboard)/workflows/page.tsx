"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useWorkflows } from "@/store/use-workflows";
import { useToast } from "@/store/use-toast";
import {
  Bolt,
  Bot,
  Plus,
  Play,
  TrendingUp,
  Clock,
  Sparkles,
  GitBranch,
  ArrowRight,
  Trash2,
  Settings,
  AlertCircle,
  Search,
  Star,
  Copy,
  Download,
  Upload,
  Grid,
  List,
  Activity,
  Users,
  User,
  Shield,
  FileText
} from "lucide-react";

export default function WorkflowsDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  
  const {
    workflows,
    runsHistory,
    toggleWorkflow,
    addWorkflow,
    deleteWorkflow,
    updateWorkflow,
  } = useWorkflows();

  // Dashboard Filters & Layout States
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "my" | "team" | "favorites">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"recent" | "success" | "name">("recent");

  // Create workflow modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWfName, setNewWfName] = useState("");
  const [newWfDesc, setNewWfDesc] = useState("");
  const [newWfTrigger, setNewWfTrigger] = useState<"whatsapp_message" | "schedule" | "form_submit">("whatsapp_message");

  // Import template state variables
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check URL parameter to automatically open the creation flow
  useEffect(() => {
    if (searchParams?.get("create") === "true") {
      setShowCreateModal(true);
      router.replace("/workflows");
    }
  }, [searchParams, router]);

  // Dashboard metrics computations
  const totalCount = workflows.length;
  const activeCount = workflows.filter((w) => w.isActive).length;
  const draftCount = workflows.filter((w) => !w.isActive).length;
  const failedRunsCount = runsHistory.filter((r) => r.status === "failed").length;
  
  const avgSuccessRate = totalCount > 0 
    ? Math.round(workflows.reduce((acc, w) => acc + w.successRate, 0) / totalCount)
    : 100;

  // Search & Filter conditions
  const filteredWorkflows = workflows.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" ||
                       (activeTab === "favorites" && w.isFavorite) ||
                       (activeTab === "team" && w.id.includes("wf-")) || // Stub for team filters
                       (activeTab === "my" && !w.description.includes("Salesforce")); // Stub for personal filtering

    const firstStepType = w.steps[0]?.config?.triggerType || "";
    const matchesCategory = selectedCategory === "All" ||
                            (selectedCategory === "WhatsApp" && firstStepType === "whatsapp_message") ||
                            (selectedCategory === "Cron" && firstStepType === "schedule") ||
                            (selectedCategory === "API" && firstStepType === "api");

    return matchesSearch && matchesTab && matchesCategory;
  });

  // Sorting
  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    if (sortBy === "success") return b.successRate - a.successRate;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(); // "recent"
  });

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName.trim()) {
      addToast("Workflow name is required", "error");
      return;
    }

    const id = addWorkflow(newWfName, newWfDesc || "Custom configured automation pipeline.", newWfTrigger);
    addToast(`Workflow '${newWfName}' initialized successfully!`, "success");
    setNewWfName("");
    setNewWfDesc("");
    setShowCreateModal(false);
    
    // Redirect directly to node builder studio
    router.push(`/workflows/${id}`);
  };

  const handleTemplateSelect = (name: string, desc: string, trigger: "whatsapp_message" | "schedule" | "form_submit") => {
    const id = addWorkflow(name, desc, trigger);
    addToast(`Created '${name}' from recipe template!`, "success");
    router.push(`/workflows/${id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete workflow '${name}'?`)) {
      deleteWorkflow(id);
      addToast(`Workflow '${name}' deleted.`, "info");
    }
  };

  const handleDuplicate = (e: React.MouseEvent, wf: any) => {
    e.stopPropagation();
    const id = addWorkflow(`Copy of ${wf.name}`, wf.description, wf.steps[0]?.config?.triggerType || "whatsapp_message");
    // Copy steps
    const newSteps = wf.steps.slice(1).map((s: any) => ({
      ...s,
      id: `step-${Math.random().toString(36).substring(2, 9)}`,
    }));
    updateWorkflow(id, { steps: [wf.steps[0], ...newSteps] });
    addToast(`Duplicated workflow '${wf.name}' successfully.`, "success");
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: string, isFav: boolean) => {
    e.stopPropagation();
    updateWorkflow(id, { isFavorite: !isFav });
    addToast(isFav ? "Removed from favorites." : "Marked as favorite.", "info");
  };

  const handleExportJSON = (e: React.MouseEvent, wf: any) => {
    e.stopPropagation();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wf, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `expendmore-workflow-${wf.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast(`Exported workflow blueprint JSON.`, "success");
  };

  const handleImportJSONClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.name || !parsed.steps) {
          addToast("Invalid workflow blueprint structure", "error");
          return;
        }

        const id = addWorkflow(
          `Imported - ${parsed.name}`,
          parsed.description || "Imported recipe workflow.",
          parsed.steps[0]?.config?.triggerType || "whatsapp_message"
        );
        updateWorkflow(id, { steps: parsed.steps });
        addToast(`Workflow '${parsed.name}' imported successfully.`, "success");
      } catch (err) {
        addToast("Error parsing JSON file", "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <DashboardShell>
      <div className="p-6 md:p-8 max-w-[1280px] mx-auto w-full flex flex-col gap-6 pb-24 md:pb-8 font-sans select-none">
        
        {/* Header Title with Primary Actions */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-brand-border dark:border-border/50 pb-6">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-foreground">
              Automation Hub & Workflow Builder
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Create, connect, and audit visual workflows integrating AI logic and WhatsApp channels.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={handleImportJSONClick}
              size="sm"
              className="text-xs font-bold bg-white dark:bg-zinc-900 border border-brand-border dark:border-border text-foreground hover:bg-secondary h-9"
            >
              <Upload className="h-4 w-4 mr-1.5" />
              <span>Import</span>
            </Button>
            <Button
              variant="success"
              onClick={() => setShowCreateModal(true)}
              size="sm"
              className="text-xs font-bold bg-brand-green hover:bg-brand-green/90 text-white h-9"
            >
              <Plus className="h-4.5 w-4.5 mr-1" />
              <span>Create Workflow</span>
            </Button>
          </div>
        </div>

        {/* Bento Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 flex flex-col gap-1 text-left bg-card border border-border">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Total Pipelines</span>
            <span className="text-2xl font-extrabold text-foreground font-mono">{totalCount}</span>
            <span className="text-[8px] text-zinc-400">Total registered</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1 text-left bg-card border border-border">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Runs</span>
            <span className="text-2xl font-extrabold text-brand-sky font-mono">{activeCount}</span>
            <span className="text-[8px] text-emerald-500 font-medium">Auto-listening active</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1 text-left bg-card border border-border">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Draft Pipelines</span>
            <span className="text-2xl font-extrabold text-foreground font-mono">{draftCount}</span>
            <span className="text-[8px] text-zinc-400">Paused or inactive</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1 text-left bg-card border border-border">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Failures (Runs)</span>
            <span className="text-2xl font-extrabold text-destructive font-mono">{failedRunsCount}</span>
            <span className="text-[8px] text-zinc-400">Total recorded errors</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1 text-left bg-card border border-border">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Average Success Rate</span>
            <span className="text-2xl font-extrabold text-brand-green font-mono">{avgSuccessRate}%</span>
            <span className="text-[8px] text-emerald-500 font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              Optimal threshold
            </span>
          </Card>
        </div>

        {/* Dashboard Toolbar Section */}
        <div className="flex flex-col gap-4 border border-border bg-card rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
              {[
                { id: "all", label: "All Pipelines" },
                { id: "my", label: "My Workflows" },
                { id: "team", label: "Team Workflows" },
                { id: "favorites", label: "Starred Favorites" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer shrink-0 ${
                    activeTab === tab.id
                      ? "bg-brand-sky text-white font-extrabold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Categorized filter selection tags */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
              {["All", "WhatsApp", "Cron", "API"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer border ${
                    selectedCategory === cat
                      ? "bg-secondary border-border text-foreground font-bold shadow-sm"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat === "All" ? "All Triggers" : `${cat} Trigger`}
                </button>
              ))}
            </div>
          </div>

          {/* Search, Sort, and Grid/List view controls */}
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-grow w-full relative">
              <Search className="h-4.5 w-4.5 absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search workflows by pipeline name, descriptions, node triggers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-xl text-xs focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky text-foreground"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-xl text-xs text-muted-foreground focus:outline-none cursor-pointer"
              >
                <option value="recent">Recently Active Updates</option>
                <option value="success">Success Rate %</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>

              {/* View Selector buttons */}
              <div className="flex items-center border border-border rounded-xl p-0.5 bg-zinc-950/5">
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-2 rounded-lg cursor-pointer ${isGridView ? "bg-white dark:bg-zinc-800 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  title="Grid view"
                >
                  <Grid className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-2 rounded-lg cursor-pointer ${!isGridView ? "bg-white dark:bg-zinc-800 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  title="List view"
                >
                  <List className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Rendering list elements */}
          {sortedWorkflows.length === 0 ? (
            <div className="p-16 text-center text-xs text-muted-foreground italic border border-dashed border-border rounded-xl">
              No configured workflow pipelines match your filters. Create a new workflow or select a recipe template below.
            </div>
          ) : isGridView ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
              {sortedWorkflows.map((wf) => (
                <div
                  key={wf.id}
                  className="border border-border hover:border-brand-sky/40 bg-zinc-900/10 dark:bg-zinc-950/20 hover:shadow-md transition-all rounded-xl p-5 flex flex-col justify-between gap-4 select-none relative group/card"
                >
                  {/* Floating options icons on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center bg-zinc-950/90 border border-border rounded-lg text-muted-foreground select-none overflow-hidden z-20">
                    <button
                      onClick={(e) => handleToggleFavorite(e, wf.id, !!wf.isFavorite)}
                      className={`p-2 hover:bg-zinc-800 cursor-pointer ${wf.isFavorite ? "text-yellow-500" : ""}`}
                      title="Star favorite"
                    >
                      <Star className="h-4 w-4" fill={wf.isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={(e) => handleDuplicate(e, wf)}
                      className="p-2 hover:bg-zinc-800 hover:text-foreground cursor-pointer"
                      title="Duplicate pipeline"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleExportJSON(e, wf)}
                      className="p-2 hover:bg-zinc-800 hover:text-foreground cursor-pointer"
                      title="Export Blueprint JSON"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, wf.id, wf.name)}
                      className="p-2 hover:bg-zinc-800 hover:text-destructive cursor-pointer"
                      title="Delete pipeline"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 text-left">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col max-w-[80%]">
                        <Link 
                          href={`/workflows/${wf.id}`} 
                          className="font-bold text-foreground text-xs hover:text-brand-sky hover:underline leading-snug truncate"
                        >
                          {wf.name}
                        </Link>
                        <span className="text-[8px] font-bold font-mono text-muted-foreground bg-zinc-800 px-1.5 py-0.5 rounded leading-none w-max uppercase tracking-wider mt-1 select-none">
                          {wf.steps[0]?.config?.triggerType === "whatsapp_message" ? "WhatsApp Received" : wf.steps[0]?.config?.triggerType === "schedule" ? "Cron trigger" : "API Webhook"}
                        </span>
                      </div>
                      <div onClick={(e) => e.stopPropagation()} className="shrink-0 pt-0.5">
                        <Toggle
                          checked={wf.isActive}
                          onChange={() => {
                            toggleWorkflow(wf.id);
                            addToast(`Workflow '${wf.name}' is now ${!wf.isActive ? "active" : "inactive"}.`, "info");
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-1 h-14 overflow-hidden text-ellipsis line-clamp-3">
                      {wf.description}
                    </p>
                  </div>

                  {/* Summary of runs & connections statistics */}
                  <div className="flex flex-col gap-2 pt-2.5 border-t border-border/40 select-none">
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-muted-foreground uppercase leading-none">
                      <span>Runs: {wf.totalRuns}</span>
                      <span>Success: {wf.successRate}%</span>
                      <span>Nodes: {wf.steps.length}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => router.push(`/workflows/${wf.id}`)}
                        className="text-[9px] font-bold uppercase tracking-wider h-8"
                      >
                        Studio Canvas
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => router.push(`/workflows/${wf.id}?run=true`)}
                        className="text-[9px] font-bold uppercase tracking-wider h-8 flex items-center gap-1 justify-center bg-brand-navy text-white hover:bg-brand-navy/95"
                      >
                        <Play className="h-2.5 w-2.5 fill-current" />
                        <span>Run Test</span>
                      </Button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            /* LIST VIEW TABLE */
            <div className="border border-border rounded-xl overflow-hidden bg-zinc-900/10 mt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-zinc-900/60 text-muted-foreground select-none">
                    <th className="p-3.5 font-semibold">Workflow Name</th>
                    <th className="p-3.5 font-semibold">Trigger Entry</th>
                    <th className="p-3.5 font-semibold">Success Rate %</th>
                    <th className="p-3.5 font-semibold">Run Frequency</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedWorkflows.map((wf) => (
                    <tr key={wf.id} className="border-b border-border last:border-0 hover:bg-zinc-900/10">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2 text-left">
                          <Bot className="h-4.5 w-4.5 text-brand-sky animate-pulse shrink-0" />
                          <div className="flex flex-col">
                            <Link href={`/workflows/${wf.id}`} className="font-bold text-foreground hover:underline">
                              {wf.name}
                            </Link>
                            <span className="text-[9px] text-muted-foreground leading-normal mt-0.5 line-clamp-1">{wf.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-zinc-400 uppercase select-none text-[9px] font-bold">
                        {wf.steps[0]?.config?.triggerType || "manual"}
                      </td>
                      <td className="p-3.5 text-emerald-400 font-bold font-mono">
                        {wf.successRate}%
                      </td>
                      <td className="p-3.5 font-mono text-foreground">{wf.totalRuns} runs</td>
                      <td className="p-3.5 select-none">
                        <StatusChip status={wf.isActive ? "success" : "running"} />
                      </td>
                      <td className="p-3.5 text-center flex items-center gap-1.5 justify-center">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => router.push(`/workflows/${wf.id}`)}
                          className="text-[9px] h-7 px-2 uppercase font-bold"
                        >
                          Configure
                        </Button>
                        <button
                          onClick={(e) => handleToggleFavorite(e, wf.id, !!wf.isFavorite)}
                          className={`p-1.5 hover:bg-zinc-800 rounded transition-colors ${wf.isFavorite ? "text-yellow-500" : "text-muted-foreground"}`}
                        >
                          <Star className="h-4 w-4" fill={wf.isFavorite ? "currentColor" : "none"} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Recipes Templates Gallery Section */}
        <section className="flex flex-col gap-4 mt-6">
          <div className="flex justify-between items-center select-none border-b border-border/40 pb-2 text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-sky" />
              <h3 className="text-lg font-bold text-brand-navy dark:text-foreground">
                Official Workflow Recipe Templates
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">Select a baseline template recipe to import immediately</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-1">
            {/* Template Card A */}
            <Card
              onClick={() =>
                handleTemplateSelect(
                  "Abandoned Cart Recovery Outbound",
                  "Invokes automated customer reminders containing checkout URLs via WhatsApp template alerts when carts are left abandoned for over 60 minutes.",
                  "whatsapp_message"
                )
              }
              className="p-5 flex flex-col justify-between gap-5 cursor-pointer hover:border-brand-sky transition-all duration-200 border-outline-variant/60 text-left bg-card"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-brand-navy dark:text-foreground flex items-center gap-2">
                  <GitBranch className="h-4.5 w-4.5 text-brand-sky shrink-0 animate-pulse" />
                  <span>Abandoned Cart Recovery</span>
                </span>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Invokes automated customer reminders containing checkout URLs via WhatsApp template alerts when carts are left abandoned.
                </p>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-border/30">
                <span className="bg-brand-sky-light/10 text-brand-sky border border-brand-sky/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase select-none">
                  AI + WhatsApp
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </div>
            </Card>

            {/* Template Card B */}
            <Card
              onClick={() =>
                handleTemplateSelect(
                  "Intelligent Lead Qualifier Chatbot",
                  "Retrieves raw message alerts from incoming leads, processes intents via OpenAI adapters, and updates HubSpot record logs dynamically.",
                  "whatsapp_message"
                )
              }
              className="p-5 flex flex-col justify-between gap-5 cursor-pointer hover:border-brand-sky transition-all duration-200 border-outline-variant/60 text-left bg-card"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-brand-navy dark:text-foreground flex items-center gap-2">
                  <GitBranch className="h-4.5 w-4.5 text-brand-sky shrink-0 animate-pulse" />
                  <span>CRM Lead Qualification</span>
                </span>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Retrieves raw message alerts from incoming leads, processes intents via OpenAI adapters, and updates HubSpot record logs.
                </p>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-border/30">
                <span className="bg-brand-sky-light/10 text-brand-sky border border-brand-sky/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase select-none">
                  OpenAI / Claude
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </div>
            </Card>

            {/* Template Card C */}
            <Card
              onClick={() =>
                handleTemplateSelect(
                  "Cron Webhook Data Sync Manager",
                  "Automated scheduled cron node parsing active databases, running summary queries, and dispatching weekly email charts.",
                  "schedule"
                )
              }
              className="p-5 flex flex-col justify-between gap-5 cursor-pointer hover:border-brand-sky transition-all duration-200 border-outline-variant/60 text-left bg-card"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-brand-navy dark:text-foreground flex items-center gap-2">
                  <GitBranch className="h-4.5 w-4.5 text-brand-sky shrink-0 animate-pulse" />
                  <span>Scheduled Sync Summarizer</span>
                </span>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Automated scheduled cron node parsing active databases, running summary queries, and dispatching weekly email charts.
                </p>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-border/30">
                <span className="bg-brand-sky-light/10 text-brand-sky border border-brand-sky/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase select-none">
                  Utility Cron
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </div>
            </Card>
          </div>
        </section>

      </div>

      {/* CREATE WORKFLOW MODAL DIALOG */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-md w-full border border-brand-border dark:border-border shadow-2xl p-6 flex flex-col gap-4 text-left">
            <h3 className="text-lg font-bold text-brand-navy dark:text-foreground">Initialize Automation Pipeline</h3>
            <form onSubmit={handleCreateWorkflow} className="flex flex-col gap-4">
              <Input
                label="Workflow Pipeline Name"
                placeholder="e.g. Lead qualification filter"
                value={newWfName}
                onChange={(e) => setNewWfName(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-navy dark:text-foreground">Description notes</label>
                <textarea
                  placeholder="Explain what steps this pipeline automates..."
                  value={newWfDesc}
                  onChange={(e) => setNewWfDesc(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs leading-normal text-foreground focus:outline-none focus:border-brand-sky h-20 resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 select-none">
                <label className="text-xs font-semibold text-brand-navy dark:text-foreground">Select Baseline Trigger Gate</label>
                <select
                  value={newWfTrigger}
                  onChange={(e) => setNewWfTrigger(e.target.value as any)}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-brand-sky cursor-pointer"
                >
                  <option value="whatsapp_message">WhatsApp Message Received trigger</option>
                  <option value="schedule">Scheduled Cron Timing trigger</option>
                  <option value="form_submit">API HTTP Webhook inbound trigger</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-2 select-none">
                <Button variant="ghost" type="button" onClick={() => setShowCreateModal(false)} size="sm" className="text-xs uppercase font-bold">
                  Cancel
                </Button>
                <Button variant="success" type="submit" size="sm" className="text-xs uppercase font-bold bg-brand-green hover:bg-brand-green/90 text-white">
                  Generate Workflow
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
