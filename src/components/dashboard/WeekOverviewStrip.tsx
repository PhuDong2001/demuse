"use client";

import * as React from "react";
import Link from "next/link";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { getDemuseDayOfWeek, getDurationMinutes, type ScheduleWithSubject } from "@/lib/time";
import { useLanguage } from "@/lib/LanguageContext";

interface WeekOverviewStripProps {
  schedules: ScheduleWithSubject[];
}

export function WeekOverviewStrip({ schedules }: WeekOverviewStripProps) {
  const [currentDay] = React.useState<number>(() => getDemuseDayOfWeek(new Date()));
  const { t } = useLanguage();

  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

  return (
    <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f0eae1]">
        <div>
          <h2 className="font-serif text-base font-medium text-[#1c1917]">
            {t.weeklyWorkload}
          </h2>
          <p className="text-[11px] text-[#78716c]">
            {t.workloadSub}
          </p>
        </div>
        <Link
          href="/timetable"
          className="text-xs font-semibold text-[#1c1917] hover:underline shrink-0"
        >
          {t.openPlanner} →
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {DAYS_OF_WEEK.map((day, idx) => {
          const daySchedules = schedules.filter((s) => s.dayOfWeek === day.number);
          const isToday = day.number === currentDay;
          const totalMinutes = daySchedules.reduce(
            (acc, curr) => acc + getDurationMinutes(curr.startTime, curr.endTime),
            0
          );
          const totalHours = (totalMinutes / 60).toFixed(1).replace(".0", "");
          const dayTrans = t.days[dayKeys[idx]];

          return (
            <Link
              key={day.number}
              href={`/timetable?day=${day.number}`}
              className={`flex flex-col items-center justify-between py-2 px-0.5 rounded-lg border transition-all text-center group min-w-0 ${
                isToday
                  ? "bg-[#faf9f5] border-[#1c1917] ring-1 ring-[#1c1917]"
                  : daySchedules.length > 0
                  ? "bg-white border-[#ded7c8] hover:border-[#b8ad96] hover:bg-[#faf7f2]"
                  : "bg-white border-[#ded7c8] hover:border-[#b8ad96] hover:bg-[#faf7f2]"
              }`}
            >
              <div className="w-full">
                <span
                  className={`text-[10px] font-bold uppercase block tracking-tight ${
                    isToday ? "text-[#1c1917]" : "text-[#78716c]"
                  }`}
                >
                  {dayTrans ? dayTrans.short : day.short}
                </span>

                <div className="my-1">
                  <span className="text-base sm:text-lg font-serif font-semibold text-[#1c1917] block leading-tight">
                    {daySchedules.length}
                  </span>
                </div>
              </div>

              {daySchedules.length > 0 ? (
                <span className="text-[9px] font-semibold text-[#57534e] bg-[#ede8dc]/80 px-1 py-0.5 rounded block w-full truncate leading-none">
                  {totalHours}h
                </span>
              ) : (
                <span className="text-[9px] text-[#a8a29e] block leading-none py-0.5">{t.offDay}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
