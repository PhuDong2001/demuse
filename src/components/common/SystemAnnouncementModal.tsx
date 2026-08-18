"use client";

import * as React from "react";
import Image from "next/image";
import { X, Sparkles, ArrowRight, Check } from "reicon-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "demuse_notice_dismissed_v1";

export function SystemAnnouncementModal() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    // Only show if not previously dismissed in this version
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Delay slightly for smooth entering animation
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop with soft blur */}
      <div
        className="fixed inset-0 bg-[#1c1917]/40 backdrop-blur-xs transition-opacity"
        onClick={handleDismiss}
      />

      {/* Modal Dialog Styled to Demuse Aesthetic */}
      <div className="relative w-full max-w-md bg-[#faf7f2] rounded-2xl sm:rounded-3xl border border-[#ded7c8] shadow-2xl overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-linear-to-r from-[#854d0e] via-[#b45309] to-[#854d0e]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-7 text-center">
          {/* Animated Notification Badge with White Rounded Background */}
          <div className="mx-auto mb-4 relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white border border-[#e8e1d5] shadow-sm flex items-center justify-center overflow-hidden p-2">
            <Image
              src="/animation_icon/notification.gif"
              alt="Notification"
              width={72}
              height={72}
              className="h-full w-full object-contain rounded-full"
              unoptimized
            />
          </div>

          {/* Announcement Title */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ede8dc] border border-[#ded7c8] text-[11px] font-semibold text-[#854d0e] mb-2 uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>{isVi ? "Thông Báo Mới" : "What's New"}</span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#1c1917] mb-2">
            {isVi
              ? "Chào mừng đến với Demuse!"
              : "Welcome to Demuse Schedule!"}
          </h3>

          <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed mb-5">
            {isVi
              ? "Không gian quản lý thời khóa biểu học tập, ca làm việc & sinh hoạt cá nhân. Đã có Trợ lý AI siêu tốc, Xuất ảnh màn hình khóa 9:16 và Nhập lịch .ics!"
              : "Your calm, intentional timetable for study, work & life. Now powered with ultra-fast AI assistant, 9:16 Lockscreen export & iCalendar (.ics) sync!"}
          </p>

          {/* Key Feature Highlights */}
          <div className="bg-white/80 rounded-xl p-3.5 border border-[#ded7c8] text-left space-y-2 mb-6 text-xs text-[#1c1917]">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5" />
              </div>
              <span className="font-medium">
                {isVi ? "Trợ lý AI phân tích lịch học & ca làm" : "AI Schedule insights & clash detection"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5" />
              </div>
              <span className="font-medium">
                {isVi ? "Khung giờ 24h & xuất hình nền điện thoại" : "24h timeline grid & phone wallpaper export"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5" />
              </div>
              <span className="font-medium">
                {isVi ? "Nhập lịch Google / Apple Calendar (.ics)" : "Zero-friction iCalendar import (.ics)"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="primary"
              className="w-full justify-center gap-1.5 shadow-sm py-2.5"
              onClick={handleDismiss}
            >
              <span>{isVi ? "Khám phá ngay" : "Got it, explore now"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
