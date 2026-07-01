"use client";

import React from "react";
import { useNotifications } from "@/store/use-notifications";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import { Settings } from "lucide-react";

export default function PreferencesPage() {
  const { addToast } = useToast();
  const { preferences, updatePreferences } = useNotifications();

  const handleToggle = (key: keyof typeof preferences, label: string) => {
    updatePreferences({ [key]: !preferences[key] });
    addToast(`Preferences updated for: ${label}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Subscriber Preferences
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Toggle communication channel options (Email, WhatsApp, Push), set digest intervals, and manage limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Toggle choices */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 border-b border-brand-border pb-3">
            <Settings className="h-4.5 w-4.5 text-brand-sky" />
            Communication Channels Opt-In Settings
          </h3>

          <div className="flex flex-col gap-4 font-sans text-xs font-semibold text-on-surface-variant leading-relaxed">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-brand-navy dark:text-foreground font-bold">Email Notifications</span>
                <span className="text-[10px] text-on-surface-variant/80">Monthly summary updates, invoices, and campaigns alerts</span>
              </div>
              <Toggle
                checked={preferences.emailEnabled}
                onChange={() => handleToggle("emailEnabled", "Email Notifications")}
              />
            </div>

            <div className="flex items-center justify-between border-t border-brand-border/60 pt-4">
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-brand-navy dark:text-foreground font-bold">WhatsApp Push Alerts</span>
                <span className="text-[10px] text-on-surface-variant/80">Immediate webhook updates and chatbot alerts</span>
              </div>
              <Toggle
                checked={preferences.whatsappEnabled}
                onChange={() => handleToggle("whatsappEnabled", "WhatsApp Push Alerts")}
              />
            </div>

            <div className="flex items-center justify-between border-t border-brand-border/60 pt-4">
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-brand-navy dark:text-foreground font-bold">Browser Push Messages</span>
                <span className="text-[10px] text-on-surface-variant/80">Real-time alerts displayed inside browser drawer panel</span>
              </div>
              <Toggle
                checked={preferences.pushEnabled}
                onChange={() => handleToggle("pushEnabled", "Browser Push Messages")}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
