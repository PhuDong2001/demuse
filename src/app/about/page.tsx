"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { ArrowLeft, Sparkles, Heart, ArrowRight } from "reicon-react";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c1917]">
      {/* Header */}
      <header className="border-b border-[#e8e1d5] bg-[#faf7f2]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-xl overflow-hidden border border-[#ded7c8] bg-[#1c1917] flex items-center justify-center shrink-0">
              <Image
                src="/demuse_logo.png"
                alt="Demuse Logo"
                width={32}
                height={32}
                className="object-cover h-full w-full"
              />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight text-[#1c1917]">
              Demuse
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#57534e] hover:text-[#1c1917] px-3 py-1.5 rounded-lg border border-[#ded7c8] bg-white hover:bg-[#ede8dc] transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{isVi ? "Trang chủ" : "Home"}</span>
            </Link>
            <Link href="/register">
              <Button size="sm" variant="primary" className="gap-1.5 shadow-xs">
                <span>{isVi ? "Bắt đầu ngay" : "Get Started"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        {/* Hero Card */}
        <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-3 pb-6 border-b border-[#f0eae1]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede8dc] text-xs font-semibold text-[#57534e]">
              <Sparkles className="h-3.5 w-3.5 text-[#854d0e]" />
              <span>{isVi ? "Về Dự Án Demuse" : "About Demuse"}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#1c1917] leading-tight">
              {isVi
                ? "Một không gian quản lý lịch trình tinh gọn cho học tập, công việc & đời sống"
                : "A calm, intentional schedule planner for study, work & life"}
            </h1>
            <p className="text-sm sm:text-base text-[#6b645b] max-w-2xl leading-relaxed">
              {isVi
                ? "Demuse được tạo ra để mang lại trải nghiệm xếp lịch nhẹ nhàng, rõ ràng và không rối rắm. Dù là lịch học trên trường, ca làm việc tại công ty, cuộc họp nhóm hay thói quen cá nhân, bạn đều có thể bao quát toàn bộ tuần chỉ trong một cái nhìn."
                : "Demuse was created to provide a calm, clutter-free schedule workspace. Whether you are balancing university lectures, work shifts, team meetings, or personal routines, Demuse brings complete clarity to your entire week at a single glance."}
            </p>
          </div>

          {/* Philosophy / Story */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-[#ded7c8] bg-[#faf7f2]/60 p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
                {isVi ? "Tôn Chỉ Thiết Kế" : "Design Philosophy"}
              </span>
              <h3 className="font-serif text-base font-semibold text-[#1c1917]">
                {isVi ? "Tối Giản & Sâu Sắc" : "Less, but Better"}
              </h3>
              <p className="text-xs text-[#6b645b] leading-relaxed">
                {isVi
                  ? "Tập trung tuyệt đối vào thời gian và công việc của bạn, không chi tiết thừa, màu sắc trang nhã được cân chỉnh hài hòa."
                  : "Zero clutter, harmonious palette, and intuitive interactions designed to reduce cognitive load."}
              </p>
            </div>

            <div className="rounded-xl border border-[#ded7c8] bg-[#faf7f2]/60 p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
                {isVi ? "Tính Linh Hoạt" : "Work & Life Balance"}
              </span>
              <h3 className="font-serif text-base font-semibold text-[#1c1917]">
                {isVi ? "Đa Năng & Mở Rộng" : "Study & Work Flow"}
              </h3>
              <p className="text-xs text-[#6b645b] leading-relaxed">
                {isVi
                  ? "Hỗ trợ đầy đủ tiết học, ca làm, cuộc họp, buổi tự học và đồng bộ lịch .ics từ Google Calendar, Apple iCal."
                  : "Effortlessly combine coursework, job shifts, meetings, and calendar sync from Google & Apple."}
              </p>
            </div>

            <div className="rounded-xl border border-[#ded7c8] bg-[#faf7f2]/60 p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
                {isVi ? "Bảo Mật & Quyền Riêng Tư" : "Privacy & Speed"}
              </span>
              <h3 className="font-serif text-base font-semibold text-[#1c1917]">
                {isVi ? "An Toàn Tuyệt Đối" : "Fast & Private"}
              </h3>
              <p className="text-xs text-[#6b645b] leading-relaxed">
                {isVi
                  ? "Dữ liệu riêng tư được bảo vệ nghiêm ngặt, cookie an toàn HttpOnly, không bán dữ liệu cho bên thứ ba."
                  : "Strict HttpOnly session security, encrypted databases, and zero tracking of your schedule."}
              </p>
            </div>
          </div>
        </div>

        {/* Creators / Team Section */}
        <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78716c]">
              <Heart className="h-4 w-4 text-rose-500" />
              <span>{isVi ? "Đội Ngũ Phát Triển" : "The Creators"}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1917]">
              {isVi ? "Ý tưởng & Xây dựng bởi" : "Designed & Built by"}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c]">
              {isVi
                ? "Sản phẩm được lên ý tưởng, thiết kế và hiện thực hóa bởi chúng tôi với niềm đam mê dành cho sự tinh tế và tiện dụng."
                : "Demuse is crafted with love and care, driven by a passion for refined aesthetics and smooth developer craft."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dong Duong */}
            <a
              href="https://github.com/DongDuong2001"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-[#ded7c8] bg-[#faf7f2]/50 hover:bg-white hover:border-[#1c1917] p-5 transition-all shadow-2xs hover:shadow-xs flex items-center gap-4"
            >
              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-[#ded7c8] group-hover:border-[#1c1917] shrink-0 bg-[#ede8dc]">
                <Image
                  src="https://github.com/DongDuong2001.png"
                  alt="Dong Duong"
                  width={56}
                  height={56}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-base font-semibold text-[#1c1917] group-hover:underline">
                    Dong Duong
                  </h3>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#1c1917] text-white">
                    Dev
                  </span>
                </div>
                <p className="text-xs text-[#78716c] truncate">@DongDuong2001</p>
                <p className="text-xs text-[#57534e] mt-1 line-clamp-1">
                  {isVi ? "Kiến trúc hệ thống, Engineering & UX" : "System Architecture, Engineering & UX"}
                </p>
              </div>
            </a>

            {/* Thu Tran */}
            <a
              href="https://github.com/mthutt"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-[#ded7c8] bg-[#faf7f2]/50 hover:bg-white hover:border-[#1c1917] p-5 transition-all shadow-2xs hover:shadow-xs flex items-center gap-4"
            >
              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-[#ded7c8] group-hover:border-[#1c1917] shrink-0 bg-[#ede8dc]">
                <Image
                  src="https://github.com/mthutt.png"
                  alt="Thu Tran"
                  width={56}
                  height={56}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-base font-semibold text-[#1c1917] group-hover:underline">
                    Thu Tran
                  </h3>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-600 text-white">
                    Creator
                  </span>
                </div>
                <p className="text-xs text-[#78716c] truncate">@mthutt</p>
                <p className="text-xs text-[#57534e] mt-1 line-clamp-1">
                  {isVi ? "Ý tưởng sản phẩm, Trải nghiệm & Thiết kế" : "Product Concept, Experience & Aesthetics"}
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Support & Sponsors Card */}
        <div className="rounded-2xl border border-[#ded7c8] bg-[#1c1917] text-[#faf7f2] p-6 sm:p-8 text-center space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#faf7f2]">
            {isVi ? "Đồng hành & Ủng hộ Demuse" : "Support Demuse Development"}
          </h2>
          <p className="text-xs sm:text-sm text-[#a8a29e] max-w-lg mx-auto leading-relaxed">
            {isVi
              ? "Demuse là dự án phi lợi nhuận hướng tới cộng đồng học tập. Sự ủng hộ của bạn là nguồn động lực to lớn giúp chúng tôi duy trì và phát triển thêm nhiều tính năng hữu ích."
              : "Demuse is an independent, student-first project. Your sponsorship directly supports server hosting, domain maintenance, and ongoing feature development."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://github.com/sponsors/DongDuong2001"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#faf7f2] text-[#1c1917] hover:bg-white font-semibold text-xs transition-all shadow-xs"
            >
              <span>GitHub Sponsors</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>

            <a
              href="https://ko-fi.com/dongphuduong"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#ded7c8]/30 bg-white/10 text-white hover:bg-white/20 font-semibold text-xs transition-all"
            >
              <span>Ko-fi</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e1d5] bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#78716c]">
          <span className="flex items-center gap-2 font-serif font-semibold text-[#1c1917]">
            Demuse · {isVi ? "Thiết kế & Xây dựng bởi Dong Duong & Thu Tran" : "Designed & Built by Dong Duong & Thu Tran"}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#1c1917] underline">
              {isVi ? "Bảo mật" : "Privacy"}
            </Link>
            <Link href="/terms" className="hover:text-[#1c1917] underline">
              {isVi ? "Điều khoản" : "Terms"}
            </Link>
            <span>© {new Date().getFullYear()} Demuse</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
