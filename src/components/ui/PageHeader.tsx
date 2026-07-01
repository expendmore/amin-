import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, subtitle, actions, filters, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-4 border-b border-brand-border dark:border-border/50 pb-5 mb-6 select-none",
          className
        )}
        {...props}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Text Title & Subtitle */}
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-navy dark:text-foreground tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs md:text-sm text-on-surface-variant dark:text-foreground/70 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Action buttons (slot) */}
          {actions && (
            <div className="flex items-center gap-2.5 shrink-0 sm:self-center">
              {actions}
            </div>
          )}
        </div>

        {/* Filter items row (slot) */}
        {filters && (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {filters}
          </div>
        )}
      </div>
    );
  }
);

PageHeader.displayName = "PageHeader";
export default PageHeader;
