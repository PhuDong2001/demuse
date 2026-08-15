"use client";

import * as React from "react";
import { NextClassHero } from "@/components/dashboard/NextClassHero";
import { TodayTimeline } from "@/components/dashboard/TodayTimeline";
import { WeekOverviewStrip } from "@/components/dashboard/WeekOverviewStrip";
import { ClassFormModal } from "@/components/timetable/ClassFormModal";
import { getDemuseDayOfWeek, type ScheduleWithSubject } from "@/lib/time";
import { Plus } from "reicon-react";
import { Button } from "@/components/ui/Button";
import type { Subject, Timetable } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  timetable: Timetable;
  subjects: Subject[];
  schedules: ScheduleWithSubject[];
}

export function DashboardClient({
  user,
  timetable,
  subjects,
  schedules,
}: DashboardClientProps) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<ScheduleWithSubject | null>(null);
  const [modalDefaultDay, setModalDefaultDay] = React.useState<number>(1);

  const todayNumber = getDemuseDayOfWeek(new Date());
  const todayClasses = schedules
    .filter((s) => s.dayOfWeek === todayNumber)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleOpenAdd = (dayNum?: number) => {
    setEditingSchedule(null);
    setModalDefaultDay(dayNum || todayNumber);
    setIsAddModalOpen(true);
  };

  const handleEditClass = (sch: ScheduleWithSubject) => {
    setEditingSchedule(sch);
    setModalDefaultDay(sch.dayOfWeek);
    setIsAddModalOpen(true);
  };

  // Locale mapping for clean date format
  const localeMap = {
    vi: "vi-VN",
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
  };

  const todayFormatted = new Date().toLocaleDateString(localeMap[language] || "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome & Date Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-1 border-b border-[#f0eae1]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c]">
            {todayFormatted}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1917] mt-0.5">
            {t.goodDay}, {user.name.split(" ")[0]}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenAdd(todayNumber)}
            className="gap-1.5 shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            {t.quickAdd}
          </Button>
        </div>
      </div>

      {/* Hero: Next Class Live Countdown */}
      <NextClassHero
        schedules={schedules}
        onOpenAddModal={() => handleOpenAdd(todayNumber)}
      />

      {/* Main Grid: Today's Timeline + Week Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Agenda (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          <TodayTimeline
            todayClasses={todayClasses}
            onOpenAddModal={() => handleOpenAdd(todayNumber)}
            onEditClass={handleEditClass}
          />
        </div>

        {/* Weekly Workload Strip & Quick Info (1 col) */}
        <div className="space-y-6">
          <WeekOverviewStrip schedules={schedules} />

          {/* Timetable Info Card */}
          <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c]">
                {t.activeTimetable}
              </span>
              {timetable.isPublic ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                  {t.publicBadge}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f3efe6] px-2 py-0.5 text-[10px] font-semibold text-[#78716c]">
                  {t.privateBadge}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#1c1917]">
                {timetable.name}
              </h3>
              {timetable.description && (
                <p className="text-xs text-[#78716c] mt-1 line-clamp-2">
                  {timetable.description}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-[#f0eae1] flex items-center justify-between text-xs text-[#78716c]">
              <span>{subjects.length} {t.coursesEnrolled}</span>
              <span>{schedules.length} {t.weeklySessions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit Class */}
      <ClassFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSchedule(null);
        }}
        timetableId={timetable.id}
        existingSubjects={subjects}
        allSchedules={schedules}
        editingSchedule={editingSchedule}
        defaultDayOfWeek={modalDefaultDay}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
