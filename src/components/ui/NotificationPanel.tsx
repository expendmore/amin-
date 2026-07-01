"use client";

import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  Bell,
  Info,
  Sparkles,
  X,
  Check,
  AlertTriangle,
  Zap,
  Layers,
  Search,
} from "lucide-react";
import { useDashboard } from "@/store/use-dashboard";

export function NotificationPanel() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useDashboard();
  const [activeFilter, setActiveFilter] = useState<"all" | "whatsapp" | "workflow" | "system">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  // Filter notifications based on tab and search query
  const filteredNotifications = notifications.filter((notif) => {
    // Category mapping
    let category: "whatsapp" | "workflow" | "system" = "system";
    if (notif.type === "ai") {
      category = "workflow";
    } else if (notif.type === "billing") {
      category = "system";
    } else if (notif.title.toLowerCase().includes("whatsapp")) {
      category = "whatsapp";
    }

    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="relative h-10 w-10 flex items-center justify-center bg-transparent border border-brand-border dark:border-border hover:bg-brand-slate dark:hover:bg-surface-container rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy/15 cursor-pointer"
          aria-label="Notification Center Panel"
        >
          <Bell className="h-4 w-4 text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-brand-green rounded-full select-none animate-pulse" />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-96 p-4 bg-white dark:bg-surface border border-brand-border dark:border-border rounded-xl shadow-xl animate-zoom-in text-brand-navy dark:text-foreground"
          sideOffset={8}
          align="end"
        >
          {/* Header Title */}
          <div className="flex justify-between items-center border-b border-brand-border dark:border-border/50 pb-3 select-none">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-brand-green/10 text-brand-green text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold text-brand-sky hover:underline flex items-center gap-1 transition-colors focus:outline-none cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Search bar inside panel */}
          <div className="relative my-3">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 border border-brand-border dark:border-border/50 rounded-lg text-xs bg-brand-slate dark:bg-zinc-950 text-brand-navy dark:text-foreground placeholder:text-on-surface-variant/65 focus:outline-none focus:border-brand-navy"
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-on-surface-variant/80" />
          </div>

          {/* Filters tabs row */}
          <div className="flex gap-1 border-b border-brand-border dark:border-border/40 pb-2 mb-3">
            {(
              [
                { id: "all", label: "All" },
                { id: "whatsapp", label: "WhatsApp" },
                { id: "workflow", label: "Workflows" },
                { id: "system", label: "Systems" },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-colors ${
                  activeFilter === filter.id
                    ? "bg-brand-navy text-white dark:bg-white dark:text-brand-navy"
                    : "text-on-surface-variant hover:bg-brand-slate dark:hover:bg-surface-container"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Scrolling Alerts list */}
          <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-xs text-on-surface-variant/60 select-none">
                No matching notifications.
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                let alertColor = "bg-transparent border-transparent";
                let Icon = Info;
                let iconColor = "text-on-surface-variant";

                if (!notif.isRead) {
                  alertColor = "bg-brand-slate/40 dark:bg-surface-container/30 border-brand-border dark:border-border/40";
                }

                if (notif.type === "billing") {
                  Icon = AlertTriangle;
                  iconColor = "text-amber-500";
                } else if (notif.type === "ai") {
                  Icon = Zap;
                  iconColor = "text-brand-sky";
                } else if (notif.title.toLowerCase().includes("whatsapp")) {
                  Icon = Layers;
                  iconColor = "text-brand-green";
                }

                return (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3 rounded-lg border transition-all duration-150 flex gap-3 items-start relative group cursor-pointer ${alertColor}`}
                  >
                    <span className="p-1.5 bg-brand-slate dark:bg-surface-container border border-brand-border dark:border-border rounded-lg shrink-0 mt-0.5 select-none">
                      <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                    </span>
                    <div className="flex flex-col gap-0.5 pr-4 select-none">
                      <span className="text-xs font-bold leading-tight">
                        {notif.title}
                      </span>
                      <p className="text-[10px] text-on-surface-variant/80 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    <button
                      onClick={(e) => clearNotification(notif.id, e)}
                      className="absolute top-3 right-3 text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground opacity-0 group-hover:opacity-100 transition-all duration-150 p-0.5 rounded hover:bg-brand-slate dark:hover:bg-surface-container cursor-pointer focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default NotificationPanel;
