import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  aiGlow?: boolean;
}

export function Card({ children, className, aiGlow = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-950/40 dark:backdrop-blur-xl border border-[#E2E8F0] dark:border-white/[0.06] rounded-2xl transition-all duration-300",
        aiGlow
          ? "border-[#3B82F6] dark:border-emerald-500/50 shadow-[inset_0_0_8px_rgba(59,130,246,0.1)] dark:shadow-[0_0_20px_rgba(16,185,129,0.05)]"
          : "hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.02)] hover:border-[#0F172A] dark:hover:border-white/15 hover:scale-[1.005]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
