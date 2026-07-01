"use client";

import React from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import { Eye, ShieldCheck, Mail } from "lucide-react";

export default function DeliveryTrackingPage() {
  const { notifications } = useNotifications();

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Delivery Tracking
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review delivery status of individual notifications, check recipient channels, and trace open receipts.
          </p>
        </div>
      </div>

      {/* Dispatches logs list */}
      <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left font-sans">
        <div className="divide-y divide-brand-border">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                  {n.title}
                </span>
                <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                  Recipient ID: {n.recipientId} • Channel: {n.channel} • Status: {n.status}
                </span>
              </div>

              <span className={`text-[10px] border px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                n.status === "delivered" ? "bg-emerald-50 text-brand-green border-emerald-200" : "bg-red-50 text-error border-red-200"
              }`}>
                {n.status}
              </span>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-12 text-center text-xs text-on-surface-variant select-none">
              No dispatches currently traced in live logs.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
