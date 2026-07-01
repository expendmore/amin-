"use client";

import React, { useState } from "react";
import { useDevops } from "@/store/use-devops";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Compass, Play, RefreshCw } from "lucide-react";

export default function DeploymentCenterPage() {
  const { addToast } = useToast();
  const { deployments, triggerDeployment, triggerRollback } = useDevops();

  const [version, setVersion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!version.trim()) return;

    triggerDeployment(version.trim());
    addToast(`Triggered deploy run for version v${version}. Initializing docker clusters...`, "success");
    setVersion("");
  };

  const handleRollback = (id: string, ver: string) => {
    triggerRollback(id);
    addToast(`Initiated rollback to deployment v${ver}. Reverting DNS pointer routes...`, "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Deployment Center
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Trigger custom version dispatches, monitor deployment queues build logs, and restore baseline versions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployments list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Compass className="h-4.5 w-4.5 text-brand-sky" />
            Deployment History Logs
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {deployments.map((it) => (
              <div
                key={it.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5 font-mono">
                    Build: {it.version} (Commit: {it.commitHash})
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold font-sans">
                    Date: {new Date(it.createdTime).toLocaleString()} • Duration: {it.durationMs ? `${it.durationMs/1000}s` : "Pending"}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] border px-1.5 py-0.5 rounded font-bold uppercase ${
                    it.status === "success" ? "bg-emerald-50 text-brand-green border-emerald-200" : "bg-red-50 text-error border-red-200"
                  }`}>
                    {it.status}
                  </span>

                  {it.status === "success" && (
                    <Button
                      onClick={() => handleRollback(it.id, it.version)}
                      variant="outline"
                      size="xs"
                      className="font-bold border-red-200 text-error hover:bg-red-55/10 shrink-0 animate-none"
                      leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                    >
                      Rollback
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Deploy form */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Trigger version deploy
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Target Version Tag
                </label>
                <Input
                  placeholder="e.g. 1.2.1-hotfix"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full animate-none" leftIcon={<Play className="h-4 w-4 text-white" />}>
                Start Deploy Build
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
