import { getModelConfig, resolveProviderForModel } from "../registry/provider.registry";
import { ModelCategory } from "../types";

export class ModelResolver {
  // Resolve default fallback model chains in case of outages
  static resolveFallback(
    providerName: string,
    modelName: string
  ): { provider: string; model: string } | null {
    const p = providerName.toLowerCase();
    const m = modelName.toLowerCase();

    // Map explicit model fallback transitions
    const explicitFallbacks: Record<string, { provider: string; model: string }> = {
      "gpt-4o": { provider: "anthropic", model: "claude-3-5-sonnet" },
      "gpt-4o-mini": { provider: "google", model: "gemini-1.5-flash" },
      "claude-3-5-sonnet": { provider: "openai", model: "gpt-4o" },
      "claude-3-haiku": { provider: "openai", model: "gpt-4o-mini" },
      "gemini-1.5-pro": { provider: "openai", model: "gpt-4o" },
      "gemini-1.5-flash": { provider: "openai", model: "gpt-4o-mini" },
      "deepseek-chat": { provider: "openai", model: "gpt-4o-mini" },
      "llama-3-70b": { provider: "openai", model: "gpt-4o-mini" },
    };

    if (explicitFallbacks[m]) {
      return explicitFallbacks[m];
    }

    // Default global fallback strategy
    if (p === "openai") {
      return { provider: "anthropic", model: "claude-3-5-sonnet" };
    }
    return { provider: "openai", model: "gpt-4o-mini" };
  }

  // Resolve standard fallback defaults by category
  static resolveDefaultModel(category: ModelCategory = "chat"): {
    provider: string;
    model: string;
  } {
    switch (category) {
      case "chat":
      default:
        return { provider: "openai", model: "gpt-4o-mini" };
      case "vision":
        return { provider: "openai", model: "gpt-4o" };
      case "reasoning":
        return { provider: "openai", model: "gpt-4o-mini" }; // Fallback to mini chat
    }
  }

  // Auto-resolves model details and maps default provider if left empty
  static resolve(
    modelName?: string,
    providerName?: string
  ): { provider: string; model: string } {
    if (!modelName) {
      return this.resolveDefaultModel("chat");
    }

    const resolvedProvider = providerName || resolveProviderForModel(modelName);
    if (!resolvedProvider) {
      // Return default if model name is unrecognized
      return this.resolveDefaultModel("chat");
    }

    return {
      provider: resolvedProvider,
      model: modelName,
    };
  }
}
export default ModelResolver;
