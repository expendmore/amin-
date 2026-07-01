"use client";

import React, { useState, useMemo, useEffect } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import { useIntegrations } from "@/store/use-integrations";
import { useToast } from "@/store/use-toast";
import {
  Blocks,
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
  Link,
  Sliders,
  Check,
  Info
} from "lucide-react";
import { IntegrationApp, AppConnection, AppCredential, WebhookEndpoint, ConnectionLog } from "@/types/integrations";

export default function IntegrationsPage() {
  const { addToast } = useToast();

  // Zustand Store variables
  const {
    apps,
    connections,
    credentials,
    webhooks,
    connectionLogs,
    monitoring,
    connectApp,
    disconnectApp,
    toggleConnectionActive,
    rotateCredential,
    updateWebhookSettings
  } = useIntegrations();

  // Navigation tab state: dashboard | marketplace | connected | credentials | webhooks | logs
  const [activeTab, setActiveTab] = useState<"dashboard" | "marketplace" | "connected" | "credentials" | "webhooks" | "logs">("dashboard");

  // Marketplace states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAppId, setSelectedAppId] = useState<string | null>("app-1"); // active details inspector
  
  // Connection Wizard states
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardAppId, setWizardAppId] = useState<string | null>(null);
  const [wizardConnName, setWizardConnName] = useState("");
  const [wizardAuthType, setWizardAuthType] = useState<AppCredential["authType"]>("api_key");
  const [wizardKeyValue, setWizardKeyValue] = useState("");
  const [wizardScopes, setWizardScopes] = useState<string[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testConnectionSuccess, setTestConnectionSuccess] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  // Webhooks states
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  // Compute metrics
  const stats = useMemo(() => {
    const installed = connections.length;
    const active = connections.filter(c => c.status === "connected").length;
    const fails = connections.filter(c => c.status === "permission_error").length;
    
    // Average Latency of active connections
    const activeConns = connections.filter(c => c.status === "connected");
    const avgLatency = activeConns.length > 0
      ? Math.round(activeConns.reduce((sum, c) => sum + c.latencyMs, 0) / activeConns.length)
      : 0;

    return { installed, active, fails, avgLatency };
  }, [connections]);

  // Selected App details memo
  const activeApp = useMemo(() => {
    return apps.find(a => a.id === selectedAppId) || null;
  }, [apps, selectedAppId]);

  const activeAppConnection = useMemo(() => {
    if (!activeApp) return null;
    return connections.find(c => c.appId === activeApp.id) || null;
  }, [connections, activeApp]);

  // Filter apps list
  const filteredApps = useMemo(() => {
    return apps.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || a.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [apps, searchQuery, selectedCategory]);

  // Filter connection logs list
  const filteredLogs = useMemo(() => {
    return connectionLogs.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [connectionLogs, searchQuery]);

  // Categories list
  const categories = [
    "AI", "CRM", "Communication", "Marketing", "Cloud Storage", "Databases", "Payments", "Developer", "Analytics", "Productivity", "Social Media"
  ];

  // Initiate Connection Wizard
  const startConnectionWizard = (appId: string) => {
    const targetApp = apps.find(a => a.id === appId);
    if (!targetApp) return;

    setWizardAppId(appId);
    setWizardConnName(`${targetApp.name} Connection`);
    setWizardAuthType(targetApp.category === "AI" ? "bearer_token" : targetApp.category === "Payments" ? "api_key" : "oauth");
    setWizardKeyValue("");
    setWizardScopes(targetApp.features);
    setWizardStep(1);
    setTestConnectionSuccess(false);
    setTestProgress(0);
    setShowWizardModal(true);
  };

  // Run Latency Testing progress simulation
  const runConnectionTest = () => {
    setIsTestingConnection(true);
    setTestProgress(0);
    
    const interval = setInterval(() => {
      setTestProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTestingConnection(false);
          setTestConnectionSuccess(true);
          addToast("API handshake successful. Latency: 92ms", "success");
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // Complete Connection Wizard
  const finishConnectionWizard = () => {
    if (!wizardAppId) return;

    connectApp({
      appId: wizardAppId,
      connectionName: wizardConnName || "External App",
      authType: wizardAuthType,
      keyValue: wizardKeyValue || "mock_credential_key_xyz",
      scopes: wizardScopes
    });

    addToast("App connection successfully established", "success");
    setShowWizardModal(false);
    setActiveTab("connected");
  };

  return (
    <DashboardShell>
      <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-sans select-none text-left">
        
        {/* HEADER BLOCK */}
        <div className="flex flex-col gap-4 border-b border-brand-border dark:border-border/40 pb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg border border-[#8B5CF6]/20">
                  <Blocks className="h-5 w-5" />
                </span>
                <h1 className="text-xl font-extrabold text-brand-navy dark:text-foreground tracking-tight">
                  Enterprise Integrations Hub
                </h1>
                <span className="text-[9px] font-bold bg-[#8B5CF6]/15 text-[#8B5CF6] px-2 py-0.5 rounded-full uppercase border border-[#8B5CF6]/20">
                  App Ecosystem
                </span>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-zinc-400">
                Connect external cloud services, monitor API handshake latency, rotate cryptographic keys, and review outgoing webhooks logs.
              </p>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <select
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  addToast("Applied marketplace category filter", "info");
                }}
                value={selectedCategory}
                className="h-8 px-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-[10px] font-bold text-foreground cursor-pointer focus:outline-none"
              >
                <option value="all">Marketplace Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Button
                variant="success"
                size="xs"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("marketplace");
                }}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Install Integrations
              </Button>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS ROW */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-brand-border dark:border-border/30 pb-1 shrink-0 overflow-x-auto select-none">
          {[
            { id: "dashboard", label: "Hub Dashboard", icon: BarChart3 },
            { id: "marketplace", label: "App Marketplace", icon: Layers },
            { id: "connected", label: "Connected Apps", icon: Link },
            { id: "credentials", label: "Credential Vault", icon: Key },
            { id: "webhooks", label: "Webhook Manager", icon: Sliders },
            { id: "logs", label: "Connection Audits", icon: Terminal }
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
                    ? "border-[#8B5CF6] text-[#8B5CF6]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: HUB DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Bento metrics counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
              <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider font-mono">Installed Integrations</span>
                <span className="text-3xl font-extrabold text-foreground font-mono">{stats.installed} connected</span>
                <span className="text-[9px] font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded-full self-start flex items-center gap-0.5 mt-2">
                  Active now: {stats.active}
                </span>
              </Card>

              <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider font-mono">Failed connections</span>
                <span className="text-3xl font-extrabold text-red-500 font-mono">{stats.fails} errors</span>
                <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full self-start mt-2">
                  Expirations warning
                </span>
              </Card>

              <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider font-mono">Average Latency</span>
                <span className="text-3xl font-extrabold text-foreground font-mono">{stats.avgLatency} ms</span>
                <span className="text-[9px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full self-start mt-2">
                  Handshake rate: Optimal
                </span>
              </Card>

              <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider font-mono">Connection Health</span>
                <span className="text-3xl font-extrabold text-brand-green font-mono">94%</span>
                <span className="text-[9px] font-bold text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-full self-start mt-2">
                  Uptime checklist OK
                </span>
              </Card>
            </div>

            {/* Popular and failed apps grids */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Popular Apps lists */}
              <Card className="lg:col-span-8 p-6 text-left flex flex-col gap-4">
                <div className="border-b pb-3 select-none">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Ecosystem Health Overview</h3>
                  <span className="text-[10px] text-muted-foreground">Marketplace popular tools synchronization status.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apps.slice(0, 4).map(app => {
                    const conn = connections.find(c => c.appId === app.id);
                    return (
                      <div key={app.id} className="flex justify-between items-center bg-brand-slate/40 dark:bg-zinc-900/50 p-3 rounded-xl border border-brand-border/60">
                        <div className="flex items-center gap-2.5">
                          <img src={app.logoUrl} className="w-8 h-8 object-cover rounded border" />
                          <div className="flex flex-col text-left">
                            <span className="text-[8px] font-extrabold text-zinc-400 uppercase font-mono">{app.category}</span>
                            <span className="text-xs font-bold text-brand-navy dark:text-foreground">{app.name}</span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                          conn?.status === "connected" ? "bg-brand-green/10 text-brand-green border-brand-green/20" :
                          conn?.status === "permission_error" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          "bg-zinc-500/10 text-zinc-400 border-border"
                        }`}>
                          {conn ? conn.status : "Not Installed"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Troubleshooting alerts */}
              <Card aiGlow className="lg:col-span-4 p-6 text-left flex flex-col justify-between">
                <div className="flex flex-col gap-2.5">
                  <span className="p-1 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-lg self-start text-[#8B5CF6]">
                    <AlertTriangle className="h-5 w-5 animate-pulse" />
                  </span>
                  <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground mt-2">Active Connection Alerts</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Some connections report permission or verification errors. Automated workflows relying on Google Drive backup nodes may fail.
                  </p>

                  <div className="flex flex-col gap-2 mt-1 select-none">
                    {connections.filter(c => c.status !== "connected").map(c => (
                      <div key={c.id} className="flex justify-between items-center text-[10px] bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-red-500 font-bold">
                        <span>{c.name}</span>
                        <span className="text-[9px] font-mono">{c.status.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="xs"
                  className="mt-4 w-full"
                  onClick={() => {
                    // Quick rotate keys to solve errors
                    connections.forEach(c => {
                      if (c.status !== "connected") {
                        toggleConnectionActive(c.id);
                      }
                    });
                    addToast("Reauthorized credentials locks. Connected.", "success");
                  }}
                >
                  Re-Authenticate Failed Apps
                </Button>
              </Card>

            </div>

          </div>
        )}

        {/* TAB 2: APP MARKETPLACE */}
        {activeTab === "marketplace" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Categories and Grid layout main body */}
            <div className="lg:col-span-8 flex flex-col gap-5 text-left">
              
              {/* Search marketplace */}
              <div className="flex items-center justify-between gap-4 bg-brand-slate/40 dark:bg-zinc-900/40 border border-brand-border dark:border-border/30 p-3 rounded-xl select-none">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-zinc-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search marketplace apps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 text-xs bg-white dark:bg-zinc-950 border border-brand-border dark:border-border/40 rounded-lg text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Marketplace items list grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                {filteredApps.map(app => (
                  <Card
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-4 flex flex-col justify-between gap-3 cursor-pointer border transition-all ${selectedAppId === app.id ? "border-[#8B5CF6] bg-brand-slate/20 dark:bg-zinc-900/40" : "border-brand-border dark:border-border/30 hover:border-zinc-300"}`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2.5">
                        <img src={app.logoUrl} className="w-8 h-8 object-cover rounded border" />
                        <div className="flex flex-col text-left">
                          <span className="text-[8px] font-extrabold text-[#8B5CF6] uppercase font-mono">{app.category}</span>
                          <h4 className="text-xs font-bold text-brand-navy dark:text-foreground line-clamp-1">{app.name}</h4>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal line-clamp-2 h-7">{app.description}</p>
                    </div>

                    <div className="border-t border-brand-border dark:border-border/20 pt-2 flex items-center justify-between">
                      <span className="text-[8px] text-zinc-400 font-mono">Dev: {app.developer}</span>
                      {app.isInstalled ? (
                        <span className="text-[8px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full border border-brand-green/20">INSTALLED</span>
                      ) : (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            startConnectionWizard(app.id);
                          }}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar details inspector */}
            <Card className="lg:col-span-4 p-6 text-left flex flex-col justify-between gap-4">
              {activeApp ? (
                <div className="flex flex-col gap-4">
                  <div className="border-b pb-3 flex items-center gap-3">
                    <img src={activeApp.logoUrl} className="w-10 h-10 object-cover rounded border" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase">{activeApp.category}</span>
                      <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground">{activeApp.name}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-semibold">
                    {activeApp.description}
                  </p>

                  {/* Scopes privileges lists */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Privilege Scopes Mapped</span>
                    <div className="flex flex-wrap gap-1">
                      {activeApp.features.map((feat, i) => (
                        <span key={i} className="text-[9px] bg-brand-slate dark:bg-zinc-800 border px-2 py-0.5 rounded font-mono">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Requirements checklist */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Requirements checklist</span>
                    <ul className="list-disc pl-4 text-[10px] text-zinc-400 leading-normal gap-1 flex flex-col font-medium">
                      {activeApp.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {activeAppConnection && (
                    <div className="bg-brand-slate/40 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-brand-border text-xs text-left">
                      <div className="flex justify-between items-center text-[10px] mb-1 select-none">
                        <span>Connection health:</span>
                        <span className="font-bold text-brand-green">{activeAppConnection.healthScore}% score</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] select-none">
                        <span>API handshake:</span>
                        <span className="font-mono">{activeAppConnection.latencyMs}ms</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">Select an integration app from the catalog grid to view details scopes, install permissions requirements, and latency scorecards.</span>
                </div>
              )}

              {activeApp && (
                <div className="border-t border-brand-border dark:border-border/20 pt-4">
                  {activeApp.isInstalled && activeAppConnection ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-500/10 hover:bg-red-500/10 w-full"
                      onClick={() => {
                        disconnectApp(activeAppConnection.id);
                        addToast(`Uninstalled integration connection for ${activeApp.name}`, "success");
                      }}
                    >
                      Uninstall integration connection
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      className="w-full"
                      onClick={() => startConnectionWizard(activeApp.id)}
                    >
                      Install Integration
                    </Button>
                  )}
                </div>
              )}
            </Card>

          </div>
        )}

        {/* TAB 3: CONNECTED APP MANAGER */}
        {activeTab === "connected" && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            
            <div className="border-b pb-3 select-none">
              <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Installed Connections Console</h3>
              <span className="text-[10px] text-muted-foreground">Active external cloud connection states. Toggle active routes.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none">
              {connections.map(conn => {
                const app = apps.find(a => a.id === conn.appId);
                return (
                  <Card key={conn.id} className="p-4 flex flex-col justify-between gap-4 border border-brand-border dark:border-border/30">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          {app && <img src={app.logoUrl} className="w-8 h-8 object-cover rounded border" />}
                          <div className="flex flex-col text-left">
                            <span className="text-[9px] font-mono text-zinc-400">ID: {conn.id}</span>
                            <h4 className="text-xs font-bold text-brand-navy dark:text-foreground">{conn.name}</h4>
                          </div>
                        </div>

                        <Toggle
                          checked={conn.status === "connected"}
                          onChange={() => {
                            toggleConnectionActive(conn.id);
                            addToast(`Connection status updated for ${conn.name}`, "success");
                          }}
                        />
                      </div>

                      <div className="flex flex-col text-[11px] font-semibold text-brand-navy dark:text-zinc-200 gap-1 text-left">
                        <span>API Status: <span className={`${conn.status === "connected" ? "text-brand-green" : "text-red-500"}`}>{conn.status.toUpperCase()}</span></span>
                        <span>API Handshake latency: <span className="font-mono">{conn.latencyMs}ms</span></span>
                        <span>Connection Health score: <span className="font-mono text-brand-green">{conn.healthScore}/100</span></span>
                        <span className="text-[9px] text-zinc-400">Connected: {new Date(conn.connectedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="border-t border-brand-border dark:border-border/20 pt-3 flex items-center justify-end">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        className="text-red-500 border-red-500/10 hover:bg-red-500/10"
                        onClick={() => {
                          disconnectApp(conn.id);
                          addToast("Integration disconnected and credential vault records cleared.", "success");
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 4: CREDENTIAL MANAGER VAULT */}
        {activeTab === "credentials" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Vault lists cards left pane */}
            <Card className="lg:col-span-8 p-6 text-left flex flex-col gap-4">
              <div className="border-b pb-3 select-none">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Credentials Vault Ledger</h3>
                <span className="text-[10px] text-muted-foreground">Manage credentials signatures scopes, basic auths, and bearer tokens.</span>
              </div>

              <div className="flex flex-col gap-3">
                {credentials.map(cred => {
                  const conn = connections.find(c => c.id === cred.connectionId);
                  return (
                    <div key={cred.id} className="border border-brand-border dark:border-border/40 rounded-xl p-4 flex flex-col gap-2.5 bg-card relative">
                      <div className="flex items-center justify-between border-b pb-2 select-none">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase">Auth: {cred.authType}</span>
                          <h4 className="text-xs font-extrabold text-brand-navy dark:text-foreground">{conn?.name || "Credential Record"}</h4>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => {
                              rotateCredential(cred.connectionId);
                              addToast("API Keys rotated. Log trace created.", "success");
                            }}
                          >
                            Rotate keys
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 text-left relative">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Token Value</span>
                        <div className="flex items-center gap-2">
                          <Input
                            value={cred.keyValue}
                            readOnly
                            type="password"
                            className="font-mono text-[10px] bg-[#8B5CF6]/5"
                          />
                          <Button variant="outline" size="xs" onClick={() => {
                            navigator.clipboard.writeText(cred.keyValue);
                            addToast("Key copied to clipboard", "success");
                          }}>
                            Copy
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 mt-1 text-left">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Scopes</span>
                        <div className="flex flex-wrap gap-1">
                          {cred.scopes.map((sc, i) => (
                            <span key={i} className="text-[8px] font-mono font-bold bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/20 px-2 py-0.5 rounded-full">
                              {sc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Credential guide instructions right pane */}
            <Card className="lg:col-span-4 p-6 text-left flex flex-col gap-3 justify-between select-none">
              <div className="flex flex-col gap-2">
                <span className="p-1 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-lg self-start text-[#8B5CF6]">
                  <ShieldCheck className="h-5 w-5 animate-pulse" />
                </span>
                <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground mt-2">Security & Permissions</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  API Secrets and Bearer Tokens are rotated and encrypted using SHA-256 signatures before indexed in local database tables.
                </p>
                <div className="bg-brand-slate/40 dark:bg-zinc-900/50 p-2.5 rounded-lg border text-[9px] text-zinc-400">
                  💡 Tip: Regularly rotate OpenAI developer tokens to prevent quota thresholds exceptions.
                </div>
              </div>

              <div className="border-t pt-3 text-center text-[10px] text-zinc-400 font-mono">
                Active credentials counts: {credentials.length} entries
              </div>
            </Card>

          </div>
        )}

        {/* TAB 5: WEBHOOK OUTBOUND MANAGER */}
        {activeTab === "webhooks" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Outbound webhook form configuration */}
            <Card className="lg:col-span-5 p-6 text-left flex flex-col gap-4">
              <div className="border-b pb-3 select-none">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Outbound webhook broker URL</h3>
                <span className="text-[10px] text-muted-foreground">Subscribe target URLs and secret validation pings.</span>
              </div>

              {webhooks.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">Install a payments or communication app to enable outbound webhook listeners.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3 font-semibold text-xs">
                  {webhooks.map(wh => {
                    const conn = connections.find(c => c.id === wh.connectionId);
                    return (
                      <div key={wh.id} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">Target Endpoint URL</span>
                          <Input
                            value={wh.url}
                            onChange={(e) => {
                              updateWebhookSettings(wh.connectionId, e.target.value);
                            }}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 relative select-none">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">Webhook Secret</span>
                          <div className="flex items-center gap-1.5">
                            <Input
                              type={showWebhookSecret ? "text" : "password"}
                              value={wh.secret}
                              readOnly
                            />
                            <Button variant="outline" size="xs" onClick={() => setShowWebhookSecret(!showWebhookSecret)}>
                              {showWebhookSecret ? "Hide" : "Reveal"}
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] border-t pt-3 mt-2 select-none">
                          <span>Retry parameters:</span>
                          <span className="font-mono font-bold text-brand-green">{wh.retryRulesCount} retry attempts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Webhook logs terminal logs */}
            <Card className="lg:col-span-7 p-6 text-left flex flex-col gap-4">
              <div className="border-b pb-3 select-none">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Outbound Payload logs Terminal</h3>
                <span className="text-[10px] text-muted-foreground">Real-time webhook payload delivery diagnostic.</span>
              </div>

              {webhooks.length > 0 && webhooks[0].deliveryLogs.length > 0 ? (
                <div className="bg-brand-navy dark:bg-zinc-950 p-4 rounded-xl border font-mono text-[9px] text-zinc-300 flex flex-col gap-2 max-h-96 overflow-y-auto leading-relaxed">
                  {webhooks[0].deliveryLogs.map((log, idx) => (
                    <div key={log.id} className="flex flex-col gap-0.5 border-b border-white/5 pb-2">
                      <div className="flex justify-between select-none">
                        <span className={`font-bold uppercase ${log.status === "success" ? "text-brand-green" : "text-red-500"}`}>
                          {log.event} ({log.responseCode})
                        </span>
                        <span className="text-zinc-500 text-[8px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-zinc-400 break-all">{log.payload}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Terminal className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">No outgoing payload triggers logged this period.</span>
                </div>
              )}
            </Card>

          </div>
        )}

        {/* TAB 6: CONNECTION AUDITS & MONITORING */}
        {activeTab === "logs" && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* SVG Latency and Success histories charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start select-none">
              
              {/* Latency curve chart */}
              <Card className="lg:col-span-8 p-6 text-left flex flex-col gap-4">
                <div className="border-b pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Average API Connection Latency</h3>
                    <span className="text-[10px] text-muted-foreground">Handshake latency historical trend over the last hour.</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-green">Avg: {stats.avgLatency}ms</span>
                </div>

                {/* SVG line */}
                <div className="w-full h-56 flex flex-col justify-between mt-2 relative">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-12 text-[9px] text-zinc-400/40">
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 pt-1 text-right">300ms</div>
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 pt-1 text-right">150ms</div>
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 pt-1 text-right">50ms</div>
                  </div>

                  <div className="flex-1 w-full relative z-10">
                    <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
                      <path
                        d="M 50 120 C 150 90, 250 140, 350 95 C 450 78, 500 85, 550 80"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="50" cy="120" r="4" fill="#8B5CF6" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="350" cy="95" r="4" fill="#8B5CF6" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="550" cy="80" r="4" fill="#8B5CF6" stroke="#fff" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-muted-foreground px-4 pt-1 z-20 border-t border-brand-border/40 font-mono">
                    <span>17:00</span>
                    <span>17:10</span>
                    <span>17:20</span>
                    <span>17:30</span>
                  </div>
                </div>
              </Card>

              {/* Connected apps health scorecard */}
              <Card className="lg:col-span-4 p-6 text-left flex flex-col gap-4">
                <div className="border-b pb-3">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">App Connection Health</h3>
                  <span className="text-[10px] text-muted-foreground">Installed endpoints availability score tracking.</span>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  {connections.map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-brand-slate/40 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-brand-border/60">
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground">{c.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${c.status === "connected" ? "bg-brand-green" : "bg-red-500"}`} />
                        <span className="text-[10px] font-mono font-bold text-foreground">{c.healthScore}% score</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

            {/* Audit Logs Lists table */}
            <Card className="p-6 text-left">
              <div className="border-b pb-3 flex items-center justify-between select-none mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Connection Audits log</h3>
                  <span className="text-[10px] text-muted-foreground">Historical records of token validations and connection updates.</span>
                </div>
                <div className="relative w-48">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-zinc-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-7 pr-3 text-[10px] bg-white dark:bg-zinc-950 border border-brand-border dark:border-border/40 rounded-lg text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Log Message</th>
                      <th className="py-2.5 px-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-brand-navy dark:text-zinc-300 font-mono text-[10px]">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                        <td className="py-3 px-3 text-zinc-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="py-3 px-3">
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                            log.type === "connected" ? "bg-brand-green/10 text-brand-green border-brand-green/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-brand-navy dark:text-foreground">{log.message}</td>
                        <td className="py-3 px-3 text-zinc-400 font-sans text-[9px]">{log.details || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>
        )}

      </div>

      {/* MODAL: CONNECTION WIZARD (OAuth/API Keys connection wizard) */}
      {showWizardModal && wizardAppId && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn select-none">
          <Card className="w-full max-w-lg p-6 flex flex-col gap-4 m-4">
            
            {/* Step indicators */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono text-[#8B5CF6] uppercase">Connection setup wizard</span>
                <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground">
                  Step {wizardStep} of 5: {
                    wizardStep === 1 ? "Select & Review App" :
                    wizardStep === 2 ? "Authenticate Key Credentials" :
                    wizardStep === 3 ? "Permissions Authorization" :
                    wizardStep === 4 ? "Connection latency test" : "Fulfillment Finish"
                  }
                </h4>
              </div>
              <button onClick={() => setShowWizardModal(false)} className="p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 rounded">
                <X className="h-4 w-4 text-zinc-400" />
              </button>
            </div>

            {/* STEP 1: APPS METADATA PREVIEW */}
            {wizardStep === 1 && (
              <div className="flex flex-col gap-3 text-left text-xs">
                {apps.filter(a => a.id === wizardAppId).map(app => (
                  <div key={app.id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <img src={app.logoUrl} className="w-10 h-10 object-cover rounded border" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 uppercase font-mono font-extrabold">{app.category}</span>
                        <span className="font-extrabold text-brand-navy dark:text-foreground text-sm">{app.name}</span>
                      </div>
                    </div>
                    <p className="text-zinc-500 font-semibold leading-relaxed mt-1">
                      {app.description}
                    </p>
                  </div>
                ))}

                <div className="flex items-center justify-end gap-2 border-t pt-4 mt-2">
                  <Button variant="success" size="sm" onClick={() => setWizardStep(2)}>
                    Configure Authentication
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: CREDENTIALS INPUT PANEL */}
            {wizardStep === 2 && (
              <div className="flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Connection Display Name</span>
                  <Input
                    value={wizardConnName}
                    onChange={(e) => setWizardConnName(e.target.value)}
                    placeholder="e.g. Stripe Account Live"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Authentication Mechanism</span>
                  <select
                    value={wizardAuthType}
                    onChange={(e) => setWizardAuthType(e.target.value as any)}
                    className="h-9 px-2 border rounded-xl text-xs bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="oauth">OAuth 2.0 Redirection Flow</option>
                    <option value="api_key">API Key secret</option>
                    <option value="bearer_token">Bearer token</option>
                  </select>
                </div>

                {wizardAuthType === "oauth" ? (
                  <div className="bg-brand-slate p-3 rounded-lg border border-brand-border text-center text-xs">
                    <span className="block font-semibold">Redirect OAuth Authentication</span>
                    <p className="text-[10px] text-zinc-400 leading-normal mt-1">
                      Click below to redirect to the secure OAuth login window of the developer.
                    </p>
                    <Button type="button" variant="outline" size="xs" className="mt-2" onClick={() => addToast("OAuth mock redirection verified", "success")}>
                      Initiate OAuth Login Handshake
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">API Credentials Key / Token</span>
                    <Input
                      type="password"
                      value={wizardKeyValue}
                      onChange={(e) => setWizardKeyValue(e.target.value)}
                      placeholder="sk-proj-..."
                      required
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 border-t pt-4 mt-2">
                  <Button variant="outline" size="sm" onClick={() => setWizardStep(1)}>
                    Back
                  </Button>
                  <Button variant="success" size="sm" onClick={() => setWizardStep(3)}>
                    Set Scope Permissions
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: SCOPES AUTHORIZATION */}
            {wizardStep === 3 && (
              <div className="flex flex-col gap-3 text-left select-none">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Verify permissions checklist to authorize</span>
                
                <div className="max-h-48 overflow-y-auto border border-brand-border/40 rounded-xl p-2.5 flex flex-col gap-1 bg-white dark:bg-zinc-950">
                  {wizardScopes.map((scope, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-brand-slate p-1.5 rounded">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-3.5 w-3.5 rounded text-[#8B5CF6]"
                      />
                      <span className="font-semibold text-brand-navy dark:text-zinc-200">{scope}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 border-t pt-4 mt-2">
                  <Button variant="outline" size="sm" onClick={() => setWizardStep(2)}>
                    Back
                  </Button>
                  <Button variant="success" size="sm" onClick={() => {
                    setWizardStep(4);
                    runConnectionTest();
                  }}>
                    Run Latency Test
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: LATENCY AND HANDSHAKE TESTING */}
            {wizardStep === 4 && (
              <div className="flex flex-col items-center justify-center p-6 text-center select-none">
                
                {isTestingConnection ? (
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="h-10 w-10 text-[#8B5CF6] animate-spin" />
                    <span className="text-xs font-bold text-foreground mt-2">Simulating gateway handshake ping loops...</span>
                    
                    {/* Progress indicator */}
                    <div className="w-48 bg-zinc-200 h-2 rounded-full overflow-hidden mt-1">
                      <div className="bg-[#8B5CF6] h-full transition-all duration-300" style={{ width: `${testProgress}%` }} />
                    </div>
                  </div>
                ) : testConnectionSuccess ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-10 w-10 text-brand-green animate-bounce" />
                    <span className="text-xs font-extrabold text-brand-navy dark:text-foreground mt-2">Handshake Successful!</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Response Code: 200 OK | Latency: 92ms</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                    <span className="text-xs font-bold text-red-500">Handshake Aborted. Credentials mismatch.</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 border-t pt-4 mt-6 w-full">
                  <Button variant="outline" size="sm" onClick={() => setWizardStep(3)} disabled={isTestingConnection}>
                    Back
                  </Button>
                  <Button variant="success" size="sm" onClick={() => setWizardStep(5)} disabled={isTestingConnection || !testConnectionSuccess}>
                    Proceed
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5: FINAL CONFIRMATIONS */}
            {wizardStep === 5 && (
              <div className="flex flex-col items-center justify-center text-center p-4 select-none">
                <ShieldCheck className="h-12 w-12 text-[#25D366] mb-3 animate-bounce" />
                <h4 className="text-xs font-extrabold text-brand-navy dark:text-foreground">Authentication Handshake Complete</h4>
                <p className="text-[10px] text-zinc-400 leading-normal max-w-sm mt-1">
                  Ecosystem connections successfully created. API Vault has registered your key signatures keys, and automated webhook configurations are loaded.
                </p>

                <div className="flex items-center justify-end gap-2 border-t pt-4 mt-6 w-full">
                  <Button variant="outline" size="sm" onClick={() => setWizardStep(4)}>
                    Back
                  </Button>
                  <Button variant="success" size="sm" onClick={finishConnectionWizard}>
                    Publish and Close Wizard
                  </Button>
                </div>
              </div>
            )}

          </Card>
        </div>
      )}

    </DashboardShell>
  );
}
