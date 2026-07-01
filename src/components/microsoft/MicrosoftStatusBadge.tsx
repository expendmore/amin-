import React from "react";
import { MSConnectionStatus } from "@/types/microsoft-365";

interface MicrosoftStatusBadgeProps {
  status: MSConnectionStatus;
  className?: string;
}

export function MicrosoftStatusBadge({ status, className = "" }: MicrosoftStatusBadgeProps) {
  const styles: Record<MSConnectionStatus, { bg: string; text: string; dot: string; label: string }> = {
    connected: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
      label: "Connected"
    },
    disconnected: {
      bg: "bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800",
      text: "text-slate-600 dark:text-zinc-400",
      dot: "bg-slate-400 dark:bg-zinc-500",
      label: "Disconnected"
    },
    syncing: {
      bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50",
      text: "text-blue-700 dark:text-blue-400",
      dot: "bg-blue-500 animate-pulse",
      label: "Syncing..."
    },
    permission_error: {
      bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50",
      text: "text-red-700 dark:text-red-400",
      dot: "bg-red-500 animate-ping",
      label: "Permission Error"
    },
    expired: {
      bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50",
      text: "text-amber-700 dark:text-amber-400",
      dot: "bg-amber-500",
      label: "Token Expired"
    },
    maintenance: {
      bg: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/50",
      text: "text-purple-700 dark:text-purple-400",
      dot: "bg-purple-500",
      label: "Maintenance"
    }
  };

  const current = styles[status] || styles.disconnected;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide select-none ${current.bg} ${current.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />
      <span>{current.label}</span>
    </div>
  );
}

export default MicrosoftStatusBadge;
