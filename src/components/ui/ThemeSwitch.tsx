"use client";

import React from "react";
import { useTheme } from "@/store/use-theme";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="inline-flex p-1 bg-brand-slate dark:bg-surface-container border border-brand-border dark:border-border rounded-xl select-none gap-0.5">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus:outline-none cursor-pointer ${
              isActive
                ? "text-brand-navy dark:text-foreground"
                : "text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground"
            }`}
            aria-label={`Switch theme to ${option.label}`}
          >
            {isActive && (
              <motion.div
                layoutId="active-theme-bg"
                className="absolute inset-0 bg-white dark:bg-surface border border-brand-border dark:border-border rounded-lg shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeSwitch;
