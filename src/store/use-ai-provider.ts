import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AIProvider,
  AIModel,
  APIKey,
  ModelConfig,
  RoutingConfig,
  PromptTemplate,
  CostStats,
  HealthRecord,
  FalloverLog,
  AIAuditLog,
  AIProviderId,
  AIProviderStatus,
  ModelCategory
} from "@/types/ai-provider";

interface AIProviderState {
  providers: AIProvider[];
  models: AIModel[];
  apiKeys: APIKey[];
  configs: Record<string, ModelConfig>; // modelId -> ModelConfig
  routing: RoutingConfig;
  templates: PromptTemplate[];
  costs: CostStats[];
  healthHistory: HealthRecord[];
  failoverLogs: FalloverLog[];
  auditLogs: AIAuditLog[];

  // Action helpers
  toggleProvider: (id: AIProviderId) => void;
  updateProviderPriority: (id: AIProviderId, priority: number) => void;
  reconnectProvider: (id: AIProviderId) => void;
  
  toggleModel: (id: string) => void;
  updateModelConfig: (modelId: string, updates: Partial<ModelConfig>) => void;
  
  rotateKey: (providerId: AIProviderId, newKey: string, description: string) => void;
  revokeKey: (id: string) => void;
  
  updateRoutingConfig: (updates: Partial<RoutingConfig>) => void;
  
  addPromptTemplate: (name: string, description: string, category: string, systemPrompt: string, userPromptTemplate: string, variables: string[]) => void;
  deletePromptTemplate: (id: string) => void;
  toggleFavoriteTemplate: (id: string) => void;

  triggerFailover: (primaryModelId: string, backupModelId: string, reason: string) => void;
  clearLogs: () => void;
  addAuditLog: (action: AIAuditLog["action"], description: string) => void;
}

const initialProviders: AIProvider[] = [
  { id: "openai", name: "OpenAI Platform", status: "connected", priority: 1, version: "v1/chat", healthScore: 98, latencyMs: 140 },
  { id: "anthropic", name: "Anthropic Claude", status: "connected", priority: 2, version: "v1/complete", healthScore: 99, latencyMs: 180 },
  { id: "gemini", name: "Google Gemini", status: "connected", priority: 3, version: "v1beta/gemini", healthScore: 97, latencyMs: 120 },
  { id: "groq", name: "Groq LPU", status: "connected", priority: 4, version: "v1/groq", healthScore: 99, latencyMs: 25 },
  { id: "deepseek", name: "DeepSeek API", status: "connected", priority: 5, version: "v1/deepseek", healthScore: 92, latencyMs: 290 },
  { id: "mistral", name: "Mistral Large", status: "disconnected", priority: 6, version: "v1/mistral", healthScore: 0, latencyMs: 0 },
  { id: "openrouter", name: "OpenRouter Hub", status: "connected", priority: 7, version: "v1/router", healthScore: 96, latencyMs: 210 },
  { id: "azure", name: "Azure OpenAI", status: "disconnected", priority: 8, version: "2024-02-15-preview", healthScore: 0, latencyMs: 0 },
  { id: "bedrock", name: "AWS Bedrock", status: "disconnected", priority: 9, version: "v1/bedrock", healthScore: 0, latencyMs: 0 },
  { id: "vertex", name: "Google Vertex AI", status: "connected", priority: 10, version: "v1/vertex", healthScore: 98, latencyMs: 130 },
  { id: "ollama", name: "Ollama (Local)", status: "connected", priority: 11, version: "localhost:11434", healthScore: 100, latencyMs: 15 },
  { id: "lmstudio", name: "LM Studio", status: "disconnected", priority: 12, version: "localhost:1234", healthScore: 0, latencyMs: 0 }
];

const initialModels: AIModel[] = [
  // OpenAI
  { id: "gpt-4o", name: "GPT-4o (Omni)", providerId: "openai", category: "chat", contextWindow: 128000, inputCostPer1M: 5.00, outputCostPer1M: 15.00, isEnabled: true, isReasoning: false, isVision: true, latencyMs: 160, accuracyPlaceholder: 98.2 },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", providerId: "openai", category: "chat", contextWindow: 128000, inputCostPer1M: 10.00, outputCostPer1M: 30.00, isEnabled: true, isReasoning: false, isVision: true, latencyMs: 220, accuracyPlaceholder: 97.8 },
  { id: "o1-preview", name: "o1 Preview (Reasoning)", providerId: "openai", category: "reasoning", contextWindow: 128000, inputCostPer1M: 15.00, outputCostPer1M: 60.00, isEnabled: true, isReasoning: true, isVision: false, latencyMs: 1400, accuracyPlaceholder: 99.4 },
  { id: "text-embedding-3", name: "Text Embedding 3", providerId: "openai", category: "embedding", contextWindow: 8192, inputCostPer1M: 0.13, outputCostPer1M: 0.00, isEnabled: true, isReasoning: false, isVision: false, latencyMs: 65, accuracyPlaceholder: 92.5 },

  // Anthropic
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", providerId: "anthropic", category: "chat", contextWindow: 200000, inputCostPer1M: 3.00, outputCostPer1M: 15.00, isEnabled: true, isReasoning: false, isVision: true, latencyMs: 190, accuracyPlaceholder: 98.9 },
  { id: "claude-3-opus", name: "Claude 3 Opus", providerId: "anthropic", category: "chat", contextWindow: 200000, inputCostPer1M: 15.00, outputCostPer1M: 75.00, isEnabled: true, isReasoning: false, isVision: false, latencyMs: 380, accuracyPlaceholder: 97.4 },

  // Gemini
  { id: "gemini-1-5-pro", name: "Gemini 1.5 Pro", providerId: "gemini", category: "chat", contextWindow: 1000000, inputCostPer1M: 7.00, outputCostPer1M: 21.00, isEnabled: true, isReasoning: false, isVision: true, latencyMs: 140, accuracyPlaceholder: 97.9 },
  { id: "gemini-1-5-flash", name: "Gemini 1.5 Flash", providerId: "gemini", category: "chat", contextWindow: 1000000, inputCostPer1M: 0.35, outputCostPer1M: 1.05, isEnabled: true, isReasoning: false, isVision: true, latencyMs: 80, accuracyPlaceholder: 91.2 },

  // DeepSeek
  { id: "deepseek-coder", name: "DeepSeek Coder V2", providerId: "deepseek", category: "code", contextWindow: 128000, inputCostPer1M: 0.14, outputCostPer1M: 0.28, isEnabled: true, isReasoning: false, isVision: false, latencyMs: 320, accuracyPlaceholder: 95.8 },
  { id: "deepseek-reasoner", name: "DeepSeek R1", providerId: "deepseek", category: "reasoning", contextWindow: 64000, inputCostPer1M: 0.55, outputCostPer1M: 2.19, isEnabled: true, isReasoning: true, isVision: false, latencyMs: 980, accuracyPlaceholder: 98.5 },

  // Groq
  { id: "llama-3-70b-groq", name: "Llama 3 70b (Groq)", providerId: "groq", category: "chat", contextWindow: 8192, inputCostPer1M: 0.70, outputCostPer1M: 0.90, isEnabled: true, isReasoning: false, isVision: false, latencyMs: 25, accuracyPlaceholder: 90.1 },

  // Ollama
  { id: "llama-3-local", name: "Llama 3 8B (Local)", providerId: "ollama", category: "chat", contextWindow: 8192, inputCostPer1M: 0.00, outputCostPer1M: 0.00, isEnabled: true, isReasoning: false, isVision: false, latencyMs: 18, accuracyPlaceholder: 86.4 }
];

const initialKeys: APIKey[] = [
  { id: "key-1", providerId: "openai", maskedKey: "sk-proj-••••••••••••w1Qz", description: "Production Core Chatbots", createdTime: new Date(Date.now() - 3600*1000*24*60).toISOString(), scopes: ["chat", "vision", "embedding"], usageCost: 184.20, status: "active" },
  { id: "key-2", providerId: "anthropic", maskedKey: "sk-ant-••••••••••••k9x2", description: "Priya Workspace Playground", createdTime: new Date(Date.now() - 3600*1000*24*30).toISOString(), scopes: ["chat", "vision"], usageCost: 92.50, status: "active" },
  { id: "key-3", providerId: "gemini", maskedKey: "gem-AIza••••••••••••p8d3", description: "Gemini Studio API Key", createdTime: new Date(Date.now() - 3600*1000*24*15).toISOString(), scopes: ["chat", "vision", "translation"], usageCost: 12.80, status: "active" },
  { id: "key-4", providerId: "deepseek", maskedKey: "sk-ds-••••••••••••z8f2", description: "DeepSeek Coder API key", createdTime: new Date(Date.now() - 3600*1000*24*5).toISOString(), scopes: ["chat", "code"], usageCost: 4.10, status: "active" }
];

const initialConfigs: Record<string, ModelConfig> = {
  "gpt-4o": { modelId: "gpt-4o", temperature: 0.7, topP: 0.9, maxTokens: 4096, frequencyPenalty: 0.0, presencePenalty: 0.0, reasoningLevel: "medium", streaming: true, jsonMode: false, visionEnabled: true },
  "claude-3-5-sonnet": { modelId: "claude-3-5-sonnet", temperature: 0.5, topP: 0.85, maxTokens: 4096, frequencyPenalty: 0.0, presencePenalty: 0.0, reasoningLevel: "medium", streaming: true, jsonMode: true, visionEnabled: true }
};

const initialTemplates: PromptTemplate[] = [
  {
    id: "tpl-1",
    name: "Customer Support Auto-Responder",
    description: "Generates polite enterprise customer service replies for WhatsApp messages.",
    category: "Support",
    systemPrompt: "You are a professional support representative at Anshuman Enterprises. Be polite, concise, and helpful.",
    userPromptTemplate: "Client Name: {{customer_name}}\nQuery: {{query}}\n\nDraft a conversational response addressing their query.",
    variables: ["customer_name", "query"],
    isFavorite: true,
    version: "v1.2.0",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "tpl-2",
    name: "AI Lead Qualifier",
    description: "Evaluates inbound client leads parameters and calculates interest thresholds.",
    category: "Marketing",
    systemPrompt: "You are a lead qualification agent. Analyze the text and categorize the customer interest as high, medium, or low.",
    userPromptTemplate: "Message Body: {{lead_message}}\nIndustry Segment: {{industry}}\n\nEvaluate the profile suitability.",
    variables: ["lead_message", "industry"],
    isFavorite: false,
    version: "v1.0.0",
    lastUpdated: new Date(Date.now() - 3600*1000*24*10).toISOString()
  }
];

const initialCosts: CostStats[] = [
  { providerId: "openai", modelId: "gpt-4o", promptTokens: 4500000, completionTokens: 1200000, totalCost: 40.50, timestamp: new Date().toISOString() },
  { providerId: "anthropic", modelId: "claude-3-5-sonnet", promptTokens: 3100000, completionTokens: 850000, totalCost: 22.05, timestamp: new Date().toISOString() },
  { providerId: "deepseek", modelId: "deepseek-coder", promptTokens: 12000000, completionTokens: 4500000, totalCost: 2.94, timestamp: new Date(Date.now() - 3600*1000*24).toISOString() }
];

const initialHealth: HealthRecord[] = [
  { providerId: "openai", latencyMs: 140, availability: 99.98, errorRate: 0.02, rateLimitHits: 1, timestamp: new Date().toISOString() },
  { providerId: "anthropic", latencyMs: 180, availability: 99.95, errorRate: 0.05, rateLimitHits: 2, timestamp: new Date().toISOString() },
  { providerId: "gemini", latencyMs: 120, availability: 99.99, errorRate: 0.01, rateLimitHits: 0, timestamp: new Date().toISOString() },
  { providerId: "groq", latencyMs: 25, availability: 100.0, errorRate: 0.00, rateLimitHits: 0, timestamp: new Date().toISOString() }
];

const initialFailovers: FalloverLog[] = [
  { id: "fo-1", timestamp: new Date(Date.now() - 3600*1000*4).toISOString(), primaryModelId: "gpt-4o", backupModelId: "claude-3-5-sonnet", reason: "Rate limit hit (429)", recovered: true },
  { id: "fo-2", timestamp: new Date(Date.now() - 3600*1000*24).toISOString(), primaryModelId: "deepseek-coder", backupModelId: "llama-3-local", reason: "API Timeout (504)", recovered: true }
];

const initialAudit: AIAuditLog[] = [
  { id: "aud-1", timestamp: new Date(Date.now() - 3600*1000*2).toISOString(), action: "key_rotation", operator: "Admin (Priya)", description: "Rotated API key for OpenAI Platform." },
  { id: "aud-2", timestamp: new Date(Date.now() - 3600*1000*10).toISOString(), action: "routing_strategy_change", operator: "System", description: "Switched routing engine to Smart Routing fallback strategy." }
];

export const useAIProvider = create<AIProviderState>()(
  persist(
    (set) => ({
      providers: initialProviders,
      models: initialModels,
      apiKeys: initialKeys,
      configs: initialConfigs,
      routing: {
        strategy: "smart",
        defaultModelId: "gpt-4o",
        fallbackChain: ["claude-3-5-sonnet", "gemini-1-5-pro", "llama-3-local"],
        loadBalanceWeights: { "gpt-4o": 60, "claude-3-5-sonnet": 40 }
      },
      templates: initialTemplates,
      costs: initialCosts,
      healthHistory: initialHealth,
      failoverLogs: initialFailovers,
      auditLogs: initialAudit,

      toggleProvider: (id) => {
        set((state) => {
          const updated = state.providers.map((p) => {
            if (p.id === id) {
              const newStatus: AIProviderStatus = p.status === "connected" ? "disconnected" : "connected";
              return { ...p, status: newStatus, healthScore: newStatus === "connected" ? 98 : 0 };
            }
            return p;
          });

          // Log audit event
          const pName = state.providers.find(p => p.id === id)?.name || id;
          const statusTxt = updated.find(p => p.id === id)?.status === "connected" ? "enabled" : "disabled";
          const newAudit: AIAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "provider_status_change",
            operator: "Admin (Priya)",
            description: `Manually ${statusTxt} provider context: ${pName}`
          };

          return {
            providers: updated,
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      updateProviderPriority: (id, priority) => {
        set((state) => ({
          providers: state.providers.map((p) => (p.id === id ? { ...p, priority } : p))
        }));
      },

      reconnectProvider: (id) => {
        set((state) => {
          const updated = state.providers.map((p) => {
            if (p.id === id) {
              return { ...p, status: "connected" as const, healthScore: 99, latencyMs: p.id === "deepseek" ? 220 : 130 };
            }
            return p;
          });

          const pName = state.providers.find(p => p.id === id)?.name || id;
          const newAudit: AIAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "provider_status_change",
            operator: "Admin (Priya)",
            description: `Triggered manual test connection handshake for provider: ${pName}`
          };

          return {
            providers: updated,
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      toggleModel: (id) => {
        set((state) => ({
          models: state.models.map((m) => (m.id === id ? { ...m, isEnabled: !m.isEnabled } : m))
        }));
      },

      updateModelConfig: (modelId, updates) => {
        set((state) => {
          const prev = state.configs[modelId] || {
            modelId,
            temperature: 0.7,
            topP: 0.9,
            maxTokens: 4096,
            frequencyPenalty: 0.0,
            presencePenalty: 0.0,
            reasoningLevel: "medium",
            streaming: true,
            jsonMode: false,
            visionEnabled: false
          };

          const newAudit: AIAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "model_config_update",
            operator: "Admin (Priya)",
            description: `Updated model configuration metrics parameters for: ${modelId}`
          };

          return {
            configs: {
              ...state.configs,
              [modelId]: { ...prev, ...updates }
            },
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      rotateKey: (providerId, newKey, description) => {
        set((state) => {
          const id = `key-${Date.now()}`;
          const masked = `${newKey.substring(0, 7)}••••••••••••${newKey.substring(newKey.length - 4)}`;
          const newAPIKey: APIKey = {
            id,
            providerId,
            maskedKey: masked,
            description,
            createdTime: new Date().toISOString(),
            scopes: ["chat", "vision"],
            usageCost: 0.00,
            status: "active"
          };

          // Revoke any previous active keys for this provider
          const updatedKeys = state.apiKeys.map((k) =>
            k.providerId === providerId && k.status === "active" ? { ...k, status: "expired" as const } : k
          );

          const newAudit: AIAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "key_rotation",
            operator: "Admin (Priya)",
            description: `Rotated API credentials key secret for provider ID: ${providerId}`
          };

          return {
            apiKeys: [newAPIKey, ...updatedKeys],
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      revokeKey: (id) => {
        set((state) => {
          const target = state.apiKeys.find(k => k.id === id);
          const newAudit: AIAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "key_revocation",
            operator: "Admin (Priya)",
            description: `Revoked API Key footprint identifier: ${target?.description || id}`
          };

          return {
            apiKeys: state.apiKeys.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k)),
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      updateRoutingConfig: (updates) => {
        set((state) => {
          const newAudit: AIAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "routing_strategy_change",
            operator: "Admin (Priya)",
            description: `Modified core routing engine parameters strategy to: ${updates.strategy || state.routing.strategy}`
          };

          return {
            routing: { ...state.routing, ...updates },
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      addPromptTemplate: (name, description, category, systemPrompt, userPromptTemplate, variables) => {
        set((state) => {
          const id = `tpl-${Date.now()}`;
          const newTpl: PromptTemplate = {
            id,
            name,
            description,
            category,
            systemPrompt,
            userPromptTemplate,
            variables,
            isFavorite: false,
            version: "v1.0.0",
            lastUpdated: new Date().toISOString()
          };

          return {
            templates: [newTpl, ...state.templates]
          };
        });
      },

      deletePromptTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id)
        }));
      },

      toggleFavoriteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
        }));
      },

      triggerFailover: (primaryModelId, backupModelId, reason) => {
        set((state) => {
          const newLog: FalloverLog = {
            id: `fo-${Date.now()}`,
            timestamp: new Date().toISOString(),
            primaryModelId,
            backupModelId,
            reason,
            recovered: false
          };

          return {
            failoverLogs: [newLog, ...state.failoverLogs]
          };
        });
      },

      clearLogs: () => {
        set(() => ({
          failoverLogs: [],
          auditLogs: []
        }));
      },

      addAuditLog: (action, description) => {
        set((state) => ({
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action,
              operator: "Admin (Priya)",
              description
            },
            ...state.auditLogs
          ]
        }));
      }
    }),
    {
      name: "expendmore-ai-provider-store",
      partialize: (state) => ({
        providers: state.providers,
        models: state.models,
        apiKeys: state.apiKeys,
        configs: state.configs,
        routing: state.routing,
        templates: state.templates
      })
    }
  )
);
