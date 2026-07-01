import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  SubscriptionPlan,
  CreditWallet,
  UsageMetrics,
  InvoiceItem,
  PaymentMethod,
  CouponCode,
  TaxRate,
  RefundRequest,
  BillingAuditLog
} from "@/types/billing";

interface BillingState {
  activePlan: "Free" | "Starter" | "Pro" | "Business" | "Enterprise";
  activeInterval: "monthly" | "yearly";
  wallet: CreditWallet;
  usage: UsageMetrics;
  invoices: InvoiceItem[];
  paymentMethods: PaymentMethod[];
  coupons: CouponCode[];
  taxes: TaxRate[];
  refundRequests: RefundRequest[];
  auditLogs: BillingAuditLog[];
  autoRenewal: boolean;

  upgradePlan: (planName: "Free" | "Starter" | "Pro" | "Business" | "Enterprise", interval: "monthly" | "yearly") => void;
  addPaymentMethod: (type: "card" | "upi", details: any) => void;
  deletePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  rechargeWallet: (amount: number, category: "ai" | "whatsapp" | "automation") => void;
  applyCoupon: (code: string) => boolean;
  submitRefundRequest: (invoiceId: string, amount: number, reason: string) => void;
  toggleAutoRenewal: () => void;
  addAuditLog: (action: BillingAuditLog["action"], description: string) => void;
}

const initialWallet: CreditWallet = {
  aiCredits: 120000,
  whatsappCredits: 45000,
  automationCredits: 800,
  storageCredits: 50,
  bonusCredits: 5000
};

const initialUsage: UsageMetrics = {
  aiTokensCount: 384020,
  whatsappMessagesSent: 12400,
  workflowRunsCount: 650,
  apiCallsCount: 2840,
  storageUsedBytes: 524288000, // 500 MB
  bandwidthUsedBytes: 1073741824, // 1 GB
  activeUsersCount: 4,
  activeWorkspacesCount: 1
};

const initialInvoices: InvoiceItem[] = [
  { id: "inv-1", invoiceNumber: "INV-2026-001", date: new Date(Date.now() - 3600*1000*24*30).toISOString(), amount: 49.00, currency: "USD", status: "paid", billingPeriodStart: new Date(Date.now() - 3600*1000*24*60).toISOString(), billingPeriodEnd: new Date(Date.now() - 3600*1000*24*30).toISOString(), downloadUrl: "https://expendmore.com/invoices/inv-1.pdf" },
  { id: "inv-2", invoiceNumber: "INV-2026-002", date: new Date().toISOString(), amount: 49.00, currency: "USD", status: "paid", billingPeriodStart: new Date(Date.now() - 3600*1000*24*30).toISOString(), billingPeriodEnd: new Date().toISOString(), downloadUrl: "https://expendmore.com/invoices/inv-2.pdf" }
];

const initialPayments: PaymentMethod[] = [
  { id: "pay-1", type: "card", brand: "Visa", last4: "4242", expMonth: 12, expYear: 2028, isDefault: true }
];

const initialCoupons: CouponCode[] = [
  { code: "SENSY20", discountType: "percentage", value: 20, expirationDate: new Date(Date.now() + 3600*1000*24*30).toISOString(), isActive: true },
  { code: "FLAT10", discountType: "flat", value: 10, expirationDate: new Date(Date.now() + 3600*1000*24*30).toISOString(), isActive: true }
];

const initialTaxes: TaxRate[] = [
  { id: "tax-1", name: "GST (India)", ratePercentage: 18, regionCode: "IN", type: "gst" },
  { id: "tax-2", name: "VAT (EU)", ratePercentage: 20, regionCode: "EU", type: "vat" }
];

const initialAudit: BillingAuditLog[] = [
  { id: "aud-1", timestamp: new Date(Date.now() - 3600*1000*2).toISOString(), action: "subscription_change", operator: "Admin (Priya)", description: "Upgraded workspace subscription plan to Pro Monthly." },
  { id: "aud-2", timestamp: new Date(Date.now() - 3600*1000*12).toISOString(), action: "payment", operator: "System", description: "Successfully charged payment card: Visa ending in 4242." }
];

export const useBilling = create<BillingState>()(
  persist(
    (set, get) => ({
      activePlan: "Pro",
      activeInterval: "monthly",
      wallet: initialWallet,
      usage: initialUsage,
      invoices: initialInvoices,
      paymentMethods: initialPayments,
      coupons: initialCoupons,
      taxes: initialTaxes,
      refundRequests: [],
      auditLogs: initialAudit,
      autoRenewal: true,

      upgradePlan: (planName, interval) => {
        set((state) => {
          const newAudit: BillingAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "subscription_change",
            operator: "Admin (Priya)",
            description: `Upgraded subscription plan to ${planName} ${interval}`
          };

          return {
            activePlan: planName,
            activeInterval: interval,
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      addPaymentMethod: (type, details) => {
        set((state) => {
          const id = `pay-${Date.now()}`;
          const newMethod: PaymentMethod = {
            id,
            type,
            brand: details.brand || "Visa",
            last4: details.last4 || "0000",
            expMonth: details.expMonth || 12,
            expYear: details.expYear || 2030,
            upiId: details.upiId,
            isDefault: state.paymentMethods.length === 0
          };

          const newAudit: BillingAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "payment",
            operator: "Admin (Priya)",
            description: `Added new payment credentials method: ${type === "card" ? "Card ending in " + newMethod.last4 : newMethod.upiId}`
          };

          return {
            paymentMethods: [...state.paymentMethods, newMethod],
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      deletePaymentMethod: (id) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((p) => p.id !== id)
        }));
      },

      setDefaultPaymentMethod: (id) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map((p) => ({
            ...p,
            isDefault: p.id === id
          }))
        }));
      },

      rechargeWallet: (amount, category) => {
        set((state) => {
          const updatedWallet = { ...state.wallet };
          if (category === "ai") updatedWallet.aiCredits += amount;
          else if (category === "whatsapp") updatedWallet.whatsappCredits += amount;
          else updatedWallet.automationCredits += amount;

          const newAudit: BillingAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "payment",
            operator: "Admin (Priya)",
            description: `Recharged credit wallet wallet details category ${category} with ${amount.toLocaleString()} credits`
          };

          return {
            wallet: updatedWallet,
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      applyCoupon: (code) => {
        const c = get().coupons.find((x) => x.code === code && x.isActive);
        if (!c) return false;

        set((state) => {
          const newAudit: BillingAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "coupon",
            operator: "Admin (Priya)",
            description: `Applied promotional code coupon ${code} (Discount: ${c.value}%)`
          };

          return {
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
        return true;
      },

      submitRefundRequest: (invoiceId, amount, reason) => {
        set((state) => {
          const newReq: RefundRequest = {
            id: `ref-${Date.now()}`,
            invoiceId,
            amount,
            reason,
            status: "pending",
            requestedTime: new Date().toISOString()
          };

          const newAudit: BillingAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "refund",
            operator: "Admin (Priya)",
            description: `Submitted refund request for invoice ${invoiceId} ($${amount.toFixed(2)})`
          };

          return {
            refundRequests: [...state.refundRequests, newReq],
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      toggleAutoRenewal: () => {
        set((state) => ({
          autoRenewal: !state.autoRenewal
        }));
      },

      addAuditLog: (action, description) => {
        set((state) => ({
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action,
              operator: "Admin (Priya)",
              description
            },
            ...state.auditLogs
          ]
        }));
      }
    }),
    {
      name: "expendmore-billing-store",
      partialize: (state) => ({
        activePlan: state.activePlan,
        activeInterval: state.activeInterval,
        wallet: state.wallet,
        paymentMethods: state.paymentMethods,
        autoRenewal: state.autoRenewal,
        invoices: state.invoices,
        auditLogs: state.auditLogs
      })
    }
  )
);
