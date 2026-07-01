"use client";

import React, { useState } from "react";
import { useDeveloper } from "@/store/use-developer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Key, Plus, RefreshCw, Trash } from "lucide-react";

export default function AccessTokensPage() {
  const { addToast } = useToast();
  const { tokens, addToken, rotateToken, revokeToken } = useDeveloper();

  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addToken(name.trim(), ["all_access"], 90);
    addToast("Personal Access Token generated successfully.", "success");
    setName("");
  };

  const handleRotate = (id: string) => {
    rotateToken(id);
    addToast("Access Token secret rotated. Update your environment files.", "success");
  };

  const handleRevoke = (id: string) => {
    revokeToken(id);
    addToast("Access Token revoked.", "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Personal Access Tokens (PAT)
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Generate secure long-lived client tokens secrets, manage authorizations permissions scopes, and rotate keys.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tokens list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
            <Key className="h-4.5 w-4.5 text-brand-sky" />
            Active Personal Access Tokens
          </h3>

          <div className="flex flex-col border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
            {tokens.map((t) => (
              <div
                key={t.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5">
                    {t.name}
                    <span className={`text-[9px] border px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                      t.status === "active" ? "bg-emerald-50 text-brand-green border-emerald-200" : "bg-red-50 text-error border-red-200"
                    }`}>
                      {t.status}
                    </span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-mono truncate">
                    Token: {t.tokenValue}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/70 font-semibold block mt-0.5">
                    Expires: {new Date(t.expiresAt).toLocaleDateString()} • Scopes: {t.scopes.join(", ")}
                  </span>
                </div>

                {t.status === "active" && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      onClick={() => handleRotate(t.id)}
                      variant="outline"
                      size="xs"
                      className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/20 shrink-0 animate-none"
                      leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                    >
                      Rotate
                    </Button>
                    <button
                      onClick={() => handleRevoke(t.id)}
                      title="Revoke Token"
                      className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer shrink-0 animate-none"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Create Token form */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Generate Access Token
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Token Display Name
                </label>
                <Input
                  placeholder="e.g. Local developer server token"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full animate-none" leftIcon={<Plus className="h-4 w-4 text-white" />}>
                Create Token
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
