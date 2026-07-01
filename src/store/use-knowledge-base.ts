import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  KnowledgeCollection,
  KnowledgeDocument,
  DocumentChunk,
  EmbeddingConfig,
  SyncJob,
  ProcessingQueueItem,
  KnowledgeAuditLog,
  CollectionLabelColor,
  DocumentStatus
} from "@/types/knowledge-base";

interface KnowledgeBaseState {
  collections: KnowledgeCollection[];
  documents: KnowledgeDocument[];
  chunks: Record<string, DocumentChunk[]>; // docId -> DocumentChunk[]
  embeddingConfig: EmbeddingConfig;
  syncJobs: SyncJob[];
  queue: ProcessingQueueItem[];
  auditLogs: KnowledgeAuditLog[];

  // Action helpers
  addCollection: (name: string, description: string, color: CollectionLabelColor, permissions: KnowledgeCollection["permissions"]) => void;
  deleteCollection: (id: string) => void;
  archiveCollection: (id: string) => void;
  
  uploadDocument: (name: string, mimeType: string, size: string, collectionId: string) => void;
  deleteDocument: (id: string) => void;
  duplicateDocument: (id: string) => void;
  
  syncCollection: (collectionId: string) => void;
  rebuildEmbedding: () => void;
  
  clearQueue: () => void;
  addAuditLog: (action: KnowledgeAuditLog["action"], description: string) => void;
}

const initialCollections: KnowledgeCollection[] = [
  { id: "col-1", name: "Corporate SLA Contracts", description: "Standard SLA contracts outlines and pricing guides.", color: "navy", category: "Legal", tags: ["contracts", "pricing"], isArchived: false, documentCount: 2, createdTime: new Date(Date.now() - 3600*1000*24*30).toISOString(), permissions: "workspace" },
  { id: "col-2", name: "ExpendMore Developer Wiki", description: "Internal developers onboarding wiki details and environment setup.", color: "purple", category: "Engineering", tags: ["wiki", "setup"], isArchived: false, documentCount: 2, createdTime: new Date(Date.now() - 3600*1000*24*15).toISOString(), permissions: "team" },
  { id: "col-3", name: "WhatsApp Campaigns Guidelines", description: "Guidelines parameters for broadcast triggers compliance.", color: "green", category: "Marketing", tags: ["marketing", "whatsapp"], isArchived: false, documentCount: 1, createdTime: new Date(Date.now() - 3600*1000*24*5).toISOString(), permissions: "role" }
];

const initialDocs: KnowledgeDocument[] = [
  { id: "doc-1", collectionId: "col-1", name: "SLA_Standard_v2.1.pdf", mimeType: "application/pdf", size: "340 KB", status: "completed", chunkCount: 14, uploadedTime: new Date(Date.now() - 3600*1000*24*29).toISOString(), version: "v2.1" },
  { id: "doc-2", collectionId: "col-1", name: "SLA_Pricing_Tiers.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: "120 KB", status: "completed", chunkCount: 6, uploadedTime: new Date(Date.now() - 3600*1000*24*28).toISOString(), version: "v1.0" },
  { id: "doc-3", collectionId: "col-2", name: "Developer_Setup_Guide.md", mimeType: "text/markdown", size: "18 KB", status: "completed", chunkCount: 4, uploadedTime: new Date(Date.now() - 3600*1000*24*14).toISOString(), version: "v1.4" },
  { id: "doc-4", collectionId: "col-2", name: "ExpendMore_Arch_Diagram.pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", size: "2.4 MB", status: "completed", chunkCount: 9, uploadedTime: new Date(Date.now() - 3600*1000*24*10).toISOString(), version: "v2.0" },
  { id: "doc-5", collectionId: "col-3", name: "WhatsApp_Policy_2026.pdf", mimeType: "application/pdf", size: "520 KB", status: "completed", chunkCount: 22, uploadedTime: new Date(Date.now() - 3600*1000*24*4).toISOString(), version: "v1.0" }
];

const initialChunks: Record<string, DocumentChunk[]> = {
  "doc-3": [
    { id: "chk-1", documentId: "doc-3", content: "To initialize the local developer sandbox environment, pull the latest repo branch: git clone api-expendmore.git. Ensure Next.js is configured on port 3000.", tokenCount: 85, pageNumber: 1, metadata: { section: "Sandbox Setup", source: "Developer_Setup_Guide.md" } },
    { id: "chk-2", documentId: "doc-3", content: "Set environment properties: COPY .env.example .env.local and configure SUPABASE_URL client endpoint key flags before starting npm run dev.", tokenCount: 64, pageNumber: 2, metadata: { section: "Env Setup", source: "Developer_Setup_Guide.md" } }
  ],
  "doc-5": [
    { id: "chk-3", documentId: "doc-5", content: "Meta policy rules guidelines require broadcast templates opt-in approvals. Spam rates exceeding 1.2% result in temporary sandbox lock warnings.", tokenCount: 92, pageNumber: 1, metadata: { section: "Template Policy", source: "WhatsApp_Policy_2026.pdf" } },
    { id: "chk-4", documentId: "doc-5", content: "Interactive options must include unsubscribe triggers. Broadcast schedules should be spaced by 200ms increments to restrict congestion rate limits.", tokenCount: 88, pageNumber: 3, metadata: { section: "Rate Limits Compliance", source: "WhatsApp_Policy_2026.pdf" } }
  ]
};

const initialEmbedding: EmbeddingConfig = {
  modelId: "text-embedding-3-small",
  dimensions: 1536,
  vectorCount: 55,
  status: "idle",
  lastRebuiltTime: new Date(Date.now() - 3600*1000*24*2).toISOString()
};

const initialSync: SyncJob[] = [
  { id: "sync-1", collectionId: "col-1", sourceName: "OneDrive Legal folder", scheduleRate: "daily", lastSyncTime: new Date(Date.now() - 3600*1000*12).toISOString(), status: "success" },
  { id: "sync-2", collectionId: "col-2", sourceName: "GitHub Repository Wiki", scheduleRate: "hourly", lastSyncTime: new Date(Date.now() - 3600*1000*2).toISOString(), status: "success" }
];

const initialQueue: ProcessingQueueItem[] = [
  { id: "q-1", documentId: "doc-5", status: "completed", progressPercentage: 100, retryCount: 0 }
];

const initialAudit: KnowledgeAuditLog[] = [
  { id: "aud-1", timestamp: new Date(Date.now() - 3600*1000*2).toISOString(), action: "document_upload", operator: "Admin (Priya)", description: "Uploaded document: WhatsApp_Policy_2026.pdf into Campaigns Guidelines." },
  { id: "aud-2", timestamp: new Date(Date.now() - 3600*1000*12).toISOString(), action: "embedding_rebuilt", operator: "System", description: "Rebuilt vector embedding index using text-embedding-3-small." }
];

export const useKnowledgeBase = create<KnowledgeBaseState>()(
  persist(
    (set) => ({
      collections: initialCollections,
      documents: initialDocs,
      chunks: initialChunks,
      embeddingConfig: initialEmbedding,
      syncJobs: initialSync,
      queue: initialQueue,
      auditLogs: initialAudit,

      addCollection: (name, description, color, permissions) => {
        set((state) => {
          const id = `col-${Date.now()}`;
          const newCol: KnowledgeCollection = {
            id,
            name,
            description,
            color,
            category: "General",
            tags: [],
            isArchived: false,
            documentCount: 0,
            createdTime: new Date().toISOString(),
            permissions
          };

          const newAudit: KnowledgeAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "collection_created",
            operator: "Admin (Priya)",
            description: `Created new knowledge collection: ${name}`
          };

          return {
            collections: [...state.collections, newCol],
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      deleteCollection: (id) => {
        set((state) => {
          const colName = state.collections.find(c => c.id === id)?.name || id;
          const newAudit: KnowledgeAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "permission_change",
            operator: "Admin (Priya)",
            description: `Deleted collection directory: ${colName}`
          };

          return {
            collections: state.collections.filter((c) => c.id !== id),
            documents: state.documents.filter((d) => d.collectionId !== id),
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      archiveCollection: (id) => {
        set((state) => ({
          collections: state.collections.map((c) => (c.id === id ? { ...c, isArchived: !c.isArchived } : c))
        }));
      },

      uploadDocument: (name, mimeType, size, collectionId) => {
        set((state) => {
          const id = `doc-${Date.now()}`;
          const newDoc: KnowledgeDocument = {
            id,
            collectionId,
            name,
            mimeType,
            size,
            status: "queued" as const,
            chunkCount: 0,
            uploadedTime: new Date().toISOString(),
            version: "v1.0"
          };

          const qItem: ProcessingQueueItem = {
            id: `q-${Date.now()}`,
            documentId: id,
            status: "queued" as const,
            progressPercentage: 0,
            retryCount: 0
          };

          const newAudit: KnowledgeAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "document_upload",
            operator: "Admin (Priya)",
            description: `Uploaded document: ${name}`
          };

          // Update docCount in target collection
          const updatedCols = state.collections.map((c) =>
            c.id === collectionId ? { ...c, documentCount: c.documentCount + 1 } : c
          );

          return {
            documents: [newDoc, ...state.documents],
            queue: [qItem, ...state.queue],
            collections: updatedCols,
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      deleteDocument: (id) => {
        set((state) => {
          const doc = state.documents.find((d) => d.id === id);
          if (!doc) return {};

          const colId = doc.collectionId;
          const updatedCols = state.collections.map((c) =>
            c.id === colId ? { ...c, documentCount: Math.max(0, c.documentCount - 1) } : c
          );

          const newAudit: KnowledgeAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "document_delete",
            operator: "Admin (Priya)",
            description: `Deleted document: ${doc.name}`
          };

          return {
            documents: state.documents.filter((d) => d.id !== id),
            collections: updatedCols,
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      duplicateDocument: (id) => {
        set((state) => {
          const doc = state.documents.find((d) => d.id === id);
          if (!doc) return {};

          const dupId = `doc-${Date.now()}`;
          const newDoc: KnowledgeDocument = {
            ...doc,
            id: dupId,
            name: `Copy of ${doc.name}`,
            uploadedTime: new Date().toISOString(),
            status: "completed" as const
          };

          const updatedCols = state.collections.map((c) =>
            c.id === doc.collectionId ? { ...c, documentCount: c.documentCount + 1 } : c
          );

          return {
            documents: [newDoc, ...state.documents],
            collections: updatedCols
          };
        });
      },

      syncCollection: (collectionId) => {
        set((state) => {
          const cName = state.collections.find(c => c.id === collectionId)?.name || collectionId;
          const newAudit: KnowledgeAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "sync_triggered",
            operator: "Admin (Priya)",
            description: `Triggered manual repository sync for collection: ${cName}`
          };

          return {
            syncJobs: state.syncJobs.map((job) =>
              job.collectionId === collectionId
                ? { ...job, lastSyncTime: new Date().toISOString(), status: "success" as const }
                : job
            ),
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      rebuildEmbedding: () => {
        set((state) => {
          const newAudit: KnowledgeAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "embedding_rebuilt",
            operator: "Admin (Priya)",
            description: "Manually triggered vectors embedding partition rebuilt indexing"
          };

          return {
            embeddingConfig: {
              ...state.embeddingConfig,
              lastRebuiltTime: new Date().toISOString(),
              vectorCount: state.embeddingConfig.vectorCount + 10 // mock rebuild increment
            },
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      clearQueue: () => {
        set(() => ({
          queue: []
        }));
      },

      addAuditLog: (action, description) => {
        set((state) => ({
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action,
              operator: "Admin (Priya)",
              description
            },
            ...state.auditLogs
          ]
        }));
      }
    }),
    {
      name: "expendmore-knowledge-base-store",
      partialize: (state) => ({
        collections: state.collections,
        documents: state.documents,
        embeddingConfig: state.embeddingConfig,
        syncJobs: state.syncJobs,
        templates: state.queue
      })
    }
  )
);
