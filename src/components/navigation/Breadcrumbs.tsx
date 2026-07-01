"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();

  // Split paths into readable steps
  const paths = pathname.split("/").filter((x) => x);

  const routeLabelMap: Record<string, string> = {
    chat: "AI Chat Console",
    images: "Visual Studio",
    documents: "Documents Directory",
    settings: "Workspace Settings",
  };

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground select-none">
      <Link href="/chat" className="hover:text-foreground transition-colors p-1 rounded hover:bg-secondary">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const label = routeLabelMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
        const isLast = index === paths.length - 1;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/65" />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-[200px]">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors truncate max-w-[100px]">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
export default Breadcrumbs;
