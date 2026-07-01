export interface DevopsEnvironment {
  id: string;
  name: string;
  type: "development" | "testing" | "staging" | "production";
  status: "active" | "updating" | "stopped";
  url: string;
  variablesCount: number;
}

export interface DeploymentRecord {
  id: string;
  version: string;
  commitHash: string;
  status: "building" | "deploying" | "success" | "failed" | "rollback";
  createdTime: string;
  durationMs: number;
}

export interface PipelineRecord {
  id: string;
  name: string;
  status: "success" | "failed" | "running" | "cancelled";
  lastRun: string;
  durationMs: number;
}

export interface FeatureFlagRollout {
  id: string;
  key: string;
  description: string;
  percentage: number;
  isEnabled: boolean;
}

export interface BackupSnapshot {
  id: string;
  fileName: string;
  fileSizeMb: number;
  createdTime: string;
  type: "automatic" | "manual";
}

export interface DomainRecord {
  id: string;
  domainName: string;
  dnsStatus: "verified" | "pending" | "failed";
  sslStatus: "active" | "expiring" | "inactive";
  redirectTarget?: string;
}
export interface GlobalDevopsVariable {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
}
