import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "ai";
}

export function Badge({ children, className, variant = "primary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold select-none border border-transparent transition-all",
        // Variants
        variant === "primary" && "bg-brand-navy text-white",
        variant === "secondary" && "bg-brand-slate text-brand-navy border-brand-border",
        variant === "success" && "bg-brand-green/10 text-brand-green border-brand-green/20",
        variant === "warning" && "bg-warning/10 text-warning border-warning/20",
        variant === "danger" && "bg-danger/10 text-danger border-danger/20",
        variant === "info" && "bg-info/10 text-info border-info/20",
        variant === "ai" && "bg-brand-sky-light text-brand-sky border-brand-sky/20",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
