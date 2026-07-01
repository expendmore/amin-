"use client";

import React, { useState } from "react";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import GoogleAccountCard from "@/components/google/GoogleAccountCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Plus, UserPlus, Info, Check, ShieldAlert } from "lucide-react";

export default function GoogleAccountsPage() {
  const { addToast } = useToast();
  const {
    accounts,
    activeAccountId,
    connectAccount,
    disconnectAccount,
    switchAccount,
    refreshToken
  } = useGoogleWorkspace();

  // Create workspace dialog form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !nameInput) {
      addToast("Please fill in both email and name fields", "error");
      return;
      
    }
    if (!emailInput.includes("@")) {
      addToast("Please enter a valid email address", "error");
      return;
    }

    connectAccount(emailInput, nameInput);
    addToast(`Successfully hooked up Google account: ${emailInput}`, "success");
    setEmailInput("");
    setNameInput("");
    setShowAddModal(false);
  };

  const handleDisconnect = (id: string) => {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;
    disconnectAccount(id);
    addToast(`Successfully disconnected Google account: ${acc.email}`, "warning");
  };

  const handleSwitch = (id: string) => {
    switchAccount(id);
    const acc = accounts.find(a => a.id === id);
    if (acc) {
      addToast(`Switched active workspace to ${acc.email}`, "success");
    }
  };

  const handleReconnect = (id: string) => {
    // Refresh scopes
    refreshToken(id, "gmail");
    addToast("Successfully refreshed OAuth tokens. Sync back online.", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex items-center justify-between border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Google Account Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Connect multiple Google accounts, audit permission scopes, and switch active environments.
          </p>
        </div>
        <Button
          variant="success"
          size="sm"
          className="font-bold font-sans"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="h-4 w-4 text-white" />}
        >
          Add Account
        </Button>
      </div>

      {/* Warning/Status Banner if any account has issues */}
      {accounts.some(a => a.status === "permission_error" || a.status === "expired") && (
        <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 flex gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">
              Re-authorization Required
            </h4>
            <p className="text-[11px] text-amber-700 dark:text-amber-500 font-medium leading-relaxed">
              One or more connected Google workspaces have expired OAuth refresh signatures. Tap Reconnect on the affected card to renew.
            </p>
          </div>
        </div>
      )}

      {/* Accounts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <GoogleAccountCard
            key={acc.id}
            account={acc}
            onDisconnect={handleDisconnect}
            onSwitch={handleSwitch}
            onReconnect={handleReconnect}
          />
        ))}

        {/* Empty state connector card */}
        <Card
          className="p-5 border-2 border-dashed border-brand-border dark:border-zinc-800 hover:border-brand-navy/60 hover:bg-white dark:hover:bg-zinc-950/60 transition-all duration-200 flex flex-col items-center justify-center text-center gap-3.5 min-h-[300px]"
          onClick={() => setShowAddModal(true)}
        >
          <div className="w-12 h-12 rounded-full bg-brand-slate dark:bg-zinc-900 border border-brand-border flex items-center justify-center text-on-surface-variant">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Add Google Workspace
            </h4>
            <p className="text-[11px] text-on-surface-variant/80 max-w-[200px] mt-1 font-semibold leading-relaxed">
              Connect additional organization or personal Google credentials.
            </p>
          </div>
          <Button variant="outline" size="sm" className="font-bold text-[11px]">
            Connect Account
          </Button>
        </Card>
      </div>

      {/* Connect Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex flex-col gap-0.5 text-left">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                Authorize Google Workspace Account
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                ExpendMore uses secure OAuth 2.0 signatures. No passwords will be stored.
              </p>
            </div>

            <form onSubmit={handleConnect} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Full Name / Display Name
                </label>
                <Input
                  placeholder="e.g. Sales Shared Mailbox"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Google Email Address
                </label>
                <Input
                  type="email"
                  placeholder="e.g. sales@mycompany.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>

              <div className="p-3.5 bg-brand-slate dark:bg-zinc-900 rounded-lg border border-brand-border/60 flex gap-2.5">
                <Info className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
                <span className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                  Upon authorization, default integration templates for Gmail auto-replies, Drive storage indexing, and Calendar scheduling will be generated automatically.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3.5 border-t border-brand-border dark:border-zinc-800/80 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
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
                  Proceed to Google
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
