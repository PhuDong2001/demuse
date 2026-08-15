"use client";

import * as React from "react";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { type ScheduleWithSubject } from "@/lib/time";
import { ClassCard } from "./ClassCard";
import { Plus } from "reicon-react";
import { useLanguage } from "@/lib/LanguageContext";

interface WeeklyTimetableGridProps {
  schedules: ScheduleWithSubject[];
  onAddClassForDay: (dayNumber: number) => void;
  onEditClass: (schedule: ScheduleWithSubject) => void;
  onDuplicateClass: (scheduleId: string) => void;
  onDeleteClass: (scheduleId: string) => void;
  showWeekends?: boolean;
}

export function WeeklyTimetableGrid({
  schedules,
  onAddClassForDay,
  onEditClass,
  onDuplicateClass,
  onDeleteClass,
  showWeekends = false,
}: WeeklyTimetableGridProps) {
  const { t } = useLanguage();
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
  const days = showWeekends ? DAYS_OF_WEEK : DAYS_OF_WEEK.slice(0, 5);

  return (
    <div
      className={`grid gap-2.5 sm:gap-3.5 w-full ${
        showWeekends
          ? "grid-cols-1 md:grid-cols-7"
          : "grid-cols-1 md:grid-cols-5"
      }`}
    >
      {days.map((day, idx) => {
        const daySchedules = schedules
          .filter((s) => s.dayOfWeek === day.number)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
        const dayTrans = t.days[dayKeys[idx]];

        return (
          <div
            key={day.number}
            className="flex flex-col rounded-2xl border border-[#ded7c8] bg-white p-2.5 sm:p-3 shadow-2xs transition-all min-h-[360px]"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f0eae1]">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ede8dc] text-xs font-bold text-[#1c1917]">
                  {dayTrans ? dayTrans.letter : day.letter}
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                    {dayTrans ? dayTrans.full : day.full}
                  </h3>
                  <span className="text-[10px] text-[#78716c]">
                    {daySchedules.length} {t.weeklySessions}
                  </span>
                </div>
              </div>

              {/* Quick add for this day */}
              <button
                type="button"
                onClick={() => onAddClassForDay(day.number)}
                className="p-1 rounded-md text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] transition-colors cursor-pointer"
                title={`${t.addClass} (${dayTrans ? dayTrans.full : day.full})`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Class Cards List */}
            <div className="flex-1 space-y-2.5 overflow-y-auto">
              {daySchedules.length === 0 ? (
                <div
                  onClick={() => onAddClassForDay(day.number)}
                  className="flex flex-col items-center justify-center h-32 rounded-xl border border-dashed border-[#e6dfd1] bg-[#faf7f2]/40 hover:bg-[#faf7f2] hover:border-[#b8ad96] cursor-pointer transition-all text-center p-3 group"
                >
                  <Plus className="h-4 w-4 text-[#a8a29e] group-hover:text-[#1c1917] transition-colors mb-1" />
                  <span className="text-[11px] text-[#8c8275] group-hover:text-[#1c1917] font-medium">
                    {t.noClassesOnDay}
                  </span>
                  <span className="text-[9px] text-[#b8b0a4]">{t.clickToAdd}</span>
                </div>
              ) : (
                daySchedules.map((schedule) => (
                  <ClassCard
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={onEditClass}
                    onDuplicate={onDuplicateClass}
                    onDelete={onDeleteClass}
                    compact={showWeekends}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
