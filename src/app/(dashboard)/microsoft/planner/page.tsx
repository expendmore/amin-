"use client";

import React, { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CheckSquare, Search } from "lucide-react";

export default function PlannerPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const tasks = [
    { id: "pl-1", title: "Complete layout check on Microsoft Outlook pages", progress: 100, bucket: "Sprint Core" },
    { id: "pl-2", title: "Add Microsoft Teams webhook notification handlers", progress: 60, bucket: "Sprint Core" },
    { id: "pl-3", title: "Test Excel Online cell matrices row appender", progress: 0, bucket: "QA Sprint" }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Planner Board Integration
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review Microsoft Planner boards, bucket parameters, and track task percentages progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
        {/* Task lists */}
        <Card className="lg:col-span-12 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block text-left">
            Sprint Board Tasks
          </span>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left">
                <div className="flex items-start gap-3">
                  <CheckSquare className={`h-5 w-5 shrink-0 ${task.progress === 100 ? "text-brand-green" : "text-brand-sky"}`} />
                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-bold text-xs text-brand-navy dark:text-foreground">
                      {task.title}
                    </h4>
                    <span className="text-[9px] bg-brand-sky-light/80 text-brand-sky px-2 py-0.5 rounded-full font-bold w-fit mt-1">
                      {task.bucket}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-on-surface-variant/80 font-bold">
                      Progress: {task.progress}%
                    </span>
                    <div className="w-24 bg-brand-slate h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-brand-sky rounded-full" style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
