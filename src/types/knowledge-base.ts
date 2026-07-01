export type CollectionLabelColor = "navy" | "green" | "sky" | "amber" | "purple" | "rose" | "teal";

export interface KnowledgeCollection {
  id: string;
  name: string;
  description?: string;
  color: CollectionLabelColor;
  category: string;
  tags: string[];
  isArchived: boolean;
  documentCount: number;
  createdTime: string;
  permissions: "workspace" | "team" | "role" | "private";
}

export type DocumentStatus = "queued" | "processing" | "completed" | "failed";

export interface KnowledgeDocument {
  id: string;
  collectionId: string;
  name: string;
  mimeType: string;
  size: string;
  status: DocumentStatus;
  chunkCount: number;
  uploadedTime: string;
  sourceUrl?: string;
  version: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  tokenCount: number;
  pageNumber?: number;
  similarityScore?: number; // matched score in search
  metadata: Record<string, string | number>;
}

export interface EmbeddingConfig {
  modelId: string;
  dimensions: number; // e.g. 1536
  vectorCount: number;
  status: "idle" | "indexing" | "synced";
  lastRebuiltTime?: string;
}

export interface SyncJob {
  id: string;
  collectionId: string;
  sourceName: string; // e.g. "Sitemap Crawl"
  scheduleRate: "hourly" | "daily" | "weekly" | "manual";
  lastSyncTime: string;
  status: "success" | "failed" | "running";
}

export interface ProcessingQueueItem {
  id: string;
  documentId: string;
  status: DocumentStatus;
  progressPercentage: number;
  retryCount: number;
  failReason?: string;
}

export interface KnowledgeAuditLog {
  id: string;
  timestamp: string;
  action: "document_upload" | "document_delete" | "collection_created" | "permission_change" | "sync_triggered" | "embedding_rebuilt";
  operator: string;
  description: string;
}
