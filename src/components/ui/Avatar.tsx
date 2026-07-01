import React, { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, name = "User", size = "md", className }: AvatarProps) {
  const [error, setError] = useState(false);

  // Generate initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative rounded-full border border-brand-border bg-brand-slate text-brand-navy flex items-center justify-center font-bold overflow-hidden select-none shrink-0",
        // Sizes
        size === "sm" && "w-8 h-8 text-[11px]",
        size === "md" && "w-10 h-10 text-xs",
        size === "lg" && "w-12 h-12 text-sm",
        size === "xl" && "w-16 h-16 text-lg",
        className
      )}
    >
      {src && !error ? (
        <img
          src={src}
          alt={name}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials || "U"}</span>
      )}
    </div>
  );
}

export default Avatar;
