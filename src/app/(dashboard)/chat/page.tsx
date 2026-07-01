"use client";

import React from "react";
import { MessageSquare, Sparkles, Pin, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCreateConversation } from "@/hooks/use-conversations";
import { useRouter } from "next/navigation";

export default function ChatLandingPage() {
  const router = useRouter();
  const createConversation = useCreateConversation();

  const handleStartChat = () => {
    createConversation.mutate(
      {
        modelProvider: "openai",
        modelName: "gpt-4o-mini",
      },
      {
        onSuccess: (newConv) => {
          router.push(`/chat/${newConv.id}`);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto gap-6 select-none h-full px-4">
      <div className="p-4 bg-brand-950/20 text-brand-500 rounded-full border border-brand-500/10 shadow-lg relative">
        <MessageSquare className="h-10 w-10 animate-pulse" />
        <Sparkles className="h-4 w-4 text-brand-400 absolute -top-1 -right-1" />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg text-foreground tracking-tight">Select or Start a Session</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Choose an existing conversation thread from the sidebar list, filter by workspace folders/tags, or start a new thread using the button below.
        </p>
      </div>

      <Button onClick={handleStartChat} size="sm" className="font-semibold text-xs px-6">
        <span>Start New Conversation</span>
      </Button>

      {/* Keyboard shortcuts hints */}
      <div className="w-full border border-border bg-zinc-900/60 rounded-xl p-3 flex flex-col gap-2 mt-4 text-[10px] text-muted-foreground font-mono">
        <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/80 font-sans mb-1 text-left">
          Keyboard Shortcuts
        </span>
        <div className="flex justify-between items-center">
          <span>Create New Session</span>
          <span className="px-1.5 py-0.5 bg-zinc-800 border border-border rounded text-[9px]">Ctrl + N</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Focus Search Console</span>
          <span className="px-1.5 py-0.5 bg-zinc-800 border border-border rounded text-[9px]">Ctrl + K</span>
        </div>
      </div>
    </div>
  );
}
