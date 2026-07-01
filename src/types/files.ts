export type DAMFileType = "image" | "video" | "audio" | "document" | "archive" | "code" | "other";

export type DAMFileStatus = "queued" | "uploading" | "processing" | "completed" | "failed";

export type FolderColor = "blue" | "green" | "purple" | "orange" | "red" | "gray";

export interface DAMFile {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  type: DAMFileType;
  mimeType: string;
  folderId: string | null; // null represents root
  isFavorite: boolean;
  isShared: boolean;
  isTrashed: boolean;
  status: DAMFileStatus;
  uploadedTime: string;
  version: string;
  tags: string[];
  description?: string;
  customMetadata?: Record<string, string>;
}

export interface DAMFolder {
  id: string;
  name: string;
  parentId: string | null;
  color: FolderColor;
  createdTime: string;
  isArchived: boolean;
}

export interface DAMShareLink {
  id: string;
  fileId: string;
  url: string;
  hasPassword?: boolean;
  password?: string;
  expirationDate?: string;
  downloadLimit?: number;
  currentDownloads: number;
}

export interface DAMAuditLog {
  id: string;
  timestamp: string;
  action: "upload" | "delete" | "permission_change" | "sharing_link_created" | "download" | "move";
  operator: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: "upload" | "delete" | "share" | "rename" | "move";
  title: string;
}
