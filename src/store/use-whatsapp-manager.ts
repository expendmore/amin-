import { create } from "zustand";
import {
  BusinessProfile,
  MetaNumber,
  ManagerTemplate,
  WebhookRegistry,
  ApiTokenScope,
  ComplianceSettings,
  ManagerAuditLog,
  SystemHealthStatus,
  WebhookLog
} from "@/types/whatsapp-manager";

// Initial mock Business Profile
const INITIAL_PROFILE: BusinessProfile = {
  name: "Anshuman Enterprises Ltd",
  logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop",
  description: "Enterprise multi-channel customer communications hub. Handles customer checkout receipts, support ticket allocations, and automated alerts streams.",
  email: "billing@anshumanenterprises1119.in",
  phone: "+91 99999 88888",
  website: "https://anshumanenterprises1119.in",
  category: "Retail & E-commerce",
  timezone: "Asia/Kolkata (IST)",
  address: "Plot 124, Phase 3, Industrial Area, Noida, Uttar Pradesh, 201301",
  verificationStatus: "verified",
  businessHours: [
    { day: "Monday", open: "09:00", close: "18:00", isActive: true },
    { day: "Tuesday", open: "09:00", close: "18:00", isActive: true },
    { day: "Wednesday", open: "09:00", close: "18:00", isActive: true },
    { day: "Thursday", open: "09:00", close: "18:00", isActive: true },
    { day: "Friday", open: "09:00", close: "18:00", isActive: true },
    { day: "Saturday", open: "10:00", close: "16:00", isActive: true },
    { day: "Sunday", open: "00:00", close: "00:00", isActive: false }
  ]
};

// Initial connected Meta phone numbers
const INITIAL_NUMBERS: MetaNumber[] = [
  {
    id: "num-1",
    phoneNumber: "+91 98765 43210",
    displayName: "Anshuman Billing alerts",
    verificationStatus: "verified",
    qualityRating: "Green (High)",
    messagingLimit: "100k/day",
    healthStatus: "healthy",
    connectedAt: "2026-05-10T12:00:00Z"
  },
  {
    id: "num-2",
    phoneNumber: "+91 88888 77777",
    displayName: "Anshuman Support desk",
    verificationStatus: "verified",
    qualityRating: "Yellow (Medium)",
    messagingLimit: "10k/day",
    healthStatus: "warning",
    connectedAt: "2026-06-01T10:00:00Z"
  },
  {
    id: "num-3",
    phoneNumber: "+91 77777 66666",
    displayName: "Anshuman Campaign Outbound",
    verificationStatus: "unverified",
    qualityRating: "Green (High)",
    messagingLimit: "250/day",
    healthStatus: "critical",
    connectedAt: "2026-06-25T09:00:00Z"
  }
];

// Initial pre-approved WhatsApp templates library
const INITIAL_TEMPLATES: ManagerTemplate[] = [
  {
    id: "temp-1",
    name: "welcome_onboarding_alert",
    category: "marketing",
    language: "English (US)",
    status: "approved",
    bodyText: "Hello {{1}}! Welcome to Anshuman Enterprises. We are excited to help you automate your workflows. Click below to verify your email.",
    headerType: "text",
    headerText: "Welcome to ExpendMore",
    footerText: "ExpendMore Automated Agent Node",
    buttons: [
      { type: "url", text: "Verify Email", value: "https://expendmore.ai/verify" }
    ],
    createdAt: "2026-06-12T14:00:00Z"
  },
  {
    id: "temp-2",
    name: "billing_invoice_receipt",
    category: "utility",
    language: "English (US)",
    status: "approved",
    bodyText: "Dear {{1}}, your invoice for billing cycle {{2}} is ready. The total amount processed is {{3}}. Download the PDF invoice below.",
    headerType: "media",
    footerText: "Billing Support",
    buttons: [
      { type: "quick_reply", text: "Confirm Receipt" }
    ],
    createdAt: "2026-06-18T10:00:00Z"
  },
  {
    id: "temp-3",
    name: "otp_verification_code",
    category: "authentication",
    language: "English (US)",
    status: "approved",
    bodyText: "Your ExpendMore verification OTP security code is {{1}}. This code expires in 5 minutes. Do not share this OTP code.",
    headerType: "none",
    buttons: [
      { type: "phone", text: "Call Support", value: "+91 99999 88888" }
    ],
    createdAt: "2026-06-24T09:00:00Z"
  },
  {
    id: "temp-4",
    name: "flash_sale_discount_promo",
    category: "marketing",
    language: "Hindi",
    status: "pending",
    bodyText: "नमस्ते {{1}}, आपके ExpendMore Wallet में 200 क्रेडिट्स जोड़ दिए गए हैं। आज ही इस्तेमाल करें।",
    headerType: "none",
    buttons: [],
    createdAt: "2026-06-26T11:00:00Z"
  }
];

// Initial mock Webhooks Center details
const INITIAL_WEBHOOK: WebhookRegistry = {
  url: "https://api.anshumanenterprises1119.in/v1/whatsapp/webhook",
  secret: "whsec_expendmore_ai_signature_2026_xyz",
  subscribedEvents: ["messages.received", "messages.sent", "messages.status.delivered", "messages.status.read", "templates.status.updated"],
  retryRuleCount: 3,
  deliveryLogs: [
    { id: "log-1", timestamp: "2026-06-26T17:10:00Z", event: "messages.received", payload: '{"from":"+91 9876543210","text":"Hello"}', responseStatus: 200, latencyMs: 45, status: "success" },
    { id: "log-2", timestamp: "2026-06-26T17:15:00Z", event: "messages.status.read", payload: '{"message_id":"msg_892bka","status":"read"}', responseStatus: 200, latencyMs: 38, status: "success" },
    { id: "log-3", timestamp: "2026-06-26T17:20:00Z", event: "templates.status.updated", payload: '{"template_id":"temp-4","status":"approved"}', responseStatus: 500, latencyMs: 250, status: "failure" }
  ]
};

// Initial API Access tokens
const INITIAL_TOKENS: ApiTokenScope[] = [
  {
    id: "tok-1",
    tokenValue: "expendmore_live_token_7162bkaOS8942bka",
    scopes: ["whatsapp_business_messaging", "whatsapp_business_management", "contacts_crm_write"],
    permissions: ["Send Templates", "Read Webhooks", "Update Contacts"],
    expiryDate: "2026-12-31T23:59:59Z",
    isActive: true,
    createdAt: "2026-06-10T12:00:00Z"
  },
  {
    id: "tok-2",
    tokenValue: "expendmore_sandbox_token_89274bka",
    scopes: ["whatsapp_business_messaging"],
    permissions: ["Send Templates"],
    expiryDate: "2026-07-31T23:59:59Z",
    isActive: true,
    createdAt: "2026-06-15T09:00:00Z"
  }
];

// Initial GDPR Compliance policies
const INITIAL_COMPLIANCE: ComplianceSettings = {
  gdprConsentRequired: true,
  optInTemplateId: "temp-1",
  optOutKeywords: ["STOP", "UNSUBSCRIBE", "OPT OUT", "Nikal"],
  dataRetentionPolicies: [
    { dataType: "Customer Conversations", retentionPeriodMonths: 6, autoDeleteEnabled: true },
    { dataType: "Media Attachments", retentionPeriodMonths: 3, autoDeleteEnabled: true },
    { dataType: "Fulfillment Invoices", retentionPeriodMonths: 24, autoDeleteEnabled: false }
  ],
  legalDocumentsSigned: [
    { title: "WhatsApp Business Service Terms", signedAt: "2026-05-10T12:00:00Z", version: "v2.4" },
    { title: "Meta Commercial Terms Agreement", signedAt: "2026-05-10T12:05:00Z", version: "v4.1" }
  ]
};

// Initial system audit logs
const INITIAL_AUDITS: ManagerAuditLog[] = [
  { id: "aud-1", timestamp: "2026-06-20T10:00:00Z", actorName: "Aditya Tiwari", actorRole: "SUPER_ADMIN", action: "Verify Business", module: "Business Profile", details: "Uploaded GSTIN documents. Status: Verified.", ipAddress: "192.168.1.15" },
  { id: "aud-2", timestamp: "2026-06-24T12:30:00Z", actorName: "Warehouse Auto Bot", actorRole: "SYSTEM", action: "Deduct Inventory", module: "Fulfillment", details: "Deducted stock for ORD-8941", ipAddress: "127.0.0.1" },
  { id: "aud-3", timestamp: "2026-06-25T14:30:00Z", actorName: "Aditya Tiwari", actorRole: "SUPER_ADMIN", action: "Create Webhook", module: "Webhook Center", details: "Subscribed to templates.status.updated events", ipAddress: "192.168.1.15" },
  { id: "aud-4", timestamp: "2026-06-26T09:12:00Z", actorName: "Sarah Jenkins", actorRole: "ADMIN", action: "Create Template", module: "Template Manager", details: "Created draft welcome onboarding template", ipAddress: "192.168.2.40" }
];

// Initial diagnostics and latency thresholds
const INITIAL_DIAGNOSTICS: SystemHealthStatus = {
  apiStatus: "healthy",
  webhookStatus: "healthy",
  latencyMs: 84,
  activeErrorsCount: 0,
  warningsCount: 0,
  isMaintenanceMode: false,
  lastBackupAt: "2026-06-25T00:00:00Z"
};

// Backup configurations logs list
interface BackupRecord {
  id: string;
  filename: string;
  sizeKb: number;
  createdAt: string;
  status: "success" | "restored";
}

const INITIAL_BACKUPS: BackupRecord[] = [
  { id: "bak-1", filename: "whatsapp_config_backup_20260620.json", sizeKb: 145.2, createdAt: "2026-06-20T00:00:00Z", status: "success" },
  { id: "bak-2", filename: "whatsapp_config_backup_20260625.json", sizeKb: 148.5, createdAt: "2026-06-25T00:00:00Z", status: "restored" }
];

interface WhatsappManagerState {
  profile: BusinessProfile;
  connectedNumbers: MetaNumber[];
  templates: ManagerTemplate[];
  webhookRegistry: WebhookRegistry;
  apiTokens: ApiTokenScope[];
  compliance: ComplianceSettings;
  auditLogs: ManagerAuditLog[];
  health: SystemHealthStatus;
  backups: BackupRecord[];
  
  // UI Diagnostic State swapper (standard healthy UI vs simulated states)
  activeSimulatedState: "Healthy" | "Offline" | "Maintenance" | "Permission Error" | "Disconnected" | "Warning" | "Critical";

  // Operations
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  registerNumber: (num: Omit<MetaNumber, "id" | "connectedAt">) => void;
  deleteNumber: (id: string) => void;
  createTemplate: (temp: Omit<ManagerTemplate, "id" | "createdAt" | "status">) => void;
  rotateTokenKey: (id: string) => void;
  updateWebhook: (updates: Partial<WebhookRegistry>) => void;
  updateCompliance: (updates: Partial<ComplianceSettings>) => void;
  addAuditLog: (log: Omit<ManagerAuditLog, "id" | "timestamp" | "ipAddress">) => void;
  createConfigBackup: () => void;
  restoreConfigBackup: (id: string) => void;
  setSimulatedState: (state: WhatsappManagerState["activeSimulatedState"]) => void;
}

export const useWhatsappManager = create<WhatsappManagerState>((set, get) => ({
  profile: INITIAL_PROFILE,
  connectedNumbers: INITIAL_NUMBERS,
  templates: INITIAL_TEMPLATES,
  webhookRegistry: INITIAL_WEBHOOK,
  apiTokens: INITIAL_TOKENS,
  compliance: INITIAL_COMPLIANCE,
  auditLogs: INITIAL_AUDITS,
  health: INITIAL_DIAGNOSTICS,
  backups: INITIAL_BACKUPS,
  activeSimulatedState: "Healthy",

  updateProfile: (updates) => {
    set((state) => ({
      profile: { ...state.profile, ...updates }
    }));
    get().addAuditLog({
      actorName: "Aditya Tiwari",
      actorRole: "SUPER_ADMIN",
      action: "Update Profile",
      module: "Business Profile",
      details: "Modified Business profile information details"
    });
  },

  registerNumber: (num) => {
    const newNum: MetaNumber = {
      ...num,
      id: `num-${Date.now()}`,
      connectedAt: new Date().toISOString()
    };
    set((state) => ({
      connectedNumbers: [...state.connectedNumbers, newNum]
    }));
    get().addAuditLog({
      actorName: "Aditya Tiwari",
      actorRole: "SUPER_ADMIN",
      action: "Register Phone",
      module: "Phone Manager",
      details: `Registered display number ${num.phoneNumber} (${num.displayName})`
    });
  },

  deleteNumber: (id) => {
    const target = get().connectedNumbers.find(n => n.id === id);
    if (!target) return;

    set((state) => ({
      connectedNumbers: state.connectedNumbers.filter(n => n.id !== id)
    }));
    get().addAuditLog({
      actorName: "Aditya Tiwari",
      actorRole: "SUPER_ADMIN",
      action: "Remove Phone",
      module: "Phone Manager",
      details: `Deleted connected number ${target.phoneNumber}`
    });
  },

  createTemplate: (temp) => {
    const newTemp: ManagerTemplate = {
      ...temp,
      id: `temp-${Date.now()}`,
      status: "approved", // auto approved in mock sandbox
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      templates: [newTemp, ...state.templates]
    }));
    get().addAuditLog({
      actorName: "Sarah Jenkins",
      actorRole: "ADMIN",
      action: "Create Template",
      module: "Template Manager",
      details: `Created new template node welcome_${temp.name}`
    });
  },

  rotateTokenKey: (id) => {
    const newKey = `expendmore_live_token_rotated_${Math.floor(1000 + Math.random()*9000)}`;
    set((state) => ({
      apiTokens: state.apiTokens.map(tok =>
        tok.id === id
          ? {
              ...tok,
              tokenValue: newKey,
              createdAt: new Date().toISOString(),
              expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // 180 days limit
            }
          : tok
      )
    }));
    get().addAuditLog({
      actorName: "Aditya Tiwari",
      actorRole: "SUPER_ADMIN",
      action: "Rotate API Key",
      module: "API Manager",
      details: `Rotated access credential token key node: ${id}`
    });
  },

  updateWebhook: (updates) => {
    set((state) => ({
      webhookRegistry: { ...state.webhookRegistry, ...updates }
    }));
    get().addAuditLog({
      actorName: "Aditya Tiwari",
      actorRole: "SUPER_ADMIN",
      action: "Update Webhook",
      module: "Webhook Center",
      details: `Adjusted webhook config endpoint URL to: ${updates.url}`
    });
  },

  updateCompliance: (updates) => {
    set((state) => ({
      compliance: { ...state.compliance, ...updates }
    }));
    get().addAuditLog({
      actorName: "Aditya Tiwari",
      actorRole: "SUPER_ADMIN",
      action: "Update Compliance Settings",
      module: "Compliance Center",
      details: "Modified GDPR consent configurations and retention policies."
    });
  },

  addAuditLog: (log) => {
    const newEntry: ManagerAuditLog = {
      ...log,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ipAddress: "192.168.1.15" // Mock IP
    };
    set((state) => ({
      auditLogs: [newEntry, ...state.auditLogs]
    }));
  },

  createConfigBackup: () => {
    const id = `bak-${Date.now()}`;
    const newBackup: BackupRecord = {
      id,
      filename: `whatsapp_config_backup_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.json`,
      sizeKb: 148.8,
      createdAt: new Date().toISOString(),
      status: "success"
    };

    set((state) => ({
      backups: [newBackup, ...state.backups],
      health: {
        ...state.health,
        lastBackupAt: new Date().toISOString()
      }
    }));

    get().addAuditLog({
      actorName: "Aditya Tiwari",
      actorRole: "SUPER_ADMIN",
      action: "Create Backup",
      module: "System Backups",
      details: "Created full configurations backup snapshot catalog."
    });
  },

  restoreConfigBackup: (id) => {
    set((state) => ({
      backups: state.backups.map(bak =>
        bak.id === id ? { ...bak, status: "restored" } : bak
      )
    }));

    get().addAuditLog({
      actorName: "Aditya Tiwari",
      actorRole: "SUPER_ADMIN",
      action: "Restore Backup",
      module: "System Backups",
      details: `Restored WhatsApp settings configurations backup snapshot ID: ${id}`
    });
  },

  setSimulatedState: (state) => {
    // Modify health states indicators according to simulator
    let newHealth: SystemHealthStatus = { ...get().health };

    if (state === "Healthy") {
      newHealth = { ...newHealth, apiStatus: "healthy", webhookStatus: "healthy", latencyMs: 84, activeErrorsCount: 0, warningsCount: 0 };
    } else if (state === "Offline") {
      newHealth = { ...newHealth, apiStatus: "down", webhookStatus: "down", latencyMs: 0 };
    } else if (state === "Maintenance") {
      newHealth = { ...newHealth, isMaintenanceMode: true };
    } else if (state === "Warning") {
      newHealth = { ...newHealth, warningsCount: 3, latencyMs: 195 };
    } else if (state === "Critical") {
      newHealth = { ...newHealth, apiStatus: "degraded", webhookStatus: "down", activeErrorsCount: 4, latencyMs: 450 };
    }

    set({
      activeSimulatedState: state,
      health: newHealth
    });
  }
}));
