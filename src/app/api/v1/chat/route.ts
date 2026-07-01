import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireWorkspaceAccess, apiError } from "@/lib/api-auth";
import { AIGateway } from "@/services/ai-gateway/gateway";
import { GatewayChatRequest } from "@/services/ai-gateway/types";
import { z } from "zod";

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant", "tool"]),
      content: z.string().min(1, "Message content cannot be empty"),
    })
  ),
  modelName: z.string(),
  providerName: z.string().optional(),
  conversationId: z.string().nullable().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).optional(),
  stream: z.boolean().optional(),
  workspaceId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authorize user session via Firebase HttpOnly cookie
    const { uid, error: authErr } = await requireAuth(request);
    if (authErr || !uid) {
      return apiError("Unauthorized access. Invalid or missing session cookies.", 401);
    }

    // 2. Validate request body
    const body = await request.json();
    const result = chatRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request parameters.", details: result.error.errors },
        { status: 400 }
      );
    }

    const { workspaceId } = result.data;

    // 3. Verify workspace access
    const { error: wsErr } = await requireWorkspaceAccess(workspaceId, uid);
    if (wsErr) {
      return apiError(wsErr, 403);
    }

    // 4. Execute AI Gateway pipeline with Firestore logging options
    const payload: GatewayChatRequest = result.data;
    const gatewayResponse = await AIGateway.execute(payload, {
      userId: uid,
      workspaceId,
    });

    const responseStatus = gatewayResponse.success ? 200 : 500;
    return NextResponse.json(gatewayResponse, { status: responseStatus });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error occurred inside AI Gateway.", message: error.message },
      { status: 500 }
    );
  }
}
