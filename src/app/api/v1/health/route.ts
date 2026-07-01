import { NextResponse } from "next/server";
import { runSystemHealthCheck } from "@/lib/observability";
import { providerRegistry } from "@/services/ai-gateway/registry/provider.registry";
import { ProviderFactory } from "@/services/ai-gateway/factory/provider.factory";

export async function GET() {
  try {
    // 1. Check system (Firestore, Redis) health
    const systemHealth = await runSystemHealthCheck();

    // 2. Check AI Gateway providers health
    const providerHealth: Record<string, { status: "healthy" | "unhealthy" }> = {};

    for (const providerName of Object.keys(providerRegistry)) {
      try {
        const adapter = ProviderFactory.getProvider(providerName);
        const isHealthy = await adapter.getHealth();
        providerHealth[providerName] = { status: isHealthy ? "healthy" : "unhealthy" };
      } catch {
        providerHealth[providerName] = { status: "unhealthy" };
      }
    }

    const overallStatus = systemHealth.overall === "healthy" ? 200 : 503;

    return NextResponse.json(
      {
        status: systemHealth.overall,
        timestamp: new Date().toISOString(),
        system: {
          database: systemHealth.database,
          redis: systemHealth.redis,
        },
        providers: providerHealth,
      },
      { status: overallStatus }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Health check diagnostic failed.", message: error.message },
      { status: 500 }
    );
  }
}
