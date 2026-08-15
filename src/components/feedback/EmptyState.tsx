import * as React from "react";
import { Calendar, Plus } from "reicon-react";
import { Button } from "../ui/Button";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Your week is wide open",
  description = "No classes scheduled yet. Add your courses and lectures to bring your timetable to life.",
  actionLabel = "Add your first class",
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[#d8cfbe] bg-[#faf7f2]/60">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ede8dc] text-[#57534e] mb-4">
        {icon || <Calendar className="h-6 w-6 text-[#78716c]" />}
      </div>
      <h3 className="text-lg font-serif font-medium text-[#1c1917] tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-[#78716c] max-w-sm mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && actionLabel && (
        <Button onClick={onAction} size="md" className="gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
