"use client";

import * as React from "react";
import Link from "next/link";
import { DAYS_OF_WEEK, getSubjectColor } from "@/lib/constants";
import { formatTimeDisplay, getDemuseDayOfWeek, type ScheduleWithSubject } from "@/lib/time";
import { Clock, Location, User, ArrowRight, Sparkles, Share, Check } from "reicon-react";
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
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917]">
      {/* Header */}
      <header className="border-b border-[#e8e1d5] bg-[#faf7f2]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c1917] text-[#faf7f2] font-serif font-bold text-base shadow-xs">
              D
            </div>
            <span className="font-serif text-xl font-medium tracking-tight text-[#1c1917]">
              Demuse
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="gap-1.5 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </Button>

            <Link href="/register">
              <Button size="sm" variant="primary" className="gap-1.5 shadow-xs">
                <span>Create Your Own</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Title & Author card */}
        <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
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

            <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1917]">
              {timetable.name}
            </h1>

            {timetable.description && (
              <p className="text-xs sm:text-sm text-[#78716c] max-w-2xl leading-relaxed">
                {timetable.description}
              </p>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf7f2] border border-[#ded7c8] text-xs font-medium text-[#78716c] self-start sm:self-auto">
            <Sparkles className="h-3.5 w-3.5 text-[#854d0e]" />
            <span>Public Read-Only Schedule</span>
          </div>
        </div>

        {/* Desktop Weekly Grid (All 7 Days) */}
        <div className="hidden md:grid md:grid-cols-7 gap-3 w-full">
          {DAYS_OF_WEEK.map((day) => {
            const daySchedules = schedules
              .filter((s) => s.dayOfWeek === day.number)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));
            const isWeekend = day.number === 6 || day.number === 7;

            return (
              <div
                key={day.number}
                className={`flex flex-col rounded-2xl border border-[#ded7c8] p-3 shadow-2xs min-h-[380px] transition-colors ${
                  isWeekend ? "bg-[#fcfaf7]" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#f0eae1]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ede8dc] text-xs font-bold text-[#1c1917] shrink-0">
                      {day.letter}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1917] truncate">
                        {day.full}
                      </h3>
                      <span className="text-[10px] text-[#78716c] block">
                        {daySchedules.length} {daySchedules.length === 1 ? "class" : "classes"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {daySchedules.length === 0 ? (
                    <div className="flex items-center justify-center h-24 rounded-xl border border-dashed border-[#e6dfd1] bg-[#faf7f2]/40 text-center p-3 text-[11px] text-[#8c8275]">
                      No classes
                    </div>
                  ) : (
                    daySchedules.map((item) => {
                      const color = getSubjectColor(item.subject.color);
                      return (
                        <div
                          key={item.id}
                          style={{
                            backgroundColor: color.bgHex,
                            borderColor: color.borderHex,
                          }}
                          className="rounded-xl border p-2.5 text-left shadow-2xs relative overflow-hidden"
                        >
                          {/* Accent Bar */}
                          <div
                            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                            style={{ backgroundColor: color.accent }}
                          />

                          <div className="pl-1 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: color.dot, color: "#ffffff" }}
                              >
                                {item.subject.code || item.type || "Class"}
                              </span>

                              <span
                                className="text-[10px] font-semibold text-[#57534e] flex items-center gap-1"
                              >
                                <Clock className="h-2.5 w-2.5 shrink-0 text-[#78716c]" />
                                {formatTimeDisplay(item.startTime)} – {formatTimeDisplay(item.endTime)}
                              </span>
                            </div>

                            <h4
                              style={{ color: color.textHex }}
                              className="text-xs font-semibold leading-tight break-words"
                            >
                              {item.subject.name}
                            </h4>

                            {(item.room || item.subject.room || item.subject.teacher) && (
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[#6b645b] pt-0.5 border-t border-black/5">
                                {(item.room || item.subject.room) && (
                                  <span className="flex items-center gap-0.5 truncate">
                                    <Location className="h-2.5 w-2.5 text-[#8c8275] shrink-0" />
                                    {item.room || item.subject.room}
                                  </span>
                                )}
                                {item.subject.teacher && (
                                  <span className="flex items-center gap-0.5 truncate">
                                    <User className="h-2.5 w-2.5 text-[#8c8275] shrink-0" />
                                    {item.subject.teacher}
                                  </span>
                                )}
                              </div>
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

        {/* Mobile View (7 Days Tabs) */}
        <div className="block md:hidden space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = day.number === selectedMobileDay;
              const count = schedules.filter((s) => s.dayOfWeek === day.number).length;

              return (
                <button
                  key={day.number}
                  type="button"
                  onClick={() => setSelectedMobileDay(day.number)}
                  className={`flex-1 min-w-[50px] flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${
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

          <div className="space-y-2.5">
            {schedules.filter((s) => s.dayOfWeek === selectedMobileDay).length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-[#ded7c8] bg-white text-center text-xs text-[#78716c]">
                No classes scheduled on this day
              </div>
            ) : (
              schedules
                .filter((s) => s.dayOfWeek === selectedMobileDay)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((item) => {
                  const color = getSubjectColor(item.subject.color);
                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: color.bgHex,
                        borderColor: color.borderHex,
                      }}
                      className="rounded-xl border p-3.5 shadow-2xs relative overflow-hidden"
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                        style={{ backgroundColor: color.accent }}
                      />

                      <div className="pl-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: color.dot, color: "#ffffff" }}
                          >
                            {item.subject.code || item.type || "Class"}
                          </span>

                          <div className="flex items-center gap-1 text-xs font-semibold text-[#1c1917]">
                            <Clock className="h-3.5 w-3.5 text-[#78716c]" />
                            <span>
                              {formatTimeDisplay(item.startTime)} – {formatTimeDisplay(item.endTime)}
                            </span>
                          </div>
                        </div>

                        <h3
                          style={{ color: color.textHex }}
                          className="text-sm font-semibold leading-tight break-words"
                        >
                          {item.subject.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b645b] pt-1">
                          {(item.room || item.subject.room) && (
                            <span className="flex items-center gap-1">
                              <Location className="h-3.5 w-3.5 text-[#8c8275]" />
                              {item.room || item.subject.room}
                            </span>
                          )}
                          {item.subject.teacher && (
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-[#8c8275]" />
                              {item.subject.teacher}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
