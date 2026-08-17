"use client";

import * as React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { importCalendarAction } from "@/actions/schedule.actions";
import { parseIcsContent, type ParsedCalendarEvent } from "@/lib/icsParser";
import { DAYS_OF_WEEK, SUBJECT_COLORS, getSubjectColor } from "@/lib/constants";
import { Check, Trash2, Clock, Location, ArrowRight } from "reicon-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ImportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetableId: string;
  onSuccess?: () => void;
}

export function ImportCalendarModal({
  isOpen,
  onClose,
  timetableId,
  onSuccess,
}: ImportCalendarModalProps) {
  const { language } = useLanguage();
  const isVi = language === "vi";

  const [parsedEvents, setParsedEvents] = React.useState<ParsedCalendarEvent[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const text = await file.text();
      const events = parseIcsContent(text);
      if (events.length === 0) {
        setErrorMessage(
          isVi
            ? "Không tìm thấy sự kiện hợp lệ trong tệp .ics này. Vui lòng kiểm tra lại tệp."
            : "No valid recurring calendar events found in this .ics file."
        );
      } else {
        // Assign diverse aesthetic colors automatically
        const colorKeys = Object.keys(SUBJECT_COLORS);
        const coloredEvents = events.map((ev, i) => ({
          ...ev,
          color: colorKeys[i % colorKeys.length],
        }));
        setParsedEvents(coloredEvents);
      }
    } catch {
      setErrorMessage(
        isVi
          ? "Đã xảy ra lỗi khi đọc tệp lịch. Vui lòng thử lại."
          : "Failed to parse calendar file. Please try another file."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleSelectAll = (select: boolean) => {
    setParsedEvents((prev) => prev.map((e) => ({ ...e, selected: select })));
  };

  const handleToggleEvent = (id: string) => {
    setParsedEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e))
    );
  };

  const handleRemoveEvent = (id: string) => {
    setParsedEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleConfirmImport = async () => {
    const selected = parsedEvents.filter((e) => e.selected);
    if (selected.length === 0) {
      setErrorMessage(
        isVi
          ? "Vui lòng chọn ít nhất một sự kiện để nhập vào lịch."
          : "Please select at least one event to import."
      );
      return;
    }

    setIsImporting(true);
    setErrorMessage(null);

    try {
      const payload = selected.map((ev) => ({
        name: ev.summary,
        room: ev.location,
        note: ev.description,
        dayOfWeek: ev.dayOfWeek,
        startTime: ev.startTime,
        endTime: ev.endTime,
        type: ev.type,
        color: ev.color || "sage",
      }));

      await importCalendarAction(timetableId, payload);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : isVi ? "Không thể nhập lịch" : "Failed to import calendar"
      );
    } finally {
      setIsImporting(false);
    }
  };

  const selectedCount = parsedEvents.filter((e) => e.selected).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isVi ? "Nhập Lịch (Google Calendar / Apple iCal)" : "Import Calendar (.ics)"}
      description={
        isVi
          ? "Nhập nhanh lịch học, ca làm việc hoặc cuộc họp từ tệp .ics (Google, Apple, Outlook, Canvas)."
          : "Import classes, work shifts, or meetings from any .ics calendar export file."
      }
      maxWidth="lg"
    >
      <div className="space-y-4 pt-1">
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Step 1: Upload Dropzone if no events yet */}
        {parsedEvents.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 sm:p-10 rounded-2xl border-2 border-dashed border-[#ded7c8] bg-[#faf7f2] hover:bg-white hover:border-[#1c1917] transition-all cursor-pointer text-center group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".ics,text/calendar"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="h-12 w-12 rounded-2xl bg-[#ede8dc] flex items-center justify-center text-[#1c1917] mb-3 group-hover:scale-105 transition-transform">
              <Clock className="h-6 w-6" />
            </div>
            <h4 className="font-serif text-base font-semibold text-[#1c1917]">
              {isProcessing
                ? isVi
                  ? "Đang phân tích tệp lịch..."
                  : "Reading calendar..."
                : isVi
                ? "Chọn hoặc kéo thả tệp .ics vào đây"
                : "Choose or drop an .ics calendar file"}
            </h4>
            <p className="text-xs text-[#78716c] mt-1 max-w-sm leading-relaxed">
              {isVi
                ? "Hỗ trợ xuất từ Google Calendar, Apple Calendar (Mac/iPhone), Microsoft Outlook hoặc cổng thông tin sinh viên."
                : "Supports exports from Google Calendar, Apple iCal, Outlook, and University Portals."}
            </p>
          </div>
        ) : (
          /* Step 2: Preview & Select Events */
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#f0eae1]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#1c1917]">
                  {fileName} · {parsedEvents.length} {isVi ? "sự kiện tìm thấy" : "events found"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleSelectAll(true)}
                  className="text-[#57534e] hover:text-[#1c1917] hover:underline font-medium cursor-pointer"
                >
                  {isVi ? "Chọn tất cả" : "Select All"}
                </button>
                <span className="text-[#ded7c8]">|</span>
                <button
                  type="button"
                  onClick={() => handleToggleSelectAll(false)}
                  className="text-[#78716c] hover:text-[#1c1917] hover:underline cursor-pointer"
                >
                  {isVi ? "Bỏ chọn" : "Deselect"}
                </button>
              </div>
            </div>

            {/* Scrollable Event List */}
            <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
              {parsedEvents.map((ev) => {
                const dayObj = DAYS_OF_WEEK.find((d) => d.number === ev.dayOfWeek);
                const color = getSubjectColor(ev.color);

                return (
                  <div
                    key={ev.id}
                    onClick={() => handleToggleEvent(ev.id)}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      ev.selected
                        ? "border-[#1c1917] bg-white shadow-2xs"
                        : "border-[#e8e1d5] bg-[#faf7f2]/60 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox */}
                      <div
                        className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          ev.selected
                            ? "bg-[#1c1917] border-[#1c1917] text-white"
                            : "border-[#ded7c8] bg-white"
                        }`}
                      >
                        {ev.selected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>

                      {/* Color Tag & Day */}
                      <span
                        className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                        style={{ backgroundColor: color.bgHex, color: color.textHex }}
                      >
                        {dayObj?.short || `Day ${ev.dayOfWeek}`}
                      </span>

                      {/* Event Details */}
                      <div className="min-w-0">
                        <h5 className="text-xs font-semibold text-[#1c1917] truncate">
                          {ev.summary}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-[#78716c] mt-0.5">
                          <span className="flex items-center gap-0.5 font-medium">
                            <Clock className="h-2.5 w-2.5" />
                            {ev.startTime} – {ev.endTime}
                          </span>
                          {ev.location && (
                            <span className="flex items-center gap-0.5 truncate max-w-[140px]">
                              <Location className="h-2.5 w-2.5" />
                              {ev.location}
                            </span>
                          )}
                          <span className="capitalize text-[10px] px-1 rounded bg-[#ede8dc] text-[#57534e]">
                            {ev.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete button from preview */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveEvent(ev.id);
                      }}
                      className="p-1 rounded-md text-[#a8a29e] hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove from list"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Step 2 Bottom Actions */}
            <div className="pt-3 border-t border-[#f0eae1] flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setParsedEvents([]);
                  setFileName(null);
                }}
              >
                {isVi ? "Chọn tệp khác" : "Choose Another File"}
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleConfirmImport}
                disabled={selectedCount === 0 || isImporting}
                className="gap-1.5"
              >
                <span>
                  {isImporting
                    ? isVi
                      ? "Đang nhập..."
                      : "Importing..."
                    : isVi
                    ? `Nhập ${selectedCount} sự kiện vào lịch`
                    : `Import ${selectedCount} Events`}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
