import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export type StatusType =
  | "success"
  | "running"
  | "failed"
  | "approved"
  | "pending"
  | "rejected"
  | "ai-responding"
  | "agent-assigned";

interface StatusChipProps {
  status: StatusType | string;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const norm = status.toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-md text-[10px] font-semibold border select-none border-transparent",
        norm === "success" && "bg-brand-green/10 text-brand-green",
        norm === "running" && "bg-brand-sky/10 text-brand-sky",
        norm === "failed" && "bg-error/10 text-error",
        norm === "approved" && "bg-brand-green/10 text-[#166534] border-brand-green/20",
        norm === "pending" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
        norm === "rejected" && "bg-error/10 text-error border-error/20",
        norm === "ai-responding" && "bg-brand-sky/10 text-brand-sky border-[#BAE6FD]",
        norm === "agent-assigned" && "bg-surface-variant text-on-surface border-outline-variant/30",
        className
      )}
    >
      {/* Small dot indicators for logs */}
      {(norm === "success" || norm === "approved") && (
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
      )}
      {norm === "running" && (
        <span className="w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse shrink-0" />
      )}
      {(norm === "failed" || norm === "rejected") && (
        <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
      )}

      {/* Label conversions */}
      {norm === "success" && "Success"}
      {norm === "running" && "Running"}
      {norm === "failed" && "Failed"}
      {norm === "approved" && "Approved"}
      {norm === "pending" && "Pending"}
      {norm === "rejected" && "Rejected"}
      {norm === "ai-responding" && "AI Responding"}
      {norm === "agent-assigned" && "Agent Assigned"}
      {!["success", "running", "failed", "approved", "pending", "rejected", "ai-responding", "agent-assigned"].includes(norm) && status}
    </span>
  );
}
export default StatusChip;
