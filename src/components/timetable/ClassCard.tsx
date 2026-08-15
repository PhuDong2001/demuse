import * as React from "react";
import { More, Edit2, Copy, Trash2, Location, User, Clock } from "reicon-react";
import { formatTimeDisplay, type ScheduleWithSubject } from "@/lib/time";
import { getSubjectColor } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ClassCardProps {
  schedule: ScheduleWithSubject;
  onEdit: (schedule: ScheduleWithSubject) => void;
  onDuplicate: (scheduleId: string) => void;
  onDelete: (scheduleId: string) => void;
  compact?: boolean;
}

export function ClassCard({
  schedule,
  onEdit,
  onDuplicate,
  onDelete,
  compact = false,
}: ClassCardProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const color = getSubjectColor(schedule.subject.color);

  return (
    <div
      className={cn(
        "group relative rounded-xl border transition-all text-left planner-interactive overflow-hidden",
        color.bg,
        color.border,
        compact ? "p-2.5" : "p-3.5"
      )}
    >
      {/* Top row: Code / Type badge & Action menu */}
      <div className="flex items-start justify-between gap-1.5 mb-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {schedule.subject.code && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ backgroundColor: color.dot, color: "#ffffff" }}
            >
              {schedule.subject.code}
            </span>
          )}
          {schedule.type && (
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider capitalize opacity-80",
                color.text
              )}
            >
              {schedule.type}
            </span>
          )}
        </div>

        {/* Action Menu button */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1 rounded-md text-[#57534e] hover:text-[#1c1917] hover:bg-white/60 transition-colors opacity-0 group-hover:opacity-100 sm:opacity-0 focus:opacity-100 cursor-pointer"
            aria-label="Class actions"
          >
            <More className="h-3.5 w-3.5" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              />
              <div className="absolute right-0 top-6 w-36 rounded-lg border border-[#ded7c8] bg-white p-1 shadow-lg z-40 animate-in fade-in duration-100 text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onEdit(schedule);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[#1c1917] hover:bg-[#f5f1e9] rounded-md transition-colors text-left cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-[#78716c]" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onDuplicate(schedule.id);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[#1c1917] hover:bg-[#f5f1e9] rounded-md transition-colors text-left cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 text-[#78716c]" />
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onDelete(schedule.id);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors text-left cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Subject Name */}
      <h4
        onClick={() => onEdit(schedule)}
        className={cn(
          "font-semibold leading-snug cursor-pointer hover:underline",
          color.text,
          compact ? "text-xs" : "text-sm"
        )}
      >
        {schedule.subject.name}
      </h4>

      {/* Time display */}
      <div className="flex items-center gap-1 text-[11px] font-medium text-[#57534e] mt-1.5">
        <Clock className="h-3 w-3 text-[#78716c] shrink-0" />
        <span>
          {formatTimeDisplay(schedule.startTime)} – {formatTimeDisplay(schedule.endTime)}
        </span>
      </div>

      {/* Location / Teacher */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#6b645b] mt-1">
        {(schedule.room || schedule.subject.room) && (
          <span className="flex items-center gap-1 font-medium">
            <Location className="h-3 w-3 text-[#8c8275] shrink-0" />
            {schedule.room || schedule.subject.room}
          </span>
        )}
        {schedule.subject.teacher && (
          <span className="flex items-center gap-1 truncate max-w-[140px]">
            <User className="h-3 w-3 text-[#8c8275] shrink-0" />
            {schedule.subject.teacher}
          </span>
        )}
      </div>

      {/* Note preview if any and not compact */}
      {!compact && schedule.subject.note && (
        <p className="text-[10px] text-[#78716c] italic mt-1.5 line-clamp-1 border-t border-black/5 pt-1">
          {schedule.subject.note}
        </p>
      )}
    </div>
  );
}
