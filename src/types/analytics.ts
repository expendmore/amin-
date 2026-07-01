export interface ExecutiveMetrics {
  totalUsers: number;
  activeUsers: number;
  workspaces: number;
  revenue: number;
  mrr: number;
  arr: number;
  creditsUsed: number;
  apiCalls: number;
  storageGb: number;
  growthPct: number;
  conversionPct: number;
  retentionPct: number;
}

export interface WhatsAppMetrics {
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
  blocked: number;
  optOuts: number;
  avgReplyTimeSec: number;
  avgDurationMin: number;
}

export interface ModelUsage {
  modelName: string;
  provider: string;
  requestsCount: number;
  totalTokens: number;
  costEstimate: number;
  accuracyPct: number;
}

export interface AiMetrics {
  totalRequests: number;
  avgResponseTimeSec: number;
  avgTokensPerRequest: number;
  modelSplits: ModelUsage[];
  topPrompts: Array<{ promptText: string; count: number; successRate: number }>;
}

export interface WorkflowMetrics {
  totalRuns: number;
  successRate: number;
  failedRuns: number;
  avgDurationSec: number;
  avgQueueTimeSec: number;
  heatmapData: number[][]; // 7 days of week, 24 hours of day
  topWorkflows: Array<{ name: string; runsCount: number; successRate: number }>;
}

export interface CrmMetrics {
  newContacts: number;
  returningContacts: number;
  leadSources: Array<{ source: string; count: number; value: number }>;
  customerGrowthHistory: Array<{ date: string; count: number }>;
  topTags: Array<{ name: string; count: number }>;
  topLabels: Array<{ name: string; count: number }>;
}

export interface TeamMetrics {
  leaderboard: Array<{
    agentName: string;
    resolvedCount: number;
    pendingCount: number;
    avgResponseTimeSec: number;
    satisfactionScore: number; // 0 to 5
  }>;
}

export interface CampaignMetrics {
  campaignName: string;
  deliveryRate: number;
  readRate: number;
  replyRate: number;
  ctr: number;
  conversions: number;
  revenue: number;
}

export interface CustomWidget {
  id: string;
  title: string;
  type: "line" | "bar" | "pie" | "donut" | "funnel" | "gauge";
  metric: string;
  size: "sm" | "md" | "lg";
}

export interface SavedReport {
  id: string;
  title: string;
  metrics: string[];
  filters: Record<string, any>;
  dateRange: string;
  createdAt: string;
}

export interface ReportSchedule {
  id: string;
  reportId: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  emails: string[];
  status: "active" | "inactive";
  lastSent: string | null;
}
