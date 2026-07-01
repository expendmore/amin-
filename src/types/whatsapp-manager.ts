export interface BusinessProfile {
  name: string;
  logoUrl?: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  category: string;
  businessHours: Array<{ day: string; open: string; close: string; isActive: boolean }>;
  timezone: string;
  address: string;
  verificationStatus: "verified" | "pending" | "unverified";
}

export interface MetaNumber {
  id: string;
  phoneNumber: string;
  displayName: string;
  verificationStatus: "verified" | "pending" | "unverified";
  qualityRating: "Green (High)" | "Yellow (Medium)" | "Red (Low)";
  messagingLimit: string; // e.g. "100k/day" or "250/day"
  healthStatus: "healthy" | "warning" | "critical";
  connectedAt: string;
}

export interface ManagerTemplate {
  id: string;
  name: string;
  category: "marketing" | "utility" | "authentication";
  language: string;
  status: "approved" | "pending" | "rejected" | "draft";
  bodyText: string;
  headerType: "text" | "media" | "none";
  headerText?: string;
  footerText?: string;
  buttons: Array<{ type: "url" | "phone" | "quick_reply"; text: string; value?: string }>;
  createdAt: string;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  event: string;
  payload: string;
  responseStatus: number;
  latencyMs: number;
  status: "success" | "failure";
}

export interface WebhookRegistry {
  url: string;
  secret: string;
  subscribedEvents: string[];
  retryRuleCount: number;
  deliveryLogs: WebhookLog[];
}

export interface ApiTokenScope {
  id: string;
  tokenValue: string;
  scopes: string[];
  permissions: string[];
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface DataRetentionPolicy {
  dataType: string;
  retentionPeriodMonths: number;
  autoDeleteEnabled: boolean;
}

export interface ComplianceSettings {
  gdprConsentRequired: boolean;
  optInTemplateId?: string;
  optOutKeywords: string[];
  dataRetentionPolicies: DataRetentionPolicy[];
  legalDocumentsSigned: Array<{ title: string; signedAt: string; version: string }>;
}

export interface ManagerAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export interface SystemHealthStatus {
  apiStatus: "healthy" | "degraded" | "down";
  webhookStatus: "healthy" | "degraded" | "down";
  latencyMs: number;
  activeErrorsCount: number;
  warningsCount: number;
  isMaintenanceMode: boolean;
  lastBackupAt: string;
}
