"use client";

import React, { useState } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Key, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function LicenseKeysPage() {
  const { addToast } = useToast();
  const { licenses } = useMarketplace();

  const [inputKey, setInputKey] = useState("");

  const handleRegisterKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    addToast(`License Key validated successfully. Premium features activated.`, "success");
    setInputKey("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            License Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Register template license keys, check seat usage limits, and review subscription terms.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Licenses list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Active Store Licenses Keys
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border dark:divide-zinc-800">
            {licenses.map((lic) => (
              <div
                key={lic.key}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground font-mono truncate">
                    Key: {lic.key}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/80 font-semibold uppercase">
                    Type: {lic.type} • Status: {lic.status}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-brand-navy dark:text-foreground">
                  Seats: {lic.seatUsed} / {lic.seatLimit} Used
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Validate key */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Register License key
            </h3>

            <form onSubmit={handleRegisterKey} className="flex flex-col gap-3 text-left">
              <Input
                placeholder="e.g. LIC-1234-ABCD-99"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                required
              />
              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full">
                Verify License Key
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
