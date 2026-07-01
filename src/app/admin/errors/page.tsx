"use client";

import React, { useMemo } from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function ErrorCenterPage() {
  const { addToast } = useToast();
  const { errors, resolveError } = useAdmin();

  const activeErrors = useMemo(() => {
    return errors.filter(e => e.status === "unresolved");
  }, [errors]);

  const handleResolve = (id: string) => {
    resolveError(id);
    addToast("Exception logged status changed to resolved.", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Error Exception Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review server-side stacktraces, trace client-side crash errors, and resolve active exceptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exception lists */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Exceptions Stacktraces Logs
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {activeErrors.length > 0 ? (
              activeErrors.map((err) => (
                <div key={err.id} className="p-4 flex items-start justify-between gap-4 bg-white dark:bg-zinc-900/10">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="h-4.5 w-4.5 text-error shrink-0" />
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                        {err.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-medium font-mono bg-slate-50 dark:bg-zinc-900 p-2 rounded border border-brand-border/60 select-all block mt-1 overflow-x-auto">
                      {err.stacktrace}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/80 font-semibold block mt-1">
                      Affected User: {err.affectedUserEmail} • Logged: {new Date(err.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleResolve(err.id)}
                    variant="outline"
                    size="xs"
                    className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0"
                    leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                  >
                    Resolve
                  </Button>
                </div>
              ))
            ) : (
              <span className="text-xs text-on-surface-variant/80 p-8 text-center font-medium block">
                No active exceptions recorded. Platform systems are operating nominally.
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
