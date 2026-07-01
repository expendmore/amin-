"use client";

import React from "react";
import { useMonitoring } from "@/store/use-monitoring";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Flame, CheckCircle } from "lucide-react";

export default function IncidentCenterPage() {
  const { addToast } = useToast();
  const { incidents, acknowledgeIncident, resolveIncident } = useMonitoring();

  const handleAck = (id: string, title: string) => {
    acknowledgeIncident(id);
    addToast(`Incident "${title}" acknowledged. Ownership assigned.`, "success");
  };

  const handleResolve = (id: string, title: string) => {
    resolveIncident(id);
    addToast(`Incident "${title}" resolved. Root cause logged.`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Incident Command Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Acknowledge system alerts, evaluate active incident escalations timelines, and assign incident owners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Flame className="h-4.5 w-4.5 text-brand-sky" />
            Active Service Outages Incidents
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {incidents.map((it) => (
              <div
                key={it.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5">
                    {it.title}
                    <span className="text-[9px] bg-red-50 text-error border border-red-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 font-sans">
                      {it.severity}
                    </span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold mt-1">
                    Owner: {it.assignedTo} • Status: {it.status}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/70 font-semibold block mt-0.5 font-sans">
                    Opened: {new Date(it.createdTime).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {it.status === "active" && (
                    <Button
                      onClick={() => handleAck(it.id, it.title)}
                      variant="outline"
                      size="xs"
                      className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
                    >
                      Acknowledge
                    </Button>
                  )}

                  {it.status !== "resolved" && (
                    <Button
                      onClick={() => handleResolve(it.id, it.title)}
                      variant="success"
                      size="xs"
                      className="font-bold text-white shrink-0 animate-none"
                      leftIcon={<CheckCircle className="h-3.5 w-3.5 text-white" />}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
