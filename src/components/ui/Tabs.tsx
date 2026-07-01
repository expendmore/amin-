import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: "line" | "pill";
}

export function Tabs({ tabs, activeTab, onChange, className, variant = "line" }: TabsProps) {
  return (
    <div
      className={cn(
        "flex w-full select-none",
        variant === "line"
          ? "border-b border-brand-border gap-6"
          : "p-1 bg-brand-slate border border-brand-border rounded-xl gap-1.5",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 text-xs font-bold transition-all focus-visible:outline-none relative py-2.5 px-3 rounded-lg",
              variant === "line"
                ? isActive
                  ? "text-brand-navy border-b-2 border-brand-navy rounded-b-none"
                  : "text-on-surface-variant hover:text-brand-navy"
                : isActive
                ? "bg-white text-brand-navy shadow-sm border border-brand-border"
                : "text-on-surface-variant hover:text-brand-navy"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
