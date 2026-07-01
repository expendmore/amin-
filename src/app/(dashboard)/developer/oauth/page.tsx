"use client";

import React, { useState } from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Link2, Plus, Trash2 } from "lucide-react";

export default function OAuthApplicationsPage() {
  const { addToast } = useToast();
  const { apps, addApp, deleteApp } = useDeveloper();

  const [name, setName] = useState("");
  const [redirect, setRedirect] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !redirect.trim()) return;

    addApp(name.trim(), [redirect.trim()], ["mail.read", "chat.write"]);
    addToast(`OAuth Application "${name}" registered successfully.`, "success");
    setName("");
    setRedirect("");
  };

  const handleDelete = (id: string, appName: string) => {
    deleteApp(id);
    addToast(`Application "${appName}" deleted from registry.`, "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            OAuth Applications Registry
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Register custom integrations client keys, manage redirect callback URIs, and assign permissions scopes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apps list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <Link2 className="h-4.5 w-4.5 text-brand-sky" />
            Registered OAuth Apps
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {apps.map((a) => (
              <div
                key={a.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {a.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-mono truncate">
                    Client ID: {a.clientId}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/70 font-semibold block mt-0.5">
                    Redirect URI: {a.redirectUris.join(", ")}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(a.id, a.name)}
                  title="Delete Application"
                  className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer shrink-0 animate-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Add App Form */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Register OAuth Application
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Application Name
                </label>
                <Input
                  placeholder="e.g. ExpendMore Slack Connector"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Redirect Callback URI
                </label>
                <Input
                  placeholder="e.g. https://your-domain.com/callback"
                  value={redirect}
                  onChange={(e) => setRedirect(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full animate-none" leftIcon={<Plus className="h-4 w-4 text-white" />}>
                Register Client App
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
