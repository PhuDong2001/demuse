"use client";

import * as React from "react";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { type ScheduleWithSubject, timeToMinutes, formatTimeDisplay } from "@/lib/time";
import { getSubjectColor } from "@/lib/constants";
import { Plus, Clock, Location, User, Edit2, Trash2, Copy } from "reicon-react";
import { useLanguage } from "@/lib/LanguageContext";

interface WeeklyTimelineGridProps {
  schedules: ScheduleWithSubject[];
  onAddClassForDay: (dayNumber: number) => void;
  onEditClass: (schedule: ScheduleWithSubject) => void;
  onDuplicateClass: (scheduleId: string) => void;
  onDeleteClass: (scheduleId: string) => void;
  showWeekends?: boolean;
}

export function WeeklyTimelineGrid({
  schedules,
  onAddClassForDay,
  onEditClass,
  onDuplicateClass,
  onDeleteClass,
  showWeekends = true,
}: WeeklyTimelineGridProps) {
  const { t } = useLanguage();
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
  const days = showWeekends ? DAYS_OF_WEEK : DAYS_OF_WEEK.slice(0, 5);

  // Full 24-Hour Day: from 00:00 to 24:00 (24 hours)
  const START_HOUR = 0;
  const END_HOUR = 24;
  const TOTAL_HOURS = END_HOUR - START_HOUR;
  const HOUR_HEIGHT = 60; // 60px per hour = 1px per minute
  const TOTAL_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT;

  const hoursArray = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to morning view (e.g. 06:00) on initial render
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      // 6:00 is 6 * 60px = 360px
      scrollContainerRef.current.scrollTop = 360;
    }
  }, []);

  return (
    <div className="w-full rounded-2xl border border-[#ded7c8] bg-white shadow-xs overflow-hidden">
      {/* Scrollable Container with fixed height for full day scrolling */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-auto max-h-[750px] relative scroll-smooth"
      >
        <div className="min-w-[780px]">
          {/* Sticky Header Row: Days of Week */}
          <div
            className="grid border-b border-[#ded7c8] bg-[#faf7f2]/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs"
            style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}
          >
            {/* Top-left icon header */}
            <div className="h-12 border-r border-[#ded7c8] flex items-center justify-center text-[11px] font-semibold text-[#8c8275] bg-[#faf7f2]">
              <Clock className="h-4 w-4" />
            </div>

            {/* Day columns headers */}
            {days.map((day, idx) => {
              const dayTrans = t.days[dayKeys[idx]];
              const count = schedules.filter((s) => s.dayOfWeek === day.number).length;

              return (
                <div
                  key={day.number}
                  className="h-12 px-2.5 border-r border-[#ded7c8] last:border-r-0 flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-[#1c1917] truncate">
                      {dayTrans ? dayTrans.full : day.full}
                    </span>
                    {count > 0 && (
                      <span className="h-4 min-w-[16px] px-1 rounded-full bg-[#ede8dc] text-[10px] font-bold text-[#57534e] flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddClassForDay(day.number)}
                    className="p-1 rounded-md text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] transition-colors cursor-pointer shrink-0"
                    title={`${t.addClass} (${dayTrans ? dayTrans.short : day.short})`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Grid Body with Time Labels + Columns */}
          <div
            className="relative grid bg-white"
            style={{
              gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))`,
              height: `${TOTAL_HEIGHT}px`,
            }}
          >
            {/* Time Axis Column */}
            <div className="relative border-r border-[#ded7c8] bg-[#faf7f2]/50 select-none">
              {hoursArray.map((hour, idx) => {
                const hourFormatted = `${hour.toString().padStart(2, "0")}:00`;
                // Center the text vertically across the line without being cut off
                return (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 -translate-y-1/2 pr-2 text-right text-[11px] font-semibold text-[#8c8275]"
                    style={{ top: `${idx * HOUR_HEIGHT}px` }}
                  >
                    {hourFormatted}
                  </div>
                );
              })}
            </div>

            {/* Day Columns */}
            {days.map((day) => {
              const daySchedules = schedules.filter((s) => s.dayOfWeek === day.number);
              const isWeekend = day.number === 6 || day.number === 7;

              return (
                <div
                  key={day.number}
                  className={`relative border-r border-[#ded7c8] last:border-r-0 h-full group/col transition-colors ${
                    isWeekend ? "bg-[#faf8f4]/60" : "bg-white"
                  }`}
                >
                  {/* Horizontal Hour Guideline Rows */}
                  {hoursArray.map((hour, idx) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-[#f0eae1] pointer-events-none"
                      style={{ top: `${idx * HOUR_HEIGHT}px` }}
                    />
                  ))}

                  {/* Half-hour dashed guide (Every 30 minutes) */}
                  {hoursArray.slice(0, -1).map((hour, idx) => (
                    <div
                      key={`half-${hour}`}
                      className="absolute left-0 right-0 border-t border-dashed border-[#f5f1e9] pointer-events-none"
                      style={{ top: `${idx * HOUR_HEIGHT + HOUR_HEIGHT / 2}px` }}
                    />
                  ))}

                  {/* Scheduled Class Cards (Positioned exactly by start and end minutes) */}
                  {daySchedules.map((schedule) => {
                    const startMin = timeToMinutes(schedule.startTime);
                    const endMin = timeToMinutes(schedule.endTime);
                    const color = getSubjectColor(schedule.subject.color);

                    // Exact 1px per minute placement
                    const topPx = (startMin / 60) * HOUR_HEIGHT;
                    const durationMin = Math.max(endMin - startMin, 30);
                    const heightPx = Math.max((durationMin / 60) * HOUR_HEIGHT - 2, 38);

                    return (
                      <div
                        key={schedule.id}
                        onClick={() => onEditClass(schedule)}
                        style={{
                          top: `${topPx}px`,
                          height: `${heightPx}px`,
                          backgroundColor: color.bg,
                          borderColor: color.border,
                        }}
                        className="absolute left-1 right-1 rounded-xl border p-2 text-left cursor-pointer shadow-xs transition-all hover:shadow-md hover:z-20 group overflow-hidden flex flex-col justify-between"
                      >
                        {/* Left solid color accent bar */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                          style={{ backgroundColor: color.accent }}
                        />

                        <div className="pl-1.5 space-y-0.5 min-w-0">
                          {/* Subject Name & Actions */}
                          <div className="flex items-start justify-between gap-1">
                            <h4
                              className="text-xs font-semibold truncate leading-tight"
                              style={{ color: color.text }}
                            >
                              {schedule.subject.name}
                            </h4>

                            {/* Quick Action Icons on Hover */}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-white/90 rounded px-1 -mr-1 -mt-0.5 border border-black/5 shadow-2xs">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditClass(schedule);
                                }}
                                className="p-0.5 text-[#57534e] hover:text-[#1c1917] transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDuplicateClass(schedule.id);
                                }}
                                className="p-0.5 text-[#57534e] hover:text-[#1c1917] transition-colors"
                                title="Duplicate"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteClass(schedule.id);
                                }}
                                className="p-0.5 text-red-600 hover:text-red-800 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* 24-Hour Time info */}
                          <div
                            className="flex items-center gap-1 text-[11px] font-medium leading-none"
                            style={{ color: color.text }}
                          >
                            <Clock className="h-3 w-3 shrink-0 opacity-70" />
                            <span>
                              {formatTimeDisplay(schedule.startTime)} – {formatTimeDisplay(schedule.endTime)}
                            </span>
                          </div>

                          {/* Room / Teacher */}
                          {(schedule.room || schedule.subject.room || schedule.subject.teacher) && (
                            <div
                              className="flex items-center gap-2 text-[10px] opacity-85 truncate pt-0.5"
                              style={{ color: color.text }}
                            >
                              {(schedule.room || schedule.subject.room) && (
                                <span className="flex items-center gap-0.5 truncate">
                                  <Location className="h-2.5 w-2.5 shrink-0" />
                                  {schedule.room || schedule.subject.room}
                                </span>
                              )}
                              {schedule.subject.teacher && (
                                <span className="flex items-center gap-0.5 truncate">
                                  <User className="h-2.5 w-2.5 shrink-0" />
                                  {schedule.subject.teacher}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
