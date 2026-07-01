import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, model } = body;

    if (!prompt) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_FAILED",
            message: "Prompt parameter is required.",
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        task_id: `task_img_${Math.random().toString(36).substring(2, 9)}`,
        status: "QUEUED",
        estimated_wait_seconds: 5,
      },
      { status: 202 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to queue image generation job.",
        },
      },
      { status: 500 }
    );
  }
}
