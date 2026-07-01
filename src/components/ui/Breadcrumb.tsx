import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends React.HtmlHTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator = <ChevronRight className="h-3.5 w-3.5" />, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn("flex items-center flex-wrap gap-1.5 text-xs text-on-surface-variant font-medium select-none", className)}
        {...props}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="text-on-surface-variant/50 shrink-0 leading-none" aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast || !item.href ? (
                <span className="font-semibold text-brand-navy dark:text-foreground truncate max-w-[120px] sm:max-w-[200px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-brand-navy dark:hover:text-foreground transition-colors truncate max-w-[100px] hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";
export default Breadcrumb;
