"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Building, Save, ShieldCheck } from "lucide-react";

export default function WorkspaceBillingPage() {
  const { addToast } = useToast();

  const [owner, setOwner] = useState("Aditya Tiwari");
  const [email, setEmail] = useState("billing@anshuman.com");
  const [address, setAddress] = useState("Sector 62, Noida, UP, India");
  const [gstin, setGstin] = useState("09AAAAA1111A1Z1");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Workspace organization details updated.", "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Workspace Billing Information
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Edit billing addresses, save organization tax identities GSTIN, and modify accounting contacts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings form panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <form onSubmit={handleSave} className="flex flex-col gap-4 text-left font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Workspace Owner Name
                </label>
                <Input value={owner} onChange={(e) => setOwner(e.target.value)} required />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Billing Email Address
                </label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                GSTIN / Tax ID Number
              </label>
              <Input
                placeholder="e.g. 09AAAAA1111A1Z1"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Physical billing Address
              </label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0"
                leftIcon={<Save className="h-4 w-4 text-white" />}
              >
                Save Details
              </Button>
            </div>
          </form>
        </Card>

        {/* side panel */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <Building className="h-4.5 w-4.5 text-brand-sky" />
              Tax Compliance
            </h3>

            <div className="flex flex-col gap-3 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <p>
                <strong>GSTIN details:</strong> Providing a valid GSTIN enables correct regional tax deduction rates computation in succeeding invoices.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
