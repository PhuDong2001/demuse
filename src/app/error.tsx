"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Refresh } from "reicon-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Demuse Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#faf7f2] text-[#1c1917]">
      <div className="max-w-md p-8 rounded-2xl border border-[#ded7c8] bg-white shadow-xs space-y-4">
        <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-xl font-medium text-[#1c1917]">
          Something went wrong
        </h1>
        <p className="text-xs text-[#78716c] leading-relaxed">
          {error.message || "An unexpected error occurred while loading your timetable."}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button onClick={() => reset()} size="sm" variant="primary" className="gap-1.5">
            <Refresh className="h-3.5 w-3.5" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
