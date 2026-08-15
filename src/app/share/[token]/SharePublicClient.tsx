"use client";

import * as React from "react";
import Link from "next/link";
import { DAYS_OF_WEEK, getSubjectColor } from "@/lib/constants";
import { formatTimeDisplay, getDemuseDayOfWeek, type ScheduleWithSubject } from "@/lib/time";
import { Clock, Location, User, ArrowRight, Sparkles } from "reicon-react";
import { Button } from "@/components/ui/Button";

interface SharePublicClientProps {
  timetable: {
    id: string;
    name: string;
    description: string | null;
    academicTerm: string | null;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
  };
  schedules: ScheduleWithSubject[];
}

export function SharePublicClient({ timetable, schedules }: SharePublicClientProps) {
  const currentTodayNumber = getDemuseDayOfWeek(new Date());
  const [selectedMobileDay, setSelectedMobileDay] = React.useState<number>(currentTodayNumber);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917]">
      {/* Header */}
      <header className="border-b border-[#e8e1d5] bg-[#faf7f2]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c1917] text-[#faf7f2] font-serif font-bold text-base shadow-xs">
              D
            </div>
            <span className="font-serif text-xl font-medium tracking-tight text-[#1c1917]">
              Demuse
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#78716c]">
              <Sparkles className="h-3.5 w-3.5 text-[#854d0e]" />
              Shared Timetable Preview
            </span>
            <Link href="/register">
              <Button size="sm" variant="primary" className="gap-1.5 shadow-xs">
                <span>Create Your Timetable</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title & Author card */}
        <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 sm:p-8 shadow-xs space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {timetable.academicTerm && (
              <span className="rounded-full bg-[#ede8dc] px-2.5 py-0.5 text-xs font-semibold text-[#57534e] border border-[#ded7c8]">
                {timetable.academicTerm}
              </span>
            )}
            <span className="text-xs text-[#78716c]">
              Created by <strong className="text-[#1c1917] font-semibold">{timetable.user.name}</strong>
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-[#1c1917]">
            {timetable.name}
          </h1>

          {timetable.description && (
            <p className="text-sm text-[#78716c] max-w-2xl leading-relaxed">
              {timetable.description}
            </p>
          )}
        </div>

        {/* Desktop Weekly Grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-3.5">
          {DAYS_OF_WEEK.slice(0, 5).map((day) => {
            const daySchedules = schedules
              .filter((s) => s.dayOfWeek === day.number)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={day.number}
                className="flex flex-col rounded-2xl border border-[#ded7c8] bg-white p-3.5 shadow-2xs min-h-[480px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f0eae1]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ede8dc] text-xs font-bold text-[#1c1917]">
                      {day.letter}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                        {day.full}
                      </h3>
                      <span className="text-[10px] text-[#78716c]">
                        {daySchedules.length} {daySchedules.length === 1 ? "class" : "classes"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {daySchedules.length === 0 ? (
                    <div className="flex items-center justify-center h-28 rounded-xl border border-dashed border-[#e6dfd1] bg-[#faf7f2]/40 text-center p-3 text-[11px] text-[#8c8275]">
                      No classes scheduled
                    </div>
                  ) : (
                    daySchedules.map((item) => {
                      const color = getSubjectColor(item.subject.color);
                      return (
                        <div
                          key={item.id}
                          className={`rounded-xl border p-3 text-left ${color.bg} ${color.border}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            {item.subject.code && (
                              <span
                                className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md"
                                style={{ backgroundColor: color.dot, color: "#ffffff" }}
                              >
                                {item.subject.code}
                              </span>
                            )}
                            {item.type && (
                              <span className={`text-[10px] font-semibold uppercase capitalize ${color.text}`}>
                                {item.type}
                              </span>
                            )}
                          </div>

                          <h4 className={`text-xs font-semibold ${color.text}`}>
                            {item.subject.name}
                          </h4>

                          <div className="flex items-center gap-1 text-[11px] font-medium text-[#57534e] mt-1.5">
                            <Clock className="h-3 w-3 text-[#78716c] shrink-0" />
                            <span>
                              {formatTimeDisplay(item.startTime)} – {formatTimeDisplay(item.endTime)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#6b645b] mt-1">
                            {(item.room || item.subject.room) && (
                              <span className="flex items-center gap-1">
                                <Location className="h-3 w-3" />
                                {item.room || item.subject.room}
                              </span>
                            )}
                            {item.subject.teacher && (
                              <span className="flex items-center gap-1 truncate max-w-[120px]">
                                <User className="h-3 w-3" />
                                {item.subject.teacher}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {DAYS_OF_WEEK.slice(0, 5).map((day) => {
              const isSelected = day.number === selectedMobileDay;
              const count = schedules.filter((s) => s.dayOfWeek === day.number).length;

              return (
                <button
                  key={day.number}
                  type="button"
                  onClick={() => setSelectedMobileDay(day.number)}
                  className={`flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-[#1c1917] text-[#faf7f2] border-[#1c1917] shadow-sm"
                      : "bg-white text-[#57534e] border-[#ded7c8]"
                  }`}
                >
                  <span className="text-xs font-bold uppercase">{day.short}</span>
                  <span className="text-[10px] mt-0.5 opacity-80">
                    {count > 0 ? `${count}` : "—"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {schedules
              .filter((s) => s.dayOfWeek === selectedMobileDay)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((item) => {
                const color = getSubjectColor(item.subject.color);
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-4 ${color.bg} ${color.border}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {item.subject.code && (
                          <span
                            className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: color.dot, color: "#ffffff" }}
                          >
                            {item.subject.code}
                          </span>
                        )}
                        {item.type && (
                          <span className={`text-[10px] font-semibold uppercase capitalize ${color.text}`}>
                            {item.type}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-[#1c1917]">
                        <Clock className="h-3.5 w-3.5 text-[#78716c]" />
                        <span>
                          {formatTimeDisplay(item.startTime)} – {formatTimeDisplay(item.endTime)}
                        </span>
                      </div>
                    </div>

                    <h3 className={`text-sm font-semibold ${color.text}`}>
                      {item.subject.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b645b] mt-2">
                      {(item.room || item.subject.room) && (
                        <span className="flex items-center gap-1">
                          <Location className="h-3.5 w-3.5" />
                          Room {item.room || item.subject.room}
                        </span>
                      )}
                      {item.subject.teacher && (
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {item.subject.teacher}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}
