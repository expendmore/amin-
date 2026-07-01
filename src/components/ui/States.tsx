import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertCircle, CheckCircle, HelpCircle, Loader2 } from "lucide-react";
import Button from "./Button";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------
// 1. EMPTY STATE
// ----------------------------------------------------
export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border border-dashed border-brand-border rounded-2xl bg-white max-w-md mx-auto my-auto gap-4 select-none", className)}>
      <div className="p-3 bg-brand-slate text-on-surface-variant rounded-full border border-brand-border shadow-sm">
        <HelpCircle className="h-6 w-6 text-on-surface-variant/80" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-sm text-brand-navy">{title}</h3>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="font-bold">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 2. ERROR STATE
// ----------------------------------------------------
export interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this section.",
  actionLabel,
  onAction,
  className
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border border-[#FCA5A5]/20 rounded-2xl bg-red-50/10 max-w-md mx-auto my-auto gap-4 select-none", className)}>
      <div className="p-3 bg-red-50 text-red-500 rounded-full border border-red-200 shadow-sm">
        <AlertCircle className="h-6 w-6 text-danger" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-sm text-brand-navy">{title}</h3>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary" size="sm" className="font-bold text-xs">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 3. SUCCESS STATE
// ----------------------------------------------------
export interface SuccessStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SuccessState({ title, description, actionLabel, onAction, className }: SuccessStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border border-brand-green/20 rounded-2xl bg-emerald-50/10 max-w-md mx-auto my-auto gap-4 select-none", className)}>
      <div className="p-3 bg-emerald-50 text-brand-green rounded-full border border-brand-green/20 shadow-sm">
        <CheckCircle className="h-6 w-6 text-brand-green" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-sm text-brand-navy">{title}</h3>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="success" size="sm" className="font-bold">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 4. LOADING STATE
// ----------------------------------------------------
export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Loading contents...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex-grow flex flex-col items-center justify-center text-center p-8 gap-3 select-none", className)}>
      <Loader2 className="h-6 w-6 text-brand-navy animate-spin" />
      <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}
