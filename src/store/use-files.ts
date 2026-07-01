import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DAMFile,
  DAMFolder,
  DAMShareLink,
  DAMAuditLog,
  ActivityItem,
  FolderColor,
  DAMFileType
} from "@/types/files";

interface FilesState {
  files: DAMFile[];
  folders: DAMFolder[];
  sharingLinks: DAMShareLink[];
  auditLogs: DAMAuditLog[];
  activities: ActivityItem[];
  queue: DAMFile[];

  addFolder: (name: string, parentId: string | null, color: FolderColor) => void;
  renameFolder: (id: string, newName: string) => void;
  deleteFolder: (id: string) => void;
  duplicateFolder: (id: string) => void;
  
  uploadFile: (name: string, size: string, sizeBytes: number, type: DAMFileType, mimeType: string, folderId: string | null) => void;
  deleteFile: (id: string) => void;
  permanentDeleteFile: (id: string) => void;
  restoreFile: (id: string) => void;
  toggleFavoriteFile: (id: string) => void;
  duplicateFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  moveFile: (id: string, folderId: string | null) => void;
  
  shareFile: (fileId: string, password?: string, expirationDate?: string, downloadLimit?: number) => string;
  revokeShareLink: (fileId: string) => void;
  
  clearRecycleBin: () => void;
  addAuditLog: (action: DAMAuditLog["action"], description: string) => void;
}

const initialFolders: DAMFolder[] = [
  { id: "fold-1", name: "WhatsApp Campaign Media", parentId: null, color: "green", createdTime: new Date(Date.now() - 3600*1000*24*30).toISOString(), isArchived: false },
  { id: "fold-2", name: "Google Integration Docs", parentId: null, color: "blue", createdTime: new Date(Date.now() - 3600*1000*24*15).toISOString(), isArchived: false },
  { id: "fold-3", name: "Brand Asset Kit", parentId: null, color: "purple", createdTime: new Date(Date.now() - 3600*1000*24*5).toISOString(), isArchived: false }
];

const initialFiles: DAMFile[] = [
  { id: "file-1", name: "Campaign_Header.png", size: "1.2 MB", sizeBytes: 1258291, type: "image", mimeType: "image/png", folderId: "fold-1", isFavorite: true, isShared: true, isTrashed: false, status: "completed", uploadedTime: new Date(Date.now() - 3600*1000*24*29).toISOString(), version: "v1.2", tags: ["header", "whatsapp"] },
  { id: "file-2", name: "Promo_Video_Intro.mp4", size: "14.5 MB", sizeBytes: 15204352, type: "video", mimeType: "video/mp4", folderId: "fold-1", isFavorite: false, isShared: false, isTrashed: false, status: "completed", uploadedTime: new Date(Date.now() - 3600*1000*24*28).toISOString(), version: "v1.0", tags: ["video", "promo"] },
  { id: "file-3", name: "OAuth_Setup_Instructions.pdf", size: "320 KB", sizeBytes: 327680, type: "document", mimeType: "application/pdf", folderId: "fold-2", isFavorite: true, isShared: true, isTrashed: false, status: "completed", uploadedTime: new Date(Date.now() - 3600*1000*24*14).toISOString(), version: "v1.0", tags: ["google", "setup"] },
  { id: "file-4", name: "Logo_ExpendMore_Dark.svg", size: "18 KB", sizeBytes: 18432, type: "image", mimeType: "image/svg+xml", folderId: "fold-3", isFavorite: true, isShared: false, isTrashed: false, status: "completed", uploadedTime: new Date(Date.now() - 3600*1000*24*4).toISOString(), version: "v2.0", tags: ["logo", "svg"] }
];

const initialShareLinks: DAMShareLink[] = [
  { id: "share-1", fileId: "file-1", url: "https://expendmore.ai/s/campaign-header", currentDownloads: 12 },
  { id: "share-2", fileId: "file-3", url: "https://expendmore.ai/s/oauth-instructions", currentDownloads: 4 }
];

const initialAudit: DAMAuditLog[] = [
  { id: "aud-1", timestamp: new Date(Date.now() - 3600*1000*2).toISOString(), action: "upload", operator: "Admin (Priya)", description: "Uploaded file: Logo_ExpendMore_Dark.svg to Brand Asset Kit." },
  { id: "aud-2", timestamp: new Date(Date.now() - 3600*1000*12).toISOString(), action: "sharing_link_created", operator: "Admin (Priya)", description: "Created public sharing link for Campaign_Header.png." }
];

const initialActivities: ActivityItem[] = [
  { id: "act-1", timestamp: new Date(Date.now() - 3600*1000*2).toISOString(), type: "upload", title: "Uploaded Logo_ExpendMore_Dark.svg" },
  { id: "act-2", timestamp: new Date(Date.now() - 3600*1000*12).toISOString(), type: "share", title: "Shared Campaign_Header.png" }
];

export const useFiles = create<FilesState>()(
  persist(
    (set, get) => ({
      files: initialFiles,
      folders: initialFolders,
      sharingLinks: initialShareLinks,
      auditLogs: initialAudit,
      activities: initialActivities,
      queue: [],

      addFolder: (name, parentId, color) => {
        set((state) => {
          const id = `fold-${Date.now()}`;
          const newFolder: DAMFolder = {
            id,
            name,
            parentId,
            color,
            createdTime: new Date().toISOString(),
            isArchived: false
          };

          const newAudit: DAMAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "upload", // generic folder upload action representation
            operator: "Admin (Priya)",
            description: `Created new folder directory: ${name}`
          };

          const newAct: ActivityItem = {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "upload",
            title: `Created folder ${name}`
          };

          return {
            folders: [...state.folders, newFolder],
            auditLogs: [newAudit, ...state.auditLogs],
            activities: [newAct, ...state.activities]
          };
        });
      },

      renameFolder: (id, newName) => {
        set((state) => {
          const fName = state.folders.find((f) => f.id === id)?.name || id;
          const newAudit: DAMAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "move", // rename moves values
            operator: "Admin (Priya)",
            description: `Renamed folder ${fName} to ${newName}`
          };

          const newAct: ActivityItem = {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "rename",
            title: `Renamed folder ${fName} to ${newName}`
          };

          return {
            folders: state.folders.map((f) => (f.id === id ? { ...f, name: newName } : f)),
            auditLogs: [newAudit, ...state.auditLogs],
            activities: [newAct, ...state.activities]
          };
        });
      },

      deleteFolder: (id) => {
        set((state) => {
          const fName = state.folders.find((f) => f.id === id)?.name || id;
          const newAudit: DAMAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "delete",
            operator: "Admin (Priya)",
            description: `Deleted folder: ${fName} (All nested assets trashed)`
          };

          const newAct: ActivityItem = {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "delete",
            title: `Deleted folder ${fName}`
          };

          // Mark all nested files as trashed
          const updatedFiles = state.files.map((file) =>
            file.folderId === id ? { ...file, isTrashed: true } : file
          );

          return {
            folders: state.folders.filter((f) => f.id !== id),
            files: updatedFiles,
            auditLogs: [newAudit, ...state.auditLogs],
            activities: [newAct, ...state.activities]
          };
        });
      },

      duplicateFolder: (id) => {
        set((state) => {
          const folder = state.folders.find((f) => f.id === id);
          if (!folder) return {};

          const dupId = `fold-${Date.now()}`;
          const newFolder: DAMFolder = {
            ...folder,
            id: dupId,
            name: `Copy of ${folder.name}`,
            createdTime: new Date().toISOString()
          };

          // Duplicate files inside the folder
          const folderFiles = state.files.filter((f) => f.folderId === id);
          const duplicatedFiles = folderFiles.map((file) => ({
            ...file,
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            folderId: dupId,
            uploadedTime: new Date().toISOString()
          }));

          return {
            folders: [...state.folders, newFolder],
            files: [...state.files, ...duplicatedFiles]
          };
        });
      },

      uploadFile: (name, size, sizeBytes, type, mimeType, folderId) => {
        set((state) => {
          const id = `file-${Date.now()}`;
          const newFile: DAMFile = {
            id,
            name,
            size,
            sizeBytes,
            type,
            mimeType,
            folderId,
            isFavorite: false,
            isShared: false,
            isTrashed: false,
            status: "queued" as const,
            uploadedTime: new Date().toISOString(),
            version: "v1.0",
            tags: []
          };

          const newAudit: DAMAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "upload",
            operator: "Admin (Priya)",
            description: `Uploaded file: ${name}`
          };

          const newAct: ActivityItem = {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "upload",
            title: `Uploaded ${name}`
          };

          return {
            files: [newFile, ...state.files],
            auditLogs: [newAudit, ...state.auditLogs],
            activities: [newAct, ...state.activities]
          };
        });
      },

      deleteFile: (id) => {
        set((state) => {
          const file = state.files.find((f) => f.id === id);
          if (!file) return {};

          const newAudit: DAMAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "delete",
            operator: "Admin (Priya)",
            description: `Moved file ${file.name} to Recycle Bin`
          };

          const newAct: ActivityItem = {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "delete",
            title: `Moved ${file.name} to trash`
          };

          return {
            files: state.files.map((f) => (f.id === id ? { ...f, isTrashed: true } : f)),
            auditLogs: [newAudit, ...state.auditLogs],
            activities: [newAct, ...state.activities]
          };
        });
      },

      permanentDeleteFile: (id) => {
        set((state) => {
          const file = state.files.find((f) => f.id === id);
          const newAudit: DAMAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "delete",
            operator: "Admin (Priya)",
            description: `Permanently deleted file: ${file?.name || id}`
          };

          return {
            files: state.files.filter((f) => f.id !== id),
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });
      },

      restoreFile: (id) => {
        set((state) => ({
          files: state.files.map((f) => (f.id === id ? { ...f, isTrashed: false } : f))
        }));
      },

      toggleFavoriteFile: (id) => {
        set((state) => ({
          files: state.files.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
        }));
      },

      duplicateFile: (id) => {
        set((state) => {
          const file = state.files.find((f) => f.id === id);
          if (!file) return {};

          const dupId = `file-${Date.now()}`;
          const newFile: DAMFile = {
            ...file,
            id: dupId,
            name: `Copy of ${file.name}`,
            uploadedTime: new Date().toISOString()
          };

          return {
            files: [newFile, ...state.files]
          };
        });
      },

      renameFile: (id, newName) => {
        set((state) => ({
          files: state.files.map((f) => (f.id === id ? { ...f, name: newName } : f))
        }));
      },

      moveFile: (id, folderId) => {
        set((state) => ({
          files: state.files.map((f) => (f.id === id ? { ...f, folderId } : f))
        }));
      },

      shareFile: (fileId, password, expirationDate, downloadLimit) => {
        const id = `share-${Date.now()}`;
        const url = `https://expendmore.ai/s/${id}`;
        
        set((state) => {
          const newLink: DAMShareLink = {
            id,
            fileId,
            url,
            hasPassword: !!password,
            password,
            expirationDate,
            downloadLimit,
            currentDownloads: 0
          };

          const file = state.files.find((f) => f.id === fileId);

          const newAudit: DAMAuditLog = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "sharing_link_created",
            operator: "Admin (Priya)",
            description: `Generated sharing link for: ${file?.name || fileId}`
          };

          return {
            sharingLinks: [...state.sharingLinks, newLink],
            files: state.files.map((f) => (f.id === fileId ? { ...f, isShared: true } : f)),
            auditLogs: [newAudit, ...state.auditLogs]
          };
        });

        return url;
      },

      revokeShareLink: (fileId) => {
        set((state) => ({
          sharingLinks: state.sharingLinks.filter((link) => link.fileId !== fileId),
          files: state.files.map((f) => (f.id === fileId ? { ...f, isShared: false } : f))
        }));
      },

      clearRecycleBin: () => {
        set((state) => ({
          files: state.files.filter((f) => !f.isTrashed)
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
      name: "expendmore-files-store",
      partialize: (state) => ({
        files: state.files,
        folders: state.folders,
        sharingLinks: state.sharingLinks,
        auditLogs: state.auditLogs
      })
    }
  )
);
