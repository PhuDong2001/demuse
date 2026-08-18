"use client";

import * as React from "react";
import { Modal } from "../ui/Modal";
import { Input, Textarea } from "../ui/Input";
import { Button } from "../ui/Button";
import { ColorPicker } from "../ui/ColorPicker";
import { DAYS_OF_WEEK, CLASS_TYPES } from "@/lib/constants";
import { checkTimeOverlap, type ScheduleWithSubject } from "@/lib/time";
import { createClassAction, updateScheduleAction } from "@/actions/schedule.actions";
import { updateSubjectAction } from "@/actions/subject.actions";
import { AlertTriangle } from "reicon-react";
import type { Subject } from "@/db/schema";
import { useLanguage } from "@/lib/LanguageContext";

type ClassTypeEnum =
  | "lecture"
  | "lab"
  | "tutorial"
  | "seminar"
  | "workshop"
  | "work"
  | "meeting"
  | "study"
  | "personal";

export interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetableId: string;
  existingSubjects: Subject[];
  allSchedules: ScheduleWithSubject[];
  editingSchedule?: ScheduleWithSubject | null;
  defaultDayOfWeek?: number;
  initialType?: ClassTypeEnum;
  onSuccess?: () => void;
}

interface FormInnerProps {
  onClose: () => void;
  timetableId: string;
  existingSubjects: Subject[];
  allSchedules: ScheduleWithSubject[];
  editingSchedule?: ScheduleWithSubject | null;
  defaultDayOfWeek: number;
  initialType?: ClassTypeEnum;
  onSuccess?: () => void;
}

function ClassFormInner({
  onClose,
  timetableId,
  existingSubjects,
  allSchedules,
  editingSchedule,
  defaultDayOfWeek,
  initialType = "lecture",
  onSuccess,
}: FormInnerProps) {
  const { language, t } = useLanguage();
  const isVi = language === "vi";
  const isEditing = Boolean(editingSchedule);

  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>(
    editingSchedule ? editingSchedule.subjectId : ""
  );
  const [name, setName] = React.useState(
    editingSchedule ? editingSchedule.subject.name : ""
  );
  const [code, setCode] = React.useState(
    editingSchedule ? editingSchedule.subject.code || "" : ""
  );
  const [teacher, setTeacher] = React.useState(
    editingSchedule ? editingSchedule.subject.teacher || "" : ""
  );
  const [room, setRoom] = React.useState(
    editingSchedule
      ? editingSchedule.room || editingSchedule.subject.room || ""
      : ""
  );
  const [color, setColor] = React.useState(
    editingSchedule ? editingSchedule.subject.color || "sage" : "sage"
  );
  const [note, setNote] = React.useState(
    editingSchedule ? editingSchedule.subject.note || "" : ""
  );

  // Timing
  const [selectedDays, setSelectedDays] = React.useState<number[]>(
    editingSchedule ? [editingSchedule.dayOfWeek] : [defaultDayOfWeek]
  );
  const [startTime, setStartTime] = React.useState(
    editingSchedule ? editingSchedule.startTime : "09:00"
  );
  const [endTime, setEndTime] = React.useState(
    editingSchedule ? editingSchedule.endTime : "10:30"
  );
  const [type, setType] = React.useState<ClassTypeEnum>(
    editingSchedule ? (editingSchedule.type as ClassTypeEnum) : initialType
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSelectExistingSubject = (subId: string) => {
    setSelectedSubjectId(subId);
    if (!subId) {
      setName("");
      setCode("");
      setTeacher("");
      setRoom("");
      setColor("sage");
      setNote("");
      return;
    }
    const sub = existingSubjects.find((s) => s.id === subId);
    if (sub) {
      setName(sub.name);
      setCode(sub.code || "");
      setTeacher(sub.teacher || "");
      setRoom(sub.room || "");
      setColor(sub.color || "sage");
      setNote(sub.note || "");
    }
  };

  const toggleDay = (dayNum: number) => {
    if (isEditing) {
      setSelectedDays([dayNum]);
      return;
    }
    setSelectedDays((prev) =>
      prev.includes(dayNum)
        ? prev.filter((d) => d !== dayNum)
        : [...prev, dayNum].sort((a, b) => a - b)
    );
  };

  // Check clash against existing schedules
  const conflictingClasses = React.useMemo(() => {
    if (!startTime || !endTime || selectedDays.length === 0) return [];

    const conflicts: { day: number; schedule: ScheduleWithSubject }[] = [];

    for (const day of selectedDays) {
      for (const sch of allSchedules) {
        if (editingSchedule && sch.id === editingSchedule.id) continue;
        if (sch.dayOfWeek !== day) continue;

        if (checkTimeOverlap(startTime, endTime, sch.startTime, sch.endTime)) {
          conflicts.push({ day, schedule: sch });
        }
      }
    }

    return conflicts;
  }, [startTime, endTime, selectedDays, allSchedules, editingSchedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      setErrorMessage("Please select at least one day.");
      return;
    }
    if (conflictingClasses.length > 0) {
      setErrorMessage(t.timeConflictWarning);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isEditing && editingSchedule) {
        // 1. Update the parent subject metadata (name, code, teacher, room, color, note)
        await updateSubjectAction(editingSchedule.subjectId, {
          name,
          code: code || undefined,
          teacher: teacher || undefined,
          room: room || undefined,
          color,
          note: note || undefined,
        });

        // 2. Update the schedule timing & slot properties
        await updateScheduleAction(editingSchedule.id, {
          dayOfWeek: selectedDays[0],
          startTime,
          endTime,
          room: room || undefined,
          type,
        });
      } else {
        await createClassAction({
          timetableId,
          subjectId: selectedSubjectId ? selectedSubjectId : undefined,
          name,
          code: code || undefined,
          teacher: teacher || undefined,
          room: room || undefined,
          color,
          note: note || undefined,
          daysOfWeek: selectedDays,
          startTime,
          endTime,
          type,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save class.");
    } finally {
      setIsLoading(false);
    }
  };

  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
          {errorMessage}
        </div>
      )}

      {/* Event Category Type Selector Tabs */}
      <div className="space-y-1.5 pb-2 border-b border-[#f0eae1]">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e]">
          {isVi ? "Mục tiêu / Loại hình hoạt động" : "Activity Category & Type"}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
          {CLASS_TYPES.map((ct) => {
            const isSelected = type === ct.value;
            const labelsMap: Record<string, { vi: string; en: string }> = {
              lecture: { vi: "Lý thuyết", en: "Lecture" },
              lab: { vi: "Thực hành", en: "Lab" },
              tutorial: { vi: "Hướng dẫn", en: "Tutorial" },
              seminar: { vi: "Chuyên đề", en: "Seminar" },
              workshop: { vi: "Workshop", en: "Workshop" },
              work: { vi: "Công việc", en: "Work" },
              meeting: { vi: "Họp nhóm", en: "Meeting" },
              study: { vi: "Tự học", en: "Study" },
              personal: { vi: "Cá nhân", en: "Personal" },
            };
            const currentLabel = isVi ? labelsMap[ct.value]?.vi || ct.label : labelsMap[ct.value]?.en || ct.label;

            return (
              <button
                key={ct.value}
                type="button"
                onClick={() => setType(ct.value as ClassTypeEnum)}
                className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-center truncate ${
                  isSelected
                    ? "bg-[#1c1917] text-[#faf7f2] border-[#1c1917] shadow-xs"
                    : "bg-white text-[#57534e] border-[#ded7c8] hover:border-[#b8ad96] hover:bg-[#faf7f2]"
                }`}
              >
                {currentLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Existing Item Quick Picker */}
      {!isEditing && existingSubjects.length > 0 && (
        <div className="space-y-1.5 pb-2 border-b border-[#f0eae1]">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e]">
            {type === "work"
              ? isVi
                ? "Chọn dự án / công việc có sẵn"
                : "Select Existing Job / Shift"
              : type === "meeting"
              ? isVi
                ? "Chọn nhóm / dự án có sẵn"
                : "Select Existing Project / Meeting"
              : type === "personal"
              ? isVi
                ? "Chọn thói quen / hoạt động có sẵn"
                : "Select Existing Activity"
              : t.selectExistingCourse}
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => handleSelectExistingSubject(e.target.value)}
            className="w-full rounded-lg border border-[#ded7c8] bg-white px-3 py-2 text-xs text-[#1c1917] focus:border-[#1c1917] focus:outline-none"
          >
            <option value="">
              --{" "}
              {type === "work"
                ? isVi
                  ? "Tạo công việc / ca làm mới"
                  : "Create new work shift"
                : type === "meeting"
                ? isVi
                  ? "Tạo cuộc họp mới"
                  : "Create new meeting"
                : type === "personal"
                ? isVi
                  ? "Tạo hoạt động mới"
                  : "Create new activity"
                : t.orAddNewCourse}{" "}
              --
            </option>
            {existingSubjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code ? `[${sub.code}] ` : ""}
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Dynamic Name & Code/Tag Fields based on Category */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            label={
              type === "work"
                ? isVi
                  ? "Tên công việc / Ca làm việc"
                  : "Job Title / Work Shift Name"
                : type === "meeting"
                ? isVi
                  ? "Chủ đề cuộc họp / Tên nhóm"
                  : "Meeting Topic / Group Name"
                : type === "study"
                ? isVi
                  ? "Mục tiêu / Nội dung tự học"
                  : "Study Focus / Task Name"
                : type === "personal"
                ? isVi
                  ? "Tên hoạt động / Thói quen"
                  : "Activity / Habit Name"
                : t.courseName
            }
            placeholder={
              type === "work"
                ? isVi
                  ? "vd: Ca sáng Barista, Trực ca lập trình, Thiết kế UI..."
                  : "e.g. Morning Shift, Frontend Dev, Support Desk..."
                : type === "meeting"
                ? isVi
                  ? "vd: Họp đồ án tốt nghiệp, Đồng bộ Sprint tuần..."
                  : "e.g. Thesis Sync, Weekly Standup, Client Pitch..."
                : type === "study"
                ? isVi
                  ? "vd: Ôn luyện IELTS Reading, Làm bài tập Giải tích..."
                  : "e.g. IELTS Reading, Deep Coding Session..."
                : type === "personal"
                ? isVi
                  ? "vd: Tập Gym - Leg Day, Chạy bộ công viên, Đọc sách..."
                  : "e.g. Gym Workout, Evening Run, Reading..."
                : "e.g. Data Structures & Algorithms"
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            required
          />
        </div>
        <div>
          <Input
            label={
              type === "work"
                ? isVi
                  ? "Mã ca / Dự án (tuỳ chọn)"
                  : "Project / Job Code"
                : type === "meeting"
                ? isVi
                  ? "Mã nhóm (tuỳ chọn)"
                  : "Team / Project Code"
                : type === "personal"
                ? isVi
                  ? "Nhãn / Tag (tuỳ chọn)"
                  : "Tag / Label"
                : t.courseCode
            }
            placeholder={
              type === "work"
                ? "e.g. PRJ-01"
                : type === "meeting"
                ? "e.g. TEAM-A"
                : type === "personal"
                ? "e.g. HEALTH"
                : "e.g. CS 204"
            }
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Dynamic Person In Charge & Venue/Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label={
            type === "work"
              ? isVi
                ? "Quản lý / Người phụ trách (tuỳ chọn)"
                : "Manager / Supervisor (optional)"
              : type === "meeting"
              ? isVi
                ? "Người chủ trì / Thành viên (tuỳ chọn)"
                : "Host / Attendees (optional)"
              : type === "study" || type === "personal"
              ? isVi
                ? "Người đồng hành / Huấn luyện viên (tuỳ chọn)"
                : "Partner / Coach (optional)"
              : t.instructor
          }
          placeholder={
            type === "work"
              ? isVi
                ? "vd: Anh Minh (Team Lead)"
                : "e.g. Alex (Team Lead)"
              : type === "meeting"
              ? isVi
                ? "vd: Trưởng nhóm Đồ án"
                : "e.g. Project Lead"
              : type === "personal"
              ? isVi
                ? "vd: PT Nam hoặc Bạn tập"
                : "e.g. Gym Partner / Coach"
              : "e.g. Prof. Alan Miller"
          }
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <Input
          label={
            type === "work"
              ? isVi
                ? "Địa điểm làm việc / Chi nhánh / Link"
                : "Workplace / Office / Remote Link"
              : type === "meeting"
              ? isVi
                ? "Phòng họp / Link Google Meet"
                : "Meeting Room / Google Meet Link"
              : type === "personal"
              ? isVi
                ? "Địa điểm / Phòng tập"
                : "Location / Fitness Center"
              : t.roomVenue
          }
          placeholder={
            type === "work"
              ? isVi
                ? "vd: Văn phòng Tầng 4 hoặc Remote Zoom"
                : "e.g. 4th Floor Office or Remote"
              : type === "meeting"
              ? isVi
                ? "vd: Phòng họp B2 hoặc meet.google.com/xyz"
                : "e.g. Room B2 or Google Meet"
              : type === "personal"
              ? isVi
                ? "vd: California Fitness hoặc Công viên"
                : "e.g. Fitness Gym or Park"
              : "e.g. Hall 302 or Studio B"
          }
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {/* Color Palette Picker */}
      <ColorPicker
        label={t.colorTheme}
        value={color}
        onChange={setColor}
      />

      {/* Days of Week Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e]">
            {t.daysOfWeekLabel}
          </label>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS_OF_WEEK.map((day, idx) => {
            const isSelected = selectedDays.includes(day.number);
            const dTrans = t.days[dayKeys[idx]];
            return (
              <button
                key={day.number}
                type="button"
                onClick={() => toggleDay(day.number)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1c1917] text-[#faf7f2] border-[#1c1917] shadow-xs"
                    : "bg-white text-[#57534e] border-[#ded7c8] hover:border-[#b8ad96] hover:bg-[#faf7f2]"
                }`}
              >
                <span className="text-[10px] sm:text-xs">{dTrans ? dTrans.short : day.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time and Session Type */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Input
            label={t.startTime}
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label={t.endTime}
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e]">
            {t.classType}
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ClassTypeEnum)}
            className="w-full rounded-lg border border-[#ded7c8] bg-white px-3 py-2.5 text-sm text-[#1c1917] focus:border-[#1c1917] focus:outline-none"
          >
            {CLASS_TYPES.map((ct) => (
              <option key={ct.value} value={ct.value}>
                {ct.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Clash Alert */}
      {conflictingClasses.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{t.timeConflictWarning}</p>
          </div>
        </div>
      )}

      {/* Optional Notes */}
      <Textarea
        label={t.notesSyllabus}
        placeholder="e.g. Bring laptop, homework due weekly, Zoom link..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eae1]">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          {t.cancel}
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={conflictingClasses.length > 0}
        >
          {isEditing ? t.saveScheduleBtn : t.createScheduleBtn}
        </Button>
      </div>
    </form>
  );
}

export function ClassFormModal({
  isOpen,
  onClose,
  timetableId,
  existingSubjects,
  allSchedules,
  editingSchedule,
  defaultDayOfWeek = 1,
  initialType = "lecture",
  onSuccess,
}: ClassFormModalProps) {
  const { language, t } = useLanguage();
  const isVi = language === "vi";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editingSchedule
          ? isVi
            ? "Chỉnh sửa Lịch trình"
            : "Edit Schedule Item"
          : isVi
          ? "Thêm Lịch trình Mới (Học tập & Công việc)"
          : "Add New Event (Study, Work & Life)"
      }
      description={
        isVi
          ? "Thiết lập môn học, ca làm việc, cuộc họp hoặc thói quen cá nhân trong tuần."
          : "Configure class, work shift, meeting, or personal routine in your weekly timetable."
      }
      maxWidth="lg"
    >
      {isOpen && (
        <ClassFormInner
          key={editingSchedule ? editingSchedule.id : `new-${initialType}-${defaultDayOfWeek}`}
          onClose={onClose}
          timetableId={timetableId}
          existingSubjects={existingSubjects}
          allSchedules={allSchedules}
          editingSchedule={editingSchedule}
          defaultDayOfWeek={defaultDayOfWeek}
          initialType={initialType}
          onSuccess={onSuccess}
        />
      )}
    </Modal>
  );
}
