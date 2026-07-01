import { create } from "zustand";

export interface Conversation {
  id: string;
  title: string;
  model_provider: string;
  model_name: string;
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  isDraft: boolean;
  isShared: boolean;
  created_at: string;
  updated_at: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  isFavorite: boolean;
  isDeleted: boolean;
  isShared: boolean;
  category: "upload" | "download";
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "system" | "billing" | "ai";
  created_at: string;
}

export interface ProfileDetails {
  full_name: string;
  email: string;
  avatar: string;
  tier: "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";
  provider: "email" | "google";
  created_at: string;
  username: string;
  company: string;
  timezone: string;
  language: string;
  phone: string;
}

export interface UserSettings {
  theme: "dark" | "light" | "system";
  language: string;
  timeZone: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    telemetry: boolean;
    shareData: boolean;
  };
}

interface DashboardState {
  profile: ProfileDetails;
  settings: UserSettings;
  conversations: Conversation[];
  documents: DocumentItem[];
  files: FileItem[];
  notifications: NotificationItem[];
  activeSessions: Array<{ id: string; device: string; ip: string; active: boolean; date: string }>;
  
  // Profile Actions
  updateProfile: (details: Partial<ProfileDetails>) => void;
  uploadAvatar: (url: string) => void;
  
  // Settings Actions
  updateSettings: (settings: Partial<UserSettings>) => void;
  deleteAccount: () => void;
  
  // Conversation Actions
  addConversation: (title: string, provider: string, name: string) => string;
  deleteConversation: (id: string) => void;
  permanentDeleteConversation: (id: string) => void;
  togglePinConversation: (id: string) => void;
  toggleArchiveConversation: (id: string) => void;
  toggleFavoriteConversation: (id: string) => void;
  restoreConversation: (id: string) => void;
  
  // Document Actions
  addDocument: (title: string, content?: string) => string;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  togglePinDocument: (id: string) => void;
  toggleArchiveDocument: (id: string) => void;
  
  // File Actions
  addFile: (name: string, size: number, type: string, category?: "upload" | "download") => void;
  deleteFile: (id: string) => void;
  permanentDeleteFile: (id: string) => void;
  toggleFavoriteFile: (id: string) => void;
  toggleShareFile: (id: string) => void;
  restoreFile: (id: string) => void;
  
  // Notification Actions
  addNotification: (title: string, message: string, type: "system" | "billing" | "ai") => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  deleteNotification: (id: string) => void;
  
  // Session Actions
  revokeSession: (id: string) => void;
}

export const useDashboard = create<DashboardState>((set) => ({
  profile: {
    full_name: "Arjun Sharma",
    email: "arjun@aisensy.com",
    avatar: "",
    tier: "FREE",
    provider: "email",
    created_at: new Date().toISOString(),
    username: "arjun_sharma",
    company: "Anshuman Enterprises",
    timezone: "Asia/Kolkata",
    language: "en-US",
    phone: "+91 98765 43210",
  },
  settings: {
    theme: "dark",
    language: "en-US",
    timeZone: "Asia/Kolkata",
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    privacy: {
      telemetry: true,
      shareData: false,
    },
  },
  activeSessions: [
    { id: "s1", device: "Chrome / Windows 11 (Current Device)", ip: "192.168.1.1", active: true, date: "June 26, 2026 14:00" },
    { id: "s2", device: "Safari / iPhone 15 Pro", ip: "103.45.2.14", active: false, date: "June 25, 2026 18:30" },
  ],
  conversations: [
    {
      id: "c1",
      title: "Optimizing React State",
      model_provider: "anthropic",
      model_name: "claude-3-5-sonnet",
      isPinned: true,
      isArchived: false,
      isFavorite: true,
      isDeleted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "c2",
      title: "Landing Page Visual Design",
      model_provider: "openai",
      model_name: "gpt-4o",
      isPinned: false,
      isArchived: false,
      isFavorite: false,
      isDeleted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "c3",
      title: "Marketing Copy Outline",
      model_provider: "google",
      model_name: "gemini-1.5-flash",
      isPinned: false,
      isArchived: true,
      isFavorite: false,
      isDeleted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
  ],
  documents: [
    {
      id: "d1",
      title: "ExpendMore Product Roadmap",
      content: "# Product Roadmap\n\n- Build core modular frontend components.\n- Integrate RLS checks in Postgres\n- Add chat interfaces.",
      isPinned: true,
      isArchived: false,
      isDraft: false,
      isShared: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "d2",
      title: "React Query Best Practices",
      content: "# React Query Tips\n\nAvoid loading states cascades by utilizing prefetching patterns.",
      isPinned: false,
      isArchived: false,
      isDraft: true,
      isShared: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],
  files: [
    {
      id: "f1",
      name: "profile_pic.png",
      size: 145000,
      type: "image/png",
      isFavorite: true,
      isDeleted: false,
      isShared: false,
      category: "upload",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: "f2",
      name: "saas_features_guide.pdf",
      size: 2450000,
      type: "application/pdf",
      isFavorite: false,
      isDeleted: false,
      isShared: true,
      category: "download",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: "f3",
      name: "draft_outline.txt",
      size: 4500,
      type: "text/plain",
      isFavorite: false,
      isDeleted: true,
      isShared: false,
      category: "upload",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
  ],
  notifications: [
    {
      id: "n1",
      title: "Welcome to ExpendMore!",
      message: "Your production-ready workspace and secure profile synchronization triggers are active.",
      isRead: false,
      type: "system",
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "n2",
      title: "Pro Tier Upgrade Available",
      message: "Unlock Claude 3.5 models, DALL-E generators, and split Markdown editor by upgrading.",
      isRead: false,
      type: "billing",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: "n3",
      title: "System Maintenance Notice",
      message: "All models adapters completed security validations. Service availability remains 99.9%.",
      isRead: true,
      type: "system",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],

  // Profile Actions
  updateProfile: (details) =>
    set((state) => ({
      profile: { ...state.profile, ...details },
    })),
  uploadAvatar: (url) =>
    set((state) => ({
      profile: { ...state.profile, avatar: url },
    })),

  // Settings Actions
  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),
  deleteAccount: () =>
    set({
      profile: {
        full_name: "Guest User",
        email: "",
        avatar: "",
        tier: "FREE",
        provider: "email",
        created_at: new Date().toISOString(),
        username: "",
        company: "",
        timezone: "UTC",
        language: "en",
        phone: "",
      },
      conversations: [],
      documents: [],
      files: [],
      notifications: [],
    }),

  // Conversation Actions
  addConversation: (title, provider, name) => {
    const id = `c_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();
    const newConv: Conversation = {
      id,
      title: title || "New Conversation",
      model_provider: provider,
      model_name: name,
      isPinned: false,
      isArchived: false,
      isFavorite: false,
      isDeleted: false,
      created_at: now,
      updated_at: now,
    };
    set((state) => ({
      conversations: [newConv, ...state.conversations],
    }));
    return id;
  },
  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, isDeleted: true } : c
      ),
    })),
  permanentDeleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
    })),
  togglePinConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      ),
    })),
  toggleArchiveConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, isArchived: !c.isArchived } : c
      ),
    })),
  toggleFavoriteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      ),
    })),
  restoreConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, isDeleted: false } : c
      ),
    })),

  // Document Actions
  addDocument: (title, content = "") => {
    const id = `d_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();
    const newDoc: DocumentItem = {
      id,
      title: title || "Untitled Document",
      content,
      isPinned: false,
      isArchived: false,
      isDraft: true,
      isShared: false,
      created_at: now,
      updated_at: now,
    };
    set((state) => ({
      documents: [newDoc, ...state.documents],
    }));
    return id;
  },
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d
      ),
    })),
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),
  togglePinDocument: (id) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, isPinned: !d.isPinned } : d
      ),
    })),
  toggleArchiveDocument: (id) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, isArchived: !d.isArchived } : d
      ),
    })),

  // File Actions
  addFile: (name, size, type, category = "upload") => {
    const id = `f_${Math.random().toString(36).substring(2, 9)}`;
    const newFile: FileItem = {
      id,
      name,
      size,
      type,
      isFavorite: false,
      isDeleted: false,
      isShared: false,
      category,
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      files: [newFile, ...state.files],
    }));
  },
  deleteFile: (id) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isDeleted: true } : f)),
    })),
  permanentDeleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),
  toggleFavoriteFile: (id) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
      ),
    })),
  toggleShareFile: (id) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, isShared: !f.isShared } : f
      ),
    })),
  restoreFile: (id) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isDeleted: false } : f)),
    })),

  // Notification Actions
  addNotification: (title, message, type) => {
    const id = `n_${Math.random().toString(36).substring(2, 9)}`;
    const newNotif: NotificationItem = {
      id,
      title,
      message,
      isRead: false,
      type,
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
  },
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),
  clearAllNotifications: () =>
    set({
      notifications: [],
    }),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // Session Actions
  revokeSession: (id) =>
    set((state) => ({
      activeSessions: state.activeSessions.filter((s) => s.id !== id),
    })),
}));
