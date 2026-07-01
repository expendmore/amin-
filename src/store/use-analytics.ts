import { create } from "zustand";
import {
  ExecutiveMetrics,
  WhatsAppMetrics,
  AiMetrics,
  WorkflowMetrics,
  CrmMetrics,
  TeamMetrics,
  CampaignMetrics,
  CustomWidget,
  SavedReport,
  ReportSchedule
} from "@/types/analytics";

// Initialize rich executive analytics KPIs
const INITIAL_EXECUTIVE: ExecutiveMetrics = {
  totalUsers: 14580,
  activeUsers: 8420,
  workspaces: 125,
  revenue: 84320.0,
  mrr: 21500.0,
  arr: 258000.0,
  creditsUsed: 145000,
  apiCalls: 489000,
  storageGb: 412.5,
  growthPct: 15.4,
  conversionPct: 4.8,
  retentionPct: 92.5
};

// Initialize WhatsApp communications KPIs
const INITIAL_WHATSAPP: WhatsAppMetrics = {
  sent: 412500,
  delivered: 410400, // 99.5%
  read: 328000, // 79.9%
  replied: 164000, // 50%
  failed: 2100,
  blocked: 840,
  optOuts: 412,
  avgReplyTimeSec: 24.5,
  avgDurationMin: 8.4
};

// Mock LLM usage stats
const INITIAL_AI: AiMetrics = {
  totalRequests: 89400,
  avgResponseTimeSec: 0.84,
  avgTokensPerRequest: 412,
  modelSplits: [
    {
      modelName: "gpt-4o-mini",
      provider: "OpenAI",
      requestsCount: 52000,
      totalTokens: 21424000,
      costEstimate: 14.5,
      accuracyPct: 96.2
    },
    {
      modelName: "claude-3-5-sonnet",
      provider: "Anthropic",
      requestsCount: 22400,
      totalTokens: 14220000,
      costEstimate: 62.4,
      accuracyPct: 97.5
    },
    {
      modelName: "gemini-1.5-flash",
      provider: "Google",
      requestsCount: 15000,
      totalTokens: 8120000,
      costEstimate: 3.5,
      accuracyPct: 94.8
    }
  ],
  topPrompts: [
    { promptText: "Draft welcome greeting for Shopify registration", count: 2420, successRate: 98.5 },
    { promptText: "Apologize for webhook outage and schedule follow-up", count: 1840, successRate: 97.2 },
    { promptText: "Summarize Growth and Scale billing parameters", count: 1540, successRate: 99.1 }
  ]
};

// Initialize workflow runs volume heatmaps (7 days x 24 hours)
const generateHeatmap = () => {
  const grid: number[][] = [];
  for (let day = 0; day < 7; day++) {
    const hours: number[] = [];
    for (let hr = 0; hr < 24; hr++) {
      // Simulate peak hours: higher volume mid-day (10 AM to 6 PM)
      let volume = Math.floor(Math.random() * 25);
      if (hr >= 9 && hr <= 17) volume += 40 + Math.floor(Math.random() * 30);
      hours.push(volume);
    }
    grid.push(hours);
  }
  return grid;
};

const INITIAL_WORKFLOW: WorkflowMetrics = {
  totalRuns: 24590,
  successRate: 96.8,
  failedRuns: 780,
  avgDurationSec: 1.25,
  avgQueueTimeSec: 0.45,
  heatmapData: generateHeatmap(),
  topWorkflows: [
    { name: "Abandoned Cart Push Alert", runsCount: 12400, successRate: 97.8 },
    { name: "Stripe Billing Failed Retrier", runsCount: 6200, successRate: 95.4 },
    { name: "Lead Segment Tag Update", runsCount: 5990, successRate: 99.2 }
  ]
};

// Initialize CRM and contacts telemetry details
const INITIAL_CRM: CrmMetrics = {
  newContacts: 3410,
  returningContacts: 1120,
  leadSources: [
    { source: "Shopify Checkout", count: 1840, value: 55200 },
    { source: "Facebook Embedded Signup", count: 850, value: 25500 },
    { source: "Manual Admin Upload", count: 420, value: 12600 },
    { source: "AI Assistant Opt-In", count: 300, value: 9000 }
  ],
  customerGrowthHistory: [
    { date: "Jun 20", count: 12100 },
    { date: "Jun 21", count: 12450 },
    { date: "Jun 22", count: 12900 },
    { date: "Jun 23", count: 13240 },
    { date: "Jun 24", count: 13800 },
    { date: "Jun 25", count: 14120 },
    { date: "Jun 26", count: 14580 }
  ],
  topTags: [
    { name: "High Value LTV", count: 840 },
    { name: "VIP Customer", count: 412 },
    { name: "Stripe Active", count: 320 }
  ],
  topLabels: [
    { name: "Shopify Sync", count: 1240 },
    { name: "API Lead", count: 520 },
    { name: "Support Ticket", count: 240 }
  ]
};

// Team and Campaign analytics
const INITIAL_TEAM: TeamMetrics = {
  leaderboard: [
    { agentName: "Sarah Jenkins", resolvedCount: 312, pendingCount: 12, avgResponseTimeSec: 18.4, satisfactionScore: 4.8 },
    { agentName: "David Lee", resolvedCount: 240, pendingCount: 18, avgResponseTimeSec: 22.1, satisfactionScore: 4.6 },
    { agentName: "Amit Sharma", resolvedCount: 172, pendingCount: 8, avgResponseTimeSec: 21.0, satisfactionScore: 4.5 },
    { agentName: "Maria Gomez", resolvedCount: 104, pendingCount: 22, avgResponseTimeSec: 32.5, satisfactionScore: 3.9 }
  ]
};

const INITIAL_CAMPAIGNS: CampaignMetrics[] = [
  { campaignName: "Clearance Promo 30%", deliveryRate: 99.8, readRate: 84.2, replyRate: 22.5, ctr: 12.4, conversions: 1240, revenue: 37200.0 },
  { campaignName: "Welcome Promo Pack", deliveryRate: 99.5, readRate: 79.9, replyRate: 50.0, ctr: 18.2, conversions: 420, revenue: 12600.0 },
  { campaignName: "Holiday Blast Special", deliveryRate: 98.4, readRate: 72.1, replyRate: 18.0, ctr: 9.8, conversions: 310, revenue: 9300.0 }
];

const INITIAL_CUSTOM_WIDGETS: CustomWidget[] = [
  { id: "wid-1", title: "MRR Growth Curve", type: "line", metric: "mrr", size: "md" },
  { id: "wid-2", title: "WhatsApp Read Rate Breakdown", type: "donut", metric: "read_rate", size: "sm" },
  { id: "wid-3", title: "Workflow Success Gauge", type: "gauge", metric: "workflow_success", size: "sm" }
];

const INITIAL_REPORTS: SavedReport[] = [
  { id: "rep-1", title: "Weekly Executive Revenue Summary", metrics: ["mrr", "revenue"], filters: {}, dateRange: "7d", createdAt: "2026-06-20T10:00:00Z" },
  { id: "rep-2", title: "WhatsApp Campaign Conversion Funnel", metrics: ["sent", "read", "replied"], filters: { campaign: "camp-1" }, dateRange: "30d", createdAt: "2026-06-22T14:30:00Z" }
];

interface AnalyticsState {
  executiveMetrics: ExecutiveMetrics;
  whatsAppMetrics: WhatsAppMetrics;
  aiMetrics: AiMetrics;
  workflowMetrics: WorkflowMetrics;
  crmMetrics: CrmMetrics;
  teamMetrics: TeamMetrics;
  campaignMetrics: CampaignMetrics[];
  customDashboardWidgets: CustomWidget[];
  savedReports: SavedReport[];
  reportSchedules: ReportSchedule[];
  isLiveAutoRefreshActive: boolean;

  // Custom Dashboards operations
  addCustomWidget: (widget: Omit<CustomWidget, "id">) => void;
  removeCustomWidget: (id: string) => void;

  // Report Builder operations
  saveReport: (report: Omit<SavedReport, "id" | "createdAt">) => void;
  scheduleReport: (schedule: Omit<ReportSchedule, "id" | "lastSent">) => void;
  toggleLiveRefresh: (val: boolean) => void;

  // Real-time telemetry simulators
  incrementRealTimeMetrics: () => void;
}

export const useAnalytics = create<AnalyticsState>((set) => ({
  executiveMetrics: INITIAL_EXECUTIVE,
  whatsAppMetrics: INITIAL_WHATSAPP,
  aiMetrics: INITIAL_AI,
  workflowMetrics: INITIAL_WORKFLOW,
  crmMetrics: INITIAL_CRM,
  teamMetrics: INITIAL_TEAM,
  campaignMetrics: INITIAL_CAMPAIGNS,
  customDashboardWidgets: INITIAL_CUSTOM_WIDGETS,
  savedReports: INITIAL_REPORTS,
  reportSchedules: [],
  isLiveAutoRefreshActive: false,

  addCustomWidget: (widget) => {
    const newWidget: CustomWidget = {
      ...widget,
      id: `wid-${Date.now()}`
    };
    set((state) => ({
      customDashboardWidgets: [...state.customDashboardWidgets, newWidget]
    }));
  },

  removeCustomWidget: (id) => {
    set((state) => ({
      customDashboardWidgets: state.customDashboardWidgets.filter((w) => w.id !== id)
    }));
  },

  saveReport: (report) => {
    const newReport: SavedReport = {
      ...report,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      savedReports: [...state.savedReports, newReport]
    }));
  },

  scheduleReport: (schedule) => {
    const newSchedule: ReportSchedule = {
      ...schedule,
      id: `sch-${Date.now()}`,
      lastSent: null
    };
    set((state) => ({
      reportSchedules: [...state.reportSchedules, newSchedule]
    }));
  },

  toggleLiveRefresh: (val) => {
    set({ isLiveAutoRefreshActive: val });
  },

  incrementRealTimeMetrics: () => {
    set((state) => {
      // Small randomized increments to simulate incoming traffic
      const userInc = Math.random() > 0.6 ? 1 : 0;
      const apiInc = 3 + Math.floor(Math.random() * 5);
      const revInc = Math.random() > 0.8 ? 29.0 : 0;
      
      const newExec: ExecutiveMetrics = {
        ...state.executiveMetrics,
        totalUsers: state.executiveMetrics.totalUsers + userInc,
        activeUsers: state.executiveMetrics.activeUsers + (userInc ? 1 : 0),
        apiCalls: state.executiveMetrics.apiCalls + apiInc,
        revenue: state.executiveMetrics.revenue + revInc,
        mrr: state.executiveMetrics.mrr + (revInc ? revInc * 0.1 : 0)
      };

      const newWa: WhatsAppMetrics = {
        ...state.whatsAppMetrics,
        sent: state.whatsAppMetrics.sent + apiInc,
        delivered: state.whatsAppMetrics.delivered + apiInc,
        read: state.whatsAppMetrics.read + Math.floor(apiInc * 0.8),
        replied: state.whatsAppMetrics.replied + Math.floor(apiInc * 0.4)
      };

      const newWf: WorkflowMetrics = {
        ...state.workflowMetrics,
        totalRuns: state.workflowMetrics.totalRuns + Math.floor(apiInc * 0.5)
      };

      const newCrm: CrmMetrics = {
        ...state.crmMetrics,
        // Update the last history count date
        customerGrowthHistory: state.crmMetrics.customerGrowthHistory.map((item, idx) => {
          if (idx === state.crmMetrics.customerGrowthHistory.length - 1) {
            return { ...item, count: item.count + userInc };
          }
          return item;
        })
      };

      return {
        executiveMetrics: newExec,
        whatsAppMetrics: newWa,
        workflowMetrics: newWf,
        crmMetrics: newCrm
      };
    });
  }
}));
