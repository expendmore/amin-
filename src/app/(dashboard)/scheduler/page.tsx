"use client";

import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useScheduler } from "@/store/use-scheduler";
import { useToast } from "@/store/use-toast";
import { ScheduleEvent, ScheduleLog, ConflictReport } from "@/types/scheduler";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Sparkles,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Trash2,
  Download,
  Upload,
  Layers,
  Users,
  Settings,
  AlertCircle,
  FileText,
  Repeat,
  ShieldAlert,
  CalendarDays,
  ListFilter,
  Check,
  Zap,
  HelpCircle,
  Copy
} from "lucide-react";

export default function AutomationSchedulerPage() {
  const { addToast } = useToast();
  
  // Zustand store properties & actions
  const {
    events,
    logs,
    conflicts,
    timezone,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    setTimezone,
    addEvent,
    updateEvent,
    deleteEvent,
    pauseEvent,
    resumeEvent,
    retryEvent,
    bulkCancel,
    bulkPause,
    bulkResume,
    detectConflicts,
    importEvents,
    exportEvents
  } = useScheduler();

  // Active view: calendar | queue | logs
  const [activeViewTab, setActiveViewTab] = useState<"calendar" | "queue" | "logs">("calendar");

  // QA mock states: default | loading | empty | offline
  const [uiStateMode, setUiStateMode] = useState<"default" | "loading" | "empty" | "offline">("default");

  // Calendar Month Navigation states
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Selected schedule event for details popup/inspector
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedEvent = useMemo(() => events.find(e => e.id === selectedEventId), [events, selectedEventId]);

  // Multiselect state for queue bulk operations
  const [selectedQueueIds, setSelectedQueueIds] = useState<string[]>([]);

  // Wizard Modal States
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardType, setWizardType] = useState<ScheduleEvent["type"]>("campaign");
  const [wizardTitle, setWizardTitle] = useState("");
  const [wizardDesc, setWizardDesc] = useState("");
  const [wizardTargetId, setWizardTargetId] = useState("camp-new");
  const [wizardTargetName, setWizardTargetName] = useState("Selected Campaign Asset");
  const [wizardSegmentName, setWizardSegmentName] = useState("VIP Shopify Customers");
  const [wizardAudienceSize, setWizardAudienceSize] = useState(1200);
  const [wizardTime, setWizardTime] = useState("");
  const [wizardDate, setWizardDate] = useState("");
  const [wizardPriority, setWizardPriority] = useState<ScheduleEvent["priority"]>("medium");
  const [wizardRecurrence, setWizardRecurrence] = useState<"none" | "daily" | "weekly" | "monthly" | "yearly" | "custom_cron">("none");
  const [wizardCron, setWizardCron] = useState("0 10 * * *");
  
  // JSON Import raw text field state
  const [importJsonText, setImportJsonText] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  // Trigger initial conflict calculations
  useEffect(() => {
    detectConflicts();
  }, [detectConflicts]);

  // Run bulk actions
  const handleBulkPause = () => {
    if (selectedQueueIds.length === 0) return;
    bulkPause(selectedQueueIds);
    setSelectedQueueIds([]);
    addToast("Selected queue items paused.", "info");
  };

  const handleBulkCancel = () => {
    if (selectedQueueIds.length === 0) return;
    bulkCancel(selectedQueueIds);
    setSelectedQueueIds([]);
    addToast("Selected queue items cancelled.", "warning");
  };

  const handleBulkResume = () => {
    if (selectedQueueIds.length === 0) return;
    bulkResume(selectedQueueIds);
    setSelectedQueueIds([]);
    addToast("Selected queue items resumed.", "success");
  };

  // Toggle single queue select checkbox
  const toggleQueueSelect = (id: string) => {
    setSelectedQueueIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Wizard Confirmation Complete Submit
  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardTitle.trim() || !wizardDate || !wizardTime) {
      addToast("Please fill in scheduling name, date and target time", "warning");
      return;
    }

    const isoScheduledTime = new Date(`${wizardDate}T${wizardTime}:00`).toISOString();

    addEvent({
      title: wizardTitle,
      description: wizardDesc,
      type: wizardType,
      targetId: wizardTargetId,
      targetName: wizardTargetName,
      scheduledTime: isoScheduledTime,
      timezone: timezone,
      priority: wizardPriority,
      audienceSize: Number(wizardAudienceSize),
      segmentName: wizardSegmentName,
      recurrenceRule: wizardRecurrence !== "none" ? {
        frequency: wizardRecurrence,
        cronExpression: wizardRecurrence === "custom_cron" ? wizardCron : undefined,
        skipHolidays: true,
        businessDaysOnly: false,
        weekendsOnly: false
      } : undefined,
      maxRetries: 3
    });

    addToast("New automation task scheduled successfully", "success");
    setShowWizardModal(false);
    // Reset wizard forms
    setWizardStep(1);
    setWizardTitle("");
    setWizardDesc("");
    setWizardTime("");
    setWizardDate("");
    setWizardRecurrence("none");
  };

  // Reschedule simulation handler (Simulating drag & drop event)
  const handleRescheduleEvent = (id: string, daysOffset: number) => {
    const target = events.find(e => e.id === id);
    if (!target) return;

    const originalDate = new Date(target.scheduledTime);
    originalDate.setDate(originalDate.getDate() + daysOffset);
    
    updateEvent(id, {
      scheduledTime: originalDate.toISOString(),
      nextExecution: originalDate.toISOString()
    });

    addToast(`Rescheduled event to ${originalDate.toLocaleDateString()}`, "success");
    setSelectedEventId(null);
  };

  // Copy schedule JSON to clipboard
  const handleExportSchedule = () => {
    const dataStr = exportEvents();
    navigator.clipboard.writeText(dataStr);
    addToast("Schedule config JSON copied to clipboard", "success");
  };

  // Handle file JSON import submit
  const handleImportJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;

    const success = importEvents(importJsonText);
    if (success) {
      addToast("Imported scheduling configurations successfully!", "success");
      setShowImportModal(false);
      setImportJsonText("");
    } else {
      addToast("Failed to parse JSON. Please check configuration structures.", "error");
    }
  };

  // Calendar Day cell rendering calculations
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startOffset = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Monday etc.
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const daysArray: (Date | null)[] = [];
    
    // Empty cells before first day
    for (let i = 0; i < startOffset; i++) {
      daysArray.push(null);
    }
    
    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(new Date(currentYear, currentMonth, day));
    }
    
    return daysArray;
  }, [currentMonth, currentYear]);

  // Navigate calendar month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Format month name
  const monthName = currentDate.toLocaleDateString("default", { month: "long" });

  // Get events scheduled on specific date
  const getEventsOnDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.scheduledTime);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // KPI Computations
  const computedStats = useMemo(() => {
    const scheduled = events.filter(e => e.status === "queued" || e.status === "processing").length;
    const recurring = events.filter(e => e.recurrenceRule && e.status !== "cancelled").length;
    const completed = events.filter(e => e.status === "completed").length;
    const failed = events.filter(e => e.status === "failed").length;
    
    return { scheduled, recurring, completed, failed };
  }, [events]);

  // Filtered lists for logs & queues tabs
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.segmentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  // Sort upcoming events chronologically for left sidebar timeline
  const upcomingTimelineEvents = useMemo(() => {
    return events
      .filter(e => e.status === "queued")
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
      .slice(0, 5);
  }, [events]);

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-brand-border dark:border-border/40 pb-5 gap-4">
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-brand-green/10 text-brand-green rounded-lg border border-brand-green/20">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-extrabold text-brand-navy dark:text-foreground tracking-tight">
              Automation Calendar & Scheduler
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-green text-white rounded-full uppercase">
              Scheduler Tiers
            </span>
          </div>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400">
            Schedule bulk campaigns, coordinate webhook workflows, configure recurring triggers, and run rate-limit conflict audits.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)} leftIcon={<Upload className="h-3.5 w-3.5" />}>
            Import JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportSchedule} leftIcon={<Download className="h-3.5 w-3.5" />}>
            Export Configs
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => {
              setShowWizardModal(true);
              setWizardStep(1);
            }}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Create Schedule
          </Button>
        </div>
      </div>

      {/* OFFLINE OUTAGE WARNING STATE */}
      {uiStateMode === "offline" && (
        <div className="bg-red-950/20 border border-red-500/20 text-red-500 p-4 rounded-xl flex gap-3 text-xs leading-relaxed items-center text-left select-none animate-fadeIn shrink-0">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <span className="font-extrabold">Outbound Gateway Interrupted: Offline.</span> Delivery scheduler queue cached locally. Active broadcasts will resume dispatch when link is recovered.
          </div>
        </div>
      )}

      {/* MAIN KPIs GRID */}
      {uiStateMode !== "loading" && uiStateMode !== "empty" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Card className="p-5 flex flex-col gap-2 bg-card text-left select-none">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Scheduled Queue</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-foreground font-mono">
                {computedStats.scheduled}
              </span>
              <span className="text-[9px] font-bold bg-brand-sky-light/10 text-brand-sky border border-brand-sky/20 px-2 py-0.5 rounded-full uppercase">
                Active tasks
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 border-t border-brand-border/50 dark:border-border/30 pt-2">
              Messages queued in calendar dispatcher
            </p>
          </Card>

          <Card className="p-5 flex flex-col gap-2 bg-card text-left select-none">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Recurring Rules</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-foreground font-mono">
                {computedStats.recurring}
              </span>
              <span className="text-[9px] font-bold bg-brand-green/10 text-brand-green border border-brand-green/20 px-2 py-0.5 rounded-full uppercase">
                Auto-looping
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 border-t border-brand-border/50 dark:border-border/30 pt-2">
              Daily/Weekly repeat rules active
            </p>
          </Card>

          <Card className="p-5 flex flex-col gap-2 bg-card text-left select-none">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Completed dispatches</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-foreground font-mono">
                {computedStats.completed}
              </span>
              <span className="text-[9px] font-bold bg-brand-green/10 text-brand-green border border-brand-green/20 px-2 py-0.5 rounded-full uppercase">
                100% Sent
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 border-t border-brand-border/50 dark:border-border/30 pt-2">
              Broadcast logs flagged completed
            </p>
          </Card>

          <Card className="p-5 flex flex-col gap-2 bg-card text-left select-none">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Failed alerts</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-foreground font-mono">
                {computedStats.failed}
              </span>
              {computedStats.failed > 0 ? (
                <span className="text-[9px] font-bold bg-red-950/20 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full uppercase animate-pulse">
                  Needs retry
                </span>
              ) : (
                <span className="text-[9px] font-bold bg-brand-slate text-zinc-400 border border-brand-border dark:border-border/30 px-2 py-0.5 rounded-full uppercase">
                  Clean logs
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 border-t border-brand-border/50 dark:border-border/30 pt-2">
              Failed webhook executions
            </p>
          </Card>

        </div>
      )}

      {/* THREE COLUMN CANVASES WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* LEFT COLUMN: CONFLICT ENGINE & TIMELINE QUEUE */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* TIMEZONE SELECTOR */}
          <Card className="p-4 flex flex-col gap-2.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Timezone Synchronization</span>
            <select
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                addToast(`Scheduler synchronized with timezone: ${e.target.value}`, "info");
              }}
              className="w-full h-9 border rounded-lg text-[11px] font-bold bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
            >
              <option value="Asia/Kolkata">India Standard Time (IST - UTC+5:30)</option>
              <option value="UTC">Universal Coordinated Time (UTC)</option>
              <option value="US/Eastern">US Eastern Standard Time (EST - UTC-5)</option>
              <option value="US/Pacific">US Pacific Standard Time (PST - UTC-8)</option>
              <option value="Europe/London">Greenwich Mean Time (GMT - UTC+0)</option>
            </select>
          </Card>

          {/* CONFLICT DETECTOR INTERFACE */}
          <Card className="p-4 flex flex-col gap-3">
            <div className="border-b border-brand-border dark:border-border/30 pb-2.5 flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase select-none">Conflict Detection Engine</span>
              {conflicts.length > 0 ? (
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-brand-green" />
              )}
            </div>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {conflicts.length === 0 ? (
                <div className="py-4 text-center text-[10px] text-muted-foreground italic flex flex-col items-center gap-1">
                  <Check className="h-5 w-5 text-brand-green" />
                  No scheduling conflicts or overlaps detected!
                </div>
              ) : (
                conflicts.map((conf) => (
                  <div
                    key={conf.id}
                    className={`p-2.5 border rounded-lg flex flex-col gap-1 text-[10px] leading-relaxed relative ${
                      conf.severity === "critical"
                        ? "bg-red-950/20 border-red-500/20 text-red-500"
                        : "bg-amber-950/20 border-amber-500/20 text-amber-500"
                    }`}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                      <span>{conf.title}</span>
                    </div>
                    <p className="text-[9px] opacity-90">{conf.description}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* UPCOMING QUEUE TIMELINE */}
          <Card className="p-4 flex flex-col gap-3">
            <span className="text-[9px] font-bold text-zinc-400 uppercase select-none pb-2 border-b border-brand-border dark:border-border/30">
              Upcoming Queue Timeline
            </span>

            <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
              {upcomingTimelineEvents.length === 0 ? (
                <div className="py-6 text-center text-[10px] text-muted-foreground italic">
                  No upcoming scheduled tasks.
                </div>
              ) : (
                upcomingTimelineEvents.map((e) => {
                  const evDate = new Date(e.scheduledTime);
                  return (
                    <div
                      key={e.id}
                      onClick={() => setSelectedEventId(e.id)}
                      className="border-l-2 border-brand-sky pl-3 py-1 flex flex-col gap-0.5 hover:bg-brand-slate/40 dark:hover:bg-zinc-900/30 rounded-r-md cursor-pointer transition-all text-left"
                    >
                      <span className="text-[10px] font-extrabold text-foreground leading-normal line-clamp-1">{e.title}</span>
                      <span className="text-[8px] font-bold text-muted-foreground uppercase">{e.type} • {e.targetName}</span>
                      <span className="text-[8px] text-brand-sky font-mono mt-0.5 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {evDate.toLocaleDateString()} {evDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: CALENDAR OR DATA SHEETS */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* HEADER NAV TAB SWITCHER */}
          <div className="flex items-center justify-between border-b border-brand-border dark:border-border/40 pb-3 gap-4 select-none">
            <div className="flex items-center gap-1 bg-brand-slate/40 dark:bg-zinc-900 border border-brand-border dark:border-border/50 p-1 rounded-xl shadow-inner">
              <button
                onClick={() => {
                  setActiveViewTab("calendar");
                  setUiStateMode("default");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeViewTab === "calendar"
                    ? "bg-white dark:bg-zinc-800 text-brand-navy dark:text-foreground shadow-xs"
                    : "text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground"
                }`}
              >
                Calendar Grid View
              </button>
              <button
                onClick={() => {
                  setActiveViewTab("queue");
                  setUiStateMode("default");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeViewTab === "queue"
                    ? "bg-white dark:bg-zinc-800 text-brand-navy dark:text-foreground shadow-xs"
                    : "text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground"
                }`}
              >
                Queue List Manager
              </button>
              <button
                onClick={() => {
                  setActiveViewTab("logs");
                  setUiStateMode("default");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeViewTab === "logs"
                    ? "bg-white dark:bg-zinc-800 text-brand-navy dark:text-foreground shadow-xs"
                    : "text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground"
                }`}
              >
                Execution Audit Logs
              </button>
            </div>

            {/* QA Demo switcher states */}
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-bold text-muted-foreground uppercase">UI:</span>
              <select
                value={uiStateMode}
                onChange={(e) => setUiStateMode(e.target.value as any)}
                className="text-[9px] font-bold border border-brand-border dark:border-border/40 rounded-lg p-1 bg-white dark:bg-zinc-900 text-brand-navy dark:text-zinc-300 outline-none cursor-pointer"
              >
                <option value="default">Default State</option>
                <option value="loading">Loading Skeleton</option>
                <option value="empty">Empty Slate</option>
                <option value="offline">Offline Error</option>
              </select>
            </div>
          </div>

          {/* SKELETON LOADER STATE */}
          {uiStateMode === "loading" && (
            <div className="flex flex-col gap-4 animate-pulse select-none">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-10 bg-zinc-900/10 dark:bg-zinc-800/20 border border-border rounded-lg" />
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-28 bg-zinc-900/5 dark:bg-zinc-800/10 border border-border rounded-xl" />
                ))}
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {uiStateMode === "empty" && (
            <Card className="p-12 text-center flex flex-col items-center justify-center gap-4 select-none">
              <span className="p-3 bg-brand-slate text-zinc-400 rounded-full border border-brand-border dark:border-border/10">
                <CalendarIcon className="h-8 w-8" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-extrabold text-foreground text-sm">No Scheduled Events Registered</h3>
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  You haven't scheduled any campaigns or automated workflow executions in this timezone calendar. Click below to launch the Create Wizard.
                </p>
              </div>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowWizardModal(true)}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Create Schedule Now
              </Button>
            </Card>
          )}

          {/* UI CONTAINER: NORMAL RENDERS */}
          {uiStateMode !== "loading" && uiStateMode !== "empty" && (
            <div className="flex flex-col gap-6 text-left">
              
              {/* TAB A: CALENDAR GRID */}
              {activeViewTab === "calendar" && (
                <Card className="p-5 flex flex-col gap-4">
                  
                  {/* Calendar controls */}
                  <div className="flex items-center justify-between border-b border-brand-border dark:border-border/30 pb-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4.5 w-4.5 text-brand-navy dark:text-zinc-300" />
                      <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">
                        {monthName} {currentYear}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 select-none">
                      <button
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 rounded border border-brand-border dark:border-border/40 cursor-pointer"
                      >
                        <ChevronLeft className="h-4.5 w-4.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-2.5 py-1 text-[10px] font-bold border border-brand-border dark:border-border/40 rounded hover:bg-brand-slate dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        Today
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 rounded border border-brand-border dark:border-border/40 cursor-pointer"
                      >
                        <ChevronRight className="h-4.5 w-4.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar grid grid-cols-7 */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Weekday headers */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                      <span key={day} className="text-[10px] font-bold text-muted-foreground text-center select-none py-1.5">
                        {day}
                      </span>
                    ))}

                    {/* Day grid boxes */}
                    {calendarDays.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} className="h-28 bg-brand-slate/10 dark:bg-zinc-950/5 border border-transparent rounded-lg opacity-40 select-none" />;
                      }

                      const dateEvents = getEventsOnDate(day);
                      const isToday =
                        day.getDate() === new Date().getDate() &&
                        day.getMonth() === new Date().getMonth() &&
                        day.getFullYear() === new Date().getFullYear();

                      return (
                        <div
                          key={day.toISOString()}
                          onClick={() => {
                            // Quick populate date in wizard and open
                            setWizardDate(day.toISOString().split("T")[0]);
                            setWizardTime("10:00");
                            setShowWizardModal(true);
                          }}
                          className={`h-28 border p-1 rounded-xl relative group transition-all flex flex-col gap-1 overflow-y-auto cursor-pointer hover:border-brand-navy hover:shadow-xs select-none ${
                            isToday
                              ? "bg-brand-green-light/10 border-[#25D366]/40 text-[#25D366]"
                              : "bg-white dark:bg-surface border-brand-border dark:border-border text-brand-navy dark:text-foreground"
                          }`}
                        >
                          {/* Day number */}
                          <span className={`text-[10px] font-extrabold ${isToday ? "text-[#25D366]" : "text-muted-foreground"} self-end pr-1 pt-0.5`}>
                            {day.getDate()}
                          </span>

                          {/* Event Badges list */}
                          <div className="flex flex-col gap-0.5 overflow-hidden flex-grow select-none">
                            {dateEvents.map(e => (
                              <div
                                key={e.id}
                                onClick={(ev) => {
                                  ev.stopPropagation(); // Avoid day-click trigger
                                  setSelectedEventId(e.id);
                                }}
                                className={`text-[8px] px-1 py-0.5 font-bold rounded truncate flex items-center justify-between border select-none ${
                                  e.status === "completed"
                                    ? "bg-green-950/20 border-green-500/20 text-green-500"
                                    : e.status === "failed"
                                    ? "bg-red-950/20 border-red-500/20 text-red-500"
                                    : e.status === "paused"
                                    ? "bg-amber-950/20 border-amber-500/20 text-amber-500"
                                    : "bg-brand-sky-light/20 border-brand-sky/20 text-brand-sky"
                                }`}
                                title={e.title}
                              >
                                <span>{e.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* TAB B: QUEUE LIST MANAGER */}
              {activeViewTab === "queue" && (
                <Card className="p-5 flex flex-col gap-4">
                  
                  {/* Search and filter controls */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none">
                    <div className="flex items-center gap-2 max-w-xs flex-1">
                      <Input
                        type="search"
                        placeholder="Search schedules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <ListFilter className="h-4 w-4 text-muted-foreground" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-[11px] font-bold border border-brand-border dark:border-border/40 rounded-lg p-1 bg-white dark:bg-zinc-900 text-brand-navy dark:text-zinc-300 outline-none cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="queued">Queued</option>
                        <option value="processing">Processing</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Bulk Actions Header */}
                  {selectedQueueIds.length > 0 && (
                    <div className="bg-brand-slate dark:bg-zinc-900 p-2.5 rounded-lg border border-brand-border dark:border-border/30 flex items-center justify-between select-none animate-fadeIn">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Selected {selectedQueueIds.length} items for bulk operations:
                      </span>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="xs" onClick={handleBulkPause}>
                          Bulk Pause
                        </Button>
                        <Button variant="outline" size="xs" onClick={handleBulkResume}>
                          Bulk Resume
                        </Button>
                        <Button variant="destructive" size="xs" onClick={handleBulkCancel}>
                          Bulk Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Queue table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-brand-border dark:border-border/30 text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                          <th className="py-2.5 px-4 w-10">
                            <input
                              type="checkbox"
                              checked={selectedQueueIds.length === filteredEvents.length && filteredEvents.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedQueueIds(filteredEvents.map(item => item.id));
                                } else {
                                  setSelectedQueueIds([]);
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                          </th>
                          <th className="py-2.5 px-4">Schedule Title</th>
                          <th className="py-2.5 px-4">Type</th>
                          <th className="py-2.5 px-4">Target Reference</th>
                          <th className="py-2.5 px-4">Scheduled Date/Time</th>
                          <th className="py-2.5 px-4">Priority</th>
                          <th className="py-2.5 px-4 font-mono">Audience</th>
                          <th className="py-2.5 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border dark:divide-border/20">
                        {filteredEvents.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-muted-foreground italic">
                              No scheduling records match the filters query.
                            </td>
                          </tr>
                        ) : (
                          filteredEvents.map((e) => {
                            const date = new Date(e.scheduledTime);
                            const isChecked = selectedQueueIds.includes(e.id);
                            return (
                              <tr
                                key={e.id}
                                className={`hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30 ${
                                  isChecked ? "bg-brand-sky-light/5" : ""
                                }`}
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleQueueSelect(e.id)}
                                    className="rounded border-gray-300"
                                  />
                                </td>
                                <td
                                  className="py-3 px-4 font-semibold text-brand-navy dark:text-foreground cursor-pointer hover:underline"
                                  onClick={() => setSelectedEventId(e.id)}
                                >
                                  {e.title}
                                </td>
                                <td className="py-3 px-4 capitalize font-semibold text-muted-foreground">
                                  {e.type}
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">{e.targetName}</td>
                                <td className="py-3 px-4 font-mono text-muted-foreground">
                                  {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </td>
                                <td className="py-3 px-4 capitalize">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    e.priority === "critical"
                                      ? "bg-red-950/20 text-red-500 border border-red-500/20"
                                      : e.priority === "high"
                                      ? "bg-amber-950/20 text-amber-500 border border-amber-500/20"
                                      : "bg-brand-slate text-zinc-400 border border-brand-border dark:border-border/30"
                                  }`}>
                                    {e.priority}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-mono text-zinc-500 font-bold">{e.audienceSize}</td>
                                <td className="py-3 px-4 font-bold">
                                  <span className={`text-[10px] uppercase tracking-wider ${
                                    e.status === "completed"
                                      ? "text-brand-green"
                                      : e.status === "failed"
                                      ? "text-red-500 animate-pulse"
                                      : e.status === "paused"
                                      ? "text-amber-500"
                                      : "text-brand-sky"
                                  }`}>
                                    {e.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* TAB C: AUDIT LOGS VIEW */}
              {activeViewTab === "logs" && (
                <Card className="p-5 flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase select-none pb-2 border-b border-brand-border dark:border-border/30">
                    Execution Log Trails
                  </span>

                  <div className="flex flex-col gap-3.5">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="border border-brand-border/60 dark:border-border/20 rounded-xl p-4 bg-brand-slate/10 dark:bg-zinc-900/10 flex flex-col md:flex-row justify-between items-start gap-4 hover:border-brand-navy transition-all"
                      >
                        <div className="flex gap-3 text-left">
                          {log.status === "success" && <CheckCircle className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />}
                          {log.status === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />}
                          {log.status === "error" && <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />}

                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-brand-navy dark:text-foreground">{log.title}</span>
                            <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{log.message}</p>
                            <p className="text-[9px] text-zinc-500 leading-normal font-mono bg-brand-slate/40 dark:bg-zinc-950/40 p-2 rounded border border-brand-border/40 dark:border-border/10 mt-1.5 whitespace-pre-wrap">
                              {log.details}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 text-right select-none">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">{log.type}</span>
                          <span className="text-[8px] text-zinc-500 font-mono mt-1">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            </div>
          )}

        </div>

      </div>

      {/* MODAL A: EVENT DETAILS INSPECTOR */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn select-none text-left">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-4 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-brand-border dark:border-border/30 pb-3">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4.5 w-4.5 text-brand-sky" />
                <h3 className="text-xs font-extrabold text-brand-navy dark:text-foreground uppercase tracking-wide">
                  Schedule Run Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedEventId(null)}
                className="text-muted-foreground hover:text-brand-navy dark:hover:text-foreground text-xs cursor-pointer font-bold"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[8px] font-bold text-muted-foreground uppercase">Schedule Title</span>
                <h4 className="text-sm font-bold text-brand-navy dark:text-foreground mt-0.5">{selectedEvent.title}</h4>
              </div>

              <div>
                <span className="text-[8px] font-bold text-muted-foreground uppercase">Target Asset</span>
                <p className="text-xs text-brand-navy dark:text-zinc-300 font-medium capitalize">
                  {selectedEvent.type} • {selectedEvent.targetName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-brand-slate/40 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-brand-border/40 dark:border-border/10">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">Target Audience</span>
                  <span className="text-[10px] font-extrabold text-foreground mt-0.5">{selectedEvent.audienceSize} ({selectedEvent.segmentName})</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">Status</span>
                  <span className="text-[10px] font-bold text-brand-sky capitalize mt-0.5">{selectedEvent.status}</span>
                </div>
                <div className="flex flex-col border-t border-brand-border/30 dark:border-border/10 pt-1.5 mt-1.5 col-span-2">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">Scheduled Time</span>
                  <span className="text-[9px] font-mono font-bold text-foreground mt-0.5">
                    {new Date(selectedEvent.scheduledTime).toLocaleString()} ({selectedEvent.timezone})
                  </span>
                </div>
              </div>

              {selectedEvent.failureReason && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-500 text-[10px] leading-relaxed rounded-xl">
                  <span className="font-bold block uppercase text-[8px] mb-1">Failure Reason Details</span>
                  {selectedEvent.failureReason}
                </div>
              )}

              {/* Event Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-brand-border dark:border-border/30 pt-3">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    deleteEvent(selectedEvent.id);
                    setSelectedEventId(null);
                    addToast("Scheduled task deleted.", "warning");
                  }}
                  leftIcon={<Trash2 className="h-3 w-3" />}
                >
                  Delete
                </Button>

                {selectedEvent.status === "paused" ? (
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => {
                      resumeEvent(selectedEvent.id);
                      setSelectedEventId(null);
                    }}
                    leftIcon={<Play className="h-3 w-3" />}
                  >
                    Resume
                  </Button>
                ) : selectedEvent.status === "queued" ? (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      pauseEvent(selectedEvent.id);
                      setSelectedEventId(null);
                    }}
                    leftIcon={<Pause className="h-3 w-3" />}
                  >
                    Pause
                  </Button>
                ) : selectedEvent.status === "failed" ? (
                  <Button
                    variant="success"
                    size="xs"
                    onClick={() => {
                      retryEvent(selectedEvent.id);
                      setSelectedEventId(null);
                    }}
                    leftIcon={<Zap className="h-3 w-3" />}
                  >
                    Retry Now
                  </Button>
                ) : null}

                {/* Reschedule trigger Simulation */}
                {selectedEvent.status === "queued" && (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleRescheduleEvent(selectedEvent.id, 1)}
                  >
                    Reschedule (+1 Day)
                  </Button>
                )}
              </div>

            </div>

          </Card>
        </div>
      )}

      {/* MODAL B: CREATE SCHEDULE WIZARD */}
      {showWizardModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-left">
          <Card className="w-full max-w-lg p-6 bg-white dark:bg-zinc-950 flex flex-col gap-4 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-brand-border dark:border-border/30 pb-3 select-none">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-brand-green" />
                <h3 className="text-xs font-extrabold text-brand-navy dark:text-foreground uppercase tracking-wide">
                  Create Schedule Wizard (Step {wizardStep} of 4)
                </h3>
              </div>
              <button
                onClick={() => setShowWizardModal(false)}
                className="text-muted-foreground hover:text-brand-navy dark:hover:text-foreground text-xs cursor-pointer font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleWizardSubmit} className="flex flex-col gap-4">
              
              {/* STEP 1: CAMPAIGN SELECTION */}
              {wizardStep === 1 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <Input
                    label="Scheduler Run Title"
                    placeholder="e.g. Abandoned Cart Alert Tomorrow"
                    value={wizardTitle}
                    onChange={(e) => setWizardTitle(e.target.value)}
                    required
                  />

                  <Input
                    label="Brief Description"
                    placeholder="e.g. Scheduled alert for abandoned checkouts."
                    value={wizardDesc}
                    onChange={(e) => setWizardDesc(e.target.value)}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-brand-navy dark:text-foreground select-none">
                      Automation Task Type
                    </label>
                    <select
                      value={wizardType}
                      onChange={(e) => setWizardType(e.target.value as any)}
                      className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                    >
                      <option value="campaign">WhatsApp Campaign (Broadcast Blast)</option>
                      <option value="workflow">Interactive Workflow Execution</option>
                      <option value="ai_task">AI Agent Task Auto-pilot</option>
                      <option value="followup">CSAT Survey Follow-up</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-brand-navy dark:text-foreground select-none">
                      Target Reference Asset
                    </label>
                    <select
                      value={wizardTargetId}
                      onChange={(e) => {
                        setWizardTargetId(e.target.value);
                        setWizardTargetName(e.target.options[e.target.selectedIndex].text);
                      }}
                      className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                    >
                      <option value="camp-1">Shopify Welcome Promo Campaign</option>
                      <option value="wf-3">Abandoned Cart Recovery Workflow</option>
                      <option value="camp-9">Holiday Discount Campaign Blast</option>
                      <option value="sys-99">Stripe Payment Invoice Retry Alert</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: AUDIENCE SELECTION */}
              {wizardStep === 2 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-brand-navy dark:text-foreground select-none">
                      Destination CRM Segment
                    </label>
                    <select
                      value={wizardSegmentName}
                      onChange={(e) => setWizardSegmentName(e.target.value)}
                      className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                    >
                      <option value="All Opted-In Users">All Opted-In Users Segment (12,500 contacts)</option>
                      <option value="Shopify New Leads">Shopify New Leads Segment (2,450 contacts)</option>
                      <option value="Abandoned Carts 1Hr">Abandoned Carts 1Hr Segment (850 contacts)</option>
                      <option value="Failed Invoices List">Failed Invoices List (12 contacts)</option>
                    </select>
                  </div>

                  <Input
                    label="Audience Count Size (Estimated)"
                    type="number"
                    value={wizardAudienceSize}
                    onChange={(e) => setWizardAudienceSize(Number(e.target.value))}
                    required
                  />

                  <div className="p-3 bg-brand-slate/40 dark:bg-zinc-900/30 border border-brand-border dark:border-border/30 rounded-xl">
                    <span className="text-[10px] text-muted-foreground leading-normal block">
                      CRM filters will run dynamically at execution time. Exclude lists and blacklist conditions apply.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 3: SCHEDULE CONFIGURATION */}
              {wizardStep === 3 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Scheduled Date"
                      type="date"
                      value={wizardDate}
                      onChange={(e) => setWizardDate(e.target.value)}
                      required
                    />
                    <Input
                      label="Scheduled Time"
                      type="time"
                      value={wizardTime}
                      onChange={(e) => setWizardTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-brand-navy dark:text-foreground select-none">
                      Recurrence Repeat Pattern
                    </label>
                    <select
                      value={wizardRecurrence}
                      onChange={(e) => setWizardRecurrence(e.target.value as any)}
                      className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                    >
                      <option value="none">Once (No Repeat)</option>
                      <option value="daily">Daily Loop</option>
                      <option value="weekly">Weekly Loop</option>
                      <option value="monthly">Monthly Loop</option>
                      <option value="custom_cron">Custom Cron Pattern Expression</option>
                    </select>
                  </div>

                  {wizardRecurrence === "custom_cron" && (
                    <Input
                      label="Cron Expression"
                      value={wizardCron}
                      onChange={(e) => setWizardCron(e.target.value)}
                      required
                    />
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-brand-navy dark:text-foreground select-none">
                      Priority Level
                    </label>
                    <select
                      value={wizardPriority}
                      onChange={(e) => setWizardPriority(e.target.value as any)}
                      className="w-full h-10 border rounded-lg text-sm bg-white dark:bg-zinc-900 border-brand-border dark:border-border p-2 text-brand-navy dark:text-zinc-200 outline-none cursor-pointer"
                    >
                      <option value="low">Low priority (system notifications)</option>
                      <option value="medium">Medium priority (default marketing)</option>
                      <option value="high">High priority (billing templates)</option>
                      <option value="critical">Critical priority (OTP / 2FA)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: PREVIEW CONFIRMATION */}
              {wizardStep === 4 && (
                <div className="flex flex-col gap-3 animate-fadeIn">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase select-none pb-2 border-b border-brand-border dark:border-border/30">
                    Verify Schedule Summary Details
                  </span>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold">Title:</span>
                      <span className="font-bold text-foreground">{wizardTitle}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold">Run Type:</span>
                      <span className="font-bold text-foreground capitalize">{wizardType}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold">Target Asset:</span>
                      <span className="font-bold text-foreground">{wizardTargetName}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold">Destination:</span>
                      <span className="font-bold text-foreground">{wizardSegmentName} ({wizardAudienceSize} contacts)</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold">Fire Date/Time:</span>
                      <span className="font-mono font-bold text-brand-green">{wizardDate} at {wizardTime} ({timezone})</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold">Recurrence:</span>
                      <span className="font-bold text-foreground capitalize">{wizardRecurrence}</span>
                    </div>
                  </div>

                  {/* Conflict Checker Pre-Execution Warning */}
                  {Number(wizardAudienceSize) > 15000 && (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-500 text-[10px] leading-relaxed rounded-xl mt-2 select-text">
                      <span className="font-bold block uppercase text-[8px] mb-1">Pre-execution Rate Warning</span>
                      Exceeds WABA tier send threshold. Deliveries may fail.
                    </div>
                  )}

                  {wizardTime && (Number(wizardTime.split(":")[0]) < 8 || Number(wizardTime.split(":")[0]) >= 20) && (
                    <div className="p-3 bg-amber-950/20 border border-amber-500/20 text-amber-500 text-[10px] leading-relaxed rounded-xl mt-2 select-text">
                      <span className="font-bold block uppercase text-[8px] mb-1">Off-Hours Warning</span>
                      Fire hour falls outside business hours range.
                    </div>
                  )}

                </div>
              )}

              {/* Wizard Steps Navigators */}
              <div className="flex items-center justify-between border-t border-brand-border dark:border-border/30 pt-3">
                {wizardStep > 1 ? (
                  <Button variant="outline" size="sm" type="button" onClick={() => setWizardStep(prev => prev - 1)}>
                    Previous Step
                  </Button>
                ) : (
                  <div />
                )}

                {wizardStep < 4 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1 && !wizardTitle.trim()) {
                        addToast("Please fill in scheduler title", "warning");
                        return;
                      }
                      if (wizardStep === 3 && (!wizardDate || !wizardTime)) {
                        addToast("Please fill in scheduling date and target time", "warning");
                        return;
                      }
                      setWizardStep(prev => prev + 1);
                    }}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button variant="success" size="sm" type="submit">
                    Schedule Task
                  </Button>
                )}
              </div>

            </form>
          </Card>
        </div>
      )}

      {/* MODAL C: IMPORT JSON MODULE */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-left">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-4 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-brand-border dark:border-border/30 pb-3">
              <div className="flex items-center gap-1.5">
                <Upload className="h-4.5 w-4.5 text-brand-green" />
                <h3 className="text-xs font-extrabold text-brand-navy dark:text-foreground uppercase tracking-wide">
                  Import Schedule JSON Configurations
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-muted-foreground hover:text-brand-navy dark:hover:text-foreground text-xs cursor-pointer font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleImportJsonSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-navy dark:text-foreground select-none">
                  JSON Config Payloads
                </label>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder={`[\n  {\n    "title": "Imported Campaign Promo",\n    "description": "JSON Import Test",\n    "type": "campaign",\n    "targetId": "camp-99",\n    "targetName": "Import Blast",\n    "scheduledTime": "${new Date().toISOString()}",\n    "timezone": "Asia/Kolkata",\n    "priority": "high",\n    "audienceSize": 2000,\n    "segmentName": "All Users"\n  }\n]`}
                  required
                  className="w-full min-h-[160px] max-h-[220px] p-3 text-[10px] font-mono border rounded-lg bg-white dark:bg-zinc-900 border-brand-border dark:border-border dark:text-foreground focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 transition-all text-brand-navy"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-brand-border dark:border-border/30 pt-3">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowImportModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={!importJsonText.trim()}>
                  Import Configuration
                </Button>
              </div>

            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
