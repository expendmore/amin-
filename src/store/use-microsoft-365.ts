import { create } from "zustand";
import {
  MicrosoftAccount,
  MSOAuthToken,
  OutlookMessage,
  OutlookDraft,
  OutlookTemplate,
  OutlookFolder,
  MSCalendarEvent,
  MSCalendar,
  OneDriveItem,
  ExcelWorkbook,
  WordDocument,
  TeamsChannel,
  TeamsChat,
  TeamsMessage,
  TeamsMember,
  SharePointSite,
  SharePointLibrary,
  PowerBIDashboard,
  PowerBIReport,
  PowerBIDataset,
  MicrosoftToDoTask,
  MicrosoftSyncLog,
  MicrosoftSyncJob,
  MicrosoftAPIUsage,
  MicrosoftServiceId,
  MSLogType,
  MSConnectionStatus
} from "@/types/microsoft-365";

// Helper to get formatted timestamps relative to current time
const getPastDateString = (offsetDays: number = 0, hour: number = 12, min: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

const getFutureDateString = (offsetDays: number = 0, hour: number = 12, min: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

// ─── INITIAL MOCK DATA ──────────────────────────────────────────────

const INITIAL_ACCOUNTS: MicrosoftAccount[] = [
  {
    id: "ms-acc-1",
    email: "anshuman@anshumanenterprises1119.onmicrosoft.com",
    displayName: "Anshuman Enterprises Active Tenant",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop",
    tenantId: "tnt-88234-microsoft-92b",
    tenantName: "Anshuman Enterprises LLC",
    isPrimary: true,
    isActive: true,
    connectedAt: getPastDateString(25),
    lastSyncedAt: getPastDateString(0, 10, 20),
    status: "connected",
    storageUsedGB: 412.5,
    storageTotalGB: 1024.0,
    healthScore: 99,
    enabledServices: ["outlook", "calendar", "onedrive", "excel", "word", "teams", "sharepoint", "powerbi", "todo"]
  },
  {
    id: "ms-acc-2",
    email: "rohan@stitchdesignhub.onmicrosoft.com",
    displayName: "Stitch Design Partner Workspace",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop",
    tenantId: "tnt-19028-design-88x",
    tenantName: "Stitch Design Hub Ltd",
    isPrimary: false,
    isActive: false,
    connectedAt: getPastDateString(10),
    lastSyncedAt: getPastDateString(1, 8, 30),
    status: "expired",
    storageUsedGB: 18.2,
    storageTotalGB: 512.0,
    healthScore: 70,
    enabledServices: ["outlook", "calendar", "onedrive", "teams"]
  },
  {
    id: "ms-acc-3",
    email: "dev@expendmore.onmicrosoft.com",
    displayName: "ExpendMore Testing Sandbox space",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop",
    tenantId: "tnt-44182-expendmore-01c",
    tenantName: "ExpendMore Dev Sandbox",
    isPrimary: false,
    isActive: false,
    connectedAt: getPastDateString(4),
    lastSyncedAt: getPastDateString(0, 9, 0),
    status: "permission_error",
    storageUsedGB: 2.4,
    storageTotalGB: 250.0,
    healthScore: 35,
    enabledServices: ["outlook", "onedrive", "excel", "powerbi"]
  }
];

const INITIAL_TOKENS: MSOAuthToken[] = [
  {
    id: "ms-tok-1",
    accountId: "ms-acc-1",
    service: "outlook",
    status: "valid",
    scopes: ["https://graph.microsoft.com/Mail.ReadWrite", "https://graph.microsoft.com/Calendars.ReadWrite", "https://graph.microsoft.com/Files.ReadWriteAll"],
    issuedAt: getPastDateString(25),
    expiresAt: getFutureDateString(35),
    refreshToken: "MCG_ms_refresh_token_90184bka...",
    accessToken: "MCG_ms_access_token_88921bka..."
  }
];

const INITIAL_OUTLOOK_MESSAGES: Record<string, OutlookMessage[]> = {
  "ms-acc-1": [
    {
      id: "out-msg-1",
      conversationId: "conv-1",
      fromName: "Microsoft 365 Security",
      fromEmail: "security-noreply@microsoft.com",
      to: ["anshuman@anshumanenterprises1119.onmicrosoft.com"],
      subject: "Microsoft Entra ID: ExpendMore application granted permissions",
      bodyPreview: "ExpendMore has been authorized to access your Microsoft 365 tenant. Authorized Scopes: Mail.Send, Calendars.ReadWrite, Files...",
      bodyContent: "Hello Anshuman,\n\nWe detected a new OAuth 2.0 grant signature configured for your enterprise subscription.\n\nApplication name: ExpendMore Integration Suite\nGranted permissions:\n- Mail.Send (Allow auto-responses for checkout messages)\n- Calendars.ReadWrite (Manage Outlook meeting invites)\n- Files.ReadWrite (Save billing logs into OneDrive folders)\n\nIf you did not authorize this, please manage permissions in the Microsoft 365 Admin Center immediately.\n\nBest,\nMicrosoft Security Team",
      folder: "Inbox",
      isRead: false,
      isStarred: true,
      hasAttachments: false,
      receivedDateTime: getPastDateString(0, 10, 10)
    },
    {
      id: "out-msg-2",
      conversationId: "conv-2",
      fromName: "Rohan Gupta (Design Partner)",
      fromEmail: "rohan@stitchdesignhub.onmicrosoft.com",
      to: ["anshuman@anshumanenterprises1119.onmicrosoft.com"],
      subject: "Feedback on Word templates & checkout pipeline details",
      bodyPreview: "Hi Anshuman, I uploaded the design system specifications directly to our shared SharePoint Document library. Can you check...",
      bodyContent: "Hi Anshuman,\n\nI have uploaded the layout outlines as well as the PDF and Word templates directly to our shared Teams folder. Please check if the typography grid aligns correctly with our Tailwind code overrides.\n\nBest regards,\nRohan Gupta",
      folder: "Inbox",
      isRead: true,
      isStarred: false,
      hasAttachments: true,
      receivedDateTime: getPastDateString(0, 8, 20)
    },
    {
      id: "out-msg-3",
      conversationId: "conv-3",
      fromName: "ExpendMore Azure Sync Daemon",
      fromEmail: "azure-sync@expendmore.ai",
      to: ["anshuman@anshumanenterprises1119.onmicrosoft.com"],
      subject: "Microsoft 365 Daily Sync completed successfully",
      bodyPreview: "Outlook: 24 new messages indexed. Calendar: Scheduled 8 upcoming Teams meetings. Excel: Appended checkout rows...",
      bodyContent: "ExpendMore Automation Sync Report (Microsoft 365)\n----------------------------------------\nTimestamp: 2026-06-27 05:00 UTC\nOneDrive Status: Operational (synced 18 files)\nPower BI Status: Refreshed 3 sales datasets\nTeams notifications: Hook successfully routed to WhatsApp Live Inbox.",
      folder: "Inbox",
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      receivedDateTime: getPastDateString(0, 5, 0)
    }
  ],
  "ms-acc-2": []
};

const INITIAL_OUTLOOK_DRAFTS: Record<string, OutlookDraft[]> = {
  "ms-acc-1": [
    {
      id: "out-dr-1",
      to: "partner-relations@stitchdesignhub.com",
      subject: "Stitch Design Guidelines Integration check",
      body: "Hi team,\n\nWe verified the color palette tokens (#FCF8FA background, #25D366 WhatsApp Green primary actions). Everything renders cleanly in our Next.js dashboard workspace.\n\nRegards,\nAnshuman",
      lastModifiedDateTime: getPastDateString(0, 9, 30)
    }
  ]
};

const INITIAL_OUTLOOK_TEMPLATES: OutlookTemplate[] = [
  {
    id: "otpl-1",
    name: "Enterprise Client Pitch",
    subject: "Confirmed: ExpendMore & Microsoft 365 Suite Consultation",
    body: "Hi {{contact.first_name}},\n\nYour meeting has been scheduled via Microsoft Teams. Here is the link:\n{{event.teams_url}}\n\nWe will outline details regarding automated invoicing, Excel spreadsheet imports, and OneDrive backup pathways.\n\nRegards,\nTeam ExpendMore",
    category: "Sales"
  }
];

const INITIAL_OUTLOOK_FOLDERS: OutlookFolder[] = [
  { id: "fld-inbox", name: "Inbox", unreadCount: 1, totalCount: 3 },
  { id: "fld-sent", name: "Sent Items", unreadCount: 0, totalCount: 12 },
  { id: "fld-drafts", name: "Drafts", unreadCount: 1, totalCount: 1 },
  { id: "fld-archive", name: "Archive", unreadCount: 0, totalCount: 45 }
];

const INITIAL_CALENDAR_EVENTS: Record<string, MSCalendarEvent[]> = {
  "ms-acc-1": [
    {
      id: "ms-ev-1",
      subject: "ExpendMore + Microsoft 365 Architecture Alignment",
      bodyPreview: "Discuss Outlook sync timings, Excel Online row appenders, and Power BI telemetry embeds.",
      start: getPastDateString(0, 11, 0),
      end: getPastDateString(0, 12, 0),
      location: "Microsoft Teams Conference Room 1",
      attendees: ["anshuman@anshumanenterprises1119.onmicrosoft.com", "rohan@stitchdesignhub.onmicrosoft.com"],
      organizer: "anshuman@anshumanenterprises1119.onmicrosoft.com",
      status: "confirmed",
      isAllDay: false,
      isRecurring: false,
      color: "#0078D4", // Microsoft Brand Blue
      calendarId: "ms-cal-primary",
      teamsMeetingUrl: "https://teams.microsoft.com/l/meetup-join/1234abcd"
    },
    {
      id: "ms-ev-2",
      subject: "Weekly Teams Developer Sync",
      bodyPreview: "Review webhook alerts latency and duplicate contacts detection algorithms.",
      start: getPastDateString(0, 9, 30),
      end: getPastDateString(0, 10, 0),
      location: "Online Teams Conference",
      attendees: ["anshuman@anshumanenterprises1119.onmicrosoft.com", "dev-team@expendmore.onmicrosoft.com"],
      organizer: "anshuman@anshumanenterprises1119.onmicrosoft.com",
      status: "confirmed",
      isAllDay: false,
      isRecurring: true,
      color: "#5B5FC7", // Teams Purple
      calendarId: "ms-cal-primary",
      teamsMeetingUrl: "https://teams.microsoft.com/l/meetup-join/xyzqprs"
    },
    {
      id: "ms-ev-3",
      subject: "Stitch Brand Identity Board Sync",
      bodyPreview: "Final approval of design system tokens inside Excel LTV sheets.",
      start: getFutureDateString(1, 10, 0),
      end: getFutureDateString(1, 11, 30),
      location: "Stitch Design Board Room",
      attendees: ["anshuman@anshumanenterprises1119.onmicrosoft.com", "board@stitchdesignhub.onmicrosoft.com"],
      organizer: "board@stitchdesignhub.onmicrosoft.com",
      status: "tentative",
      isAllDay: false,
      isRecurring: false,
      color: "#107C41", // Excel Green
      calendarId: "ms-cal-primary",
      teamsMeetingUrl: "https://teams.microsoft.com/l/meetup-join/board901"
    }
  ],
  "ms-acc-2": []
};

const INITIAL_CALENDARS: MSCalendar[] = [
  { id: "ms-cal-primary", name: "Anshuman Enterprises Calendar", color: "#0078D4", isDefault: true, timezone: "Asia/Kolkata" },
  { id: "ms-cal-personal", name: "Personal Calendar", color: "#EC4899", isDefault: false, timezone: "Asia/Kolkata" }
];

const INITIAL_ONEDRIVE_ITEMS: Record<string, OneDriveItem[]> = {
  "ms-acc-1": [
    {
      id: "od-file-1",
      name: "Corporate SLA Template.docx",
      type: "file",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: "240 KB",
      sizeBytes: 245760,
      parentFolderId: "od-fld-1",
      createdDateTime: getPastDateString(15),
      lastModifiedDateTime: getPastDateString(1, 10, 0),
      createdBy: "anshuman@anshumanenterprises1119.onmicrosoft.com",
      isShared: true,
      sharedWithEmails: ["rohan@stitchdesignhub.onmicrosoft.com"],
      webUrl: "https://onedrive.live.com/edit.aspx?id=1",
      starred: true
    },
    {
      id: "od-file-2",
      name: "WhatsApp Campaign Conversions Funnel.xlsx",
      type: "file",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: "1.2 MB",
      sizeBytes: 1258291,
      parentFolderId: "od-fld-2",
      createdDateTime: getPastDateString(10),
      lastModifiedDateTime: getPastDateString(0, 10, 20),
      createdBy: "anshuman@anshumanenterprises1119.onmicrosoft.com",
      isShared: false,
      sharedWithEmails: [],
      webUrl: "https://onedrive.live.com/edit.aspx?id=2",
      starred: true
    },
    {
      id: "od-file-3",
      name: "Product Design Overview.pptx",
      type: "file",
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      size: "4.8 MB",
      sizeBytes: 5033164,
      parentFolderId: null,
      createdDateTime: getPastDateString(20),
      lastModifiedDateTime: getPastDateString(5, 14, 0),
      createdBy: "rohan@stitchdesignhub.onmicrosoft.com",
      isShared: true,
      sharedWithEmails: ["anshuman@anshumanenterprises1119.onmicrosoft.com"],
      webUrl: "https://onedrive.live.com/edit.aspx?id=3",
      starred: false
    }
  ],
  "ms-acc-2": []
};

const INITIAL_ONEDRIVE_FOLDERS: Record<string, OneDriveItem[]> = {
  "ms-acc-1": [
    {
      id: "od-fld-1",
      name: "Enterprise SLA Legal Documents",
      type: "folder",
      parentFolderId: null,
      size: "3 items",
      sizeBytes: 0,
      createdDateTime: getPastDateString(22),
      lastModifiedDateTime: getPastDateString(2, 10, 0),
      createdBy: "anshuman@anshumanenterprises1119.onmicrosoft.com",
      isShared: true,
      sharedWithEmails: ["legal@anshumanenterprises1119.onmicrosoft.com"],
      webUrl: "https://onedrive.live.com/folder?id=1",
      starred: false
    },
    {
      id: "od-fld-2",
      name: "ExpendMore Campaign Analytics",
      type: "folder",
      parentFolderId: null,
      size: "8 items",
      sizeBytes: 0,
      createdDateTime: getPastDateString(12),
      lastModifiedDateTime: getPastDateString(0, 10, 20),
      createdBy: "anshuman@anshumanenterprises1119.onmicrosoft.com",
      isShared: false,
      sharedWithEmails: [],
      webUrl: "https://onedrive.live.com/folder?id=2",
      starred: false
    }
  ],
  "ms-acc-2": []
};

const INITIAL_EXCEL_WORKBOOKS: ExcelWorkbook[] = [
  {
    id: "od-file-2",
    name: "WhatsApp Campaign Conversions Funnel",
    webUrl: "https://onedrive.live.com/edit.aspx?id=2",
    lastModifiedBy: "anshuman@anshumanenterprises1119.onmicrosoft.com",
    lastModifiedDateTime: getPastDateString(0, 10, 20),
    worksheets: [
      { id: "ws-1", name: "Checkout Transactions Log", rowCount: 4, columnCount: 5 },
      { id: "ws-2", name: "Client Lead Pipeline", rowCount: 3, columnCount: 4 }
    ],
    rowData: {
      "ws-1": [
        ["Checkout ID", "Client Name", "WhatsApp Registered", "LTV Amount ($)", "Checkout Status"],
        ["CHK-90182", "Elena Rostova", "+44 20 7946 0958", "650.00", "SUCCESS"],
        ["CHK-41829", "Amelia Stone", "+1 (202) 555-0143", "4,500.00", "SUCCESS"],
        ["CHK-31092", "Kabir Dev", "+91 98765 43210", "1,200.00", "PENDING"]
      ],
      "ws-2": [
        ["Contact Name", "Company Name", "Source", "Expected Annual Revenue ($)"],
        ["Amelia Stone", "Stone Enterprises Ltd", "WhatsApp Campaign", "12,000.00"],
        ["Kabir Dev", "GrowthTech Solutions", "API Referral", "8,500.00"]
      ]
    }
  }
];

const INITIAL_WORD_DOCS: WordDocument[] = [
  {
    id: "od-file-1",
    title: "Corporate SLA Template",
    webUrl: "https://onedrive.live.com/edit.aspx?id=1",
    lastModifiedBy: "rohan@stitchdesignhub.onmicrosoft.com",
    lastModifiedDateTime: getPastDateString(1, 10, 0),
    wordCount: 2450,
    templateCategory: "Legal"
  },
  {
    id: "wdoc-2",
    title: "ExpendMore Integration Blueprint - June 2026",
    webUrl: "https://onedrive.live.com/edit.aspx?id=blueprint",
    lastModifiedBy: "anshuman@anshumanenterprises1119.onmicrosoft.com",
    lastModifiedDateTime: getPastDateString(2, 14, 0),
    wordCount: 6890,
    templateCategory: "Engineering"
  }
];

const INITIAL_TEAMS_CHATS: TeamsChat[] = [
  { id: "ch-1", topic: "ExpendMore Launch Coordination", chatType: "group", lastMessagePreview: "Ensure webhook retry handlers execute correctly.", lastModifiedDateTime: getPastDateString(0, 9, 30) },
  { id: "ch-2", topic: "Stitch Design Assets Check", chatType: "oneOnOne", lastMessagePreview: "Perfect. Borders use the 1px #E2E8F0 token.", lastModifiedDateTime: getPastDateString(1, 15, 20) }
];

const INITIAL_TEAMS_MESSAGES: Record<string, TeamsMessage[]> = {
  "ch-1": [
    { id: "tm-1", chatIdOrChannelId: "ch-1", fromName: "Anshuman Enterprises LLC", fromEmail: "anshuman@anshumanenterprises1119.onmicrosoft.com", bodyContent: "Hi team, let's verify if the WhatsApp live-chat webhook triggers Slack or Teams channels properly.", createdDateTime: getPastDateString(0, 9, 20) },
    { id: "tm-2", chatIdOrChannelId: "ch-1", fromName: "Priya Sharma (Ops)", fromEmail: "priya@anshumanenterprises1119.onmicrosoft.com", bodyContent: "Testing sandbox connections. The API latency check is returning 92ms handshakes.", createdDateTime: getPastDateString(0, 9, 25) },
    { id: "tm-3", chatIdOrChannelId: "ch-1", fromName: "Anshuman Enterprises LLC", fromEmail: "anshuman@anshumanenterprises1119.onmicrosoft.com", bodyContent: "Ensure webhook retry handlers execute correctly.", createdDateTime: getPastDateString(0, 9, 30) }
  ]
};

const INITIAL_TEAMS_MEMBERS: TeamsMember[] = [
  { id: "mem-1", displayName: "Anshuman Enterprises LLC", email: "anshuman@anshumanenterprises1119.onmicrosoft.com", role: "owner" },
  { id: "mem-2", displayName: "Priya Sharma (Ops)", email: "priya@anshumanenterprises1119.onmicrosoft.com", role: "member" },
  { id: "mem-3", displayName: "Rohan Gupta (Design Partner)", email: "rohan@stitchdesignhub.onmicrosoft.com", role: "guest" }
];

const INITIAL_TEAMS_CHANNELS: TeamsChannel[] = [
  { id: "chn-general", name: "General Sprint Channel", description: "Standard engineering team discussions." },
  { id: "chn-design", name: "Stitch Design Guidelines Integration", description: "Workspace reviews for components and themes." }
];

const INITIAL_SHAREPOINT_SITES: SharePointSite[] = [
  { id: "sp-site-1", displayName: "ExpendMore Corporate Portal", name: "expendmore-corp-portal", webUrl: "https://anshumanenterprises.sharepoint.com/sites/expendmore-corp-portal", description: "Internal document portal containing legal SLAs, billing blueprints, and marketing campaigns data." }
];

const INITIAL_SHAREPOINT_LIBRARIES: SharePointLibrary[] = [
  { id: "sp-lib-1", name: "Organization Core SLA archives", siteId: "sp-site-1", description: "Shared document library for Legal documents." },
  { id: "sp-lib-2", name: "WhatsApp Campaigns Graphics Assets", siteId: "sp-site-1", description: "Design resources compiled from Stitch." }
];

const INITIAL_POWERBI_DASHBOARDS: PowerBIDashboard[] = [
  { id: "pbi-db-1", displayName: "ExpendMore Campaign conversions LTV Overview", webUrl: "https://app.powerbi.com/groups/me/dashboards/ltv" }
];

const INITIAL_POWERBI_REPORTS: PowerBIReport[] = [
  { id: "pbi-rep-1", name: "WhatsApp Sales Conversion Funnel & Margin Telemetry", datasetId: "pbi-ds-1", webUrl: "https://app.powerbi.com/groups/me/reports/conversions", embedUrl: "https://app.powerbi.com/reportEmbed?reportId=conversions" }
];

const INITIAL_POWERBI_DATASETS: PowerBIDataset[] = [
  { id: "pbi-ds-1", name: "Real-time WhatsApp Webhook Checkout events dataset", configuredBy: "anshuman@anshumanenterprises1119.onmicrosoft.com", createdDateTime: getPastDateString(10), refreshStatus: "completed", lastRefreshTime: getPastDateString(0, 10, 15) }
];

const INITIAL_TODO_TASKS: MicrosoftToDoTask[] = [
  { id: "td-tsk-1", title: "Add Microsoft Teams meetings generation logic to Calendar", notes: "Check parameters output formatting.", status: "notStarted", importance: "high" },
  { id: "td-tsk-2", title: "Verify Excel Online row appender webhooks", notes: "Ensure transaction logs write correctly on Stripe paid notification signals.", status: "completed", importance: "normal" }
];

const INITIAL_SYNC_JOBS: Record<MicrosoftServiceId, MicrosoftSyncJob> = {
  outlook: { service: "outlook", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 24, errors: 0, autoSync: true },
  calendar: { service: "calendar", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 8, errors: 0, autoSync: true },
  onedrive: { service: "onedrive", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 18, errors: 0, autoSync: true },
  excel: { service: "excel", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 4, errors: 0, autoSync: true },
  word: { service: "word", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 2, errors: 0, autoSync: true },
  powerpoint: { service: "powerpoint", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 1, errors: 0, autoSync: false },
  teams: { service: "teams", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 142, errors: 0, autoSync: true },
  onenote: { service: "onenote", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 0, errors: 0, autoSync: false },
  planner: { service: "planner", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 5, errors: 0, autoSync: false },
  todo: { service: "todo", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 2, errors: 0, autoSync: true },
  sharepoint: { service: "sharepoint", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 3, errors: 0, autoSync: true },
  powerbi: { service: "powerbi", status: "idle", lastRun: getPastDateString(0, 10, 20), nextRun: getFutureDateString(0, 11, 20), itemsSynced: 3, errors: 0, autoSync: true }
};

const INITIAL_API_USAGE: Record<MicrosoftServiceId, MicrosoftAPIUsage> = {
  outlook: {
    service: "outlook", callsToday: 420, callsLimit: 10000, quotaUsedPct: 4.2, avgLatencyMs: 78, errorRate: 0.1,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(10 + Math.random() * 30), latencyMs: Math.floor(70 + Math.random() * 20) }))
  },
  calendar: {
    service: "calendar", callsToday: 180, callsLimit: 5000, quotaUsedPct: 3.6, avgLatencyMs: 95, errorRate: 0.0,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(5 + Math.random() * 15), latencyMs: Math.floor(80 + Math.random() * 25) }))
  },
  onedrive: {
    service: "onedrive", callsToday: 145, callsLimit: 2000, quotaUsedPct: 7.25, avgLatencyMs: 165, errorRate: 0.2,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(2 + Math.random() * 10), latencyMs: Math.floor(140 + Math.random() * 40) }))
  },
  excel: {
    service: "excel", callsToday: 380, callsLimit: 5000, quotaUsedPct: 7.6, avgLatencyMs: 124, errorRate: 0.1,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(10 + Math.random() * 25), latencyMs: Math.floor(110 + Math.random() * 30) }))
  },
  word: {
    service: "word", callsToday: 30, callsLimit: 2000, quotaUsedPct: 1.5, avgLatencyMs: 140, errorRate: 0.0,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: [1, 2, 3][Math.floor(Math.random() * 3)], latencyMs: Math.floor(120 + Math.random() * 30) }))
  },
  powerpoint: {
    service: "powerpoint", callsToday: 12, callsLimit: 2000, quotaUsedPct: 0.6, avgLatencyMs: 180, errorRate: 0.0,
    history: []
  },
  teams: {
    service: "teams", callsToday: 1240, callsLimit: 20000, quotaUsedPct: 6.2, avgLatencyMs: 105, errorRate: 0.3,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(50 + Math.random() * 100), latencyMs: Math.floor(90 + Math.random() * 20) }))
  },
  onenote: { service: "onenote", callsToday: 0, callsLimit: 1000, quotaUsedPct: 0.0, avgLatencyMs: 0, errorRate: 0.0, history: [] },
  planner: { service: "planner", callsToday: 15, callsLimit: 1000, quotaUsedPct: 1.5, avgLatencyMs: 95, errorRate: 0.0, history: [] },
  todo: { service: "todo", callsToday: 60, callsLimit: 1000, quotaUsedPct: 6.0, avgLatencyMs: 78, errorRate: 0.0, history: [] },
  sharepoint: {
    service: "sharepoint", callsToday: 95, callsLimit: 2000, quotaUsedPct: 4.75, avgLatencyMs: 135, errorRate: 0.1,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(2 + Math.random() * 8), latencyMs: Math.floor(120 + Math.random() * 30) }))
  },
  powerbi: {
    service: "powerbi", callsToday: 320, callsLimit: 5000, quotaUsedPct: 6.4, avgLatencyMs: 150, errorRate: 0.4,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(10 + Math.random() * 30), latencyMs: Math.floor(130 + Math.random() * 40) }))
  }
};

const INITIAL_LOGS: MicrosoftSyncLog[] = [
  { id: "ms-log-1", service: "outlook", type: "sync", message: "Outlook inbox synchronized.", details: "24 new message entries loaded.", timestamp: getPastDateString(0, 10, 20), accountId: "ms-acc-1" },
  { id: "ms-log-2", service: "calendar", type: "sync", message: "Calendar schedules checked successfully.", details: "No time conflicts detected.", timestamp: getPastDateString(0, 10, 20), accountId: "ms-acc-1" },
  { id: "ms-log-3", service: "outlook", type: "error", message: "OAuth token authentication aborted. Tenant ID mismatch.", details: "Account token expired at 2026-06-26T14:00:00Z. Microsoft Entra ID returned 401 Unauthorized.", timestamp: getPastDateString(1, 14, 0), accountId: "ms-acc-2" },
  { id: "ms-log-4", service: "onedrive", type: "warning", message: "Metadata scopes verification required.", details: "ExpendMore failed to read Shared library file attributes. Graph API returned 403 Forbidden.", timestamp: getPastDateString(0, 9, 0), accountId: "ms-acc-3" }
];

// ─── STATE INTERFACE ────────────────────────────────────────────────

interface Microsoft365State {
  accounts: MicrosoftAccount[];
  activeAccountId: string;
  tokens: MSOAuthToken[];
  syncJobs: Record<MicrosoftServiceId, MicrosoftSyncJob>;
  apiMetrics: Record<MicrosoftServiceId, MicrosoftAPIUsage>;
  logs: MicrosoftSyncLog[];

  // Mail Data
  outlookMessages: Record<string, OutlookMessage[]>;
  outlookDrafts: Record<string, OutlookDraft[]>;
  outlookTemplates: OutlookTemplate[];
  outlookFolders: OutlookFolder[];

  // Calendar Data
  calendarEvents: Record<string, MSCalendarEvent[]>;
  calendars: MSCalendar[];

  // OneDrive Data
  onedriveFiles: Record<string, OneDriveItem[]>;
  onedriveFolders: Record<string, OneDriveItem[]>;
  onedriveUploads: OneDriveItem[];

  // Excel Data
  excelWorkbooks: ExcelWorkbook[];

  // Word Data
  wordDocs: WordDocument[];

  // Teams Data
  teamsChats: TeamsChat[];
  teamsMessages: Record<string, TeamsMessage[]>;
  teamsMembers: TeamsMember[];
  teamsChannels: TeamsChannel[];

  // SharePoint Data
  sharepointSites: SharePointSite[];
  sharepointLibraries: SharePointLibrary[];

  // Power BI Data
  powerbiDashboards: PowerBIDashboard[];
  powerbiReports: PowerBIReport[];
  powerbiDatasets: PowerBIDataset[];

  // Tasks Data
  todoTasks: MicrosoftToDoTask[];

  // Actions
  connectAccount: (email: string, displayName: string, tenantName: string) => void;
  disconnectAccount: (id: string) => void;
  switchAccount: (id: string) => void;
  refreshToken: (accountId: string, service: MicrosoftServiceId) => void;

  // Outlook Actions
  addDraft: (to: string, subject: string, body: string) => void;
  deleteDraft: (id: string) => void;
  sendMessage: (to: string, subject: string, body: string) => void;
  toggleStarEmail: (id: string) => void;
  deleteEmail: (id: string) => void;

  // Calendar Actions
  createEvent: (event: Omit<MSCalendarEvent, "id">) => void;
  deleteEvent: (id: string) => void;

  // OneDrive Actions
  uploadFile: (name: string, mimeType: string, size: string, folderId: string | null) => void;
  deleteFile: (id: string) => void;
  toggleStarFile: (id: string) => void;

  // Excel Actions
  appendExcelRow: (workbookId: string, tabId: string, row: string[]) => void;

  // Teams Actions
  postTeamsMessage: (chatId: string, bodyContent: string) => void;

  // Power BI Actions
  refreshDataset: (datasetId: string) => void;

  // To Do Actions
  createToDoTask: (title: string, importance: MicrosoftToDoTask["importance"], notes?: string) => void;
  toggleToDoCompleted: (id: string) => void;

  // Sync Actions
  triggerManualSync: (service: MicrosoftServiceId) => void;
  triggerBulkSync: () => void;
  toggleAutoSync: (service: MicrosoftServiceId) => void;
  addSyncLog: (service: MicrosoftServiceId, type: MSLogType, message: string, details?: string) => void;
  clearLogs: () => void;
}

export const useMicrosoft365 = create<Microsoft365State>((set, get) => ({
  accounts: INITIAL_ACCOUNTS,
  activeAccountId: "ms-acc-1",
  tokens: INITIAL_TOKENS,
  syncJobs: INITIAL_SYNC_JOBS,
  apiMetrics: INITIAL_API_USAGE,
  logs: INITIAL_LOGS,

  outlookMessages: INITIAL_OUTLOOK_MESSAGES,
  outlookDrafts: INITIAL_OUTLOOK_DRAFTS,
  outlookTemplates: INITIAL_OUTLOOK_TEMPLATES,
  outlookFolders: INITIAL_OUTLOOK_FOLDERS,

  calendarEvents: INITIAL_CALENDAR_EVENTS,
  calendars: INITIAL_CALENDARS,

  onedriveFiles: INITIAL_ONEDRIVE_ITEMS,
  onedriveFolders: INITIAL_ONEDRIVE_FOLDERS,
  onedriveUploads: [],

  excelWorkbooks: INITIAL_EXCEL_WORKBOOKS,

  wordDocs: INITIAL_WORD_DOCS,

  teamsChats: INITIAL_TEAMS_CHATS,
  teamsMessages: INITIAL_TEAMS_MESSAGES,
  teamsMembers: INITIAL_TEAMS_MEMBERS,
  teamsChannels: INITIAL_TEAMS_CHANNELS,

  sharepointSites: INITIAL_SHAREPOINT_SITES,
  sharepointLibraries: INITIAL_SHAREPOINT_LIBRARIES,

  powerbiDashboards: INITIAL_POWERBI_DASHBOARDS,
  powerbiReports: INITIAL_POWERBI_REPORTS,
  powerbiDatasets: INITIAL_POWERBI_DATASETS,

  todoTasks: INITIAL_TODO_TASKS,

  // ─── Actions ──────────────────────────────────────────────────────

  connectAccount: (email, displayName, tenantName) => {
    const newId = `ms-acc-${Date.now()}`;
    const newAccount: MicrosoftAccount = {
      id: newId,
      email,
      displayName,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
      tenantId: `tnt-${Math.floor(10000+Math.random()*90000)}-ms-tst`,
      tenantName,
      isPrimary: false,
      isActive: false,
      connectedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
      status: "connected",
      storageUsedGB: 0.1,
      storageTotalGB: 512.0,
      healthScore: 100,
      enabledServices: ["outlook", "calendar", "onedrive", "excel", "teams"]
    };

    set((state) => ({
      accounts: [...state.accounts, newAccount],
      outlookMessages: { ...state.outlookMessages, [newId]: [] },
      outlookDrafts: { ...state.outlookDrafts, [newId]: [] },
      calendarEvents: { ...state.calendarEvents, [newId]: [] },
      onedriveFiles: { ...state.onedriveFiles, [newId]: [] },
      onedriveFolders: { ...state.onedriveFolders, [newId]: [] }
    }));

    get().addSyncLog("outlook", "oauth", `Connected M365 tenant account: ${email}`, `Tenant: ${tenantName}`);
  },

  disconnectAccount: (id) => {
    set((state) => {
      const updatedAccounts = state.accounts.filter(a => a.id !== id);
      let nextActive = state.activeAccountId;
      if (id === state.activeAccountId && updatedAccounts.length > 0) {
        nextActive = updatedAccounts[0].id;
        updatedAccounts[0].isActive = true;
      }
      return {
        accounts: updatedAccounts,
        activeAccountId: nextActive
      };
    });

    get().addSyncLog("outlook", "oauth", `Disconnected account context`, `Removed M365 account ID ${id}.`);
  },

  switchAccount: (id) => {
    set((state) => ({
      activeAccountId: id,
      accounts: state.accounts.map(a => ({
        ...a,
        isActive: a.id === id
      }))
    }));
    get().addSyncLog("outlook", "info", `Switched active organization tenant`, `Focus updated.`);
  },

  refreshToken: (accountId, service) => {
    set((state) => {
      const updatedTokens = state.tokens.map(t =>
        t.accountId === accountId && t.service === service
          ? { ...t, status: "valid" as const, expiresAt: getFutureDateString(30) }
          : t
      );
      const updatedAccounts = state.accounts.map(a =>
        a.id === accountId ? { ...a, status: "connected" as const, healthScore: 98 } : a
      );
      return {
        tokens: updatedTokens,
        accounts: updatedAccounts
      };
    });
    get().addSyncLog(service, "oauth", "Refreshed Microsoft Entra ID Token signatures.", "Credential handshake completed.");
  },

  // ─── Outlook Actions ──────────────────────────────────────────────

  addDraft: (to, subject, body) => {
    const acc = get().activeAccountId;
    const newDraft: OutlookDraft = {
      id: `out-dr-${Date.now()}`,
      to,
      subject,
      body,
      lastModifiedDateTime: new Date().toISOString()
    };
    set((state) => ({
      outlookDrafts: {
        ...state.outlookDrafts,
        [acc]: [newDraft, ...(state.outlookDrafts[acc] || [])]
      }
    }));
    get().addSyncLog("outlook", "info", `Outlook email draft saved`, `To: ${to}`);
  },

  deleteDraft: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      outlookDrafts: {
        ...state.outlookDrafts,
        [acc]: (state.outlookDrafts[acc] || []).filter(d => d.id !== id)
      }
    }));
  },

  sendMessage: (to, subject, body) => {
    const acc = get().activeAccountId;
    const activeAccObj = get().accounts.find(a => a.id === acc);
    const newMessage: OutlookMessage = {
      id: `out-msg-${Date.now()}`,
      conversationId: `conv-${Date.now()}`,
      fromName: activeAccObj?.displayName || "ExpendMore Outlook agent",
      fromEmail: activeAccObj?.email || "",
      to: [to],
      subject,
      bodyPreview: body.substring(0, 100),
      bodyContent: body,
      folder: "Sent Items",
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      receivedDateTime: new Date().toISOString()
    };

    set((state) => ({
      outlookMessages: {
        ...state.outlookMessages,
        [acc]: [newMessage, ...(state.outlookMessages[acc] || [])]
      }
    }));

    get().addSyncLog("outlook", "sync", `Email dispatched from Outlook`, `Recipient: ${to}`);
  },

  toggleStarEmail: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      outlookMessages: {
        ...state.outlookMessages,
        [acc]: (state.outlookMessages[acc] || []).map(m =>
          m.id === id ? { ...m, isStarred: !m.isStarred } : m
        )
      }
    }));
  },

  deleteEmail: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      outlookMessages: {
        ...state.outlookMessages,
        [acc]: (state.outlookMessages[acc] || []).map(m =>
          m.id === id ? { ...m, folder: "Deleted Items" } : m
        )
      }
    }));
  },

  // ─── Calendar Actions ─────────────────────────────────────────────

  createEvent: (event) => {
    const acc = get().activeAccountId;
    const newEvent: MSCalendarEvent = {
      ...event,
      id: `ms-ev-${Date.now()}`
    };
    set((state) => ({
      calendarEvents: {
        ...state.calendarEvents,
        [acc]: [...(state.calendarEvents[acc] || []), newEvent]
      }
    }));
    get().addSyncLog("calendar", "sync", `Scheduled Teams/Outlook meeting: ${event.subject}`, `Time: ${event.start}`);
  },

  deleteEvent: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      calendarEvents: {
        ...state.calendarEvents,
        [acc]: (state.calendarEvents[acc] || []).filter(e => e.id !== id)
      }
    }));
    get().addSyncLog("calendar", "info", `Deleted calendar event`, `ID: ${id}`);
  },

  // ─── OneDrive Actions ─────────────────────────────────────────────

  uploadFile: (name, mimeType, size, folderId) => {
    const acc = get().activeAccountId;
    const newFile: OneDriveItem = {
      id: `od-file-${Date.now()}`,
      name,
      type: "file",
      mimeType,
      size,
      sizeBytes: 1024 * 1024,
      parentFolderId: folderId,
      createdDateTime: new Date().toISOString(),
      lastModifiedDateTime: new Date().toISOString(),
      createdBy: "anshuman@anshumanenterprises1119.onmicrosoft.com",
      isShared: false,
      sharedWithEmails: [],
      webUrl: "https://onedrive.live.com/edit.aspx?id=upload",
      starred: false
    };

    set((state) => ({
      onedriveFiles: {
        ...state.onedriveFiles,
        [acc]: [newFile, ...(state.onedriveFiles[acc] || [])]
      }
    }));
    get().addSyncLog("onedrive", "sync", `Saved asset directly to OneDrive: ${name}`, `Folder ID: ${folderId || "Root"}`);
  },

  deleteFile: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      onedriveFiles: {
        ...state.onedriveFiles,
        [acc]: (state.onedriveFiles[acc] || []).filter(f => f.id !== id)
      }
    }));
  },

  toggleStarFile: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      onedriveFiles: {
        ...state.onedriveFiles,
        [acc]: (state.onedriveFiles[acc] || []).map(f =>
          f.id === id ? { ...f, starred: !f.starred } : f
        )
      }
    }));
  },

  // ─── Excel Actions ───────────────────────────────────────────────

  appendExcelRow: (workbookId, tabId, row) => {
    set((state) => ({
      excelWorkbooks: state.excelWorkbooks.map(wb => {
        if (wb.id !== workbookId) return wb;
        const currentRows = wb.rowData[tabId] || [];
        return {
          ...wb,
          rowData: {
            ...wb.rowData,
            [tabId]: [...currentRows, row]
          }
        };
      })
    }));
    get().addSyncLog("excel", "sync", `Appended transaction details into Excel`, `Workbook: ${workbookId}`);
  },

  // ─── Teams Actions ────────────────────────────────────────────────

  postTeamsMessage: (chatId, bodyContent) => {
    const acc = get().activeAccountId;
    const activeAccObj = get().accounts.find(a => a.id === acc);
    const newMessage: TeamsMessage = {
      id: `tm-msg-${Date.now()}`,
      chatIdOrChannelId: chatId,
      fromName: activeAccObj?.displayName || "ExpendMore agent",
      fromEmail: activeAccObj?.email || "",
      bodyContent,
      createdDateTime: new Date().toISOString()
    };

    set((state) => ({
      teamsMessages: {
        ...state.teamsMessages,
        [chatId]: [...(state.teamsMessages[chatId] || []), newMessage]
      }
    }));
    get().addSyncLog("teams", "sync", "Broadcasted signal log directly to Teams Channel.", `Chat/Channel ID: ${chatId}`);
  },

  // ─── Power BI Actions ─────────────────────────────────────────────

  refreshDataset: (datasetId) => {
    set((state) => ({
      powerbiDatasets: state.powerbiDatasets.map(ds =>
        ds.id === datasetId
          ? { ...ds, refreshStatus: "completed" as const, lastRefreshTime: new Date().toISOString() }
          : ds
      )
    }));
    get().addSyncLog("powerbi", "sync", `Successfully triggered Power BI dataset refresh`, `Dataset ID: ${datasetId}`);
  },

  // ─── To Do Actions ────────────────────────────────────────────────

  createToDoTask: (title, importance, notes) => {
    const newTask: MicrosoftToDoTask = {
      id: `td-tsk-${Date.now()}`,
      title,
      notes,
      status: "notStarted",
      importance
    };
    set((state) => ({
      todoTasks: [newTask, ...state.todoTasks]
    }));
  },

  toggleToDoCompleted: (id) => {
    set((state) => ({
      todoTasks: state.todoTasks.map(t =>
        t.id === id
          ? { ...t, status: t.status === "completed" ? "notStarted" : "completed" }
          : t
      )
    }));
  },

  // ─── Sync Actions ─────────────────────────────────────────────────

  triggerManualSync: (service) => {
    set((state) => ({
      syncJobs: {
        ...state.syncJobs,
        [service]: { ...state.syncJobs[service], status: "running" }
      }
    }));

    setTimeout(() => {
      set((state) => {
        const job = state.syncJobs[service];
        return {
          syncJobs: {
            ...state.syncJobs,
            [service]: {
              ...job,
              status: "idle",
              lastRun: new Date().toISOString(),
              nextRun: getFutureDateString(0, new Date().getHours() + 1),
              itemsSynced: job.itemsSynced + Math.floor(Math.random() * 4)
            }
          }
        };
      });

      // Update API usage
      set((state) => {
        const met = state.apiMetrics[service];
        return {
          apiMetrics: {
            ...state.apiMetrics,
            [service]: {
              ...met,
              callsToday: met.callsToday + Math.floor(5 + Math.random() * 8),
              avgLatencyMs: Math.max(50, met.avgLatencyMs + Math.floor(Math.random() * 8 - 4))
            }
          }
        };
      });

      get().addSyncLog(service, "sync", `Manual synchronizer job finished completely`, "Sync log added.");
    }, 1500);
  },

  triggerBulkSync: () => {
    const services = Object.keys(get().syncJobs) as MicrosoftServiceId[];
    services.forEach(srv => {
      get().triggerManualSync(srv);
    });
  },

  toggleAutoSync: (service) => {
    set((state) => ({
      syncJobs: {
        ...state.syncJobs,
        [service]: {
          ...state.syncJobs[service],
          autoSync: !state.syncJobs[service].autoSync
        }
      }
    }));
  },

  addSyncLog: (service, type, message, details) => {
    const acc = get().activeAccountId;
    const newLog: MicrosoftSyncLog = {
      id: `ms-log-${Date.now()}`,
      service,
      type,
      message,
      details,
      timestamp: new Date().toISOString(),
      accountId: acc
    };
    set((state) => ({
      logs: [newLog, ...state.logs]
    }));
  },

  clearLogs: () => {
    set({ logs: [] });
  }
}));
