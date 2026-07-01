"use client";

import React, { useRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  isError?: boolean;
  disabled?: boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  isError,
  disabled,
}: OTPInputProps) {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!val) return;

    // Split numbers if copy-pasted
    const otpArray = value.split("");
    otpArray[index] = val[val.length - 1]; // Take only the last digit

    const nextOtp = otpArray.join("");
    onChange(nextOtp);

    // Auto-advance focus
    if (index < length - 1 && val) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const otpArray = value.split("");
      if (!otpArray[index] && index > 0) {
        // Move focus backward if current cell is empty and backspace pressed
        inputsRef.current[index - 1]?.focus();
        otpArray[index - 1] = "";
        onChange(otpArray.join(""));
      } else {
        otpArray[index] = "";
        onChange(otpArray.join(""));
      }
    }
  };

  const digits = Array.from({ length }).map((_, i) => value[i] || "");

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            if (el) inputsRef.current[index] = el;
          }}
          type="text"
          maxLength={1}
          value={digits[index]}
          disabled={disabled}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            "w-12 h-14 text-center text-lg font-semibold bg-card border border-border rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 transition-all duration-150 disabled:opacity-50",
            isError && "border-destructive focus:border-destructive focus:ring-destructive/15 shake-error"
          )}
        />
      ))}
    </div>
  );
}
export default OTPInput;
