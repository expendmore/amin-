import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  TokenRecord,
  AppRecord,
  WebhookSubscription,
  McpServer,
  McpClient,
  ApiRequestLog,
  LimitMetric,
  ChangelogItem
} from "@/types/developer";

interface DeveloperState {
  tokens: TokenRecord[];
  apps: AppRecord[];
  webhooks: WebhookSubscription[];
  mcpServers: McpServer[];
  mcpClients: McpClient[];
  logs: ApiRequestLog[];
  limits: LimitMetric[];
  changelogs: ChangelogItem[];
  apiVersion: string;

  addToken: (name: string, scopes: string[], expiryDays: number) => void;
  rotateToken: (id: string) => void;
  revokeToken: (id: string) => void;
  addApp: (name: string, redirectUris: string[], scopes: string[]) => void;
  deleteApp: (id: string) => void;
  addWebhook: (url: string, events: string[]) => void;
  deleteWebhook: (id: string) => void;
  toggleMcpServer: (id: string) => void;
  setApiVersion: (ver: string) => void;
  resetSandboxEnvironment: () => void;
}

const initialTokens: TokenRecord[] = [
  { id: "tok-1", name: "Production CLI Hook", tokenValue: "sk_live_51N29Ka...", scopes: ["all_access"], expiresAt: new Date(Date.now() + 3600*1000*24*90).toISOString(), usageCount: 420, lastUsedAt: new Date().toISOString(), status: "active" }
];

const initialApps: AppRecord[] = [
  { id: "app-1", name: "ExpendMore Slack Sync Bot", clientId: "cli_89214bka0291", clientSecret: "sec_9028bka88172b012", redirectUris: ["https://api.slack.com/oauth/callback"], scopes: ["mail.read", "chat.write"], createdTime: new Date().toISOString() }
];

const initialWebhooks: WebhookSubscription[] = [
  { id: "wh-1", url: "https://n8n.anshumanenterprises.online/webhook/expendmore-alert", secret: "whsec_89b21ba99230", events: ["whatsapp.message_received", "billing.limits_reached"], status: "active", createdTime: new Date().toISOString() }
];

const initialMcpServers: McpServer[] = [
  { id: "mcp-srv-1", name: "Google Drive Files MCP", description: "Read files from Google Drive using Model Context Protocol specs", url: "http://localhost:3001/mcp", status: "online", healthScore: 100, permissions: ["files_read"], category: "files" },
  { id: "mcp-srv-2", name: "Database Schema Explorer MCP", description: "Expose local database tables mapping profiles to AI agents context", url: "http://localhost:3002/mcp", status: "online", healthScore: 98, permissions: ["schema_read", "query_execute"], category: "database" }
];

const initialMcpClients: McpClient[] = [
  { id: "mcp-cli-1", name: "Antigravity IDE Agent", status: "connected", permissions: ["files_read", "schema_read"], lastConnected: new Date().toISOString() }
];

const initialLogs: ApiRequestLog[] = [
  { id: "log-1", method: "POST", path: "/v1/whatsapp/messages/send", statusCode: 200, latencyMs: 142, ipAddress: "104.24.12.90", timestamp: new Date().toISOString() },
  { id: "log-2", method: "GET", path: "/v1/billing/wallet/balance", statusCode: 200, latencyMs: 82, ipAddress: "104.24.12.90", timestamp: new Date().toISOString() }
];

const initialLimits: LimitMetric[] = [
  { key: "daily_requests", name: "Daily API Calls Requests", quotaUsed: 890, quotaMax: 10000 },
  { key: "webhooks_dispatches", name: "Webhooks Sent Count", quotaUsed: 420, quotaMax: 5000 }
];

const initialChangelog: ChangelogItem[] = [
  { version: "1.2.0", releaseDate: "June 27, 2026", title: "Model Context Protocol Integration support", notes: "Added MCP Client manager and Server Registry nodes for autonomous agents.", type: "minor" }
];

export const useDeveloper = create<DeveloperState>()(
  persist(
    (set) => ({
      tokens: initialTokens,
      apps: initialApps,
      webhooks: initialWebhooks,
      mcpServers: initialMcpServers,
      mcpClients: initialMcpClients,
      logs: initialLogs,
      limits: initialLimits,
      changelogs: initialChangelog,
      apiVersion: "2026-06-01",

      addToken: (name, scopes, expiryDays) => {
        set((state) => {
          const rawToken = `sk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
          const newToken: TokenRecord = {
            id: `tok-${Date.now()}`,
            name,
            tokenValue: rawToken.slice(0, 12) + "...",
            scopes,
            expiresAt: new Date(Date.now() + 3600*1000*24*expiryDays).toISOString(),
            usageCount: 0,
            status: "active"
          };
          return {
            tokens: [newToken, ...state.tokens]
          };
        });
      },

      rotateToken: (id) => {
        set((state) => ({
          tokens: state.tokens.map((t) => {
            if (t.id === id) {
              const rawToken = `sk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
              return {
                ...t,
                tokenValue: rawToken.slice(0, 12) + "...",
                expiresAt: new Date(Date.now() + 3600*1000*24*90).toISOString(),
                lastUsedAt: new Date().toISOString()
              };
            }
            return t;
          })
        }));
      },

      revokeToken: (id) => {
        set((state) => ({
          tokens: state.tokens.map((t) => (t.id === id ? { ...t, status: "revoked" as const } : t))
        }));
      },

      addApp: (name, redirectUris, scopes) => {
        set((state) => {
          const newApp: AppRecord = {
            id: `app-${Date.now()}`,
            name,
            clientId: `cli_${Math.random().toString(36).substring(2, 14)}`,
            clientSecret: `sec_${Math.random().toString(36).substring(2, 18)}`,
            redirectUris,
            scopes,
            createdTime: new Date().toISOString()
          };
          return {
            apps: [newApp, ...state.apps]
          };
        });
      },

      deleteApp: (id) => {
        set((state) => ({
          apps: state.apps.filter((a) => a.id !== id)
        }));
      },

      addWebhook: (url, events) => {
        set((state) => {
          const newWh: WebhookSubscription = {
            id: `wh-${Date.now()}`,
            url,
            secret: `whsec_${Math.random().toString(36).substring(2, 14)}`,
            events,
            status: "active",
            createdTime: new Date().toISOString()
          };
          return {
            webhooks: [newWh, ...state.webhooks]
          };
        });
      },

      deleteWebhook: (id) => {
        set((state) => ({
          webhooks: state.webhooks.filter((w) => w.id !== id)
        }));
      },

      toggleMcpServer: (id) => {
        set((state) => ({
          mcpServers: state.mcpServers.map((s) => (s.id === id ? { ...s, status: s.status === "online" ? "offline" : "online" } : s))
        }));
      },

      setApiVersion: (ver) => {
        set(() => ({
          apiVersion: ver
        }));
      },

      resetSandboxEnvironment: () => {
        set(() => ({
          tokens: initialTokens,
          apps: initialAppMock(),
          webhooks: initialWebhooks,
          mcpServers: initialMcpServers
        }));
      }
    }),
    {
      name: "expendmore-developer-store",
      partialize: (state) => ({
        tokens: state.tokens,
        apps: state.apps,
        webhooks: state.webhooks,
        mcpServers: state.mcpServers,
        apiVersion: state.apiVersion
      })
    }
  )
);

const initialAppMock = (): AppRecord[] => [
  { id: "app-1", name: "ExpendMore Slack Sync Bot", clientId: "cli_89214bka0291", clientSecret: "sec_9028bka88172b012", redirectUris: ["https://api.slack.com/oauth/callback"], scopes: ["mail.read", "chat.write"], createdTime: new Date().toISOString() }
];
