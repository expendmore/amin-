import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  children?: React.ReactNode;
}

export function Divider({ children, orientation = "horizontal", className, ...props }: DividerProps) {
  if (children && orientation === "horizontal") {
    return (
      <div className={cn("flex items-center w-full my-4 select-none", className)} {...props}>
        <div className="flex-1 border-t border-brand-border" />
        <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
          {children}
        </span>
        <div className="flex-1 border-t border-brand-border" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        orientation === "horizontal"
          ? "w-full border-t border-brand-border my-4"
          : "h-full border-l border-brand-border mx-4 self-stretch",
        className
      )}
      {...props}
    />
  );
}

export default Divider;
