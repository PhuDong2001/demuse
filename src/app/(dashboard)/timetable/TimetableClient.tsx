"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WeeklyTimelineGrid } from "@/components/timetable/WeeklyTimelineGrid";
import { WeeklyTimetableGrid } from "@/components/timetable/WeeklyTimetableGrid";
import { MobileDayAgenda } from "@/components/timetable/MobileDayAgenda";
import { ClassFormModal } from "@/components/timetable/ClassFormModal";
import { ShareModal } from "@/components/timetable/ShareModal";
import { Button } from "@/components/ui/Button";
import { Plus, Share, Search, Sliders, Calendar, Sparkles } from "reicon-react";
import { getDemuseDayOfWeek, type ScheduleWithSubject } from "@/lib/time";
import type { Subject, Timetable } from "@/db/schema";
import {
  updateScheduleAction,
  duplicateScheduleAction,
  deleteScheduleAction,
} from "@/actions/schedule.actions";
import { useLanguage } from "@/lib/LanguageContext";

interface TimetableClientProps {
  timetable: Timetable;
  subjects: Subject[];
  schedules: ScheduleWithSubject[];
}

export function TimetableClient({
  timetable,
  subjects,
  schedules,
}: TimetableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // Initial day from query params or current day
  const initialDay = Number(searchParams.get("day")) || getDemuseDayOfWeek(new Date());

  const [selectedMobileDay, setSelectedMobileDay] = React.useState<number>(initialDay);
  const [showWeekends, setShowWeekends] = React.useState<boolean>(true);
  const [viewMode, setViewMode] = React.useState<"cards" | "timeline">("timeline");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Load preferred view from localStorage if set
  React.useEffect(() => {
    const saved = localStorage.getItem("demuse_view_mode");
    if (saved === "timeline" || saved === "cards") {
      setViewMode(saved);
    }
  }, []);

  const handleToggleViewMode = (mode: "cards" | "timeline") => {
    setViewMode(mode);
    localStorage.setItem("demuse_view_mode", mode);
  };

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState<boolean>(false);
  const [editingSchedule, setEditingSchedule] = React.useState<ScheduleWithSubject | null>(null);
  const [modalDefaultDay, setModalDefaultDay] = React.useState<number>(1);

  const [localSchedules, setLocalSchedules] = React.useState<ScheduleWithSubject[]>(schedules);

  // Sync props changes to local schedules state
  React.useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules]);

  // Filter schedules based on search query
  const filteredSchedules = React.useMemo(() => {
    if (!searchQuery.trim()) return localSchedules;
    const q = searchQuery.toLowerCase().trim();
    return localSchedules.filter(
      (s) =>
        s.subject.name.toLowerCase().includes(q) ||
        (s.subject.code && s.subject.code.toLowerCase().includes(q)) ||
        (s.subject.teacher && s.subject.teacher.toLowerCase().includes(q)) ||
        (s.room && s.room.toLowerCase().includes(q)) ||
        (s.subject.room && s.subject.room.toLowerCase().includes(q))
    );
  }, [localSchedules, searchQuery]);

  const handleAddClass = (dayNumber: number) => {
    setEditingSchedule(null);
    setModalDefaultDay(dayNumber);
    setIsAddModalOpen(true);
  };

  const handleEditClass = (sch: ScheduleWithSubject) => {
    setEditingSchedule(sch);
    setModalDefaultDay(sch.dayOfWeek);
    setIsAddModalOpen(true);
  };

  const handleMoveClassDay = async (schId: string, targetDay: number) => {
    // 1. Instant Optimistic UI Update (0ms latency, zero lag!)
    setLocalSchedules((prev) =>
      prev.map((s) => (s.id === schId ? { ...s, dayOfWeek: targetDay } : s))
    );

    // 2. Persist to database in background
    try {
      await updateScheduleAction(schId, { dayOfWeek: targetDay });
    } catch {
      // Revert if error
      setLocalSchedules(schedules);
    }
  };

  const handleDuplicate = async (schId: string) => {
    await duplicateScheduleAction(schId);
    router.refresh();
  };

  const handleDelete = async (schId: string) => {
    if (confirm(t.confirmDeleteClass)) {
      await deleteScheduleAction(schId);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Timetable Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#f0eae1]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1917]">
            {timetable.name}
          </h1>
          <p className="text-xs text-[#78716c] mt-0.5">
            {timetable.academicTerm || t.currentTerm} · {schedules.length} {t.weeklySessions}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsShareModalOpen(true)}
            className="gap-1.5 shadow-2xs"
          >
            <Share className="h-3.5 w-3.5" />
            <span>{t.share}</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => handleAddClass(selectedMobileDay)}
            className="gap-1.5 shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.addClass}</span>
          </Button>
        </div>
      </div>

      {/* Control Bar: Search & View Options */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#ded7c8]">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#a8a29e]" />
          <input
            type="text"
            placeholder={t.filterPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#ded7c8] bg-[#faf7f2] focus:bg-white focus:border-[#1c1917] focus:outline-none transition-colors"
          />
        </div>

        {/* View toggles (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* View mode toggle: Card Columns (Default) vs Timeline Grid */}
          <div className="flex items-center rounded-lg border border-[#ded7c8] bg-[#faf7f2] p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleToggleViewMode("cards")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-[#1c1917] text-[#faf7f2] shadow-2xs"
                  : "text-[#78716c] hover:text-[#1c1917]"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>{t.cardListView}</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleViewMode("timeline")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-[#1c1917] text-[#faf7f2] shadow-2xs"
                  : "text-[#78716c] hover:text-[#1c1917]"
              }`}
            >
              <Calendar className="h-3 w-3" />
              <span>{t.timeGridView}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowWeekends(!showWeekends)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              showWeekends
                ? "bg-[#1c1917] text-[#faf7f2] border-[#1c1917]"
                : "bg-white text-[#57534e] border-[#ded7c8] hover:bg-[#faf7f2]"
            }`}
          >
            <Sliders className="h-3 w-3" />
            <span>{showWeekends ? t.fullWeek7Days : t.workDays5Days}</span>
          </button>
        </div>
      </div>

      {/* Desktop Weekly Timetable Grid (Timeline View vs Cards View) */}
      <div className="hidden md:block">
        {viewMode === "timeline" ? (
          <WeeklyTimelineGrid
            schedules={filteredSchedules}
            onAddClassForDay={handleAddClass}
            onEditClass={handleEditClass}
            onDuplicateClass={handleDuplicate}
            onDeleteClass={handleDelete}
            onMoveClassDay={handleMoveClassDay}
            showWeekends={showWeekends}
          />
        ) : (
          <WeeklyTimetableGrid
            schedules={filteredSchedules}
            onAddClassForDay={handleAddClass}
            onEditClass={handleEditClass}
            onDuplicateClass={handleDuplicate}
            onDeleteClass={handleDelete}
            onMoveClassDay={handleMoveClassDay}
            showWeekends={showWeekends}
          />
        )}
      </div>

      {/* Mobile Day-by-Day Agenda */}
      <div className="block md:hidden">
        <MobileDayAgenda
          schedules={filteredSchedules}
          selectedDay={selectedMobileDay}
          onSelectDay={setSelectedMobileDay}
          onAddClassForDay={handleAddClass}
          onEditClass={handleEditClass}
          onDuplicateClass={handleDuplicate}
          onDeleteClass={handleDelete}
        />
      </div>

      {/* Class Form Modal */}
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

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        timetableId={timetable.id}
        isPublic={timetable.isPublic}
        shareToken={timetable.shareToken}
        onUpdate={() => router.refresh()}
      />
    </div>
  );
}
