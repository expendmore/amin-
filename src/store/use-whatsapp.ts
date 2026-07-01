import { create } from "zustand";
import { WhatsAppAccount, WhatsAppTemplate, WhatsAppConversation, WhatsAppMessage } from "@/types/whatsapp";

interface WhatsAppState {
  accounts: WhatsAppAccount[];
  templates: WhatsAppTemplate[];
  conversations: WhatsAppConversation[];
  messages: Record<string, WhatsAppMessage[]>;
  aiResponderEnabled: boolean;
  activeConversationId: string | null;

  // Actions
  toggleAiResponder: () => void;
  toggleChatAiResponder: (id: string) => void;
  addAccount: (account: Omit<WhatsAppAccount, "id" | "createdAt" | "userId">) => void;
  addTemplate: (template: Omit<WhatsAppTemplate, "id" | "createdAt" | "userId">) => void;
  selectConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => void;
  receiveMessage: (conversationId: string, text: string) => void;
  clearUnreadCount: (conversationId: string) => void;
}

const mockAccounts: WhatsAppAccount[] = [
  {
    id: "wa-1",
    userId: "u-1",
    phoneNumberId: "phone_12345",
    phoneNumber: "+91 98765 43210",
    displayName: "ExpendMore Primary",
    status: "CONNECTED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "wa-2",
    userId: "u-1",
    phoneNumberId: "phone_67890",
    phoneNumber: "+1 555-0199",
    displayName: "ExpendMore Global Support",
    status: "CONNECTED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
];

const mockTemplates: WhatsAppTemplate[] = [
  {
    id: "tpl-1",
    userId: "u-1",
    name: "Order Confirmation",
    category: "Utility",
    status: "APPROVED",
    bodyText: "Hi {{1}}, thank you for your order. Your order ID is {{2}}. We will dispatch it soon!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "tpl-2",
    userId: "u-1",
    name: "Appointment Reminder",
    category: "Utility",
    status: "APPROVED",
    bodyText: "Hello {{1}}, this is a reminder for your upcoming appointment on {{2}} at {{3}}.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "tpl-3",
    userId: "u-1",
    name: "New Promotion",
    category: "Marketing",
    status: "PENDING",
    bodyText: "Get 20% off our premium plan! Use code SENSY20. Valid for first 100 signups.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

const mockConversations: WhatsAppConversation[] = [
  {
    id: "conv-1",
    customerName: "Rohan Kumar",
    phoneNumber: "+91 99999 88888",
    lastMessage: "Yes, please confirm my booking details.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    aiResponder: true,
    status: "active",
    unreadCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: "conv-2",
    customerName: "Sarah Jenkins",
    phoneNumber: "+1 415-555-2671",
    lastMessage: "How do I update my billing credit card details?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    aiResponder: false,
    status: "active",
    unreadCount: 0,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: "conv-3",
    customerName: "Amit Patel",
    phoneNumber: "+91 90000 11111",
    lastMessage: "Thanks, the response was very quick and helpful!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    aiResponder: true,
    status: "active",
    unreadCount: 0,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
  },
];

const mockMessages: Record<string, WhatsAppMessage[]> = {
  "conv-1": [
    { id: "m1", conversationId: "conv-1", sender: "customer", text: "Hello! Is there any slots available for tomorrow?", timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: "m2", conversationId: "conv-1", sender: "ai", text: "🤖 [AI Auto-Reply] Hi Rohan! Yes, we have slots open at 10 AM, 2 PM, and 4 PM tomorrow. Which one would you prefer?", timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
    { id: "m3", conversationId: "conv-1", sender: "customer", text: "Let's do 2 PM.", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { id: "m4", conversationId: "conv-1", sender: "ai", text: "🤖 [AI Auto-Reply] Perfect. I can book Rohan for 2 PM. Please confirm if I should lock it.", timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString() },
    { id: "m5", conversationId: "conv-1", sender: "customer", text: "Yes, please confirm my booking details.", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  ],
  "conv-2": [
    { id: "m6", conversationId: "conv-2", sender: "customer", text: "Hey! I am on the pro plan, but I need to change my credit card details.", timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { id: "m7", conversationId: "conv-2", sender: "agent", text: "Hi Sarah! You can update your payment details directly in the Settings > Billing tab on the web portal dashboard.", timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString() },
    { id: "m8", conversationId: "conv-2", sender: "customer", text: "How do I update my billing credit card details?", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  ],
  "conv-3": [
    { id: "m9", conversationId: "conv-3", sender: "customer", text: "Do you support custom integrations with Shopify?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
    { id: "m10", conversationId: "conv-3", sender: "ai", text: "🤖 [AI Auto-Reply] Yes, Amit! We have a native Shopify integration that syncs order events and triggers automations automatically.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.8).toISOString() },
    { id: "m11", conversationId: "conv-3", sender: "customer", text: "Thanks, the response was very quick and helpful!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  ],
};

export const useWhatsApp = create<WhatsAppState>((set, get) => ({
  accounts: mockAccounts,
  templates: mockTemplates,
  conversations: mockConversations,
  messages: mockMessages,
  aiResponderEnabled: true,
  activeConversationId: "conv-1",

  toggleAiResponder: () =>
    set((state) => ({ aiResponderEnabled: !state.aiResponderEnabled })),

  toggleChatAiResponder: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, aiResponder: !c.aiResponder } : c
      ),
    })),

  addAccount: (account) =>
    set((state) => {
      const newAccount: WhatsAppAccount = {
        ...account,
        id: `wa-${Math.random().toString(36).substring(2, 9)}`,
        userId: "u-1",
        createdAt: new Date().toISOString(),
      };
      return { accounts: [...state.accounts, newAccount] };
    }),

  addTemplate: (template) =>
    set((state) => {
      const newTemplate: WhatsAppTemplate = {
        ...template,
        id: `tpl-${Math.random().toString(36).substring(2, 9)}`,
        userId: "u-1",
        createdAt: new Date().toISOString(),
      };
      return { templates: [...state.templates, newTemplate] };
    }),

  selectConversation: (id) =>
    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === id ? { ...c, unreadCount: 0 } : c
      );
      return { activeConversationId: id, conversations: updated };
    }),

  sendMessage: (conversationId, text) => {
    const newMessage: WhatsAppMessage = {
      id: `m-${Math.random().toString(36).substring(2, 9)}`,
      conversationId,
      sender: "agent",
      text,
      timestamp: new Date().toISOString(),
    };

    set((state) => {
      const currentMsgs = state.messages[conversationId] || [];
      const updatedMsgs = {
        ...state.messages,
        [conversationId]: [...currentMsgs, newMessage],
      };

      const updatedConvs = state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text,
              lastMessageTime: newMessage.timestamp,
            }
          : c
      );

      return {
        messages: updatedMsgs,
        conversations: updatedConvs,
      };
    });

    // Check if AI auto responder should reply
    const targetConv = get().conversations.find((c) => c.id === conversationId);
    const globalAiEnabled = get().aiResponderEnabled;

    if (targetConv && (targetConv.aiResponder || globalAiEnabled)) {
      // Simulate AI response after 1.2 seconds
      setTimeout(() => {
        const aiText = getAiResponseText(text, targetConv.customerName);
        const aiMessage: WhatsAppMessage = {
          id: `m-${Math.random().toString(36).substring(2, 9)}`,
          conversationId,
          sender: "ai",
          text: `🤖 [AI Auto-Reply] ${aiText}`,
          timestamp: new Date().toISOString(),
        };

        set((state) => {
          const currentMsgs = state.messages[conversationId] || [];
          const updatedMsgs = {
            ...state.messages,
            [conversationId]: [...currentMsgs, aiMessage],
          };

          const updatedConvs = state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: aiMessage.text,
                  lastMessageTime: aiMessage.timestamp,
                }
              : c
          );

          return {
            messages: updatedMsgs,
            conversations: updatedConvs,
          };
        });
      }, 1200);
    }
  },

  receiveMessage: (conversationId, text) => {
    const newMessage: WhatsAppMessage = {
      id: `m-${Math.random().toString(36).substring(2, 9)}`,
      conversationId,
      sender: "customer",
      text,
      timestamp: new Date().toISOString(),
    };

    set((state) => {
      const currentMsgs = state.messages[conversationId] || [];
      const updatedMsgs = {
        ...state.messages,
        [conversationId]: [...currentMsgs, newMessage],
      };

      const updatedConvs = state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text,
              lastMessageTime: newMessage.timestamp,
              unreadCount: state.activeConversationId === conversationId ? 0 : c.unreadCount + 1,
            }
          : c
      );

      return {
        messages: updatedMsgs,
        conversations: updatedConvs,
      };
    });

    // Also trigger AI auto response if appropriate
    const targetConv = get().conversations.find((c) => c.id === conversationId);
    const globalAiEnabled = get().aiResponderEnabled;

    if (targetConv && (targetConv.aiResponder || globalAiEnabled)) {
      setTimeout(() => {
        const aiText = getAiResponseText(text, targetConv.customerName);
        const aiMessage: WhatsAppMessage = {
          id: `m-${Math.random().toString(36).substring(2, 9)}`,
          conversationId,
          sender: "ai",
          text: `🤖 [AI Auto-Reply] ${aiText}`,
          timestamp: new Date().toISOString(),
        };

        set((state) => {
          const currentMsgs = state.messages[conversationId] || [];
          const updatedMsgs = {
            ...state.messages,
            [conversationId]: [...currentMsgs, aiMessage],
          };

          const updatedConvs = state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: aiMessage.text,
                  lastMessageTime: aiMessage.timestamp,
                }
              : c
          );

          return {
            messages: updatedMsgs,
            conversations: updatedConvs,
          };
        });
      }, 1200);
    }
  },

  clearUnreadCount: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },
}));

function getAiResponseText(inputText: string, customerName: string): string {
  const query = inputText.toLowerCase();

  if (query.includes("pricing") || query.includes("plan") || query.includes("cost") || query.includes("subscription")) {
    return `Hi ${customerName}! Our subscriptions are billed monthly: Free ($0/mo for 20 credits), Pro ($29/mo for unlimited standard runs), and Business/Enterprise tiers. Would you like a checkout link?`;
  }
  if (query.includes("setup") || query.includes("integrate") || query.includes("connect")) {
    return `Certainly, ${customerName}. To connect a new WhatsApp Business account, simply select 'Connect Account' in the WhatsApp Hub panel, scan the QR code with WhatsApp, and verify.`;
  }
  if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
    return `Hello ${customerName}! How can I help you manage your WhatsApp automation and workspace settings today?`;
  }
  if (query.includes("order") || query.includes("track")) {
    return `Your latest workspace dispatch confirmation was triggered. If you need details on a specific order, please send your order ID.`;
  }
  return `Thank you for your message, ${customerName}. An AI responder has categorized this query and will follow up shortly. Let me know if you have specific product questions!`;
}
