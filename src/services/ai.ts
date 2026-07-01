// AI API Provider integration client adapters placeholder

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string, tokensUsed: number) => void;
  onError: (error: Error) => void;
}

export async function streamChatCompletion(
  model: string,
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  try {
    // In production we call standard AI provider libraries (e.g. @ai-sdk/openai or Anthropic SDK).
    // Local placeholder mock stream:
    const mockOutput = `This is a streamed token mock response from model "${model}". The AI adapter is ready for provider mapping.`;
    const tokens = mockOutput.split(" ");
    let fullText = "";

    for (let i = 0; i < tokens.length; i++) {
      if (signal?.aborted) {
        callbacks.onError(new Error("Stream aborted by user request."));
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 80)); // Mock streaming latency
      const token = tokens[i] + " ";
      fullText += token;
      callbacks.onToken(token);
    }

    callbacks.onComplete(fullText, tokens.length);
  } catch (error: any) {
    callbacks.onError(error);
  }
}
