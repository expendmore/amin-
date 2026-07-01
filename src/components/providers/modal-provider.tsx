"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "@/store/use-modal";
import { Dialog, DialogContent, DialogHeader, DialogPortal } from "@/components/ui/Dialog";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

export function ModalProvider() {
  const { type, isOpen, closeModal } = useModal();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogPortal>
        {type === "upgrade" && (
          <DialogContent className="max-w-md">
            <DialogHeader className="flex flex-col items-center text-center gap-2">
              <span className="p-3 bg-brand-950/20 text-brand-500 rounded-full border border-brand-500/10">
                <Info className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold">Upgrade to Premium</h3>
              <p className="text-sm text-muted-foreground">
                Get unlimited chats, 100 high-res image generations, and developer API key access.
              </p>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-6">
              <button
                onClick={closeModal}
                className="w-full h-10 px-4 text-sm font-semibold rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm hover:from-brand-600 hover:to-brand-700 transition-all duration-150"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={closeModal}
                className="w-full h-10 px-4 text-sm font-semibold rounded-lg bg-secondary text-secondary-foreground border border-border hover:bg-accent transition-all duration-150"
              >
                Cancel
              </button>
            </div>
          </DialogContent>
        )}
      </DialogPortal>
    </Dialog>
  );
}
export default ModalProvider;
