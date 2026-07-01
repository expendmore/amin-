import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "navy" | "white" | "sky" | "green";
}

export function Spinner({ className, size = "md", variant = "navy", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 stroke-[3px]",
    md: "h-8 w-8 stroke-[2px]",
    lg: "h-12 w-12 stroke-[2px]",
  };

  const variantClasses = {
    navy: "text-brand-navy dark:text-foreground",
    white: "text-white",
    sky: "text-brand-sky",
    green: "text-brand-green",
  };

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <svg
        className={cn("animate-spin shrink-0", sizeClasses[size], variantClasses[variant])}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
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
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
