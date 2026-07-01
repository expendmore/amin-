"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import PageContainer from "@/components/navigation/PageContainer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useDashboard } from "@/store/use-dashboard";
import { useToast } from "@/store/use-toast";
import { 
  User, 
  Settings, 
  Shield, 
  Trash2, 
  Camera, 
  Chrome, 
  Smartphone,
  Globe,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Key,
  Copy,
  Plus,
  Trash,
  Check,
  Link as LinkIcon,
  Github
} from "lucide-react";

type ActiveTab = "profile" | "security" | "preferences" | "connections" | "tokens";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  scope: "read" | "write" | "admin";
  created_at: string;
  last_used: string;
}

export default function SettingsPage() {
  const { addToast } = useToast();
  const { 
    profile, 
    settings, 
    activeSessions, 
    updateProfile, 
    updateSettings, 
    revokeSession, 
    deleteAccount 
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  
  // Profile Form States
  const [fullName, setFullName] = useState(profile.full_name);
  const [username, setUsername] = useState(profile.username || "arjun_sharma");
  const [company, setCompany] = useState(profile.company || "Anshuman Enterprises");
  const [phone, setPhone] = useState(profile.phone || "+91 98765 43210");
  const [profileTimezone, setProfileTimezone] = useState(profile.timezone || "Asia/Kolkata");
  const [profileLanguage, setProfileLanguage] = useState(profile.language || "en-US");
  
  // Preference Form States
  const [theme, setTheme] = useState(settings.theme);
  const [emailNotif, setEmailNotif] = useState(settings.notifications.email);
  const [pushNotif, setPushNotif] = useState(settings.notifications.push);
  const [marketingNotif, setMarketingNotif] = useState(settings.notifications.marketing);
  const [telemetry, setTelemetry] = useState(settings.privacy.telemetry);

  // Connected Accounts Mock State
  const [connectedAccs, setConnectedAccs] = useState({
    google: { connected: true, email: profile.email },
    github: { connected: false, email: "" },
    microsoft: { connected: false, email: "" }
  });

  // API Tokens Mock State
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: "k1", name: "Production Gateway Key", key: "sk_live_51P...f3a9", scope: "admin", created_at: "2026-06-25", last_used: "2 hours ago" },
    { id: "k2", name: "Staging Testing Key", key: "sk_test_51P...1e4c", scope: "read", created_at: "2026-06-26", last_used: "Never" },
  ]);

  // API key creation form state
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScope, setNewKeyScope] = useState<"read" | "write" | "admin">("read");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      addToast("Display name must be at least 2 characters long.", "error");
      return;
    }
    updateProfile({ 
      full_name: fullName, 
      username,
      company,
      phone,
      timezone: profileTimezone,
      language: profileLanguage
    });
    addToast("Profile details updated successfully!", "success");
  };

  const handleUpdatePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      theme,
      language: profileLanguage,
      timeZone: profileTimezone,
      notifications: {
        email: emailNotif,
        push: pushNotif,
        marketing: marketingNotif,
      },
      privacy: {
        telemetry,
        shareData: settings.privacy.shareData,
      }
    });
    addToast("Preferences saved!", "success");
  };

  const handleAvatarUploadSimulate = () => {
    const urls = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    ];
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    updateProfile({ avatar: randomUrl });
    addToast("Avatar image updated successfully!", "success");
  };

  const handleRevoke = (id: string, device: string) => {
    revokeSession(id);
    addToast(`Revoked active session for ${device}`, "info");
  };

  const handleDeleteTrigger = () => {
    if (confirm("Are you sure you want to permanently delete your ExpendMore account? This action is irreversible.")) {
      deleteAccount();
      addToast("Account deleted successfully.", "info");
      window.location.href = "/";
    }
  };

  // Connected Accounts handlers
  const handleToggleConnection = (provider: "google" | "github" | "microsoft") => {
    setConnectedAccs(prev => {
      const isConnected = prev[provider].connected;
      if (isConnected) {
        addToast(`Disconnected ${provider.charAt(0).toUpperCase() + provider.slice(1)} account.`, "info");
        return {
          ...prev,
          [provider]: { connected: false, email: "" }
        };
      } else {
        const mockEmail = provider === "google" ? profile.email : `arjun@${provider}.com`;
        addToast(`Successfully linked ${provider.charAt(0).toUpperCase() + provider.slice(1)} account.`, "success");
        return {
          ...prev,
          [provider]: { connected: true, email: mockEmail }
        };
      }
    });
  };

  // API Access Tokens handlers
  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      addToast("Please provide a name for the API Key.", "error");
      return;
    }

    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const keyString = `sk_${newKeyScope}_${randomHex}`;
    
    const newKeyItem: ApiKey = {
      id: `k_${Math.random().toString(36).substring(2, 9)}`,
      name: newKeyName.trim(),
      key: `${keyString.substring(0, 10)}...${keyString.substring(keyString.length - 4)}`,
      scope: newKeyScope,
      created_at: new Date().toISOString().split("T")[0],
      last_used: "Never"
    };

    setGeneratedKey(keyString);
    setApiKeys(prev => [newKeyItem, ...prev]);
    setNewKeyName("");
    addToast("New API Key generated successfully!", "success");
  };

  const handleDeleteKey = (id: string, name: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    addToast(`API Key "${name}" revoked.`, "info");
  };

  const handleCopyClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("Copied to clipboard!", "success");
  };

  // Microsoft SVG Logo Component
  const MicrosoftIcon = () => (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 23 23" fill="none">
      <rect width="10" height="10" fill="#F25022"/>
      <rect x="12" width="10" height="10" fill="#7FBA00"/>
      <rect y="12" width="10" height="10" fill="#00A4EF"/>
      <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
    </svg>
  );

  return (
    <DashboardShell>
      <PageContainer
        title="Workspace Settings"
        subtitle="Manage personal profiles, interface preferences, and workspace security keys."
      >
        <div className="flex flex-col lg:flex-row gap-6 border border-border bg-card rounded-2xl p-6 h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] overflow-hidden">
          
          {/* Navigation Sidebar Panel */}
          <div className="w-full lg:w-60 shrink-0 flex flex-col gap-1 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-4 select-none overflow-y-auto">
            <button
              onClick={() => { setActiveTab("profile"); setGeneratedKey(null); }}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 ${
                activeTab === "profile"
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4 shrink-0" />
              <span>Personal Profile</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("preferences"); setGeneratedKey(null); }}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 ${
                activeTab === "preferences"
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>Preferences & Alerts</span>
            </button>

            <button
              onClick={() => { setActiveTab("security"); setGeneratedKey(null); }}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 ${
                activeTab === "security"
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="h-4 w-4 shrink-0" />
              <span>Security & Sessions</span>
            </button>

            <button
              onClick={() => { setActiveTab("connections"); setGeneratedKey(null); }}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 ${
                activeTab === "connections"
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LinkIcon className="h-4 w-4 shrink-0" />
              <span>Connected Accounts</span>
            </button>

            <button
              onClick={() => { setActiveTab("tokens"); setGeneratedKey(null); }}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 ${
                activeTab === "tokens"
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Key className="h-4 w-4 shrink-0" />
              <span>API Access Tokens</span>
            </button>
          </div>

          {/* Interactive Form Area */}
          <div className="flex-grow overflow-y-auto lg:pl-4">
            
            {/* TAB 1: Personal Profile */}
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6 max-w-2xl">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">Profile Information</h3>
                  <p className="text-xs text-muted-foreground">Modify your account public username, details and visual identity.</p>
                </div>

                {/* Avatar upload container */}
                <div className="flex items-center gap-4 select-none">
                  <div className="relative h-16 w-16 rounded-full border border-border overflow-hidden bg-zinc-900 flex items-center justify-center shrink-0">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold font-mono text-muted-foreground select-none uppercase">
                        {fullName.charAt(0)}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleAvatarUploadSimulate}
                      className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                      title="Upload mock image"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-foreground">Workspace Picture</span>
                    <button
                      type="button"
                      onClick={handleAvatarUploadSimulate}
                      className="text-[10px] text-brand-400 hover:text-brand-500 font-semibold transition-colors text-left cursor-pointer"
                    >
                      Change image URL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Arjun Sharma"
                  />
                  <Input
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="arjun_sharma"
                  />
                  <Input
                    label="Company / Workspace"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Anshuman Enterprises"
                  />
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  
                  {/* Language */}
                  <div className="flex flex-col gap-1.5 select-none">
                    <label className="text-xs font-semibold text-brand-navy dark:text-muted-foreground flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      <span>Interface Language</span>
                    </label>
                    <select
                      value={profileLanguage}
                      onChange={(e) => setProfileLanguage(e.target.value)}
                      className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 dark:focus:border-primary dark:focus:ring-primary/15"
                    >
                      <option value="en-US">English (United States)</option>
                      <option value="es-ES">Español (Spain)</option>
                      <option value="hi-IN">Hindi (India)</option>
                      <option value="de-DE">Deutsch (Germany)</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div className="flex flex-col gap-1.5 select-none">
                    <label className="text-xs font-semibold text-brand-navy dark:text-muted-foreground flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      <span>Workspace Timezone</span>
                    </label>
                    <select
                      value={profileTimezone}
                      onChange={(e) => setProfileTimezone(e.target.value)}
                      className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 dark:focus:border-primary dark:focus:ring-primary/15"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="GMT">GMT (Greenwich Mean Time)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT/BST)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                  <div className="h-10 px-3 bg-secondary/40 border border-border rounded-lg text-xs text-muted-foreground flex items-center w-full max-w-md select-all">
                    {profile.email}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 select-none">
                  <label className="text-xs font-semibold text-muted-foreground">Active Plan Tier</label>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-brand-950/20 border border-brand-500/10 text-brand-400 text-xs font-bold font-mono select-none uppercase">
                      {profile.tier} TIER
                    </span>
                  </div>
                </div>

                <Button type="submit" className="w-32 mt-2 h-9 text-xs">
                  Save Profile
                </Button>
              </form>
            )}

            {/* TAB 2: Preferences & Alerts */}
            {activeTab === "preferences" && (
              <form onSubmit={handleUpdatePreferences} className="flex flex-col gap-6 max-w-xl">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">Workspace Preferences</h3>
                  <p className="text-xs text-muted-foreground">Configure the visual layout, themes and alert triggers.</p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Theme Select */}
                  <div className="flex flex-col gap-1.5 select-none">
                    <label className="text-xs font-semibold text-muted-foreground">UI Visual Theme</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["dark", "light", "system"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTheme(t)}
                          className={`h-9 text-xs rounded-lg border font-semibold transition-all duration-150 capitalize cursor-pointer ${
                            theme === t
                              ? "border-brand-sky bg-brand-sky-light/10 text-brand-sky"
                              : "border-border text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-border/45 my-2" />

                  {/* Notification checkboxes */}
                  <div className="flex flex-col gap-3 select-none">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Bell className="h-4 w-4 text-brand-sky" />
                      <span>Alert Preferences</span>
                    </h4>
                    
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={emailNotif}
                        onChange={(e) => setEmailNotif(e.target.checked)}
                        className="rounded bg-white dark:bg-zinc-900 border-brand-border dark:border-border text-brand-sky focus:ring-brand-sky h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">Email notifications for quota warnings and account limits</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pushNotif}
                        onChange={(e) => setPushNotif(e.target.checked)}
                        className="rounded bg-white dark:bg-zinc-900 border-brand-border dark:border-border text-brand-sky focus:ring-brand-sky h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">In-app notifications for agent actions</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={marketingNotif}
                        onChange={(e) => setMarketingNotif(e.target.checked)}
                        className="rounded bg-white dark:bg-zinc-900 border-brand-border dark:border-border text-brand-sky focus:ring-brand-sky h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">Marketing update emails on new model models release</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={telemetry}
                        onChange={(e) => setTelemetry(e.target.checked)}
                        className="rounded bg-white dark:bg-zinc-900 border-brand-border dark:border-border text-brand-sky focus:ring-brand-sky h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">Share anonymous usage logs to improve system response time</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-32 mt-2 h-9 text-xs">
                  Save Preferences
                </Button>
              </form>
            )}

            {/* TAB 3: Security & Sessions */}
            {activeTab === "security" && (
              <div className="flex flex-col gap-6 max-w-xl select-none">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">Security & Sessions</h3>
                  <p className="text-xs text-muted-foreground">Manage active session devices and wipe options.</p>
                </div>

                {/* Active Sessions */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">Active Session Logs</span>
                  <div className="flex flex-col gap-2">
                    {activeSessions.map((session) => (
                      <div 
                        key={session.id}
                        className="p-4 bg-zinc-900/40 border border-border rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-foreground">{session.device}</span>
                            <span className="text-[10px] text-muted-foreground">IP: {session.ip} • Date: {session.date}</span>
                          </div>
                        </div>
                        {session.active ? (
                          <span className="text-[10px] text-brand-sky font-semibold px-2 py-0.5 bg-brand-sky-light/10 border border-brand-sky/20 rounded-full">
                            Active
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRevoke(session.id, session.device)}
                            className="text-[10px] text-destructive hover:text-destructive/80 font-bold px-2 py-0.5 hover:bg-destructive/5 rounded transition-all cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-border/45 my-2" />

                {/* Dangerous Area */}
                <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-destructive flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      Delete ExpendMore Account
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Permanently wipe all conversation logs, workspace connections, and custom agent parameters.
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteTrigger}
                    className="h-9 px-4 text-xs font-semibold rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: Connected Accounts */}
            {activeTab === "connections" && (
              <div className="flex flex-col gap-6 max-w-xl select-none">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">Connected Accounts</h3>
                  <p className="text-xs text-muted-foreground">Manage single sign-on linkages and credentials verification.</p>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Google */}
                  <div className="p-4 bg-zinc-900/40 border border-border rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Chrome className="h-5 w-5 text-red-500" />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">Google SSO Authentication</span>
                        <span className="text-[10px] text-muted-foreground">
                          {connectedAccs.google.connected ? connectedAccs.google.email : "Not linked"}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant={connectedAccs.google.connected ? "outline" : "primary"}
                      size="sm"
                      onClick={() => handleToggleConnection("google")}
                      className="text-[10px] h-8 w-24"
                    >
                      {connectedAccs.google.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>

                  {/* GitHub */}
                  <div className="p-4 bg-zinc-900/40 border border-border rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Github className="h-5 w-5 text-foreground" />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">GitHub Integration</span>
                        <span className="text-[10px] text-muted-foreground">
                          {connectedAccs.github.connected ? connectedAccs.github.email : "Not linked"}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant={connectedAccs.github.connected ? "outline" : "primary"}
                      size="sm"
                      onClick={() => handleToggleConnection("github")}
                      className="text-[10px] h-8 w-24"
                    >
                      {connectedAccs.github.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>

                  {/* Microsoft */}
                  <div className="p-4 bg-zinc-900/40 border border-border rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MicrosoftIcon />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">Microsoft Azure SSO</span>
                        <span className="text-[10px] text-muted-foreground">
                          {connectedAccs.microsoft.connected ? connectedAccs.microsoft.email : "Not linked"}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant={connectedAccs.microsoft.connected ? "outline" : "primary"}
                      size="sm"
                      onClick={() => handleToggleConnection("microsoft")}
                      className="text-[10px] h-8 w-24"
                    >
                      {connectedAccs.microsoft.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: API Access Tokens */}
            {activeTab === "tokens" && (
              <div className="flex flex-col gap-6 max-w-2xl select-none">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">API Access Tokens</h3>
                  <p className="text-xs text-muted-foreground">Create secure keys to orchestrate ExpendMore gateways programmatically.</p>
                </div>

                {/* Key Builder Form */}
                <form onSubmit={handleGenerateKey} className="p-4 bg-zinc-900/30 border border-border rounded-xl flex flex-col gap-4">
                  <span className="text-xs font-bold text-foreground">Generate New API Key</span>
                  
                  <div className="flex flex-col md:flex-row gap-3 items-end">
                    <div className="flex-grow">
                      <Input
                        label="Token Name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g. Production Backend Hub"
                        className="bg-white dark:bg-zinc-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full md:w-48 shrink-0">
                      <label className="text-xs font-semibold text-brand-navy select-none">
                        Scope Privilege
                      </label>
                      <select
                        value={newKeyScope}
                        onChange={(e) => setNewKeyScope(e.target.value as any)}
                        className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 dark:focus:border-primary dark:focus:ring-primary/15"
                      >
                        <option value="read">Read Only (gateway.read)</option>
                        <option value="write">Read & Write (gateway.write)</option>
                        <option value="admin">Full Admin (gateway.all)</option>
                      </select>
                    </div>
                    <Button type="submit" size="md" className="h-10 text-xs shrink-0 px-4 flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      <span>Generate</span>
                    </Button>
                  </div>
                </form>

                {/* Generated Key Show Box */}
                {generatedKey && (
                  <div className="p-4 border border-brand-sky bg-brand-sky-light/10 rounded-xl flex flex-col gap-2">
                    <span className="text-xs font-bold text-brand-sky flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      API Secret Token Created
                    </span>
                    <p className="text-[10px] text-zinc-300">
                      Make sure to copy your secret key now. You will not be able to retrieve it again for security reasons.
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-grow h-10 px-3 bg-zinc-950/80 border border-border rounded-lg text-xs text-brand-sky font-mono flex items-center select-all overflow-x-auto whitespace-nowrap">
                        {generatedKey}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleCopyClipboard(generatedKey)}
                        className="h-10 w-10 shrink-0 border border-brand-sky text-brand-sky hover:bg-brand-sky-light/20"
                        isIconOnly
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Active Keys List */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">Active API Tokens</span>
                  <div className="border border-border rounded-xl overflow-hidden bg-zinc-900/30">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-zinc-900/60 text-muted-foreground select-none">
                          <th className="p-3 font-semibold">Token Name</th>
                          <th className="p-3 font-semibold">Scope</th>
                          <th className="p-3 font-semibold">Secret Key</th>
                          <th className="p-3 font-semibold">Created</th>
                          <th className="p-3 font-semibold">Last Used</th>
                          <th className="p-3 font-semibold text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiKeys.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                              No active API keys found. Build one above.
                            </td>
                          </tr>
                        ) : (
                          apiKeys.map((k) => (
                            <tr key={k.id} className="border-b border-border last:border-0 hover:bg-zinc-900/20">
                              <td className="p-3 font-medium text-foreground">{k.name}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                  k.scope === "admin" 
                                    ? "bg-red-950/20 border border-red-500/20 text-red-400"
                                    : k.scope === "write"
                                    ? "bg-amber-950/20 border border-amber-500/20 text-amber-400"
                                    : "bg-zinc-800 border border-zinc-700 text-zinc-300"
                                }`}>
                                  {k.scope.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-muted-foreground">{k.key}</td>
                              <td className="p-3 text-muted-foreground">{k.created_at}</td>
                              <td className="p-3 text-muted-foreground">{k.last_used}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleDeleteKey(k.id, k.name)}
                                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-all inline-flex items-center justify-center cursor-pointer"
                                  title="Revoke Token"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
