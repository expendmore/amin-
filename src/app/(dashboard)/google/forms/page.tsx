"use client";

import React, { useMemo, useState } from "react";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/store/use-toast";
import {
  ClipboardList,
  Search,
  Users,
  CheckCircle,
  FileSpreadsheet,
  Settings,
  Activity,
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function GoogleFormsPage() {
  const { addToast } = useToast();
  const {
    forms,
    toggleFormsAcceptance
  } = useGoogleWorkspace();

  const [selectedFormId, setSelectedFormId] = useState<string | null>("frm-1");
  const [searchQuery, setSearchQuery] = useState("");

  const activeForm = useMemo(() => {
    return forms.find(f => f.id === selectedFormId) || null;
  }, [forms, selectedFormId]);

  const filteredForms = useMemo(() => {
    return forms.filter(f =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [forms, searchQuery]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Google Forms & Surveys Analytics
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Track user questionnaire submissions, aggregate feedback datasets, and toggle responses acceptance triggers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Forms Selector list */}
        <Card className="lg:col-span-4 p-4 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col gap-4">
          <h3 className="font-bold text-xs text-brand-navy dark:text-foreground uppercase tracking-wider">
            Surveys & Questionnaires
          </h3>

          <div className="flex flex-col gap-2.5">
            {filteredForms.map((frm) => {
              const isSelected = frm.id === selectedFormId;
              return (
                <div
                  key={frm.id}
                  onClick={() => setSelectedFormId(frm.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? "border-brand-navy bg-brand-slate/60 dark:border-white dark:bg-zinc-900/60"
                      : "border-brand-border dark:border-zinc-800 hover:border-brand-navy/60 bg-white dark:bg-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ClipboardList className="h-5 w-5 text-purple-600 shrink-0" />
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                        {frm.title}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/80 font-semibold truncate">
                        {frm.responseCount} submissions tracked
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-on-surface-variant/60" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Responses & Analytics inspector */}
        <Card className="lg:col-span-8 p-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col gap-5 overflow-hidden">
          {activeForm ? (
            <div className="flex flex-col gap-5 h-full overflow-hidden">
              {/* Form title header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
                <div className="flex flex-col gap-0.5 text-left">
                  <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground leading-snug">
                    {activeForm.title}
                  </h3>
                  <a
                    href={activeForm.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-brand-sky font-bold hover:underline"
                  >
                    Open Form editor in Workspace
                  </a>
                </div>

                {/* Acceptance toggle */}
                <div className="flex items-center gap-2.5 shrink-0 bg-brand-slate dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-brand-border/60">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    Accept Responses
                  </span>
                  <Toggle
                    checked={activeForm.isAcceptingResponses}
                    onChange={() => {
                      toggleFormsAcceptance(activeForm.id);
                      addToast("Toggled Google Forms responses state", "info");
                    }}
                  />
                </div>
              </div>

              {/* Analytics summary box */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-brand-slate dark:bg-zinc-900/60 rounded-xl border border-brand-border/40 text-left">
                  <span className="text-[9px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
                    Total Responses
                  </span>
                  <span className="block text-lg font-extrabold text-brand-navy dark:text-foreground mt-0.5">
                    {activeForm.responseCount}
                  </span>
                </div>
                <div className="p-3 bg-brand-slate dark:bg-zinc-900/60 rounded-xl border border-brand-border/40 text-left">
                  <span className="text-[9px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
                    Fields Checked
                  </span>
                  <span className="block text-lg font-extrabold text-brand-navy dark:text-foreground mt-0.5">
                    {activeForm.fields.length} questions
                  </span>
                </div>
                <div className="p-3 bg-brand-slate dark:bg-zinc-900/60 rounded-xl border border-brand-border/40 text-left">
                  <span className="text-[9px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
                    Completeness Rate
                  </span>
                  <span className="block text-lg font-extrabold text-brand-green mt-0.5">
                    100%
                  </span>
                </div>
              </div>

              {/* Responses timeline */}
              <div className="flex flex-col gap-2.5 text-left flex-1 overflow-hidden">
                <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                  Submissions Feed (Live webhooks hook)
                </span>

                <div className="border border-brand-border dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-brand-border dark:divide-zinc-800 flex-1 overflow-y-auto max-h-[220px]">
                  {activeForm.responses.map((resp) => (
                    <div key={resp.id} className="p-3.5 bg-white dark:bg-zinc-900/10 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-brand-navy dark:text-foreground truncate">
                          Respondent: {resp.respondentEmail || "Anonymous User"}
                        </span>
                        <span className="text-on-surface-variant/60 font-semibold shrink-0">
                          {new Date(resp.submittedAt).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Answers key-value grids */}
                      <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-brand-border">
                        {Object.keys(resp.answers).map((qId) => {
                          const questionText = activeForm.fields.find(f => f.id === qId)?.question || "Question";
                          const ans = resp.answers[qId];
                          return (
                            <div key={qId} className="text-[11px]">
                              <span className="text-on-surface-variant/70 font-semibold block">{questionText}</span>
                              <strong className="text-brand-navy dark:text-foreground font-bold mt-0.5 block">{Array.isArray(ans) ? ans.join(", ") : ans}</strong>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-2">
              <ClipboardList className="h-10 w-10 text-on-surface-variant/40" />
              <span className="text-xs text-on-surface-variant/80 font-semibold">
                Select a questionnaire survey on the left
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
