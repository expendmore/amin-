// =============================================
// Microsoft 365 Integration Suite — Types
// =============================================

export type MicrosoftServiceId =
  | "outlook"
  | "calendar"
  | "onedrive"
  | "excel"
  | "word"
  | "powerpoint"
  | "teams"
  | "onenote"
  | "planner"
  | "todo"
  | "sharepoint"
  | "powerbi";

export type MSConnectionStatus =
  | "connected"
  | "disconnected"
  | "syncing"
  | "permission_error"
  | "expired"
  | "maintenance";

export interface MicrosoftAccount {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  tenantId: string;
  tenantName: string;
  isPrimary: boolean;
  isActive: boolean;
  connectedAt: string;
  lastSyncedAt: string;
  status: MSConnectionStatus;
  storageUsedGB: number;
  storageTotalGB: number;
  enabledServices: MicrosoftServiceId[];
  healthScore: number; // 0-100
}

export interface MSOAuthToken {
  id: string;
  accountId: string;
  service: MicrosoftServiceId;
  status: "valid" | "expired" | "revoked" | "refreshing";
  scopes: string[];
  issuedAt: string;
  expiresAt: string;
  refreshToken: string; // obfuscated
  accessToken: string;  // obfuscated
}

// ─── Outlook ─────────────────────────────────────────────────────

export type OutlookLabel =
  | "Inbox"
  | "Sent Items"
  | "Drafts"
  | "Archive"
  | "Deleted Items"
  | string;

export interface OutlookFolder {
  id: string;
  name: string;
  unreadCount: number;
  totalCount: number;
}

export interface OutlookMessage {
  id: string;
  conversationId: string;
  fromName: string;
  fromEmail: string;
  to: string[];
  subject: string;
  bodyPreview: string;
  bodyContent: string;
  folder: OutlookLabel;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  receivedDateTime: string;
}

export interface OutlookDraft {
  id: string;
  to: string;
  subject: string;
  body: string;
  lastModifiedDateTime: string;
}

export interface OutlookTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

// ─── Calendar ────────────────────────────────────────────────────

export interface MSCalendarEvent {
  id: string;
  subject: string;
  bodyPreview: string;
  start: string;
  end: string;
  location: string;
  attendees: string[];
  organizer: string;
  status: "confirmed" | "tentative" | "cancelled";
  isAllDay: boolean;
  isRecurring: boolean;
  color: string;
  calendarId: string;
  teamsMeetingUrl?: string;
}

export interface MSCalendar {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  timezone: string;
}

// ─── OneDrive ────────────────────────────────────────────────────

export type OneDriveItemType = "folder" | "file";

export interface OneDriveItem {
  id: string;
  name: string;
  type: OneDriveItemType;
  mimeType?: string;
  size: string;
  sizeBytes: number;
  parentFolderId: string | null;
  createdDateTime: string;
  lastModifiedDateTime: string;
  createdBy: string;
  isShared: boolean;
  sharedWithEmails: string[];
  webUrl: string;
  starred: boolean;
}

export interface OneDriveUploadTask {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

// ─── Excel ───────────────────────────────────────────────────────

export interface ExcelWorksheet {
  id: string;
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface ExcelWorkbook {
  id: string;
  name: string;
  webUrl: string;
  lastModifiedBy: string;
  lastModifiedDateTime: string;
  worksheets: ExcelWorksheet[];
  rowData: Record<string, string[][]>; // tabId -> rows
}

// ─── Word & PowerPoint ──────────────────────────────────────────

export interface WordDocument {
  id: string;
  title: string;
  webUrl: string;
  lastModifiedBy: string;
  lastModifiedDateTime: string;
  wordCount: number;
  templateCategory?: string;
}

export interface PowerPointPresentation {
  id: string;
  title: string;
  webUrl: string;
  lastModifiedBy: string;
  lastModifiedDateTime: string;
  slideCount: number;
}

// ─── Teams ───────────────────────────────────────────────────────

export interface TeamsChannel {
  id: string;
  name: string;
  description: string;
}

export interface TeamsChat {
  id: string;
  topic: string;
  chatType: "oneOnOne" | "group";
  lastMessagePreview: string;
  lastModifiedDateTime: string;
}

export interface TeamsMessage {
  id: string;
  chatIdOrChannelId: string;
  fromName: string;
  fromEmail: string;
  bodyContent: string;
  createdDateTime: string;
}

export interface TeamsMember {
  id: string;
  displayName: string;
  email: string;
  role: "owner" | "member" | "guest";
}

// ─── SharePoint ──────────────────────────────────────────────────

export interface SharePointSite {
  id: string;
  displayName: string;
  name: string;
  webUrl: string;
  description: string;
}

export interface SharePointLibrary {
  id: string;
  name: string;
  siteId: string;
  description: string;
}

// ─── Power BI ────────────────────────────────────────────────────

export interface PowerBIDashboard {
  id: string;
  displayName: string;
  webUrl: string;
}

export interface PowerBIReport {
  id: string;
  name: string;
  datasetId: string;
  webUrl: string;
  embedUrl: string;
}

export interface PowerBIDataset {
  id: string;
  name: string;
  configuredBy: string;
  createdDateTime: string;
  refreshStatus: "completed" | "failed" | "unknown";
  lastRefreshTime: string;
}

// ─── Planner & To Do ─────────────────────────────────────────────

export interface PlannerTask {
  id: string;
  title: string;
  percentComplete: number;
  dueDateTime?: string;
  assignees: string[];
}

export interface MicrosoftToDoTask {
  id: string;
  title: string;
  notes?: string;
  dueDateTime?: string;
  status: "notStarted" | "completed";
  importance: "low" | "normal" | "high";
}

// ─── Logs & Telemetry ────────────────────────────────────────────

export type MSLogType = "sync" | "error" | "warning" | "oauth" | "info";

export interface MicrosoftSyncLog {
  id: string;
  service: MicrosoftServiceId;
  type: MSLogType;
  message: string;
  details?: string;
  timestamp: string;
  accountId: string;
}

export interface MicrosoftSyncJob {
  service: MicrosoftServiceId;
  status: "idle" | "running" | "paused" | "error";
  lastRun: string;
  nextRun: string;
  itemsSynced: number;
  errors: number;
  autoSync: boolean;
}

export interface MicrosoftAPIUsage {
  service: MicrosoftServiceId;
  callsToday: number;
  callsLimit: number;
  quotaUsedPct: number;
  avgLatencyMs: number;
  errorRate: number;
  history: Array<{ hour: string; calls: number; latencyMs: number }>;
}
