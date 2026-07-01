import { create } from "zustand";
import { ScheduleEvent, ScheduleLog, ConflictReport } from "@/types/scheduler";

// Generate relative dates for realistic calendar rendering
const getRelativeDateISO = (daysOffset: number, hoursOffset = 0, minutesOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hoursOffset, minutesOffset, 0, 0);
  return date.toISOString();
};

const INITIAL_EVENTS: ScheduleEvent[] = [
  {
    id: "sch-1",
    title: "Shopify Welcome Promo Broadcast",
    description: "Introductory campaign blast for newly subscribed contacts segment.",
    type: "campaign",
    targetId: "camp-1",
    targetName: "Welcome Promo Pack",
    status: "queued",
    scheduledTime: getRelativeDateISO(1, 10, 0), // Tomorrow 10:00 AM
    timezone: "Asia/Kolkata",
    priority: "high",
    audienceSize: 2450,
    segmentName: "Shopify New Leads",
    recurrenceRule: {
      frequency: "weekly",
      repeatDays: [1, 3, 5], // Mon, Wed, Fri
      skipHolidays: true,
      businessDaysOnly: true,
      weekendsOnly: false
    },
    lastExecuted: null,
    nextExecution: getRelativeDateISO(1, 10, 0),
    failureReason: null,
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: "sch-2",
    title: "Abandoned Cart Recovery Sequence",
    description: "Automation workflow trigger sending WhatsApp alerts to cart abandoners.",
    type: "workflow",
    targetId: "wf-3",
    targetName: "Abandoned Cart Push",
    status: "queued",
    scheduledTime: getRelativeDateISO(2, 14, 30), // In 2 Days 2:30 PM
    timezone: "Asia/Kolkata",
    priority: "critical",
    audienceSize: 850,
    segmentName: "Abandoned Carts 1Hr",
    recurrenceRule: {
      frequency: "daily",
      skipHolidays: false,
      businessDaysOnly: false,
      weekendsOnly: false
    },
    lastExecuted: null,
    nextExecution: getRelativeDateISO(2, 14, 30),
    failureReason: null,
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: "sch-3",
    title: "Midsummer Sale Clearance Campaign",
    description: "Bulk media broadcast code for storewide 30% discount announcement.",
    type: "campaign",
    targetId: "camp-5",
    targetName: "Clearance Promo 30%",
    status: "completed",
    scheduledTime: getRelativeDateISO(-1, 11, 0), // Yesterday 11:00 AM
    timezone: "Asia/Kolkata",
    priority: "high",
    audienceSize: 12500,
    segmentName: "All Opted-In Users",
    lastExecuted: getRelativeDateISO(-1, 11, 0),
    nextExecution: null,
    failureReason: null,
    retryCount: 0,
    maxRetries: 2
  },
  {
    id: "sch-4",
    title: "Auto-Feedback Satisfaction Survey",
    description: "Follow-up question triggers asking resolved tickets ratings.",
    type: "followup",
    targetId: "wf-12",
    targetName: "CSAT Feedbacks",
    status: "queued",
    scheduledTime: getRelativeDateISO(0, 16, 0), // Today 4:00 PM
    timezone: "Asia/Kolkata",
    priority: "medium",
    audienceSize: 120,
    segmentName: "Recently Closed Support",
    lastExecuted: null,
    nextExecution: getRelativeDateISO(0, 16, 0),
    failureReason: null,
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: "sch-5",
    title: "Lead Nurturing Autopilot Cycle",
    description: "AI Agent checking inbound replies and scheduling auto reminders.",
    type: "ai_task",
    targetId: "agent-2",
    targetName: "CRM Assistant Bot",
    status: "paused",
    scheduledTime: getRelativeDateISO(3, 10, 0), // In 3 Days 10:00 AM
    timezone: "Asia/Kolkata",
    priority: "low",
    audienceSize: 450,
    segmentName: "MQL Segments",
    lastExecuted: null,
    nextExecution: null,
    failureReason: null,
    retryCount: 0,
    maxRetries: 5
  },
  {
    id: "sch-6",
    title: "Stripe Payment Invoice Retry Alert",
    description: "System alert notification for failed billing retries.",
    type: "reminder",
    targetId: "sys-99",
    targetName: "Stripe Billing Warnings",
    status: "failed",
    scheduledTime: getRelativeDateISO(-2, 9, 30), // 2 Days Ago 9:30 AM
    timezone: "Asia/Kolkata",
    priority: "high",
    audienceSize: 12,
    segmentName: "Failed Invoices List",
    lastExecuted: getRelativeDateISO(-2, 9, 30),
    nextExecution: null,
    failureReason: "Gateway Timeout: WhatsApp webhook sync failed to deliver template body payloads.",
    retryCount: 2,
    maxRetries: 2
  },
  {
    id: "sch-7",
    title: "Holiday Discount Campaign Burst",
    description: "Bulk overlap testing campaign blast. Overlaps with Shopify Promo tomorrow.",
    type: "campaign",
    targetId: "camp-9",
    targetName: "Holiday Blast Special",
    status: "queued",
    scheduledTime: getRelativeDateISO(1, 10, 30), // Tomorrow 10:30 AM (overlap with Shopify Welcome Promo at 10 AM)
    timezone: "Asia/Kolkata",
    priority: "medium",
    audienceSize: 14500, // Total tomorrow audience: 2450 + 14500 = 16950 (triggers daily WABA threshold check >15k!)
    segmentName: "Premium Tier Segment",
    lastExecuted: null,
    nextExecution: getRelativeDateISO(1, 10, 30),
    failureReason: null,
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: "sch-8",
    title: "Off-Hours Outbound Message Alert",
    description: "Off-hours testing broadcast. Scheduled for tomorrow at 2:00 AM.",
    type: "campaign",
    targetId: "camp-12",
    targetName: "Late Night Burst",
    status: "queued",
    scheduledTime: getRelativeDateISO(1, 2, 0), // Tomorrow 2:00 AM (violates business hours 8 AM - 8 PM)
    timezone: "Asia/Kolkata",
    priority: "low",
    audienceSize: 180,
    segmentName: "Global Insomniacs",
    lastExecuted: null,
    nextExecution: getRelativeDateISO(1, 2, 0),
    failureReason: null,
    retryCount: 0,
    maxRetries: 2
  }
];

const INITIAL_LOGS: ScheduleLog[] = [
  {
    id: "log-1",
    eventId: "sch-3",
    title: "Clearance Promo Dispatch Success",
    type: "delivery",
    status: "success",
    timestamp: getRelativeDateISO(-1, 11, 2),
    message: "Successfully pushed campaign batch to WhatsApp Cloud API.",
    details: "Total queue: 12,500. Delivered: 12,492. Webhook confirms 99.9% dispatch completion logs."
  },
  {
    id: "log-2",
    eventId: "sch-6",
    title: "Stripe Alert Retry Attempt 1 Failed",
    type: "retry",
    status: "warning",
    timestamp: getRelativeDateISO(-2, 9, 32),
    message: "Failed billing alert retry loop 1/2. API gateway returned status 503.",
    details: "Connecting socket timed out. Queue schedule deferred for 15 minutes."
  },
  {
    id: "log-3",
    eventId: "sch-6",
    title: "Stripe Alert Terminal Failure",
    type: "failure",
    status: "error",
    timestamp: getRelativeDateISO(-2, 9, 47),
    message: "Failed billing alert terminal loop 2/2. Exhausted all max retry attempts.",
    details: "Error state synced. Meta billing template not approved for destination phone line."
  }
];

interface SchedulerState {
  events: ScheduleEvent[];
  logs: ScheduleLog[];
  conflicts: ConflictReport[];
  timezone: string;
  searchQuery: string;
  statusFilter: string;

  // Configuration modifiers
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: string) => void;
  setTimezone: (tz: string) => void;

  // CRUD Event operations
  addEvent: (event: Omit<ScheduleEvent, "id" | "status" | "retryCount" | "lastExecuted" | "nextExecution" | "failureReason">) => void;
  updateEvent: (id: string, updates: Partial<ScheduleEvent>) => void;
  deleteEvent: (id: string) => void;
  pauseEvent: (id: string) => void;
  resumeEvent: (id: string) => void;
  retryEvent: (id: string) => void;

  // Bulk Actions
  bulkCancel: (ids: string[]) => void;
  bulkPause: (ids: string[]) => void;
  bulkResume: (ids: string[]) => void;

  // Calculation & Utilities
  detectConflicts: () => void;
  importEvents: (eventsJson: string) => boolean;
  exportEvents: () => string;
}

export const useScheduler = create<SchedulerState>((set, get) => ({
  events: INITIAL_EVENTS,
  logs: INITIAL_LOGS,
  conflicts: [],
  timezone: "Asia/Kolkata",
  searchQuery: "",
  statusFilter: "all",

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setTimezone: (tz) => {
    set({ timezone: tz });
    get().detectConflicts();
  },

  addEvent: (eventData) => {
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: `sch-${Date.now()}`,
      status: "queued",
      retryCount: 0,
      lastExecuted: null,
      nextExecution: eventData.scheduledTime,
      failureReason: null
    };

    set((state) => ({
      events: [...state.events, newEvent],
      logs: [
        {
          id: `log-${Date.now()}`,
          eventId: newEvent.id,
          title: "Schedule Created",
          type: "execution",
          status: "success",
          timestamp: new Date().toISOString(),
          message: `Task '${newEvent.title}' has been queued for execution.`,
          details: `Target: ${newEvent.targetName}. Scheduled at: ${newEvent.scheduledTime} in ${newEvent.timezone}.`
        },
        ...state.logs
      ]
    }));

    get().detectConflicts();
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      logs: [
        {
          id: `log-${Date.now()}`,
          eventId: id,
          title: "Schedule Updated",
          type: "execution",
          status: "success",
          timestamp: new Date().toISOString(),
          message: `Schedule event variables modified.`,
          details: JSON.stringify(updates)
        },
        ...state.logs
      ]
    }));

    get().detectConflicts();
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
      logs: state.logs.filter((log) => log.eventId !== id)
    }));

    get().detectConflicts();
  },

  pauseEvent: (id) => {
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, status: "paused" } : e)),
      logs: [
        {
          id: `log-${Date.now()}`,
          eventId: id,
          title: "Execution Paused",
          type: "execution",
          status: "warning",
          timestamp: new Date().toISOString(),
          message: "Schedule task execution paused manually.",
          details: "Event will remain in queue but won't trigger until resumed."
        },
        ...state.logs
      ]
    }));

    get().detectConflicts();
  },

  resumeEvent: (id) => {
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, status: "queued" } : e)),
      logs: [
        {
          id: `log-${Date.now()}`,
          eventId: id,
          title: "Execution Resumed",
          type: "execution",
          status: "success",
          timestamp: new Date().toISOString(),
          message: "Schedule task active again in queue.",
          details: "Scheduled to fire at next execution timestamp."
        },
        ...state.logs
      ]
    }));

    get().detectConflicts();
  },

  retryEvent: (id) => {
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id
          ? {
              ...e,
              status: "queued",
              retryCount: e.retryCount + 1,
              failureReason: null
            }
          : e
      ),
      logs: [
        {
          id: `log-${Date.now()}`,
          eventId: id,
          title: "Retry Triggered",
          type: "retry",
          status: "success",
          timestamp: new Date().toISOString(),
          message: "Manual queue retry initiated.",
          details: "Deferring state cleared. Sending webhook payload back to active queue."
        },
        ...state.logs
      ]
    }));

    get().detectConflicts();
  },

  bulkCancel: (ids) => {
    set((state) => ({
      events: state.events.map((e) => (ids.includes(e.id) ? { ...e, status: "cancelled" } : e))
    }));
    get().detectConflicts();
  },

  bulkPause: (ids) => {
    set((state) => ({
      events: state.events.map((e) => (ids.includes(e.id) ? { ...e, status: "paused" } : e))
    }));
    get().detectConflicts();
  },

  bulkResume: (ids) => {
    set((state) => ({
      events: state.events.map((e) => (ids.includes(e.id) ? { ...e, status: "queued" } : e))
    }));
    get().detectConflicts();
  },

  detectConflicts: () => {
    const events = get().events.filter((e) => e.status === "queued" || e.status === "processing");
    const reports: ConflictReport[] = [];

    // 1. Check for overlapping campaigns (within 1 hour / 3600000ms range)
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const timeA = new Date(events[i].scheduledTime).getTime();
        const timeB = new Date(events[j].scheduledTime).getTime();
        const difference = Math.abs(timeA - timeB);

        // If they are campaigns and overlap within 1 hour, trigger warning
        if (
          events[i].type === "campaign" &&
          events[j].type === "campaign" &&
          difference < 60 * 60 * 1000
        ) {
          reports.push({
            id: `conf-overlap-${i}-${j}`,
            type: "overlap",
            severity: "warning",
            title: "Overlapping Campaign Broadcasts",
            description: `'${events[i].title}' and '${events[j].title}' are scheduled within 1 hour of each other, which may clutter recipients' feeds.`,
            affectedEventIds: [events[i].id, events[j].id]
          });
        }
      }
    }

    // 2. Check for daily rate limit thresholds (limit: 15,000 messages total per day)
    const dateCounts: Record<string, { total: number; ids: string[] }> = {};
    events.forEach((e) => {
      const dateStr = new Date(e.scheduledTime).toDateString();
      if (!dateCounts[dateStr]) {
        dateCounts[dateStr] = { total: 0, ids: [] };
      }
      dateCounts[dateStr].total += e.audienceSize;
      dateCounts[dateStr].ids.push(e.id);
    });

    Object.entries(dateCounts).forEach(([dateStr, data]) => {
      if (data.total > 15000) {
        reports.push({
          id: `conf-rate-${dateStr}`,
          type: "rate_limit",
          severity: "critical",
          title: "Daily Rate Limit Warning Threshold",
          description: `Total estimated audience size on ${dateStr} is ${data.total} contacts, which exceeds your WABA tier daily send limit of 15,000 messages.`,
          affectedEventIds: data.ids
        });
      }
    });

    // 3. Check for business hours violation (allowed: 8:00 AM to 8:00 PM)
    events.forEach((e) => {
      const date = new Date(e.scheduledTime);
      const hour = date.getHours(); // Local hour of schedule
      if (hour < 8 || hour >= 20) {
        reports.push({
          id: `conf-hours-${e.id}`,
          type: "business_hours",
          severity: "warning",
          title: "Non-Business Hours Message Schedule",
          description: `Event '${e.title}' is scheduled at ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}, which is outside standard business hours (8:00 AM - 8:00 PM) and may lower read-rate engagement.`,
          affectedEventIds: [e.id]
        });
      }
    });

    set({ conflicts: reports });
  },

  importEvents: (eventsJson) => {
    try {
      const parsed = JSON.parse(eventsJson);
      if (Array.isArray(parsed)) {
        // Validate keys briefly
        const validated = parsed.filter(
          (e) => e && typeof e === "object" && "title" in e && "scheduledTime" in e && "type" in e
        ) as ScheduleEvent[];

        if (validated.length > 0) {
          set((state) => ({
            events: [
              ...state.events,
              ...validated.map((v) => ({
                ...v,
                id: v.id || `sch-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                status: v.status || "queued",
                retryCount: v.retryCount || 0,
                lastExecuted: v.lastExecuted || null,
                nextExecution: v.nextExecution || v.scheduledTime,
                failureReason: v.failureReason || null
              }))
            ]
          }));
          get().detectConflicts();
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  exportEvents: () => {
    const state = get();
    return JSON.stringify(state.events, null, 2);
  }
}));
