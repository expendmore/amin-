import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  variant?: "brand" | "sky" | "green" | "error";
  size?: "sm" | "md" | "lg";
}

export function Progress({ value, className, variant = "brand", size = "md" }: ProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={cn(
        "w-full bg-brand-slate rounded-full overflow-hidden border border-brand-border/40 select-none",
        size === "sm" && "h-1.5",
        size === "md" && "h-2.5",
        size === "lg" && "h-4",
        className
      )}
    >
      <div
        className={cn(
          "h-full transition-all duration-300 rounded-full",
          variant === "brand" && "bg-brand-navy",
          variant === "sky" && "bg-brand-sky",
          variant === "green" && "bg-brand-green",
          variant === "error" && "bg-error"
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

export default Progress;
