"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Key } from "lucide-react";

export default function ApiGatewayPage() {
  const { addToast } = useToast();

  const [rateLimit, setRateLimit] = useState("60");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Global API Gateway rate limiting configurations updated.", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            API Gateway & Rate Limiting
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Define global API client throttling thresholds, manage authorization scopes keys, and audit connection logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings form */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <form onSubmit={handleSave} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Global Rate Limit (requests per minute)
              </label>
              <Input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button type="submit" variant="success" size="sm" className="font-bold text-white shrink-0">
                Save Configurations
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
