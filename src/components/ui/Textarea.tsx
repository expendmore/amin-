"use client";

import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-brand-navy select-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full min-h-[80px] p-3.5 border rounded-lg text-sm transition-all duration-150 placeholder:text-on-surface-variant/60 focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 disabled:opacity-50 disabled:cursor-not-allowed text-brand-navy resize-y",
            "bg-white dark:bg-surface border-brand-border dark:border-border dark:text-foreground dark:focus:border-primary dark:focus:ring-primary/15",
            error && "border-destructive focus:border-destructive focus:ring-destructive/15 shake-error",
            className
          )}
          {...props}
        />
        {error && <span className="text-[10px] font-semibold text-danger">{error}</span>}
        {!error && helperText && <span className="text-[10px] text-on-surface-variant">{helperText}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
