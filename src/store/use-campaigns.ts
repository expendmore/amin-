import { create } from "zustand";
import { Campaign, CampaignTemplate, MediaAsset, CampaignStatus, CampaignLog } from "@/types/campaigns";

interface CampaignsState {
  campaigns: Campaign[];
  templates: CampaignTemplate[];
  mediaAssets: MediaAsset[];
  loading: boolean;
  selectedCampaignId: string | null;

  // Actions
  setSelectedCampaignId: (id: string | null) => void;
  addCampaign: (campaign: Omit<Campaign, "id" | "createdAt" | "updatedAt" | "stats" | "logs"> & { logs?: CampaignLog[] }) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  duplicateCampaign: (id: string) => void;
  addMediaAsset: (asset: Omit<MediaAsset, "id" | "uploadedAt">) => void;
  deleteMediaAsset: (id: string) => void;
  addTemplate: (template: Omit<CampaignTemplate, "id" | "status">) => void;
}

const mockTemplates = (): CampaignTemplate[] => [
  {
    id: "ct-1",
    name: "Summer Sale Promotion",
    category: "marketing",
    bodyText: "Hi {{1}}! 🌞 Our massive Summer Sale is live. Use code SUMMER50 to get 50% off on all items. Shop now at {{2}}!",
    language: "English (US)",
    status: "approved",
    variables: ["name", "websiteLink"],
    mediaHeaderType: "image",
  },
  {
    id: "ct-2",
    name: "Payment Reminder",
    category: "utility",
    bodyText: "Dear {{1}}, this is a reminder that payment for invoice {{2}} of amount {{3}} is due on {{4}}.",
    language: "English (UK)",
    status: "approved",
    variables: ["name", "invoiceNumber", "amount", "dueDate"],
    mediaHeaderType: "document",
  },
  {
    id: "ct-3",
    name: "Onboarding OTP Verification",
    category: "authentication",
    bodyText: "Your ExpendMore verification OTP is {{1}}. This code is valid for 5 minutes. Do not share it.",
    language: "English (US)",
    status: "approved",
    variables: ["otp"],
    mediaHeaderType: "none",
  },
  {
    id: "ct-4",
    name: "Flash Crypto Alerts",
    category: "marketing",
    bodyText: "Get rich quick! Invest in our crypto index today. Click {{1}} for guaranteed returns.",
    language: "English (US)",
    status: "rejected",
    variables: ["referralLink"],
    mediaHeaderType: "none",
  },
];

const mockMediaAssets = (): MediaAsset[] => [
  {
    id: "ma-1",
    name: "summer_sale_banner.png",
    type: "image",
    size: "1.2 MB",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300&h=150",
    uploadedAt: "2026-06-15",
  },
  {
    id: "ma-2",
    name: "onboarding_guide.pdf",
    type: "pdf",
    size: "2.4 MB",
    url: "#",
    uploadedAt: "2026-06-20",
  },
  {
    id: "ma-3",
    name: "product_demo_clip.mp4",
    type: "video",
    size: "14.8 MB",
    url: "#",
    uploadedAt: "2026-06-25",
  },
];

const mockLogs = (campaignId: string): CampaignLog[] => [
  { id: `${campaignId}-l1`, contactName: "Rohan Kumar", phoneNumber: "+91 99999 88888", status: "read", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: `${campaignId}-l2`, contactName: "Sarah Jenkins", phoneNumber: "+1 415-555-2671", status: "delivered", timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: `${campaignId}-l3`, contactName: "Amit Patel", phoneNumber: "+91 90000 11111", status: "read", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: `${campaignId}-l4`, contactName: "Elena Rostova", phoneNumber: "+7 901-555-0143", status: "failed", errorMessage: "Error 131026: Receiver phone number not registered on WhatsApp.", timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
  { id: `${campaignId}-l5`, contactName: "Marcus Aurelius", phoneNumber: "+39 06-555-0100", status: "failed", errorMessage: "Error 131047: Account rate limits exceeded. Message throttled.", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
];

const mockCampaigns = (): Campaign[] => {
  const now = new Date().toISOString();
  return [
    {
      id: "cp-1",
      name: "Q2 Product Update Blast",
      description: "Notify VIP Shopify segments about our new workflow triggers and AI memory models.",
      status: "completed",
      category: "marketing",
      tags: ["VIP", "Product Release"],
      owner: "Me",
      priority: "high",
      audienceType: "segment",
      audienceTarget: "VIP Customers (500 targets)",
      audienceCount: 500,
      templateId: "ct-1",
      templateVariablesMapped: { "1": "name", "2": "websiteLink" },
      mediaAssetUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300&h=150",
      rateLimitPerMin: 120,
      scheduleType: "now",
      stats: { sent: 500, delivered: 492, read: 420, replied: 98, failed: 8 },
      logs: mockLogs("cp-1"),
      notes: "Campaign completed with a delivery rate of 98.4%. Conversion of clicks exceeded targets.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60).toISOString(),
    },
    {
      id: "cp-2",
      name: "Payment Reminder Automation",
      description: "Send reminders to contacts with open invoice records.",
      status: "running",
      category: "utility",
      tags: ["Billing", "Transactional"],
      owner: "John",
      priority: "medium",
      audienceType: "labels",
      audienceTarget: "Invoice Pending label (150 targets)",
      audienceCount: 150,
      templateId: "ct-2",
      templateVariablesMapped: { "1": "name", "2": "invoiceNumber", "3": "amount", "4": "dueDate" },
      rateLimitPerMin: 60,
      scheduleType: "recurring",
      stats: { sent: 80, delivered: 78, read: 45, replied: 12, failed: 2 },
      logs: mockLogs("cp-2"),
      notes: "Recurring monthly template alert batch runs automatically every Friday.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: "cp-3",
      name: "Summer Sale Re-engagement",
      description: "Follow up campaign to unresponsive leads listing discount alerts.",
      status: "scheduled",
      category: "marketing",
      tags: ["Re-engagement", "Discounts"],
      owner: "Sarah",
      priority: "low",
      audienceType: "tags",
      audienceTarget: "Unresponsive tag (1200 targets)",
      audienceCount: 1200,
      templateId: "ct-1",
      templateVariablesMapped: { "1": "name", "2": "websiteLink" },
      rateLimitPerMin: 180,
      scheduleType: "later",
      scheduleTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      scheduleTimezone: "PST (UTC-8:00)",
      stats: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 },
      logs: [],
      notes: "Audience checks loaded. Waiting for scheduler execution trigger.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: "cp-4",
      name: "Black Friday Launch Campaign",
      description: "Main launch campaign for Black Friday.",
      status: "draft",
      category: "marketing",
      tags: ["Black Friday", "Drafts"],
      owner: "Me",
      priority: "high",
      audienceType: "csv",
      audienceTarget: "black_friday_leads.csv (4500 rows)",
      audienceCount: 4500,
      templateId: "ct-1",
      templateVariablesMapped: { "1": "name", "2": "websiteLink" },
      rateLimitPerMin: 200,
      scheduleType: "later",
      stats: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 },
      logs: [],
      notes: "Waiting for designer mapping approvals on graphics header assets.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ];
};

export const useCampaigns = create<CampaignsState>((set, get) => ({
  campaigns: mockCampaigns(),
  templates: mockTemplates(),
  mediaAssets: mockMediaAssets(),
  loading: false,
  selectedCampaignId: "cp-1",

  setSelectedCampaignId: (selectedCampaignId) => set({ selectedCampaignId }),

  addCampaign: (campaignData) =>
    set((state) => {
      const now = new Date().toISOString();
      const id = `cp-${Math.random().toString(36).substring(2, 9)}`;
      const newCampaign: Campaign = {
        ...campaignData,
        id,
        stats: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 },
        logs: campaignData.logs || [],
        createdAt: now,
        updatedAt: now,
      };
      
      // Simulate running status triggers sending logs
      if (newCampaign.status === "running") {
        newCampaign.logs = mockLogs(id);
        newCampaign.stats = { sent: 5, delivered: 3, read: 2, replied: 0, failed: 2 };
      }

      return {
        campaigns: [newCampaign, ...state.campaigns],
      };
    }),

  updateCampaign: (id, updates) =>
    set((state) => {
      const updatedCampaigns = state.campaigns.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });
      return { campaigns: updatedCampaigns };
    }),

  deleteCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
      selectedCampaignId: state.selectedCampaignId === id ? null : state.selectedCampaignId,
    })),

  duplicateCampaign: (id) =>
    set((state) => {
      const target = state.campaigns.find((c) => c.id === id);
      if (!target) return {};

      const now = new Date().toISOString();
      const duplicated: Campaign = {
        ...target,
        id: `cp-${Math.random().toString(36).substring(2, 9)}`,
        name: `Copy of ${target.name}`,
        status: "draft",
        stats: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 },
        logs: [],
        createdAt: now,
        updatedAt: now,
      };

      return {
        campaigns: [duplicated, ...state.campaigns],
      };
    }),

  addMediaAsset: (assetData) =>
    set((state) => {
      const newAsset: MediaAsset = {
        ...assetData,
        id: `ma-${Math.random().toString(36).substring(2, 9)}`,
        uploadedAt: new Date().toISOString().split("T")[0],
      };
      return { mediaAssets: [...state.mediaAssets, newAsset] };
    }),

  deleteMediaAsset: (id) =>
    set((state) => ({
      mediaAssets: state.mediaAssets.filter((ma) => ma.id !== id),
    })),

  addTemplate: (templateData) =>
    set((state) => {
      const newTemplate: CampaignTemplate = {
        ...templateData,
        id: `ct-${Math.random().toString(36).substring(2, 9)}`,
        status: "pending",
      };
      return { templates: [...state.templates, newTemplate] };
    }),
}));
