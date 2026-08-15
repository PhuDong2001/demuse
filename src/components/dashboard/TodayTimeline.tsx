"use client";

import * as React from "react";
import { Clock, Location, User, FileText } from "reicon-react";
import { formatTimeDisplay, formatDuration, timeToMinutes, type ScheduleWithSubject } from "@/lib/time";
import { getSubjectColor } from "@/lib/constants";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../feedback/EmptyState";
import { useLanguage } from "@/lib/LanguageContext";

interface TodayTimelineProps {
  todayClasses: ScheduleWithSubject[];
  onOpenAddModal?: () => void;
  onEditClass?: (schedule: ScheduleWithSubject) => void;
}

export function TodayTimeline({
  todayClasses,
  onOpenAddModal,
  onEditClass,
}: TodayTimelineProps) {
  const { t } = useLanguage();
  const [currentMinutes, setCurrentMinutes] = React.useState<number>(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const n = new Date();
      setCurrentMinutes(n.getHours() * 60 + n.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (todayClasses.length === 0) {
    return (
      <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-medium text-[#1c1917]">
            {t.todaysSchedule}
          </h2>
          <span className="text-xs text-[#78716c]">0 {t.sessionCount}</span>
        </div>
        <EmptyState
          title={t.noClassesScheduledToday}
          description={t.enjoyFreeTime}
          actionLabel={t.addClassForToday}
          onAction={onOpenAddModal}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f0eae1]">
        <div>
          <h2 className="font-serif text-lg font-medium text-[#1c1917]">
            {t.todaysSchedule}
          </h2>
          <p className="text-xs text-[#78716c]">
            {todayClasses.length} {t.sessionCount}
          </p>
        </div>
      </div>

      <div className="relative space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#e6dfd1]">
        {todayClasses.map((item) => {
          const color = getSubjectColor(item.subject.color);
          const startMin = timeToMinutes(item.startTime);
          const endMin = timeToMinutes(item.endTime);
          const isOngoing = currentMinutes >= startMin && currentMinutes < endMin;
          const isPassed = currentMinutes >= endMin;

          return (
            <div
              key={item.id}
              onClick={() => onEditClass && onEditClass(item)}
              className={`relative pl-8 sm:pl-10 group cursor-pointer transition-all`}
            >
              {/* Timeline marker dot */}
              <div
                className={`absolute left-1.5 sm:left-2.5 top-3.5 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 transition-all ${
                  isOngoing
                    ? "bg-emerald-500 border-white ring-4 ring-emerald-100"
                    : isPassed
                    ? "bg-[#b8b0a4] border-white"
                    : "bg-white border-[#1c1917] group-hover:scale-125"
                }`}
                style={!isOngoing && !isPassed ? { borderColor: color.accent } : undefined}
              />

              {/* Class Card */}
              <div
                className={`rounded-xl border p-4 transition-all planner-interactive ${
                  isOngoing
                    ? "bg-[#faf9f5] border-[#1c1917] shadow-sm"
                    : isPassed
                    ? "bg-[#faf7f2]/50 border-[#ded7c8] opacity-75"
                    : "bg-white border-[#ded7c8] hover:border-[#b8ad96]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: color.accent }}
                      />
                      <h3 className="text-sm font-semibold text-[#1c1917] group-hover:text-black">
                        {item.subject.name}
                      </h3>
                      {item.subject.code && (
                        <Badge variant="subtle">{item.subject.code}</Badge>
                      )}
                      {item.type && (
                        <Badge variant="outline" className="capitalize text-[10px]">
                          {item.type}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716c]">
                      {(item.room || item.subject.room) && (
                        <span className="flex items-center gap-1">
                          <Location className="h-3 w-3" />
                          {t.room} {item.room || item.subject.room}
                        </span>
                      )}
                      {item.subject.teacher && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.subject.teacher}
                        </span>
                      )}
                      {item.subject.note && (
                        <span className="flex items-center gap-1 italic text-[#8c8275] max-w-xs truncate">
                          <FileText className="h-3 w-3" />
                          {item.subject.note}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Time Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0eae1]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1c1917]">
                      <Clock className="h-3.5 w-3.5 text-[#78716c]" />
                      <span>{formatTimeDisplay(item.startTime)} – {formatTimeDisplay(item.endTime)}</span>
                    </div>
                    <span className="text-[11px] text-[#78716c]">
                      {formatDuration(item.startTime, item.endTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
