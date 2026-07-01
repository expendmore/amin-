export type BillingInterval = "monthly" | "yearly";

export interface SubscriptionPlan {
  id: string;
  name: "Free" | "Starter" | "Pro" | "Business" | "Enterprise";
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  creditsBonus: number;
}

export interface CreditWallet {
  aiCredits: number;
  whatsappCredits: number;
  automationCredits: number;
  storageCredits: number;
  bonusCredits: number;
}

export interface UsageMetrics {
  aiTokensCount: number;
  whatsappMessagesSent: number;
  workflowRunsCount: number;
  apiCallsCount: number;
  storageUsedBytes: number;
  bandwidthUsedBytes: number;
  activeUsersCount: number;
  activeWorkspacesCount: number;
}

export type InvoiceStatus = "paid" | "unpaid" | "void" | "refunded";

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  downloadUrl: string;
}

export type PaymentMethodType = "card" | "upi" | "net_banking" | "wallet";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  brand?: string; // e.g. "Visa", "Mastercard"
  last4?: string;
  expMonth?: number;
  expYear?: number;
  upiId?: string;
  isDefault: boolean;
}

export interface CouponCode {
  code: string;
  discountType: "percentage" | "flat";
  value: number;
  expirationDate: string;
  isActive: boolean;
}

export interface TaxRate {
  id: string;
  name: string;
  ratePercentage: number;
  regionCode: string;
  type: "gst" | "vat" | "sales_tax";
}

export interface RefundRequest {
  id: string;
  invoiceId: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedTime: string;
}

export interface BillingAuditLog {
  id: string;
  timestamp: string;
  action: "subscription_change" | "payment" | "invoice" | "refund" | "coupon";
  operator: string;
  description: string;
}
