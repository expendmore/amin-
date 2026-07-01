"use client";

import React from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { RefreshCw, Trash2 } from "lucide-react";

export default function RetryQueuePage() {
  const { addToast } = useToast();
  const { retries, retryFailedNotification, purgeRetryQueue } = useNotifications();

  const handleRetry = (notificationId: string) => {
    retryFailedNotification(notificationId);
    addToast("Retrying message dispatch. Re-establishing connection pools...", "success");
  };

  const handlePurge = () => {
    purgeRetryQueue();
    addToast("Failed messages queue purged.", "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Retry Queue Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Audit failed communications messages, retry pending queue dispatches, or clear crash logs indexes.
          </p>
        </div>
        {retries.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="font-bold shrink-0 animate-none"
            onClick={handlePurge}
            leftIcon={<Trash2 className="h-4 w-4 text-white" />}
          >
            Purge Queue
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retries list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Unresolved Failures Log
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {retries.map((r) => (
              <div
                key={r.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate font-mono">
                    ID: {r.id} (Channel: {r.channel})
                  </span>
                  <span className="text-[10px] text-error font-semibold font-mono">
                    Error: {r.errorMessage}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/70 font-semibold block mt-0.5">
                    Attempts: {r.retryCount} • Last attempt: {new Date(r.lastAttempt).toLocaleString()}
                  </span>
                </div>

                <Button
                  onClick={() => handleRetry(r.notificationId)}
                  variant="outline"
                  size="xs"
                  className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                >
                  Retry Now
                </Button>
              </div>
            ))}

            {retries.length === 0 && (
              <span className="text-xs text-on-surface-variant/80 p-8 text-center font-medium block">
                No active failures recorded in queue. Infrastructure operating normal loops.
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
