import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export function PageContainer({
  children,
  className,
  title,
  subtitle,
  headerActions,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full min-h-full pb-20 md:pb-6",
        className
      )}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/45 pb-4 select-none">
          <div className="flex flex-col gap-1">
            {title && (
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-none">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-2 shrink-0">{headerActions}</div>}
        </div>
      )}
      <div className="flex-1 flex flex-col h-full">{children}</div>
    </div>
  );
}
export default PageContainer;
