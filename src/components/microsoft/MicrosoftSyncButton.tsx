import React from "react";
import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

interface MicrosoftSyncButtonProps {
  status: "idle" | "running" | "paused" | "error";
  onSync: () => void;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function MicrosoftSyncButton({ status, onSync, size = "sm", className = "" }: MicrosoftSyncButtonProps) {
  const isSyncing = status === "running";

  return (
    <Button
      variant={isSyncing ? "outline" : "success"}
      size={size}
      onClick={onSync}
      disabled={isSyncing}
      className={`relative hover:shadow-[0_0_8px_rgba(37,211,102,0.4)] ${className}`}
      leftIcon={
        <RefreshCw
          className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin text-brand-navy" : "text-white"}`}
        />
      }
    >
      {isSyncing ? "Syncing..." : "Sync Now"}
    </Button>
  );
}

export default MicrosoftSyncButton;
