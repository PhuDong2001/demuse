"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, BookOpen, Location, User } from "reicon-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { EmptyState } from "@/components/feedback/EmptyState";
import { getSubjectColor } from "@/lib/constants";
import { createSubjectAction, updateSubjectAction, deleteSubjectAction } from "@/actions/subject.actions";
import type { Subject, Timetable, Schedule } from "@/db/schema";
import { useLanguage } from "@/lib/LanguageContext";

type SubjectWithSchedules = Subject & {
  schedules: Schedule[];
};

interface SubjectsClientProps {
  timetable: Timetable;
  subjects: SubjectWithSchedules[];
}

export function SubjectsClient({ timetable, subjects }: SubjectsClientProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [teacher, setTeacher] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [color, setColor] = React.useState("sage");
  const [note, setNote] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setName("");
    setCode("");
    setTeacher("");
    setRoom("");
    setColor("sage");
    setNote("");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setCode(sub.code || "");
    setTeacher(sub.teacher || "");
    setRoom(sub.room || "");
    setColor(sub.color || "sage");
    setNote(sub.note || "");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (subId: string, subName: string) => {
    if (
      confirm(
        `${t.confirmDeleteCourse} (${subName})`
      )
    ) {
      await deleteSubjectAction(subId);
      router.refresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (editingSubject) {
        await updateSubjectAction(editingSubject.id, {
          name,
          code: code || undefined,
          teacher: teacher || undefined,
          room: room || undefined,
          color,
          note: note || undefined,
        });
      } else {
        await createSubjectAction({
          timetableId: timetable.id,
          name,
          code: code || undefined,
          teacher: teacher || undefined,
          room: room || undefined,
          color,
          note: note || undefined,
        });
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save course.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#f0eae1]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1917]">
            {t.courseCatalog}
          </h1>
          <p className="text-xs text-[#78716c] mt-0.5">
            {t.courseCatalogSub}
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleOpenAdd}
          className="gap-1.5 shadow-2xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t.addNewCourse}</span>
        </Button>
      </div>

      {/* Courses Grid */}
      {subjects.length === 0 ? (
        <EmptyState
          title={t.noCoursesYet}
          description={t.noCoursesSub}
          actionLabel={t.addNewCourse}
          onAction={handleOpenAdd}
          icon={<BookOpen className="h-6 w-6 text-[#78716c]" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const colorMeta = getSubjectColor(sub.color);
            const scheduleCount = sub.schedules?.length || 0;

            return (
              <div
                key={sub.id}
                className="rounded-2xl border border-[#ded7c8] bg-white p-5 shadow-xs flex flex-col justify-between planner-interactive relative overflow-hidden group"
              >
                {/* Color strip on top border */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: colorMeta.accent }}
                />

                <div className="space-y-3 pt-1">
                  {/* Code badge & action buttons */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
                      {sub.code && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: colorMeta.dot, color: "#ffffff" }}
                        >
                          {sub.code}
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-[#78716c]">
                        {scheduleCount} {t.weeklySessions}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(sub)}
                        className="p-1 rounded-md text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] transition-colors cursor-pointer"
                        title={t.editCourse}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(sub.id, sub.name)}
                        className="p-1 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete course"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subject Name */}
                  <h3 className="font-serif text-lg font-medium text-[#1c1917] leading-snug">
                    {sub.name}
                  </h3>

                  {/* Teacher & Room metadata */}
                  <div className="space-y-1 text-xs text-[#6b645b]">
                    {sub.teacher && (
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[#8c8275] shrink-0" />
                        <span>{sub.teacher}</span>
                      </div>
                    )}
                    {sub.room && (
                      <div className="flex items-center gap-1.5">
                        <Location className="h-3.5 w-3.5 text-[#8c8275] shrink-0" />
                        <span>{t.room} {sub.room}</span>
                      </div>
                    )}
                  </div>

                  {/* Note */}
                  {sub.note && (
                    <p className="text-xs text-[#78716c] italic line-clamp-2 pt-2 border-t border-[#f0eae1]">
                      {sub.note}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-2 flex items-center justify-between border-t border-[#f0eae1] text-[11px] text-[#78716c]">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-black/10"
                      style={{ backgroundColor: colorMeta.accent }}
                    />
                    {colorMeta.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(sub)}
                    className="font-medium text-[#1c1917] hover:underline cursor-pointer"
                  >
                    {t.editDetails}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? t.editCourse : t.addNewCourse}
        description={t.courseCatalogSub}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label={t.courseName}
                placeholder="e.g. Operating Systems"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label={t.courseCode}
                placeholder="e.g. CS 350"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t.instructor}
              placeholder="e.g. Dr. Marcus Chen"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            />
            <Input
              label={t.defaultRoom}
              placeholder="e.g. Turing Lab 104"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>

          <ColorPicker
            label={t.colorTheme}
            value={color}
            onChange={setColor}
          />

          <Textarea
            label={t.notesSyllabus}
            placeholder="Course syllabus link, office hours, grading weight..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eae1]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              {t.cancel}
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {editingSubject ? t.saveChanges : t.createCourse}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
