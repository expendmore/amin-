"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/store/use-toast";
import { useChat } from "@/store/use-chat";
import {
  useConversations,
  useUpdateConversation,
  useDeleteConversation,
} from "@/hooks/use-conversations";
import { useMessages, useSendMessage } from "@/hooks/use-messages";
import Button from "@/components/ui/Button";
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
} from "lucide-react";

export default function ConversationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.conversationId as string;
  const { addToast } = useToast();

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

  // Local Form state
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("openai");
  const [modelName, setModelName] = useState("gpt-4o-mini");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  // Handle local typing: cache drafts reactively
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPrompt(val);
    if (conversationId) {
      setDraft(conversationId, val);
    }
  };

  // Scroll messages to bottom on new updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !conversationId) return;

    if (!isOnline) {
      addToast("Failed to transmit. Active connection offline.", "error");
      return;
    }

    const messageText = prompt;
    setPrompt("");
    if (conversationId) {
      clearDraft(conversationId);
    }

    sendMessage.mutate(
      {
        conversationId,
        content: messageText,
        modelName,
      },
      {
        onError: () => {
          addToast("Error posting message. Please retry.", "error");
        },
      }
    );
  };

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

  // Quick Action Toggles
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
      <div className="flex flex-col h-full justify-between p-4 overflow-hidden select-none">
        <div className="h-12 border-b border-border flex items-center justify-between px-2 animate-pulse">
          <div className="h-4 w-32 bg-secondary rounded" />
          <div className="h-7 w-24 bg-secondary rounded" />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`flex flex-col max-w-[70%] rounded-2xl p-4 gap-2 ${
                n % 2 === 0 ? "self-end bg-secondary/40" : "self-start bg-brand-950/5 border border-white/5"
              } animate-pulse`}
            >
              <div className="h-2.5 w-12 bg-secondary rounded" />
              <div className="h-3 w-48 bg-secondary rounded" />
              <div className="h-2 w-24 bg-secondary rounded" />
            </div>
          ))}
        </div>
        <div className="h-10 bg-secondary/30 rounded-lg animate-pulse w-full" />
      </div>
    );
  }

  // Error page state
  if (isErrorMessages || !currentConversation) {
    return (
      <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto my-auto gap-4 select-none h-full px-4">
        <span className="p-3 bg-red-950/20 text-red-500 rounded-full border border-red-500/10">
          <MessageSquare className="h-6 w-6" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-foreground">Thread Missing</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The active thread segment is inaccessible, deleted, or was mapped to another scope directory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between h-full p-4 overflow-hidden relative select-none">
      
      {/* OFFLINE INDICATOR BAR */}
      {!isOnline && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-red-950/80 border-b border-red-500/20 py-1.5 px-4 text-xs text-red-400 font-semibold flex items-center gap-2 justify-center backdrop-blur-sm">
          <WifiOff className="h-3.5 w-3.5 shrink-0" />
          <span>Offline state. Dispatched queries will sync once connection returns.</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center select-none border-b border-border/60 pb-3 mb-2 shrink-0">
        
        {/* Inline editable title */}
        <div className="flex items-center gap-2 max-w-[50%]">
          {isEditingTitle ? (
            <form onSubmit={handleRename} className="flex items-center gap-1.5">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="h-8 px-2 bg-zinc-900 border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
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
              <Bot className="h-4 w-4 text-brand-400 shrink-0" />
              <span className="truncate">{currentConversation.title}</span>
            </span>
          )}
        </div>

        {/* Toolbar details & Options */}
        <div className="flex items-center gap-2">
          {/* Quick toggle headers */}
          <button
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded hover:bg-secondary border border-border text-xs transition-colors ${
              currentConversation.isFavorite ? "text-yellow-500" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Star Favorite"
          >
            <Star className="h-3.5 w-3.5" fill={currentConversation.isFavorite ? "currentColor" : "none"} />
          </button>
          
          <button
            onClick={handleToggleArchive}
            className={`p-1.5 rounded hover:bg-secondary border border-border text-xs transition-colors ${
              currentConversation.isArchived ? "text-brand-500" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Archive"
          >
            <Archive className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleDelete}
            className="p-1.5 rounded hover:bg-secondary border border-border text-xs text-muted-foreground hover:text-destructive transition-colors"
            title="Trash"
          >
            <Trash className="h-3.5 w-3.5" />
          </button>

          <div className="border-l border-border h-6 mx-1 shrink-0" />

          {/* Model controls */}
          <select
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              updateConversation.mutate({ id: conversationId, modelProvider: e.target.value });
            }}
            className="h-8 px-2 bg-zinc-900 border border-border rounded text-[10px] text-muted-foreground focus:outline-none"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
          </select>

          <select
            value={modelName}
            onChange={(e) => {
              setModelName(e.target.value);
              updateConversation.mutate({ id: conversationId, modelName: e.target.value });
            }}
            className="h-8 px-2 bg-zinc-900 border border-border rounded text-[10px] text-muted-foreground focus:outline-none"
          >
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="gemini-1.5-flash">Gemini Flash</option>
          </select>
        </div>
      </div>

      {/* MESSAGES LOG CONTAINER */}
      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto flex flex-col gap-4 mb-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent py-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto my-auto gap-4 select-none">
            <span className="p-3 bg-secondary text-muted-foreground rounded-full border border-border">
              <MessageSquare className="h-6 w-6" />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-foreground">Welcome to this session</h3>
              <p className="text-xs text-muted-foreground leading-relaxed animate-fade-in">
                Write a message below to coordinate parameter options, explore workflows, or test completions.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            const isSending = msg.status === "sending";

            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] rounded-2xl p-4 text-xs transition-all ${
                  isUser
                    ? "bg-secondary text-foreground self-end rounded-tr-none border border-border"
                    : "bg-brand-950/10 text-foreground border border-brand-500/10 self-start rounded-tl-none"
                } ${isSending ? "opacity-60 shimmer-active" : ""}`}
              >
                <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground mb-1 select-none gap-4">
                  <span>{isUser ? "USER" : "AI ENGINE"}</span>
                  {isSending && <span className="text-brand-400 font-mono tracking-tight animate-pulse">THINKING...</span>}
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <span className="text-[8px] text-muted-foreground/60 mt-1 self-end select-none">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER INPUT BOX */}
      <form onSubmit={handleSendPrompt} className="flex gap-2 shrink-0 select-none relative">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder={isOnline ? "Ask anything..." : "Offline. Awaiting link reconnection..."}
            value={prompt}
            onChange={handlePromptChange}
            disabled={!isOnline}
            className="w-full h-11 pl-4 pr-12 text-xs bg-zinc-900 border border-border rounded-xl placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/15 text-foreground disabled:opacity-50"
          />
          <div className="absolute right-3 top-3 select-none pointer-events-none text-muted-foreground/65 flex items-center gap-0.5">
            <span className="text-[10px] font-mono border border-border bg-zinc-800/80 px-1.5 py-0.5 rounded leading-none flex items-center">
              <CornerDownLeft className="h-2.5 w-2.5" />
            </span>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={!prompt.trim() || !isOnline}
          className="shrink-0 h-11 w-11 rounded-xl flex items-center justify-center p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
