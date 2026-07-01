"use client";

import React, { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error details to Sentry / PostHog
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center p-6 bg-background">
      <div className="flex flex-col items-center text-center gap-4 max-w-sm w-full select-none">
        <span className="p-3 bg-destructive/10 text-destructive rounded-full border border-destructive/20">
          <AlertCircle className="h-6 w-6" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-foreground">Something went wrong</h3>
          <p className="text-xs text-muted-foreground">
            An unexpected error occurred during page rendering. Please try again.
          </p>
        </div>
        <button
          onClick={reset}
          className="h-10 px-4 text-sm font-semibold rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm hover:from-brand-600 hover:to-brand-700 active:scale-95 transition-all duration-150"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
