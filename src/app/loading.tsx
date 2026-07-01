import React from "react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-6 bg-background">
      <div className="flex flex-col gap-6 max-w-sm w-full select-none">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-secondary border border-border shimmer-active" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3 w-24 bg-secondary rounded shimmer-active" />
            <div className="h-2 w-16 bg-secondary rounded shimmer-active" />
          </div>
        </div>
        <div className="h-40 bg-secondary border border-border rounded-xl shimmer-active" />
      </div>
    </div>
  );
}
