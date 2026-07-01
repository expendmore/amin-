import { IAIProvider } from "../interfaces/provider.interface";
import { GatewayChatRequest, GatewayChatResponse } from "../types";

export class ClaudeAdapter implements IAIProvider {
  name = "anthropic";

  async generateChatCompletion(
    request: GatewayChatRequest
  ): Promise<GatewayChatResponse> {
    const start = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const lastMsg = request.messages[request.messages.length - 1]?.content || "";

    if (lastMsg.includes("FORCE_FAIL_CLAUDE")) {
      throw new Error("Simulated Anthropic Claude API validation error (400 Bad Request).");
    }

    const latencyMs = Date.now() - start;
    const mockReply = `[Claude ${request.modelName}] This is a normalized mock output from the AI Gateway. Core database RLS sync and keys authentication succeeded.`;

    return {
      id: `claude-msg-${Math.random().toString(36).substring(2, 9)}`,
      provider: this.name,
      model: request.modelName,
      choices: [
        {
          role: "assistant",
          message: mockReply,
        },
      ],
      usage: {
        promptTokens: lastMsg.split(/\s+/).length + 6,
        completionTokens: mockReply.split(/\s+/).length,
        totalTokens: lastMsg.split(/\s+/).length + mockReply.split(/\s+/).length + 6,
      },
      latencyMs,
      success: true,
    };
  }

  async getHealth(): Promise<boolean> {
    return true;
  }
}
export default ClaudeAdapter;
