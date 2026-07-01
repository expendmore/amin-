import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AppStatus,
  ApiMetricRecord,
  ProviderMetric,
  IncidentRecord,
  AlertRule,
  SystemMetricSample,
  UptimeCheck,
  LogSample
} from "@/types/monitoring";

interface MonitoringState {
  services: AppStatus[];
  apiMetrics: ApiMetricRecord[];
  providerMetrics: ProviderMetric[];
  incidents: IncidentRecord[];
  rules: AlertRule[];
  systemMetrics: SystemMetricSample;
  uptimeChecks: UptimeCheck[];
  logs: LogSample[];

  acknowledgeIncident: (id: string) => void;
  resolveIncident: (id: string) => void;
  toggleRule: (id: string) => void;
  addLogMessage: (level: "info" | "warn" | "error", service: string, message: string) => void;
}

const initialServices: AppStatus[] = [
  { serviceName: "Frontend Hosting Nodes", status: "healthy", lastChecked: new Date().toISOString() },
  { serviceName: "API Gateway Proxy", status: "healthy", lastChecked: new Date().toISOString() },
  { serviceName: "Background Queue Worker", status: "healthy", lastChecked: new Date().toISOString() }
];

const initialApiMetrics: ApiMetricRecord[] = [
  { path: "/v1/whatsapp/messages/send", requestsCount: 4200, avgLatencyMs: 140, successRate: 99.8 },
  { path: "/v1/ai/completions/generate", requestsCount: 1500, avgLatencyMs: 820, successRate: 98.4 }
];

const initialProviders: ProviderMetric[] = [
  { providerName: "OpenAI API Core", healthStatus: "online", avgLatencyMs: 340, costAccumulated: 142.50 },
  { providerName: "Anthropic Claude SDK", healthStatus: "online", avgLatencyMs: 480, costAccumulated: 98.20 },
  { providerName: "Google Gemini Cloud", healthStatus: "online", avgLatencyMs: 310, costAccumulated: 24.80 }
];

const initialIncidents: IncidentRecord[] = [
  { id: "inc-1", title: "API Gateway latency spikes above 500ms", severity: "warning", status: "acknowledged", assignedTo: "Aditya Tiwari", createdTime: new Date(Date.now() - 3600*1000).toISOString() }
];

const initialRules: AlertRule[] = [
  { id: "rule-1", metricKey: "api_error_rate", condition: ">", threshold: 5, isEnabled: true }
];

const initialSystem: SystemMetricSample = {
  cpuPercent: 24,
  ramPercent: 48,
  diskPercent: 62
};

const initialUptime: UptimeCheck[] = [
  { serviceId: "srv-1", serviceName: "Frontend Next.js Node", availabilityPercent: 99.98, avgResponseTimeMs: 42 },
  { serviceId: "srv-2", serviceName: "Backend API Router", availabilityPercent: 99.95, avgResponseTimeMs: 88 }
];

const initialLogs: LogSample[] = [
  { id: "log-1", level: "info", service: "API Gateway", message: "Successfully re-routed WhatsApp webhook connection client session.", timestamp: new Date().toISOString() }
];

export const useMonitoring = create<MonitoringState>()(
  persist(
    (set) => ({
      services: initialServices,
      apiMetrics: initialApiMetrics,
      providerMetrics: initialProviders,
      incidents: initialIncidents,
      rules: initialRules,
      systemMetrics: initialSystem,
      uptimeChecks: initialUptime,
      logs: initialLogs,

      acknowledgeIncident: (id) => {
        set((state) => ({
          incidents: state.incidents.map((i) => (i.id === id ? { ...i, status: "acknowledged" as const } : i))
        }));
      },

      resolveIncident: (id) => {
        set((state) => ({
          incidents: state.incidents.map((i) => (i.id === id ? { ...i, status: "resolved" as const } : i))
        }));
      },

      toggleRule: (id) => {
        set((state) => ({
          rules: state.rules.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
        }));
      },

      addLogMessage: (level, service, message) => {
        set((state) => {
          const newLog: LogSample = {
            id: `log-${Date.now()}`,
            level,
            service,
            message,
            timestamp: new Date().toISOString()
          };
          return {
            logs: [newLog, ...state.logs].slice(0, 100) // keep last 100 logs
          };
        });
      }
    }),
    {
      name: "expendmore-monitoring-store",
      partialize: (state) => ({
        services: state.services,
        incidents: state.incidents,
        rules: state.rules,
        logs: state.logs
      })
    }
  )
);
