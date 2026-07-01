"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg";
  className?: string;
}

export function RightPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "md",
  className,
}: RightPanelProps) {
  // Listen to Escape key to close the drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={cn(
              "fixed right-0 top-0 bottom-0 h-full w-full z-50 bg-white dark:bg-zinc-900 border-l border-brand-border dark:border-border/50 shadow-2xl flex flex-col focus:outline-none text-brand-navy dark:text-foreground font-sans",
              widthClasses[width],
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* Header Title block */}
            <div className="flex justify-between items-start p-6 border-b border-brand-border dark:border-border/50 select-none shrink-0">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-bold tracking-tight">{title}</h3>
                {subtitle && <p className="text-xs text-on-surface-variant/80 font-medium">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground hover:bg-brand-slate dark:hover:bg-surface-container p-1.5 rounded-md transition-colors cursor-pointer focus:outline-none"
                aria-label="Close panel"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable Container Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {children}
            </div>

            {/* Optional bottom Footer Actions */}
            {footer && (
              <div className="p-4 border-t border-brand-border dark:border-border/50 bg-brand-slate/20 dark:bg-zinc-950/20 select-none shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default RightPanel;
