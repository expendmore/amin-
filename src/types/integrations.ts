export interface IntegrationApp {
  id: string;
  name: string;
  logoUrl: string;
  developer: string;
  version: string;
  description: string;
  category: "AI" | "CRM" | "Communication" | "Marketing" | "Cloud Storage" | "Databases" | "Payments" | "Developer" | "Analytics" | "Productivity" | "Social Media";
  isOfficial: boolean;
  isCommunity: boolean;
  isInstalled: boolean;
  features: string[];
  setupGuideUrl?: string;
  requirements: string[];
  documentation?: string;
}

export interface AppConnection {
  id: string;
  appId: string;
  name: string;
  status: "connected" | "disconnected" | "connecting" | "permission_error" | "maintenance";
  healthScore: number; // 0 to 100
  latencyMs: number;
  credentialsId: string;
  connectedAt: string;
  updatedAt: string;
}

export interface AppCredential {
  id: string;
  connectionId: string;
  authType: "oauth" | "api_key" | "token" | "webhook" | "basic_auth" | "bearer_token" | "custom";
  keyValue: string; // obfuscated key
  scopes: string[];
  expirationDate?: string;
  createdAt: string;
}

export interface WebhookDeliveryLog {
  id: string;
  timestamp: string;
  direction: "incoming" | "outgoing";
  event: string;
  payload: string;
  responseCode: number;
  status: "success" | "failure" | "pending";
}

export interface WebhookEndpoint {
  id: string;
  connectionId: string;
  url: string;
  secret: string;
  retryRulesCount: number;
  deliveryLogs: WebhookDeliveryLog[];
}

export interface ConnectionLog {
  id: string;
  connectionId: string;
  timestamp: string;
  type: "connected" | "disconnected" | "failed" | "warning" | "retry";
  message: string;
  details?: string;
}

export interface MonitoringMetrics {
  connectionId: string;
  successRate: number; // percentage
  failureRate: number; // percentage
  availabilityPct: number; // percentage
  avgLatencyMs: number;
  timeHistory: Array<{ time: string; latencyMs: number; successRate: number }>;
}
