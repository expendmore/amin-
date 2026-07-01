"use client";

import React, { useMemo, useState } from "react";
import { useMicrosoft365 } from "@/store/use-microsoft-365";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import MicrosoftStatusBadge from "@/components/microsoft/MicrosoftStatusBadge";
import { useToast } from "@/store/use-toast";
import { ShieldCheck, RefreshCw, Key, Info, HelpCircle } from "lucide-react";

export default function MicrosoftOAuthManager() {
  const { addToast } = useToast();
  const {
    accounts,
    activeAccountId,
    tokens,
    refreshToken
  } = useMicrosoft365();

  const [isRotating, setIsRotating] = useState(false);

  const activeAccount = useMemo(() => {
    return accounts.find(a => a.id === activeAccountId) || null;
  }, [accounts, activeAccountId]);

  const activeToken = useMemo(() => {
    return tokens.find(t => t.accountId === activeAccountId) || null;
  }, [tokens, activeAccountId]);

  // List of Microsoft Graph API Scopes
  const oauthScopes = [
    {
      scope: "https://graph.microsoft.com/Mail.ReadWrite",
      description: "Read, edit, draft and send emails via Outlook mailboxes.",
      required: true,
      service: "Outlook"
    },
    {
      scope: "https://graph.microsoft.com/Calendars.ReadWrite",
      description: "Read, update and create calendar schedules and Teams meeting spaces.",
      required: true,
      service: "Calendar"
    },
    {
      scope: "https://graph.microsoft.com/Files.ReadWriteAll",
      description: "Access, sync and modify files inside OneDrive directories.",
      required: true,
      service: "OneDrive"
    },
    {
      scope: "https://graph.microsoft.com/ChannelMessage.Send",
      description: "Broadcast workspace checkouts signals logs straight into Teams channels.",
      required: false,
      service: "Teams"
    },
    {
      scope: "https://graph.microsoft.com/Sites.ReadWrite.All",
      description: "Sync, publish and review document library files in SharePoint corporate sites.",
      required: false,
      service: "SharePoint"
    },
    {
      scope: "https://graph.microsoft.com/Reports.Read.All",
      description: "Index telemetry dataset and embed margins analytics dashboards inside Power BI.",
      required: false,
      service: "Power BI"
    }
  ];

  const handleRefresh = () => {
    if (!activeAccount) return;
    setIsRotating(true);
    setTimeout(() => {
      refreshToken(activeAccount.id, "outlook");
      setIsRotating(false);
      addToast("Successfully rotated Microsoft Graph OAuth keys.", "success");
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex items-center justify-between border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Microsoft Entra ID OAuth Consent
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Inspect corporate Microsoft Graph scopes consent, verify active access tokens, and check encryption properties.
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
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Entra ID Active Token Properties
          </h3>

          {activeAccount ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 border-b border-brand-border pb-4 text-left">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">
                    Microsoft Corporate Login
                  </span>
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground">
                    {activeAccount.email}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">
                    Connection Health
                  </span>
                  <div>
                    <MicrosoftStatusBadge status={activeAccount.status} />
                  </div>
                </div>
              </div>

              {/* Security parameters */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Tenant Directory ID</span>
                  <span className="font-mono text-[10px] text-brand-navy dark:text-foreground font-semibold">
                    {activeAccount.tenantId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Access Token Expiration</span>
                  <span className="font-semibold text-brand-navy dark:text-foreground">
                    {activeToken ? new Date(activeToken.expiresAt).toLocaleString() : new Date(Date.now() + 3600*1000*24*30).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Graph API Client Secret</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-on-surface-variant">
                    <Key className="h-3 w-3 shrink-0" />
                    <span>••••••••••••••••••••••••••••</span>
                  </div>
                </div>
              </div>

              {/* Authorized scopes checker */}
              <div className="mt-2 flex flex-col gap-3">
                <h4 className="font-bold text-xs text-brand-navy dark:text-foreground uppercase tracking-wider text-left">
                  Authorized Microsoft Graph API Scopes
                </h4>

                <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-brand-border dark:divide-zinc-800">
                  {oauthScopes.map((scopeItem, idx) => (
                    <div key={idx} className="p-3.5 bg-white dark:bg-zinc-900/20 flex items-start justify-between gap-4 text-left">
                      <div className="flex flex-col gap-0.5 min-w-0">
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
                      <div className="flex items-center shrink-0">
                        <input
                          type="checkbox"
                          checked={true}
                          readOnly
                          className="h-4 w-4 rounded border-brand-border text-brand-navy focus:ring-brand-navy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-xs text-on-surface-variant py-8 text-center">
              Please choose a connected Microsoft workspace first.
            </span>
          )}
        </Card>

        {/* Security parameters on right sidebar */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
              Azure App Governance
            </h3>
            <p className="text-[11px] text-on-surface-variant/90 font-semibold leading-relaxed">
              We operate strictly under Microsoft Graph security guidelines. Access tokens are encrypted at rest using AES-256.
            </p>

            <ul className="text-[10px] font-semibold text-on-surface-variant/80 flex flex-col gap-2.5 list-disc pl-4">
              <li>No password credentials are stored.</li>
              <li>Tokens are automatically refreshed.</li>
              <li>Revoke client secrets anytime inside Microsoft Azure Portal.</li>
            </ul>
          </Card>

          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-3 text-left">
            <h4 className="font-bold text-xs text-brand-navy dark:text-foreground flex items-center gap-1">
              <HelpCircle className="h-4 w-4 text-brand-sky" />
              Custom API Scopes?
            </h4>
            <p className="text-[10px] text-on-surface-variant/80 font-semibold leading-relaxed">
              If your automation triggers advanced endpoints (like SharePoint Site listings, Power BI reports embeds), ensure they are declared inside your Azure AD App Registration manifest.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
