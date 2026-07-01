"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import DashboardShell from "@/components/navigation/DashboardShell";
import PageContainer from "@/components/navigation/PageContainer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useChat } from "@/store/use-chat";
import { useToast } from "@/store/use-toast";
import {
  useConversations,
  useCreateConversation,
  useUpdateConversation,
  useDeleteConversation,
  useDuplicateConversation,
  useBulkConversationActions,
  useFolders,
  useCreateFolder,
  useRenameFolder,
  useDeleteFolder,
  useTags,
  useCreateTag,
  useAddTagToConversation,
  useRemoveTagFromConversation,
} from "@/hooks/use-conversations";
import {
  MessageSquare,
  Plus,
  Search,
  Star,
  Archive,
  Trash,
  Folder,
  FolderPlus,
  Tag,
  Check,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Bot,
  Pin,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const activeConversationId = params?.conversationId as string | undefined;

  const { addToast } = useToast();

  // Store variables
  const {
    searchQuery,
    selectedFolderId,
    selectedTagId,
    sortBy,
    sortOrder,
    selectedIds,
    isMultiSelecting,
    setSearchQuery,
    setSelectedFolderId,
    setSelectedTagId,
    setSortBy,
    setSortOrder,
    toggleSelectId,
    setSelectedIds,
    clearSelectedIds,
    setIsMultiSelecting,
  } = useChat();

  // Route-based tab filters
  const isTrashTab = pathname.endsWith("/chat/trash");
  const isArchiveTab = pathname.endsWith("/chat/archive");
  const isFavoritesTab = pathname.endsWith("/chat/favorites");
  const isAllTab = pathname === "/chat" || (!!activeConversationId && !isTrashTab && !isArchiveTab && !isFavoritesTab);

  // Derive filters for query
  const queryFilters: any = {};
  if (isTrashTab) {
    queryFilters.isDeleted = true;
  } else {
    queryFilters.isDeleted = false;
    if (isArchiveTab) {
      queryFilters.isArchived = true;
    } else if (isFavoritesTab) {
      queryFilters.isFavorite = true;
    } else {
      // All active conversations
      queryFilters.isArchived = false;
    }
  }

  // Selected folder and tag
  if (selectedFolderId) queryFilters.folderId = selectedFolderId;
  if (selectedTagId) queryFilters.tagId = selectedTagId;
  if (searchQuery) queryFilters.searchQuery = searchQuery;
  queryFilters.sortBy = sortBy;
  queryFilters.sortOrder = sortOrder;

  // React Query Calls
  const { data: conversations = [], isLoading: isLoadingConvs } = useConversations(queryFilters);
  const { data: folders = [] } = useFolders();
  const { data: tags = [] } = useTags();

  // Mutations
  const createConversation = useCreateConversation();
  const updateConversation = useUpdateConversation();
  const deleteConversation = useDeleteConversation();
  const duplicateConversation = useDuplicateConversation();
  const bulkActions = useBulkConversationActions();

  const createFolder = useCreateFolder();
  const renameFolder = useRenameFolder();
  const removeFolder = useDeleteFolder();

  const createTag = useCreateTag();
  const assignTag = useAddTagToConversation();
  const unassignTag = useRemoveTagFromConversation();

  // Modals state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [folderColorInput, setFolderColorInput] = useState("#6366f1");

  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState<string | null>(null);
  const [renameFolderName, setRenameFolderName] = useState("");

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagNameInput, setTagNameInput] = useState("");
  const [tagColorInput, setTagColorInput] = useState("#818cf8");

  // Context Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K focus and Ctrl+N create chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        handleCreateNewChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCreateNewChat = () => {
    createConversation.mutate(
      {
        modelProvider: "openai",
        modelName: "gpt-4o-mini",
        folderId: selectedFolderId,
      },
      {
        onSuccess: (newConv) => {
          router.push(`/chat/${newConv.id}`);
        },
      }
    );
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderNameInput.trim()) return;
    createFolder.mutate(
      { name: folderNameInput, color: folderColorInput },
      {
        onSuccess: () => {
          setFolderNameInput("");
          setIsFolderModalOpen(false);
        },
      }
    );
  };

  const handleRenameFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameFolderId || !renameFolderName.trim()) return;
    renameFolder.mutate(
      { id: renameFolderId, name: renameFolderName },
      {
        onSuccess: () => {
          setRenameFolderId(null);
          setRenameFolderName("");
          setIsRenameFolderModalOpen(false);
        },
      }
    );
  };

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagNameInput.trim()) return;
    createTag.mutate(
      { name: tagNameInput, color: tagColorInput },
      {
        onSuccess: () => {
          setTagNameInput("");
          setIsTagModalOpen(false);
        },
      }
    );
  };

  // Bulk Actions
  const handleBulkAction = (action: "trash" | "restore" | "delete" | "archive" | "unarchive" | "move-folder", folderId?: string) => {
    if (selectedIds.length === 0) return;
    bulkActions.mutate(
      { ids: selectedIds, action, folderId },
      {
        onSuccess: () => {
          clearSelectedIds();
        },
      }
    );
  };

  // Drag and drop handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnFolder = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    const convId = e.dataTransfer.getData("conversationId");
    if (!convId) return;

    updateConversation.mutate(
      { id: convId, folderId },
      {
        onSuccess: () => {
          addToast(
            folderId ? "Conversation moved to folder" : "Conversation removed from folder",
            "success"
          );
        },
      }
    );
  };

  return (
    <DashboardShell>
      <PageContainer
        title="Conversations Console"
        subtitle="Manage custom threads, workspaces folders, and tags"
        headerActions={
          <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-950/20 border border-brand-500/10 text-brand-400 text-xs font-semibold rounded-full select-none">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>AI Ready Sandbox</span>
          </span>
        }
      >
        <div className="flex border border-border bg-card rounded-2xl h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] overflow-hidden">
          
          {/* LEFT SIDEBAR PANEL */}
          <div className="w-80 shrink-0 border-r border-border flex flex-col justify-between h-full bg-zinc-950/15 relative">
            
            {/* Header search, navigation tabs, sort buttons */}
            <div className="p-4 border-b border-border flex flex-col gap-3 shrink-0">
              <Button onClick={handleCreateNewChat} size="sm" className="w-full text-xs font-semibold">
                <Plus className="h-4 w-4 mr-1.5" />
                <span>New Conversation</span>
              </Button>

              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search threads (Ctrl+K)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs bg-zinc-900 border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/15 text-foreground"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 hover:text-foreground text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* View Tabs */}
              <div className="flex justify-around border-b border-border/60 pb-1 select-none">
                <Link
                  href="/chat"
                  className={`text-[11px] font-bold pb-1 px-1 transition-colors ${
                    isAllTab
                      ? "border-b-2 border-brand-500 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </Link>
                <Link
                  href="/chat/favorites"
                  className={`text-[11px] font-bold pb-1 px-1 transition-colors ${
                    isFavoritesTab
                      ? "border-b-2 border-brand-500 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Stars
                </Link>
                <Link
                  href="/chat/archive"
                  className={`text-[11px] font-bold pb-1 px-1 transition-colors ${
                    isArchiveTab
                      ? "border-b-2 border-brand-500 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Archived
                </Link>
                <Link
                  href="/chat/trash"
                  className={`text-[11px] font-bold pb-1 px-1 transition-colors ${
                    isTrashTab
                      ? "border-b-2 border-brand-500 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Trash
                </Link>
              </div>

              {/* Folder & Tag filters */}
              <div className="flex justify-between items-center gap-1">
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                  {/* Folder filter dropdown */}
                  <select
                    value={selectedFolderId || ""}
                    onChange={(e) => setSelectedFolderId(e.target.value || null)}
                    className="h-7 px-2 bg-zinc-900 border border-border rounded text-[10px] text-muted-foreground focus:outline-none"
                  >
                    <option value="">All Folders</option>
                    <option value="none">No Folder</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        📁 {f.name}
                      </option>
                    ))}
                  </select>

                  {/* Tag filter dropdown */}
                  <select
                    value={selectedTagId || ""}
                    onChange={(e) => setSelectedTagId(e.target.value || null)}
                    className="h-7 px-2 bg-zinc-900 border border-border rounded text-[10px] text-muted-foreground focus:outline-none"
                  >
                    <option value="">All Tags</option>
                    {tags.map((t) => (
                      <option key={t.id} value={t.id}>
                        🏷️ {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Toggle */}
                <button
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground text-xs font-mono font-bold"
                  title="Toggle sort order"
                >
                  {sortOrder === "desc" ? "↓" : "↑"}
                </button>
              </div>
            </div>

            {/* SCROLLABLE SIDEBAR CONTENT */}
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-4">
              
              {/* Folders Management Panel */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center px-2 select-none">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Workspaces</span>
                  <button
                    onClick={() => setIsFolderModalOpen(true)}
                    className="text-muted-foreground hover:text-foreground"
                    title="New folder"
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnFolder(e, null)}
                    onClick={() => setSelectedFolderId(null)}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs cursor-pointer ${
                      selectedFolderId === null ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Folder className="h-3.5 w-3.5" />
                    <span>All Workspaces</span>
                  </div>
                  {folders.map((folder) => {
                    const isActive = selectedFolderId === folder.id;
                    return (
                      <div
                        key={folder.id}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnFolder(e, folder.id)}
                        onClick={() => setSelectedFolderId(folder.id)}
                        className={`flex items-center justify-between group px-2 py-1 rounded text-xs cursor-pointer ${
                          isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Folder className="h-3.5 w-3.5 shrink-0" style={{ color: folder.color || undefined }} />
                          <span className="truncate">{folder.name}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameFolderId(folder.id);
                              setRenameFolderName(folder.name);
                              setIsRenameFolderModalOpen(true);
                            }}
                            className="p-0.5 rounded hover:bg-zinc-800 text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Are you sure you want to delete this folder? Conversations inside will NOT be deleted.")) {
                                removeFolder.mutate(folder.id);
                              }
                            }}
                            className="p-0.5 rounded hover:bg-zinc-800 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tags Management Panel */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center px-2 select-none">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Tags</span>
                  <button
                    onClick={() => setIsTagModalOpen(true)}
                    className="text-muted-foreground hover:text-foreground"
                    title="New tag"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 p-1">
                  <button
                    onClick={() => setSelectedTagId(null)}
                    className={`px-2 py-0.5 rounded-full text-[10px] border transition-colors ${
                      selectedTagId === null
                        ? "bg-secondary text-foreground border-border"
                        : "bg-transparent text-muted-foreground border-transparent hover:border-border"
                    }`}
                  >
                    Clear Filter
                  </button>
                  {tags.map((tag) => {
                    const isSelected = selectedTagId === tag.id;
                    return (
                      <button
                        key={tag.id}
                        onClick={() => setSelectedTagId(tag.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 transition-colors ${
                          isSelected
                            ? "bg-brand-950/20 text-brand-400 border-brand-500/20"
                            : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: tag.color || "#818cf8" }} />
                        <span>{tag.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conversations Card List */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] px-2 uppercase font-bold tracking-wider text-muted-foreground select-none">Threads</span>
                {isLoadingConvs ? (
                  <div className="flex flex-col gap-2 p-2">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-14 w-full bg-zinc-900 border border-border animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground select-none">
                    No threads found.
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const isSelected = conv.id === activeConversationId;
                    const isChecked = selectedIds.includes(conv.id);

                    return (
                      <div
                        key={conv.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("conversationId", conv.id)}
                        onClick={() => {
                          if (isMultiSelecting) {
                            toggleSelectId(conv.id);
                          } else {
                            router.push(`/chat/${conv.id}`);
                          }
                        }}
                        className={`p-3 rounded-xl border flex flex-col gap-1.5 cursor-pointer relative group transition-all duration-150 ${
                          isSelected
                            ? "bg-brand-950/20 text-brand-500 border-brand-500/20 shadow-sm"
                            : "bg-transparent border-transparent text-foreground hover:bg-secondary"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1 pr-6 select-none">
                          <div className="flex items-start gap-2 truncate">
                            {/* Checkbox for bulk select */}
                            {(isMultiSelecting || isChecked) ? (
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleSelectId(conv.id);
                                }}
                                className="h-3.5 w-3.5 text-brand-500 bg-zinc-900 border-border rounded focus:ring-0 shrink-0 mt-0.5"
                              />
                            ) : (
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleSelectId(conv.id);
                                }}
                                className="h-3.5 w-3.5 text-brand-500 bg-zinc-900 border-border rounded focus:ring-0 opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 transition-opacity"
                              />
                            )}
                            <span className="text-xs font-semibold truncate leading-tight">{conv.title}</span>
                          </div>
                          
                          <div className="flex gap-0.5 shrink-0">
                            {conv.isPinned && (
                              <Pin className="h-3 w-3 text-brand-400 rotate-45" fill="currentColor" />
                            )}
                            {conv.isFavorite && (
                              <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] text-muted-foreground uppercase font-mono tracking-tight select-none">
                          <span>{conv.modelProvider} / {conv.modelName}</span>
                          <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                        </div>

                        {/* Inline tag indicators */}
                        {conv.tags && conv.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {conv.tags.map((t) => (
                              <span
                                key={t.id}
                                className="px-1.5 py-0.5 rounded-full text-[8px] border border-border flex items-center gap-0.5 text-muted-foreground"
                              >
                                <span className="h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: t.color || "#818cf8" }} />
                                <span>{t.name}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Dropdown Menu actions */}
                        <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === conv.id ? null : conv.id);
                            }}
                            className="p-1 rounded hover:bg-zinc-800 border border-border text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </button>

                          {activeMenuId === conv.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-zinc-900 border border-border rounded-lg shadow-xl z-20 p-1 flex flex-col gap-0.5 select-none">
                              {isTrashTab ? (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteConversation.mutate({ id: conv.id, type: "restore" });
                                      setActiveMenuId(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                                  >
                                    <Trash className="h-3.5 w-3.5" />
                                    <span>Restore Thread</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm("Are you sure you want to permanently delete this thread? This action is irreversible.")) {
                                        deleteConversation.mutate({ id: conv.id, type: "permanent" });
                                      }
                                      setActiveMenuId(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-destructive hover:bg-secondary rounded"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Permanent Delete</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateConversation.mutate({ id: conv.id, isPinned: !conv.isPinned });
                                      setActiveMenuId(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                                  >
                                    <Pin className="h-3.5 w-3.5 rotate-45" />
                                    <span>{conv.isPinned ? "Unpin Thread" : "Pin Thread"}</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateConversation.mutate({ id: conv.id, isFavorite: !conv.isFavorite });
                                      setActiveMenuId(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                                  >
                                    <Star className="h-3.5 w-3.5" />
                                    <span>{conv.isFavorite ? "Unstar Thread" : "Star Thread"}</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateConversation.mutate({ id: conv.id, isArchived: !conv.isArchived });
                                      setActiveMenuId(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                                  >
                                    <Archive className="h-3.5 w-3.5" />
                                    <span>{conv.isArchived ? "Move to Active" : "Archive Thread"}</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      duplicateConversation.mutate(conv.id);
                                      setActiveMenuId(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Duplicate Session</span>
                                  </button>

                                  <div className="border-t border-border my-1" />

                                  {/* Quick assign tag options */}
                                  <div className="px-2 py-1 text-[9px] uppercase font-bold text-muted-foreground">Assign Tag</div>
                                  {tags.map((t) => {
                                    const hasTag = conv.tags?.some((ct) => ct.id === t.id);
                                    return (
                                      <button
                                        key={t.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (hasTag) {
                                            unassignTag.mutate({ conversationId: conv.id, tagId: t.id });
                                          } else {
                                            assignTag.mutate({ conversationId: conv.id, tagId: t.id });
                                          }
                                        }}
                                        className="flex items-center justify-between w-full px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                                      >
                                        <div className="flex items-center gap-1.5 truncate">
                                          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: t.color || "#818cf8" }} />
                                          <span className="truncate">{t.name}</span>
                                        </div>
                                        {hasTag && <Check className="h-3 w-3 text-brand-500 shrink-0" />}
                                      </button>
                                    );
                                  })}

                                  <div className="border-t border-border my-1" />

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteConversation.mutate({ id: conv.id, type: "trash" });
                                      setActiveMenuId(null);
                                      if (isSelected) {
                                        router.push("/chat");
                                      }
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-destructive hover:bg-secondary rounded w-full text-left"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Move to Trash</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* BULK ACTIONS FLOATING TOOLBAR */}
            {isMultiSelecting && selectedIds.length > 0 && (
              <div className="absolute bottom-2 left-2 right-2 p-3 bg-zinc-900 border border-border rounded-xl shadow-xl flex flex-col gap-2 z-30 select-none">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-brand-400">
                    {selectedIds.length} Selected
                  </span>
                  <button onClick={clearSelectedIds} className="text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {isTrashTab ? (
                    <>
                      <Button onClick={() => handleBulkAction("restore")} size="xs">
                        Restore
                      </Button>
                      <Button onClick={() => handleBulkAction("delete")} size="xs" variant="destructive">
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleBulkAction("archive")} size="xs" variant="secondary">
                        Archive
                      </Button>
                      <Button onClick={() => handleBulkAction("trash")} size="xs" variant="destructive">
                        Trash
                      </Button>
                      {/* Move to Folder Quick select */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleBulkAction("move-folder", e.target.value);
                          }
                        }}
                        className="h-7 px-1.5 bg-zinc-850 border border-border rounded text-[10px] text-muted-foreground focus:outline-none"
                      >
                        <option value="">Move Folder</option>
                        {folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT VIEWPORT FOR SUB-PAGES */}
          <div className="flex-1 flex flex-col h-full bg-zinc-950/20 relative">
            {children}
          </div>
        </div>

        {/* DIALOG MODALS */}
        {/* Create Folder Modal */}
        <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>New Workspace Folder</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateFolder} className="flex flex-col gap-4 mt-4">
              <Input
                placeholder="Folder name..."
                value={folderNameInput}
                onChange={(e) => setFolderNameInput(e.target.value)}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Pick a color:</span>
                <input
                  type="color"
                  value={folderColorInput}
                  onChange={(e) => setFolderColorInput(e.target.value)}
                  className="h-8 w-12 border-none bg-transparent cursor-pointer rounded"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsFolderModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Create Folder
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Rename Folder Modal */}
        <Dialog open={isRenameFolderModalOpen} onOpenChange={setIsRenameFolderModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Rename Workspace Folder</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRenameFolder} className="flex flex-col gap-4 mt-4">
              <Input
                placeholder="Folder name..."
                value={renameFolderName}
                onChange={(e) => setRenameFolderName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2 justify-end mt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsRenameFolderModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Rename
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Create Tag Modal */}
        <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTag} className="flex flex-col gap-4 mt-4">
              <Input
                placeholder="Tag name..."
                value={tagNameInput}
                onChange={(e) => setTagNameInput(e.target.value)}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Pick a color:</span>
                <input
                  type="color"
                  value={tagColorInput}
                  onChange={(e) => setTagColorInput(e.target.value)}
                  className="h-8 w-12 border-none bg-transparent cursor-pointer rounded"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsTagModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Create Tag
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </PageContainer>
    </DashboardShell>
  );
}
