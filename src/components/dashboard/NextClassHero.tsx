"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, Location, User, ArrowRight, CheckCircle, Sparkles, AlertCircle } from "reicon-react";
import { formatTimeDisplay, formatDuration, type ScheduleWithSubject, calculateNextClassStatus } from "@/lib/time";
import { getSubjectColor } from "@/lib/constants";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useLanguage } from "@/lib/LanguageContext";

interface NextClassHeroProps {
  schedules: ScheduleWithSubject[];
  onOpenAddModal?: () => void;
}

export function NextClassHero({ schedules, onOpenAddModal }: NextClassHeroProps) {
  const [now, setNow] = React.useState<Date>(() => new Date());
  const { t } = useLanguage();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const status = calculateNextClassStatus(schedules, now);
  const activeClass = status.currentSchedule || status.nextSchedule;
  const color = activeClass ? getSubjectColor(activeClass.subject.color) : getSubjectColor("sage");

  // Localized headline messages
  const getHeadline = () => {
    switch (status.state) {
      case "ongoing":
        return activeClass ? `${activeClass.subject.name}` : t.classInSession;
      case "upcoming":
        return activeClass ? `${activeClass.subject.name}` : t.upNext;
      case "ended_for_today":
        return t.allClassesFinished;
      case "no_classes_today":
        return t.noClassesToday;
      case "no_classes_all_week":
        return t.noClassesScheduledYet;
      default:
        return status.message;
    }
  };

  const getSubheadline = () => {
    if (status.state === "no_classes_all_week") {
      return t.addSubjectsPrompt;
    }
    if (status.state === "ended_for_today" || status.state === "no_classes_today") {
      return t.enjoyFreeTime;
    }
    return status.subMessage;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#ded7c8] bg-white p-6 sm:p-8 shadow-xs">
      {/* Decorative subtle background tint */}
      {activeClass && (
        <div
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: color.accent }}
        />
      )}

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-3 max-w-2xl">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            {status.state === "ongoing" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-semibold border border-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-600 pulse-marker" />
                {t.classInSession}
              </span>
            )}
            {status.state === "upcoming" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-2.5 py-0.5 text-xs font-semibold border border-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-600 pulse-marker" />
                {t.upNext}
              </span>
            )}
            {status.state === "ended_for_today" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ede8dc] text-[#57534e] px-2.5 py-0.5 text-xs font-semibold">
                <CheckCircle className="h-3.5 w-3.5 text-[#78716c]" />
                {t.allClassesFinished}
              </span>
            )}
            {status.state === "no_classes_today" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ede8dc] text-[#57534e] px-2.5 py-0.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-[#78716c]" />
                {t.noClassesToday}
              </span>
            )}
            {status.state === "no_classes_all_week" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ede8dc] text-[#57534e] px-2.5 py-0.5 text-xs font-semibold">
                <AlertCircle className="h-3.5 w-3.5 text-[#78716c]" />
                {t.welcomeToDemuse}
              </span>
            )}

            {activeClass?.subject.code && (
              <Badge variant="subtle">{activeClass.subject.code}</Badge>
            )}
            {activeClass?.type && (
              <Badge variant="outline" className="capitalize">
                {activeClass.type}
              </Badge>
            )}
          </div>

          {/* Headline & Details */}
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1917]">
              {getHeadline()}
            </h1>
            <p className="mt-1 text-sm text-[#78716c] font-normal leading-relaxed">
              {getSubheadline()}
            </p>
          </div>

          {/* Quick class metadata meta pills */}
          {activeClass && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#57534e] pt-1">
              <div className="flex items-center gap-1.5 bg-[#faf7f2] px-2.5 py-1 rounded-lg border border-[#e6dfd1]">
                <Clock className="h-3.5 w-3.5 text-[#78716c]" />
                <span>
                  {formatTimeDisplay(activeClass.startTime)} – {formatTimeDisplay(activeClass.endTime)} ({formatDuration(activeClass.startTime, activeClass.endTime)})
                </span>
              </div>

              {(activeClass.room || activeClass.subject.room) && (
                <div className="flex items-center gap-1.5 bg-[#faf7f2] px-2.5 py-1 rounded-lg border border-[#e6dfd1]">
                  <Location className="h-3.5 w-3.5 text-[#78716c]" />
                  <span>{t.room} {activeClass.room || activeClass.subject.room}</span>
                </div>
              )}

              {activeClass.subject.teacher && (
                <div className="flex items-center gap-1.5 bg-[#faf7f2] px-2.5 py-1 rounded-lg border border-[#e6dfd1]">
                  <User className="h-3.5 w-3.5 text-[#78716c]" />
                  <span>{activeClass.subject.teacher}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2.5">
          <Link href="/timetable">
            <Button variant="outline" size="md" className="gap-1.5 group">
              <span>{t.viewFullWeek}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>

          {status.state === "no_classes_all_week" && onOpenAddModal && (
            <Button onClick={onOpenAddModal} size="md" className="gap-1.5">
              {t.addFirstClass}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
