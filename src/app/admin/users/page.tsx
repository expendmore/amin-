"use client";

import React from "react";
import { useAdmin } from "@/store/use-admin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { Users, LogOut } from "lucide-react";

export default function UserSessionsPage() {
  const { addToast } = useToast();
  const { users, revokeUserSession } = useAdmin();

  const handleRevoke = (id: string, name: string) => {
    revokeUserSession(id);
    addToast(`Revoked all active sessions for "${name}" successfully`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            User Sessions & Directory
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Inspect verified platform users directory, audit devices logins, and revoke credentials sessions.
          </p>
        </div>
      </div>

      {/* Users list */}
      <Card className="p-0 border-brand-border bg-white dark:bg-zinc-950 overflow-hidden text-left font-sans">
        <div className="divide-y divide-brand-border">
          {users.map((u) => (
            <div key={u.id} className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                    {u.name}
                  </span>
                  <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 text-on-surface-variant/85 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                    {u.role}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                  Email: {u.email} • Status: {u.status} • Active Sessions: {u.activeSessionsCount}
                </span>
                <span className="text-[9px] text-on-surface-variant/60 font-semibold truncate mt-0.5">
                  Devices: {u.deviceTypes.join(", ")}
                </span>
              </div>

              {u.activeSessionsCount > 0 && (
                <Button
                  onClick={() => handleRevoke(u.id, u.name)}
                  variant="outline"
                  size="xs"
                  className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0"
                  leftIcon={<LogOut className="h-3.5 w-3.5" />}
                >
                  Revoke Sessions
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
