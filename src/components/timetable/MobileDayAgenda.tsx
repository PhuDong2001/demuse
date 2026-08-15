"use client";

import * as React from "react";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { getDemuseDayOfWeek, type ScheduleWithSubject } from "@/lib/time";
import { ClassCard } from "./ClassCard";
import { Plus } from "reicon-react";
import { EmptyState } from "../feedback/EmptyState";
import { Button } from "../ui/Button";
import { useLanguage } from "@/lib/LanguageContext";

interface MobileDayAgendaProps {
  schedules: ScheduleWithSubject[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onAddClassForDay: (dayNumber: number) => void;
  onEditClass: (schedule: ScheduleWithSubject) => void;
  onDuplicateClass: (scheduleId: string) => void;
  onDeleteClass: (scheduleId: string) => void;
}

export function MobileDayAgenda({
  schedules,
  selectedDay,
  onSelectDay,
  onAddClassForDay,
  onEditClass,
  onDuplicateClass,
  onDeleteClass,
}: MobileDayAgendaProps) {
  const { t } = useLanguage();
  const currentTodayNumber = getDemuseDayOfWeek(new Date());

  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
  const dayIndex = DAYS_OF_WEEK.findIndex((d) => d.number === selectedDay);
  const dayInfo = DAYS_OF_WEEK[dayIndex >= 0 ? dayIndex : 0];
  const dayTrans = t.days[dayKeys[dayIndex >= 0 ? dayIndex : 0]];

  const daySchedules = schedules
    .filter((s) => s.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-4">
      {/* Day Selector Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {DAYS_OF_WEEK.map((day, idx) => {
          const isSelected = day.number === selectedDay;
          const isToday = day.number === currentTodayNumber;
          const count = schedules.filter((s) => s.dayOfWeek === day.number).length;
          const dTrans = t.days[dayKeys[idx]];

          return (
            <button
              key={day.number}
              type="button"
              onClick={() => onSelectDay(day.number)}
              className={`flex-1 min-w-[48px] flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#1c1917] text-[#faf7f2] border-[#1c1917] shadow-sm"
                  : "bg-white text-[#57534e] border-[#ded7c8] hover:border-[#b8ad96]"
              }`}
            >
              <div className="flex items-center gap-0.5">
                <span className="text-[11px] font-bold uppercase">{dTrans ? dTrans.short : day.short}</span>
                {isToday && (
                  <span
                    className={`h-1 w-1 rounded-full ${
                      isSelected ? "bg-emerald-400" : "bg-emerald-600"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 font-medium ${
                  isSelected ? "text-stone-300" : "text-[#8c8275]"
                }`}
              >
                {count > 0 ? `${count}` : "—"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Agenda Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="font-serif text-lg font-medium text-[#1c1917]">
            {dayTrans ? dayTrans.full : dayInfo.full}
          </h3>
          <p className="text-xs text-[#78716c]">
            {daySchedules.length} {t.sessionCount}
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddClassForDay(selectedDay)}
          className="gap-1 shadow-2xs"
        >
          <Plus className="h-3.5 w-3.5" />
          {t.addClass}
        </Button>
      </div>

      {/* Classes list */}
      <div className="space-y-3">
        {daySchedules.length === 0 ? (
          <EmptyState
            title={`${t.noClassesOnDay} (${dayTrans ? dayTrans.full : dayInfo.full})`}
            description={t.freeDayMessage}
            actionLabel={`${t.addClass} (${dayTrans ? dayTrans.short : dayInfo.short})`}
            onAction={() => onAddClassForDay(selectedDay)}
          />
        ) : (
          daySchedules.map((schedule) => (
            <ClassCard
              key={schedule.id}
              schedule={schedule}
              onEdit={onEditClass}
              onDuplicate={onDuplicateClass}
              onDelete={onDeleteClass}
            />
          ))
        )}
      </div>
    </div>
  );
}
