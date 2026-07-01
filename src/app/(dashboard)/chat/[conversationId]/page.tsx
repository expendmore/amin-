"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/store/use-toast";
import { useChat } from "@/store/use-chat";
import {
  useConversations,
  useUpdateConversation,
  useDeleteConversation,
  useAvailableModels,
} from "@/hooks/use-conversations";
import { useMessages, useSendMessage } from "@/hooks/use-messages";
import Button from "@/components/ui/Button";
import MarkdownRenderer from "@/components/chat/MarkdownRenderer";
import ChatRightPanel from "@/components/chat/ChatRightPanel";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Send,
  Bot,
  MessageSquare,
  Sparkles,
  WifiOff,
  Star,
  Archive,
  Trash,
  ChevronDown,
  CornerDownLeft,
  Info,
  Paperclip,
  Mic,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  X,
  FileText,
  AlertTriangle,
  StopCircle,
  Undo2,
  Trash2,
  Check
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  progress: number;
}

export default function ConversationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const conversationId = params?.conversationId as string;
  const { addToast } = useToast();
  const { data: availableModels = [] } = useAvailableModels();

  // Active network connection detector
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Zustand Store variables
  const { drafts, setDraft, clearDraft } = useChat();

  // Queries
  const { data: conversations = [] } = useConversations();
  const currentConversation = conversations.find((c) => c.id === conversationId);
  const { data: messages = [], isLoading: isLoadingMessages, isError: isErrorMessages } = useMessages(
    conversationId
  );

  // Mutations
  const updateConversation = useUpdateConversation();
  const deleteConversation = useDeleteConversation();
  const sendMessage = useSendMessage();

  // Local states
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("openai");
  const [modelName, setModelName] = useState("gpt-4o-mini");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [showRightPanel, setShowRightPanel] = useState(true);

  // File upload state
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording mock state
  const [isRecording, setIsRecording] = useState(false);

  // Slash commands state
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [slashIndex, setSlashIndex] = useState(0);
  const slashCommandsList = [
    { cmd: "/agent", desc: "Select custom assistant persona profile" },
    { cmd: "/workflow", desc: "Attach automation catalog description parameters" },
    { cmd: "/memory", desc: "Inject specific pinned guidelines to workspace memory" },
    { cmd: "/help", desc: "List shortcut key maps and documentation pages" }
  ];

  // Streaming states
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullMockTextRef = useRef("");

  // Feedback Modal
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [likedMessages, setLikedMessages] = useState<Record<string, "like" | "dislike">>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync prompt with draft recovery
  useEffect(() => {
    if (conversationId) {
      setPrompt(drafts[conversationId] || "");
    }
  }, [conversationId, drafts]);

  // Sync selected model details with conversation attributes on load
  useEffect(() => {
    if (currentConversation) {
      setProvider(currentConversation.modelProvider);
      setModelName(currentConversation.modelName);
      setEditedTitle(currentConversation.title);
    }
  }, [currentConversation]);

  // Scroll messages to bottom on new updates or streaming ticks
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0 || streamingContent) {
      scrollToBottom();
    }
  }, [messages, streamingContent]);

  // Auto-expand textarea helper
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [prompt]);

  // Handle local typing: cache drafts reactively
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPrompt(val);
    if (conversationId) {
      setDraft(conversationId, val);
    }

    // Toggle slash commands dropdown if prompt starts with '/'
    if (val.startsWith("/")) {
      setShowSlashCommands(true);
    } else {
      setShowSlashCommands(false);
    }
  };

  // Handle keydown actions (character shortcuts & select commands)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSlashCommands) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashIndex((prev) => (prev + 1) % slashCommandsList.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashIndex((prev) => (prev - 1 + slashCommandsList.length) % slashCommandsList.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        insertSlashCommand(slashCommandsList[slashIndex].cmd);
      } else if (e.key === "Escape") {
        setShowSlashCommands(false);
      }
    } else {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendPrompt(e);
      }
    }
  };

  const insertSlashCommand = (cmd: string) => {
    setPrompt(cmd + " ");
    setShowSlashCommands(false);
    textareaRef.current?.focus();
  };

  // Voice recording mock
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      setPrompt("Simulated voice transcription output successfully loaded.");
      addToast("Voice input processed.", "success");
    } else {
      setIsRecording(true);
      setPrompt("Listening...");
      addToast("Microphone active. Speak now...", "info");
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          setPrompt("Optimizing SaaS WhatsApp campaign flow.");
          addToast("Voice input processed.", "success");
        }
      }, 2500);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addFilesToQueue(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files);
    }
  };

  const addFilesToQueue = (files: FileList) => {
    const newFiles: AttachedFile[] = Array.from(files).map((f) => ({
      id: `file_${Math.random().toString(36).substring(2, 9)}`,
      name: f.name,
      size: (f.size / 1024).toFixed(0) + " KB",
      type: f.type || "application/octet-stream",
      progress: 0
    }));

    setAttachedFiles((prev) => [...prev, ...newFiles]);

    // Simulate progress bars increasing
    newFiles.forEach((fileItem) => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 20;
        setAttachedFiles((prev) =>
          prev.map((f) => (f.id === fileItem.id ? { ...f, progress: Math.min(currentProgress, 100) } : f))
        );
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    });

    addToast("Files added to upload queue.", "info");
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Send action & stream simulation trigger
  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !conversationId || isStreaming) return;

    if (!isOnline) {
      addToast("Failed to transmit. Active connection offline.", "error");
      return;
    }

    const messageText = prompt;
    setPrompt("");
    setAttachedFiles([]);
    if (conversationId) {
      clearDraft(conversationId);
    }

    // 1. Fire Supabase user message insertion via react-query mutation
    sendMessage.mutate(
      {
        conversationId,
        content: messageText,
        modelName,
      },
      {
        onSuccess: async (data: any) => {
          // Trigger local word-by-word streaming simulation immediately!
          setIsStreaming(true);
          setStreamingContent("");

          // 2. Fetch the assistant placeholder message we just inserted (status = 'sending')
          if (data && data.assistantMessageId) {
            setStreamingMessageId(data.assistantMessageId);
          }

          // Mock detailed response content (includes code block & table to demonstrate markdown)
          fullMockTextRef.current = `Sure! Let's examine the layout specifications. Here is a PostgreSQL schema and a summary:

\`\`\`sql
CREATE TABLE public.ai_gateway_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    cost DECIMAL(10, 6) DEFAULT 0.00
);
\`\`\`

Here is a performance comparison table:

| Provider | Model Name | Avg. Latency | Output Quality |
| :--- | :--- | :---: | :---: |
| OpenAI | gpt-4o | 320ms | High |
| Anthropic | claude-3-5-sonnet | 450ms | Exceptional |
| DeepSeek | deepseek-coder | 220ms | Good |

Let me know if you would like me to configure custom webhooks triggers for this schema.`;

          const words = fullMockTextRef.current.split(" ");
          let currentWordIdx = 0;
          let accumulated = "";

          // Start interval
          streamIntervalRef.current = setInterval(async () => {
            if (currentWordIdx < words.length) {
              accumulated += (currentWordIdx === 0 ? "" : " ") + words[currentWordIdx];
              setStreamingContent(accumulated);
              currentWordIdx++;
            } else {
              // Finalize stream successfully
              finalizeStream(accumulated);
            }
          }, 60);
        },
        onError: () => {
          addToast("Error posting message. Please retry.", "error");
        },
      }
    );
  };

  // Stop generation trigger
  const handleStopGeneration = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      setIsStreaming(false);
      finalizeStream(streamingContent + " [Generation Stopped by User]");
      addToast("Generation halted.", "info");
    }
  };

  const finalizeStream = async (finalText: string) => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }
    setIsStreaming(false);
    setStreamingContent("");

    if (streamingMessageId) {
      // Update assistant placeholder in Firestore with final response
      const msgDocRef = doc(db, "messages", streamingMessageId);
      await updateDoc(msgDocRef, {
        content: finalText,
        status: "sent",
        metadata: { model_name: modelName, tokens: 120 }
      });

      // Invalidate queries to refresh listing
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
    setStreamingMessageId(null);
  };

  // Regenerate response
  const handleRegenerate = async () => {
    if (messages.length === 0 || isStreaming) return;
    
    // Find last user message
    const userMsgs = messages.filter(m => m.role === "user");
    if (userMsgs.length === 0) return;
    const lastUserPrompt = userMsgs[userMsgs.length - 1].content;

    setPrompt(lastUserPrompt);
    addToast("Loaded last query. Retrying...", "info");
  };

  // Copy whole message to clipboard
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("Message text copied to clipboard!", "success");
  };

  // Thumb ratings
  const handleRateResponse = (id: string, rating: "like" | "dislike") => {
    setLikedMessages(prev => ({ ...prev, [id]: rating }));
    if (rating === "like") {
      addToast("Feedback recorded. Thanks!", "success");
    } else {
      setIsFeedbackOpen(true);
    }
  };

  // Title Rename submit
  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedTitle.trim() || !conversationId) return;
    updateConversation.mutate(
      { id: conversationId, title: editedTitle },
      {
        onSuccess: () => {
          setIsEditingTitle(false);
        },
      }
    );
  };

  // Favorites/Archive shortcuts
  const handleToggleFavorite = () => {
    if (!currentConversation) return;
    updateConversation.mutate({
      id: conversationId,
      isFavorite: !currentConversation.isFavorite,
    });
  };

  const handleToggleArchive = () => {
    if (!currentConversation) return;
    updateConversation.mutate({
      id: conversationId,
      isArchived: !currentConversation.isArchived,
    });
  };

  const handleDelete = () => {
    if (!currentConversation) return;
    deleteConversation.mutate(
      { id: conversationId, type: "trash" },
      {
        onSuccess: () => {
          router.push("/chat");
        },
      }
    );
  };

  // Loading skeleton layout
  if (isLoadingMessages) {
    return (
      <div className="flex flex-col h-full justify-between p-4 overflow-hidden select-none w-full bg-zinc-950/20">
        <div className="h-12 border-b border-border flex items-center justify-between px-2 animate-pulse mb-4">
          <div className="h-4 w-32 bg-secondary rounded" />
          <div className="h-7 w-24 bg-secondary rounded" />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`flex flex-col max-w-[70%] rounded-2xl p-4 gap-2 ${
                n % 2 === 0 ? "self-end bg-secondary/40" : "self-start bg-zinc-900/30 border border-border/50"
              } animate-pulse`}
            >
              <div className="h-2.5 w-12 bg-secondary rounded" />
              <div className="h-3 w-48 bg-secondary rounded" />
              <div className="h-2 w-24 bg-secondary rounded" />
            </div>
          ))}
        </div>
        <div className="h-11 bg-secondary/30 rounded-xl animate-pulse w-full mt-4" />
      </div>
    );
  }

  // Error page state
  if (isErrorMessages || !currentConversation) {
    return (
      <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto my-auto gap-4 select-none h-full px-4 w-full bg-zinc-950/20">
        <span className="p-3 bg-red-950/20 text-red-500 rounded-full border border-red-500/10">
          <MessageSquare className="h-6 w-6 animate-pulse" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-foreground">Conversation Session Missing</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The active thread segment is inaccessible, deleted, or was mapped to another folder workspace scope.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 flex h-full overflow-hidden bg-zinc-950/20 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      
      {/* DRAG AND DROP FULLSCREEN HOVER OVERLAY */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-brand-sky-light/10 border-2 border-dashed border-brand-sky/60 flex flex-col items-center justify-center text-center gap-2 backdrop-blur-sm pointer-events-none">
          <Paperclip className="h-10 w-10 text-brand-sky animate-bounce" />
          <span className="text-sm font-bold text-brand-sky">Drop Files to Index</span>
          <span className="text-xs text-muted-foreground">Supported format: PDF, DOCX, TXT, CSV, JSON, ZIP</span>
        </div>
      )}

      {/* CENTER PANEL: CONVERSATION WINDOW */}
      <div className="flex-grow flex flex-col justify-between h-full p-4 overflow-hidden relative">
        
        {/* OFFLINE INDICATOR BAR */}
        {!isOnline && (
          <div className="absolute top-0 left-0 right-0 z-40 bg-red-950/80 border-b border-red-500/20 py-1.5 px-4 text-xs text-red-400 font-semibold flex items-center gap-2 justify-center backdrop-blur-sm select-none">
            <WifiOff className="h-3.5 w-3.5 shrink-0" />
            <span>Offline state. Dispatched queries will sync once connection returns.</span>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="flex justify-between items-center select-none border-b border-border/60 pb-3 mb-2 shrink-0">
          
          {/* Inline editable title */}
          <div className="flex items-center gap-2 max-w-[60%]">
            {isEditingTitle ? (
              <form onSubmit={handleRename} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="h-8 px-2 bg-zinc-900 border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-sky"
                  autoFocus
                  onBlur={() => setIsEditingTitle(false)}
                />
              </form>
            ) : (
              <span
                onClick={() => setIsEditingTitle(true)}
                className="text-xs font-bold text-foreground cursor-pointer hover:underline flex items-center gap-1.5 truncate"
                title="Click to rename"
              >
                <Bot className="h-4 w-4 text-brand-sky shrink-0 animate-pulse" />
                <span className="truncate">{currentConversation.title}</span>
              </span>
            )}
          </div>

          {/* Toolbar details & Options */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded hover:bg-secondary border border-border text-xs transition-colors cursor-pointer ${
                currentConversation.isFavorite ? "text-amber-500" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Star Favorite"
            >
              <Star className="h-3.5 w-3.5" fill={currentConversation.isFavorite ? "currentColor" : "none"} />
            </button>
            
            <button
              onClick={handleToggleArchive}
              className={`p-1.5 rounded hover:bg-secondary border border-border text-xs transition-colors cursor-pointer ${
                currentConversation.isArchived ? "text-brand-sky" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Archive"
            >
              <Archive className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={handleDelete}
              className="p-1.5 rounded hover:bg-secondary border border-border text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              title="Trash"
            >
              <Trash className="h-3.5 w-3.5" />
            </button>

            <div className="border-l border-border h-6 mx-1 shrink-0" />

            {/* Right Panel toggle button */}
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className={`p-1.5 rounded border text-xs transition-all cursor-pointer ${
                showRightPanel
                  ? "bg-brand-sky-light/10 border-brand-sky/30 text-brand-sky"
                  : "bg-white dark:bg-zinc-900 border-border text-muted-foreground hover:text-foreground"
              }`}
              title="Toggle Right Panel"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* MESSAGES LOG STREAM */}
        <div
          ref={messagesContainerRef}
          className="flex-grow overflow-y-auto flex flex-col gap-4 mb-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent py-4 select-text px-4 md:px-8 wa-chat-container rounded-2xl border border-border/40"
        >
          {messages.length === 0 && !streamingContent ? (
            <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto my-auto gap-6 select-none py-10">
              <div className="p-4 bg-zinc-900 border border-border text-brand-sky rounded-full relative">
                <MessageSquare className="h-8 w-8 animate-pulse" />
                <Sparkles className="h-4.5 w-4.5 text-brand-sky absolute -top-1 -right-1" />
              </div>
              
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-foreground">Start a New Conversation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                  Type a prompt below, drop raw document assets, or choose one of the suggestion templates below.
                </p>
              </div>

              {/* Suggestions grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md pt-2">
                <button
                  onClick={() => setPrompt("Optimize my React state reducer functions to prevent cascade rendering.")}
                  className="p-3 bg-zinc-900/30 hover:bg-brand-sky-light/10 border border-border hover:border-brand-sky/40 rounded-xl text-left text-xs transition-all cursor-pointer flex flex-col gap-1 group"
                >
                  <span className="font-bold text-foreground group-hover:text-brand-sky transition-colors">React State Code</span>
                  <span className="text-[10px] text-muted-foreground">"Optimize React state reducer..."</span>
                </button>
                
                <button
                  onClick={() => setPrompt("Generate a secure PostgreSQL DDL schema with indexes mapping transaction keys.")}
                  className="p-3 bg-zinc-900/30 hover:bg-brand-sky-light/10 border border-border hover:border-brand-sky/40 rounded-xl text-left text-xs transition-all cursor-pointer flex flex-col gap-1 group"
                >
                  <span className="font-bold text-foreground group-hover:text-brand-sky transition-colors">Postgres DDL</span>
                  <span className="text-[10px] text-muted-foreground">"Generate PostgreSQL DDL..."</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 select-text">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                const isSending = msg.status === "sending";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[70%] p-3.5 text-xs transition-all border relative group select-text shadow-sm ${
                      isUser
                        ? "wa-bubble-outgoing self-end"
                        : "wa-bubble-incoming self-start"
                    } ${isSending ? "opacity-60" : ""}`}
                  >
                    {/* Floating mini toolbar for copying and rating */}
                    <div className="absolute -top-3.5 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-zinc-900 border border-border rounded shadow-sm text-muted-foreground select-none overflow-hidden z-20">
                      <button
                        onClick={() => handleCopyMessage(msg.content)}
                        className="p-1 hover:bg-zinc-800 hover:text-foreground cursor-pointer"
                        title="Copy message"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      {!isUser && (
                        <>
                          <button
                            onClick={() => handleRateResponse(msg.id, "like")}
                            className={`p-1 hover:bg-zinc-800 cursor-pointer ${likedMessages[msg.id] === "like" ? "text-emerald-400" : "hover:text-foreground"}`}
                            title="Thumbs Up"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleRateResponse(msg.id, "dislike")}
                            className={`p-1 hover:bg-zinc-800 cursor-pointer ${likedMessages[msg.id] === "dislike" ? "text-red-400" : "hover:text-foreground"}`}
                            title="Thumbs Down"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground mb-1 select-none gap-4">
                      <span>{isUser ? "USER" : `AI ENGINE (${msg.metadata?.model_name || modelName})`}</span>
                    </div>

                    <div className="select-text">
                      <MarkdownRenderer content={msg.content} />
                    </div>

                    <div className="flex items-center gap-1 self-end mt-1.5 select-none">
                      <span className="text-[8.5px] text-muted-foreground/70">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {isUser && (
                        <div className="flex text-[#53bdeb] ml-1">
                          <Check className="h-3.5 w-3.5 shrink-0 -mr-1.5" />
                          <Check className="h-3.5 w-3.5 shrink-0" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Streaming Content Display */}
              {isStreaming && streamingContent && (
                <div className="flex flex-col max-w-[70%] p-3.5 text-xs border wa-bubble-incoming self-start select-text shadow-sm">
                  <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground/60 mb-1 select-none gap-4">
                    <span>AI ENGINE STREAMING ({modelName})</span>
                  </div>
                  
                  <div className="select-text flex flex-col gap-0.5">
                    <MarkdownRenderer content={streamingContent} />
                    {/* Blinking Typing Cursor */}
                    <span className="inline-block w-1.5 h-3.5 bg-brand-sky ml-0.5 animate-pulse shrink-0 align-middle" />
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* FOOTER INPUT BOX PANEL */}
        <div className="flex flex-col gap-2.5 shrink-0 select-none">
          
          {/* File Attachments Queue Previews */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 flex-wrap">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-2.5 py-1 bg-zinc-900 border border-border rounded-lg text-[10px] shrink-0 font-medium"
                >
                  <FileText className="h-3.5 w-3.5 text-brand-sky shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-foreground truncate max-w-[100px]">{file.name}</span>
                    <span className="text-[8px] text-muted-foreground font-mono leading-none">{file.size}</span>
                  </div>
                  {file.progress < 100 ? (
                    <span className="text-[8px] text-brand-sky font-mono font-bold animate-pulse">{file.progress}%</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer ml-1 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Slash Commands Dropdown Overlay */}
          {showSlashCommands && (
            <div className="bg-zinc-950 border border-border rounded-xl shadow-lg p-1.5 flex flex-col max-w-sm mb-1 absolute bottom-[68px] left-4 z-40 select-none">
              {slashCommandsList.map((item, idx) => (
                <button
                  key={item.cmd}
                  onClick={() => insertSlashCommand(item.cmd)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-4 cursor-pointer ${
                    slashIndex === idx
                      ? "bg-brand-sky text-white font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="font-mono">{item.cmd}</span>
                  <span className="text-[9px] opacity-80 font-medium">{item.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* Main prompt input box container */}
          <form onSubmit={handleSendPrompt} className="flex gap-2 relative p-3 rounded-2xl wa-input-bar">
            <div className="relative flex-grow bg-white dark:bg-slate-900 border border-white/[0.06] rounded-xl focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
              
              {/* Attachment selector hidden */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              <textarea
                ref={textareaRef}
                id="chat-prompt-box"
                placeholder={isOnline ? (isRecording ? "Listening..." : "Ask anything... (Use / for actions)") : "Offline. Awaiting link reconnection..."}
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
                disabled={!isOnline}
                rows={1}
                className="w-full pl-4 pr-24 py-3 bg-transparent text-xs text-foreground placeholder-muted-foreground focus:outline-none resize-none leading-relaxed select-text min-h-[44px]"
              />

              {/* Utility actions inside input box */}
              <div className="absolute right-3 bottom-2 flex items-center gap-1.5 select-none text-muted-foreground/65 z-10">
                
                {/* Character counter */}
                <span className="text-[8px] font-bold font-mono mr-1 select-none text-muted-foreground/50">
                  {prompt.length}/4,000
                </span>

                {/* Attach File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 hover:bg-zinc-800 hover:text-foreground rounded-lg transition-colors cursor-pointer"
                  title="Attach Documents"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                </button>

                {/* Voice Mic Button */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`p-1.5 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer ${isRecording ? "text-red-500 animate-pulse bg-red-950/20" : "hover:text-foreground"}`}
                  title="Voice dictation"
                >
                  <Mic className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            
            {/* Conditional Send vs Stop Generation button */}
            {isStreaming ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleStopGeneration}
                className="shrink-0 h-11 w-11 rounded-xl flex items-center justify-center p-0 cursor-pointer shadow-sm hover:shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                title="Stop generation"
              >
                <StopCircle className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!prompt.trim() || !isOnline}
                className="shrink-0 h-11 w-11 rounded-xl flex items-center justify-center p-0 cursor-pointer shadow-sm bg-[#00a884] hover:bg-[#008f72] border-none text-white"
                title="Send query"
              >
                <Send className="h-4.5 w-4.5" />
              </Button>
            )}
          </form>

          {/* Assistant Action Shortcuts (Regenerate, etc.) */}
          {messages.length > 0 && !isStreaming && (
            <div className="flex items-center gap-2 select-none text-[9px] font-bold text-muted-foreground px-2 pt-0.5">
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Regenerate Response</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: INSPECTOR COLLAPSIBLE */}
      {showRightPanel && (
        <ChatRightPanel
          conversation={{
            id: currentConversation.id,
            title: currentConversation.title,
            modelProvider: provider,
            modelName: modelName,
            createdAt: currentConversation.createdAt
          }}
          onUpdateModel={(newProvider, newModel) => {
            setProvider(newProvider);
            setModelName(newModel);
            updateConversation.mutate({
              id: conversationId,
              modelProvider: newProvider,
              modelName: newModel
            });
          }}
          availableModels={availableModels}
          messageCount={messages.length}
        />
      )}

      {/* FEEDBACK MODAL */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Negative Response Feedback</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsFeedbackOpen(false);
              setFeedbackText("");
              addToast("Feedback submitted. Thank you!", "success");
            }}
            className="flex flex-col gap-4 mt-4"
          >
            <span className="text-[11px] text-muted-foreground leading-normal">
              Explain why this response was not satisfactory to help improve future prompt calibrations.
            </span>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full h-24 p-2 bg-zinc-900 border border-border rounded text-[11px] leading-relaxed text-foreground focus:outline-none resize-none"
              placeholder="E.g. code contained syntax error..."
              autoFocus
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsFeedbackOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Submit Feedback
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
