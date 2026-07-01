"use client";

import React, { useState } from "react";
import { useAIProvider } from "@/store/use-ai-provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Key, Plus, RotateCw, Trash2, ShieldCheck, EyeOff, Eye } from "lucide-react";

export default function APIKeysPage() {
  const { addToast } = useToast();
  const {
    apiKeys,
    providers,
    rotateKey,
    revokeKey
  } = useAIProvider();

  const [showRotateModal, setShowRotateModal] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<any>("openai");
  const [keyValue, setKeyValue] = useState("");
  const [description, setDescription] = useState("");
  const [revealKeyId, setRevealKeyId] = useState<string | null>(null);

  const handleRotate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyValue.trim() || !description.trim()) {
      addToast("Please fill in API key secret and description.", "error");
      return;
    }

    rotateKey(selectedProviderId, keyValue.trim(), description.trim());
    addToast("Rotated API credentials key secret successfully", "success");
    setKeyValue("");
    setDescription("");
    setShowRotateModal(false);
  };

  const handleRevoke = (id: string) => {
    revokeKey(id);
    addToast("API Key status set to revoked.", "warning");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            API Key Credentials Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Monitor provider keys, rotate secrets dynamically, and review scopes permissions settings.
          </p>
        </div>
        <Button
          variant="success"
          size="sm"
          onClick={() => setShowRotateModal(true)}
          className="font-bold shrink-0"
          leftIcon={<Plus className="h-4 w-4 text-white" />}
        >
          Rotate/Add API Key
        </Button>
      </div>

      {/* Keys Table */}
      <Card className="border-brand-border bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-slate/85 dark:bg-zinc-900 border-b border-brand-border text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3.5 pl-5">Provider</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">API Key Value</th>
                <th className="p-3.5">Authorized Scopes</th>
                <th className="p-3.5">Total Cost</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {apiKeys.map((k) => {
                const prov = providers.find((p) => p.id === k.providerId);
                const isRevealed = revealKeyId === k.id;
                return (
                  <tr key={k.id} className="hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10 font-medium text-brand-navy dark:text-foreground">
                    <td className="p-3.5 pl-5 font-bold capitalize">
                      {prov?.name || k.providerId}
                    </td>
                    <td className="p-3.5 text-on-surface-variant/90">
                      {k.description}
                    </td>
                    <td className="p-3.5 font-mono text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span>{isRevealed ? "sk-proj-9x1u5k23l8r4z1q0" : k.maskedKey}</span>
                        <button
                          onClick={() => setRevealKeyId(isRevealed ? null : k.id)}
                          className="text-on-surface-variant/60 hover:text-brand-navy shrink-0 cursor-pointer"
                        >
                          {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 flex flex-wrap gap-1">
                      {k.scopes.map((s, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-on-surface-variant/90 px-1.5 py-0.5 rounded font-bold uppercase">
                          {s}
                        </span>
                      ))}
                    </td>
                    <td className="p-3.5 font-bold">
                      ${k.usageCost.toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        k.status === "active"
                          ? "bg-emerald-50 text-brand-green border-emerald-200"
                          : k.status === "expired"
                          ? "bg-slate-50 text-slate-400 border-slate-200"
                          : "bg-red-50 text-error border-red-200"
                      }`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      {k.status === "active" && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleRevoke(k.id)}
                          className="text-error font-bold hover:bg-red-50 dark:hover:bg-red-950/20"
                          leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                        >
                          Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Rotation/Create Modal */}
      {showRotateModal && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex flex-col gap-0.5 text-left border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                Rotate / Add Provider API Key
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                ExpendMore encrypts API keys at rest using AES-256 standard protocols.
              </p>
            </div>

            <form onSubmit={handleRotate} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Select Provider Platform
                </label>
                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value as any)}
                  className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  API Key Secret Token
                </label>
                <Input
                  type="password"
                  placeholder="e.g. sk-proj-••••••••••••"
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Description / Identifier Label
                </label>
                <Input
                  placeholder="e.g. Production Main Bots Key"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="p-3.5 bg-brand-slate rounded-lg border border-brand-border/60 flex gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-brand-green shrink-0 mt-0.5" />
                <span className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                  Rotating a key sets previous key credentials status to Expired. Active automation pipelines automatically switch to the new active key.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3.5 border-t border-brand-border dark:border-zinc-800/80 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRotateModal(false)}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  size="sm"
                  className="font-bold text-white"
                >
                  Confirm Rotation
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
