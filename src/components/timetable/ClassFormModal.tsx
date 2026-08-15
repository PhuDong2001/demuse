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

type ClassTypeEnum = "lecture" | "lab" | "tutorial" | "seminar" | "workshop" | "study";

export interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetableId: string;
  existingSubjects: Subject[];
  allSchedules: ScheduleWithSubject[];
  editingSchedule?: ScheduleWithSubject | null;
  defaultDayOfWeek?: number;
  onSuccess?: () => void;
}

interface FormInnerProps {
  onClose: () => void;
  timetableId: string;
  existingSubjects: Subject[];
  allSchedules: ScheduleWithSubject[];
  editingSchedule?: ScheduleWithSubject | null;
  defaultDayOfWeek: number;
  onSuccess?: () => void;
}

function ClassFormInner({
  onClose,
  timetableId,
  existingSubjects,
  allSchedules,
  editingSchedule,
  defaultDayOfWeek,
  onSuccess,
}: FormInnerProps) {
  const { t } = useLanguage();
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
    editingSchedule ? (editingSchedule.type as ClassTypeEnum) : "lecture"
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

      {/* Existing Subject Quick Picker */}
      {!isEditing && existingSubjects.length > 0 && (
        <div className="space-y-1.5 pb-2 border-b border-[#f0eae1]">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e]">
            {t.selectExistingCourse}
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => handleSelectExistingSubject(e.target.value)}
            className="w-full rounded-lg border border-[#ded7c8] bg-white px-3 py-2 text-xs text-[#1c1917] focus:border-[#1c1917] focus:outline-none"
          >
            <option value="">-- {t.orAddNewCourse} --</option>
            {existingSubjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code ? `[${sub.code}] ` : ""}
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Subject Name & Code */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            label={t.courseName}
            placeholder="e.g. Data Structures & Algorithms"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label={t.courseCode}
            placeholder="e.g. CS 204"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
      </div>

      {/* Teacher & Room */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label={t.instructor}
          placeholder="e.g. Prof. Alan Miller"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
        />
        <Input
          label={t.roomVenue}
          placeholder="e.g. Hall 302 or Studio B"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
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
  onSuccess,
}: ClassFormModalProps) {
  const { t } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSchedule ? t.editCourse : t.addNewClass}
      description={t.configureClassTiming}
      maxWidth="lg"
    >
      {isOpen && (
        <ClassFormInner
          key={editingSchedule ? editingSchedule.id : "new"}
          onClose={onClose}
          timetableId={timetableId}
          existingSubjects={existingSubjects}
          allSchedules={allSchedules}
          editingSchedule={editingSchedule}
          defaultDayOfWeek={defaultDayOfWeek}
          onSuccess={onSuccess}
        />
      )}
    </Modal>
  );
}
