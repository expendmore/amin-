"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { useDashboard } from "@/store/use-dashboard";
import { useAiAssistant } from "@/store/use-ai-assistant";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Languages,
  BrainCircuit,
  Bot,
  Plus,
  Send,
  User,
  Settings,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  UserCheck,
  CheckCheck,
  Star,
  Pin,
  Clock,
  Download,
  Paperclip,
  Smile,
  Mic,
  Calendar,
  Zap,
  Tag,
  Bookmark,
  Share2,
  Trash2,
  Lock,
  ChevronLeft,
  X,
  AlertTriangle,
  Info,
  Phone,
  FileText,
  Video,
  CornerDownRight,
  Users,
  Activity,
  History,
  AlertCircle
} from "lucide-react";

// Types
interface Message {
  id: string;
  sender: "customer" | "agent" | "ai";
  type: "text" | "image" | "document" | "template" | "location";
  text: string;
  mediaUrl?: string;
  mediaName?: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read" | "failed";
  isInternal?: boolean;
  quotedMessageId?: string;
}

interface Conversation {
  id: string;
  customerName: string;
  phoneNumber: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  status: "active" | "archived" | "resolved" | "spam";
  aiResponder: boolean;
  assignedAgent: "Me" | "John" | "Sarah" | null;
  slaMinutesRemaining: number;
  isStarred: boolean;
  isPinned: boolean;
  labels: string[];
  tags: string[];
  messages: Message[];
  timeline: Array<{ id: string; type: "assignment" | "status" | "note"; text: string; date: string }>;
}

export default function LiveTeamInboxPage() {
  const { addToast } = useToast();
  const { profile } = useDashboard();

  // Floating QA State Switcher: default | loading | empty | no_results | offline | permission_error
  const [uiStateMode, setUiStateMode] = useState<"default" | "loading" | "empty" | "no_results" | "offline" | "permission_error">("default");

  // Layout selection states
  const [activeConvId, setActiveConvId] = useState<string | null>("conv-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState<"all" | "unassigned" | "me" | "resolved" | "archived">("me");
  const [showMobileList, setShowMobileList] = useState(true);
  const [showRightInspector, setShowRightInspector] = useState(true);
  const [inspectorTab, setInspectorTab] = useState<"crm" | "ai">("crm");
  
  // AI Copilot state bindings
  const [aiTone, setAiTone] = useState<"friendly" | "professional" | "support" | "casual">("friendly");
  const [aiLang, setAiLang] = useState("spanish");
  const [aiSearchInput, setAiSearchInput] = useState("");
  
  // Zustand Store reference
  const aiStore = useAiAssistant();

  // Composer states
  const [composerText, setComposerText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  
  // Right Inspector input states
  const [newLabelInput, setNewLabelInput] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [newNoteInput, setNewNoteInput] = useState("");

  // Simulated Typing indicator
  const [isTyping, setIsTyping] = useState(false);

  // Mock Conversations Dataset
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      customerName: "Rohan Kumar",
      phoneNumber: "+91 99999 88888",
      unreadCount: 2,
      lastMessage: "Yes, please confirm my booking details.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: "active",
      aiResponder: true,
      assignedAgent: "Me",
      slaMinutesRemaining: 8,
      isStarred: true,
      isPinned: true,
      labels: ["VIP Client", "Shopify"],
      tags: ["High Value", "Urgent Support"],
      timeline: [
        { id: "t1", type: "assignment", text: "Conversation assigned to Me automatically", date: "15:40" },
        { id: "t2", type: "status", text: "AI Auto-responder activated", date: "15:42" }
      ],
      messages: [
        { id: "m1", sender: "customer", type: "text", text: "Hello! Is there any slots available for tomorrow?", timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
        { id: "m2", sender: "ai", type: "text", text: "🤖 [AI Auto-Reply] Hi Rohan! Yes, we have slots open at 10 AM, 2 PM, and 4 PM tomorrow. Which one would you prefer?", timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
        { id: "m3", sender: "customer", type: "text", text: "Let's do 2 PM.", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        { id: "m4", sender: "ai", type: "text", text: "🤖 [AI Auto-Reply] Perfect. I can book Rohan for 2 PM. Please confirm if I should lock it.", timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString() },
        { id: "m5", sender: "customer", type: "text", text: "Yes, please confirm my booking details.", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
      ]
    },
    {
      id: "conv-2",
      customerName: "Sarah Jenkins",
      phoneNumber: "+1 415-555-2671",
      unreadCount: 1,
      lastMessage: "I need help with my monthly Stripe payment billing",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: "active",
      aiResponder: false,
      assignedAgent: null,
      slaMinutesRemaining: 18,
      isStarred: false,
      isPinned: false,
      labels: ["Billing"],
      tags: ["Meta Stripe"],
      timeline: [
        { id: "t3", type: "status", text: "Inbound conversation created", date: "14:40" }
      ],
      messages: [
        { id: "m6", sender: "customer", type: "text", text: "I need help with my monthly Stripe payment billing", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
      ]
    },
    {
      id: "conv-3",
      customerName: "Elena Rostova",
      phoneNumber: "+7 901-555-0143",
      unreadCount: 0,
      lastMessage: "Attached invoice copy for refund validation steps.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      status: "active",
      aiResponder: false,
      assignedAgent: "Me",
      slaMinutesRemaining: 45,
      isStarred: true,
      isPinned: false,
      labels: ["Refunds Queue"],
      tags: ["Escalated"],
      timeline: [
        { id: "t4", type: "assignment", text: "Conversation transferred from John to Me", date: "12:30" }
      ],
      messages: [
        { id: "m7", sender: "customer", type: "text", text: "Here is the transaction details.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5).toISOString() },
        { id: "m8", sender: "customer", type: "document", text: "Attached invoice copy for refund validation steps.", mediaName: "meta_invoice_9021.pdf", mediaUrl: "#", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
      ]
    },
    {
      id: "conv-4",
      customerName: "Amit Patel",
      phoneNumber: "+91 90000 11111",
      unreadCount: 0,
      lastMessage: "Thanks, the response was very quick and helpful!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: "resolved",
      aiResponder: true,
      assignedAgent: "John",
      slaMinutesRemaining: 120,
      isStarred: false,
      isPinned: false,
      labels: ["General Info"],
      tags: [],
      timeline: [
        { id: "t5", type: "status", text: "Conversation marked as Resolved by John", date: "Yesterday" }
      ],
      messages: [
        { id: "m9", sender: "customer", type: "text", text: "Do you support custom integrations with Shopify?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() },
        { id: "m10", sender: "ai", type: "text", text: "🤖 [AI Auto-Reply] Yes, Amit! We have a native Shopify integration that syncs order events and triggers automations automatically.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.8).toISOString() },
        { id: "m11", sender: "customer", type: "text", text: "Thanks, the response was very quick and helpful!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
      ]
    }
  ]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  // Filters logic
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phoneNumber.includes(searchQuery) ||
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeFilterTab === "all" ||
                       (activeFilterTab === "me" && c.assignedAgent === "Me" && c.status === "active") ||
                       (activeFilterTab === "unassigned" && c.assignedAgent === null && c.status === "active") ||
                       (activeFilterTab === "resolved" && c.status === "resolved") ||
                       (activeFilterTab === "archived" && c.status === "archived");

    return matchesSearch && matchesTab;
  });

  // Composer Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() || !activeConvId) return;

    const newMessage: Message = {
      id: `m_${Math.random().toString(36).substring(2, 9)}`,
      sender: isInternalNote ? "agent" : "agent",
      type: "text",
      text: composerText.trim(),
      timestamp: new Date().toISOString(),
      isInternal: isInternalNote,
      status: "sent"
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        // Clear unread count for Me
        return {
          ...c,
          unreadCount: 0,
          lastMessage: isInternalNote ? c.lastMessage : composerText.trim(),
          lastMessageTime: newMessage.timestamp,
          messages: [...c.messages, newMessage],
          timeline: isInternalNote 
            ? [...c.timeline, { id: `t_${Math.random().toString(36).substring(2, 9)}`, type: "note", text: `Private Note: ${composerText.trim()}`, date: "Just Now" }]
            : c.timeline
        };
      }
      return c;
    }));

    setComposerText("");
    addToast(isInternalNote ? "Internal Note posted." : "WhatsApp message sent.", "success");

    // Mock Customer response timer if not internal note
    if (!isInternalNote) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: `m_${Math.random().toString(36).substring(2, 9)}`,
          sender: "customer",
          type: "text",
          text: `Hi! This is a mock auto-reply response. Received your prompt: "${newMessage.text}".`,
          timestamp: new Date().toISOString()
        };

        setConversations(prev => prev.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              unreadCount: c.unreadCount + 1,
              lastMessage: reply.text,
              lastMessageTime: reply.timestamp,
              messages: [...c.messages, reply]
            };
          }
          return c;
        }));
      }, 3000);
    }
  };

  // Quick Action triggers
  const handleAssignAgent = (agent: "Me" | "John" | "Sarah" | null) => {
    if (!activeConvId) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          assignedAgent: agent,
          timeline: [...c.timeline, {
            id: `t_${Math.random().toString(36).substring(2, 9)}`,
            type: "assignment",
            text: agent ? `Assigned to ${agent}` : "Unassigned",
            date: "Just Now"
          }]
        };
      }
      return c;
    }));
    addToast(agent ? `Conversation assigned to ${agent}.` : "Conversation set to Unassigned.", "info");
  };

  const handleToggleResolve = () => {
    if (!activeConvId || !activeConv) return;
    const nextStatus = activeConv.status === "resolved" ? "active" : "resolved";
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          status: nextStatus,
          timeline: [...c.timeline, {
            id: `t_${Math.random().toString(36).substring(2, 9)}`,
            type: "status",
            text: nextStatus === "resolved" ? "Conversation marked as Resolved" : "Conversation reopened",
            date: "Just Now"
          }]
        };
      }
      return c;
    }));
    addToast(nextStatus === "resolved" ? "Conversation resolved." : "Conversation reopened.", "success");
  };

  const handleToggleStar = () => {
    if (!activeConvId || !activeConv) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return { ...c, isStarred: !c.isStarred };
      }
      return c;
    }));
    addToast(activeConv.isStarred ? "Removed from Starred." : "Marked as Starred.", "info");
  };

  const handleTogglePin = () => {
    if (!activeConvId || !activeConv) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return { ...c, isPinned: !c.isPinned };
      }
      return c;
    }));
    addToast(activeConv.isPinned ? "Unpinned conversation." : "Pinned conversation.", "info");
  };

  // CRM details edit updates
  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelInput.trim() || !activeConvId) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return { ...c, labels: [...c.labels, newLabelInput.trim()] };
      }
      return c;
    }));
    setNewLabelInput("");
    addToast("Label added.", "success");
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim() || !activeConvId) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return { ...c, tags: [...c.tags, newTagInput.trim()] };
      }
      return c;
    }));
    setNewTagInput("");
    addToast("Tag added.", "success");
  };


  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim() || !activeConvId) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          timeline: [...c.timeline, {
            id: `t_${Math.random().toString(36).substring(2, 9)}`,
            type: "note",
            text: newNoteInput.trim(),
            date: "Just Now"
          }]
        };
      }
      return c;
    }));
    setNewNoteInput("");
    addToast("Note recorded.", "success");
  };

  // AI Suggestions generator simulation
  const handleAiSuggestion = () => {
    if (!activeConv) return;
    setShowRightInspector(true);
    setInspectorTab("ai");
    
    // Find the last customer message text, or default to a greeting
    const customerMessages = activeConv.messages.filter(m => m.sender === "customer");
    const lastCustomerMsgText = customerMessages.length > 0
      ? customerMessages[customerMessages.length - 1].text
      : "Hello, welcome to ExpendMore! How can we help?";
      
    // Call generateReply and analyzeSentiment from store
    aiStore.generateReply(lastCustomerMsgText, aiTone, activeConv.customerName);
    aiStore.analyzeSentiment(lastCustomerMsgText);
    
    addToast("Context loaded. Generating dynamic AI reply suggestion...", "info");
  };

  const handleSendAiSuggestion = () => {
    if (!aiStore.currentSuggestion || !activeConvId) return;
    const text = aiStore.currentSuggestion;
    
    const newMessage: Message = {
      id: `m_${Math.random().toString(36).substring(2, 9)}`,
      sender: "agent",
      type: "text",
      text: text,
      timestamp: new Date().toISOString(),
      status: "sent"
    };
    
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          unreadCount: 0,
          lastMessage: text,
          lastMessageTime: newMessage.timestamp,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    }));
    
    aiStore.logSuggestionFeedback(`sug-${Date.now()}`, "accept");
    aiStore.clearCurrent();
    addToast("AI Suggestion Sent!", "success");
    
    // Mock customer auto-reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: `m_${Math.random().toString(36).substring(2, 9)}`,
        sender: "customer",
        type: "text",
        text: `Thanks for the quick response! Let me check this.`,
        timestamp: new Date().toISOString()
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            unreadCount: c.unreadCount + 1,
            lastMessage: reply.text,
            lastMessageTime: reply.timestamp,
            messages: [...c.messages, reply]
          };
        }
        return c;
      }));
    }, 2000);
  };

  const handleInsertAiSuggestion = () => {
    if (!aiStore.currentSuggestion) return;
    setComposerText(aiStore.currentSuggestion);
    aiStore.logSuggestionFeedback(`sug-${Date.now()}`, "accept");
    addToast("AI suggestion inserted into composer.", "success");
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4 max-w-full font-sans select-none pb-12 relative px-6 h-[calc(100vh-140px)] overflow-hidden">
        
        {/* Offline Warning Panel Banner */}
        {uiStateMode === "offline" && (
          <div className="bg-red-950/20 border border-red-500/20 text-red-500 p-4 rounded-xl flex gap-3 text-xs leading-relaxed select-none items-center text-left shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <div className="flex-grow">
              <span className="font-bold">Omnichannel Sync Error: Connection Lost.</span> Tailing messages queue locally. Reconnecting in 3s...
            </div>
          </div>
        )}

        {/* Studio Panel Layout */}
        <div className="grid grid-cols-12 gap-0 border border-brand-border dark:border-border/60 bg-card rounded-2xl overflow-hidden h-full relative">
          
          {/* SKELETON LOADER STATE */}
          {uiStateMode === "loading" ? (
            <div className="col-span-12 grid grid-cols-12 h-full select-none animate-pulse">
              <div className="col-span-3 border-r border-border h-full bg-zinc-900/10 dark:bg-zinc-800/10" />
              <div className="col-span-6 border-r border-border h-full bg-zinc-900/5 dark:bg-zinc-800/5" />
              <div className="col-span-3 h-full bg-zinc-900/10 dark:bg-zinc-800/10" />
            </div>
          ) : uiStateMode === "permission_error" ? (
            /* ROLE GATED ACCESS DENIED STATE */
            <div className="col-span-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto gap-4 select-none h-full px-4">
              <span className="p-3 bg-red-950/20 text-red-500 rounded-full border border-red-500/10">
                <Lock className="h-8 w-8" />
              </span>
              <div className="flex flex-col gap-1 text-left">
                <h3 className="font-bold text-foreground">Access Gated</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your team member profile permissions are restricted from viewing the shared Live Inbox console. Contact your system administrator to request role clearance updates.
                </p>
              </div>
            </div>
          ) : (
            /* DEFAULT THREE PANEL WORKSPACE */
            <>
              {/* PANEL 1: CONVERSATION LIST (LEFT PANEL) */}
              <aside className={`col-span-12 md:col-span-3 border-r border-border flex flex-col h-full bg-zinc-950/15 overflow-hidden z-25 transition-all ${showMobileList ? "block" : "hidden md:flex"}`}>
                <div className="p-4 flex flex-col gap-3.5 border-b border-border/40 shrink-0 text-left">
                  <span className="text-xs font-bold text-foreground">Omnichannel Live Inbox</span>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search name, phone, messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-[10px] focus:outline-none focus:border-brand-sky text-foreground"
                    />
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto select-none pb-1 font-mono">
                    {[
                      { id: "me", label: "My Chats" },
                      { id: "unassigned", label: "Unassigned" },
                      { id: "all", label: "All active" },
                      { id: "resolved", label: "Resolved" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveFilterTab(tab.id as any)}
                        className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition-all shrink-0 cursor-pointer ${
                          activeFilterTab === tab.id
                            ? "bg-secondary text-foreground border border-border"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversation Scroll items */}
                <div className="flex-grow overflow-y-auto pr-1 flex flex-col scrollbar-thin select-none">
                  {uiStateMode === "empty" || filteredConversations.length === 0 ? (
                    <div className="p-10 text-center text-[10px] text-zinc-500 italic select-none">No active conversations matching filters.</div>
                  ) : (
                    filteredConversations.map(conv => {
                      const isActive = conv.id === activeConvId;
                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            setActiveConvId(conv.id);
                            setShowMobileList(false);
                          }}
                          className={`p-3.5 border-b border-border/40 flex items-start justify-between gap-3 cursor-pointer select-none transition-colors duration-150 relative text-left ${
                            isActive 
                              ? "bg-secondary text-foreground"
                              : "hover:bg-zinc-900/10"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Avatar or Icon */}
                            <div className="w-8 h-8 rounded-full bg-zinc-800 text-[10px] font-bold font-mono text-brand-sky flex items-center justify-center shrink-0 uppercase select-none relative">
                              {conv.customerName.charAt(0)}
                              {conv.unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-green border border-white rounded-full flex items-center justify-center text-[7px] font-bold text-white leading-none">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col gap-0.5 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-foreground text-[10px] truncate max-w-[120px]">{conv.customerName}</span>
                                {conv.isPinned && <Pin className="h-3 w-3 text-brand-sky shrink-0 rotate-45" />}
                                {conv.isStarred && <Star className="h-3 w-3 text-yellow-500 shrink-0 fill-current" />}
                              </div>
                              <span className="text-[9px] text-muted-foreground truncate leading-snug">{conv.lastMessage}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0 ml-1">
                            <span className="text-[8px] font-mono text-zinc-500">{new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            
                            {/* SLA Tag indicator */}
                            {conv.status === "active" && (
                              <span className={`text-[8px] font-bold font-mono px-1 rounded flex items-center gap-0.5 select-none ${
                                conv.slaMinutesRemaining <= 10
                                  ? "bg-red-950/20 text-red-400 border border-red-500/10"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}>
                                <Clock className="h-2.5 w-2.5" />
                                <span>{conv.slaMinutesRemaining}m</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </aside>

              {/* PANEL 2: CONVERSATION WINDOW & COMPOSER (CENTER PANEL) */}
              <section className={`col-span-12 md:col-span-6 border-r border-border flex flex-col justify-between h-full overflow-hidden ${!showMobileList ? "block" : "hidden md:flex"}`}>
                {activeConv ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border/40 bg-zinc-950/5 flex justify-between items-center select-none shrink-0">
                      <div className="flex items-center gap-2.5 text-left">
                        <button onClick={() => setShowMobileList(true)} className="p-1 hover:bg-zinc-800 rounded md:hidden">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground">{activeConv.customerName}</span>
                          <span className="text-[9px] text-muted-foreground font-semibold mt-0.5">{activeConv.phoneNumber}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 select-none">
                        <button
                          onClick={handleToggleStar}
                          className={`p-1.5 hover:bg-zinc-800 rounded transition-colors cursor-pointer ${activeConv.isStarred ? "text-yellow-500" : "text-muted-foreground"}`}
                          title="Star favorite"
                        >
                          <Star className="h-4 w-4" fill={activeConv.isStarred ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={handleTogglePin}
                          className={`p-1.5 hover:bg-zinc-800 rounded transition-colors cursor-pointer ${activeConv.isPinned ? "text-brand-sky" : "text-muted-foreground"}`}
                          title="Pin conversation"
                        >
                          <Pin className="h-4 w-4 rotate-45" fill={activeConv.isPinned ? "currentColor" : "none"} />
                        </button>
                        <div className="border-l border-border h-4 mx-1" />
                        
                        {/* Resolve reopen */}
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={handleToggleResolve}
                          className="h-7 text-[9px] font-bold uppercase tracking-wider px-2"
                        >
                          {activeConv.status === "resolved" ? "Reopen" : "Resolve"}
                        </Button>

                        <button
                          onClick={() => setShowRightInspector(!showRightInspector)}
                          className={`p-1.5 hover:bg-zinc-800 rounded text-muted-foreground hover:text-foreground hidden md:block cursor-pointer`}
                          title="Info toggle"
                        >
                          <Info className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Messages feed viewport */}
                    <div className="flex-grow overflow-y-auto p-4 bg-zinc-900/10 dark:bg-zinc-950/20 pr-1 flex flex-col gap-3.5 scrollbar-thin select-text">
                      {activeConv.messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[80%] ${
                            msg.sender === "customer" 
                              ? "self-start items-start text-left" 
                              : "self-end items-end text-right"
                          }`}
                        >
                          {/* Messages bubble */}
                          <div className={`p-3 rounded-2xl text-xs leading-relaxed select-text shadow-sm ${
                            msg.isInternal
                              ? "bg-amber-950/30 border border-amber-500/20 text-amber-500 rounded-tr-none select-text"
                              : msg.sender === "customer"
                              ? "bg-card border border-border text-foreground rounded-tl-none select-text"
                              : msg.sender === "ai"
                              ? "bg-brand-sky text-white rounded-tr-none select-text"
                              : "bg-[#25D366] text-white rounded-tr-none select-text"
                          }`}>
                            {msg.isInternal && (
                              <div className="text-[8px] font-bold text-amber-500 uppercase mb-1 select-none flex items-center gap-1">
                                <Lock className="h-2.5 w-2.5" />
                                Internal Team Note
                              </div>
                            )}

                            {/* Render Text message */}
                            {msg.type === "text" && <p className="select-text whitespace-pre-wrap">{msg.text}</p>}

                            {/* Render Document attachment */}
                            {msg.type === "document" && (
                              <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-brand-sky shrink-0" />
                                <div className="flex flex-col text-left">
                                  <span className="font-bold text-[10px] text-foreground truncate max-w-[120px]">{msg.mediaName}</span>
                                  <span className="text-[8px] text-muted-foreground mt-0.5">PDF Document (1.2 MB)</span>
                                </div>
                                <button className="p-1.5 hover:bg-secondary rounded shrink-0 cursor-pointer" title="Download Document">
                                  <Download className="h-4 w-4 text-brand-sky" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Receipts and Timestamp logs */}
                          <div className="flex items-center gap-1.5 text-[8px] font-mono text-zinc-500 mt-1 select-none">
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            {msg.sender !== "customer" && !msg.isInternal && (
                              <span className="flex items-center text-brand-green">
                                <CheckCheck className="h-3 w-3 shrink-0 text-current" />
                                <span className="ml-0.5 text-[7px] uppercase tracking-wider font-extrabold select-none">
                                  {msg.sender === "ai" ? "AI Auto" : "Sent"}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Mock Typing Indicator */}
                      {isTyping && (
                        <div className="p-3 bg-card border border-border self-start rounded-2xl rounded-tl-none max-w-[80%] flex flex-col gap-1 items-start select-none">
                          <span className="text-[8px] font-bold text-muted-foreground uppercase select-none">typing...</span>
                          <div className="flex items-center gap-1">
                            <div className="h-1 w-1 bg-brand-sky rounded-full animate-bounce" />
                            <div className="h-1 w-1 bg-brand-sky rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="h-1 w-1 bg-brand-sky rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Composer */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-border/40 bg-white flex flex-col gap-3 shrink-0 text-left select-none z-20">
                      
                      {/* Toolbar actions */}
                      <div className="flex justify-between items-center select-none">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setIsInternalNote(!isInternalNote)} className={`px-2.5 py-1 border rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer ${isInternalNote ? "bg-amber-950/20 border-amber-500/20 text-amber-500" : "border-border text-muted-foreground hover:text-foreground"}`}>
                            {isInternalNote ? "Notes mode: Active" : "Outbound message"}
                          </button>
                          
                          <button type="button" onClick={handleAiSuggestion} className="px-2 py-1 border border-brand-sky/20 bg-brand-sky-light/10 text-brand-sky rounded-lg text-[9px] font-bold uppercase flex items-center gap-1 cursor-pointer">
                            <Sparkles className="h-3 w-3" />
                            <span>AI draft</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 select-none text-muted-foreground">
                          <button type="button" className="p-1 hover:bg-zinc-800 rounded cursor-pointer" title="Attach Files">
                            <Paperclip className="h-4 w-4" />
                          </button>
                          <button type="button" className="p-1 hover:bg-zinc-800 rounded cursor-pointer" title="Add Emoji">
                            <Smile className="h-4 w-4" />
                          </button>
                          <button type="button" className="p-1 hover:bg-zinc-800 rounded cursor-pointer" title="Send WhatsApp Template">
                            <Zap className="h-4 w-4 text-brand-sky" />
                          </button>
                        </div>
                      </div>

                      {/* Input composer text */}
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder={isInternalNote ? "Write private team internal notes..." : `Reply to "${activeConv.customerName}"...`}
                          value={composerText}
                          onChange={(e) => setComposerText(e.target.value)}
                          className="flex-grow h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-xl text-xs focus:outline-none"
                        />
                        <Button type="submit" disabled={!composerText.trim()} className="h-10 w-10 p-0 rounded-xl shrink-0">
                          <Send className="h-4.5 w-4.5" />
                        </Button>
                      </div>

                    </form>
                  </>
                ) : (
                  <div className="flex-grow flex items-center justify-center text-center p-6 italic text-xs text-muted-foreground select-none">
                    Select a conversation from the left panel to begin auditing.
                  </div>
                )}
              </section>

              {/* PANEL 3: CUSTOMER INFORMATION & AI COPILOT (RIGHT PANEL) */}
              {activeConv && showRightInspector && (
                <aside className="col-span-12 md:col-span-3 border-l border-border h-full flex flex-col bg-zinc-950/15 overflow-hidden z-25 text-left select-text">
                  
                  {/* Switcher tabs */}
                  <div className="flex border-b border-border/40 select-none bg-zinc-950/20 shrink-0">
                    <button
                      onClick={() => setInspectorTab("crm")}
                      className={`flex-1 py-3 text-[10px] font-extrabold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                        inspectorTab === "crm"
                          ? "border-brand-navy dark:border-zinc-300 text-brand-navy dark:text-foreground bg-white/5"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      CRM Profile
                    </button>
                    <button
                      onClick={() => setInspectorTab("ai")}
                      className={`flex-1 py-3 text-[10px] font-extrabold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                        inspectorTab === "ai"
                          ? "border-brand-green text-brand-green bg-brand-green/5"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      ✨ AI Copilot
                    </button>
                  </div>

                  <div className="p-4 flex flex-col gap-5 flex-1 overflow-y-auto scrollbar-thin select-text">
                    
                    {/* VIEW A: CRM PROFILE TAB */}
                    {inspectorTab === "crm" && (
                      <div className="flex flex-col gap-5">
                        {/* User credentials */}
                        <div className="flex flex-col items-center justify-center text-center border-b border-border/40 pb-4 select-none">
                          <div className="w-14 h-14 rounded-full bg-zinc-800 text-lg font-bold font-mono text-brand-sky flex items-center justify-center shrink-0 uppercase select-none mb-2 border border-border shadow-sm">
                            {activeConv.customerName.charAt(0)}
                          </div>
                          <span className="font-extrabold text-foreground text-xs">{activeConv.customerName}</span>
                          <span className="text-[10px] text-muted-foreground font-semibold font-mono mt-0.5 select-text">{activeConv.phoneNumber}</span>
                          
                          {/* Quick Agent Assigned Selector */}
                          <div className="mt-3 flex items-center gap-1.5 w-full select-none justify-center">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Assignee:</span>
                            <select
                              value={activeConv.assignedAgent || ""}
                              onChange={(e) => handleAssignAgent((e.target.value as any) || null)}
                              className="h-7 px-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded text-[9px] font-bold text-foreground cursor-pointer focus:outline-none"
                            >
                              <option value="">Unassigned</option>
                              <option value="Me">Me (Admin)</option>
                              <option value="John">John (Support)</option>
                              <option value="Sarah">Sarah (Creative)</option>
                            </select>
                          </div>
                        </div>

                        {/* CRM Details placeholders */}
                        <div className="flex flex-col gap-4 text-left">
                          
                          {/* Labels and tags */}
                          <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Labels & Tags</span>
                            <div className="flex flex-wrap gap-1 mt-0.5 select-none">
                              {activeConv.labels.map((lbl, idx) => (
                                <span key={idx} className="bg-brand-sky-light/10 text-brand-sky border border-brand-sky/20 px-2 py-0.5 rounded text-[8px] font-bold uppercase">{lbl}</span>
                              ))}
                              {activeConv.tags.map((tag, idx) => (
                                <span key={idx} className="bg-secondary border border-border px-2 py-0.5 rounded text-[8px] font-bold uppercase text-foreground">{tag}</span>
                              ))}
                            </div>

                            {/* Quick Label Input */}
                            <form onSubmit={handleAddLabel} className="flex gap-1.5 select-none mt-1">
                              <input
                                type="text"
                                placeholder="Add Label..."
                                value={newLabelInput}
                                onChange={(e) => setNewLabelInput(e.target.value)}
                                className="flex-grow h-7 px-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded text-[9px] focus:outline-none text-foreground"
                              />
                              <Button type="submit" size="xs" className="h-7 w-7 p-0 shrink-0">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </form>

                            {/* Quick Tag Input */}
                            <form onSubmit={handleAddTag} className="flex gap-1.5 select-none mt-1">
                              <input
                                type="text"
                                placeholder="Add Tag..."
                                value={newTagInput}
                                onChange={(e) => setNewTagInput(e.target.value)}
                                className="flex-grow h-7 px-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded text-[9px] focus:outline-none text-foreground"
                              />
                              <Button type="submit" size="xs" className="h-7 w-7 p-0 shrink-0">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </form>

                          </div>

                          <hr className="border-border/40 select-none" />

                          {/* Timeline logs */}
                          <div className="flex flex-col gap-2.5 text-left">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Audit Timeline</span>
                            <div className="flex flex-col gap-2.5 pr-1 select-text">
                              {activeConv.timeline.map(time => (
                                <div key={time.id} className="flex gap-2 select-text text-xs leading-normal select-text items-start">
                                  <Clock className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
                                  <div className="flex-grow flex flex-col gap-0.5 select-text">
                                    <span className="text-[9px] text-zinc-300 select-text leading-snug">{time.text}</span>
                                    <span className="text-[8px] text-zinc-500 font-mono select-none">{time.date}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Quick note input log */}
                            <form onSubmit={handlePostNote} className="flex gap-1.5 select-none mt-1">
                              <input
                                type="text"
                                placeholder="Write audit log..."
                                value={newNoteInput}
                                onChange={(e) => setNewNoteInput(e.target.value)}
                                className="flex-grow h-7 px-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded text-[9px] focus:outline-none text-foreground"
                              />
                              <Button type="submit" size="xs" className="h-7 w-7 p-0 shrink-0">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </form>
                          </div>

                          <hr className="border-border/40 select-none" />

                          {/* CRM placeholder tags */}
                          <div className="flex flex-col gap-1.5 text-left select-none text-xs">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">CRM Hub Sync (Shopify)</span>
                            <div className="p-3 border border-border rounded-xl bg-zinc-900/10 flex flex-col gap-1.5">
                              <div className="flex justify-between items-center text-[9px]">
                                <span className="text-muted-foreground font-semibold">Total Orders count</span>
                                <span className="font-mono text-foreground font-bold">12 Orders</span>
                              </div>
                              <div className="flex justify-between items-center text-[9px]">
                                <span className="text-muted-foreground font-semibold">Total Revenue LTV</span>
                                <span className="font-mono text-brand-green font-bold">$1,240.00</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* VIEW B: AI COPILOT ASSISTANT SIDEBAR */}
                    {inspectorTab === "ai" && (
                      <div className="flex flex-col gap-4">
                        
                        {/* Conversation Summary Box */}
                        <div className="flex flex-col gap-1 text-left bg-zinc-900/30 p-3 rounded-xl border border-brand-border dark:border-border/20">
                          <span className="text-[9px] font-bold text-brand-green uppercase tracking-wider">AI Conversation Summary</span>
                          <p className="text-[10px] text-zinc-300 leading-relaxed mt-1">
                            Client is asking for information regarding Shopify integration or subscription pricing. Sentiment seems neutral but response urgency is flagged as medium.
                          </p>
                          <ul className="text-[9px] text-muted-foreground list-disc pl-3 mt-1 space-y-0.5">
                            <li>Key issue: Shopify webhook sync verification.</li>
                            <li>Follow up: Share docs/api-keys tutorial.</li>
                          </ul>
                        </div>

                        {/* Sentiment Indicators */}
                        {aiStore.currentSentiment && (
                          <div className="grid grid-cols-2 gap-2 bg-brand-slate/30 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-brand-border/40 dark:border-border/10 text-left">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-zinc-500 uppercase">Sentiment</span>
                              <span className="text-[10px] font-bold text-foreground capitalize mt-0.5">
                                {aiStore.currentSentiment.sentiment}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-zinc-500 uppercase">Confidence</span>
                              <span className="text-[10px] font-mono font-bold text-foreground mt-0.5">
                                {aiStore.currentSentiment.score}%
                              </span>
                            </div>
                            <div className="flex flex-col col-span-2 border-t border-brand-border/40 dark:border-border/20 pt-1.5 mt-1 flex-row justify-between text-[8px] text-muted-foreground font-mono">
                              <span>Lang: {aiStore.currentSentiment.detectedLanguage}</span>
                              <span className="text-brand-green">Urgency: {aiStore.currentSentiment.urgency.toUpperCase()}</span>
                            </div>
                          </div>
                        )}

                        {/* Suggested reply viewport */}
                        <div className="flex flex-col gap-2 border-t border-brand-border/40 dark:border-border/20 pt-3">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">AI Smart Reply Suggestion</span>
                          
                          <div className="p-3 bg-brand-slate/40 dark:bg-zinc-900/50 rounded-xl border border-brand-border/50 dark:border-border/30 min-h-[70px] relative">
                            {aiStore.status === "thinking" || aiStore.status === "generating" ? (
                              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground select-none py-4">
                                <svg className="animate-spin h-3.5 w-3.5 text-brand-green" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Copilot is drafting...
                              </div>
                            ) : (
                              <p className="text-[10px] text-brand-navy dark:text-zinc-200 leading-relaxed font-medium">
                                {aiStore.currentSuggestion || "Click 'AI draft' or adjust tone parameters below to generate suggest reply."}
                              </p>
                            )}
                          </div>

                          {/* Quick Tone Selection triggers */}
                          <div className="flex items-center justify-between gap-1 select-none">
                            <span className="text-[8px] font-extrabold text-zinc-500 uppercase">Regen Tone:</span>
                            <div className="flex gap-0.5 bg-zinc-900 p-0.5 rounded border border-border/50">
                              {(["friendly", "professional", "support", "casual"] as const).map(tone => (
                                <button
                                  key={tone}
                                  onClick={() => {
                                    setAiTone(tone);
                                    const customerMessages = activeConv.messages.filter(m => m.sender === "customer");
                                    const text = customerMessages.length > 0 ? customerMessages[customerMessages.length - 1].text : "Hello";
                                    aiStore.generateReply(text, tone, activeConv.customerName);
                                    addToast(`Regenerating draft in ${tone} tone...`, "info");
                                  }}
                                  className={`px-1.5 py-0.5 rounded text-[8px] capitalize transition-all cursor-pointer font-bold ${
                                    aiTone === tone ? "bg-zinc-800 text-white" : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {tone}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Insert / Send Action Buttons */}
                          {aiStore.currentSuggestion && (
                            <div className="grid grid-cols-2 gap-2 mt-1 select-none">
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={handleInsertAiSuggestion}
                                className="h-7 text-[9px] font-bold uppercase tracking-wider"
                              >
                                Insert In Draft
                              </Button>
                              <Button
                                variant="success"
                                size="xs"
                                onClick={handleSendAiSuggestion}
                                className="h-7 text-[9px] font-bold uppercase tracking-wider"
                              >
                                One-Click Send
                              </Button>
                            </div>
                          )}

                        </div>

                        {/* Rewrite chips */}
                        {aiStore.currentSuggestion && (
                          <div className="flex flex-col gap-2 border-t border-brand-border/40 dark:border-border/20 pt-3 text-left select-none">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Quick Refiners</span>
                            <div className="flex flex-wrap gap-1">
                              {(["improve", "simplify", "shorten", "expand", "correct", "empathy"] as const).map(act => (
                                <button
                                  key={act}
                                  onClick={() => {
                                    aiStore.rewriteText(aiStore.currentSuggestion, act);
                                    addToast(`Refining Suggestion: ${act}`, "info");
                                  }}
                                  className="px-2 py-0.5 border border-brand-border dark:border-border/30 hover:bg-brand-slate dark:hover:bg-zinc-800 text-[8px] font-bold rounded-lg text-brand-navy dark:text-zinc-300 capitalize cursor-pointer"
                                >
                                  {act}
                                </button>
                              ))}
                            </div>

                            {/* Translation block */}
                            <div className="flex items-center justify-between border-t border-brand-border/40 dark:border-border/20 pt-3 gap-2 flex-wrap">
                              <select
                                value={aiLang}
                                onChange={(e) => setAiLang(e.target.value)}
                                className="text-[9px] font-bold border border-brand-border dark:border-border/40 rounded-lg p-1 bg-white dark:bg-zinc-900 text-brand-navy dark:text-zinc-300 outline-none cursor-pointer"
                              >
                                <option value="spanish">Spanish</option>
                                <option value="french">French</option>
                                <option value="german">German</option>
                              </select>
                              <button
                                onClick={() => {
                                  aiStore.translateText(aiStore.currentSuggestion, aiLang);
                                  addToast("Translating draft suggestion...", "info");
                                }}
                                className="text-[8px] font-bold border border-brand-green/30 bg-brand-green/5 text-brand-green px-2 py-1 rounded hover:bg-brand-green hover:text-white transition-all cursor-pointer"
                              >
                                Translate Suggestion
                              </button>
                            </div>

                            {/* Translation result display */}
                            {aiStore.translatedText && (
                              <div className="mt-1 bg-brand-sky-light/10 border border-brand-sky/20 rounded-lg p-2 flex flex-col gap-1 text-[9px]">
                                <span className="text-[8px] font-bold text-brand-sky uppercase">Translation Output</span>
                                <p className="text-zinc-300 font-medium">{aiStore.translatedText}</p>
                                <button
                                  onClick={() => {
                                    setComposerText(aiStore.translatedText);
                                    addToast("Translation inserted into composer.", "success");
                                  }}
                                  className="text-[8px] font-bold text-brand-green hover:underline text-left mt-1 cursor-pointer"
                                >
                                  Insert Translation
                                </button>
                              </div>
                            )}

                          </div>
                        )}

                        {/* Suggested Actions Checklist */}
                        <div className="flex flex-col gap-2 border-t border-brand-border/40 dark:border-border/20 pt-3">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Suggested Actions Checklist</span>
                          
                          <div className="flex flex-col gap-1.5 select-none">
                            <button
                              onClick={() => {
                                handleAssignAgent("Me");
                                addToast("Assigned conversation to Me", "success");
                              }}
                              className="text-[9px] font-semibold text-brand-navy dark:text-zinc-300 bg-brand-slate dark:bg-zinc-900 hover:bg-brand-slate-hover p-2 rounded-lg text-left border border-brand-border dark:border-border/30 flex justify-between items-center cursor-pointer"
                            >
                              <span>Assign query to Me</span>
                              <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            </button>

                            <button
                              onClick={() => {
                                setConversations(prev => prev.map(c => {
                                  if (c.id === activeConvId) {
                                    return { ...c, tags: [...c.tags, "Urgent Support"] };
                                  }
                                  return c;
                                }));
                                addToast("Escalated query and added Urgent tag", "success");
                              }}
                              className="text-[9px] font-semibold text-brand-navy dark:text-zinc-300 bg-brand-slate dark:bg-zinc-900 hover:bg-brand-slate-hover p-2 rounded-lg text-left border border-brand-border dark:border-border/30 flex justify-between items-center cursor-pointer"
                            >
                              <span>Escalate priority to Urgent</span>
                              <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            </button>

                            <button
                              onClick={() => {
                                handleToggleResolve();
                              }}
                              className="text-[9px] font-semibold text-brand-navy dark:text-zinc-300 bg-brand-slate dark:bg-zinc-900 hover:bg-brand-slate-hover p-2 rounded-lg text-left border border-brand-border dark:border-border/30 flex justify-between items-center cursor-pointer"
                            >
                              <span>Mark chat status Resolved</span>
                              <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </div>
                        </div>

                        {/* Semantic Knowledge Wiki lookup inside Side Panel */}
                        <div className="flex flex-col gap-2 border-t border-brand-border/40 dark:border-border/20 pt-3 text-left">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">FAQ KB Context Lookup</span>
                          <input
                            type="search"
                            placeholder="Type keywords (e.g. refund, setup)..."
                            value={aiSearchInput}
                            onChange={(e) => {
                              setAiSearchInput(e.target.value);
                              aiStore.searchKnowledgeBase(e.target.value);
                            }}
                            className="w-full h-8 px-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-[9px] focus:outline-none text-foreground"
                          />
                          {aiSearchInput && (
                            <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto mt-1 select-text">
                              {aiStore.searchResults.slice(0, 3).map(doc => (
                                <div key={doc.id} className="border border-brand-border/40 dark:border-border/20 rounded-lg p-2 bg-zinc-900/30 text-[9px]">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-zinc-200">{doc.title}</span>
                                    <button
                                      onClick={() => {
                                        setComposerText(prev => prev + `\n[FAQ Context: ${doc.content}]`);
                                        const customerMessages = activeConv.messages.filter(m => m.sender === "customer");
                                        const text = customerMessages.length > 0 ? customerMessages[customerMessages.length - 1].text : "Hello";
                                        aiStore.generateReply(text + ` [Knowledge details: ${doc.content}]`, aiTone, activeConv.customerName);
                                        addToast("KB context loaded into suggestion draft", "info");
                                      }}
                                      className="text-[8px] font-bold text-brand-sky hover:underline cursor-pointer"
                                    >
                                      Load
                                    </button>
                                  </div>
                                  <p className="text-muted-foreground mt-0.5 line-clamp-2">{doc.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                </aside>
              )}
            </>
          )}

        </div>

        {/* FLOATING QA PREVIEW CONSOLE SWITCHER */}
        <div className="fixed bottom-4 right-4 z-45 bg-zinc-950/90 border border-zinc-800 rounded-xl p-3 shadow-2xl max-w-[240px] flex flex-col gap-2 select-none text-left backdrop-blur-sm">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Settings className="h-3 w-3 animate-spin" />
            UI Inbox Switcher (QA Demo)
          </span>
          <div className="grid grid-cols-2 gap-1 text-[8px] font-bold uppercase select-none">
            {[
              { id: "default", label: "Connected state" },
              { id: "loading", label: "Loading skeleton" },
              { id: "empty", label: "Empty Inbox" },
              { id: "no_results", label: "No search results" },
              { id: "offline", label: "Offline Outage" },
              { id: "permission_error", label: "Role Gated" }
            ].map(state => (
              <button
                key={state.id}
                onClick={() => {
                  setUiStateMode(state.id as any);
                  addToast(`Previewing Inbox State: ${state.label}`, "info");
                }}
                className={`px-1.5 py-1 rounded text-center transition-all cursor-pointer truncate ${
                  uiStateMode === state.id
                    ? "bg-brand-sky text-white"
                    : "bg-zinc-850 hover:bg-zinc-800 text-zinc-300"
                }`}
                title={state.label}
              >
                {state.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
