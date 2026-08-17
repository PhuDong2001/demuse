"use client";

import * as React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  createTimetableAction,
  deleteTimetableAction,
  setDefaultTimetableAction,
} from "@/actions/timetable.actions";
import { Plus, Trash2, Calendar, Star, ArrowRight } from "reicon-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { Timetable } from "@/db/schema";
import { useRouter } from "next/navigation";

interface TimetableManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimetableId: string;
  allTimetables: Timetable[];
}

export function TimetableManagerModal({
  isOpen,
  onClose,
  currentTimetableId,
  allTimetables,
}: TimetableManagerModalProps) {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const router = useRouter();

  const [isCreating, setIsCreating] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newTerm, setNewTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSelectTimetable = (id: string) => {
    router.push(`/timetable?timetableId=${id}`);
    onClose();
  };

  const handleSetDefault = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await setDefaultTimetableAction(id);
      router.refresh();
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (allTimetables.length <= 1) {
      alert(isVi ? "Bạn phải giữ lại ít nhất một thời khóa biểu." : "You must keep at least one timetable.");
      return;
    }
    if (confirm(isVi ? "Bạn có chắc chắn muốn xóa thời khóa biểu này?" : "Are you sure you want to delete this timetable?")) {
      try {
        await deleteTimetableAction(id);
        if (currentTimetableId === id) {
          const remaining = allTimetables.filter((t) => t.id !== id);
          if (remaining[0]) {
            router.push(`/timetable?timetableId=${remaining[0].id}`);
          }
        } else {
          router.refresh();
        }
      } catch {
        // ignore
      }
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await createTimetableAction({
        name: newName.trim(),
        academicTerm: newTerm.trim() || undefined,
        isPublic: false,
      });
      if (res.timetable) {
        setIsCreating(false);
        setNewName("");
        setNewTerm("");
        router.push(`/timetable?timetableId=${res.timetable.id}`);
        onClose();
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to create timetable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isVi ? "Quản Lý Thời Khóa Biểu" : "Manage Timetables"}
      description={
        isVi
          ? "Tạo nhiều thời khóa biểu độc lập (Học kỳ 1, Học kỳ 2, Ca làm thêm hè, Lịch thi...)."
          : "Manage multiple distinct schedules for semesters, work shifts, or exam periods."
      }
      maxWidth="lg"
    >
      <div className="space-y-4 pt-1">
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Existing Timetables List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {allTimetables.map((tt) => {
            const isActive = tt.id === currentTimetableId;

            return (
              <div
                key={tt.id}
                onClick={() => handleSelectTimetable(tt.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isActive
                    ? "border-[#1c1917] bg-white shadow-xs ring-1 ring-[#1c1917]/10"
                    : "border-[#ded7c8] bg-[#faf7f2]/60 hover:bg-white hover:border-[#1c1917]/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 ${
                      isActive
                        ? "bg-[#1c1917] border-[#1c1917] text-white"
                        : "bg-[#ede8dc] border-[#ded7c8] text-[#57534e]"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#1c1917] truncate">{tt.name}</h4>
                      {tt.isDefault && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded">
                          <Star className="h-2 w-2 fill-amber-500 text-amber-500" />
                          {isVi ? "Mặc định" : "Default"}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#78716c] truncate mt-0.5">
                      {tt.academicTerm || (isVi ? "Thời khóa biểu tuần" : "Weekly Schedule")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!tt.isDefault && (
                    <button
                      type="button"
                      onClick={(e) => handleSetDefault(tt.id, e)}
                      title={isVi ? "Đặt làm mặc định" : "Set as default"}
                      className="text-[10px] text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] px-2 py-1 rounded transition-colors"
                    >
                      {isVi ? "Đặt mặc định" : "Set Default"}
                    </button>
                  )}

                  {allTimetables.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(tt.id, e)}
                      className="p-1.5 text-[#a8a29e] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title={isVi ? "Xóa thời khóa biểu" : "Delete timetable"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create New Timetable Form */}
        {!isCreating ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="w-full gap-1.5 border-dashed"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isVi ? "Tạo Thời Khóa Biểu Mới" : "Create New Timetable"}</span>
          </Button>
        ) : (
          <form onSubmit={handleCreateNew} className="p-3.5 rounded-xl border border-[#ded7c8] bg-white space-y-3">
            <h4 className="font-serif text-xs font-semibold text-[#1c1917]">
              {isVi ? "Thông tin thời khóa biểu mới" : "New Timetable Details"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Input
                label={isVi ? "Tên thời khóa biểu" : "Timetable Name"}
                placeholder={isVi ? "vd: Học kỳ 2 (2026)" : "e.g. Spring Term 2026"}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoComplete="off"
                required
              />
              <Input
                label={isVi ? "Học kỳ / Ghi chú" : "Term / Label"}
                placeholder={isVi ? "vd: HK2 hoặc Ca làm hè" : "e.g. Term 2"}
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(false)}
              >
                {isVi ? "Hủy" : "Cancel"}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isLoading || !newName.trim()}
                className="gap-1"
              >
                <span>{isLoading ? (isVi ? "Đang tạo..." : "Creating...") : isVi ? "Tạo ngay" : "Create"}</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
