import { GatewayChatRequest, GatewayChatResponse } from "./types";
import { ProviderFactory } from "./factory/provider.factory";
import { ModelResolver } from "./routing/model.resolver";
import { normalizeGatewayError } from "./utils/error-handler";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export class AIGateway {
  /**
   * Orchestrates the execution of a chat completion request across multiple providers
   * with automatic retry-backoff, model fallback, and telemetry logger sync.
   */
  static async execute(
    request: GatewayChatRequest,
    options?: {
      userId?: string | null;
      workspaceId?: string | null;
      maxRetries?: number;
    }
  ): Promise<GatewayChatResponse> {
    const start = Date.now();
    const maxRetries = options?.maxRetries ?? 2;

    // Resolve primary provider and model configuration
    const resolved = ModelResolver.resolve(request.modelName, request.providerName);
    let currentProvider = resolved.provider;
    let currentModel = resolved.model;

    let retryCount = 0;
    let lastError: any = null;
    let finalResponse: GatewayChatResponse;

    // Recursive helper to run execution and handle fallbacks
    const runPipeline = async (): Promise<GatewayChatResponse> => {
      const adapter = ProviderFactory.getProvider(currentProvider);

      while (retryCount <= maxRetries) {
        try {
          const resp = await adapter.generateChatCompletion({
            ...request,
            modelName: currentModel,
            providerName: currentProvider,
          });
          return resp;
        } catch (err: any) {
          lastError = err;
          retryCount++;

          if (retryCount <= maxRetries) {
            // Linear backoff delay
            await new Promise((resolve) => setTimeout(resolve, retryCount * 200));
          }
        }
      }

      // If we reached here, retries for the current model failed. Try fallback!
      const fallback = ModelResolver.resolveFallback(currentProvider, currentModel);
      if (fallback) {
        currentProvider = fallback.provider;
        currentModel = fallback.model;
        retryCount = 0; // reset retries for fallback execution
        return await runPipeline();
      }

      throw lastError;
    };

    try {
      finalResponse = await runPipeline();
    } catch (err: any) {
      const normalized = normalizeGatewayError(err);
      finalResponse = {
        id: `err-${Math.random().toString(36).substring(2, 9)}`,
        provider: currentProvider,
        model: currentModel,
        choices: [],
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        latencyMs: Date.now() - start,
        success: false,
        error: {
          code: normalized.code,
          message: normalized.message,
        },
      };
    }

    // Telemetry Sync Logger (Firestore)
    if (adminDb && options?.userId) {
      try {
        const statusCode = finalResponse.success ? 200 : 500;
        const workspaceId = options.workspaceId || "system_workspace";
        
        const logPayload = {
          workspaceId,
          userId: options.userId,
          conversationId: request.conversationId || null,
          provider: finalResponse.provider,
          modelName: finalResponse.model,
          endpoint: "/api/v1/chat",
          promptTokens: finalResponse.usage.promptTokens,
          completionTokens: finalResponse.usage.completionTokens,
          totalTokens: finalResponse.usage.totalTokens,
          latencyMs: finalResponse.latencyMs,
          statusCode: statusCode,
          isSuccess: finalResponse.success,
          errorMessage: finalResponse.error?.message || null,
          errorCode: finalResponse.error?.code || null,
          requestMetadata: {
            temperature: request.temperature ?? 0.7,
            maxTokens: request.maxTokens ?? 1000,
            retriesAttempted: retryCount,
          },
          createdAt: FieldValue.serverTimestamp()
        };

        await adminDb.collection("aiGatewayLogs").add(logPayload);
      } catch (logErr) {
        console.error("AI Gateway failed to commit logs to Firestore:", logErr);
      }
    }

    return finalResponse;
  }
}
export default AIGateway;
