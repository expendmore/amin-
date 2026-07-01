import { create } from "zustand";
import {
  IntegrationApp,
  AppConnection,
  AppCredential,
  WebhookEndpoint,
  WebhookDeliveryLog,
  ConnectionLog,
  MonitoringMetrics
} from "@/types/integrations";

// Initial mock marketplace apps catalog
const INITIAL_APPS: IntegrationApp[] = [
  {
    id: "app-1",
    name: "OpenAI GPT-4 Engine",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop",
    developer: "OpenAI Inc",
    version: "v1.2.0",
    description: "Connect to OpenAI's completion nodes. Empower your inbox agent response drafts and chatbot builders to understand complex questions, summarize threads, and draft checkout links.",
    category: "AI",
    isOfficial: true,
    isCommunity: false,
    isInstalled: true,
    features: ["Text Completion", "Embeddings Vectorization", "Semantic Classification"],
    requirements: ["Active OpenAI Developer Account", "Paid Billing API subscription quota"]
  },
  {
    id: "app-2",
    name: "Stripe Billing checkout",
    logoUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=100&auto=format&fit=crop",
    developer: "Stripe Inc",
    version: "v3.1.2",
    description: "Generate Stripe invoices, dispatch payment simulation links, and sync order paid webhook notifications straight into your WhatsApp Commerce Hub timelines.",
    category: "Payments",
    isOfficial: true,
    isCommunity: false,
    isInstalled: true,
    features: ["Invoices generation", "Payment Links creation", "Refunds triggers"],
    requirements: ["Stripe Live Mode API Secret key", "Active webhook signature verification"]
  },
  {
    id: "app-3",
    name: "HubSpot Enterprise CRM",
    logoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop",
    developer: "HubSpot Inc",
    version: "v4.0.0",
    description: "Sync your ExpendMore WhatsApp contact registers and lifetime value (LTV) summaries into HubSpot deals, companies, and timeline activities.",
    category: "CRM",
    isOfficial: true,
    isCommunity: false,
    isInstalled: false,
    features: ["Contact Two-Way Sync", "Deals update notifications", "Lifecycle stages tracking"],
    requirements: ["HubSpot OAuth 2.0 Client credentials"]
  },
  {
    id: "app-4",
    name: "Slack Team Notifications",
    logoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop",
    developer: "Slack Platform",
    version: "v2.5.0",
    description: "Broadcast live WhatsApp checkout logs, failed executions, and webhook outage warning notices directly to custom Slack workspace alerts channels.",
    category: "Communication",
    isOfficial: true,
    isCommunity: false,
    isInstalled: false,
    features: ["Channel message broadcasts", "Aborted workflow logs", "Interactive app attachments"],
    requirements: ["Slack Webhook URL configuration"]
  },
  {
    id: "app-5",
    name: "Google Drive Storage",
    logoUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=100&auto=format&fit=crop",
    developer: "Google Workspace",
    version: "v3.0.0",
    description: "Upload customer document attachments, receipts, and images compiled from WhatsApp threads automatically into dedicated secure Google Drive folders.",
    category: "Cloud Storage",
    isOfficial: true,
    isCommunity: false,
    isInstalled: true,
    features: ["Backup logs upload", "Media folder indexing", "Shared link generator"],
    requirements: ["Google Cloud console Client ID and scopes approval"]
  },
  {
    id: "app-6",
    name: "PostgreSQL Database Engine",
    logoUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=100&auto=format&fit=crop",
    developer: "Postgres Community",
    version: "v15.0",
    description: "Export telemetry database records, audit entries logs, and user activity schedules regularly into custom external relational databases.",
    category: "Databases",
    isOfficial: false,
    isCommunity: true,
    isInstalled: false,
    features: ["Raw SQL Query executor", "Database sync tasks", "Incremental logs backup"],
    requirements: ["Postgres Connection String (host, port, user, password, database)"]
  }
];

// Initial active connections list
const INITIAL_CONNECTIONS: AppConnection[] = [
  {
    id: "conn-1",
    appId: "app-1",
    name: "OpenAI Live connection",
    status: "connected",
    healthScore: 98,
    latencyMs: 78,
    credentialsId: "cred-1",
    connectedAt: "2026-06-10T12:00:00Z",
    updatedAt: "2026-06-26T12:00:00Z"
  },
  {
    id: "conn-2",
    appId: "app-2",
    name: "Stripe Billing Live",
    status: "connected",
    healthScore: 100,
    latencyMs: 95,
    credentialsId: "cred-2",
    connectedAt: "2026-06-12T14:00:00Z",
    updatedAt: "2026-06-26T14:00:00Z"
  },
  {
    id: "conn-5",
    appId: "app-5",
    name: "Google Drive backups",
    status: "permission_error",
    healthScore: 40,
    latencyMs: 320,
    credentialsId: "cred-5",
    connectedAt: "2026-06-15T09:00:00Z",
    updatedAt: "2026-06-25T11:00:00Z"
  }
];

// Initial credentials vault
const INITIAL_CREDS: AppCredential[] = [
  {
    id: "cred-1",
    connectionId: "conn-1",
    authType: "bearer_token",
    keyValue: "sk-proj-live-892bkaOS7162bka",
    scopes: ["chat.completions", "embeddings.create", "models.read"],
    createdAt: "2026-06-10T12:00:00Z"
  },
  {
    id: "cred-2",
    connectionId: "conn-2",
    authType: "api_key",
    keyValue: "rk_live_stripe_key_9028kaOS",
    scopes: ["invoices.write", "charges.read", "payment_links.create"],
    createdAt: "2026-06-12T14:00:00Z"
  },
  {
    id: "cred-5",
    connectionId: "conn-5",
    authType: "oauth",
    keyValue: "google_oauth_refresh_token_71624bka",
    scopes: ["drive.file", "drive.readonly"],
    expirationDate: "2026-06-25T11:00:00Z", // Expired, triggers permission error
    createdAt: "2026-06-15T09:00:00Z"
  }
];

// Initial outbound webhooks log
const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: "wh-2",
    connectionId: "conn-2",
    url: "https://api.anshumanenterprises1119.in/v1/stripe/webhook",
    secret: "whsec_stripe_invoice_signature_xyz",
    retryRulesCount: 3,
    deliveryLogs: [
      { id: "wl-1", timestamp: "2026-06-26T17:10:00Z", direction: "incoming", event: "invoice.payment_succeeded", payload: '{"invoice_id":"in_8923","amount":99.00}', responseCode: 200, status: "success" },
      { id: "wl-2", timestamp: "2026-06-26T17:15:00Z", direction: "incoming", event: "charge.refunded", payload: '{"charge_id":"ch_1234","amount":45.00}', responseCode: 200, status: "success" }
    ]
  }
];

// Connection audits lists
const INITIAL_LOGS: ConnectionLog[] = [
  { id: "log-1", connectionId: "conn-1", timestamp: "2026-06-26T17:00:00Z", type: "connected", message: "API handshake complete. Model configurations registry synced." },
  { id: "log-2", connectionId: "conn-2", timestamp: "2026-06-26T17:05:00Z", type: "connected", message: "Webhook ping check complete. Signatures match successfully." },
  { id: "log-3", connectionId: "conn-5", timestamp: "2026-06-25T11:00:00Z", type: "failed", message: "OAuth credentials expired. Google API returned 401 Unauthorized.", details: "Token expired at 2026-06-25T11:00:00Z. Manual re-authorization required." }
];

// Monitoring charts data
const INITIAL_MONITORING: MonitoringMetrics[] = [
  {
    connectionId: "conn-1",
    successRate: 99.5,
    failureRate: 0.5,
    availabilityPct: 99.9,
    avgLatencyMs: 78,
    timeHistory: [
      { time: "17:00", latencyMs: 74, successRate: 100 },
      { time: "17:10", latencyMs: 82, successRate: 100 },
      { time: "17:20", latencyMs: 78, successRate: 98 }
    ]
  },
  {
    connectionId: "conn-2",
    successRate: 100.0,
    failureRate: 0.0,
    availabilityPct: 100.0,
    avgLatencyMs: 95,
    timeHistory: [
      { time: "17:00", latencyMs: 92, successRate: 100 },
      { time: "17:10", latencyMs: 98, successRate: 100 },
      { time: "17:20", latencyMs: 95, successRate: 100 }
    ]
  }
];

interface IntegrationsState {
  apps: IntegrationApp[];
  connections: AppConnection[];
  credentials: AppCredential[];
  webhooks: WebhookEndpoint[];
  connectionLogs: ConnectionLog[];
  monitoring: MonitoringMetrics[];

  // App marketplace operations
  connectApp: (params: {
    appId: string;
    connectionName: string;
    authType: AppCredential["authType"];
    keyValue: string;
    scopes: string[];
  }) => void;
  
  disconnectApp: (id: string) => void;
  toggleConnectionActive: (id: string) => void;
  rotateCredential: (connectionId: string) => void;
  updateWebhookSettings: (connectionId: string, url: string) => void;
  addConnectionLog: (log: Omit<ConnectionLog, "id" | "timestamp">) => void;
}

export const useIntegrations = create<IntegrationsState>((set, get) => ({
  apps: INITIAL_APPS,
  connections: INITIAL_CONNECTIONS,
  credentials: INITIAL_CREDS,
  webhooks: INITIAL_WEBHOOKS,
  connectionLogs: INITIAL_LOGS,
  monitoring: INITIAL_MONITORING,

  connectApp: (params) => {
    const connId = `conn-${Date.now()}`;
    const credId = `cred-${Date.now()}`;
    
    const newConnection: AppConnection = {
      id: connId,
      appId: params.appId,
      name: params.connectionName,
      status: "connected",
      healthScore: 100,
      latencyMs: 85,
      credentialsId: credId,
      connectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newCredential: AppCredential = {
      id: credId,
      connectionId: connId,
      authType: params.authType,
      keyValue: params.keyValue,
      scopes: params.scopes,
      createdAt: new Date().toISOString()
    };

    const newWebhook: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      connectionId: connId,
      url: `https://api.anshumanenterprises1119.in/v1/${params.appId.replace("app-", "app")}/webhook`,
      secret: `whsec_${params.appId}_secret_${Math.floor(1000 + Math.random()*9000)}`,
      retryRulesCount: 3,
      deliveryLogs: []
    };

    const newMetric: MonitoringMetrics = {
      connectionId: connId,
      successRate: 100.0,
      failureRate: 0.0,
      availabilityPct: 100.0,
      avgLatencyMs: 85,
      timeHistory: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), latencyMs: 85, successRate: 100 }
      ]
    };

    set((state) => ({
      connections: [...state.connections, newConnection],
      credentials: [...state.credentials, newCredential],
      webhooks: [...state.webhooks, newWebhook],
      monitoring: [...state.monitoring, newMetric],
      apps: state.apps.map(a => a.id === params.appId ? { ...a, isInstalled: true } : a)
    }));

    get().addConnectionLog({
      connectionId: connId,
      type: "connected",
      message: `Connection successfully established with ${params.connectionName}. Scopes authorized.`
    });
  },

  disconnectApp: (id) => {
    const conn = get().connections.find(c => c.id === id);
    if (!conn) return;

    set((state) => ({
      connections: state.connections.filter(c => c.id !== id),
      credentials: state.credentials.filter(cr => cr.connectionId !== id),
      webhooks: state.webhooks.filter(wh => wh.connectionId !== id),
      monitoring: state.monitoring.filter(m => m.connectionId !== id),
      apps: state.apps.map(a => a.id === conn.appId ? { ...a, isInstalled: false } : a)
    }));

    get().addConnectionLog({
      connectionId: id,
      type: "disconnected",
      message: `Disconnected app connection: ${conn.name}`
    });
  },

  toggleConnectionActive: (id) => {
    set((state) => ({
      connections: state.connections.map(c => {
        if (c.id !== id) return c;
        const newStatus = c.status === "connected" ? "disconnected" : "connected";
        return {
          ...c,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      })
    }));

    const updatedConn = get().connections.find(c => c.id === id);
    if (!updatedConn) return;

    get().addConnectionLog({
      connectionId: id,
      type: updatedConn.status === "connected" ? "connected" : "disconnected",
      message: `Updated status for ${updatedConn.name} to ${updatedConn.status.toUpperCase()}`
    });
  },

  rotateCredential: (connectionId) => {
    const newKey = `rotated_key_token_${Math.floor(1000 + Math.random()*9000)}`;
    set((state) => ({
      credentials: state.credentials.map(cr =>
        cr.connectionId === connectionId
          ? {
              ...cr,
              keyValue: newKey,
              createdAt: new Date().toISOString()
            }
          : cr
      )
    }));

    get().addConnectionLog({
      connectionId,
      type: "retry",
      message: "API Keys / Client Secrets rotated. Updated encryption signatures."
    });
  },

  updateWebhookSettings: (connectionId, url) => {
    set((state) => ({
      webhooks: state.webhooks.map(wh =>
        wh.connectionId === connectionId ? { ...wh, url } : wh
      )
    }));

    get().addConnectionLog({
      connectionId,
      type: "warning",
      message: `Webhook endpoint path updated to ${url}`
    });
  },

  addConnectionLog: (log) => {
    const newLog: ConnectionLog = {
      ...log,
      id: `cl-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    set((state) => ({
      connectionLogs: [newLog, ...state.connectionLogs]
    }));
  }
}));
