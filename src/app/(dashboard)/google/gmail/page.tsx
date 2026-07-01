"use client";

import React, { useMemo, useState } from "react";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/store/use-toast";
import {
  Mail,
  Send,
  Plus,
  Search,
  Star,
  Trash2,
  FileText,
  Bookmark,
  Reply,
  Check,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function GmailPage() {
  const { addToast } = useToast();
  const {
    activeAccountId,
    accounts,
    gmailMessages,
    gmailDrafts,
    gmailTemplates,
    gmailSignatures,
    gmailLabels,
    addDraft,
    deleteDraft,
    sendMessage,
    toggleStarEmail,
    deleteEmail
  } = useGoogleWorkspace();

  const [activeTab, setActiveTab] = useState<"inbox" | "sent" | "drafts" | "templates" | "signature">("inbox");
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>("msg-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string>("INBOX");

  // Compose Message form state
  const [showCompose, setShowCompose] = useState(false);
  const [toInput, setToInput] = useState("");
  const [subInput, setSubInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  const activeAccObj = useMemo(() => {
    return accounts.find(a => a.id === activeAccountId) || null;
  }, [accounts, activeAccountId]);

  // Compute lists
  const currentMessages = useMemo(() => {
    const list = gmailMessages[activeAccountId] || [];
    return list.filter(m => {
      const matchesSearch = m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.body.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === "inbox") {
        return matchesSearch && m.labels.includes("INBOX") && !m.labels.includes("TRASH");
      }
      if (activeTab === "sent") {
        return matchesSearch && m.labels.includes("SENT") && !m.labels.includes("TRASH");
      }
      return matchesSearch;
    });
  }, [gmailMessages, activeAccountId, activeTab, searchQuery]);

  const currentDrafts = useMemo(() => {
    const list = gmailDrafts[activeAccountId] || [];
    return list.filter(d =>
      d.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [gmailDrafts, activeAccountId, searchQuery]);

  const activeMessage = useMemo(() => {
    const list = gmailMessages[activeAccountId] || [];
    return list.find(m => m.id === selectedMsgId) || null;
  }, [gmailMessages, activeAccountId, selectedMsgId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toInput || !subInput || !bodyInput) {
      addToast("Please fill in all email compose inputs.", "error");
      return;
    }

    if (isDrafting) {
      addDraft(toInput, subInput, bodyInput);
      addToast("Saved email draft successfully", "success");
    } else {
      sendMessage(toInput, subInput, bodyInput);
      addToast(`Email successfully sent to ${toInput}`, "success");
    }

    setToInput("");
    setSubInput("");
    setBodyInput("");
    setShowCompose(false);
    setIsDrafting(false);
  };

  const handleComposeTemplate = (tpl: typeof gmailTemplates[0]) => {
    setToInput("");
    setSubInput(tpl.subject);
    setBodyInput(tpl.body);
    setShowCompose(true);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Gmail Integration Client
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Compose drafts, automate customer support answers, and sync email notification threads.
          </p>
        </div>
        <Button
          variant="success"
          size="sm"
          onClick={() => {
            setIsDrafting(false);
            setShowCompose(true);
          }}
          className="font-bold shrink-0"
          leftIcon={<Plus className="h-4 w-4 text-white" />}
        >
          Compose Message
        </Button>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-brand-border dark:border-zinc-800/80 gap-6">
        {(["inbox", "sent", "drafts", "templates", "signature"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedMsgId(null);
            }}
            className={`pb-3 text-xs font-bold capitalize select-none cursor-pointer border-b-2 transition-all duration-150 ${
              activeTab === tab
                ? "border-brand-navy text-brand-navy dark:text-foreground dark:border-white"
                : "border-transparent text-on-surface-variant/70 hover:text-brand-navy"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content layout based on Tab */}
      {(activeTab === "inbox" || activeTab === "sent") && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          {/* Email Messages Index Column */}
          <Card className="lg:col-span-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
            {/* Search filter */}
            <div className="p-3 border-b border-brand-border dark:border-zinc-800/60 flex items-center gap-2">
              <Search className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-xs focus:outline-none focus:ring-0 text-brand-navy dark:text-foreground font-semibold placeholder:text-on-surface-variant/50"
              />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-brand-border dark:divide-zinc-800/60 max-h-[520px]">
              {currentMessages.length > 0 ? (
                currentMessages.map((msg) => {
                  const isSelected = msg.id === selectedMsgId;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMsgId(msg.id)}
                      className={`p-3.5 flex flex-col gap-1 cursor-pointer transition-colors duration-150 ${
                        isSelected
                          ? "bg-brand-slate/80 dark:bg-zinc-900/60"
                          : "hover:bg-brand-slate/40 dark:hover:bg-zinc-900/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs truncate font-bold ${msg.isRead ? "text-on-surface-variant/80" : "text-brand-navy dark:text-foreground"}`}>
                          {msg.from}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/60 font-semibold shrink-0 ml-2">
                          {new Date(msg.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className={`text-xs truncate font-bold ${msg.isRead ? "text-on-surface-variant/90" : "text-brand-navy dark:text-foreground"}`}>
                        {msg.subject}
                      </h4>
                      <p className="text-[10px] text-on-surface-variant font-medium line-clamp-2">
                        {msg.snippet}
                      </p>
                      
                      <div className="flex items-center gap-1.5 mt-1">
                        {msg.labels.includes("IMPORTANT") && (
                          <span className="text-[9px] font-extrabold bg-red-50 dark:bg-red-950/20 text-[#EA4335] px-1.5 py-0.5 rounded">
                            Important
                          </span>
                        )}
                        {msg.isStarred && (
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-on-surface-variant font-medium">
                  No messages matches parameters.
                </div>
              )}
            </div>
          </Card>

          {/* Email Preview details Column */}
          <Card className="lg:col-span-7 p-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col gap-4">
            {activeMessage ? (
              <div className="flex flex-col gap-4 h-full">
                {/* Subject & Actions bar */}
                <div className="flex items-start justify-between gap-4 border-b border-brand-border dark:border-zinc-800 pb-4">
                  <div className="flex flex-col gap-1 text-left">
                    <h2 className="font-bold text-sm text-brand-navy dark:text-foreground leading-snug">
                      {activeMessage.subject}
                    </h2>
                    <span className="text-[11px] text-on-surface-variant font-medium">
                      From: <strong className="text-brand-navy dark:text-foreground">{activeMessage.from}</strong> ({activeMessage.fromEmail})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStarEmail(activeMessage.id)}
                      className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-amber-500 cursor-pointer transition-colors"
                    >
                      <Star className={`h-4 w-4 ${activeMessage.isStarred ? "text-amber-500 fill-amber-500" : ""}`} />
                    </button>
                    <button
                      onClick={() => {
                        deleteEmail(activeMessage.id);
                        addToast("Message deleted", "warning");
                        setSelectedMsgId(null);
                      }}
                      className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Email Body */}
                <div className="flex-1 text-xs text-on-surface-variant/90 font-medium leading-relaxed whitespace-pre-wrap py-2 overflow-y-auto max-h-[350px] border-b border-brand-border/40 pb-4 text-left">
                  {activeMessage.body}
                </div>

                {/* Quick actions triggers */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold"
                    onClick={() => {
                      setToInput(activeMessage.fromEmail);
                      setSubInput(`Re: ${activeMessage.subject}`);
                      setBodyInput(`\n\nOn ${new Date(activeMessage.receivedAt).toLocaleString()}, ${activeMessage.from} wrote:\n> ${activeMessage.body.split('\n').join('\n> ')}`);
                      setIsDrafting(false);
                      setShowCompose(true);
                    }}
                    leftIcon={<Reply className="h-4 w-4" />}
                  >
                    Reply Message
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-2">
                <Mail className="h-10 w-10 text-on-surface-variant/40" />
                <span className="text-xs text-on-surface-variant/80 font-semibold">
                  Choose a message to read details
                </span>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Drafts Layout */}
      {activeTab === "drafts" && (
        <Card className="border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-brand-border flex items-center gap-2">
            <Search className="h-4 w-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-xs focus:outline-none text-brand-navy dark:text-foreground font-semibold placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="divide-y divide-brand-border dark:divide-zinc-800">
            {currentDrafts.length > 0 ? (
              currentDrafts.map((draft) => (
                <div key={draft.id} className="p-4 flex items-center justify-between gap-4 hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10">
                  <div className="flex flex-col gap-0.5 text-left min-w-0">
                    <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                      To: {draft.to || "(No recipient)"}
                    </span>
                    <h4 className="text-xs font-bold text-on-surface-variant truncate">
                      Subject: {draft.subject || "(No subject)"}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant/80 truncate">
                      {draft.body}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setToInput(draft.to);
                        setSubInput(draft.subject);
                        setBodyInput(draft.body);
                        setShowCompose(true);
                        setIsDrafting(false);
                      }}
                      className="font-bold text-[10px]"
                    >
                      Edit
                    </Button>
                    <button
                      onClick={() => {
                        deleteDraft(draft.id);
                        addToast("Draft deleted", "warning");
                      }}
                      className="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-error flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-on-surface-variant">
                No saved drafts in this account workspace.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Templates Layout */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gmailTemplates.map((tpl) => (
            <Card key={tpl.id} className="p-4 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-brand-navy dark:text-foreground">
                    {tpl.name}
                  </h4>
                  <span className="text-[9px] bg-brand-sky-light/80 text-brand-sky px-2 py-0.5 rounded-full font-bold">
                    {tpl.category}
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant/50 font-bold font-mono">
                  Sub: {tpl.subject}
                </p>
                <p className="text-[10px] text-on-surface-variant font-medium line-clamp-3 bg-brand-slate dark:bg-zinc-900/60 p-2.5 rounded-lg border border-brand-border/40 mt-2 whitespace-pre-line">
                  {tpl.body}
                </p>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleComposeTemplate(tpl)}
                  className="font-bold text-[10px]"
                  leftIcon={<Plus className="h-3 w-3" />}
                >
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Signature Editor */}
      {activeTab === "signature" && (
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <div>
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Gmail Signatures
            </h3>
            <p className="text-xs text-on-surface-variant/80 font-medium mt-0.5">
              Manage signatures appended automatically to outgoing AI auto-replies or live dashboard emails.
            </p>
          </div>

          {gmailSignatures.map((sig) => (
            <div key={sig.id} className="p-4 rounded-xl border border-brand-border dark:border-zinc-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                  {sig.name} (Default)
                </span>
                <span className="text-[10px] font-bold text-brand-green flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  Active Signature
                </span>
              </div>
              <div
                className="text-xs p-3 rounded bg-brand-slate dark:bg-zinc-900 border border-brand-border/40 font-mono text-on-surface-variant/80"
                dangerouslySetInnerHTML={{ __html: sig.html }}
              />
            </div>
          ))}
        </Card>
      )}

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                New Message
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setIsDrafting(true);
                    addDraft(toInput, subInput, bodyInput);
                    addToast("Saved to Drafts", "info");
                    setShowCompose(false);
                  }}
                  className="font-bold text-[10px]"
                >
                  Save Draft
                </Button>
              </div>
            </div>

            <form onSubmit={handleSend} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Recipient (To)
                </label>
                <Input
                  type="email"
                  placeholder="e.g. client@company.com"
                  value={toInput}
                  onChange={(e) => setToInput(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Subject
                </label>
                <Input
                  placeholder="e.g. ExpendMore Integration Sync Proposal"
                  value={subInput}
                  onChange={(e) => setSubInput(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 flex items-center justify-between">
                  Email Body
                  <button
                    type="button"
                    onClick={() => {
                      setBodyInput(bodyInput + "\n\nDrafted dynamically using ExpendMore Smart Response assistant.");
                      addToast("AI reply draft appended", "success");
                    }}
                    className="text-[9px] font-bold text-brand-sky flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Sparkles className="h-3 w-3" />
                    AI Draft Assistant
                  </button>
                </label>
                <Textarea
                  placeholder="Write message content here..."
                  rows={8}
                  value={bodyInput}
                  onChange={(e) => setBodyInput(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3.5 border-t border-brand-border dark:border-zinc-800/80 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCompose(false)}
                  className="font-bold"
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  size="sm"
                  className="font-bold"
                  rightIcon={<Send className="h-3.5 w-3.5 text-white" />}
                >
                  Send Message
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
