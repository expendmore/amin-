"use client";

import React, { useMemo, useState } from "react";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import {
  Video,
  Plus,
  Clock,
  Users,
  VideoOff,
  Link as LinkIcon,
  Play,
  History
} from "lucide-react";

export default function GoogleMeetPage() {
  const { addToast } = useToast();
  const {
    meetings,
    scheduleMeeting
  } = useGoogleWorkspace();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [attendees, setAttendees] = useState("");

  const activeMeetings = useMemo(() => {
    return meetings.filter(m => m.status === "upcoming" || m.status === "live");
  }, [meetings]);

  const historyMeetings = useMemo(() => {
    return meetings.filter(m => m.status === "ended" || m.status === "cancelled");
  }, [meetings]);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !start || !end) {
      addToast("Please fill in meeting title, start time and end time.", "error");
      return;
    }

    const attendeeList = attendees
      ? attendees.split(",").map(e => e.trim()).filter(Boolean)
      : [];

    const duration = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (60 * 1000));

    scheduleMeeting({
      title,
      startTime: new Date(start).toISOString(),
      endTime: new Date(end).toISOString(),
      duration,
      hostEmail: "ceo@anshumanenterprises1119.in",
      attendees: attendeeList
    });

    addToast(`Successfully scheduled Google Meet: ${title}`, "success");
    setTitle("");
    setStart("");
    setEnd("");
    setAttendees("");
    setShowScheduleModal(false);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Google Meet Integration
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Schedule video conferences, generate dynamic meet links, and audit recording archive logs.
          </p>
        </div>

        <Button
          variant="success"
          size="sm"
          onClick={() => setShowScheduleModal(true)}
          className="font-bold shrink-0"
          leftIcon={<Plus className="h-4 w-4 text-white" />}
        >
          Schedule Video Conference
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Conferences Index */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
            Upcoming & Live Conferences
          </span>

          {activeMeetings.length > 0 ? (
            <div className="flex flex-col gap-3">
              {activeMeetings.map((meet) => {
                const startDt = new Date(meet.startTime);
                return (
                  <Card key={meet.id} className="p-4 border-brand-border bg-white dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-brand-green flex items-center justify-center shrink-0">
                        <Video className="h-5.5 w-5.5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h4 className="font-bold text-xs text-brand-navy dark:text-foreground">
                          {meet.title}
                        </h4>
                        <span className="text-[10px] text-on-surface-variant/80 font-semibold flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {startDt.toLocaleString()} ({meet.duration} minutes)
                        </span>
                        {meet.attendees.length > 0 && (
                          <span className="text-[10px] text-on-surface-variant/60 font-semibold flex items-center gap-1 mt-0.5">
                            <Users className="h-3.5 w-3.5" />
                            {meet.attendees.length} participants
                          </span>
                        )}
                      </div>
                    </div>

                    <a
                      href={meet.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0"
                    >
                      <Button variant="success" size="xs" className="font-bold text-[10px]" leftIcon={<Play className="h-3.5 w-3.5 fill-white text-white" />}>
                        Join Conference
                      </Button>
                    </a>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col items-center justify-center text-center gap-3">
              <VideoOff className="h-10 w-10 text-on-surface-variant/40" />
              <span className="text-xs text-on-surface-variant/80 font-semibold">
                No active video conferences scheduled.
              </span>
            </Card>
          )}
        </div>

        {/* History / Recordings list */}
        <Card className="p-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
            Meeting History & Recordings
          </span>

          <div className="flex flex-col gap-3.5 max-h-[350px] overflow-y-auto divide-y divide-brand-border dark:divide-zinc-800">
            {historyMeetings.length > 0 ? (
              historyMeetings.map((meet) => (
                <div key={meet.id} className="pt-3.5 first:pt-0 flex flex-col gap-1 text-left">
                  <h4 className="font-bold text-xs text-brand-navy dark:text-foreground">
                    {meet.title}
                  </h4>
                  <span className="text-[9px] font-semibold text-on-surface-variant/60">
                    Host: {meet.hostEmail} • {new Date(meet.startTime).toLocaleDateString()}
                  </span>
                  {meet.recordingUrl && (
                    <a
                      href={meet.recordingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[9px] text-brand-sky font-bold flex items-center gap-1 hover:underline w-fit mt-1"
                    >
                      <History className="h-3.5 w-3.5" />
                      Watch Recording
                    </a>
                  )}
                </div>
              ))
            ) : (
              <span className="text-xs text-on-surface-variant py-4 text-center">
                No meetings history logs.
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex flex-col gap-0.5 text-left border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                Schedule Google Meet Conference
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                Set up a video room and email access tokens automatically to selected invitees list.
              </p>
            </div>

            <form onSubmit={handleSchedule} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Conference Title
                </label>
                <Input
                  placeholder="e.g. Sales Consultation Sync"
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
                  Invite Attendees (Emails list, comma split)
                </label>
                <Input
                  placeholder="e.g. support@company.com"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3.5 border-t border-brand-border dark:border-zinc-800/80 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScheduleModal(false)}
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
                  Create Meet Room
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
