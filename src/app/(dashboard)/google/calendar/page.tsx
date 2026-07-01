"use client";

import React, { useMemo, useState } from "react";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/store/use-toast";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Video,
  Plus,
  ChevronLeft,
  ChevronRight,
  Globe,
  Settings,
  Trash2,
  CalendarCheck
} from "lucide-react";

export default function GoogleCalendarPage() {
  const { addToast } = useToast();
  const {
    activeAccountId,
    accounts,
    calendarEvents,
    calendars,
    createEvent,
    deleteEvent
  } = useGoogleWorkspace();

  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">("agenda");
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("cal-primary");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  // Create Event Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState("");
  const [enableMeet, setEnableMeet] = useState(true);

  const activeAccObj = useMemo(() => {
    return accounts.find(a => a.id === activeAccountId) || null;
  }, [accounts, activeAccountId]);

  const currentEvents = useMemo(() => {
    const list = calendarEvents[activeAccountId] || [];
    return list.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [calendarEvents, activeAccountId]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !start || !end) {
      addToast("Please fill in event title, start time and end time.", "error");
      return;
    }

    const attendeeList = attendees
      ? attendees.split(",").map(email => email.trim()).filter(Boolean)
      : [];

    createEvent({
      title,
      description: desc,
      startTime: new Date(start).toISOString(),
      endTime: new Date(end).toISOString(),
      location,
      attendees: attendeeList,
      organizer: activeAccObj?.email || "owner@workspace.com",
      status: "confirmed",
      isAllDay: false,
      recurrence: "none",
      color: "#3B82F6",
      calendarId: selectedCalendarId,
      meetLink: enableMeet ? "https://meet.google.com/meet-auto-gen" : undefined
    });

    addToast(`Successfully scheduled event: ${title}`, "success");
    setTitle("");
    setDesc("");
    setStart("");
    setEnd("");
    setLocation("");
    setAttendees("");
    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Google Calendar Integration
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Schedule consulting appointments, configure timezone properties, and synchronize customer bookings automatically.
          </p>
        </div>
        <Button
          variant="success"
          size="sm"
          onClick={() => setShowCreateModal(true)}
          className="font-bold shrink-0"
          leftIcon={<Plus className="h-4 w-4 text-white" />}
        >
          Schedule Meeting
        </Button>
      </div>

      {/* Calendar Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 bg-brand-slate dark:bg-zinc-900/40 p-4 rounded-xl border border-brand-border/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-brand-border rounded-lg bg-white dark:bg-zinc-950 overflow-hidden">
            {(["agenda", "day", "week", "month"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-semibold capitalize select-none cursor-pointer border-r last:border-0 border-brand-border dark:border-zinc-800/80 transition-colors ${
                  viewMode === mode
                    ? "bg-brand-navy text-white dark:bg-white dark:text-brand-navy"
                    : "text-on-surface-variant hover:bg-brand-slate"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4 text-on-surface-variant shrink-0" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-brand-navy dark:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="Asia/Kolkata">Kolkata (IST)</option>
              <option value="UTC">Coordinated Universal (UTC)</option>
              <option value="America/New_York">New York (EST)</option>
            </select>
          </div>
        </div>

        {/* Calendar category filter */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider shrink-0">
            Calendars
          </span>
          <div className="flex flex-wrap gap-2">
            {calendars.map((cal) => (
              <button
                key={cal.id}
                onClick={() => setSelectedCalendarId(cal.id)}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 select-none transition-all ${
                  selectedCalendarId === cal.id
                    ? "border-brand-navy bg-brand-slate text-brand-navy dark:bg-zinc-800 dark:text-foreground"
                    : "border-brand-border bg-white text-on-surface-variant dark:bg-zinc-950 hover:border-brand-navy/60"
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cal.color }} />
                <span>{cal.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar view body */}
      {viewMode === "agenda" ? (
        <Card className="border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col divide-y divide-brand-border dark:divide-zinc-800">
          <div className="p-4 bg-brand-slate/40 dark:bg-zinc-900/20 flex items-center justify-between">
            <h3 className="font-bold text-xs text-brand-navy dark:text-foreground uppercase tracking-wider">
              Agenda Timeline
            </h3>
            <span className="text-[10px] font-semibold text-on-surface-variant/80">
              {currentEvents.length} scheduled events
            </span>
          </div>

          {currentEvents.length > 0 ? (
            currentEvents.map((evt) => {
              const startDt = new Date(evt.startTime);
              const endDt = new Date(evt.endTime);
              return (
                <div key={evt.id} className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left block time info */}
                  <div className="flex items-start gap-3.5 min-w-[200px] shrink-0 text-left">
                    <div className="w-10 h-10 rounded-lg border border-brand-border bg-brand-slate/60 dark:bg-zinc-900 flex flex-col items-center justify-center text-brand-navy dark:text-foreground font-sans">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant/60 leading-none">
                        {startDt.toLocaleString([], { month: "short" })}
                      </span>
                      <span className="text-sm font-extrabold leading-tight mt-0.5">
                        {startDt.getDate()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                        {startDt.toLocaleDateString([], { weekday: "long" })}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/80 font-medium flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5" />
                        {startDt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Middle block event details */}
                  <div className="flex-1 flex flex-col gap-1.5 text-left">
                    <h4 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: evt.color || "#3B82F6" }} />
                      {evt.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant font-medium max-w-2xl leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5 mt-1">
                      {evt.location && (
                        <span className="text-[10px] text-on-surface-variant font-semibold flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-on-surface-variant/80" />
                          {evt.location}
                        </span>
                      )}
                      {evt.attendees.length > 0 && (
                        <span className="text-[10px] text-on-surface-variant font-semibold flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-on-surface-variant/80" />
                          {evt.attendees.length} participants
                        </span>
                      )}
                      {evt.meetLink && (
                        <a
                          href={evt.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-brand-green font-bold flex items-center gap-1 hover:underline"
                        >
                          <Video className="h-3.5 w-3.5" />
                          Join Meet
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action triggers */}
                  <div className="flex items-center gap-2 shrink-0 md:self-center">
                    <button
                      onClick={() => {
                        deleteEvent(evt.id);
                        addToast("Event deleted", "warning");
                      }}
                      className="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-error flex items-center justify-center cursor-pointer border border-brand-border dark:border-zinc-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-xs text-on-surface-variant/80">
              No calendar events scheduled in this category.
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col items-center justify-center text-center gap-3 min-h-[300px]">
          <CalendarCheck className="h-12 w-12 text-on-surface-variant/40" />
          <div className="flex flex-col gap-0.5">
            <h4 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Detailed Grid View
            </h4>
            <p className="text-[11px] text-on-surface-variant/80 font-semibold max-w-[280px]">
              For custom month, week or day schedules matrices, switch to Agenda View or use the WhatsApp Calendar scheduler tool.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setViewMode("agenda")} className="font-bold text-[11px]">
            Return to Agenda View
          </Button>
        </Card>
      )}

      {/* Schedule Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex flex-col gap-0.5 text-left border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                Schedule Google Calendar Event
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                Create new consultation records or team sprints directly in the active calendar.
              </p>
            </div>

            <form onSubmit={handleCreateEvent} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Event Title
                </label>
                <Input
                  placeholder="e.g. ExpendMore API Handshake Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Start Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    End Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Location (Optional)
                </label>
                <Input
                  placeholder="e.g. Conference Room A or Skype ID"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Attendees (Comma separated emails)
                </label>
                <Input
                  placeholder="e.g. priya@company.com, rohan@design.com"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Description
                </label>
                <Textarea
                  placeholder="Details about the meeting agenda..."
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-brand-slate rounded-lg border border-brand-border/40">
                <input
                  type="checkbox"
                  id="google-meet"
                  checked={enableMeet}
                  onChange={(e) => setEnableMeet(e.target.checked)}
                  className="h-4 w-4 rounded border-brand-border text-brand-navy focus:ring-brand-navy"
                />
                <label htmlFor="google-meet" className="text-xs font-bold text-brand-navy cursor-pointer flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-brand-green" />
                  Generate Google Meet conference link
                </label>
              </div>

              <div className="flex items-center justify-end gap-3.5 border-t border-brand-border dark:border-zinc-800/80 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  size="sm"
                  className="font-bold"
                >
                  Schedule Event
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
