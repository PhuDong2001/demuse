import * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#ede8dc]/70", className)}
      {...props}
    />
  );
}

export function TimetableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-3 p-4 rounded-xl border border-[#ded7c8] bg-white">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
