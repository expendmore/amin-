import { IAIProvider } from "../interfaces/provider.interface";
import { GatewayChatRequest, GatewayChatResponse } from "../types";

export class OpenAIAdapter implements IAIProvider {
  name = "openai";

  async generateChatCompletion(
    request: GatewayChatRequest
  ): Promise<GatewayChatResponse> {
    const start = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 200));

    const lastMsg = request.messages[request.messages.length - 1]?.content || "";
    
    // Simulating outage trigger for fallback validation testing
    if (lastMsg.includes("FORCE_FAIL_OPENAI")) {
      throw new Error("Simulated OpenAI service outage error (503 Service Unavailable).");
    }

    const latencyMs = Date.now() - start;
    const mockReply = `[OpenAI ${request.modelName}] This is a normalized mock output from the AI Gateway. Core database RLS sync and keys authentication succeeded.`;

    return {
      id: `openai-msg-${Math.random().toString(36).substring(2, 9)}`,
      provider: this.name,
      model: request.modelName,
      choices: [
        {
          role: "assistant",
          message: mockReply,
        },
      ],
      usage: {
        promptTokens: lastMsg.split(/\s+/).length + 8,
        completionTokens: mockReply.split(/\s+/).length,
        totalTokens: lastMsg.split(/\s+/).length + mockReply.split(/\s+/).length + 8,
      },
      latencyMs,
      success: true,
    };
  }

  async getHealth(): Promise<boolean> {
    return true;
  }
}
export default OpenAIAdapter;
