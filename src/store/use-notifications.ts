import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  NotifTemplate,
  NotificationRecord,
  AutomationRule,
  AudienceSegment,
  PreferenceProfile,
  ActivityTimelineEvent,
  NotificationAuditRecord,
  RetryItem,
  NotificationChannel,
  NotificationCategory
} from "@/types/notifications";

interface NotificationStoreState {
  templates: NotifTemplate[];
  notifications: NotificationRecord[];
  rules: AutomationRule[];
  segments: AudienceSegment[];
  preferences: PreferenceProfile;
  events: ActivityTimelineEvent[];
  audits: NotificationAuditRecord[];
  retries: RetryItem[];

  addTemplate: (template: Omit<NotifTemplate, "id" | "lastModified" | "version">) => void;
  updateTemplate: (id: string, updates: Partial<NotifTemplate>) => void;
  deleteTemplate: (id: string) => void;
  sendNotification: (record: Omit<NotificationRecord, "id" | "status" | "retryCount" | "sentTime">) => void;
  scheduleNotification: (record: Omit<NotificationRecord, "id" | "status" | "retryCount">, time: string) => void;
  cancelScheduledNotification: (id: string) => void;
  addRule: (rule: Omit<AutomationRule, "id">) => void;
  toggleRule: (id: string) => void;
  updatePreferences: (prefs: Partial<PreferenceProfile>) => void;
  retryFailedNotification: (id: string) => void;
  purgeRetryQueue: () => void;
  addAuditLog: (operator: string, targetType: "template" | "preference" | "rule" | "bulk_send", targetId: string, action: string, description: string) => void;
}

const initialTemplates: NotifTemplate[] = [
  { id: "tmpl-1", name: "WhatsApp Welcome Flow", subject: "Welcome to ExpendMore", title: "Welcome to ExpendMore!", body: "Hi {{name}}, welcome to our platform! Start building your flows in 2 minutes.", channel: "whatsapp", category: "updates", variables: ["name"], version: "1.0", lastModified: new Date().toISOString() },
  { id: "tmpl-2", name: "Billing Balance Low Alert", subject: "ExpendMore Account Credits Low Warning", title: "Action Required: Low Credits Balance", body: "Hello {{name}},\n\nYour account has {{credits}} credits left. Recharge to prevent flows pauses.", channel: "email", category: "billing", variables: ["name", "credits"], version: "1.2", lastModified: new Date().toISOString() }
];

const initialNotifications: NotificationRecord[] = [
  { id: "not-1", templateId: "tmpl-1", recipientId: "u-1", recipientPhone: "+91 99999 88888", channel: "whatsapp", category: "updates", title: "Welcome to ExpendMore!", message: "Hi Aditya, welcome to our platform! Start building your flows in 2 minutes.", status: "delivered", retryCount: 0, sentTime: new Date().toISOString() },
  { id: "not-2", templateId: "tmpl-2", recipientId: "u-1", recipientEmail: "aditya@anshuman.com", channel: "email", category: "billing", title: "Action Required: Low Credits Balance", message: "Hello Aditya,\n\nYour account has 150 credits left. Recharge to prevent flows pauses.", status: "failed", retryCount: 2, errorMessage: "SMTP pool connection timeout" }
];

const initialRules: AutomationRule[] = [
  { id: "rule-1", name: "Stripe Overdue Email Dispatch", triggerEvent: "stripe_payment_failed", conditions: [{ field: "amount", operator: "greater_than", value: "10" }], recipients: ["seg-1"], channels: ["email"], priority: "high", delayMinutes: 5, maxRetries: 3, isActive: true }
];

const initialSegments: AudienceSegment[] = [
  { id: "seg-1", name: "All Enterprise Clients", description: "Dynamic list of enterprise accounts", userCount: 15, queryExpression: "tier == 'ENTERPRISE'" }
];

const initialPrefs: PreferenceProfile = {
  userId: "u-1",
  emailEnabled: true,
  whatsappEnabled: true,
  pushEnabled: true,
  smsEnabled: false,
  slackEnabled: false,
  digestInterval: "none",
  doNotDisturb: false,
  disabledCategories: []
};

const initialEvents: ActivityTimelineEvent[] = [
  { id: "evt-1", notificationId: "not-1", event: "Message delivered successfully", channel: "whatsapp", status: "delivered", timestamp: new Date().toISOString() }
];

const initialAudits: NotificationAuditRecord[] = [
  { id: "aud-1", operator: "Super Admin", targetType: "template", targetId: "tmpl-1", action: "create_template", description: "Created WhatsApp Welcome template", timestamp: new Date().toISOString() }
];

const initialRetries: RetryItem[] = [
  { id: "ret-1", notificationId: "not-2", channel: "email", lastAttempt: new Date().toISOString(), retryCount: 2, errorMessage: "SMTP pool connection timeout" }
];

export const useNotifications = create<NotificationStoreState>()(
  persist(
    (set) => ({
      templates: initialTemplates,
      notifications: initialNotifications,
      rules: initialRules,
      segments: initialSegments,
      preferences: initialPrefs,
      events: initialEvents,
      audits: initialAudits,
      retries: initialRetries,

      addTemplate: (t) => {
        set((state) => {
          const newTmpl: NotifTemplate = {
            ...t,
            id: `tmpl-${Date.now()}`,
            version: "1.0",
            lastModified: new Date().toISOString()
          };
          return {
            templates: [newTmpl, ...state.templates]
          };
        });
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((t) => (t.id === id ? { ...t, ...updates, lastModified: new Date().toISOString() } : t))
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id)
        }));
      },

      sendNotification: (record) => {
        set((state) => {
          const newNot: NotificationRecord = {
            ...record,
            id: `not-${Date.now()}`,
            status: "delivered",
            retryCount: 0,
            sentTime: new Date().toISOString()
          };
          const newEvt: ActivityTimelineEvent = {
            id: `evt-${Date.now()}`,
            notificationId: newNot.id,
            event: "Message dispatched",
            channel: record.channel,
            status: "delivered",
            timestamp: new Date().toISOString()
          };
          return {
            notifications: [newNot, ...state.notifications],
            events: [newEvt, ...state.events]
          };
        });
      },

      scheduleNotification: (record, time) => {
        set((state) => {
          const newNot: NotificationRecord = {
            ...record,
            id: `not-${Date.now()}`,
            status: "scheduled",
            retryCount: 0,
            scheduledTime: time
          };
          return {
            notifications: [newNot, ...state.notifications]
          };
        });
      },

      cancelScheduledNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, status: "draft" } : n))
        }));
      },

      addRule: (rule) => {
        set((state) => ({
          rules: [{ ...rule, id: `rule-${Date.now()}` }, ...state.rules]
        }));
      },

      toggleRule: (id) => {
        set((state) => ({
          rules: state.rules.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
        }));
      },

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs }
        }));
      },

      retryFailedNotification: (id) => {
        set((state) => {
          const updatedNotifs = state.notifications.map((n) => {
            if (n.id === id) {
              return { ...n, status: "delivered" as const, retryCount: n.retryCount + 1, sentTime: new Date().toISOString() };
            }
            return n;
          });
          const newEvt: ActivityTimelineEvent = {
            id: `evt-${Date.now()}`,
            notificationId: id,
            event: "Retry trigger successful",
            status: "delivered",
            timestamp: new Date().toISOString()
          };
          return {
            notifications: updatedNotifs,
            retries: state.retries.filter((r) => r.notificationId !== id),
            events: [newEvt, ...state.events]
          };
        });
      },

      purgeRetryQueue: () => {
        set(() => ({
          retries: []
        }));
      },

      addAuditLog: (operator, targetType, targetId, action, description) => {
        set((state) => ({
          audits: [
            {
              id: `aud-${Date.now()}`,
              operator,
              targetType,
              targetId,
              action,
              description,
              timestamp: new Date().toISOString()
            },
            ...state.audits
          ]
        }));
      }
    }),
    {
      name: "expendmore-notification-store",
      partialize: (state) => ({
        templates: state.templates,
        notifications: state.notifications,
        rules: state.rules,
        preferences: state.preferences,
        audits: state.audits,
        retries: state.retries
      })
    }
  )
);
