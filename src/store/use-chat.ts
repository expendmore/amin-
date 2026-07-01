import { create } from "zustand";

export type ChatSortBy = "updated_at" | "title";
export type ChatSortOrder = "asc" | "desc";

interface ChatState {
  drafts: Record<string, string>; // convId -> message text draft
  searchQuery: string;
  selectedFolderId: string | null;
  selectedTagId: string | null;
  sortBy: ChatSortBy;
  sortOrder: ChatSortOrder;
  selectedIds: string[]; // For bulk actions
  isMultiSelecting: boolean;

  // Draft recovery actions
  setDraft: (conversationId: string, text: string) => void;
  clearDraft: (conversationId: string) => void;
  getDraft: (conversationId: string) => string;

  // Filter and Sorting actions
  setSearchQuery: (query: string) => void;
  setSelectedFolderId: (id: string | null) => void;
  setSelectedTagId: (id: string | null) => void;
  setSortBy: (field: ChatSortBy) => void;
  setSortOrder: (order: ChatSortOrder) => void;

  // Bulk actions selection helpers
  toggleSelectId: (id: string) => void;
  setSelectedIds: (ids: string[]) => void;
  clearSelectedIds: () => void;
  setIsMultiSelecting: (val: boolean) => void;
  resetFilters: () => void;
}

export const useChat = create<ChatState>((set, get) => ({
  drafts: {},
  searchQuery: "",
  selectedFolderId: null,
  selectedTagId: null,
  sortBy: "updated_at",
  sortOrder: "desc",
  selectedIds: [],
  isMultiSelecting: false,

  setDraft: (conversationId, text) =>
    set((state) => ({
      drafts: { ...state.drafts, [conversationId]: text },
    })),

  clearDraft: (conversationId) =>
    set((state) => {
      const newDrafts = { ...state.drafts };
      delete newDrafts[conversationId];
      return { drafts: newDrafts };
    }),

  getDraft: (conversationId) => {
    return get().drafts[conversationId] || "";
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),
  setSelectedTagId: (id) => set({ selectedTagId: id }),
  setSortBy: (field) => set({ sortBy: field }),
  setSortOrder: (order) => set({ sortOrder: order }),

  toggleSelectId: (id) =>
    set((state) => {
      const isAlreadySelected = state.selectedIds.includes(id);
      const updated = isAlreadySelected
        ? state.selectedIds.filter((item) => item !== id)
        : [...state.selectedIds, id];
      return {
        selectedIds: updated,
        isMultiSelecting: updated.length > 0,
      };
    }),

  setSelectedIds: (ids) =>
    set({
      selectedIds: ids,
      isMultiSelecting: ids.length > 0,
    }),

  clearSelectedIds: () =>
    set({
      selectedIds: [],
      isMultiSelecting: false,
    }),

  setIsMultiSelecting: (val) =>
    set((state) => ({
      isMultiSelecting: val,
      selectedIds: val ? state.selectedIds : [],
    })),

  resetFilters: () =>
    set({
      searchQuery: "",
      selectedFolderId: null,
      selectedTagId: null,
      sortBy: "updated_at",
      sortOrder: "desc",
    }),
}));
