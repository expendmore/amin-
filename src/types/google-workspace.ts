// =============================================
// Google Workspace Integration Suite — Types
// =============================================

// ─── Account & OAuth ──────────────────────────────────────────────

export type GoogleServiceId =
  | "gmail"
  | "calendar"
  | "drive"
  | "sheets"
  | "docs"
  | "contacts"
  | "meet"
  | "tasks"
  | "forms"
  | "analytics";

export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "syncing"
  | "permission_error"
  | "expired"
  | "maintenance";

export interface GoogleAccount {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  isPrimary: boolean;
  isActive: boolean;
  connectedAt: string;
  lastSyncedAt: string;
  status: ConnectionStatus;
  storageUsedGB: number;
  storageTotalGB: number;
  enabledServices: GoogleServiceId[];
  healthScore: number; // 0–100
}

export interface OAuthToken {
  id: string;
  accountId: string;
  service: GoogleServiceId;
  status: "valid" | "expired" | "revoked" | "refreshing";
  scopes: string[];
  issuedAt: string;
  expiresAt: string;
  refreshToken: string; // obfuscated
  accessToken: string;  // obfuscated
}

// ─── Gmail ───────────────────────────────────────────────────────

export type EmailLabel =
  | "INBOX"
  | "SENT"
  | "DRAFT"
  | "STARRED"
  | "IMPORTANT"
  | "SPAM"
  | "TRASH"
  | string;

export interface GmailLabel {
  id: string;
  name: string;
  color: string;
  messageCount: number;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  from: string;
  fromEmail: string;
  to: string[];
  subject: string;
  snippet: string;
  body: string;
  labels: EmailLabel[];
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  receivedAt: string;
}

export interface GmailDraft {
  id: string;
  to: string;
  subject: string;
  body: string;
  updatedAt: string;
}

export interface GmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

export interface GmailSignature {
  id: string;
  name: string;
  html: string;
  isDefault: boolean;
}

// ─── Calendar ────────────────────────────────────────────────────

export type EventStatus = "confirmed" | "tentative" | "cancelled";
export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly" | "none";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string[];
  organizer: string;
  status: EventStatus;
  isAllDay: boolean;
  recurrence: RecurrenceType;
  color: string;
  calendarId: string;
  meetLink?: string;
}

export interface GoogleCalendar {
  id: string;
  name: string;
  color: string;
  isPrimary: boolean;
  timezone: string;
  eventCount: number;
}

// ─── Drive ───────────────────────────────────────────────────────

export type DriveFileType =
  | "document"
  | "spreadsheet"
  | "presentation"
  | "pdf"
  | "image"
  | "video"
  | "folder"
  | "other";

export interface DriveFile {
  id: string;
  name: string;
  type: DriveFileType;
  mimeType: string;
  size: string;
  sizeBytes: number;
  parentFolderId: string | null;
  createdAt: string;
  modifiedAt: string;
  ownedBy: string;
  isShared: boolean;
  sharedWith: string[];
  webViewLink: string;
  thumbnailUrl?: string;
  starred: boolean;
  trashed: boolean;
}

export interface DriveFolder {
  id: string;
  name: string;
  parentFolderId: string | null;
  itemCount: number;
  createdAt: string;
  color?: string;
}

export interface DriveUploadTask {
  id: string;
  fileName: string;
  progress: number; // 0–100
  status: "uploading" | "complete" | "error";
}

// ─── Sheets ──────────────────────────────────────────────────────

export interface SheetTab {
  id: string;
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface Spreadsheet {
  id: string;
  title: string;
  url: string;
  ownedBy: string;
  lastModified: string;
  tabs: SheetTab[];
  isShared: boolean;
  rowData: Record<string, string[][]>; // tabId → rows
}

// ─── Docs ────────────────────────────────────────────────────────

export interface GoogleDoc {
  id: string;
  title: string;
  url: string;
  ownedBy: string;
  lastModified: string;
  wordCount: number;
  isShared: boolean;
  starred: boolean;
  templateCategory?: string;
}

export interface DocTemplate {
  id: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  description: string;
}

// ─── Contacts ────────────────────────────────────────────────────

export interface GoogleContact {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  avatarUrl?: string;
  groups: string[];
  lastContactedAt?: string;
  isDuplicate?: boolean;
  syncedAt: string;
}

// ─── Meet ────────────────────────────────────────────────────────

export type MeetingStatus = "upcoming" | "live" | "ended" | "cancelled";

export interface MeetMeeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  status: MeetingStatus;
  meetLink: string;
  hostEmail: string;
  attendees: string[];
  recordingUrl?: string;
}

// ─── Forms ───────────────────────────────────────────────────────

export interface FormField {
  id: string;
  type: "short_text" | "paragraph" | "multiple_choice" | "checkbox" | "dropdown" | "date" | "file";
  question: string;
  required: boolean;
  options?: string[];
}

export interface FormResponse {
  id: string;
  formId: string;
  submittedAt: string;
  respondentEmail?: string;
  answers: Record<string, string | string[]>;
}

export interface GoogleForm {
  id: string;
  title: string;
  description: string;
  url: string;
  responseCount: number;
  isAcceptingResponses: boolean;
  createdAt: string;
  lastModified: string;
  fields: FormField[];
  responses: FormResponse[];
}

// ─── Tasks ───────────────────────────────────────────────────────

export interface GoogleTask {
  id: string;
  title: string;
  notes: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  priority: "low" | "medium" | "high";
}

// ─── Sync & Logs ─────────────────────────────────────────────────

export type SyncLogType = "sync" | "error" | "warning" | "oauth" | "info";

export interface SyncLog {
  id: string;
  service: GoogleServiceId;
  type: SyncLogType;
  message: string;
  details?: string;
  timestamp: string;
  accountId: string;
}

export interface SyncJob {
  service: GoogleServiceId;
  status: "idle" | "running" | "paused" | "error";
  lastRun: string;
  nextRun: string;
  itemsSynced: number;
  errors: number;
  autoSync: boolean;
}

// ─── Monitoring ──────────────────────────────────────────────────

export interface APIUsageMetric {
  service: GoogleServiceId;
  callsToday: number;
  callsLimit: number;
  quotaUsedPct: number;
  avgLatencyMs: number;
  errorRate: number;
  history: Array<{ hour: string; calls: number; latencyMs: number }>;
}

export interface SystemHealth {
  overallScore: number;
  servicesHealthy: number;
  servicesTotal: number;
  lastChecked: string;
  incidents: Array<{ service: GoogleServiceId; message: string; since: string }>;
}
