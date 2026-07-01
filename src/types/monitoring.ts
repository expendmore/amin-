export interface AppStatus {
  serviceName: string;
  status: "healthy" | "warning" | "critical";
  lastChecked: string;
}

export interface ApiMetricRecord {
  path: string;
  requestsCount: number;
  avgLatencyMs: number;
  successRate: number;
}

export interface ProviderMetric {
  providerName: string;
  healthStatus: "online" | "degraded" | "offline";
  avgLatencyMs: number;
  costAccumulated: number;
}

export interface IncidentRecord {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  status: "active" | "acknowledged" | "resolved";
  assignedTo: string;
  createdTime: string;
}

export interface AlertRule {
  id: string;
  metricKey: string;
  condition: string;
  threshold: number;
  isEnabled: boolean;
}

export interface SystemMetricSample {
  cpuPercent: number;
  ramPercent: number;
  diskPercent: number;
}

export interface UptimeCheck {
  serviceId: string;
  serviceName: string;
  availabilityPercent: number;
  avgResponseTimeMs: number;
}

export interface LogSample {
  id: string;
  level: "info" | "warn" | "error";
  service: string;
  message: string;
  timestamp: string;
}
