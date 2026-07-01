"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={twMerge(
        "flex items-center gap-2 cursor-pointer select-none",
        className
      )}
    >
      {label && <span className="text-xs font-semibold text-brand-navy">{label}</span>}
      <div
        className={twMerge(
          "w-8 h-4.5 rounded-full relative transition-all duration-200",
          checked ? "bg-brand-sky" : "bg-outline-variant"
        )}
      >
        <div
          className={twMerge(
            "w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all duration-200",
            checked ? "right-0.5" : "left-0.5"
          )}
        />
      </div>
    </div>
  );
}
export default Toggle;
