import { ProviderConfig, ModelConfig } from "../types";

export const providerRegistry: Record<string, ProviderConfig> = {
  openai: {
    name: "openai",
    priority: 1,
    fallbackProvider: "anthropic",
    models: {
      "gpt-4o": {
        id: "gpt-4o",
        name: "GPT-4o",
        category: "chat",
        maxContext: 128000,
        supportsStreaming: true,
        supportsVision: true,
        supportsImages: true,
        supportsTools: true,
        supportsJsonMode: true,
        supportsFunctionCalling: true,
        inputPricePer1k: 0.005,
        outputPricePer1k: 0.015,
      },
      "gpt-4o-mini": {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        category: "chat",
        maxContext: 128000,
        supportsStreaming: true,
        supportsVision: true,
        supportsImages: true,
        supportsTools: true,
        supportsJsonMode: true,
        supportsFunctionCalling: true,
        inputPricePer1k: 0.00015,
        outputPricePer1k: 0.0006,
      },
    },
  },
  anthropic: {
    name: "anthropic",
    priority: 2,
    fallbackProvider: "openai",
    models: {
      "claude-3-5-sonnet": {
        id: "claude-3-5-sonnet",
        name: "Claude 3.5 Sonnet",
        category: "chat",
        maxContext: 200000,
        supportsStreaming: true,
        supportsVision: true,
        supportsImages: false,
        supportsTools: true,
        supportsJsonMode: true,
        supportsFunctionCalling: true,
        inputPricePer1k: 0.003,
        outputPricePer1k: 0.015,
      },
      "claude-3-haiku": {
        id: "claude-3-haiku",
        name: "Claude 3 Haiku",
        category: "chat",
        maxContext: 200000,
        supportsStreaming: true,
        supportsVision: true,
        supportsImages: false,
        supportsTools: true,
        supportsJsonMode: false,
        supportsFunctionCalling: true,
        inputPricePer1k: 0.00025,
        outputPricePer1k: 0.00125,
      },
    },
  },
  google: {
    name: "google",
    priority: 3,
    fallbackProvider: "openai",
    models: {
      "gemini-1.5-pro": {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        category: "chat",
        maxContext: 1000000,
        supportsStreaming: true,
        supportsVision: true,
        supportsImages: false,
        supportsTools: true,
        supportsJsonMode: true,
        supportsFunctionCalling: true,
        inputPricePer1k: 0.007,
        outputPricePer1k: 0.021,
      },
      "gemini-1.5-flash": {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        category: "chat",
        maxContext: 1000000,
        supportsStreaming: true,
        supportsVision: true,
        supportsImages: false,
        supportsTools: true,
        supportsJsonMode: true,
        supportsFunctionCalling: true,
        inputPricePer1k: 0.00035,
        outputPricePer1k: 0.00105,
      },
    },
  },
  deepseek: {
    name: "deepseek",
    priority: 4,
    fallbackProvider: "openai",
    models: {
      "deepseek-chat": {
        id: "deepseek-chat",
        name: "DeepSeek Chat",
        category: "chat",
        maxContext: 64000,
        supportsStreaming: true,
        supportsVision: false,
        supportsImages: false,
        supportsTools: true,
        supportsJsonMode: true,
        supportsFunctionCalling: true,
        inputPricePer1k: 0.00014,
        outputPricePer1k: 0.00028,
      },
    },
  },
  groq: {
    name: "groq",
    priority: 5,
    fallbackProvider: "openai",
    models: {
      "llama-3-70b": {
        id: "llama-3-70b",
        name: "Llama 3 70B",
        category: "chat",
        maxContext: 8192,
        supportsStreaming: true,
        supportsVision: false,
        supportsImages: false,
        supportsTools: true,
        supportsJsonMode: true,
        supportsFunctionCalling: true,
        inputPricePer1k: 0.0007,
        outputPricePer1k: 0.0009,
      },
    },
  },
  openrouter: {
    name: "openrouter",
    priority: 6,
    fallbackProvider: "openai",
    models: {
      "openrouter-default": {
        id: "openrouter-default",
        name: "OpenRouter Default",
        category: "chat",
        maxContext: 128000,
        supportsStreaming: true,
        supportsVision: false,
        supportsImages: false,
        supportsTools: false,
        supportsJsonMode: false,
        supportsFunctionCalling: false,
        inputPricePer1k: 0.002,
        outputPricePer1k: 0.006,
      },
    },
  },
};

// Registry lookup helper functions
export function getModelConfig(providerName: string, modelName: string): ModelConfig | null {
  const provider = providerRegistry[providerName.toLowerCase()];
  if (!provider) return null;
  return provider.models[modelName.toLowerCase()] || null;
}

export function resolveProviderForModel(modelName: string): string | null {
  const target = modelName.toLowerCase();
  for (const [providerName, config] of Object.entries(providerRegistry)) {
    if (config.models[target]) {
      return providerName;
    }
  }
  return null;
}

export function isModelSupported(modelName: string): boolean {
  return resolveProviderForModel(modelName) !== null;
}
