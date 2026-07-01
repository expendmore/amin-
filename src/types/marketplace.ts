export type MarketplaceCategory =
  | "workflows"
  | "agents"
  | "prompts"
  | "chatbots"
  | "whatsapp"
  | "integrations"
  | "components";

export interface VersionRevision {
  id: string;
  version: string;
  date: string;
  releaseNotes: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  helpfulVotes: number;
  replies?: { author: string; text: string; date: string }[];
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  category: MarketplaceCategory;
  publisher: string;
  pricingType: "free" | "premium";
  price: number;
  rating: number;
  downloadsCount: number;
  screenshots: string[];
  versions: VersionRevision[];
  licenseType: "personal" | "business" | "enterprise" | "lifetime";
  isInstalled: boolean;
  isPurchased: boolean;
  isFavorite: boolean;
  isWishlist: boolean;
}

export interface CreatorStats {
  publishedCount: number;
  totalRevenue: number;
  totalDownloads: number;
  averageRating: number;
  activeFollowers: number;
}

export interface LicenseCode {
  key: string;
  itemId: string;
  type: "personal" | "business" | "enterprise";
  seatLimit: number;
  seatUsed: number;
  status: "active" | "expired" | "suspended";
}

export interface PurchaseRecord {
  id: string;
  itemId: string;
  date: string;
  amount: number;
  invoiceUrl: string;
}

export interface ModerationRecord {
  id: string;
  itemName: string;
  status: "pending" | "approved" | "rejected";
  reportsCount: number;
  violationDetails?: string;
  timestamp: string;
}
