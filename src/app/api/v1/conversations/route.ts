import { NextResponse } from "next/server";

export async function GET() {
  // In production we pull from PostgreSQL via Supabase using active session id.
  // Local placeholder:
  return NextResponse.json({
    conversations: [
      {
        id: "conv_a8b9c2d1",
        title: "React Query Implementation",
        model_provider: "anthropic",
        model_name: "claude-3-5-sonnet",
        created_at: new Date().toISOString(),
      },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, model_provider, model_name } = body;

    if (!model_provider || !model_name) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_FAILED",
            message: "Provider and Name parameters are required.",
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        id: `conv_${Math.random().toString(36).substring(2, 9)}`,
        title: title || "New Chat",
        model_provider,
        model_name,
        created_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to create conversation.",
        },
      },
      { status: 500 }
    );
  }
}
