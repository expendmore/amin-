export type NotificationChannel =
  | "email"
  | "whatsapp"
  | "sms"
  | "push"
  | "in_app"
  | "desktop"
  | "webhook"
  | "slack"
  | "discord"
  | "teams";

export type NotificationCategory =
  | "system"
  | "billing"
  | "ai"
  | "whatsapp_activity"
  | "security"
  | "updates"
  | "mentions";

export type DeliveryStatus = "queued" | "sending" | "delivered" | "failed" | "opened" | "clicked" | "draft" | "scheduled";

export interface NotifTemplate {
  id: string;
  name: string;
  subject?: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  category: NotificationCategory;
  variables: string[];
  version: string;
  lastModified: string;
}

export interface NotificationRecord {
  id: string;
  templateId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientId: string;
  channel: NotificationChannel;
  category: NotificationCategory;
  subject?: string;
  title: string;
  message: string;
  status: DeliveryStatus;
  retryCount: number;
  scheduledTime?: string;
  sentTime?: string;
  openedTime?: string;
  clickedTime?: string;
  errorMessage?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerEvent: string;
  conditions: Array<{ field: string; operator: string; value: string }>;
  recipients: string[]; // Segment IDs
  channels: NotificationChannel[];
  priority: "high" | "medium" | "low";
  delayMinutes: number;
  maxRetries: number;
  isActive: boolean;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  userCount: number;
  queryExpression: string; // Dynamic segmentation criteria
}

export interface PreferenceProfile {
  userId: string;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  slackEnabled: boolean;
  digestInterval: "none" | "daily" | "weekly";
  doNotDisturb: boolean;
  dndStart?: string; // "22:00"
  dndEnd?: string;   // "08:00"
  disabledCategories: NotificationCategory[];
}

export interface ActivityTimelineEvent {
  id: string;
  notificationId?: string;
  userId?: string;
  event: string;
  channel?: NotificationChannel;
  status?: DeliveryStatus;
  timestamp: string;
}

export interface NotificationAuditRecord {
  id: string;
  operator: string;
  targetType: "template" | "preference" | "rule" | "bulk_send";
  targetId: string;
  action: string;
  description: string;
  timestamp: string;
}

export interface RetryItem {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  lastAttempt: string;
  retryCount: number;
  errorMessage: string;
}
