import { NextResponse } from "next/server";
import { providerRegistry } from "@/services/ai-gateway/registry/provider.registry";

export async function GET() {
  try {
    const providersList = Object.entries(providerRegistry).map(([key, config]) => ({
      name: key,
      priority: config.priority,
      fallbackProvider: config.fallbackProvider,
      modelCount: Object.keys(config.models).length,
    }));

    return NextResponse.json({ providers: providersList }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to resolve providers list.", message: error.message },
      { status: 500 }
    );
  }
}
