"use client";

import React, { useMemo, useState } from "react";
import { useMicrosoft365 } from "@/store/use-microsoft-365";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import {
  Users,
  Search,
  MessageSquare,
  Send,
  Plus,
  Compass,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

export default function TeamsPage() {
  const { addToast } = useToast();
  const {
    teamsChats,
    teamsMessages,
    teamsMembers,
    teamsChannels,
    postTeamsMessage
  } = useMicrosoft365();

  const [selectedChatId, setSelectedChatId] = useState<string>("ch-1");
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  
  // Send message inputs
  const [msgInput, setMsgInput] = useState("");

  const currentMessages = useMemo(() => {
    return teamsMessages[selectedChatId] || [];
  }, [teamsMessages, selectedChatId]);

  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    postTeamsMessage(selectedChatId, msgInput.trim());
    addToast("Teams channel message broadcasted successfully", "success");
    setMsgInput("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Microsoft Teams Hub
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Broadcast webhook alerts to Teams channels, inspect chat logs pipelines, and verify members directories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Teams and Channels left bar */}
        <Card className="lg:col-span-4 p-4 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          {/* Active Chats list */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
              Active Chat Threads
            </span>
            <div className="flex flex-col gap-2">
              {teamsChats.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setSelectedChatId(chat.id);
                      setSelectedChannelId(null);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-brand-navy bg-brand-slate/60 dark:border-white dark:bg-zinc-900/60"
                        : "border-brand-border dark:border-zinc-800 hover:border-brand-navy/60 bg-white dark:bg-zinc-950"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquare className="h-5 w-5 text-[#5B5FC7] shrink-0" />
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate font-sans">
                          {chat.topic}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/80 truncate font-semibold">
                          {chat.lastMessagePreview}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teams channels list */}
          <div className="flex flex-col gap-2 border-t border-brand-border pt-4">
            <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
              Teams Channels
            </span>
            <div className="flex flex-col gap-1.5">
              {teamsChannels.map((chn) => (
                <div
                  key={chn.id}
                  className="p-2.5 border border-brand-border rounded-lg bg-brand-slate/30 dark:bg-zinc-900/10 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-brand-navy dark:text-foreground truncate max-w-[160px]">
                    # {chn.name}
                  </span>
                  <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-on-surface-variant px-1.5 py-0.5 rounded font-bold">
                    Connected
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Chat box and Members listing */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Messages window */}
          <Card className="md:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col justify-between overflow-hidden min-h-[480px]">
            <div className="flex-1 flex flex-col overflow-hidden gap-4">
              <div className="border-b border-brand-border pb-3 text-left">
                <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
                  {teamsChats.find(c=>c.id === selectedChatId)?.topic || "Teams Thread"}
                </h3>
                <span className="text-[10px] text-on-surface-variant/80 font-medium">
                  Chat Type: Group Discussion
                </span>
              </div>

              {/* Messages feed */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 max-h-[300px] scrollbar-thin">
                {currentMessages.map((msg) => (
                  <div key={msg.id} className="p-3 bg-brand-slate/50 dark:bg-zinc-900/40 border border-brand-border/40 rounded-xl flex flex-col gap-1 text-left">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-[#5B5FC7] truncate max-w-[130px]">
                        {msg.fromName}
                      </span>
                      <span className="text-on-surface-variant/60 font-semibold shrink-0">
                        {new Date(msg.createdDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-brand-navy dark:text-foreground font-medium whitespace-pre-wrap leading-relaxed">
                      {msg.bodyContent}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Post message form */}
            <form onSubmit={handlePostMessage} className="mt-4 pt-3.5 border-t border-brand-border flex gap-2">
              <Input
                placeholder="Post reply to Teams..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                required
              />
              <Button type="submit" variant="success" size="sm" className="font-bold text-white shrink-0" rightIcon={<Send className="h-3.5 w-3.5 text-white" />}>
                Post
              </Button>
            </form>
          </Card>

          {/* Members list */}
          <Card className="p-4 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
              Channel Directory
            </span>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[380px] divide-y divide-brand-border/50">
              {teamsMembers.map((mem) => (
                <div key={mem.id} className="pt-3 first:pt-0 flex flex-col gap-0.5 text-left">
                  <h4 className="font-bold text-xs text-brand-navy dark:text-foreground truncate">
                    {mem.displayName}
                  </h4>
                  <span className="text-[9px] text-on-surface-variant truncate font-semibold block">
                    {mem.email}
                  </span>
                  <span className="text-[9px] bg-brand-sky-light/80 text-brand-sky px-2 py-0.5 rounded-full font-bold w-fit mt-1">
                    {mem.role}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
