import { IAIProvider } from "../interfaces/provider.interface";
import { OpenAIAdapter } from "../providers/openai.adapter";
import { GeminiAdapter } from "../providers/gemini.adapter";
import { ClaudeAdapter } from "../providers/claude.adapter";
import { DeepSeekAdapter } from "../providers/deepseek.adapter";
import { OpenRouterAdapter } from "../providers/openrouter.adapter";
import { GroqAdapter } from "../providers/groq.adapter";

export class ProviderFactory {
  private static instances: Record<string, IAIProvider> = {};

  // Lazy Initialization & caching pattern
  static getProvider(providerName: string): IAIProvider {
    const key = providerName.toLowerCase();

    if (this.instances[key]) {
      return this.instances[key];
    }

    let provider: IAIProvider;

    switch (key) {
      case "openai":
        provider = new OpenAIAdapter();
        break;
      case "google":
      case "gemini":
        provider = new GeminiAdapter();
        break;
      case "anthropic":
      case "claude":
        provider = new ClaudeAdapter();
        break;
      case "deepseek":
        provider = new DeepSeekAdapter();
        break;
      case "openrouter":
        provider = new OpenRouterAdapter();
        break;
      case "groq":
        provider = new GroqAdapter();
        break;
      default:
        // Graceful fallback to OpenAI mock adapter
        provider = new OpenAIAdapter();
        break;
    }

    this.instances[key] = provider;
    return provider;
  }
}
export default ProviderFactory;
