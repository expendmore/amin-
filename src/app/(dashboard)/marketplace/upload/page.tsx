"use client";

import React, { useState } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Upload, ArrowRight, Save } from "lucide-react";

export default function UploadWizardPage() {
  const { addToast } = useToast();
  const { publishItem } = useMarketplace();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("workflows");
  const [pricingType, setPricingType] = useState<"free" | "premium">("free");
  const [price, setPrice] = useState("0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    publishItem(name.trim(), desc.trim(), category, pricingType, parseFloat(price) || 0);
    addToast(`Successfully published template details. Pending moderation review.`, "success");
    setName("");
    setDesc("");
    setStep(1);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Publish Wizard Asset
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Configure basic descriptions, coordinate category indices, and specify licensing costs parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wizard Form */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          {/* Step indicators */}
          <div className="flex items-center gap-4 border-b border-brand-border pb-4 select-none">
            <span className={`text-xs font-bold ${step === 1 ? "text-brand-navy" : "text-on-surface-variant/50"}`}>
              1. Basic Information
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-on-surface-variant/50" />
            <span className={`text-xs font-bold ${step === 2 ? "text-brand-navy" : "text-on-surface-variant/50"}`}>
              2. Pricing & Review
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
            {step === 1 ? (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Template Display Name
                  </label>
                  <Input
                    placeholder="e.g. Inbound CRM Webhook Sync"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Brief description summary
                  </label>
                  <Input
                    placeholder="Brief description of the template capability..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Category Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                  >
                    <option value="workflows">Workflow Template</option>
                    <option value="agents">AI Agent Template</option>
                    <option value="prompts">Prompt Library</option>
                    <option value="chatbots">Chatbot Configuration</option>
                  </select>
                </div>

                <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
                  <Button
                    type="button"
                    variant="success"
                    size="sm"
                    className="font-bold text-white shrink-0"
                    onClick={() => setStep(2)}
                  >
                    Next - Pricing
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Select Pricing Model
                  </label>
                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value as any)}
                    className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-full"
                  >
                    <option value="free">Free package</option>
                    <option value="premium">Premium flat price</option>
                  </select>
                </div>

                {pricingType === "premium" && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                      License flat Price ($ USD)
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g. 19"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-brand-border pt-4 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="font-bold"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="success"
                    size="sm"
                    className="font-bold text-white shrink-0"
                    leftIcon={<Save className="h-4 w-4 text-white" />}
                  >
                    Publish Listing
                  </Button>
                </div>
              </>
            )}
          </form>
        </Card>

        {/* guidelines */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <Upload className="h-4.5 w-4.5 text-brand-sky" />
              Listing rules
            </h3>
            <div className="flex flex-col gap-3 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <p>
                <strong>Security sandbox review:</strong> All published templates are checked by our automation scripts to scan logic paths for credentials exposures before listings go live.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
