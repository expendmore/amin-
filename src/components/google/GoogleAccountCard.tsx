import React from "react";
import { GoogleAccount } from "@/types/google-workspace";
import Card from "@/components/ui/Card";
import GoogleStatusBadge from "./GoogleStatusBadge";
import Button from "@/components/ui/Button";
import { Power, Check, RefreshCw, HardDrive } from "lucide-react";

interface GoogleAccountCardProps {
  account: GoogleAccount;
  onDisconnect: (id: string) => void;
  onSwitch: (id: string) => void;
  onReconnect: (id: string) => void;
}

export function GoogleAccountCard({
  account,
  onDisconnect,
  onSwitch,
  onReconnect
}: GoogleAccountCardProps) {
  const isSelected = account.isActive;
  const isErr = account.status === "permission_error" || account.status === "expired";
  const storagePct = Math.round((account.storageUsedGB / account.storageTotalGB) * 100);

  return (
    <Card
      className={`p-5 transition-all duration-200 border-2 ${
        isSelected
          ? "border-brand-navy shadow-md ring-2 ring-brand-navy/5"
          : "border-brand-border dark:border-zinc-800 hover:border-brand-navy/60"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={account.avatarUrl}
            alt={account.displayName}
            className="w-12 h-12 rounded-full border border-brand-border shrink-0 object-cover"
          />
          <div>
            <h3 className="font-semibold text-brand-navy dark:text-foreground text-sm flex items-center gap-1.5 leading-snug">
              {account.displayName}
              {account.isPrimary && (
                <span className="text-[10px] font-bold bg-brand-sky-light/80 text-brand-sky px-2 py-0.5 rounded-full select-none">
                  Primary
                </span>
              )}
            </h3>
            <p className="text-xs text-on-surface-variant/80 font-medium">{account.email}</p>
          </div>
        </div>

        <GoogleStatusBadge status={account.status} />
      </div>

      {/* Storage Indicator */}
      <div className="mt-4 pt-4 border-t border-brand-border dark:border-zinc-800/50 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant">
          <span className="flex items-center gap-1">
            <HardDrive className="h-3.5 w-3.5" />
            Storage Usage
          </span>
          <span>
            {account.storageUsedGB.toFixed(1)} / {account.storageTotalGB.toFixed(1)} GB ({storagePct}%)
          </span>
        </div>
        <div className="w-full bg-brand-slate dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              storagePct > 85 ? "bg-error" : "bg-brand-sky"
            }`}
            style={{ width: `${storagePct}%` }}
          />
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-left py-2 px-3 bg-brand-slate dark:bg-zinc-900/60 rounded-lg border border-brand-border/40 dark:border-zinc-800/40 text-[11px] font-medium text-on-surface-variant/80">
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-on-surface-variant/50 font-bold mb-0.5">
            Connected
          </span>
          <span className="font-semibold text-brand-navy dark:text-foreground">
            {new Date(account.connectedAt).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-on-surface-variant/50 font-bold mb-0.5">
            Health Score
          </span>
          <span className={`font-bold ${account.healthScore > 80 ? "text-emerald-600" : "text-amber-600"}`}>
            {account.healthScore}%
          </span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-brand-border dark:border-zinc-800/50 pt-4">
        {isSelected ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-green">
            <Check className="h-4 w-4" />
            <span>Active Workspace</span>
          </div>
        ) : (
          <Button
            variant="outline"
            size="xs"
            onClick={() => onSwitch(account.id)}
            disabled={isErr}
            className="text-[11px] font-bold"
          >
            Use Workspace
          </Button>
        )}

        <div className="flex items-center gap-2">
          {isErr && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => onReconnect(account.id)}
              className="text-[11px] border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              leftIcon={<RefreshCw className="h-3 w-3" />}
            >
              Reconnect
            </Button>
          )}

          <Button
            variant="ghost"
            size="xs"
            onClick={() => onDisconnect(account.id)}
            className="text-[11px] text-error hover:bg-red-50 dark:hover:bg-red-950/20 font-bold"
            leftIcon={<Power className="h-3 w-3" />}
          >
            Disconnect
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default GoogleAccountCard;
