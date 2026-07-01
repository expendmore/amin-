export type ModelCategory =
  | "chat"
  | "vision"
  | "image"
  | "embedding"
  | "audio"
  | "reasoning";

export interface ModelConfig {
  id: string;
  name: string;
  category: ModelCategory;
  maxContext: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsImages: boolean;
  supportsTools: boolean;
  supportsJsonMode: boolean;
  supportsFunctionCalling: boolean;
  inputPricePer1k: number; // in USD
  outputPricePer1k: number; // in USD
}

export interface ProviderConfig {
  name: string;
  priority: number;
  fallbackProvider?: string | null;
  models: Record<string, ModelConfig>;
}

export interface GatewayMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}

export interface GatewayChatRequest {
  messages: GatewayMessage[];
  modelName: string;
  providerName?: string;
  conversationId?: string | null;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface GatewayChatResponse {
  id: string;
  provider: string;
  model: string;
  choices: Array<{
    role: "assistant";
    message: string;
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
  success: boolean;
  error?: {
    code: string;
    message: string;
  } | null;
}
