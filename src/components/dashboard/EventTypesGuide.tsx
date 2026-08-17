"use client";

import * as React from "react";
import { CLASS_TYPES } from "@/lib/constants";
import { useLanguage } from "@/lib/LanguageContext";
import { Sparkles, Plus } from "reicon-react";

interface EventTypesGuideProps {
  onSelectType?: (typeValue: string) => void;
}

const EVENT_TYPE_DETAILS: Record<
  string,
  { viLabel: string; viDesc: string; enDesc: string; iconEmoji: string; badgeColor: string }
> = {
  lecture: {
    viLabel: "Tiết lý thuyết",
    viDesc: "Tiết học lý thuyết, bài giảng trên lớp",
    enDesc: "Standard lecture or classroom instruction",
    iconEmoji: "📚",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  lab: {
    viLabel: "Thực hành / Lab",
    viDesc: "Phòng thí nghiệm, máy tính, thực hành",
    enDesc: "Hands-on laboratory or practical session",
    iconEmoji: "🧪",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
  },
  work: {
    viLabel: "Ca làm việc / Trực ca",
    viDesc: "Ca làm việc tại công ty, trực ca bán thời gian",
    enDesc: "Work shift, job tasks, or company duties",
    iconEmoji: "💼",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
  },
  meeting: {
    viLabel: "Họp nhóm / Khách hàng",
    viDesc: "Họp đồ án, họp nhóm, trao đổi đối tác",
    enDesc: "Team sync, group project, or client call",
    iconEmoji: "👥",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
  },
  study: {
    viLabel: "Tự học / Tập trung",
    viDesc: "Khung giờ học bài, làm đồ án sâu",
    enDesc: "Dedicated deep work or self-study block",
    iconEmoji: "🎯",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
  },
  personal: {
    viLabel: "Cá nhân / Thể thao",
    viDesc: "Tập gym, thể dục, sinh hoạt cá nhân",
    enDesc: "Workout, fitness, or personal habits",
    iconEmoji: "🏃",
    badgeColor: "bg-orange-50 text-orange-800 border-orange-200",
  },
  tutorial: {
    viLabel: "Hướng dẫn / Bài tập",
    viDesc: "Buổi sửa bài tập, trợ giảng hướng dẫn",
    enDesc: "Discussion or problem-solving tutorial",
    iconEmoji: "📝",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
  },
  seminar: {
    viLabel: "Hội thảo / Chuyên đề",
    viDesc: "Chuyên đề học thuật, báo cáo nghiên cứu",
    enDesc: "Academic seminar or keynote lecture",
    iconEmoji: "🎙️",
    badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
  workshop: {
    viLabel: "Workshop / Kỹ năng",
    viDesc: "Khóa tập huấn kỹ năng thực chiến",
    enDesc: "Skill-building workshop or hackathon",
    iconEmoji: "🛠️",
    badgeColor: "bg-stone-100 text-stone-800 border-stone-300",
  },
};

export function EventTypesGuide({ onSelectType }: EventTypesGuideProps) {
  const { language } = useLanguage();
  const isVi = language === "vi";

  return (
    <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#854d0e]" />
          <h3 className="font-serif text-sm font-semibold text-[#1c1917]">
            {isVi ? "Phân loại Sự kiện & Lịch trình" : "Event & Activity Types"}
          </h3>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c] bg-[#ede8dc]/80 px-2 py-0.5 rounded-full">
          Study & Work
        </span>
      </div>

      <p className="text-xs text-[#78716c] leading-relaxed">
        {isVi
          ? "Demuse hỗ trợ đầy đủ các phân loại để bạn dễ dàng quản lý trọn vẹn lịch học, ca làm và thói quen cá nhân:"
          : "Demuse supports tailored event categories to help balance classes, jobs, and personal routines:"}
      </p>

      {/* Grid of types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
        {CLASS_TYPES.map((ct) => {
          const detail = EVENT_TYPE_DETAILS[ct.value] || {
            viLabel: ct.label,
            viDesc: "",
            enDesc: "",
            iconEmoji: "📌",
            badgeColor: "bg-[#f5f1e9] text-[#1c1917] border-[#ded7c8]",
          };

          return (
            <div
              key={ct.value}
              onClick={() => onSelectType?.(ct.value)}
              className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#ded7c8]/80 bg-[#faf7f2]/50 hover:bg-white hover:border-[#1c1917]/30 hover:shadow-2xs transition-all cursor-pointer group select-none text-left"
            >
              <span className="text-base shrink-0 select-none">{detail.iconEmoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-[#1c1917] truncate">
                    {isVi ? detail.viLabel : ct.label}
                  </span>
                  {onSelectType && (
                    <Plus className="h-3 w-3 text-[#a8a29e] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-[#78716c] line-clamp-1 leading-tight mt-0.5">
                  {isVi ? detail.viDesc : detail.enDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
