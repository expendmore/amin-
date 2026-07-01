export interface TokenRecord {
  id: string;
  name: string;
  tokenValue: string;
  scopes: string[];
  expiresAt: string;
  usageCount: number;
  lastUsedAt?: string;
  status: "active" | "revoked";
}

export interface AppRecord {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  scopes: string[];
  createdTime: string;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  secret: string;
  events: string[];
  status: "active" | "disabled" | "failing";
  createdTime: string;
}

export interface McpServer {
  id: string;
  name: string;
  description: string;
  url: string;
  status: "online" | "offline" | "error";
  healthScore: number;
  permissions: string[];
  category: string;
}

export interface McpClient {
  id: string;
  name: string;
  status: "connected" | "disconnected";
  permissions: string[];
  lastConnected: string;
}

export interface ApiRequestLog {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  statusCode: number;
  latencyMs: number;
  ipAddress: string;
  timestamp: string;
}

export interface LimitMetric {
  key: string;
  name: string;
  quotaUsed: number;
  quotaMax: number;
}

export interface ChangelogItem {
  version: string;
  releaseDate: string;
  title: string;
  notes: string;
  type: "major" | "minor" | "patch";
}
