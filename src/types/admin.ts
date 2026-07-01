export interface OrgRecord {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  status: "active" | "suspended";
  billingStatus: "paid" | "unpaid";
  workspacesCount: number;
  createdTime: string;
}

export interface WorkspaceRecord {
  id: string;
  orgId: string;
  name: string;
  limitsWorkflows: number;
  limitsStorageGB: number;
  limitsUsers: number;
  status: "active" | "archived";
  createdTime: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "verified" | "pending";
  activeSessionsCount: number;
  deviceTypes: string[];
}

export interface RoleRecord {
  name: string;
  description: string;
  permissions: Record<string, boolean>;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  rolloutPercent: number;
}

export interface QueueJob {
  id: string;
  name: string;
  workerType: string;
  status: "queued" | "running" | "failed" | "completed";
  attempts: number;
  timestamp: string;
}

export interface SystemMetrics {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  dbHealth: "optimal" | "warning" | "error";
  storageHealth: "optimal" | "warning" | "full";
}

export interface ExceptionLog {
  id: string;
  name: string;
  stacktrace: string;
  affectedUserEmail: string;
  status: "unresolved" | "resolved";
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  type: "maintenance" | "announcement" | "update";
  text: string;
  author: string;
  date: string;
}

export interface BackupSchedule {
  id: string;
  databaseSize: string;
  retentionDays: number;
  lastBackupTime: string;
  cronPattern: string;
}

export interface TicketItem {
  id: string;
  userEmail: string;
  subject: string;
  priority: "high" | "medium" | "low";
  status: "open" | "assigned" | "closed";
  updatedTime: string;
}

export interface AdminAuditLog {
  id: string;
  operator: string;
  action: string;
  description: string;
  timestamp: string;
}
