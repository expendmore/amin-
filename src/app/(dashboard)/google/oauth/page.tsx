"use client";

import React, { useMemo, useState } from "react";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import GoogleStatusBadge from "@/components/google/GoogleStatusBadge";
import { useToast } from "@/store/use-toast";
import { ShieldCheck, RefreshCw, Key, Info, HelpCircle } from "lucide-react";

export default function GoogleOAuthManager() {
  const { addToast } = useToast();
  const {
    accounts,
    activeAccountId,
    tokens,
    refreshToken
  } = useGoogleWorkspace();

  const [isRotating, setIsRotating] = useState(false);

  const activeAccount = useMemo(() => {
    return accounts.find(a => a.id === activeAccountId) || null;
  }, [accounts, activeAccountId]);

  const activeToken = useMemo(() => {
    return tokens.find(t => t.accountId === activeAccountId) || null;
  }, [tokens, activeAccountId]);

  // List of OAuth Scopes for inspection
  const oauthScopes = [
    {
      scope: "https://www.googleapis.com/auth/gmail.modify",
      description: "Read, compose, send, and permanently delete email messages.",
      required: true,
      service: "Gmail"
    },
    {
      scope: "https://www.googleapis.com/auth/calendar.events",
      description: "Read, edit, share, and permanently delete all calendars.",
      required: true,
      service: "Calendar"
    },
    {
      scope: "https://www.googleapis.com/auth/drive.file",
      description: "Access, modify, and delete specific files created/edited by ExpendMore.",
      required: true,
      service: "Drive"
    },
    {
      scope: "https://www.googleapis.com/auth/spreadsheets",
      description: "Read, edit, and create Sheets spreadsheets.",
      required: false,
      service: "Sheets"
    },
    {
      scope: "https://www.googleapis.com/auth/userinfo.profile",
      description: "Read account profile name, avatars, and emails.",
      required: true,
      service: "Contacts"
    }
  ];

  const handleRefresh = () => {
    if (!activeAccount) return;
    setIsRotating(true);
    setTimeout(() => {
      refreshToken(activeAccount.id, "gmail");
      setIsRotating(false);
      addToast("OAuth keys refreshed and rotated successfully.", "success");
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex items-center justify-between border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            OAuth Credentials & Scopes Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Audit API permissions, inspect authorized OAuth tokens, and rotate security credentials.
          </p>
        </div>
        {activeAccount && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRotating}
            className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/40"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Rotate Credentials
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token status panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Current OAuth Token Status
          </h3>

          {activeAccount ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 border-b border-brand-border dark:border-zinc-800 pb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">
                    Authorized Account
                  </span>
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    {activeAccount.email}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">
                    Handshake Status
                  </span>
                  <div>
                    <GoogleStatusBadge status={activeAccount.status} />
                  </div>
                </div>
              </div>

              {/* Security parameters */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Token ID Signature</span>
                  <span className="font-mono text-[10px] text-brand-navy dark:text-foreground font-semibold">
                    {activeToken ? activeToken.id : `tok-mock-${activeAccount.id.substring(4)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Token Expires At</span>
                  <span className="font-semibold text-brand-navy dark:text-foreground">
                    {activeToken ? new Date(activeToken.expiresAt).toLocaleString() : new Date(Date.now() + 3600*1000*24*30).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Refresh Token String</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-on-surface-variant">
                    <Key className="h-3 w-3 shrink-0" />
                    <span>••••••••••••••••••••••••••••</span>
                  </div>
                </div>
              </div>

              {/* Authorized scopes checker */}
              <div className="mt-2 flex flex-col gap-3">
                <h4 className="font-bold text-xs text-brand-navy dark:text-foreground uppercase tracking-wider">
                  Authorized API Scopes & Permissions
                </h4>

                <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-brand-border dark:divide-zinc-800">
                  {oauthScopes.map((scopeItem, idx) => (
                    <div key={idx} className="p-3.5 bg-white dark:bg-zinc-900/20 flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-xs font-bold text-brand-navy dark:text-foreground flex items-center gap-1.5">
                          {scopeItem.service} Scope
                          {scopeItem.required && (
                            <span className="text-[9px] font-bold bg-slate-100 dark:bg-zinc-800 text-on-surface-variant/80 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-mono text-on-surface-variant truncate max-w-[320px] md:max-w-[450px]">
                          {scopeItem.scope}
                        </span>
                        <p className="text-[10px] text-on-surface-variant/80 mt-1 font-semibold leading-relaxed">
                          {scopeItem.description}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          readOnly
                          className="h-4 w-4 rounded border-brand-border dark:border-zinc-700 text-brand-navy focus:ring-brand-navy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-xs text-on-surface-variant py-8 text-center">
              Please choose a connected Google workspace first.
            </span>
          )}
        </Card>

        {/* Security guidelines */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
              ExpendMore Security Framework
            </h3>
            <p className="text-[11px] text-on-surface-variant/90 font-semibold leading-relaxed">
              We operate strictly under the Google API Services User Data Policy, including the Limited Use requirements.
            </p>

            <ul className="text-[10px] font-semibold text-on-surface-variant/80 flex flex-col gap-2.5 list-disc pl-4">
              <li>Authentication signatures are fully encrypted in transit and rest.</li>
              <li>Refresh tokens execute internally; your passwords are never shared.</li>
              <li>You can revoke our credentials at any time in your Google Account Security portal.</li>
            </ul>
          </Card>

          <Card className="p-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col gap-3">
            <h4 className="font-bold text-xs text-brand-navy dark:text-foreground flex items-center gap-1">
              <HelpCircle className="h-4 w-4 text-brand-sky" />
              Need to add scopes?
            </h4>
            <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed">
              If your WhatsApp Hub requires advanced actions (like calendar exports, email template modifications), you must adjust your Google Cloud project settings to include those scopes in the OAuth Consent Screen.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
