import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc,
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  writeBatch 
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase-client";
import { Conversation, Folder, Tag } from "@/types";
import { useToast } from "@/store/use-toast";
import { useWorkspace } from "@/store/use-workspace";

// Helper to fetch current authenticated user ID
export async function getUserId() {
  return auth.currentUser?.uid || null;
}

// ==========================================
// 1. CONVERSATION HOOKS
// ==========================================

export function useConversations(filters?: {
  folderId?: string | null;
  tagId?: string | null;
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  isDeleted?: boolean;
  searchQuery?: string;
  sortBy?: "updated_at" | "title";
  sortOrder?: "asc" | "desc";
}) {
  const { activeWorkspaceId } = useWorkspace();

  return useQuery({
    queryKey: ["conversations", activeWorkspaceId, filters],
    queryFn: async () => {
      const userId = await getUserId();
      if (!userId || !activeWorkspaceId) return [] as Conversation[];

      const conversationsRef = collection(db, "conversations");
      // Basic workspace filter to satisfy multi-tenant rules
      const q = query(
        conversationsRef,
        where("workspaceId", "==", activeWorkspaceId)
      );

      const snapshot = await getDocs(q);
      let conversationsList = snapshot.docs.map((docSnap) => {
        const c = docSnap.data();
        return {
          id: docSnap.id,
          userId: c.userId,
          title: c.title,
          modelProvider: c.modelProvider,
          modelName: c.modelName,
          isPinned: c.isPinned || false,
          isArchived: c.isArchived || false,
          isFavorite: c.isFavorite || false,
          isDeleted: c.isDeleted || false,
          deletedAt: c.deletedAt || null,
          folderId: c.folderId || null,
          tags: c.tags || [],
          createdAt: c.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: c.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Conversation;
      });

      // Filter: soft deleted
      if (filters?.isDeleted !== undefined) {
        conversationsList = conversationsList.filter((c) => c.isDeleted === filters.isDeleted);
      } else {
        conversationsList = conversationsList.filter((c) => !c.isDeleted);
      }

      // Filter: folder
      if (filters?.folderId !== undefined) {
        conversationsList = conversationsList.filter((c) => c.folderId === filters.folderId);
      }

      // Filter: pinned
      if (filters?.isPinned !== undefined) {
        conversationsList = conversationsList.filter((c) => c.isPinned === filters.isPinned);
      }

      // Filter: favorites
      if (filters?.isFavorite !== undefined) {
        conversationsList = conversationsList.filter((c) => c.isFavorite === filters.isFavorite);
      }

      // Filter: archives
      if (filters?.isArchived !== undefined) {
        conversationsList = conversationsList.filter((c) => c.isArchived === filters.isArchived);
      }

      // Filter: tags
      if (filters?.tagId) {
        conversationsList = conversationsList.filter((c) =>
          c.tags?.some((t) => t.id === filters.tagId)
        );
      }

      // Filter: search title
      if (filters?.searchQuery) {
        const queryStr = filters.searchQuery.toLowerCase();
        conversationsList = conversationsList.filter((c) =>
          c.title.toLowerCase().includes(queryStr)
        );
      }

      // Sorting
      const sortBy = filters?.sortBy || "updated_at";
      const sortOrder = filters?.sortOrder || "desc";

      conversationsList.sort((a, b) => {
        const valA = sortBy === "title" ? a.title : a.updatedAt;
        const valB = sortBy === "title" ? b.title : b.updatedAt;

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });

      return conversationsList;
    },
    enabled: !!activeWorkspaceId,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { activeWorkspaceId } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: {
      title?: string;
      modelProvider: string;
      modelName: string;
      systemPrompt?: string;
      folderId?: string | null;
    }) => {
      const userId = await getUserId();
      if (!userId) throw new Error("Unauthenticated user context.");
      if (!activeWorkspaceId) throw new Error("No active workspace selected.");

      const conversationsRef = collection(db, "conversations");
      const newDoc = await addDoc(conversationsRef, {
        workspaceId: activeWorkspaceId,
        userId,
        title: payload.title || "New Conversation",
        modelProvider: payload.modelProvider,
        modelName: payload.modelName,
        systemPrompt: payload.systemPrompt || "",
        folderId: payload.folderId || null,
        isPinned: false,
        isArchived: false,
        isFavorite: false,
        isDeleted: false,
        tags: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { id: newDoc.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      addToast("New conversation initialized!", "success");
    },
  });
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      title?: string;
      folderId?: string | null;
      isPinned?: boolean;
      isFavorite?: boolean;
      isArchived?: boolean;
      modelProvider?: string;
      modelName?: string;
    }) => {
      const { id, ...updates } = payload;
      const docRef = doc(db, "conversations", id);
      
      const firestoreUpdates: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, firestoreUpdates);
      return id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (variables.title) {
        addToast("Conversation renamed successfully", "success");
      }
    },
  });
}

// Soft Delete, Restore, Permanent Delete & Duplicate Hook
export function useDeleteConversation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (action: {
      id: string;
      type: "trash" | "restore" | "permanent";
    }) => {
      const { id, type } = action;
      const docRef = doc(db, "conversations", id);

      if (type === "trash") {
        await updateDoc(docRef, {
          isDeleted: true,
          deletedAt: serverTimestamp()
        });
      } else if (type === "restore") {
        await updateDoc(docRef, {
          isDeleted: false,
          deletedAt: null
        });
      } else if (type === "permanent") {
        await deleteDoc(docRef);
      }
      return action;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (data.type === "trash") {
        addToast("Conversation moved to Trash", "info");
      } else if (data.type === "restore") {
        addToast("Conversation restored successfully", "success");
      } else {
        addToast("Conversation permanently deleted", "info");
      }
    },
  });
}

export function useDuplicateConversation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { activeWorkspaceId } = useWorkspace();

  return useMutation({
    mutationFn: async (id: string) => {
      const userId = await getUserId();
      if (!userId) throw new Error("Unauthenticated user context.");
      if (!activeWorkspaceId) throw new Error("No active workspace selected.");

      // Fetch the source conversation details
      const docRef = doc(db, "conversations", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Source conversation not found.");

      const conv = docSnap.data();

      // Create new duplicated conversation
      const conversationsRef = collection(db, "conversations");
      const newConvRef = await addDoc(conversationsRef, {
        workspaceId: activeWorkspaceId,
        userId,
        title: `${conv.title} (Copy)`,
        modelProvider: conv.modelProvider,
        modelName: conv.modelName,
        systemPrompt: conv.systemPrompt || "",
        folderId: conv.folderId || null,
        isPinned: false,
        isArchived: false,
        isFavorite: false,
        isDeleted: false,
        tags: conv.tags || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Duplicating messages
      const messagesRef = collection(db, "messages");
      const messagesQuery = query(
        messagesRef,
        where("conversationId", "==", id),
        orderBy("createdAt", "asc")
      );
      const messagesSnap = await getDocs(messagesQuery);

      const batch = writeBatch(db);
      messagesSnap.forEach((msgSnap) => {
        const m = msgSnap.data();
        const newMsgRef = doc(collection(db, "messages"));
        batch.set(newMsgRef, {
          conversationId: newConvRef.id,
          workspaceId: activeWorkspaceId,
          role: m.role,
          content: m.content,
          tokenCount: m.tokenCount || 0,
          status: m.status || "sent",
          metadata: m.metadata || null,
          isDraft: m.isDraft || false,
          createdAt: serverTimestamp()
        });
      });

      await batch.commit();

      return { id: newConvRef.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      addToast("Duplicated conversation session!", "success");
    },
  });
}

// Bulk operations hook
export function useBulkConversationActions() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      ids: string[];
      action: "trash" | "restore" | "delete" | "archive" | "unarchive" | "move-folder";
      folderId?: string | null;
    }) => {
      const { ids, action, folderId } = payload;
      if (ids.length === 0) return;

      const batch = writeBatch(db);

      for (const id of ids) {
        const docRef = doc(db, "conversations", id);
        if (action === "trash") {
          batch.update(docRef, { isDeleted: true, deletedAt: serverTimestamp() });
        } else if (action === "restore") {
          batch.update(docRef, { isDeleted: false, deletedAt: null });
        } else if (action === "delete") {
          batch.delete(docRef);
        } else if (action === "archive") {
          batch.update(docRef, { isArchived: true });
        } else if (action === "unarchive") {
          batch.update(docRef, { isArchived: false });
        } else if (action === "move-folder") {
          batch.update(docRef, { folderId: folderId || null });
        }
      }

      await batch.commit();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      addToast(`Bulk operation "${variables.action}" applied successfully`, "success");
    },
  });
}

// ==========================================
// 2. FOLDER HOOKS
// ==========================================

export function useFolders() {
  const { activeWorkspaceId } = useWorkspace();

  return useQuery({
    queryKey: ["folders", activeWorkspaceId],
    queryFn: async () => {
      const userId = await getUserId();
      if (!userId || !activeWorkspaceId) return [] as Folder[];

      const foldersRef = collection(db, "folders");
      const q = query(
        foldersRef,
        where("workspaceId", "==", activeWorkspaceId)
      );

      const snapshot = await getDocs(q);
      const folderList = snapshot.docs.map((docSnap) => {
        const f = docSnap.data();
        return {
          id: docSnap.id,
          userId: f.userId,
          name: f.name,
          color: f.color || null,
          createdAt: f.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: f.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Folder;
      });

      return folderList;
    },
    enabled: !!activeWorkspaceId,
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { activeWorkspaceId } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: { name: string; color?: string }) => {
      const userId = await getUserId();
      if (!userId) throw new Error("Unauthenticated user context.");
      if (!activeWorkspaceId) throw new Error("No active workspace selected.");

      const foldersRef = collection(db, "folders");
      const newDoc = await addDoc(foldersRef, {
        workspaceId: activeWorkspaceId,
        userId,
        name: payload.name,
        color: payload.color || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { id: newDoc.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      addToast("Folder created successfully!", "success");
    },
  });
}

export function useRenameFolder() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (payload: { id: string; name: string }) => {
      const docRef = doc(db, "folders", payload.id);
      await updateDoc(docRef, {
        name: payload.name,
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      addToast("Folder renamed successfully!", "success");
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, "folders", id);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      addToast("Folder removed", "info");
    },
  });
}

// ==========================================
// 3. TAG HOOKS
// ==========================================

export function useTags() {
  const { activeWorkspaceId } = useWorkspace();

  return useQuery({
    queryKey: ["tags", activeWorkspaceId],
    queryFn: async () => {
      const userId = await getUserId();
      if (!userId || !activeWorkspaceId) return [] as Tag[];

      const tagsRef = collection(db, "tags");
      const q = query(
        tagsRef,
        where("workspaceId", "==", activeWorkspaceId)
      );

      const snapshot = await getDocs(q);
      const tagList = snapshot.docs.map((docSnap) => {
        const t = docSnap.data();
        return {
          id: docSnap.id,
          userId: t.userId,
          name: t.name,
          color: t.color || null,
          createdAt: t.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Tag;
      });

      return tagList;
    },
    enabled: !!activeWorkspaceId,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { activeWorkspaceId } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: { name: string; color?: string }) => {
      const userId = await getUserId();
      if (!userId) throw new Error("Unauthenticated user context.");
      if (!activeWorkspaceId) throw new Error("No active workspace selected.");

      const tagsRef = collection(db, "tags");
      const newDoc = await addDoc(tagsRef, {
        workspaceId: activeWorkspaceId,
        userId,
        name: payload.name,
        color: payload.color || null,
        createdAt: serverTimestamp(),
      });

      return { id: newDoc.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      addToast("Tag created!", "success");
    },
  });
}

export function useAddTagToConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { conversationId: string; tagId: string; tagName: string; tagColor?: string }) => {
      const convRef = doc(db, "conversations", payload.conversationId);
      const convSnap = await getDoc(convRef);
      if (!convSnap.exists()) throw new Error("Conversation not found.");

      const convData = convSnap.data();
      const currentTags: Tag[] = convData?.tags || [];

      // Avoid duplicate tags
      if (currentTags.some(t => t.id === payload.tagId)) return;

      const newTag: Tag = {
        id: payload.tagId,
        userId: auth.currentUser?.uid || "",
        name: payload.tagName,
        color: payload.tagColor || null,
        createdAt: new Date().toISOString()
      };

      await updateDoc(convRef, {
        tags: [...currentTags, newTag],
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useRemoveTagFromConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { conversationId: string; tagId: string }) => {
      const convRef = doc(db, "conversations", payload.conversationId);
      const convSnap = await getDoc(convRef);
      if (!convSnap.exists()) throw new Error("Conversation not found.");

      const convData = convSnap.data();
      const currentTags: Tag[] = convData?.tags || [];

      const updatedTags = currentTags.filter(t => t.id !== payload.tagId);

      await updateDoc(convRef, {
        tags: updatedTags,
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useAvailableModels() {
  return useQuery({
    queryKey: ["available-models"],
    queryFn: async () => {
      const res = await fetch("/api/v1/models");
      if (!res.ok) throw new Error("Failed to fetch available models.");
      const data = await res.json();
      return data.models as Array<{
        id: string;
        name: string;
        provider: string;
        category: string;
        maxContext: number;
        supportsStreaming: boolean;
        supportsVision: boolean;
      }>;
    },
  });
}
