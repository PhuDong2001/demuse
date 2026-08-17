"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WeeklyTimelineGrid } from "@/components/timetable/WeeklyTimelineGrid";
import { WeeklyTimetableGrid } from "@/components/timetable/WeeklyTimetableGrid";
import { MobileDayAgenda } from "@/components/timetable/MobileDayAgenda";
import { ClassFormModal } from "@/components/timetable/ClassFormModal";
import { ShareModal } from "@/components/timetable/ShareModal";
import { ImportCalendarModal } from "@/components/timetable/ImportCalendarModal";
import { ExportWallpaperModal } from "@/components/timetable/ExportWallpaperModal";
import { TimetableManagerModal } from "@/components/timetable/TimetableManagerModal";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Share,
  Search,
  Sliders,
  Calendar,
  Sparkles,
  Download,
  AngleLeft,
  AngleRight,
  Folder,
} from "reicon-react";
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
  allTimetables?: Timetable[];
  subjects: Subject[];
  schedules: ScheduleWithSubject[];
}

export function TimetableClient({
  timetable,
  allTimetables = [timetable],
  subjects,
  schedules,
}: TimetableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();

  // Initial day from query params or current day
  const initialDay = Number(searchParams.get("day")) || getDemuseDayOfWeek(new Date());

  const [selectedMobileDay, setSelectedMobileDay] = React.useState<number>(initialDay);
  const [showWeekends, setShowWeekends] = React.useState<boolean>(true);
  const [viewMode, setViewMode] = React.useState<"cards" | "timeline">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("demuse_view_mode");
      if (saved === "timeline" || saved === "cards") return saved;
    }
    return "timeline";
  });
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const handleToggleViewMode = (mode: "cards" | "timeline") => {
    setViewMode(mode);
    localStorage.setItem("demuse_view_mode", mode);
  };

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = React.useState<boolean>(false);
  const [currentWeek, setCurrentWeek] = React.useState<number>(1);
  const [editingSchedule, setEditingSchedule] = React.useState<ScheduleWithSubject | null>(null);
  const [modalDefaultDay, setModalDefaultDay] = React.useState<number>(1);

  const [optimisticMoves, setOptimisticMoves] = React.useState<Record<string, number>>({});
  const [deletedIds, setDeletedIds] = React.useState<Set<string>>(() => new Set());

  // Derive current effective schedules without setState in useEffect
  const currentSchedules = React.useMemo(() => {
    return schedules
      .filter((s) => !deletedIds.has(s.id))
      .map((s) => {
        const movedDay = optimisticMoves[s.id];
        return movedDay !== undefined ? { ...s, dayOfWeek: movedDay } : s;
      });
  }, [schedules, deletedIds, optimisticMoves]);

  // Filter schedules based on search query
  const filteredSchedules = React.useMemo(() => {
    if (!searchQuery.trim()) return currentSchedules;
    const q = searchQuery.toLowerCase().trim();
    return currentSchedules.filter(
      (s) =>
        s.subject.name.toLowerCase().includes(q) ||
        (s.subject.code && s.subject.code.toLowerCase().includes(q)) ||
        (s.subject.teacher && s.subject.teacher.toLowerCase().includes(q)) ||
        (s.room && s.room.toLowerCase().includes(q)) ||
        (s.subject.room && s.subject.room.toLowerCase().includes(q))
    );
  }, [currentSchedules, searchQuery]);

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
    setOptimisticMoves((prev) => ({ ...prev, [schId]: targetDay }));

    // 2. Persist to database in background
    try {
      await updateScheduleAction(schId, { dayOfWeek: targetDay });
    } catch {
      // Revert if error
      setOptimisticMoves((prev) => {
        const copy = { ...prev };
        delete copy[schId];
        return copy;
      });
    }
  };

  const handleDuplicate = async (schId: string) => {
    await duplicateScheduleAction(schId);
    router.refresh();
  };

  const handleDelete = async (schId: string) => {
    if (confirm(t.confirmDeleteClass)) {
      // 1. Instant Optimistic UI deletion (0ms latency, disappears immediately!)
      setDeletedIds((prev) => new Set(prev).add(schId));

      // 2. Perform deletion in background
      try {
        await deleteScheduleAction(schId);
        router.refresh();
      } catch {
        // Revert if deletion failed
        setDeletedIds((prev) => {
          const next = new Set(prev);
          next.delete(schId);
          return next;
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Timetable Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#f0eae1]">
        <div className="flex items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1917]">
                {timetable.name}
              </h1>
              <button
                type="button"
                onClick={() => setIsManagerModalOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-[#ded7c8] bg-white hover:bg-[#ede8dc] text-xs font-semibold text-[#57534e] transition-all cursor-pointer shadow-2xs"
                title="Switch or manage multiple timetables"
              >
                <Folder className="h-3 w-3 text-[#854d0e]" />
                <span>{allTimetables.length > 1 ? `${allTimetables.length} ${language === "vi" ? "lịch" : "timetables"}` : language === "vi" ? "Đổi lịch" : "Switch"}</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#78716c] mt-1">
              <span>{timetable.academicTerm || t.currentTerm} · {schedules.length} {t.weeklySessions}</span>
              <span className="text-[#ded7c8]">·</span>
              {/* Week Navigator */}
              <div className="inline-flex items-center gap-1 bg-[#ede8dc]/80 px-2 py-0.5 rounded-md text-[#1c1917] font-semibold select-none">
                <button
                  type="button"
                  onClick={() => setCurrentWeek((w) => Math.max(w - 1, 1))}
                  className="hover:text-[#854d0e] cursor-pointer p-0.5"
                  title="Previous week"
                >
                  <AngleLeft className="h-3 w-3" />
                </button>
                <span>{language === "vi" ? `Tuần ${currentWeek}` : `Week ${currentWeek}`}</span>
                <button
                  type="button"
                  onClick={() => setCurrentWeek((w) => w + 1)}
                  className="hover:text-[#854d0e] cursor-pointer p-0.5"
                  title="Next week"
                >
                  <AngleRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExportModalOpen(true)}
            className="gap-1.5 shadow-2xs"
            title="Export lockscreen wallpaper, 16:9 desktop background or A4 print"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{language === "vi" ? "Xuất ảnh" : "Export"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
            className="gap-1.5 shadow-2xs"
            title="Import from Google Calendar, Apple iCal, Outlook (.ics)"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{language === "vi" ? "Nhập lịch" : "Import"}</span>
          </Button>

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

      {/* Import Calendar Modal (.ics) */}
      <ImportCalendarModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        timetableId={timetable.id}
        onSuccess={() => router.refresh()}
      />

      {/* Export Wallpaper Modal (Phone Lockscreen / Desktop / Print) */}
      <ExportWallpaperModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        timetableName={timetable.name}
        schedules={schedules}
      />

      {/* Timetable Manager Modal */}
      <TimetableManagerModal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        currentTimetableId={timetable.id}
        allTimetables={allTimetables}
      />
    </div>
  );
}
