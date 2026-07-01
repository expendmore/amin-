"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useWhatsApp } from "@/store/use-whatsapp";
import { useToast } from "@/store/use-toast";
import {
  MessageSquare,
  Bot,
  Plus,
  Send,
  User,
  Settings,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  UserCheck,
  CheckCheck,
  RefreshCw,
  Key,
  Shield,
  Activity,
  ShieldAlert,
  Link,
  AlertTriangle,
  AlertCircle,
  Copy,
  Info,
  Check,
  Trash2,
  Power,
  Eye,
  EyeOff,
  LayoutDashboard,
  Clock,
  FileText,
  Globe,
  TrendingUp
} from "lucide-react";

// Mock API Key Interface
interface DeveloperApiKey {
  id: string;
  name: string;
  token: string;
  permissions: string[];
  expiration: string;
  createdAt: string;
}

// Mock Webhook Log Interface
interface WebhookLog {
  id: string;
  time: string;
  event: string;
  status: "DELIVERED" | "FAILED" | "RETRYING";
  payload: string;
}

export default function WhatsAppIntegrationHubPage() {
  const { addToast } = useToast();
  
  const {
    accounts,
    addAccount,
  } = useWhatsApp();

  // Tab state: dashboard | accounts | connect | webhooks | keys | settings | monitoring
  const [activeTab, setActiveTab] = useState<"dashboard" | "accounts" | "connect" | "webhooks" | "keys" | "settings" | "monitoring">("dashboard");

  // Floating Debug State Switcher variables: default | loading | empty | disconnected | expired | permission_error | maintenance
  const [uiStateMode, setUiStateMode] = useState<"default" | "loading" | "empty" | "disconnected" | "expired" | "permission_error" | "maintenance">("default");

  // Forms states
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyExp, setNewKeyExp] = useState("30");
  const [newKeyPerms, setNewKeyPerms] = useState<string[]>(["read"]);

  // Connect Account Wizard States
  const [connectStep, setConnectStep] = useState(1);
  const [connectAccountName, setConnectAccountName] = useState("");
  const [connectPhoneNumber, setConnectPhoneNumber] = useState("");
  const [connectToken, setConnectToken] = useState("");
  const [connectCodeInput, setConnectCodeInput] = useState("");

  // Webhook settings inputs
  const [webhookUrl, setWebhookUrl] = useState("https://api.aisensy.com/v1/webhooks/whatsapp");
  const [webhookSecret, setWebhookSecret] = useState("whsec_5B82F6x9011Cc293D9");
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [webhookEvents, setWebhookEvents] = useState<string[]>(["messages", "message_status"]);

  // API Keys state variables
  const [apiKeys, setApiKeys] = useState<DeveloperApiKey[]>([
    {
      id: "key-1",
      name: "Shopify Sync Token",
      token: "sk_live_51P...9a7c",
      permissions: ["read", "write"],
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toLocaleDateString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toLocaleDateString(),
    },
    {
      id: "key-2",
      name: "HubSpot Automation Key",
      token: "sk_live_51P...b82f",
      permissions: ["read", "write", "admin"],
      expiration: "Permanent",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toLocaleDateString(),
    }
  ]);

  // Webhook Logs
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([
    { id: "wl-1", time: "16:42:01", event: "messages.received", status: "DELIVERED", payload: '{"message_id":"wamid.HBgMOT...","from":"919999988888"}' },
    { id: "wl-2", time: "16:40:15", event: "message.status.sent", status: "DELIVERED", payload: '{"status":"sent","recipient":"919000011111"}' },
    { id: "wl-3", time: "16:38:00", event: "message.status.delivered", status: "DELIVERED", payload: '{"status":"delivered","recipient":"919000011111"}' },
    { id: "wl-4", time: "16:30:10", event: "messages.received", status: "FAILED", payload: '{"error":"Connection timed out on backend broker"}' }
  ]);

  // Copy to clipboard helper
  const handleCopyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    addToast(message, "success");
  };

  // Actions triggers
  const handleToggleEvent = (event: string) => {
    if (webhookEvents.includes(event)) {
      setWebhookEvents(prev => prev.filter(e => e !== event));
    } else {
      setWebhookEvents(prev => [...prev, event]);
    }
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const mockToken = `sk_live_51P_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const expirationDate = newKeyExp === "permanent" 
      ? "Permanent" 
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(newKeyExp)).toLocaleDateString();

    const newKey: DeveloperApiKey = {
      id: `key_${Math.random().toString(36).substring(2, 9)}`,
      name: newKeyName,
      token: `${mockToken.substring(0, 10)}...${mockToken.substring(mockToken.length - 4)}`,
      permissions: newKeyPerms,
      expiration: expirationDate,
      createdAt: new Date().toLocaleDateString()
    };

    setApiKeys(prev => [newKey, ...prev]);
    setGeneratedToken(mockToken);
    setShowTokenDialog(true);
    setNewKeyName("");
    setNewKeyPerms(["read"]);
    addToast("Developer API Key generated.", "success");
  };

  const handleDeleteKey = (id: string, name: string) => {
    if (confirm(`Permanently revoke access key '${name}'?`)) {
      setApiKeys(prev => prev.filter(k => k.id !== id));
      addToast(`Revoked key '${name}'.`, "info");
    }
  };

  const handleToggleKeyPermission = (perm: string) => {
    if (newKeyPerms.includes(perm)) {
      setNewKeyPerms(prev => prev.filter(p => p !== perm));
    } else {
      setNewKeyPerms(prev => [...prev, perm]);
    }
  };

  // Connect wizard flow simulation
  const handleNextConnectStep = () => {
    if (connectStep === 1 && !connectAccountName.trim()) {
      addToast("Profile display name is required.", "error");
      return;
    }
    if (connectStep === 2 && !connectPhoneNumber.trim()) {
      addToast("Phone number is required.", "error");
      return;
    }
    if (connectStep === 3 && connectCodeInput !== "123456") {
      addToast("Invalid verification code. Enter 123456.", "error");
      return;
    }
    setConnectStep(prev => prev + 1);
  };

  const handleFinishConnection = () => {
    addAccount({
      displayName: connectAccountName,
      phoneNumber: connectPhoneNumber,
      phoneNumberId: `phone_${Math.floor(10000 + Math.random() * 90000)}`,
      status: "CONNECTED"
    });
    addToast(`Connected Account: ${connectAccountName}`, "success");
    setConnectStep(1);
    setConnectAccountName("");
    setConnectPhoneNumber("");
    setConnectCodeInput("");
    setConnectToken("");
    setActiveTab("accounts");
  };

  return (
    <DashboardShell>
      <div className="p-6 md:p-8 max-w-[1280px] mx-auto w-full flex flex-col gap-6 pb-24 md:pb-8 font-sans select-none relative">
        
        {/* Top warnings indicators for test states */}
        {uiStateMode === "expired" && (
          <div className="bg-amber-950/20 border border-amber-500/20 text-amber-500 p-4 rounded-xl flex gap-3 text-xs leading-relaxed select-none items-start text-left shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-grow flex flex-col gap-1">
              <span className="font-bold">WhatsApp System Alert: Access Token Expired</span>
              <span>Your current Meta Cloud API token has expired. All inbound and outbound messaging routes are currently suspended until re-authorization is complete.</span>
            </div>
            <Button size="xs" onClick={() => setActiveTab("accounts")} className="bg-amber-500 hover:bg-amber-600 text-black uppercase font-bold shrink-0 self-center">
              Re-authorize Token
            </Button>
          </div>
        )}

        {uiStateMode === "disconnected" && (
          <div className="bg-red-950/20 border border-red-500/20 text-red-500 p-4 rounded-xl flex gap-3 text-xs leading-relaxed select-none items-start text-left shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-grow flex flex-col gap-1">
              <span className="font-bold">Webhook Service Outage</span>
              <span>Meta webhook endpoint is returning 503 Service Unavailable. Delivery status tracing is temporarily offline. Our failover routing is listening for broker fallback hooks.</span>
            </div>
          </div>
        )}

        {/* Header Title section */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-brand-border dark:border-border/50 pb-6">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-foreground">
              WhatsApp Integration Hub
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Configure Webhook event gateways, authenticate Meta Cloud tokens, and audit developer API access keys.
            </p>
          </div>
          
          <Button
            variant="success"
            onClick={() => setActiveTab("connect")}
            size="sm"
            className="text-xs font-bold bg-brand-green hover:bg-brand-green/90 text-white shrink-0 self-start sm:self-auto h-9"
          >
            <Plus className="h-4.5 w-4.5 mr-1" />
            <span>Connect Account</span>
          </Button>
        </div>

        {/* Tab Selection console */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 border-b border-brand-border dark:border-border/40 select-none">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "accounts", label: "Connected Accounts", icon: UserCheck },
            { id: "connect", label: "Connect Number", icon: Link },
            { id: "webhooks", label: "Webhook Manager", icon: Globe },
            { id: "keys", label: "API Credentials", icon: Key },
            { id: "settings", label: "Profile Settings", icon: Settings },
            { id: "monitoring", label: "Health Monitoring", icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (uiStateMode === "permission_error" && tab.id !== "dashboard") {
                    addToast("Permission denied. Gated by administrator.", "error");
                    return;
                  }
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-colors shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-secondary text-foreground border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-950/5"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN UI STATE PANEL VIEWS */}
        {uiStateMode === "loading" ? (
          /* STATE: SKELETON LOADING */
          <div className="flex flex-col gap-6 select-none animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-zinc-900/10 dark:bg-zinc-800/20 border border-border rounded-2xl" />
              ))}
            </div>
            <div className="h-64 bg-zinc-900/10 dark:bg-zinc-800/20 border border-border rounded-2xl" />
          </div>
        ) : uiStateMode === "permission_error" && activeTab !== "dashboard" ? (
          /* STATE: PERMISSION ERROR GATING */
          <Card className="p-10 text-center max-w-md mx-auto my-auto flex flex-col items-center justify-center gap-4 select-none">
            <span className="p-3 bg-red-950/20 text-red-500 rounded-full border border-red-500/10">
              <ShieldAlert className="h-8 w-8" />
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-extrabold text-foreground text-sm">Access Denied</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your workspace user profile does not contain administration credentials to modify WhatsApp integration endpoints. Please contact a workspace owner.
              </p>
            </div>
            <Button variant="secondary" size="xs" onClick={() => setUiStateMode("default")}>Dismiss Warning</Button>
          </Card>
        ) : uiStateMode === "maintenance" ? (
          /* STATE: MAINTENANCE OVERLAY */
          <Card className="p-12 text-center max-w-lg mx-auto my-auto flex flex-col items-center justify-center gap-4 select-none">
            <span className="p-3 bg-amber-950/20 text-amber-500 rounded-full border border-amber-500/10 animate-bounce">
              <Settings className="h-8 w-8" />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-extrabold text-foreground text-sm">Scheduled Maintenance in Progress</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Meta Cloud API gateway endpoints are undergoing scheduled monthly updates from 16:00 to 18:00 UTC. Custom number provisioning is temporarily disabled. Active messaging queues are cached and will resume automatically.
              </p>
            </div>
          </Card>
        ) : (
          /* DEFAULT TAB CONTENT RENDER */
          <div className="flex flex-col gap-6 text-left">
            
            {/* TAB 1: INTEGRATION DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="flex flex-col gap-6 text-left">
                {/* Bento metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
                  <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Connected Phone Lines</span>
                    <span className="text-2xl font-extrabold text-foreground font-mono">
                      {uiStateMode === "empty" ? 0 : accounts.length}
                    </span>
                    <span className="text-[8px] text-zinc-400">Total lines connected</span>
                  </Card>
                  
                  <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Meta API Latency</span>
                    <span className="text-2xl font-extrabold text-foreground font-mono">
                      {uiStateMode === "disconnected" ? "Timeout" : "210ms"}
                    </span>
                    <span className="text-[8px] text-emerald-500 font-semibold flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" />
                      Healthy Speed
                    </span>
                  </Card>
                  
                  <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Webhook status</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${uiStateMode === "disconnected" ? "bg-red-500" : "bg-brand-green"} animate-pulse`} />
                      <span className="text-sm font-extrabold font-mono text-foreground uppercase tracking-wider">
                        {uiStateMode === "disconnected" ? "Offline" : "ACTIVE"}
                      </span>
                    </div>
                    <span className="text-[8px] text-zinc-400">Listening to events</span>
                  </Card>
                  
                  <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Daily Usage limit</span>
                    <span className="text-2xl font-extrabold text-foreground font-mono">
                      {uiStateMode === "empty" ? "0 / 0" : "4.2k / 100k"}
                    </span>
                    <div className="w-full bg-secondary h-1 rounded-full mt-1 overflow-hidden">
                      <div className="bg-brand-sky h-1 rounded-full" style={{ width: uiStateMode === "empty" ? "0%" : "4.2%" }} />
                    </div>
                  </Card>
                </div>

                {/* Sub row: Health and Quota details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* API performance visual SVG chart */}
                  <Card className="p-5 flex flex-col gap-3 md:col-span-2 select-none text-left">
                    <span className="text-xs font-bold text-foreground">API Call Frequency (Weekly)</span>
                    <div className="h-28 flex items-end justify-between px-4 border-b border-border/60 pb-1.5 pt-4">
                      {[
                        { label: "Mon", val: 1200 },
                        { label: "Tue", val: 2400 },
                        { label: "Wed", val: 1800 },
                        { label: "Thu", val: 3200 },
                        { label: "Fri", val: 4500 },
                        { label: "Sat", val: 800 },
                        { label: "Sun", val: 1500 }
                      ].map((d, i) => {
                        const barHeight = uiStateMode === "empty" ? 0 : (d.val / 4500) * 80;
                        return (
                          <div key={i} className="flex flex-col items-center gap-1.5 flex-grow">
                            <div className="w-5 bg-brand-green/80 rounded-t" style={{ height: `${barHeight}px` }} />
                            <span className="text-[8px] font-bold font-mono text-muted-foreground">{d.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Webhooks activity status check */}
                  <Card className="p-5 flex flex-col gap-3 text-left">
                    <span className="text-xs font-bold text-foreground">Event Delivery rate</span>
                    <div className="flex flex-col gap-2.5 mt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Successful Delivery</span>
                        <span className="font-bold text-foreground font-mono">{uiStateMode === "disconnected" ? "0.0%" : "99.8%"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Average API Latency</span>
                        <span className="font-bold text-foreground font-mono">180ms</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Webhook Retries Queue</span>
                        <span className="font-bold text-foreground font-mono">{uiStateMode === "disconnected" ? "42" : "0"}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB 2: CONNECT ACCOUNT WIZARD */}
            {activeTab === "connect" && (
              <div className="max-w-xl mx-auto w-full border border-border bg-card rounded-2xl p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center select-none border-b border-border/40 pb-4 text-left">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-foreground">Connect WhatsApp Business line</span>
                    <span className="text-xs text-muted-foreground">Step {connectStep} of 4: {
                      connectStep === 1 ? "Meta Business Credentials" :
                      connectStep === 2 ? "Embedded phone registration" :
                      connectStep === 3 ? "SMS Number Validation" : "Validate & Connect Token"
                    }</span>
                  </div>
                  <button 
                    onClick={() => { setConnectStep(1); setActiveTab("dashboard"); }} 
                    className="text-xs text-muted-foreground hover:text-foreground font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2 select-none justify-center px-4">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <React.Fragment key={idx}>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        connectStep === idx + 1
                          ? "bg-brand-sky text-white"
                          : connectStep > idx + 1
                          ? "bg-brand-sky/20 border border-brand-sky/30 text-brand-sky"
                          : "bg-zinc-800 text-muted-foreground border border-border/40"
                      }`}>
                        {idx + 1}
                      </div>
                      {idx < 3 && <div className={`h-0.5 flex-grow ${connectStep > idx + 1 ? "bg-brand-sky" : "bg-zinc-800"}`} />}
                    </React.Fragment>
                  ))}
                </div>

                {/* STEPS FORMS RENDERING */}
                <div className="py-2 min-h-[180px] flex-grow text-left">
                  
                  {/* Step 1: Business Profile display name */}
                  {connectStep === 1 && (
                    <div className="flex flex-col gap-4">
                      <Input
                        label="Meta Business Profile Display Name"
                        placeholder="e.g. ExpendMore Marketing Alerts"
                        value={connectAccountName}
                        onChange={(e) => setConnectAccountName(e.target.value)}
                      />
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        This name is submitted to Meta for display approval tags.
                      </p>
                    </div>
                  )}

                  {/* Step 2: Embedded Signup credentials number */}
                  {connectStep === 2 && (
                    <div className="flex flex-col gap-4">
                      <Input
                        label="WhatsApp Phone Number ID"
                        placeholder="e.g. +91 99999 55555"
                        value={connectPhoneNumber}
                        onChange={(e) => setConnectPhoneNumber(e.target.value)}
                      />
                      <div className="p-3 bg-zinc-950/20 border border-border rounded-xl flex gap-2 items-start text-xs select-none leading-normal text-muted-foreground">
                        <Info className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
                        <span>Ensure this phone line is verified under your Meta Business Manager console and is not linked to any consumer WhatsApp accounts.</span>
                      </div>
                    </div>
                  )}

                  {/* Step 3: SMS Verification code */}
                  {connectStep === 3 && (
                    <div className="flex flex-col gap-4">
                      <Input
                        label="6-Digit OTP SMS Code"
                        placeholder="e.g. 123456"
                        value={connectCodeInput}
                        onChange={(e) => setConnectCodeInput(e.target.value)}
                      />
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        Meta SMS verification code. For simulation, enter **123456**.
                      </p>
                    </div>
                  )}

                  {/* Step 4: Token authentication key validation */}
                  {connectStep === 4 && (
                    <div className="flex flex-col gap-4">
                      <Input
                        label="Permanent Access Token Key"
                        placeholder="e.g. EAAH...xz91"
                        value={connectToken}
                        onChange={(e) => setConnectToken(e.target.value)}
                      />
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        Enter your Meta Business System User Permanent token key.
                      </p>
                    </div>
                  )}

                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-border/40 pt-4 select-none">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={connectStep === 1}
                    onClick={() => setConnectStep(prev => prev - 1)}
                    className="text-xs uppercase font-bold"
                  >
                    Previous
                  </Button>

                  {connectStep < 4 ? (
                    <Button
                      size="sm"
                      onClick={handleNextConnectStep}
                      className="text-xs uppercase font-bold bg-brand-navy hover:bg-brand-navy/95 text-white"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleFinishConnection}
                      className="text-xs uppercase font-bold bg-brand-green hover:bg-brand-green/90 text-white"
                    >
                      Verify & Connect
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CONNECTED ACCOUNTS */}
            {activeTab === "accounts" && (
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-foreground select-none">Meta Business WhatsApp Phone Lines</span>
                
                {uiStateMode === "empty" || accounts.length === 0 ? (
                  <div className="p-16 border border-dashed border-border rounded-2xl text-center text-xs text-muted-foreground italic select-none">
                    No phone lines connected. Select Connect Account above to register your first line.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {accounts.map(acc => {
                      const isOffline = uiStateMode === "disconnected" || acc.status === "DISCONNECTED";
                      return (
                        <Card key={acc.id} className="p-5 flex flex-col justify-between gap-5 relative group text-left">
                          
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                                <MessageSquare className="h-5 w-5 fill-brand-green/10" />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-sm font-bold text-foreground">{acc.displayName}</span>
                                <span className="text-xs text-muted-foreground font-semibold mt-0.5">{acc.phoneNumber}</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5 items-end">
                              <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase select-none ${
                                isOffline 
                                  ? "bg-red-950/20 border-red-500/20 text-red-500" 
                                  : "bg-emerald-950/20 border-emerald-500/20 text-emerald-400"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? "bg-red-500" : "bg-emerald-400 animate-pulse"}`} />
                                <span>{isOffline ? "Disconnected" : "Connected"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2.5 text-center text-xs pt-3 border-t border-border/40 select-none">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase">Quality Rating</span>
                              <span className={`font-bold mt-0.5 ${isOffline ? "text-zinc-500" : "text-emerald-400"}`}>
                                {isOffline ? "Unavailable" : "High (Green)"}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase">Phone ID</span>
                              <span className="font-mono text-foreground font-semibold mt-0.5 truncate">{acc.phoneNumberId}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase">Daily Limit</span>
                              <span className="font-mono text-foreground font-semibold mt-0.5">100k / Day</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-1 select-none">
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                if (isOffline) {
                                  addToast("Reconnecting line...", "info");
                                } else {
                                  addToast("Refreshed access token.", "success");
                                }
                              }}
                              className="text-[9px] font-bold uppercase tracking-wider h-8"
                            >
                              {isOffline ? "Reconnect" : "Refresh Token"}
                            </Button>
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                addToast(isOffline ? "Reconnecting profile..." : "Disconnected account line.", "info");
                              }}
                              className={`text-[9px] font-bold uppercase tracking-wider h-8 ${isOffline ? "" : "text-destructive hover:bg-destructive/10"}`}
                            >
                              {isOffline ? "Connect" : "Disconnect"}
                            </Button>
                          </div>

                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: WEBHOOK MANAGER */}
            {activeTab === "webhooks" && (
              <div className="flex flex-col gap-6">
                
                {/* Configuration form */}
                <Card className="p-6 flex flex-col gap-4 text-left">
                  <span className="text-xs font-bold text-foreground">Webhook Gateway Broker</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Webhook Callback URL Endpoint"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                    
                    <div className="flex flex-col gap-1.5 w-full relative">
                      <label className="text-xs font-semibold text-brand-navy dark:text-foreground">
                        Webhook Secret Signature
                      </label>
                      <div className="relative">
                        <input
                          type={showWebhookSecret ? "text" : "password"}
                          value={webhookSecret}
                          onChange={(e) => setWebhookSecret(e.target.value)}
                          className="w-full h-10 pl-3 pr-10 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subscriptions */}
                  <div className="flex flex-col gap-3 select-none">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Event Subscriptions Topics</span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { id: "messages", label: "messages (Inbound)" },
                        { id: "message_status", label: "messages.status (Sent/Read)" },
                        { id: "account_updates", label: "account.alerts (Quality/Meta)" }
                      ].map(topic => (
                        <label key={topic.id} className="p-3 border border-border rounded-xl flex items-center gap-2 cursor-pointer bg-zinc-900/30">
                          <input
                            type="checkbox"
                            checked={webhookEvents.includes(topic.id)}
                            onChange={() => handleToggleEvent(topic.id)}
                            className="rounded border-border text-brand-sky focus:ring-brand-sky h-4 w-4 cursor-pointer"
                          />
                          <span className="text-[10px] font-bold text-foreground">{topic.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end select-none">
                    <Button 
                      onClick={() => addToast("Webhook configurations saved successfully.", "success")}
                      size="sm" 
                      className="h-9 px-6 uppercase font-bold text-xs"
                    >
                      Save Configuration
                    </Button>
                  </div>
                </Card>

                {/* Webhook logs */}
                <Card className="p-6 flex flex-col gap-4 text-left">
                  <div className="flex justify-between items-center select-none">
                    <span className="text-xs font-bold text-foreground">Inbound Broker Webhook Logs</span>
                    <button 
                      onClick={() => addToast("Wiped webhook logs cache.", "info")}
                      className="text-[9px] font-bold text-destructive hover:bg-destructive/10 px-2 py-1 rounded uppercase cursor-pointer"
                    >
                      Clear Logs
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                    {webhookLogs.map(log => (
                      <div key={log.id} className="p-3 border border-border bg-zinc-950/60 font-mono text-[9px] leading-relaxed rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-zinc-300">
                        <div className="flex flex-col md:flex-row md:items-center gap-2.5 max-w-[80%] text-left">
                          <span className="text-zinc-500 font-bold select-none">{log.time}</span>
                          <span className="text-brand-sky font-bold uppercase select-none">[{log.event}]</span>
                          <span className="truncate text-zinc-400 font-semibold select-text">{log.payload}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full border text-[8px] font-bold select-none shrink-0 w-max uppercase ${
                          log.status === "DELIVERED"
                            ? "bg-emerald-950/20 border-emerald-500/10 text-emerald-400"
                            : log.status === "FAILED"
                            ? "bg-red-950/20 border-red-500/10 text-red-500"
                            : "bg-amber-950/20 border-amber-500/10 text-amber-500"
                        }`}>{log.status}</span>
                      </div>
                    ))}
                  </div>
                </Card>

              </div>
            )}

            {/* TAB 5: DEVELOPER API KEYS */}
            {activeTab === "keys" && (
              <div className="flex flex-col gap-6">
                
                {/* Generation Card */}
                <Card className="p-6 flex flex-col gap-4 text-left">
                  <span className="text-xs font-bold text-foreground">Generate API Developer Access Keys</span>
                  
                  <form onSubmit={handleGenerateKey} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="API Key Label Name"
                        placeholder="e.g. HubSpot Sync CRM"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        required
                      />
                      
                      <div className="flex flex-col gap-1.5 w-full select-none">
                        <label className="text-xs font-semibold text-brand-navy dark:text-foreground">Expiration Timeline</label>
                        <select
                          value={newKeyExp}
                          onChange={(e) => setNewKeyExp(e.target.value)}
                          className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none cursor-pointer"
                        >
                          <option value="30">30 Days (Standard)</option>
                          <option value="90">90 Days (Quarterly)</option>
                          <option value="permanent">No Expiration (Permanent)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 select-none">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Key Scope Permissions</span>
                      <div className="flex items-center gap-3">
                        {[
                          { id: "read", label: "read:integrations" },
                          { id: "write", label: "write:integrations" },
                          { id: "admin", label: "admin:delete" }
                        ].map(perm => (
                          <label key={perm.id} className="p-3 border border-border rounded-xl flex items-center gap-2 cursor-pointer bg-zinc-900/30">
                            <input
                              type="checkbox"
                              checked={newKeyPerms.includes(perm.id)}
                              onChange={() => handleToggleKeyPermission(perm.id)}
                              className="rounded border-border text-brand-sky focus:ring-brand-sky h-4 w-4 cursor-pointer"
                            />
                            <span className="text-[10px] font-bold text-foreground">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end select-none">
                      <Button type="submit" size="sm" className="h-9 px-6 uppercase font-bold text-xs">
                        Generate Token
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* API Keys lists */}
                <Card className="p-6 flex flex-col gap-4 text-left">
                  <span className="text-xs font-bold text-foreground">Registered API Developer Keys</span>
                  
                  <div className="flex flex-col gap-2">
                    {apiKeys.map(key => (
                      <div key={key.id} className="p-4 border border-border bg-zinc-900/20 rounded-xl flex items-center justify-between text-xs gap-4">
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-brand-sky">
                            <Key className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">{key.name}</span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 select-all">Token: {key.token}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 select-none">
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[8px] font-bold text-muted-foreground uppercase">Expires</span>
                            <span className="text-[10px] font-semibold text-foreground font-mono">{key.expiration}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCopyToClipboard(key.token, "Key token copied to clipboard.")}
                              className="p-1 hover:bg-zinc-800 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                              title="Copy Token"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteKey(key.id, key.name)}
                              className="p-1 hover:bg-zinc-800 text-muted-foreground hover:text-destructive rounded transition-colors cursor-pointer"
                              title="Revoke Key"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

              </div>
            )}

            {/* TAB 6: PROFILE SETTINGS */}
            {activeTab === "settings" && (
              <Card className="p-6 flex flex-col gap-4 text-left">
                <span className="text-xs font-bold text-foreground">Business Manager Profile Settings</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/40 pt-4">
                  <Input
                    label="Meta Legal Business Name"
                    defaultValue="Anshuman Enterprises Ltd"
                  />
                  <Input
                    label="API Rate Limit threshold (Per Min)"
                    defaultValue="600"
                  />
                  <div className="flex flex-col gap-1.5 w-full select-none">
                    <label className="text-xs font-semibold text-brand-navy dark:text-foreground">Default Localization Language</label>
                    <select className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none cursor-pointer">
                      <option>English (United States)</option>
                      <option>Hindi (India)</option>
                      <option>Spanish (Mexico)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full select-none">
                    <label className="text-xs font-semibold text-brand-navy dark:text-foreground">Default Localization Timezone</label>
                    <select className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none cursor-pointer">
                      <option>UTC +05:30 (Kolkata)</option>
                      <option>UTC +00:00 (GMT)</option>
                      <option>UTC -08:00 (PST)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end select-none mt-2">
                  <Button onClick={() => addToast("Settings modifications applied.", "success")} size="sm" className="h-9 px-6 uppercase font-bold text-xs">
                    Save settings
                  </Button>
                </div>
              </Card>
            )}

            {/* TAB 7: HEALTH MONITORING */}
            {activeTab === "monitoring" && (
              <div className="flex flex-col gap-6">
                
                {/* latency charts logs */}
                <Card className="p-6 flex flex-col gap-4 text-left">
                  <span className="text-xs font-bold text-foreground">Meta Server Latency Monitoring (24h)</span>
                  
                  {/* Visual SVG chart */}
                  <div className="h-28 flex items-end justify-between px-4 border-b border-border/60 pb-1.5 pt-4 select-none">
                    {[
                      { label: "00:00", val: 190 },
                      { label: "04:00", val: 210 },
                      { label: "08:00", val: 180 },
                      { label: "12:00", val: 240 },
                      { label: "16:00", val: 310 },
                      { label: "20:00", val: 170 }
                    ].map((d, i) => {
                      const barHeight = (d.val / 310) * 80;
                      return (
                        <div key={i} className="flex flex-col items-center gap-1.5 flex-grow">
                          <div className="w-6 bg-brand-sky/80 rounded-t" style={{ height: `${barHeight}px` }} />
                          <span className="text-[8px] font-bold font-mono text-muted-foreground">{d.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Operations errors logs */}
                <Card className="p-6 flex flex-col gap-4 text-left">
                  <span className="text-xs font-bold text-foreground">System Warning Logs</span>
                  
                  <div className="border border-border rounded-xl bg-zinc-950/80 p-4 h-48 overflow-y-auto flex flex-col gap-1.5 font-mono text-[9px] leading-relaxed text-zinc-300">
                    <div><span className="text-zinc-500 font-bold">[16:42:01]</span> <span className="text-brand-sky font-bold">[INFO]</span> Webhook broker dispatched messages.received payload to Shopify Sync.</div>
                    <div><span className="text-zinc-500 font-bold">[16:40:15]</span> <span className="text-emerald-400 font-bold">[SUCCESS]</span> Template message order_confirmation sent status 200 OK.</div>
                    <div><span className="text-zinc-500 font-bold">[16:38:00]</span> <span className="text-brand-sky font-bold">[INFO]</span> API Key: "Shopify Sync Token" validated metadata scopes.</div>
                    {uiStateMode === "disconnected" && (
                      <div className="text-red-400 font-bold"><span className="text-zinc-500">[16:30:10]</span> [ERROR] Webhook delivery failed: endpoint returned status 503. Retrying...</div>
                    )}
                  </div>
                </Card>

              </div>
            )}

          </div>
        )}

        {/* DIALOG FOR GENERATED TOKEN (API KEYS) */}
        {showTokenDialog && (
          <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-md w-full border border-brand-border dark:border-border shadow-2xl p-6 flex flex-col gap-4 text-left">
              <h3 className="text-lg font-bold text-brand-navy dark:text-foreground">Developer API Token Generated</h3>
              <div className="p-3 bg-zinc-950/20 border border-border rounded-xl flex gap-2 items-start text-xs select-none leading-normal text-amber-500">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>Make sure to copy this token key now. For your security, this key cannot be recovered or shown again.</span>
              </div>
              <div className="flex flex-col gap-1.5 select-text">
                <label className="text-xs font-bold text-brand-navy dark:text-foreground">Access Token Key</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedToken}
                    readOnly
                    className="flex-grow h-10 px-3 bg-zinc-100 dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs font-mono text-foreground select-all focus:outline-none"
                  />
                  <Button
                    onClick={() => handleCopyToClipboard(generatedToken, "API key copied to clipboard.")}
                    size="sm"
                    className="h-10 px-4 text-xs font-bold uppercase"
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <div className="flex justify-end select-none mt-2">
                <Button onClick={() => setShowTokenDialog(false)} size="sm" className="text-xs uppercase font-bold bg-brand-navy text-white">
                  I have copied the key
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* FLOATING DEBUG BANNER: UI STATES SWITCHER UTILITY */}
        <div className="fixed bottom-4 right-4 z-40 bg-zinc-950/90 border border-zinc-800 rounded-xl p-3 shadow-2xl max-w-[240px] flex flex-col gap-2 select-none text-left backdrop-blur-sm">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Settings className="h-3 w-3 animate-spin" />
            UI State Switcher (QA Demo)
          </span>
          <div className="grid grid-cols-2 gap-1 text-[8px] font-bold uppercase select-none">
            {[
              { id: "default", label: "Default state" },
              { id: "loading", label: "Loading" },
              { id: "empty", label: "Empty line" },
              { id: "disconnected", label: "Outage Error" },
              { id: "expired", label: "Expired key" },
              { id: "permission_error", label: "Role Gated" },
              { id: "maintenance", label: "Maintenance" }
            ].map(state => (
              <button
                key={state.id}
                onClick={() => {
                  setUiStateMode(state.id as any);
                  addToast(`Previewing UI State: ${state.label}`, "info");
                }}
                className={`px-1.5 py-1 rounded text-center transition-all cursor-pointer truncate ${
                  uiStateMode === state.id
                    ? "bg-brand-sky text-white"
                    : "bg-zinc-850 hover:bg-zinc-800 text-zinc-300"
                }`}
                title={state.label}
              >
                {state.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
