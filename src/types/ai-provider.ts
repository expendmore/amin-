export type AIProviderId =
  | "openai"
  | "anthropic"
  | "gemini"
  | "groq"
  | "deepseek"
  | "mistral"
  | "openrouter"
  | "azure"
  | "bedrock"
  | "vertex"
  | "ollama"
  | "lmstudio"
  | "custom";

export type AIProviderStatus = "connected" | "disconnected" | "rate_limited" | "maintenance" | "offline";

export interface AIProvider {
  id: AIProviderId;
  name: string;
  status: AIProviderStatus;
  priority: number; // routing weight/priority (1-10)
  version: string;
  apiEndpoint?: string;
  healthScore: number; // 0-100%
  latencyMs: number;
}

export type ModelCategory = "chat" | "reasoning" | "vision" | "embedding" | "image" | "speech" | "translation" | "code";

export interface AIModel {
  id: string;
  name: string;
  providerId: AIProviderId;
  category: ModelCategory;
  contextWindow: number; // e.g. 128000
  inputCostPer1M: number; // USD
  outputCostPer1M: number; // USD
  isEnabled: boolean;
  isReasoning: boolean;
  isVision: boolean;
  latencyMs: number;
  accuracyPlaceholder: number; // e.g. 98.4%
}

export interface APIKey {
  id: string;
  providerId: AIProviderId;
  maskedKey: string;
  description: string;
  createdTime: string;
  expirationTime?: string;
  scopes: string[]; // e.g. ["chat", "image"]
  usageCost: number; // accumulated cost
  status: "active" | "revoked" | "expired";
}

export interface ModelConfig {
  modelId: string;
  temperature: number; // 0-2
  topP: number;
  maxTokens: number;
  frequencyPenalty: number;
  presencePenalty: number;
  reasoningLevel: "low" | "medium" | "high";
  streaming: boolean;
  jsonMode: boolean;
  visionEnabled: boolean;
}

export type RoutingStrategy = "default" | "smart" | "fallback" | "cost" | "latency" | "load_balance";

export interface RoutingConfig {
  strategy: RoutingStrategy;
  defaultModelId: string;
  fallbackChain: string[]; // Array of model IDs
  loadBalanceWeights: Record<string, number>; // modelId -> percentage (0-100)
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[]; // e.g. ["customer_name", "query"]
  isFavorite: boolean;
  version: string;
  lastUpdated: string;
}

export interface CostStats {
  providerId: AIProviderId;
  modelId: string;
  promptTokens: number;
  completionTokens: number;
  totalCost: number; // USD
  timestamp: string;
}

export interface HealthRecord {
  providerId: AIProviderId;
  latencyMs: number;
  availability: number; // percentage (0-100)
  errorRate: number; // percentage (0-100)
  rateLimitHits: number;
  timestamp: string;
}

export interface FalloverLog {
  id: string;
  timestamp: string;
  primaryModelId: string;
  backupModelId: string;
  reason: string; // e.g. "Rate limit hit (429)"
  recovered: boolean;
}

export interface AIAuditLog {
  id: string;
  timestamp: string;
  action: "key_rotation" | "key_revocation" | "provider_status_change" | "model_config_update" | "routing_strategy_change";
  operator: string; // e.g. "Admin (Priya)"
  description: string;
}
