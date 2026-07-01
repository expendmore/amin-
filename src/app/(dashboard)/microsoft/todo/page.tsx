"use client";

import React, { useMemo, useState } from "react";
import { useMicrosoft365 } from "@/store/use-microsoft-365";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import {
  ListTodo,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Flag
} from "lucide-react";

export default function ToDoPage() {
  const { addToast } = useToast();
  const {
    todoTasks,
    createToDoTask,
    toggleToDoCompleted
  } = useMicrosoft365();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [importance, setImportance] = useState<"low" | "normal" | "high">("normal");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    createToDoTask(newTaskTitle.trim(), importance);
    addToast("Created To Do task successfully", "success");
    setNewTaskTitle("");
  };

  const activeTasks = useMemo(() => {
    return todoTasks.filter(t => t.status === "notStarted");
  }, [todoTasks]);

  const completedTasks = useMemo(() => {
    return todoTasks.filter(t => t.status === "completed");
  }, [todoTasks]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Microsoft To Do Integration
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Manage your personal task checklists, configure priorities thresholds, and check item status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Task Form */}
        <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left h-fit">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Add New Task
          </h3>

          <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/75">
                Task Title
              </label>
              <Input
                placeholder="e.g. Verify Outlook mailbox sync parameters"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/75">
                Importance Level
              </label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value as any)}
                className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="low">Low Importance</option>
                <option value="normal">Normal Importance</option>
                <option value="high">High Importance</option>
              </select>
            </div>

            <Button type="submit" variant="success" size="sm" className="font-bold text-white mt-2" leftIcon={<Plus className="h-4 w-4" />}>
              Create Task
            </Button>
          </form>
        </Card>

        {/* Task lists timeline */}
        <div className="lg:col-span-2 flex flex-col gap-5 text-left">
          {/* Uncompleted tasks */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
              Pending Tasks ({activeTasks.length})
            </span>

            {activeTasks.length > 0 ? (
              <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
                {activeTasks.map((tsk) => (
                  <div key={tsk.id} className="p-3.5 bg-white dark:bg-zinc-900/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => {
                          toggleToDoCompleted(tsk.id);
                          addToast("Task marked completed", "success");
                        }}
                        className="h-4 w-4 rounded border-brand-border text-brand-navy focus:ring-brand-navy cursor-pointer"
                      />
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                        {tsk.title}
                      </span>
                    </div>

                    {tsk.importance === "high" && (
                      <span className="text-[9px] bg-red-50 text-error border border-red-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 shrink-0">
                        <Flag className="h-3 w-3" />
                        High
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-on-surface-variant/60 font-semibold p-4 text-center border border-dashed border-brand-border rounded-xl block bg-white">
                No active tasks listed.
              </span>
            )}
          </div>

          {/* Completed tasks */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
              Completed Tasks ({completedTasks.length})
            </span>

            <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden opacity-75">
              {completedTasks.map((tsk) => (
                <div key={tsk.id} className="p-3.5 bg-brand-slate/40 dark:bg-zinc-900/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {
                        toggleToDoCompleted(tsk.id);
                        addToast("Task returned to pending state.", "info");
                      }}
                      className="h-4 w-4 rounded border-brand-border text-brand-navy focus:ring-brand-navy cursor-pointer"
                    />
                    <span className="text-xs font-bold text-on-surface-variant line-through">
                      {tsk.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
