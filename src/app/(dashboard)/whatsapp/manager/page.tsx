"use client";

import React, { useState, useMemo } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import { useWhatsappManager } from "@/store/use-whatsapp-manager";
import { useToast } from "@/store/use-toast";
import {
  Settings,
  Plus,
  Search,
  Filter,
  Layers,
  Table as TableIcon,
  X,
  Copy,
  Archive,
  Trash2,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Users,
  FileText,
  Send,
  Zap,
  Globe,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Shield,
  Key,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Activity,
  Calendar,
  Lock,
  WifiOff,
  UserCheck,
  Percent,
  Check,
  ExternalLink
} from "lucide-react";
import { MetaNumber, ManagerTemplate, ApiTokenScope } from "@/types/whatsapp-manager";

export default function WhatsappManagerPage() {
  const { addToast } = useToast();
  
  // Zustand Store variables
  const {
    profile,
    connectedNumbers,
    templates,
    webhookRegistry,
    apiTokens,
    compliance,
    auditLogs,
    health,
    backups,
    activeSimulatedState,
    updateProfile,
    registerNumber,
    deleteNumber,
    createTemplate,
    rotateTokenKey,
    updateWebhook,
    updateCompliance,
    createConfigBackup,
    restoreConfigBackup,
    setSimulatedState
  } = useWhatsappManager();

  // Navigation tab state: business | phones | templates | webhooks | compliance | diagnostics | audits
  const [activeTab, setActiveTab] = useState<"business" | "phones" | "templates" | "webhooks" | "compliance" | "diagnostics" | "audits">("business");

  // Modals visibility states
  const [showAddNumberModal, setShowAddNumberModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [auditModuleFilter, setAuditModuleFilter] = useState("all");

  // Add Number form states
  const [newNumPhone, setNewNumPhone] = useState("");
  const [newNumDisplay, setNewNumDisplay] = useState("");
  const [newNumLimit, setNewNumLimit] = useState("250/day");
  const [newNumPhoneId, setNewNumPhoneId] = useState("");
  const [newNumWabaId, setNewNumWabaId] = useState("");
  const [newNumToken, setNewNumToken] = useState("");

  // Create Template form states
  const [newTempName, setNewTempName] = useState("");
  const [newTempCat, setNewTempCat] = useState<"marketing" | "utility" | "authentication">("marketing");
  const [newTempLang, setNewTempLang] = useState("English (US)");
  const [newTempBody, setNewTempBody] = useState("");
  const [newTempHeaderType, setNewTempHeaderType] = useState<"none" | "text" | "media">("none");
  const [newTempHeaderText, setNewTempHeaderText] = useState("");
  const [newTempFooterText, setNewTempFooterText] = useState("");
  const [newTempBtnText, setNewTempBtnText] = useState("");
  const [newTempBtnVal, setNewTempBtnVal] = useState("");

  // API Manager Form states
  const [selectedTokenId, setSelectedTokenId] = useState<string>("tok-1");
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  // Filter templates list
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.bodyText.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, categoryFilter]);

  // Filter audits list
  const filteredAudits = useMemo(() => {
    return auditLogs.filter(a => {
      const matchesSearch = a.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = auditModuleFilter === "all" || a.module === auditModuleFilter;
      return matchesSearch && matchesModule;
    });
  }, [auditLogs, searchQuery, auditModuleFilter]);

  // Trigger Phone verification signup simulation
  const handleAddNumberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumPhone || !newNumDisplay || !newNumPhoneId || !newNumToken) {
      addToast("Display Name, Phone, Phone ID, and Access Token are required.", "warning");
      return;
    }

    try {
      const response = await fetch("/api/v1/whatsapp/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: newNumDisplay,
          phoneNumber: newNumPhone,
          phoneNumberId: newNumPhoneId,
          wabaId: newNumWabaId,
          accessToken: newNumToken
        })
      });

      if (!response.ok) {
        throw new Error("Failed to connect WhatsApp account on backend.");
      }

      registerNumber({
        phoneNumber: newNumPhone,
        displayName: newNumDisplay,
        verificationStatus: "verified",
        qualityRating: "Green (High)",
        messagingLimit: newNumLimit,
        healthStatus: "healthy"
      });

      addToast(`Connected WhatsApp number ${newNumDisplay} successfully!`, "success");
      setNewNumPhone("");
      setNewNumDisplay("");
      setNewNumPhoneId("");
      setNewNumWabaId("");
      setNewNumToken("");
      setShowAddNumberModal(false);
    } catch (err: any) {
      addToast(err.message || "Connection failed.", "error");
    }
  };

  // Submit Template Creation wizard
  const handleCreateTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTempName || !newTempBody) {
      addToast("Template name and body contents are required.", "warning");
      return;
    }

    const buttons: ManagerTemplate["buttons"] = [];
    if (newTempBtnText) {
      buttons.push({
        type: newTempCat === "marketing" ? "url" : "quick_reply",
        text: newTempBtnText,
        value: newTempBtnVal || undefined
      });
    }

    createTemplate({
      name: newTempName.toLowerCase().replace(/\s+/g, "_"),
      category: newTempCat,
      language: newTempLang,
      bodyText: newTempBody,
      headerType: newTempHeaderType,
      headerText: newTempHeaderText || undefined,
      footerText: newTempFooterText || undefined,
      buttons
    });

    addToast(`Template welcome_${newTempName} created. Sync status: APPROVED.`, "success");
    setNewTempName("");
    setNewTempBody("");
    setNewTempHeaderText("");
    setNewTempFooterText("");
    setNewTempBtnText("");
    setNewTempBtnVal("");
    setShowCreateTemplateModal(false);
  };

  // Export audit logs action
  const handleExportAudits = () => {
    addToast("Exported system audit logs to local telemetry JSON package.", "success");
  };

  return (
    <DashboardShell>
      
      {/* QA INTERACTIVE SYSTEM STATES CONTROLLERS PANEL */}
      <div className="bg-brand-navy text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none relative z-40 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#25D366]" />
          <span className="font-extrabold text-[10px] uppercase tracking-wider">QA System Diagnostics Sandbox:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {["Healthy", "Offline", "Maintenance", "Permission Error", "Disconnected", "Warning", "Critical"].map(st => (
            <button
              key={st}
              onClick={() => {
                setSimulatedState(st as any);
                addToast(`Simulated system state swamped: ${st.toUpperCase()}`, "info");
              }}
              className={`px-2.5 py-0.5 rounded font-bold text-[9px] cursor-pointer transition-all border ${
                activeSimulatedState === st
                  ? "bg-[#25D366] text-brand-navy border-white/20"
                  : "bg-white/10 text-zinc-300 border-transparent hover:bg-white/20"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER ALERTS LAYOUT OVERLAYS ACCORDING TO SYSTEM STATE STATE */}
      {activeSimulatedState === "Offline" && (
        <div className="bg-red-500 text-white py-2 px-6 flex items-center justify-center gap-2 text-xs font-bold text-center animate-pulse select-none">
          <WifiOff className="h-4 w-4" />
          <span>Connection offline. WhatsApp Cloud API servers socket reports offline connectivity boundaries. Live message pushes paused.</span>
        </div>
      )}

      {activeSimulatedState === "Warning" && (
        <div className="bg-amber-500 text-brand-navy py-2 px-6 flex items-center justify-center gap-2 text-xs font-bold text-center select-none">
          <AlertTriangle className="h-4 w-4" />
          <span>Approaching API Rate limit threshold bounds (+90% of daily total 100k messaging quota consumed).</span>
        </div>
      )}

      {activeSimulatedState === "Critical" && (
        <div className="bg-red-600 text-white py-2 px-6 flex items-center justify-center gap-2 text-xs font-bold text-center select-none">
          <AlertCircle className="h-4 w-4 animate-bounce" />
          <span>Webhook delivery failure rate spike detected (500 internal server logs reported). Automated chatbot triggers queue degraded.</span>
        </div>
      )}

      {activeSimulatedState === "Maintenance" ? (
        <div className="flex flex-col items-center justify-center text-center p-12 min-h-[60vh] select-none">
          <Lock className="h-14 w-14 text-zinc-400 mb-4 animate-bounce" />
          <h2 className="text-lg font-extrabold text-foreground">Scheduled System Maintenance Mode</h2>
          <p className="text-xs text-muted-foreground mt-2 max-w-sm">
            ExpendMore is currently undergoing scheduled platform updates. Meta Catalog synchronization and webhook APIs are locked. Returns shortly.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setSimulatedState("Healthy")}>
            Resume standard operation
          </Button>
        </div>
      ) : activeSimulatedState === "Permission Error" ? (
        <div className="flex flex-col items-center justify-center text-center p-12 min-h-[60vh] select-none">
          <Shield className="h-14 w-14 text-red-500 mb-4" />
          <h2 className="text-lg font-extrabold text-red-500">Access Restricted</h2>
          <p className="text-xs text-muted-foreground mt-2 max-w-sm">
            Access Denied. Your workspace role has insufficient permissions to modify WhatsApp settings configurations. Contact system administrator.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setSimulatedState("Healthy")}>
            Resume standard operation
          </Button>
        </div>
      ) : (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-sans select-none text-left">
          
          {/* HEADER AND DIAGNOSTICS ROW */}
          <div className="flex flex-col gap-4 border-b border-brand-border dark:border-border/40 pb-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#3B82F6]/10 text-[#3B82F6] rounded-lg border border-[#3B82F6]/20">
                    <Settings className="h-5 w-5" />
                  </span>
                  <h1 className="text-xl font-extrabold text-brand-navy dark:text-foreground tracking-tight">
                    WhatsApp Business Manager
                  </h1>
                  <span className="text-[9px] font-bold bg-[#3B82F6]/15 text-[#3B82F6] px-2 py-0.5 rounded-full uppercase border border-[#3B82F6]/20">
                    System Control
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-zinc-400">
                  Monitor Meta Cloud integration health, rotate credential tokens, compile compliant opt-in templates, and coordinate GDPR policy frameworks.
                </p>
              </div>

              {/* Health stats block */}
              <div className="flex items-center gap-2.5 self-start md:self-auto text-xs bg-brand-slate/40 dark:bg-zinc-900/40 p-2.5 border rounded-xl font-semibold text-brand-navy dark:text-zinc-200">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${health.apiStatus === "healthy" ? "bg-brand-green" : "bg-red-500 animate-ping"}`} />
                  <span>Meta Platform: <span className="font-bold">{health.apiStatus.toUpperCase()}</span></span>
                </div>
                <span className="text-zinc-300">|</span>
                <span>Latency: <span className="font-bold font-mono">{health.latencyMs}ms</span></span>
              </div>
            </div>
          </div>

          {/* NAVIGATION TABS ROW */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-brand-border dark:border-border/30 pb-1 shrink-0 overflow-x-auto select-none">
            {[
              { id: "business", label: "Business Details", icon: ShieldCheck },
              { id: "phones", label: "Numbers Manager", icon: Globe },
              { id: "templates", label: "WhatsApp Templates", icon: FileText },
              { id: "webhooks", label: "API & Webhooks", icon: Key },
              { id: "compliance", label: "GDPR & Compliance", icon: UserCheck },
              { id: "diagnostics", label: "Health & Backups", icon: Activity },
              { id: "audits", label: "Audit Trails", icon: Terminal }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold text-xs transition-all duration-200 cursor-pointer shrink-0 ${
                    activeTab === tab.id
                      ? "border-[#3B82F6] text-[#3B82F6]"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: BUSINESS SETTINGS PROFILE */}
          {activeTab === "business" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
              
              {/* Business profile card */}
              <Card className="lg:col-span-2 p-6 text-left flex flex-col gap-4">
                <div className="border-b pb-3">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Meta Business Credentials Profile</h3>
                  <span className="text-[10px] text-muted-foreground">General credentials mapping business website and category settings.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Business Name</span>
                    <Input
                      value={profile.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Operating Category</span>
                    <Input
                      value={profile.category}
                      onChange={(e) => updateProfile({ category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Business Email</span>
                    <Input
                      value={profile.email}
                      onChange={(e) => updateProfile({ email: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Display Phone</span>
                    <Input
                      value={profile.phone}
                      onChange={(e) => updateProfile({ phone: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Timezone (Meta sync)</span>
                    <Input
                      value={profile.timezone}
                      onChange={(e) => updateProfile({ timezone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Profile Description</span>
                  <textarea
                    value={profile.description}
                    onChange={(e) => updateProfile({ description: e.target.value })}
                    className="w-full p-2.5 text-xs border rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                    rows={2}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Address</span>
                  <Input
                    value={profile.address}
                    onChange={(e) => updateProfile({ address: e.target.value })}
                  />
                </div>

                <div className="border-t border-brand-border dark:border-border/20 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Meta Verification:</span>
                    <span className="text-[9px] font-extrabold bg-brand-green/10 text-brand-green border border-brand-green/20 px-2 py-0.5 rounded-full uppercase">
                      {profile.verificationStatus}
                    </span>
                  </div>
                  <Button
                    variant="success"
                    size="xs"
                    onClick={() => {
                      addToast("Configuration saved successfully", "success");
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </Card>

              {/* Workspace Permissions sidebar */}
              <Card className="lg:col-span-1 p-6 text-left flex flex-col gap-4">
                <div className="border-b pb-3">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Workspace Roles Privileges</h3>
                  <span className="text-[10px] text-muted-foreground">Access settings for registered team member types.</span>
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { role: "SUPER_ADMIN", access: "Full Control (Read/Write/Delete/Rotate)" },
                    { role: "ADMIN", access: "Read/Write templates & numbers. No tokens rotation" },
                    { role: "AGENT", access: "Read templates, send messages. No system writes" },
                    { role: "GUEST", access: "Read dashboard metrics only" }
                  ].map((priv, idx) => (
                    <div key={idx} className="bg-brand-slate/40 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-brand-border/60 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-brand-navy dark:text-foreground">{priv.role}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                      </div>
                      <p className="text-[10px] text-muted-foreground">{priv.access}</p>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          )}

          {/* TAB 2: CONNECTED NUMBERS MANAGER */}
          {activeTab === "phones" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              <div className="flex justify-between items-center select-none border-b pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Connected Meta phone numbers</h3>
                  <span className="text-[10px] text-muted-foreground">Review daily limits allocations and verify quality rankings.</span>
                </div>
                <Button
                  variant="success"
                  size="xs"
                  onClick={() => setShowAddNumberModal(true)}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Connect Phone Number
                </Button>
              </div>

              {/* Connected numbers cards grid */}
              {activeSimulatedState === "Disconnected" ? (
                <div className="text-center py-12 border border-dashed rounded-xl bg-brand-slate/10 dark:bg-zinc-950/20">
                  <Globe className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-foreground">No Connected Numbers</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Configure a phone number display ID and verify SMS OTP code to connect your first Meta Business Platform number node.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
                  {connectedNumbers.map(num => (
                    <Card key={num.id} className="p-5 flex flex-col justify-between gap-4 border border-brand-border dark:border-border/30">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div className="flex flex-col text-left">
                            <span className="text-[9px] font-bold text-zinc-400 font-mono">ID: {num.id}</span>
                            <h4 className="text-xs font-bold text-brand-navy dark:text-foreground line-clamp-1">{num.displayName}</h4>
                          </div>
                          
                          <span className={`inline-flex items-center gap-1 text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            num.healthStatus === "healthy" ? "bg-brand-green/10 text-brand-green border border-brand-green/20" :
                            num.healthStatus === "warning" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}>
                            {num.healthStatus}
                          </span>
                        </div>

                        <div className="flex flex-col text-[11px] font-semibold text-brand-navy dark:text-zinc-200 gap-1 mt-1 text-left">
                          <span>Phone: <span className="font-bold text-foreground font-mono">{num.phoneNumber}</span></span>
                          <span>Quality: <span className={`${num.qualityRating.includes("High") ? "text-brand-green" : num.qualityRating.includes("Medium") ? "text-amber-500" : "text-red-500"}`}>{num.qualityRating}</span></span>
                          <span>Messaging Limit: <span className="font-mono">{num.messagingLimit}</span></span>
                          <span className="text-[9px] text-zinc-400">Connected: {new Date(num.connectedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="border-t border-brand-border dark:border-border/20 pt-3 flex items-center justify-between">
                        <span className="text-[9px] text-zinc-400 font-extrabold uppercase">{num.verificationStatus}</span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon-xs"
                            title="Reconnect"
                            onClick={() => {
                              addToast("Re-authenticating display token settings...", "info");
                              setTimeout(() => addToast("Reconnected successfully", "success"), 1000);
                            }}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-xs"
                            className="text-red-500 border-red-500/10 hover:bg-red-500/10"
                            title="Remove"
                            onClick={() => {
                              deleteNumber(num.id);
                              addToast("Disconnected and removed number display setup.", "success");
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: WHATSAPP TEMPLATES MANAGER */}
          {activeTab === "templates" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-slate/40 dark:bg-zinc-900/40 border border-brand-border dark:border-border/30 p-3 rounded-xl select-none">
                <div className="flex items-center gap-3">
                  <div className="relative w-56">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                      <Search className="h-3.5 w-3.5 text-zinc-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 text-xs bg-white dark:bg-zinc-950 border border-brand-border dark:border-border/40 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-8 px-2 border border-brand-border dark:border-border/40 rounded-lg text-[10px] font-bold bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="marketing">Marketing</option>
                    <option value="utility">Utility</option>
                    <option value="authentication">Authentication</option>
                  </select>
                </div>

                <Button
                  variant="success"
                  size="xs"
                  onClick={() => setShowCreateTemplateModal(true)}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Create Template
                </Button>
              </div>

              {/* Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none">
                {filteredTemplates.map(temp => (
                  <Card key={temp.id} className="p-4 flex flex-col justify-between gap-4 border border-brand-border dark:border-border/30 text-left">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-zinc-400 font-mono uppercase tracking-wider">{temp.category}</span>
                          <h4 className="text-xs font-bold text-brand-navy dark:text-foreground line-clamp-1">{temp.name}</h4>
                        </div>
                        
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                          temp.status === "approved" ? "bg-brand-green/10 text-brand-green border-brand-green/20" :
                          temp.status === "pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-red-500/10 text-red-500"
                        }`}>
                          {temp.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Message preview details overlay bubble */}
                      <div className="bg-zinc-50 dark:bg-zinc-900 border p-3 rounded-lg flex flex-col gap-1 mt-1">
                        {temp.headerText && <span className="font-extrabold text-[10px] text-brand-navy dark:text-zinc-100">{temp.headerText}</span>}
                        <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-normal font-mono whitespace-pre-wrap">{temp.bodyText}</p>
                        {temp.footerText && <span className="text-[9px] text-zinc-400">{temp.footerText}</span>}
                        
                        {temp.buttons.length > 0 && (
                          <div className="border-t border-brand-border dark:border-border/30 pt-2 mt-1.5 flex flex-col gap-1.5">
                            {temp.buttons.map((btn, idx) => (
                              <div key={idx} className="flex justify-center items-center gap-1 py-1 bg-white dark:bg-zinc-950 border border-brand-border/40 rounded text-[9px] font-bold text-[#3B82F6]">
                                <ExternalLink className="h-3 w-3" />
                                {btn.text}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-brand-border dark:border-border/20 pt-2.5 flex items-center justify-between">
                      <span className="text-[9px] text-zinc-400 font-mono">Lang: {temp.language}</span>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        className="text-red-500 border-red-500/10 hover:bg-red-500/15"
                        onClick={() => {
                          // Quick delete template
                          addToast(`Deleted template welcomed_${temp.name}`, "success");
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: API MANAGER & WEBHOOK CENTER */}
          {activeTab === "webhooks" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
              
              {/* Webhooks config panel */}
              <Card className="lg:col-span-6 p-6 text-left flex flex-col gap-4">
                <div className="border-b pb-3">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Meta Webhook Center settings</h3>
                  <span className="text-[10px] text-muted-foreground">Subscribe endpoint routes and view active diagnostic signature keys.</span>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Webhook URL (Callback)</span>
                    <Input
                      value={webhookRegistry.url}
                      onChange={(e) => updateWebhook({ url: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 relative">
                    <span className="text-[10px] font-bold text-[#3B82F6] uppercase">Signature Token secret</span>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type={showWebhookSecret ? "text" : "password"}
                        value={webhookRegistry.secret}
                        readOnly
                      />
                      <Button variant="outline" size="xs" onClick={() => setShowWebhookSecret(!showWebhookSecret)}>
                        {showWebhookSecret ? "Hide" : "Reveal"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Subscribed Event Triggers</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-brand-navy dark:text-zinc-200">
                      {["messages.received", "messages.sent", "messages.status.delivered", "messages.status.read", "templates.status.updated", "quality.ratings.degraded"].map(evt => (
                        <label key={evt} className="flex items-center gap-2 cursor-pointer hover:bg-brand-slate/20 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={webhookRegistry.subscribedEvents.includes(evt)}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...webhookRegistry.subscribedEvents, evt]
                                : webhookRegistry.subscribedEvents.filter(x => x !== evt);
                              updateWebhook({ subscribedEvents: updated });
                            }}
                            className="h-3 w-3 rounded text-[#3B82F6]"
                          />
                          <span>{evt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* API tokens manager card */}
              <Card className="lg:col-span-6 p-6 text-left flex flex-col gap-4">
                <div className="border-b pb-3 flex items-center justify-between select-none">
                  <div>
                    <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Access API Tokens</h3>
                    <span className="text-[10px] text-muted-foreground">Keys to authenticate external client platforms.</span>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => rotateTokenKey(selectedTokenId)}
                    leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                  >
                    Rotate Token Key
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 bg-brand-slate/40 dark:bg-zinc-900/40 p-1 border rounded-lg select-none">
                    {apiTokens.map(tok => (
                      <button
                        key={tok.id}
                        onClick={() => setSelectedTokenId(tok.id)}
                        className={`flex-1 text-[10px] py-1.5 font-bold rounded cursor-pointer ${selectedTokenId === tok.id ? "bg-white dark:bg-zinc-950 text-foreground border shadow-xs" : "text-muted-foreground"}`}
                      >
                        {tok.id === "tok-1" ? "Live Production" : "Sandbox Testing"}
                      </button>
                    ))}
                  </div>

                  {apiTokens.filter(t => t.id === selectedTokenId).map(tok => (
                    <div key={tok.id} className="flex flex-col gap-3 text-left">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Access Token Key</span>
                        <div className="flex items-center gap-1.5">
                          <Input
                            value={tok.tokenValue}
                            readOnly
                            className="font-mono text-[10px]"
                          />
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => {
                              navigator.clipboard.writeText(tok.tokenValue);
                              addToast("Token copied to system clipboard", "success");
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Assigned Scopes</span>
                        <div className="flex flex-wrap gap-1">
                          {tok.scopes.map((sc, i) => (
                            <span key={i} className="text-[9px] font-mono font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 px-2 py-0.5 rounded-full">
                              {sc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-[9px] text-zinc-400 font-mono mt-1 select-none">
                        Expires: {new Date(tok.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          )}

          {/* TAB 5: COMPLIANCE GDPR SETTINGS */}
          {activeTab === "compliance" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
              
              {/* GDPR consents settings */}
              <Card className="lg:col-span-7 p-6 text-left flex flex-col gap-4">
                <div className="border-b pb-3">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">GDPR & User Consent Preferences</h3>
                  <span className="text-[10px] text-muted-foreground">Automated customer opt-in and opt-out keyword detection rules.</span>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b pb-3 select-none">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground">Require Consent Confirmation</span>
                      <p className="text-[10px] text-zinc-400 leading-normal max-w-sm mt-0.5">
                        Incoming customer chat contacts must receive and accept opt-in terms before marketing templates can be sent.
                      </p>
                    </div>
                    <Toggle
                      checked={compliance.gdprConsentRequired}
                      onChange={() => updateCompliance({ gdprConsentRequired: !compliance.gdprConsentRequired })}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 select-none">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Opt-In Welcome template</span>
                    <select
                      value={compliance.optInTemplateId || ""}
                      onChange={(e) => updateCompliance({ optInTemplateId: e.target.value })}
                      className="h-9 px-2 border rounded-xl text-xs bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                    >
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t">
                    <span className="text-[10px] font-bold text-[#3B82F6] uppercase">Opt-Out Keywords (Comma separated)</span>
                    <Input
                      value={compliance.optOutKeywords.join(", ")}
                      onChange={(e) => {
                        const words = e.target.value.split(",").map(w => w.trim()).filter(Boolean);
                        updateCompliance({ optOutKeywords: words });
                      }}
                    />
                  </div>
                </div>
              </Card>

              {/* Data retention matrix cards */}
              <Card className="lg:col-span-5 p-6 text-left flex flex-col gap-4 justify-between">
                <div className="flex flex-col gap-3">
                  <div className="border-b pb-3">
                    <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Retention Policy Rules</h3>
                    <span className="text-[10px] text-muted-foreground">Automatic purging cycles for system data elements.</span>
                  </div>

                  <div className="flex flex-col gap-3.5 mt-2 select-none">
                    {compliance.dataRetentionPolicies.map((pol, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-brand-slate/40 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-brand-border/60 text-xs">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-brand-navy dark:text-foreground">{pol.dataType}</span>
                          <span className="text-[9px] text-zinc-400">Purging: after {pol.retentionPeriodMonths} months</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${pol.autoDeleteEnabled ? "bg-brand-green/10 text-brand-green" : "bg-zinc-400/10 text-zinc-400"}`}>
                          {pol.autoDeleteEnabled ? "Auto Clear" : "Manual Purge"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-sky-light/10 text-[#3B82F6] border border-[#3B82F6]/20 p-2.5 rounded-lg text-[10px] leading-relaxed mt-4">
                  🛡️ GDPR Compliant: opt-out triggers automatically unsubscribe WhatsApp contacts inside CRM, blocking messaging queues.
                </div>
              </Card>

            </div>
          )}

          {/* TAB 6: DIAGNOSTICS & SYSTEM BACKUPS */}
          {activeTab === "diagnostics" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
              
              {/* Backups manager list */}
              <Card className="lg:col-span-7 p-6 text-left flex flex-col gap-4">
                <div className="border-b pb-3 flex items-center justify-between select-none">
                  <div>
                    <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Configuration Backups</h3>
                    <span className="text-[10px] text-muted-foreground">Historical configuration logs. Create and restore settings.</span>
                  </div>
                  <Button
                    variant="success"
                    size="xs"
                    onClick={() => {
                      createConfigBackup();
                      addToast("Backup configuration snapshot created.", "success");
                    }}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Create Configuration Backup
                  </Button>
                </div>

                <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
                  {backups.map(bak => (
                    <div key={bak.id} className="flex justify-between items-center bg-brand-slate/40 dark:bg-zinc-900/50 p-3 rounded-xl border border-brand-border/60 text-xs">
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-brand-navy dark:text-foreground">{bak.filename}</span>
                        <span className="text-[9px] text-zinc-400 font-mono">Date: {new Date(bak.createdAt).toLocaleString()} | size: {bak.sizeKb} KB</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          bak.status === "restored" ? "bg-brand-sky/10 text-brand-sky border-brand-sky/20" : "bg-brand-green/10 text-brand-green border-brand-green/20"
                        }`}>
                          {bak.status}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => {
                            restoreConfigBackup(bak.id);
                            addToast("Settings restored to snapshot configurations state", "success");
                          }}
                        >
                          Restore
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Health statistics charts */}
              <Card className="lg:col-span-5 p-6 text-left flex flex-col gap-4 justify-between select-none">
                <div className="flex flex-col gap-3">
                  <div className="border-b pb-3">
                    <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">System Health Diagnostics</h3>
                    <span className="text-[10px] text-muted-foreground">Telemetries latency and API availability metrics.</span>
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">API Latency Meter:</span>
                      <span className="font-mono font-bold text-foreground">{health.latencyMs} ms</span>
                    </div>

                    {/* SVG Speed Latency Gauge */}
                    <div className="w-full flex items-center justify-center py-4 relative">
                      <svg className="w-28 h-28" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="rgba(150,150,150,0.1)" strokeWidth="3" />
                        
                        {/* Gauge pointer stroke dasharray */}
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="transparent"
                          stroke={health.latencyMs > 200 ? "#EF4444" : "#25D366"}
                          strokeWidth="3.2"
                          strokeDasharray={`${Math.max(10, Math.min(100, Math.round((250 - health.latencyMs) / 2.5)))} 100`}
                          strokeDashoffset="25"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center select-none pt-2">
                        <span className="text-[8px] uppercase tracking-wider text-zinc-400">Response</span>
                        <span className="text-xs font-mono font-extrabold text-foreground">{health.latencyMs > 0 ? `${health.latencyMs}ms` : "Down"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex justify-between items-center text-[10px] bg-zinc-50 dark:bg-zinc-900 border p-2 rounded-lg">
                        <span>API Health:</span>
                        <span className={`font-bold font-mono ${health.apiStatus === "healthy" ? "text-brand-green" : "text-red-500"}`}>{health.apiStatus.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] bg-zinc-50 dark:bg-zinc-900 border p-2 rounded-lg">
                        <span>Active System Errors:</span>
                        <span className={`font-bold font-mono ${health.activeErrorsCount > 0 ? "text-red-500" : "text-brand-green"}`}>{health.activeErrorsCount} logs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-brand-border dark:border-border/20 pt-4 text-center text-[10px] text-zinc-400 font-mono">
                  Last configurations backup: {new Date(health.lastBackupAt).toLocaleDateString()}
                </div>
              </Card>

            </div>
          )}

          {/* TAB 7: SYSTEM AUDIT LOGS */}
          {activeTab === "audits" && (
            <Card className="p-6 text-left animate-fadeIn">
              
              {/* Audit logs header & searches */}
              <div className="border-b pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">System Audit Trails logs</h3>
                  <span className="text-[10px] text-muted-foreground">Audit records capturing workspace administrator activities and rotated key logs.</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-48">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                      <Search className="h-3.5 w-3.5 text-zinc-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search audits..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-8 pl-7 pr-3 text-[10px] bg-white dark:bg-zinc-950 border border-brand-border dark:border-border/40 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                    />
                  </div>

                  <select
                    value={auditModuleFilter}
                    onChange={(e) => setAuditModuleFilter(e.target.value)}
                    className="h-8 px-2 border border-brand-border dark:border-border/40 rounded-lg text-[9px] font-bold bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="all">All Modules</option>
                    <option value="Business Profile">Business Profile</option>
                    <option value="Phone Manager">Phone Manager</option>
                    <option value="Template Manager">Template Manager</option>
                    <option value="Webhook Center">Webhook Center</option>
                    <option value="API Manager">API Manager</option>
                    <option value="System Backups">System Backups</option>
                  </select>

                  <Button
                    variant="outline"
                    size="xs"
                    onClick={handleExportAudits}
                    leftIcon={<Download className="h-3.5 w-3.5" />}
                  >
                    Export JSON
                  </Button>
                </div>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto max-h-screen overflow-y-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Admin</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Module</th>
                      <th className="py-2.5 px-3">Details Log</th>
                      <th className="py-2.5 px-3 text-right">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-brand-navy dark:text-zinc-300 font-mono text-[10px]">
                    {filteredAudits.map(aud => (
                      <tr key={aud.id} className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                        <td className="py-3 px-3 text-zinc-400">{new Date(aud.timestamp).toLocaleTimeString()}</td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col text-[9px] font-sans">
                            <span className="font-bold text-foreground">{aud.actorName}</span>
                            <span className="text-zinc-400 font-mono text-[8px]">{aud.actorRole}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-brand-navy dark:text-foreground">{aud.action}</td>
                        <td className="py-3 px-3 text-muted-foreground font-sans text-[9px]">{aud.module}</td>
                        <td className="py-3 px-3 text-zinc-400 font-sans text-[9px]">{aud.details}</td>
                        <td className="py-3 px-3 text-right text-zinc-400">{aud.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        </div>
      )}

      {/* MODAL 1: ADD PHONE NUMBER DISPLAY SETUP */}
      {showAddNumberModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn select-none">
          <Card className="w-full max-w-md p-6 flex flex-col gap-4 m-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Register Phone number setup</h4>
              <button onClick={() => setShowAddNumberModal(false)} className="p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 rounded">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleAddNumberSubmit} className="flex flex-col gap-3 text-left">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Verification Display Name *</span>
                <Input
                  value={newNumDisplay}
                  onChange={(e) => setNewNumDisplay(e.target.value)}
                  placeholder="e.g. Anshuman Outbound Billing"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Phone Number *</span>
                <Input
                  value={newNumPhone}
                  onChange={(e) => setNewNumPhone(e.target.value)}
                  placeholder="e.g. +91 99999 77777"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Phone Number ID *</span>
                <Input
                  value={newNumPhoneId}
                  onChange={(e) => setNewNumPhoneId(e.target.value)}
                  placeholder="Meta Phone Number ID"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">WhatsApp Business Account ID</span>
                <Input
                  value={newNumWabaId}
                  onChange={(e) => setNewNumWabaId(e.target.value)}
                  placeholder="Meta WABA ID (Optional)"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Meta Access Token *</span>
                <Input
                  value={newNumToken}
                  onChange={(e) => setNewNumToken(e.target.value)}
                  placeholder="eaab..."
                  type="password"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Messaging limit</span>
                <select
                  value={newNumLimit}
                  onChange={(e) => setNewNumLimit(e.target.value)}
                  className="h-9 px-2 border rounded-xl text-xs bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                >
                  <option value="250/day">Sandbox Limit (250/day)</option>
                  <option value="10k/day">Verified Standard (10k/day)</option>
                  <option value="100k/day">Verified Enterprise (100k/day)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 border-t pt-4">
                <Button type="submit" variant="success" size="sm" className="flex-1">
                  Connect & Verify Number
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddNumberModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>

          </Card>
        </div>
      )}

      {/* MODAL 2: CREATE TEMPLATE MESSAGE WIZARD */}
      {showCreateTemplateModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn select-none">
          <Card className="w-full max-w-xl p-6 flex flex-col gap-4 m-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Create WhatsApp Template wizard</h4>
              <button onClick={() => setShowCreateTemplateModal(false)} className="p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 rounded">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplateSubmit} className="flex flex-col gap-4 text-left max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Template Name *</span>
                  <Input
                    value={newTempName}
                    onChange={(e) => setNewTempName(e.target.value)}
                    placeholder="e.g. shipping_notification"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Category *</span>
                  <select
                    value={newTempCat}
                    onChange={(e) => setNewTempCat(e.target.value as any)}
                    className="h-9 px-2 border rounded-xl text-xs bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="marketing">Marketing</option>
                    <option value="utility">Utility</option>
                    <option value="authentication">Authentication</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Header Type</span>
                  <select
                    value={newTempHeaderType}
                    onChange={(e) => setNewTempHeaderType(e.target.value as any)}
                    className="h-9 px-2 border rounded-xl text-xs bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="none">None</option>
                    <option value="text">Text Heading</option>
                    <option value="media">Media Header Attachment</option>
                  </select>
                </div>

                {newTempHeaderType === "text" && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Header Text</span>
                    <Input
                      value={newTempHeaderText}
                      onChange={(e) => setNewTempHeaderText(e.target.value)}
                      placeholder="e.g. Shipment Alert"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Message Body Text *</span>
                <textarea
                  value={newTempBody}
                  onChange={(e) => setNewTempBody(e.target.value)}
                  className="w-full p-2.5 text-xs border rounded-xl bg-white dark:bg-zinc-950 text-foreground"
                  rows={4}
                  placeholder="Use variables like {{1}} or {{2}} for dynamic CRM values. e.g. Hello {{1}}! Your order {{2}} has been shipped."
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 border-t pt-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Footer Note text</span>
                <Input
                  value={newTempFooterText}
                  onChange={(e) => setNewTempFooterText(e.target.value)}
                  placeholder="e.g. Reply STOP to opt-out"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Button CTA text</span>
                  <Input
                    value={newTempBtnText}
                    onChange={(e) => setNewTempBtnText(e.target.value)}
                    placeholder="e.g. Visit Shop"
                  />
                </div>
                {newTempBtnText && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Button URL Link / Phone</span>
                    <Input
                      value={newTempBtnVal}
                      onChange={(e) => setNewTempBtnVal(e.target.value)}
                      placeholder="e.g. https://expendmore.ai"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t pt-4">
                <Button type="submit" variant="success" size="sm" className="flex-1">
                  Request Meta Approval
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateTemplateModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </DashboardShell>
  );
}
