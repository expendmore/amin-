import React, { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "error" | "info";
  title?: string;
  onClose?: () => void;
}

export function Alert({
  children,
  className,
  variant = "info",
  title,
  onClose,
  ...props
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div
      className={cn(
        "p-4 rounded-xl border flex gap-3 text-xs leading-relaxed font-medium relative shadow-sm",
        variant === "success" && "bg-brand-green/10 text-brand-green border-brand-green/20",
        variant === "warning" && "bg-warning/10 text-warning border-warning/20",
        variant === "error" && "bg-danger/10 text-danger border-danger/20",
        variant === "info" && "bg-brand-sky-light text-brand-sky border-brand-sky/20",
        className
      )}
      {...props}
    >
      <span className="shrink-0 mt-0.5">
        {variant === "success" && <CheckCircle className="h-4.5 w-4.5" />}
        {variant === "warning" && <AlertTriangle className="h-4.5 w-4.5" />}
        {variant === "error" && <XCircle className="h-4.5 w-4.5" />}
        {variant === "info" && <Info className="h-4.5 w-4.5" />}
      </span>

      <div className="flex-1 flex flex-col gap-1 pr-6">
        {title && <span className="font-bold text-brand-navy">{title}</span>}
        <div className="text-on-surface-variant font-medium">{children}</div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-on-surface-variant/80 hover:text-brand-navy p-0.5 rounded-md hover:bg-black/5"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
