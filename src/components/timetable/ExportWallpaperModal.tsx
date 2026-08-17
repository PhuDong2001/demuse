"use client";

import * as React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { toPng } from "html-to-image";
import { DAYS_OF_WEEK, getSubjectColor } from "@/lib/constants";
import { type ScheduleWithSubject } from "@/lib/time";
import { Download, Sparkles, Copy, Check, Mobile, Monitor, DocumentText } from "reicon-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ExportWallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetableName: string;
  schedules: ScheduleWithSubject[];
}

type AspectRatioMode = "phone" | "desktop" | "print";

export function ExportWallpaperModal({
  isOpen,
  onClose,
  timetableName,
  schedules,
}: ExportWallpaperModalProps) {
  const { language } = useLanguage();
  const isVi = language === "vi";

  const [aspectRatio, setAspectRatio] = React.useState<AspectRatioMode>("phone");
  const [isExporting, setIsExporting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const wallpaperRef = React.useRef<HTMLDivElement>(null);

  const quote = isVi
    ? "Mỗi ngày là một cơ hội mới để học hỏi và kiến tạo tương lai."
    : "Every day is a quiet step toward your greatest achievements.";

  const handleDownload = async () => {
    if (!wallpaperRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(wallpaperRef.current, {
        quality: 0.98,
        pixelRatio: 2, // 2x retina clarity
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `demuse-${timetableName.toLowerCase().replace(/\s+/g, "-")}-${aspectRatio}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (!wallpaperRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(wallpaperRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isVi ? "Xuất Ảnh Hình Nền & Story" : "Export Wallpaper & Story"}
      description={
        isVi
          ? "Tạo hình nền thời khóa biểu chuẩn tỉ lệ màn hình khóa iPhone/Android hoặc Desktop cực đẹp."
          : "Create high-resolution wallpapers tailored for phone lockscreens, tablets, or desktop backgrounds."
      }
      maxWidth="xl"
    >
      <div className="space-y-4 pt-1">
        {/* Aspect Ratio Selector Tabs */}
        <div className="flex items-center justify-center p-1 bg-[#ede8dc]/70 rounded-xl border border-[#ded7c8] gap-1">
          <button
            type="button"
            onClick={() => setAspectRatio("phone")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              aspectRatio === "phone"
                ? "bg-white text-[#1c1917] shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <Mobile className="h-3.5 w-3.5" />
            <span>{isVi ? "Hình Nền Khóa 9:16" : "Phone 9:16"}</span>
          </button>

          <button
            type="button"
            onClick={() => setAspectRatio("desktop")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              aspectRatio === "desktop"
                ? "bg-white text-[#1c1917] shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>{isVi ? "Màn Hình Ngang 16:9" : "Desktop 16:9"}</span>
          </button>

          <button
            type="button"
            onClick={() => setAspectRatio("print")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              aspectRatio === "print"
                ? "bg-white text-[#1c1917] shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <DocumentText className="h-3.5 w-3.5" />
            <span>{isVi ? "Bản In A4" : "A4 Print"}</span>
          </button>
        </div>

        {/* Wallpaper Live Canvas Container */}
        <div className="flex items-center justify-center bg-[#292524] p-4 sm:p-6 rounded-2xl overflow-hidden border border-[#1c1917]">
          {/* 9:16 Phone Wallpaper */}
          {aspectRatio === "phone" && (
            <div
              ref={wallpaperRef}
              className="w-[300px] h-[533px] bg-[#faf7f2] rounded-3xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden select-none border border-[#e8e1d5]"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
              }}
            >
              {/* Top Lockscreen Clock Safe Area */}
              <div className="text-center pt-2 space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#a8a29e]">
                  {timetableName}
                </span>
                <p className="text-[11px] italic text-[#78716c] font-sans px-2 line-clamp-2">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>

              {/* Weekly Mini-Grid */}
              <div className="grid grid-cols-7 gap-1 my-auto pt-2">
                {DAYS_OF_WEEK.map((day) => {
                  const daySchedules = schedules.filter((s) => s.dayOfWeek === day.number);
                  return (
                    <div key={day.number} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-[#1c1917] uppercase">
                        {day.short}
                      </span>
                      <div className="w-full flex flex-col gap-1 min-h-[190px] rounded-lg bg-white/70 p-1 border border-[#e8e1d5]/80">
                        {daySchedules.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-[8px] text-[#d6cfc4]">
                            ·
                          </div>
                        ) : (
                          daySchedules.map((s) => {
                            const color = getSubjectColor(s.subject.color);
                            return (
                              <div
                                key={s.id}
                                className="rounded p-1 text-[8px] leading-tight font-sans"
                                style={{
                                  backgroundColor: color.bgHex,
                                  color: color.textHex,
                                  borderLeft: `2px solid ${color.accent}`,
                                }}
                              >
                                <p className="font-bold truncate">{s.subject.name}</p>
                                <p className="text-[7px] opacity-80">{s.startTime}</p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Subtle Watermark */}
              <div className="text-center pb-1 flex items-center justify-center gap-1 opacity-70">
                <Sparkles className="h-2.5 w-2.5 text-[#854d0e]" />
                <span className="text-[9px] font-sans font-bold tracking-wider uppercase text-[#78716c]">
                  Demuse.app · Intentional Schedule
                </span>
              </div>
            </div>
          )}

          {/* 16:9 Desktop Wallpaper */}
          {aspectRatio === "desktop" && (
            <div
              ref={wallpaperRef}
              className="w-[520px] h-[292px] bg-[#faf7f2] rounded-2xl p-4 shadow-2xl flex flex-col justify-between relative overflow-hidden select-none border border-[#e8e1d5]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-1 border-b border-[#e8e1d5]">
                <span className="font-serif text-sm font-bold text-[#1c1917]">
                  {timetableName}
                </span>
                <span className="text-[10px] text-[#78716c] font-sans">{quote}</span>
              </div>

              {/* 7 Days Grid */}
              <div className="grid grid-cols-7 gap-1.5 my-auto">
                {DAYS_OF_WEEK.map((day) => {
                  const daySchedules = schedules.filter((s) => s.dayOfWeek === day.number);
                  return (
                    <div key={day.number} className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-center text-[#1c1917] uppercase">
                        {day.short}
                      </span>
                      <div className="w-full flex flex-col gap-1 min-h-[140px] rounded-lg bg-white/70 p-1 border border-[#e8e1d5]/80">
                        {daySchedules.map((s) => {
                          const color = getSubjectColor(s.subject.color);
                          return (
                            <div
                              key={s.id}
                              className="rounded p-1 text-[8px] leading-tight"
                              style={{
                                backgroundColor: color.bgHex,
                                color: color.textHex,
                                borderLeft: `2px solid ${color.accent}`,
                              }}
                            >
                              <p className="font-bold truncate">{s.subject.name}</p>
                              <p className="text-[7px] opacity-80">{s.startTime} - {s.endTime}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Watermark */}
              <div className="flex items-center justify-between text-[9px] text-[#78716c]">
                <span>Demuse · Study, Work & Life</span>
                <span>demuse.app</span>
              </div>
            </div>
          )}

          {/* A4 Clean Print Preview */}
          {aspectRatio === "print" && (
            <div
              ref={wallpaperRef}
              className="w-[420px] h-[297px] bg-white rounded-lg p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden select-none border border-stone-300 text-stone-900"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <div>
                  <h3 className="font-serif text-base font-bold">{timetableName}</h3>
                  <p className="text-[9px] text-stone-500 font-sans">Weekly Timetable & Schedule</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  DEMUSE
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 my-auto">
                {DAYS_OF_WEEK.map((day) => {
                  const daySchedules = schedules.filter((s) => s.dayOfWeek === day.number);
                  return (
                    <div key={day.number} className="flex flex-col gap-1 border-r last:border-r-0 border-stone-200 pr-1">
                      <span className="text-[10px] font-bold uppercase text-stone-800">{day.short}</span>
                      <div className="space-y-1">
                        {daySchedules.map((s) => (
                          <div key={s.id} className="p-1 rounded bg-stone-50 border border-stone-200 text-[8px]">
                            <p className="font-bold truncate">{s.subject.name}</p>
                            <p className="text-stone-500">{s.startTime}-{s.endTime}</p>
                            {s.room && <p className="text-stone-400 truncate">{s.room}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-[8px] text-stone-400 border-t pt-1">
                Printed via Demuse · https://demuse.app
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0eae1]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyImage}
            disabled={isExporting}
            className="gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? (isVi ? "Đã sao chép ảnh!" : "Copied Image!") : isVi ? "Sao chép ảnh" : "Copy Image"}</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleDownload}
            disabled={isExporting}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>
              {isExporting
                ? isVi
                  ? "Đang xuất ảnh..."
                  : "Exporting..."
                : isVi
                ? "Tải ảnh HD (.png)"
                : "Download HD (.png)"}
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
