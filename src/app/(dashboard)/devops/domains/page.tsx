"use client";

import React, { useState } from "react";
import { useDevops } from "@/store/use-devops";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Globe, Plus } from "lucide-react";

export default function DomainsPage() {
  const { addToast } = useToast();
  const { domains } = useDevops();

  const [domainName, setDomainName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) return;

    addToast(`Verification DNS TXT record generated for: ${domainName}. Configure target nameservers records.`, "success");
    setDomainName("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Custom Domains & DNS Manager
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Register custom hostname settings, evaluate DNS verification parameters indicators, and configure redirect patterns.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domains list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5 font-sans">
            <Globe className="h-4.5 w-4.5 text-brand-sky" />
            Active domain hostnames mappings
          </h3>

          <div className="flex flex-col border border-brand-border dark:border-zinc-800 rounded-xl divide-y divide-brand-border overflow-hidden">
            {domains.map((it) => (
              <div
                key={it.id}
                className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900/10 text-left font-sans"
              >
                <div className="flex flex-col gap-1 min-w-0 text-left font-sans">
                  <span className="text-xs font-bold text-brand-navy dark:text-foreground font-mono">
                    {it.domainName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/85 font-semibold">
                    DNS Records: {it.dnsStatus} • SSL certificate: {it.sslStatus}
                  </span>
                </div>

                <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 font-sans">
                  {it.dnsStatus}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Add domain form */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Map Custom Domain
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Domain Name
                </label>
                <Input
                  placeholder="e.g. workspace.your-domain.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="success" size="sm" className="font-bold text-white w-full animate-none" leftIcon={<Plus className="h-4 w-4 text-white" />}>
                Verify domain
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
