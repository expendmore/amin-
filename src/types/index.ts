export interface UserProfile {
  id: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  avatarUrl?: string;
  tier: "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";
  subscriptionStatus: "ACTIVE" | "INACTIVE" | "PAST_DUE";
  createdAt: string;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color?: string | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  modelProvider: string;
  modelName: string;
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  folderId?: string | null;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tokenCount: number;
  status: "draft" | "sending" | "sent" | "error";
  metadata?: Record<string, any> | null;
  isDraft: boolean;
  createdAt: string;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  version: number;
  isPublic: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  paymentStatus: "paid" | "failed" | "pending";
  tierPurchased: string;
  createdAt: string;
}

export * from "./whatsapp";
export * from "./workflows";
export * from "./crm";
export * from "./campaigns";
export * from "./chatbot";
export * from "./ai-assistant";
export * from "./scheduler";
export * from "./analytics";
export * from "./commerce";
export * from "./whatsapp-manager";
export * from "./integrations";






