import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MarketplaceItem,
  CreatorStats,
  LicenseCode,
  ReviewItem,
  VersionRevision,
  ModerationRecord,
  PurchaseRecord
} from "@/types/marketplace";

interface MarketplaceState {
  items: MarketplaceItem[];
  creatorStats: CreatorStats;
  licenses: LicenseCode[];
  purchases: PurchaseRecord[];
  moderationRecords: ModerationRecord[];
  reviews: Record<string, ReviewItem[]>;

  installItem: (id: string) => void;
  uninstallItem: (id: string) => void;
  purchaseItem: (id: string) => void;
  toggleFavoriteItem: (id: string) => void;
  toggleWishlistItem: (id: string) => void;
  addReview: (itemId: string, rating: number, text: string) => void;
  publishItem: (name: string, description: string, category: any, pricingType: "free" | "premium", price: number) => void;
  rollbackVersion: (itemId: string, version: string) => void;
  moderateRecord: (id: string, action: "approved" | "rejected") => void;
}

const initialItems: MarketplaceItem[] = [
  {
    id: "item-1",
    name: "Lead Generation WhatsApp Router",
    description: "Multi-model routing agent directing inbound leads inquiries with sub-second lag",
    detailedDescription: "High-performance template combining WhatsApp messages triggers, Google sheets mapping connectors, and Anthropic Claude prompt nodes config options.",
    category: "workflows",
    publisher: "ExpendMore Official",
    pricingType: "free",
    price: 0,
    rating: 4.8,
    downloadsCount: 1240,
    screenshots: [],
    versions: [
      { id: "v-1", version: "v1.0", date: new Date().toISOString(), releaseNotes: "Initial publication release" },
      { id: "v-2", version: "v1.1", date: new Date(Date.now() - 3600*1000*24).toISOString(), releaseNotes: "Added failover logs checks updates" }
    ],
    licenseType: "lifetime",
    isInstalled: true,
    isPurchased: true,
    isFavorite: true,
    isWishlist: false
  },
  {
    id: "item-2",
    name: "E-Commerce Cart Recovery Agent",
    description: "Trigger broadcast sequences when Shopify carts remain unchecked for 2 hours",
    detailedDescription: "Send customizable recovery links. Leverages Stripe/PhonePe templates layout hooks.",
    category: "agents",
    publisher: "Acme Integrators",
    pricingType: "premium",
    price: 29.00,
    rating: 4.5,
    downloadsCount: 380,
    screenshots: [],
    versions: [
      { id: "v-3", version: "v1.0", date: new Date(Date.now() - 3600*1000*24*10).toISOString(), releaseNotes: "Initial launch" }
    ],
    licenseType: "business",
    isInstalled: false,
    isPurchased: false,
    isFavorite: false,
    isWishlist: true
  }
];

const initialStats: CreatorStats = {
  publishedCount: 1,
  totalRevenue: 240.00,
  totalDownloads: 145,
  averageRating: 4.6,
  activeFollowers: 32
};

const initialLicenses: LicenseCode[] = [
  { key: "LIC-1234-ABCD-99", itemId: "item-2", type: "business", seatLimit: 5, seatUsed: 2, status: "active" }
];

const initialPurchases: PurchaseRecord[] = [
  { id: "pur-1", itemId: "item-2", date: new Date(Date.now() - 3600*1000*24*30).toISOString(), amount: 29.00, invoiceUrl: "https://expendmore.ai/purchases/pur-1.pdf" }
];

const initialModeration: ModerationRecord[] = [
  { id: "mod-1", itemName: "Offensive SPAM Auto-Dialer Template", status: "pending", reportsCount: 4, timestamp: new Date().toISOString() }
];

const initialReviews: Record<string, ReviewItem[]> = {
  "item-1": [
    { id: "rev-1", author: "Dev (John)", rating: 5, text: "Excellent routing agent. Saved us hours of custom webhook configurations.", date: new Date().toISOString(), helpfulVotes: 4 }
  ]
};

export const useMarketplace = create<MarketplaceState>()(
  persist(
    (set) => ({
      items: initialItems,
      creatorStats: initialStats,
      licenses: initialLicenses,
      purchases: initialPurchases,
      moderationRecords: initialModeration,
      reviews: initialReviews,

      installItem: (id) => {
        set((state) => ({
          items: state.items.map((it) => (it.id === id ? { ...it, isInstalled: true } : it))
        }));
      },

      uninstallItem: (id) => {
        set((state) => ({
          items: state.items.map((it) => (it.id === id ? { ...it, isInstalled: false } : it))
        }));
      },

      purchaseItem: (id) => {
        set((state) => {
          const item = state.items.find((x) => x.id === id);
          if (!item) return {};

          const newPurchase: PurchaseRecord = {
            id: `pur-${Date.now()}`,
            itemId: id,
            date: new Date().toISOString(),
            amount: item.price,
            invoiceUrl: `https://expendmore.ai/purchases/pur-${Date.now()}.pdf`
          };

          return {
            purchases: [...state.purchases, newPurchase],
            items: state.items.map((it) => (it.id === id ? { ...it, isPurchased: true } : it))
          };
        });
      },

      toggleFavoriteItem: (id) => {
        set((state) => ({
          items: state.items.map((it) => (it.id === id ? { ...it, isFavorite: !it.isFavorite } : it))
        }));
      },

      toggleWishlistItem: (id) => {
        set((state) => ({
          items: state.items.map((it) => (it.id === id ? { ...it, isWishlist: !it.isWishlist } : it))
        }));
      },

      addReview: (itemId, rating, text) => {
        set((state) => {
          const existing = state.reviews[itemId] || [];
          const newRev: ReviewItem = {
            id: `rev-${Date.now()}`,
            author: "Operator (Aditya)",
            rating,
            text,
            date: new Date().toISOString(),
            helpfulVotes: 0
          };

          return {
            reviews: {
              ...state.reviews,
              [itemId]: [newRev, ...existing]
            }
          };
        });
      },

      publishItem: (name, description, category, pricingType, price) => {
        set((state) => {
          const id = `item-${Date.now()}`;
          const newItem: MarketplaceItem = {
            id,
            name,
            description,
            category,
            publisher: "Operator (Aditya)",
            pricingType,
            price,
            rating: 5.0,
            downloadsCount: 0,
            screenshots: [],
            versions: [{ id: `v-${Date.now()}`, version: "v1.0", date: new Date().toISOString(), releaseNotes: "Initial publication version" }],
            licenseType: pricingType === "free" ? "lifetime" : "personal",
            isInstalled: false,
            isPurchased: pricingType === "free",
            isFavorite: false,
            isWishlist: false
          };

          return {
            items: [...state.items, newItem],
            creatorStats: {
              ...state.creatorStats,
              publishedCount: state.creatorStats.publishedCount + 1
            }
          };
        });
      },

      rollbackVersion: (itemId, version) => {
        // Rollback triggers success audit logs in real apps
      },

      moderateRecord: (id, action) => {
        set((state) => ({
          moderationRecords: state.moderationRecords.map((m) =>
            m.id === id ? { ...m, status: action } : m
          )
        }));
      }
    }),
    {
      name: "expendmore-marketplace-store",
      partialize: (state) => ({
        items: state.items,
        purchases: state.purchases,
        moderationRecords: state.moderationRecords,
        reviews: state.reviews,
        licenses: state.licenses
      })
    }
  )
);
