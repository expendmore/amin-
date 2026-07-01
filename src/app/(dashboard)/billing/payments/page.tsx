"use client";

import React, { useState } from "react";
import { useBilling } from "@/store/use-billing";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { CreditCard, Trash2, Plus, Star } from "lucide-react";

export default function PaymentMethodsPage() {
  const { addToast } = useToast();
  const { paymentMethods, addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } = useBilling();

  const [showAddForm, setShowAddForm] = useState(false);
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (number.length < 4) return;

    addPaymentMethod("card", {
      brand: "Visa",
      last4: number.slice(-4),
      expMonth: 12,
      expYear: 2030
    });

    addToast("Credit card payment method registered successfully.", "success");
    setNumber("");
    setExpiry("");
    setCvc("");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Payment Options
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Register credit cards credentials, adjust default billing rules, and inspect processors gateways.
          </p>
        </div>
        <Button
          variant="success"
          size="sm"
          className="font-bold text-white shrink-0"
          onClick={() => setShowAddForm(true)}
          leftIcon={<Plus className="h-4 w-4 text-white" />}
        >
          Add Credit Card
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment list */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
            Registered Credentials Cards
          </h3>

          <div className="flex flex-col gap-3">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={`p-4 border rounded-xl flex items-center justify-between gap-4 font-sans text-left transition-colors ${
                  pm.isDefault
                    ? "border-brand-sky bg-brand-sky-light/5"
                    : "border-brand-border bg-white dark:bg-zinc-900/10"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 shrink-0">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate flex items-center gap-1.5">
                      {pm.brand} ending in {pm.last4}
                      {pm.isDefault && (
                        <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                          Default
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                      Expires: {pm.expMonth}/{pm.expYear}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!pm.isDefault && (
                    <button
                      onClick={() => {
                        setDefaultPaymentMethod(pm.id);
                        addToast("Default billing card updated.", "success");
                      }}
                      title="Set as Default"
                      className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-brand-sky hover:bg-brand-sky-light/20 cursor-pointer"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deletePaymentMethod(pm.id);
                      addToast("Payment method deleted", "warning");
                    }}
                    title="Remove Credentials"
                    className="h-8 w-8 rounded-lg border border-brand-border flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Info gateway placeholders */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground">
              Payment Processor Gateways
            </h3>
            <div className="flex flex-col gap-2.5 text-[11px] font-medium text-on-surface-variant/90 leading-relaxed">
              <p>
                <strong>Stripe Integration:</strong> Sandbox tokenization active.
              </p>
              <p>
                <strong>Razorpay integration:</strong> UPI flows pending compliance setups.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex flex-col gap-0.5 text-left border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                Register Card Credentials
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                Add card coordinates. Stripe placeholders process simulated validation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Card Number
                </label>
                <Input
                  placeholder="4242 4242 4242 4242"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Expiry MM/YY
                  </label>
                  <Input
                    placeholder="12/28"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    CVC
                  </label>
                  <Input
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3.5 border-t border-brand-border dark:border-zinc-800/80 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
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
                  Register Card
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
