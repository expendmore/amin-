"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

export interface ToastProps {
  id: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, message, type, duration = 4000, onClose }: ToastProps) {
  // Determine icons and colors based on type
  const iconMap = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
  };

  const Icon = iconMap[type] || Info;

  const typeClasses = {
    success: "bg-white dark:bg-zinc-900 border-brand-green/30 text-brand-green shadow-[0_4px_12px_rgba(37,211,102,0.15)]",
    warning: "bg-white dark:bg-zinc-900 border-amber-500/30 text-amber-500 shadow-[0_4px_12px_rgba(217,119,6,0.15)]",
    error: "bg-white dark:bg-zinc-900 border-destructive/30 text-danger shadow-[0_4px_12px_rgba(220,38,38,0.15)]",
    info: "bg-white dark:bg-zinc-900 border-brand-sky/30 text-brand-sky shadow-[0_4px_12px_rgba(59,130,246,0.15)]",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-lg max-w-sm w-full select-none ${typeClasses[type]}`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 shrink-0 text-current" />
        <span className="text-sm font-semibold text-brand-navy dark:text-foreground">{message}</span>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground transition-colors p-1 rounded-md hover:bg-brand-slate dark:hover:bg-surface-container shrink-0 ml-4 cursor-pointer"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export default Toast;
