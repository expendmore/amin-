import { NextResponse } from "next/server";
import { providerRegistry } from "@/services/ai-gateway/registry/provider.registry";

export async function GET() {
  try {
    const modelsList = [];

    for (const [providerName, config] of Object.entries(providerRegistry)) {
      for (const modelConfig of Object.values(config.models)) {
        modelsList.push({
          provider: providerName,
          ...modelConfig,
        });
      }
    }

    return NextResponse.json({ models: modelsList }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to resolve models registry.", message: error.message },
      { status: 500 }
    );
  }
}
