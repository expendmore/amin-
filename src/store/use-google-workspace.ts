import { create } from "zustand";
import {
  GoogleAccount,
  OAuthToken,
  GmailMessage,
  GmailDraft,
  GmailTemplate,
  GmailSignature,
  GmailLabel,
  CalendarEvent,
  GoogleCalendar,
  DriveFile,
  DriveFolder,
  DriveUploadTask,
  Spreadsheet,
  GoogleDoc,
  DocTemplate,
  GoogleContact,
  MeetMeeting,
  GoogleForm,
  FormResponse,
  GoogleTask,
  SyncLog,
  SyncJob,
  APIUsageMetric,
  SystemHealth,
  GoogleServiceId,
  SyncLogType
} from "@/types/google-workspace";

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

const INITIAL_ACCOUNTS: GoogleAccount[] = [
  {
    id: "acc-1",
    email: "ceo@anshumanenterprises1119.in",
    displayName: "Anshuman Enterprises CEO",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
    isPrimary: true,
    isActive: true,
    connectedAt: getPastDateString(30),
    lastSyncedAt: getPastDateString(0, 10, 15),
    status: "connected",
    storageUsedGB: 12.4,
    storageTotalGB: 15.0,
    healthScore: 98,
    enabledServices: ["gmail", "calendar", "drive", "sheets", "docs", "contacts", "meet", "forms", "analytics"]
  },
  {
    id: "acc-2",
    email: "support@anshumanenterprises1119.in",
    displayName: "ExpendMore Support Workspace",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop",
    isPrimary: false,
    isActive: false,
    connectedAt: getPastDateString(15),
    lastSyncedAt: getPastDateString(1, 9, 30),
    status: "expired", // expired token demo
    storageUsedGB: 87.2,
    storageTotalGB: 100.0,
    healthScore: 65,
    enabledServices: ["gmail", "calendar", "drive", "sheets", "contacts", "meet"]
  },
  {
    id: "acc-3",
    email: "marketing@anshumanenterprises1119.in",
    displayName: "Marketing Shared Inbox",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop",
    isPrimary: false,
    isActive: false,
    connectedAt: getPastDateString(5),
    lastSyncedAt: getPastDateString(0, 8, 0),
    status: "permission_error", // permission error demo
    storageUsedGB: 2.1,
    storageTotalGB: 15.0,
    healthScore: 40,
    enabledServices: ["gmail", "drive", "forms", "analytics"]
  }
];

const INITIAL_TOKENS: OAuthToken[] = [
  {
    id: "tok-1",
    accountId: "acc-1",
    service: "gmail",
    status: "valid",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.modify"],
    issuedAt: getPastDateString(30),
    expiresAt: getFutureDateString(30),
    refreshToken: "1//0gXF-v4t-7bkaCgYIARAAGBASNwF-L9Ir...",
    accessToken: "ya29.a0AfB_byC68b812hbJka10s09218nsad..."
  },
  {
    id: "tok-2",
    accountId: "acc-2",
    service: "gmail",
    status: "expired",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send"],
    issuedAt: getPastDateString(15),
    expiresAt: getPastDateString(0, 2, 0), // Expired 8 hours ago
    refreshToken: "1//0gXF-92kaSkaCgYIARAAGBASNwF-M0Pq...",
    accessToken: "ya29.a0AfB_byE8391823abshkjsah91823..."
  }
];

const INITIAL_GMAIL_MESSAGES: Record<string, GmailMessage[]> = {
  "acc-1": [
    {
      id: "msg-1",
      threadId: "th-1",
      from: "Google Workspace Team",
      fromEmail: "workspace-noreply@google.com",
      to: ["ceo@anshumanenterprises1119.in"],
      subject: "Security Alert: New OAuth credentials granted for ExpendMore",
      snippet: "ExpendMore Integration Hub has been successfully connected to your Google Workspace account. Scopes authorized: Gmail, Calendar, Drive...",
      body: "Hello Anshuman,\n\nYou are receiving this security notification because you authorized ExpendMore to access your Google Workspace account.\n\nAuthorized Scopes:\n- Gmail (Send, Read, Manage)\n- Google Drive (Full access to app files)\n- Calendar (Manage events)\n\nIf you did not authorize this, please revoke access immediately in your Google account settings.\n\nBest,\nThe Google Workspace Team",
      labels: ["INBOX", "IMPORTANT"],
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      receivedAt: getPastDateString(0, 10, 5)
    },
    {
      id: "msg-2",
      threadId: "th-2",
      from: "Rohan Gupta (Design Partner)",
      fromEmail: "rohan@stitchdesign.com",
      to: ["ceo@anshumanenterprises1119.in"],
      subject: "Stitch Design System Tokens update list",
      snippet: "Hi Anshuman, I've compiled the final visual identity specifications for ExpendMore. The zip attachment includes Tailwind config overrides...",
      body: "Hi team,\n\nI have uploaded the design specification zip. Key styles incorporated:\n- Neutral surfaces (#FCF8FA)\n- Action buttons with WhatsApp Green glows (#25D366)\n- Glassmorphic panels with level-2 elevation shadow blurs.\n\nPlease verify and let me know if we need adjustments.\n\nRegards,\nRohan Gupta",
      labels: ["INBOX"],
      isRead: true,
      isStarred: false,
      hasAttachment: true,
      receivedAt: getPastDateString(0, 8, 45)
    },
    {
      id: "msg-3",
      threadId: "th-3",
      from: "ExpendMore Notification Hub",
      fromEmail: "alerts@expendmore.ai",
      to: ["ceo@anshumanenterprises1119.in"],
      subject: "Daily Sync Completed Successfully — June 27",
      snippet: "Your Google Workspace data synchronizer runs completed. drive: 124 files, sheets: 5 spreadhsheets, calendar: 12 new schedule entries...",
      body: "ExpendMore Automated Sync Report\n---------------------------\n- Status: SUCCESS\n- Time: June 27, 2026, 05:00 UTC\n- Gmail Synced: 48 messages read, 12 automation replies drafted\n- Calendar: 18 meetings scheduled or updated\n- Google Meet: Generated links for 6 calendar bookings\n\nAll services reporting stable handshake latencies.",
      labels: ["IMPORTANT"],
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      receivedAt: getPastDateString(0, 5, 0)
    },
    {
      id: "msg-4",
      threadId: "th-4",
      from: "Priya Sharma (Operations)",
      fromEmail: "priya@anshumanenterprises1119.in",
      to: ["ceo@anshumanenterprises1119.in"],
      subject: "Drafts review required: WhatsApp Commerce Campaign template",
      snippet: "Can you double check the billing and payment link parameters for the upcoming product launch? I saved a draft in Google Docs...",
      body: "Hey Anshuman,\n\nI've written down the outline in our Docs library. We want to trigger Stripe payment links directly when a customer replies 'BUY' on WhatsApp.\n\nLet me know if the pricing matches our updated tier.\n\nThanks,\nPriya",
      labels: ["INBOX"],
      isRead: false,
      isStarred: false,
      hasAttachment: false,
      receivedAt: getPastDateString(1, 14, 20)
    }
  ],
  "acc-2": [
    {
      id: "msg-s1",
      threadId: "th-s1",
      from: "System Daemon Alert",
      fromEmail: "daemon@expendmore.ai",
      to: ["support@anshumanenterprises1119.in"],
      subject: "[ALERT] Webhook handshake warning: Stripe Checkout Integration",
      snippet: "Outbound webhook endpoint for connection stripe-conn-2 failed to respond inside 5000ms. Latency spikes detected on server...",
      body: "High Latency Warning Alert\n-------------------------\nTimestamp: 2026-06-26 14:00:00Z\nWebhook Retries: 2/3 attempted.\n\nPlease check credentials status in OAuth dashboard.",
      labels: ["INBOX", "IMPORTANT"],
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      receivedAt: getPastDateString(1, 14, 0)
    }
  ]
};

const INITIAL_GMAIL_DRAFTS: Record<string, GmailDraft[]> = {
  "acc-1": [
    {
      id: "dr-1",
      to: "client-info@globaltech.com",
      subject: "Re: Quotation Proposal for ExpendMore Enterprise Suite",
      body: "Dear Client Team,\n\nThank you for reaching out. Based on your needs, we recommend our enterprise plan which includes full WhatsApp Live Agent Inboxes, custom AI Chatbot Builders, and integrated Google Calendar scheduling for appointments.\n\nI have attached our pricing matrix.\n\nBest,\nAnshuman",
      updatedAt: getPastDateString(0, 9, 30)
    },
    {
      id: "dr-2",
      to: "rohan@stitchdesign.com",
      subject: "Feedback on design guidelines draft",
      body: "Hey Rohan,\n\nEverything looks fantastic. The typography sizes (Display, Headline, Code scales) feel extremely premium and professional.\n\nLet's proceed with this system.",
      updatedAt: getPastDateString(1, 11, 0)
    }
  ],
  "acc-2": []
};

const INITIAL_GMAIL_TEMPLATES: GmailTemplate[] = [
  {
    id: "tpl-1",
    name: "Customer Onboarding Guide",
    subject: "Welcome to ExpendMore — Getting Started Checklist",
    body: "Hi {{contact.first_name}},\n\nWelcome to ExpendMore! Here are your next steps:\n1. Open the WhatsApp Console in your sidebar.\n2. Complete your Business Profile.\n3. Hook up your Google Workspace suite to schedule calendar appointments automatically.\n\nReply directly to this email if you need setup help.\n\nBest,\nThe ExpendMore Team",
    category: "Support"
  },
  {
    id: "tpl-2",
    name: "Meeting Link Invitation",
    subject: "Confirmed: Stitch Design consultation calendar invite",
    body: "Hi {{contact.first_name}},\n\nYour meeting has been scheduled. Details:\n- Date: {{event.date}}\n- Time: {{event.time}}\n- Meet Link: {{event.meet_url}}\n\nFeel free to reschedule via the WhatsApp Hub chatbot dynamic quick-replies if required.\n\nRegards,\nTeam ExpendMore",
    category: "Sales"
  }
];

const INITIAL_GMAIL_SIGNATURES: GmailSignature[] = [
  {
    id: "sig-1",
    name: "Professional Core",
    html: "<p><strong>Anshuman Enterprises</strong><br/>CEO, ExpendMore Division<br/><a href='https://expendmore.ai'>expendmore.ai</a> | Support: +1 (800) 555-SENSY</p>",
    isDefault: true
  }
];

const INITIAL_GMAIL_LABELS: GmailLabel[] = [
  { id: "lbl-inbox", name: "INBOX", color: "#1E293B", messageCount: 3 },
  { id: "lbl-starred", name: "STARRED", color: "#F59E0B", messageCount: 1 },
  { id: "lbl-sent", name: "SENT", color: "#10B981", messageCount: 42 },
  { id: "lbl-drafts", name: "DRAFTS", color: "#3B82F6", messageCount: 2 },
  { id: "lbl-important", name: "IMPORTANT", color: "#EF4444", messageCount: 2 }
];

const INITIAL_CALENDAR_EVENTS: Record<string, CalendarEvent[]> = {
  "acc-1": [
    {
      id: "ev-1",
      title: "WhatsApp Hub Integration Launch Sync",
      description: "Review live message throughput and chatbot template logs. Address latency triggers on webhooks.",
      startTime: getPastDateString(0, 11, 0),
      endTime: getPastDateString(0, 12, 0),
      location: "Virtual Meeting Room 4",
      attendees: ["ceo@anshumanenterprises1119.in", "priya@anshumanenterprises1119.in", "rohan@stitchdesign.com"],
      organizer: "ceo@anshumanenterprises1119.in",
      status: "confirmed",
      isAllDay: false,
      recurrence: "none",
      color: "#25D366", // WhatsApp Green style
      calendarId: "cal-primary",
      meetLink: "https://meet.google.com/abc-defg-hij"
    },
    {
      id: "ev-2",
      title: "Daily Standup: ExpendMore Development",
      description: "Engineering team dashboard checkup, AI tools alignment, and design tokens check.",
      startTime: getPastDateString(0, 9, 30),
      endTime: getPastDateString(0, 10, 0),
      location: "Google Meet Link",
      attendees: ["ceo@anshumanenterprises1119.in", "dev-team@anshumanenterprises1119.in"],
      organizer: "ceo@anshumanenterprises1119.in",
      status: "confirmed",
      isAllDay: false,
      recurrence: "daily",
      color: "#3B82F6", // Sky Blue
      calendarId: "cal-primary",
      meetLink: "https://meet.google.com/xyz-qprs-tuv"
    },
    {
      id: "ev-3",
      title: "Stripe Checkout Pipeline Audit",
      description: "Ensure webhook retry counters execute seamlessly on failed database connections.",
      startTime: getPastDateString(1, 14, 0),
      endTime: getPastDateString(1, 15, 30),
      location: "Finance Meeting Room",
      attendees: ["ceo@anshumanenterprises1119.in", "billing@stripe.com"],
      organizer: "billing@stripe.com",
      status: "confirmed",
      isAllDay: false,
      recurrence: "weekly",
      color: "#6366F1", // Purple
      calendarId: "cal-primary",
      meetLink: "https://meet.google.com/pqr-stuv-wxy"
    },
    {
      id: "ev-4",
      title: "Bi-Weekly Board Sync — Marketing Campaign",
      description: "Strategy outline for incoming customer leads campaign, WhatsApp newsletters templates review.",
      startTime: getFutureDateString(1, 10, 0),
      endTime: getFutureDateString(1, 11, 30),
      location: "Conference Room A",
      attendees: ["ceo@anshumanenterprises1119.in", "board-members@anshumanenterprises1119.in"],
      organizer: "ceo@anshumanenterprises1119.in",
      status: "tentative",
      isAllDay: false,
      recurrence: "none",
      color: "#EC4899", // Pink
      calendarId: "cal-primary",
      meetLink: "https://meet.google.com/mno-pqrs-tuv"
    }
  ],
  "acc-2": []
};

const INITIAL_CALENDARS: GoogleCalendar[] = [
  { id: "cal-primary", name: "Anshuman Enterprises Core Calendar", color: "#3B82F6", isPrimary: true, timezone: "Asia/Kolkata", eventCount: 15 },
  { id: "cal-marketing", name: "Campaigns Planner & Events", color: "#EC4899", isPrimary: false, timezone: "Asia/Kolkata", eventCount: 8 }
];

const INITIAL_DRIVE_FILES: Record<string, DriveFile[]> = {
  "acc-1": [
    {
      id: "file-1",
      name: "ExpendMore Visual Identity Guidelines.pdf",
      type: "pdf",
      mimeType: "application/pdf",
      size: "4.2 MB",
      sizeBytes: 4404019,
      parentFolderId: "fld-1",
      createdAt: getPastDateString(15),
      modifiedAt: getPastDateString(1, 10, 0),
      ownedBy: "rohan@stitchdesign.com",
      isShared: true,
      sharedWith: ["ceo@anshumanenterprises1119.in", "priya@anshumanenterprises1119.in"],
      webViewLink: "https://drive.google.com/file/d/1234abcd/view",
      starred: true,
      trashed: false
    },
    {
      id: "file-2",
      name: "WhatsApp Conversational Checkout Flows.png",
      type: "image",
      mimeType: "image/png",
      size: "820 KB",
      sizeBytes: 839680,
      parentFolderId: "fld-2",
      createdAt: getPastDateString(10),
      modifiedAt: getPastDateString(2, 14, 20),
      ownedBy: "ceo@anshumanenterprises1119.in",
      isShared: false,
      sharedWith: [],
      webViewLink: "https://drive.google.com/file/d/5678efgh/view",
      starred: false,
      trashed: false
    },
    {
      id: "file-3",
      name: "Customer Directory & LTV Matrix.xlsx",
      type: "spreadsheet",
      mimeType: "application/vnd.google-apps.spreadsheet",
      size: "1.4 MB",
      sizeBytes: 1468006,
      parentFolderId: "fld-3",
      createdAt: getPastDateString(5),
      modifiedAt: getPastDateString(0, 10, 15),
      ownedBy: "ceo@anshumanenterprises1119.in",
      isShared: true,
      sharedWith: ["support@anshumanenterprises1119.in"],
      webViewLink: "https://drive.google.com/file/d/9012ijkl/view",
      starred: true,
      trashed: false
    },
    {
      id: "file-4",
      name: "Support Response Playbook draft.docx",
      type: "document",
      mimeType: "application/vnd.google-apps.document",
      size: "245 KB",
      sizeBytes: 250880,
      parentFolderId: null,
      createdAt: getPastDateString(20),
      modifiedAt: getPastDateString(5, 16, 0),
      ownedBy: "priya@anshumanenterprises1119.in",
      isShared: true,
      sharedWith: ["ceo@anshumanenterprises1119.in"],
      webViewLink: "https://drive.google.com/file/d/3456mnop/view",
      starred: false,
      trashed: false
    }
  ],
  "acc-2": []
};

const INITIAL_DRIVE_FOLDERS: Record<string, DriveFolder[]> = {
  "acc-1": [
    { id: "fld-1", name: "Brand & Visual Specs", parentFolderId: null, itemCount: 8, createdAt: getPastDateString(20), color: "#3B82F6" },
    { id: "fld-2", name: "WhatsApp Wireframes", parentFolderId: null, itemCount: 14, createdAt: getPastDateString(18), color: "#25D366" },
    { id: "fld-3", name: "Finance & LTV Reports", parentFolderId: null, itemCount: 4, createdAt: getPastDateString(10), color: "#10B981" }
  ],
  "acc-2": []
};

const INITIAL_SPREADSHEETS: Spreadsheet[] = [
  {
    id: "file-3",
    title: "Customer Directory & LTV Matrix",
    url: "https://docs.google.com/spreadsheets/d/9012ijkl/edit",
    ownedBy: "ceo@anshumanenterprises1119.in",
    lastModified: getPastDateString(0, 10, 15),
    isShared: true,
    tabs: [
      { id: "tb-1", name: "Active Contact Registers", rowCount: 4, columnCount: 5 },
      { id: "tb-2", name: "Billing Timeline", rowCount: 3, columnCount: 4 }
    ],
    rowData: {
      "tb-1": [
        ["Contact ID", "Name", "WhatsApp Phone", "Lifetime Value ($)", "Segment"],
        ["USR-9801", "Amelia Stone", "+1 (202) 555-0143", "4,500.00", "Enterprise VIP"],
        ["USR-4281", "Kabir Dev", "+91 98765 43210", "1,200.00", "Growth Tier"],
        ["USR-3302", "Elena Rostova", "+44 20 7946 0958", "650.00", "Self-Serve"]
      ],
      "tb-2": [
        ["Transaction ID", "User ID", "Amount Paid", "Stripe Checkout URL"],
        ["TXN-89021a", "USR-9801", "$1,500.00", "https://checkout.stripe.com/pay/cs_live_1"],
        ["TXN-45182x", "USR-4281", "$400.00", "https://checkout.stripe.com/pay/cs_live_2"]
      ]
    }
  },
  {
    id: "sheet-2",
    title: "Marketing Campaign Conversion Funnel",
    url: "https://docs.google.com/spreadsheets/d/sheet-campaign/edit",
    ownedBy: "marketing@anshumanenterprises1119.in",
    lastModified: getPastDateString(2, 11, 0),
    isShared: false,
    tabs: [
      { id: "funnel-1", name: "Conversion Funnel Overview", rowCount: 3, columnCount: 3 }
    ],
    rowData: {
      "funnel-1": [
        ["Campaign Name", "Impressions Today", "WhatsApp Replies Tracked"],
        ["Stitch Launch Alert", "12,450", "984"],
        ["AI Reply Assistant Beta", "8,920", "642"]
      ]
    }
  }
];

const INITIAL_DOCS: GoogleDoc[] = [
  {
    id: "file-4",
    title: "Support Response Playbook draft",
    url: "https://docs.google.com/document/d/3456mnop/edit",
    ownedBy: "priya@anshumanenterprises1119.in",
    lastModified: getPastDateString(5, 16, 0),
    wordCount: 1420,
    isShared: true,
    starred: false,
    templateCategory: "Guides"
  },
  {
    id: "doc-2",
    title: "ExpendMore – Product Blueprint Overview",
    url: "https://docs.google.com/document/d/doc-expendmore-blueprint/edit",
    ownedBy: "ceo@anshumanenterprises1119.in",
    lastModified: getPastDateString(1, 15, 30),
    wordCount: 4560,
    isShared: true,
    starred: true,
    templateCategory: "Specifications"
  }
];

const INITIAL_DOC_TEMPLATES: DocTemplate[] = [
  { id: "dtpl-1", name: "Client Proposal Outline", category: "Sales", thumbnailUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=120&auto=format&fit=crop", description: "Standard business quotation format incorporating service SLAs, onboarding phases, and Stripe billing parameters." },
  { id: "dtpl-2", name: "Standard SLA Agreement", category: "Legal", thumbnailUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=120&auto=format&fit=crop", description: "Legal baseline parameters detailing API availability metrics, latency guarantees, and security policies." }
];

const INITIAL_CONTACTS: GoogleContact[] = [
  {
    id: "cnt-1",
    displayName: "Amelia Stone",
    firstName: "Amelia",
    lastName: "Stone",
    email: "amelia@stone-enterprises.com",
    phone: "+1 (202) 555-0143",
    company: "Stone Enterprises Ltd",
    jobTitle: "VP of Product Strategy",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop",
    groups: ["Enterprise VIPs", "Clients"],
    lastContactedAt: getPastDateString(2, 16, 40),
    syncedAt: getPastDateString(0, 10, 15)
  },
  {
    id: "cnt-2",
    displayName: "Kabir Dev",
    firstName: "Kabir",
    lastName: "Dev",
    email: "kabir.dev@growthtech.io",
    phone: "+91 98765 43210",
    company: "GrowthTech Solutions",
    jobTitle: "Founder & CTO",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop",
    groups: ["Clients"],
    lastContactedAt: getPastDateString(1, 11, 15),
    syncedAt: getPastDateString(0, 10, 15)
  },
  {
    id: "cnt-3",
    displayName: "Elena Rostova",
    firstName: "Elena",
    lastName: "Rostova",
    email: "elena@rostov-group.co.uk",
    phone: "+44 20 7946 0958",
    company: "Rostov Group UK",
    jobTitle: "Operations Director",
    avatarUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&auto=format&fit=crop",
    groups: ["Self-Serve Users"],
    lastContactedAt: getPastDateString(4, 9, 0),
    syncedAt: getPastDateString(0, 10, 15)
  },
  {
    id: "cnt-4",
    displayName: "Elena R (Potential Duplicate)",
    firstName: "Elena",
    lastName: "R",
    email: "elena@rostov-group.co.uk",
    phone: "+44 20 7946 0958",
    company: "Rostov Group",
    jobTitle: "Ops Mgr",
    groups: [],
    isDuplicate: true, // triggers duplicates warning banner
    syncedAt: getPastDateString(0, 10, 15)
  }
];

const INITIAL_MEETINGS: MeetMeeting[] = [
  {
    id: "meet-1",
    title: "WhatsApp Hub Integration Launch Sync",
    startTime: getPastDateString(0, 11, 0),
    endTime: getPastDateString(0, 12, 0),
    duration: 60,
    status: "ended",
    meetLink: "https://meet.google.com/abc-defg-hij",
    hostEmail: "ceo@anshumanenterprises1119.in",
    attendees: ["ceo@anshumanenterprises1119.in", "priya@anshumanenterprises1119.in", "rohan@stitchdesign.com"],
    recordingUrl: "https://drive.google.com/file/d/rec-1234abcd/view"
  },
  {
    id: "meet-2",
    title: "Daily Standup: ExpendMore Development",
    startTime: getPastDateString(0, 9, 30),
    endTime: getPastDateString(0, 10, 0),
    duration: 30,
    status: "ended",
    meetLink: "https://meet.google.com/xyz-qprs-tuv",
    hostEmail: "ceo@anshumanenterprises1119.in",
    attendees: ["ceo@anshumanenterprises1119.in", "dev-team@anshumanenterprises1119.in"]
  },
  {
    id: "meet-3",
    title: "Partner Collaboration Call: Stitch System Integration",
    startTime: getFutureDateString(0, 16, 0),
    endTime: getFutureDateString(0, 17, 0),
    duration: 60,
    status: "upcoming",
    meetLink: "https://meet.google.com/mno-pqrs-tuv",
    hostEmail: "ceo@anshumanenterprises1119.in",
    attendees: ["ceo@anshumanenterprises1119.in", "rohan@stitchdesign.com"]
  }
];

const INITIAL_FORMS: GoogleForm[] = [
  {
    id: "frm-1",
    title: "ExpendMore Customer Feedback Questionnaire",
    description: "Gathering experience evaluations from early product users about chatbot latency and inbox templates.",
    url: "https://docs.google.com/forms/d/feedback-form/viewform",
    responseCount: 142,
    isAcceptingResponses: true,
    createdAt: getPastDateString(25),
    lastModified: getPastDateString(2, 10, 0),
    fields: [
      { id: "f-1", type: "multiple_choice", question: "How satisfied are you with WhatsApp message speed?", required: true, options: ["Very Satisfied", "Neutral", "Unsatisfied"] },
      { id: "f-2", type: "paragraph", question: "Describe any features you want added to the AI Reply Assistant.", required: false }
    ],
    responses: [
      { id: "resp-1", formId: "frm-1", submittedAt: getPastDateString(0, 9, 15), respondentEmail: "kabir.dev@growthtech.io", answers: { "f-1": "Very Satisfied", "f-2": "Integrating Sheets directly to export user lists would save several steps." } },
      { id: "resp-2", formId: "frm-1", submittedAt: getPastDateString(0, 8, 30), respondentEmail: "elena@rostov-group.co.uk", answers: { "f-1": "Neutral", "f-2": "Auto sync with our calendar reminders helps my team keep track of campaigns." } }
    ]
  }
];

const INITIAL_TASKS: GoogleTask[] = [
  { id: "tsk-1", title: "Review visual identity overrides in CSS layout", notes: "Verify with Rohan that borders and glow shades use level-1 and 2 specs properly.", completed: false, priority: "high" },
  { id: "tsk-2", title: "Test automated sync logs timeline filters", notes: "Verify error types highlight warning labels accurately in red and amber.", completed: true, completedAt: getPastDateString(1), priority: "medium" },
  { id: "tsk-3", title: "Add Google Meet links generator to calendar invitations", notes: "Ensure dynamic creation maps correct token outputs into checkout parameters.", completed: false, priority: "low" }
];

const INITIAL_LOGS: SyncLog[] = [
  { id: "slog-1", service: "gmail", type: "sync", message: "Inbox message fetch completed.", details: "48 email messages read, 12 auto drafts generated successfully.", timestamp: getPastDateString(0, 10, 15), accountId: "acc-1" },
  { id: "slog-2", service: "calendar", type: "sync", message: "Calendar event catalog parsed.", details: "18 event entries matched, 2 time conflicts resolved.", timestamp: getPastDateString(0, 10, 15), accountId: "acc-1" },
  { id: "slog-3", service: "sheets", type: "sync", message: "Contact sheet output updated.", details: "3 updated contact rows appended. Double-entry duplicates skipped.", timestamp: getPastDateString(0, 10, 15), accountId: "acc-1" },
  { id: "slog-4", service: "gmail", type: "oauth", message: "OAuth token checked successfully.", details: "Health check handshake took 78ms.", timestamp: getPastDateString(0, 10, 14), accountId: "acc-1" },
  { id: "slog-5", service: "gmail", type: "error", message: "OAuth authentication aborted. Google API 401 Unauthorized.", details: "Account token expired at 2026-06-27T02:00:00Z. Re-authentication required.", timestamp: getPastDateString(0, 2, 0), accountId: "acc-2" },
  { id: "slog-6", service: "drive", type: "warning", message: "Missing scope verification: drive.metadata.readonly", details: "Permission error encountered during subfolder metadata inspection.", timestamp: getPastDateString(0, 8, 0), accountId: "acc-3" }
];

const INITIAL_SYNC_JOBS: Record<GoogleServiceId, SyncJob> = {
  gmail: { service: "gmail", status: "idle", lastRun: getPastDateString(0, 10, 15), nextRun: getFutureDateString(0, 11, 15), itemsSynced: 48, errors: 0, autoSync: true },
  calendar: { service: "calendar", status: "idle", lastRun: getPastDateString(0, 10, 15), nextRun: getFutureDateString(0, 11, 15), itemsSynced: 18, errors: 0, autoSync: true },
  drive: { service: "drive", status: "idle", lastRun: getPastDateString(0, 10, 15), nextRun: getFutureDateString(0, 11, 15), itemsSynced: 4, errors: 0, autoSync: true },
  sheets: { service: "sheets", status: "idle", lastRun: getPastDateString(0, 10, 15), nextRun: getFutureDateString(0, 11, 15), itemsSynced: 3, errors: 0, autoSync: true },
  docs: { service: "docs", status: "idle", lastRun: getPastDateString(0, 10, 15), nextRun: getFutureDateString(0, 11, 15), itemsSynced: 2, errors: 0, autoSync: true },
  contacts: { service: "contacts", status: "idle", lastRun: getPastDateString(0, 10, 15), nextRun: getFutureDateString(0, 11, 15), itemsSynced: 124, errors: 0, autoSync: true },
  meet: { service: "meet", status: "idle", lastRun: getPastDateString(0, 10, 15), nextRun: getFutureDateString(0, 11, 15), itemsSynced: 3, errors: 0, autoSync: true },
  tasks: { service: "tasks", status: "idle", lastRun: getPastDateString(0, 10, 15), nextRun: getFutureDateString(0, 11, 15), itemsSynced: 3, errors: 0, autoSync: true },
  forms: { service: "forms", status: "idle", lastRun: getPastDateString(0, 10, 15), nextRun: getFutureDateString(0, 11, 15), itemsSynced: 2, errors: 0, autoSync: true },
  analytics: { service: "analytics", status: "idle", lastRun: getPastDateString(0, 10, 15), nextRun: getFutureDateString(0, 11, 15), itemsSynced: 1040, errors: 0, autoSync: true }
};

const INITIAL_API_METRICS: Record<GoogleServiceId, APIUsageMetric> = {
  gmail: {
    service: "gmail", callsToday: 820, callsLimit: 10000, quotaUsedPct: 8.2, avgLatencyMs: 65, errorRate: 0.1,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(40 + Math.random() * 50), latencyMs: Math.floor(60 + Math.random() * 10) }))
  },
  calendar: {
    service: "calendar", callsToday: 340, callsLimit: 5000, quotaUsedPct: 6.8, avgLatencyMs: 92, errorRate: 0.0,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(10 + Math.random() * 30), latencyMs: Math.floor(85 + Math.random() * 15) }))
  },
  drive: {
    service: "drive", callsToday: 180, callsLimit: 2000, quotaUsedPct: 9.0, avgLatencyMs: 145, errorRate: 0.3,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(5 + Math.random() * 15), latencyMs: Math.floor(130 + Math.random() * 30) }))
  },
  sheets: {
    service: "sheets", callsToday: 420, callsLimit: 5000, quotaUsedPct: 8.4, avgLatencyMs: 110, errorRate: 0.2,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(15 + Math.random() * 35), latencyMs: Math.floor(100 + Math.random() * 20) }))
  },
  docs: {
    service: "docs", callsToday: 85, callsLimit: 2000, quotaUsedPct: 4.25, avgLatencyMs: 125, errorRate: 0.0,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(2 + Math.random() * 10), latencyMs: Math.floor(115 + Math.random() * 20) }))
  },
  contacts: {
    service: "contacts", callsToday: 150, callsLimit: 1000, quotaUsedPct: 15.0, avgLatencyMs: 85, errorRate: 0.0,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(5 + Math.random() * 20), latencyMs: Math.floor(80 + Math.random() * 10) }))
  },
  meet: {
    service: "meet", callsToday: 45, callsLimit: 1000, quotaUsedPct: 4.5, avgLatencyMs: 180, errorRate: 0.5,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(1 + Math.random() * 5), latencyMs: Math.floor(160 + Math.random() * 40) }))
  },
  tasks: {
    service: "tasks", callsToday: 95, callsLimit: 2000, quotaUsedPct: 4.75, avgLatencyMs: 75, errorRate: 0.0,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(2 + Math.random() * 10), latencyMs: Math.floor(70 + Math.random() * 10) }))
  },
  forms: {
    service: "forms", callsToday: 110, callsLimit: 1000, quotaUsedPct: 11.0, avgLatencyMs: 98, errorRate: 0.1,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(4 + Math.random() * 12), latencyMs: Math.floor(90 + Math.random() * 15) }))
  },
  analytics: {
    service: "analytics", callsToday: 2450, callsLimit: 50000, quotaUsedPct: 4.9, avgLatencyMs: 105, errorRate: 0.4,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${8 + i}:00`, calls: Math.floor(100 + Math.random() * 200), latencyMs: Math.floor(95 + Math.random() * 20) }))
  }
};

const INITIAL_HEALTH: SystemHealth = {
  overallScore: 98,
  servicesHealthy: 9,
  servicesTotal: 10,
  lastChecked: getPastDateString(0, 10, 15),
  incidents: [
    { service: "gmail", message: "Subtle OAuth handshake timeout warnings cleared", since: getPastDateString(0, 9, 30) }
  ]
};

// ─── STATE INTERFACE ────────────────────────────────────────────────

interface GoogleWorkspaceState {
  // Accounts & Config
  accounts: GoogleAccount[];
  activeAccountId: string;
  tokens: OAuthToken[];
  syncJobs: Record<GoogleServiceId, SyncJob>;
  apiMetrics: Record<GoogleServiceId, APIUsageMetric>;
  health: SystemHealth;
  logs: SyncLog[];

  // Gmail Data
  gmailMessages: Record<string, GmailMessage[]>;
  gmailDrafts: Record<string, GmailDraft[]>;
  gmailTemplates: GmailTemplate[];
  gmailSignatures: GmailSignature[];
  gmailLabels: GmailLabel[];

  // Calendar Data
  calendarEvents: Record<string, CalendarEvent[]>;
  calendars: GoogleCalendar[];

  // Drive Data
  driveFiles: Record<string, DriveFile[]>;
  driveFolders: Record<string, DriveFolder[]>;
  driveUploads: DriveUploadTask[];

  // Sheets Data
  spreadsheets: Spreadsheet[];

  // Docs Data
  docs: GoogleDoc[];
  docTemplates: DocTemplate[];

  // Contacts Data
  contacts: GoogleContact[];

  // Meet Data
  meetings: MeetMeeting[];

  // Forms Data
  forms: GoogleForm[];

  // Tasks Data
  tasks: GoogleTask[];

  // Actions
  connectAccount: (email: string, displayName: string, avatarUrl?: string) => void;
  disconnectAccount: (id: string) => void;
  switchAccount: (id: string) => void;
  updateAccountStatus: (id: string, status: GoogleAccount["status"]) => void;
  refreshToken: (accountId: string, service: GoogleServiceId) => void;

  // Gmail Actions
  addDraft: (to: string, subject: string, body: string) => void;
  deleteDraft: (id: string) => void;
  sendMessage: (to: string, subject: string, body: string) => void;
  toggleStarEmail: (id: string) => void;
  deleteEmail: (id: string) => void;

  // Calendar Actions
  createEvent: (event: Omit<CalendarEvent, "id">) => void;
  deleteEvent: (id: string) => void;

  // Drive Actions
  uploadFile: (name: string, type: DriveFile["type"], size: string, folderId: string | null) => void;
  deleteFile: (id: string) => void;
  toggleStarFile: (id: string) => void;

  // Sheets Actions
  appendSheetRow: (spreadsheetId: string, tabId: string, row: string[]) => void;
  updateSheetRow: (spreadsheetId: string, tabId: string, rowIndex: number, row: string[]) => void;

  // Contacts Actions
  importContactsCSV: (csvData: string) => void;
  resolveContactDuplicate: (id: string, action: "merge" | "ignore") => void;

  // Meet Actions
  scheduleMeeting: (meeting: Omit<MeetMeeting, "id" | "status" | "meetLink">) => void;

  // Forms Actions
  submitFormResponse: (formId: string, answers: Record<string, string | string[]>, email?: string) => void;
  toggleFormsAcceptance: (formId: string) => void;

  // Tasks Actions
  toggleTaskCompleted: (id: string) => void;
  createTask: (title: string, priority: GoogleTask["priority"], notes?: string) => void;

  // Sync Actions
  triggerManualSync: (service: GoogleServiceId) => void;
  triggerBulkSync: () => void;
  toggleAutoSync: (service: GoogleServiceId) => void;
  addSyncLog: (service: GoogleServiceId, type: SyncLogType, message: string, details?: string) => void;
  clearLogs: () => void;
}

// ─── STORE CREATION ─────────────────────────────────────────────────

export const useGoogleWorkspace = create<GoogleWorkspaceState>((set, get) => ({
  accounts: INITIAL_ACCOUNTS,
  activeAccountId: "acc-1",
  tokens: INITIAL_TOKENS,
  syncJobs: INITIAL_SYNC_JOBS,
  apiMetrics: INITIAL_API_METRICS,
  health: INITIAL_HEALTH,
  logs: INITIAL_LOGS,

  gmailMessages: INITIAL_GMAIL_MESSAGES,
  gmailDrafts: INITIAL_GMAIL_DRAFTS,
  gmailTemplates: INITIAL_GMAIL_TEMPLATES,
  gmailSignatures: INITIAL_GMAIL_SIGNATURES,
  gmailLabels: INITIAL_GMAIL_LABELS,

  calendarEvents: INITIAL_CALENDAR_EVENTS,
  calendars: INITIAL_CALENDARS,

  driveFiles: INITIAL_DRIVE_FILES,
  driveFolders: INITIAL_DRIVE_FOLDERS,
  driveUploads: [],

  spreadsheets: INITIAL_SPREADSHEETS,

  docs: INITIAL_DOCS,
  docTemplates: INITIAL_DOC_TEMPLATES,

  contacts: INITIAL_CONTACTS,

  meetings: INITIAL_MEETINGS,

  forms: INITIAL_FORMS,

  tasks: INITIAL_TASKS,

  // ─── Actions ──────────────────────────────────────────────────────

  connectAccount: (email, displayName, avatarUrl) => {
    const newId = `acc-${Date.now()}`;
    const newAccount: GoogleAccount = {
      id: newId,
      email,
      displayName,
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop",
      isPrimary: false,
      isActive: false,
      connectedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
      status: "connected",
      storageUsedGB: 0.1,
      storageTotalGB: 15.0,
      healthScore: 100,
      enabledServices: ["gmail", "calendar", "drive", "sheets"]
    };

    set((state) => ({
      accounts: [...state.accounts, newAccount],
      gmailMessages: { ...state.gmailMessages, [newId]: [] },
      gmailDrafts: { ...state.gmailDrafts, [newId]: [] },
      calendarEvents: { ...state.calendarEvents, [newId]: [] },
      driveFiles: { ...state.driveFiles, [newId]: [] },
      driveFolders: { ...state.driveFolders, [newId]: [] }
    }));

    get().addSyncLog("gmail", "oauth", `Newly connected account: ${email}`, "Successfully authorized OAuth client.");
  },

  disconnectAccount: (id) => {
    set((state) => {
      const target = state.accounts.find(a => a.id === id);
      const updatedAccounts = state.accounts.filter(a => a.id !== id);
      
      // If active account was disconnected, fallback to first available
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

    get().addSyncLog("gmail", "oauth", `Account disconnected`, `Removed account ID ${id} scopes vault.`);
  },

  switchAccount: (id) => {
    set((state) => ({
      activeAccountId: id,
      accounts: state.accounts.map(a => ({
        ...a,
        isActive: a.id === id
      }))
    }));
    get().addSyncLog("gmail", "info", `Switched active Workspace workspace focus`, `Active account context updated.`);
  },

  updateAccountStatus: (id, status) => {
    set((state) => ({
      accounts: state.accounts.map(a =>
        a.id === id
          ? { ...a, status, healthScore: status === "connected" ? 100 : status === "expired" ? 60 : 40 }
          : a
      )
    }));
  },

  refreshToken: (accountId, service) => {
    // Simulate API delay, and update connection logs
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
    get().addSyncLog(service, "oauth", "Access token token rotation succeeded.", `Refreshed credential tokens for target services.`);
  },

  // ─── Gmail Actions ────────────────────────────────────────────────

  addDraft: (to, subject, body) => {
    const acc = get().activeAccountId;
    const newDraft: GmailDraft = {
      id: `dr-${Date.now()}`,
      to,
      subject,
      body,
      updatedAt: new Date().toISOString()
    };
    set((state) => ({
      gmailDrafts: {
        ...state.gmailDrafts,
        [acc]: [newDraft, ...(state.gmailDrafts[acc] || [])]
      }
    }));
    get().addSyncLog("gmail", "info", `Draft email created successfully.`, `To: ${to}, Subject: ${subject}`);
  },

  deleteDraft: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      gmailDrafts: {
        ...state.gmailDrafts,
        [acc]: (state.gmailDrafts[acc] || []).filter(d => d.id !== id)
      }
    }));
  },

  sendMessage: (to, subject, body) => {
    const acc = get().activeAccountId;
    const activeAccObj = get().accounts.find(a => a.id === acc);
    const fromStr = activeAccObj ? `${activeAccObj.displayName} <${activeAccObj.email}>` : "ExpendMore Admin";
    const newMessage: GmailMessage = {
      id: `msg-${Date.now()}`,
      threadId: `th-${Date.now()}`,
      from: fromStr,
      fromEmail: activeAccObj?.email || "",
      to: [to],
      subject,
      snippet: body.substring(0, 100),
      body,
      labels: ["SENT"],
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      receivedAt: new Date().toISOString()
    };

    set((state) => ({
      gmailMessages: {
        ...state.gmailMessages,
        [acc]: [newMessage, ...(state.gmailMessages[acc] || [])]
      }
    }));

    get().addSyncLog("gmail", "sync", `Dispatched outbound message`, `Outbound to: ${to}`);
  },

  toggleStarEmail: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      gmailMessages: {
        ...state.gmailMessages,
        [acc]: (state.gmailMessages[acc] || []).map(m =>
          m.id === id ? { ...m, isStarred: !m.isStarred } : m
        )
      }
    }));
  },

  deleteEmail: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      gmailMessages: {
        ...state.gmailMessages,
        [acc]: (state.gmailMessages[acc] || []).map(m =>
          m.id === id ? { ...m, labels: m.labels.includes("TRASH") ? m.labels : [...m.labels, "TRASH"] } : m
        )
      }
    }));
  },

  // ─── Calendar Actions ─────────────────────────────────────────────

  createEvent: (event) => {
    const acc = get().activeAccountId;
    const newEvent: CalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`
    };
    set((state) => ({
      calendarEvents: {
        ...state.calendarEvents,
        [acc]: [...(state.calendarEvents[acc] || []), newEvent]
      }
    }));
    get().addSyncLog("calendar", "sync", `Created calendar invitation: ${event.title}`, `Scheduled start: ${event.startTime}`);
  },

  deleteEvent: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      calendarEvents: {
        ...state.calendarEvents,
        [acc]: (state.calendarEvents[acc] || []).filter(e => e.id !== id)
      }
    }));
    get().addSyncLog("calendar", "info", `Removed scheduled event`, `Deleted calendar event node.`);
  },

  // ─── Drive Actions ────────────────────────────────────────────────

  uploadFile: (name, type, size, folderId) => {
    const acc = get().activeAccountId;
    const newFile: DriveFile = {
      id: `file-${Date.now()}`,
      name,
      type,
      mimeType: type === "pdf" ? "application/pdf" : type === "spreadsheet" ? "application/vnd.ms-excel" : "text/plain",
      size,
      sizeBytes: 1024 * 1024,
      parentFolderId: folderId,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      ownedBy: "ceo@anshumanenterprises1119.in",
      isShared: false,
      sharedWith: [],
      webViewLink: "https://drive.google.com/file/d/upload-demo/view",
      starred: false,
      trashed: false
    };

    set((state) => ({
      driveFiles: {
        ...state.driveFiles,
        [acc]: [newFile, ...(state.driveFiles[acc] || [])]
      }
    }));
    get().addSyncLog("drive", "sync", `Uploaded backup asset: ${name}`, `Target parent folder: ${folderId || "root"}`);
  },

  deleteFile: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      driveFiles: {
        ...state.driveFiles,
        [acc]: (state.driveFiles[acc] || []).map(f =>
          f.id === id ? { ...f, trashed: true } : f
        )
      }
    }));
  },

  toggleStarFile: (id) => {
    const acc = get().activeAccountId;
    set((state) => ({
      driveFiles: {
        ...state.driveFiles,
        [acc]: (state.driveFiles[acc] || []).map(f =>
          f.id === id ? { ...f, starred: !f.starred } : f
        )
      }
    }));
  },

  // ─── Sheets Actions ───────────────────────────────────────────────

  appendSheetRow: (spreadsheetId, tabId, row) => {
    set((state) => ({
      spreadsheets: state.spreadsheets.map(sheet => {
        if (sheet.id !== spreadsheetId) return sheet;
        const currentData = sheet.rowData[tabId] || [];
        return {
          ...sheet,
          rowData: {
            ...sheet.rowData,
            [tabId]: [...currentData, row]
          }
        };
      })
    }));
    get().addSyncLog("sheets", "sync", "Appended custom data row into target table.", `Spreadsheet: ${spreadsheetId}`);
  },

  updateSheetRow: (spreadsheetId, tabId, rowIndex, row) => {
    set((state) => ({
      spreadsheets: state.spreadsheets.map(sheet => {
        if (sheet.id !== spreadsheetId) return sheet;
        const currentData = [...(sheet.rowData[tabId] || [])];
        if (rowIndex >= 0 && rowIndex < currentData.length) {
          currentData[rowIndex] = row;
        }
        return {
          ...sheet,
          rowData: {
            ...sheet.rowData,
            [tabId]: currentData
          }
        };
      })
    }));
  },

  // ─── Contacts Actions ─────────────────────────────────────────────

  importContactsCSV: (csvData) => {
    // Parse simulated entries
    const rows = csvData.split("\n").filter(Boolean);
    const newContacts: GoogleContact[] = rows.map((r, idx) => {
      const parts = r.split(",");
      return {
        id: `cnt-csv-${Date.now()}-${idx}`,
        displayName: parts[0] || "CSV Contact",
        firstName: parts[0]?.split(" ")[0] || "CSV",
        lastName: parts[0]?.split(" ")[1] || "Contact",
        email: parts[1] || "imported@email.com",
        phone: parts[2] || "+1 (555) 0123",
        company: parts[3] || "Imported Corp",
        jobTitle: parts[4] || "Manager",
        groups: ["Imported Contacts"],
        syncedAt: new Date().toISOString()
      };
    });

    set((state) => ({
      contacts: [...newContacts, ...state.contacts]
    }));
    get().addSyncLog("contacts", "sync", `Contacts CSV importing pipeline executed.`, `Created ${newContacts.length} new contact card references.`);
  },

  resolveContactDuplicate: (id, action) => {
    set((state) => {
      if (action === "ignore") {
        return {
          contacts: state.contacts.map(c => c.id === id ? { ...c, isDuplicate: false } : c)
        };
      }
      // Merge: remove duplicate, mark primary clean
      return {
        contacts: state.contacts.filter(c => c.id !== id)
      };
    });
  },

  // ─── Meet Actions ─────────────────────────────────────────────────

  scheduleMeeting: (meeting) => {
    const newId = `meet-${Date.now()}`;
    const newMeet: MeetMeeting = {
      ...meeting,
      id: newId,
      status: "upcoming",
      meetLink: `https://meet.google.com/meet-${Math.floor(100 + Math.random()*900)}-${Math.floor(100 + Math.random()*900)}`
    };

    set((state) => ({
      meetings: [newMeet, ...state.meetings]
    }));
    get().addSyncLog("meet", "sync", `Created Meet conference credentials`, `Title: ${meeting.title}`);
  },

  // ─── Forms Actions ────────────────────────────────────────────────

  submitFormResponse: (formId, answers, email) => {
    const newResp: FormResponse = {
      id: `resp-${Date.now()}`,
      formId,
      submittedAt: new Date().toISOString(),
      respondentEmail: email,
      answers
    };

    set((state) => ({
      forms: state.forms.map(f =>
        f.id === formId
          ? {
              ...f,
              responseCount: f.responseCount + 1,
              responses: [newResp, ...f.responses]
            }
          : f
      )
    }));
    get().addSyncLog("forms", "sync", `Webhook notification: Form response submitted`, `Form ID: ${formId}`);
  },

  toggleFormsAcceptance: (formId) => {
    set((state) => ({
      forms: state.forms.map(f =>
        f.id === formId ? { ...f, isAcceptingResponses: !f.isAcceptingResponses } : f
      )
    }));
  },

  // ─── Tasks Actions ────────────────────────────────────────────────

  toggleTaskCompleted: (id) => {
    set((state) => ({
      tasks: state.tasks.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
          : t
      )
    }));
  },

  createTask: (title, priority, notes) => {
    const newTask: GoogleTask = {
      id: `tsk-${Date.now()}`,
      title,
      notes: notes || "",
      completed: false,
      priority
    };
    set((state) => ({
      tasks: [newTask, ...state.tasks]
    }));
  },

  // ─── Sync Actions ─────────────────────────────────────────────────

  triggerManualSync: (service) => {
    // 1. Mark syncing
    set((state) => ({
      syncJobs: {
        ...state.syncJobs,
        [service]: { ...state.syncJobs[service], status: "running" }
      }
    }));

    // 2. Simulate complete sync after short delay
    setTimeout(() => {
      set((state) => {
        const job = state.syncJobs[service];
        const newCount = job.itemsSynced + Math.floor(Math.random() * 5);
        return {
          syncJobs: {
            ...state.syncJobs,
            [service]: {
              ...job,
              status: "idle",
              lastRun: new Date().toISOString(),
              nextRun: getFutureDateString(0, new Date().getHours() + 1),
              itemsSynced: newCount
            }
          }
        };
      });

      // Update API usage metrics today
      set((state) => {
        const metric = state.apiMetrics[service];
        return {
          apiMetrics: {
            ...state.apiMetrics,
            [service]: {
              ...metric,
              callsToday: metric.callsToday + Math.floor(5 + Math.random() * 10),
              avgLatencyMs: Math.max(50, metric.avgLatencyMs + Math.floor(Math.random() * 10 - 5))
            }
          }
        };
      });

      get().addSyncLog(service, "sync", `Manual synchronizer job finished completely`, `Updated record changes synced successfully.`);
    }, 1500);
  },

  triggerBulkSync: () => {
    // Trigger parallel sync for all services
    const services = Object.keys(get().syncJobs) as GoogleServiceId[];
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
    const newLog: SyncLog = {
      id: `slog-${Date.now()}`,
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
