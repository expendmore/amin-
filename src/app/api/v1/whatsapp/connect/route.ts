import { NextRequest } from "next/server";
import { requireAuth, apiError, apiSuccess } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const { uid, error } = await requireAuth(request);
    if (error) return apiError(error, 401);

    return apiSuccess({
      appId: process.env.NEXT_PUBLIC_META_APP_ID || "mock_app_id_84920",
      scope: "whatsapp_business_management,whatsapp_business_messaging",
      redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/v1/whatsapp/callback`
    });
  } catch (err: any) {
    return apiError("Internal server error", 500);
  }
}
