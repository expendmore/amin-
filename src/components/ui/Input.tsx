"use client";

import * as React from "react";
import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Eye, EyeOff, Search, Sparkles } from "lucide-react";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isAi?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      isAi = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";
    const isSearchType = type === "search";

    // Determine runtime input type (toggled for password visibility)
    const resolvedType = isPasswordType ? (showPassword ? "text" : "password") : type;

    // Toggle password visibility handler
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-brand-navy select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {/* Start Icon (e.g. Search, Sparkles for AI Search) */}
          {isSearchType && !startIcon && (
            <span className="absolute left-3 text-on-surface-variant shrink-0 pointer-events-none">
              {isAi ? (
                <Sparkles className="h-4 w-4 text-brand-sky" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </span>
          )}
          {!isSearchType && startIcon && (
            <span className="absolute left-3 text-on-surface-variant shrink-0 pointer-events-none">
              {startIcon}
            </span>
          )}

          <input
            ref={ref}
            type={resolvedType}
            disabled={disabled}
            className={cn(
              "w-full h-10 border rounded-lg text-sm transition-all duration-150 placeholder:text-on-surface-variant/60 focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 disabled:opacity-50 disabled:cursor-not-allowed text-brand-navy",
              // Dark Mode override
              "bg-white dark:bg-surface border-brand-border dark:border-border dark:text-foreground dark:focus:border-primary dark:focus:ring-primary/15",
              // AI Search styling
              isSearchType && isAi && "bg-brand-sky-light/30 border-brand-sky/40 focus:border-brand-sky focus:ring-brand-sky/20",
              // Indent text based on icon presence
              (startIcon || isSearchType) ? "pl-10" : "px-3.5",
              (endIcon || isPasswordType) ? "pr-10" : "px-3.5",
              error && "border-destructive focus:border-destructive focus:ring-destructive/15 shake-error",
              className
            )}
            {...props}
          />

          {/* End Icon or Password Visibility Toggle */}
          {isPasswordType ? (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 text-on-surface-variant hover:text-brand-navy transition-colors focus:outline-none p-1 rounded hover:bg-brand-slate"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-current" />
              ) : (
                <Eye className="h-4 w-4 text-current" />
              )}
            </button>
          ) : (
            endIcon && (
              <span className="absolute right-3 text-on-surface-variant shrink-0 pointer-events-none">
                {endIcon}
              </span>
            )
          )}
        </div>
        {error && <span className="text-[10px] font-semibold text-danger">{error}</span>}
        {!error && helperText && <span className="text-[10px] text-on-surface-variant">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
