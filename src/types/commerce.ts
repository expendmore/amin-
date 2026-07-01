export interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  material?: string;
  price: number; // custom variant pricing if different
  stock: number;
}

export interface InventoryHistoryLog {
  id: string;
  date: string;
  type: "addition" | "reduction" | "adjustment";
  amount: number;
  reason: string;
  user: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description: string;
  shortDescription?: string;
  brand?: string;
  category: string;
  collectionId?: string;
  tags: string[];
  images: string[];
  videos?: string[];
  documents?: string[];
  regularPrice: number;
  salePrice?: number;
  costPrice?: number;
  currency: string;
  taxRate: number; // e.g. 18
  status: "draft" | "published" | "archived" | "out_of_stock";
  stock: number;
  warehouseLocation?: string;
  lowStockAlertThreshold: number;
  variants: ProductVariant[];
  inventoryHistory: InventoryHistoryLog[];
  isWhatsAppSynced: boolean;
  whatsAppSyncStatus: "synced" | "unsynced" | "pending" | "failed";
  whatsAppSyncError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionRule {
  id: string;
  field: "category" | "tag" | "price" | "name" | "brand";
  operator: "equals" | "contains" | "greater_than" | "less_than";
  value: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  type: "manual" | "smart";
  rules: CollectionRule[];
  rulesMatchAll: boolean; // true = AND, false = OR
  image?: string;
  isFeatured: boolean;
  productIds: string[]; // explicit product IDs for manual collection
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderTimelineEvent {
  id: string;
  date: string;
  status: string;
  message: string;
  actor: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  currency: string;
  paymentMethod: "Razorpay" | "Stripe" | "PayPal" | "PhonePe" | "UPI" | "Cash";
  paymentStatus: "paid" | "failed" | "pending" | "refunded";
  shippingMethod: string;
  shippingAddress: string;
  shippingTrackingNumber?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "flat" | "percentage" | "bogo";
  value: number; // discount amount or percentage percentage
  minPurchaseAmount?: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  methods: Array<{
    id: string;
    name: string;
    rate: number;
    minDeliveryDays: number;
    maxDeliveryDays: number;
  }>;
}

export interface CustomerCommerceStats {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  totalReturns: number;
  ltv: number;
}
