export interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  type: "campaign" | "workflow" | "ai_task" | "reply" | "followup" | "reminder";
  targetId: string; // references campaign ID, workflow ID, etc.
  targetName: string;
  status: "queued" | "processing" | "paused" | "completed" | "failed" | "cancelled";
  scheduledTime: string; // ISO 8601 string
  timezone: string; // e.g. "Asia/Kolkata" or "UTC"
  priority: "low" | "medium" | "high" | "critical";
  audienceSize: number;
  segmentName: string;
  recurrenceRule?: {
    frequency: "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom_cron";
    cronExpression?: string;
    repeatDays?: number[]; // 0-6 for Sun-Sat
    skipHolidays: boolean;
    businessDaysOnly: boolean;
    weekendsOnly: boolean;
  };
  lastExecuted: string | null;
  nextExecution: string | null;
  failureReason: string | null;
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, any>;
}

export interface ScheduleLog {
  id: string;
  eventId: string;
  title: string;
  type: "execution" | "delivery" | "retry" | "failure";
  status: "success" | "warning" | "error";
  timestamp: string;
  message: string;
  details: string;
}

export interface ConflictReport {
  id: string;
  type: "overlap" | "rate_limit" | "business_hours" | "timezone";
  severity: "warning" | "critical";
  title: string;
  description: string;
  affectedEventIds: string[];
}
