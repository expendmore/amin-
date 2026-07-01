export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type CampaignCategory = "marketing" | "utility" | "authentication";

export interface CampaignTemplate {
  id: string;
  name: string;
  category: CampaignCategory;
  bodyText: string;
  language: string;
  status: "approved" | "pending" | "rejected";
  variables: string[]; // e.g., ["name", "orderId"]
  mediaHeaderType: "image" | "video" | "document" | "none";
}

export interface MediaAsset {
  id: string;
  name: string;
  type: "image" | "video" | "pdf" | "audio" | "document";
  size: string;
  url: string;
  uploadedAt: string;
}

export interface CampaignLog {
  id: string;
  contactName: string;
  phoneNumber: string;
  status: "queued" | "sending" | "delivered" | "read" | "failed";
  errorMessage?: string;
  timestamp: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  category: CampaignCategory;
  tags: string[];
  workspaceId: string;
  ownerId: string;
  ownerName: string;
  priority: "low" | "medium" | "high";
  
  // Audience
  audienceType: "segment" | "labels" | "tags" | "csv" | "manual";
  audienceTarget: string; // e.g. "VIP Customers segment" or "VIP tag"
  audienceCount: number;

  // Template Mappings
  templateId: string;
  templateVariablesMapped: Record<string, string>; // e.g. {"1": "name", "2": "company"}
  mediaAssetUrl?: string;

  // Schedule Configuration
  scheduleType: "now" | "later" | "recurring";
  scheduleTime?: string;
  scheduleTimezone?: string;
  rateLimitPerMin: number; // rate limit throttle

  // Metrics
  stats: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    failed: number;
  };

  logs: CampaignLog[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}
