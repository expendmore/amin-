"use client";

import React from "react";
import { Archive, Sparkles, RefreshCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import { useConversations } from "@/hooks/use-conversations";
import { useChat } from "@/store/use-chat";

export default function ArchivedLandingPage() {
  const { resetFilters } = useChat();
  const { data: conversations = [] } = useConversations({ isArchived: true, isDeleted: false });

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto gap-6 select-none h-full px-4">
      <div className="p-4 bg-brand-950/20 text-brand-500 rounded-full border border-brand-500/10 shadow-lg">
        <Archive className="h-10 w-10 text-brand-400" />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg text-foreground tracking-tight">Archived Chats</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {conversations.length > 0
            ? `You have ${conversations.length} conversation threads archived. Select one from the sidebar to inspect or move it back to active.`
            : "No archived conversation threads found in this segment."}
        </p>
      </div>

      {conversations.length === 0 && (
        <Button onClick={resetFilters} size="sm" className="font-semibold text-xs px-6">
          <span>Go to Active Chats</span>
        </Button>
      )}
    </div>
  );
}
