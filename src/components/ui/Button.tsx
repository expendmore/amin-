"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "ai" | "success";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon-xs" | "icon-sm" | "icon-md" | "icon-lg";
  isLoading?: boolean;
  isIconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      isIconOnly = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    // Define size styles
    const sizeClasses = {
      xs: isIconOnly ? "h-7 w-7 rounded-md p-0 text-xs" : "h-7 px-2.5 text-[10px] rounded-md gap-1",
      sm: isIconOnly ? "h-8 w-8 rounded-md p-0 text-xs" : "h-8 px-3 text-xs rounded-md gap-1.5",
      md: isIconOnly ? "h-10 w-10 rounded-lg p-0 text-sm" : "h-10 px-4 text-sm rounded-lg gap-2",
      lg: isIconOnly ? "h-12 w-12 rounded-xl p-0 text-base" : "h-12 px-6 text-base rounded-xl gap-2.5",
      xl: isIconOnly ? "h-14 w-14 rounded-xl p-0 text-lg" : "h-14 px-8 text-lg rounded-xl gap-3",
      "icon-xs": "h-7 w-7 rounded-md p-0 text-xs",
      "icon-sm": "h-8 w-8 rounded-md p-0 text-xs",
      "icon-md": "h-10 w-10 rounded-lg p-0 text-sm",
      "icon-lg": "h-12 w-12 rounded-xl p-0 text-base",
    };

    // Define variant styles according to Stitch visual spec
    const variantClasses = {
      primary: "bg-brand-navy text-white hover:bg-brand-navy/95 focus-visible:ring-brand-navy border border-transparent shadow-sm hover:shadow-[0_0_8px_rgba(37,211,102,0.4)]",
      secondary: "bg-white text-brand-navy border border-brand-navy hover:bg-brand-slate focus-visible:ring-brand-navy shadow-sm",
      outline: "bg-transparent text-brand-navy border border-brand-border hover:bg-brand-slate focus-visible:ring-brand-navy",
      ghost: "text-brand-navy bg-transparent hover:bg-brand-slate-hover hover:text-brand-navy focus-visible:ring-brand-navy",
      link: "text-brand-navy bg-transparent underline-offset-4 hover:underline focus-visible:ring-brand-navy p-0 h-auto border-transparent hover:bg-transparent shadow-none",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive shadow-sm",
      success: "bg-brand-green text-white hover:bg-brand-green/90 focus-visible:ring-brand-green shadow-sm",
      ai: "bg-white border border-brand-sky text-brand-sky hover:bg-brand-sky-light/40 focus-visible:ring-brand-sky shadow-sm",
    };

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileHover={isDisabled ? undefined : { scale: 1.015 }}
        whileTap={isDisabled ? undefined : { scale: 0.985 }}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-background disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer outline-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...(props as any)}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            data-testid="loading-spinner"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {!isIconOnly && leftIcon && <span className="shrink-0 inline-flex">{leftIcon}</span>}
            {children}
            {!isIconOnly && rightIcon && <span className="shrink-0 inline-flex">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
