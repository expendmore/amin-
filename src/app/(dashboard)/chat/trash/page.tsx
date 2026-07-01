"use client";

import React from "react";
import { Trash, RefreshCw, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useConversations, useBulkConversationActions } from "@/hooks/use-conversations";
import { useToast } from "@/store/use-toast";

export default function TrashLandingPage() {
  const { addToast } = useToast();
  const { data: conversations = [], isLoading } = useConversations({ isDeleted: true });
  const bulkActions = useBulkConversationActions();

  const handleEmptyTrash = () => {
    if (conversations.length === 0) return;
    if (
      confirm(
        "Are you sure you want to permanently delete all conversations in the Trash? This action cannot be undone."
      )
    ) {
      const ids = conversations.map((c) => c.id);
      bulkActions.mutate(
        { ids, action: "delete" },
        {
          onSuccess: () => {
            addToast("Trash emptied completely.", "info");
          },
        }
      );
    }
  };

  const handleRestoreAll = () => {
    if (conversations.length === 0) return;
    const ids = conversations.map((c) => c.id);
    bulkActions.mutate(
      { ids, action: "restore" },
      {
        onSuccess: () => {
          addToast("All conversations in Trash restored.", "success");
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto gap-6 select-none h-full px-4">
      <div className="p-4 bg-red-950/20 text-red-500 rounded-full border border-red-500/10 shadow-lg">
        <Trash className="h-10 w-10 text-red-500" />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg text-foreground tracking-tight">Trash Bin</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isLoading
            ? "Loading deleted records..."
            : conversations.length > 0
            ? `You have ${conversations.length} items in the trash. Conversations here will be archived from models. You can restore them or delete them permanently.`
            : "Your Trash is completely empty. Deleted conversations will show up here for recovery."}
        </p>
      </div>

      {!isLoading && conversations.length > 0 && (
        <div className="flex gap-2 items-center">
          <Button onClick={handleRestoreAll} size="xs" variant="secondary" className="px-4 py-2">
            <RefreshCw className="h-3 w-3 mr-1" />
            <span>Restore All</span>
          </Button>
          <Button onClick={handleEmptyTrash} size="xs" variant="destructive" className="px-4 py-2">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>Empty Trash</span>
          </Button>
        </div>
      )}
    </div>
  );
}
