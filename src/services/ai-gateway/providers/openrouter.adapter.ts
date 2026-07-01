import { IAIProvider } from "../interfaces/provider.interface";
import { GatewayChatRequest, GatewayChatResponse } from "../types";

export class OpenRouterAdapter implements IAIProvider {
  name = "openrouter";

  async generateChatCompletion(
    request: GatewayChatRequest
  ): Promise<GatewayChatResponse> {
    const start = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 400));

    const lastMsg = request.messages[request.messages.length - 1]?.content || "";

    const latencyMs = Date.now() - start;
    const mockReply = `[OpenRouter ${request.modelName}] This is a normalized mock output from the AI Gateway. Core database RLS sync and keys authentication succeeded.`;

    return {
      id: `openrouter-msg-${Math.random().toString(36).substring(2, 9)}`,
      provider: this.name,
      model: request.modelName,
      choices: [
        {
          role: "assistant",
          message: mockReply,
        },
      ],
      usage: {
        promptTokens: lastMsg.split(/\s+/).length + 15,
        completionTokens: mockReply.split(/\s+/).length,
        totalTokens: lastMsg.split(/\s+/).length + mockReply.split(/\s+/).length + 15,
      },
      latencyMs,
      success: true,
    };
  }

  async getHealth(): Promise<boolean> {
    return true;
  }
}
export default OpenRouterAdapter;
