export interface WhatsAppAccount {
  id: string;
  workspaceId: string;
  phoneNumberId: string;
  phoneNumber: string;
  displayName: string;
  status: "CONNECTED" | "DISCONNECTED" | "SUSPENDED" | "CONNECTED_STUB";
  createdAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  workspaceId: string;
  name: string;
  category: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  bodyText: string;
  createdAt: string;
}

export interface WhatsAppConversation {
  id: string;
  customerName: string;
  phoneNumber: string;
  lastMessage: string;
  lastMessageTime: string;
  aiResponder: boolean;
  status: "active" | "archived";
  unreadCount: number;
  avatarUrl?: string;
}

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  sender: "customer" | "agent" | "ai";
  text: string;
  timestamp: string;
}
