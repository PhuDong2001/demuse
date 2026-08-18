"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/LanguageContext";
import { ArrowRight, Heart } from "reicon-react";

export function LandingPageClient() {
  const { language, setLanguage, t } = useLanguage();
  const isVi = language === "vi";

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c1917] overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-[#e8e1d5] bg-[#faf7f2]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-lg overflow-hidden shadow-2xs border border-[#ded7c8] bg-[#1c1917] flex items-center justify-center shrink-0">
              <Image
                src="/demuse_logo.png"
                alt="Demuse Logo"
                width={32}
                height={32}
                className="object-cover h-full w-full"
                priority
              />
            </div>
            <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-[#1c1917] leading-none">
              Demuse
            </span>
          </Link>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* About Link (hidden on small phone, visible on tablet+) */}
            <Link
              href="/about"
              className="hidden sm:inline-block text-xs font-semibold text-[#57534e] hover:text-[#1c1917] px-2.5 py-1 rounded-lg hover:bg-[#ede8dc] transition-all"
            >
              {isVi ? "Giới thiệu" : "About"}
            </Link>

            {/* 4-Language Switcher */}
            <div className="flex items-center rounded-lg border border-[#ded7c8] bg-white p-0.5 text-[10px] sm:text-xs font-semibold shrink-0">
              {(["vi", "en", "fr", "de"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded cursor-pointer transition-all ${
                    language === code
                      ? "bg-[#1c1917] text-[#faf7f2] shadow-2xs"
                      : "text-[#78716c] hover:text-[#1c1917]"
                  }`}
                >
                  <span className="uppercase">{code === "vi" ? "VN" : code.toUpperCase()}</span>
                </button>
              ))}
            </div>

            {/* Sign In Link */}
            <Link
              href="/login"
              className="text-[11px] sm:text-xs font-semibold text-[#57534e] hover:text-[#1c1917] px-1.5 sm:px-2.5 py-1 rounded-lg hover:bg-[#ede8dc] transition-all shrink-0"
            >
              {t.signIn}
            </Link>

            {/* Get Started Button */}
            <Link href="/register" className="shrink-0">
              <Button size="sm" variant="primary" className="gap-1 sm:gap-1.5 shadow-2xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs font-medium h-8 sm:h-9">
                <span className="hidden xs:inline">{t.getStarted}</span>
                <span className="xs:hidden">{isVi ? "Bắt đầu" : "Start"}</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with Balanced Illustrations on both sides */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-20 sm:pb-20 overflow-hidden">
          {/* Subtle ambient blur background accents */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ede8dc]/40 rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* Left illustration: Schedule Calendar */}
          <div className="hidden lg:block absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 w-40 xl:w-44 pointer-events-none select-none transition-transform hover:scale-105 duration-300">
            <div className="relative p-3 rounded-2xl border border-[#ded7c8]/80 bg-white/70 backdrop-blur-xs shadow-sm rotate-[-4deg]">
              <Image
                src="https://cdn.reicon.dev/schedule.svg"
                alt="A schedule illustration"
                width={160}
                height={160}
                className="w-full h-auto drop-shadow-2xs"
                priority
              />
              <div className="mt-2 text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716c] bg-[#ede8dc]/70 px-2 py-0.5 rounded-full">
                  {isVi ? "Thời khóa biểu" : "24h Schedule"}
                </span>
              </div>
            </div>
          </div>

          {/* Right illustrations: Board & Accountant Laptop stacked gracefully */}
          <div className="hidden lg:flex flex-col gap-4 absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 w-40 xl:w-44 pointer-events-none select-none">
            <div className="relative p-3 rounded-2xl border border-[#ded7c8]/80 bg-white/70 backdrop-blur-xs shadow-sm rotate-[4deg] transition-transform hover:scale-105 duration-300">
              <Image
                src="https://cdn.reicon.dev/board.svg"
                alt="A board illustration"
                width={150}
                height={150}
                className="w-full h-auto drop-shadow-2xs"
                priority
              />
              <div className="mt-2 text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716c] bg-[#ede8dc]/70 px-2 py-0.5 rounded-full">
                  {isVi ? "Kế hoạch tuần" : "Weekly Plan"}
                </span>
              </div>
            </div>

            <div className="relative p-2.5 rounded-2xl border border-[#ded7c8]/80 bg-white/70 backdrop-blur-xs shadow-sm rotate-[-2deg] transition-transform hover:scale-105 duration-300">
              <Image
                src="https://cdn.reicon.dev/accountant-laptop.svg"
                alt="An accountant with a laptop illustration"
                width={140}
                height={140}
                className="w-full h-auto drop-shadow-2xs"
                priority
              />
            </div>
          </div>

          {/* Center Hero Content (Well-spaced & completely uncluttered) */}
          <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-6 relative z-10">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1c1917] leading-[1.15]">
              {t.heroTitle}
            </h1>

            <p className="text-xs sm:text-base text-[#6b645b] max-w-xl mx-auto leading-relaxed px-2">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-2 max-w-xs sm:max-w-none mx-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2 shadow-xs px-6">
                  <span>{t.startFree}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6">
                  <span>{isVi ? "Tìm hiểu thêm" : "Learn More"}</span>
                </Button>
              </Link>
            </div>

            {/* Mobile-only compact illustration strip */}
            <div className="flex lg:hidden items-center justify-center gap-3 pt-4">
              <div className="p-2 rounded-xl border border-[#ded7c8] bg-white/80 shadow-2xs">
                <Image
                  src="https://cdn.reicon.dev/schedule.svg"
                  alt="A schedule"
                  width={56}
                  height={56}
                  className="h-12 w-12"
                />
              </div>
              <div className="p-2 rounded-xl border border-[#ded7c8] bg-white/80 shadow-2xs">
                <Image
                  src="https://cdn.reicon.dev/board.svg"
                  alt="A board"
                  width={56}
                  height={56}
                  className="h-12 w-12"
                />
              </div>
              <div className="p-2 rounded-xl border border-[#ded7c8] bg-white/80 shadow-2xs">
                <Image
                  src="https://cdn.reicon.dev/accountant-laptop.svg"
                  alt="Laptop planner"
                  width={56}
                  height={56}
                  className="h-12 w-12"
                />
              </div>
            </div>

            <p className="text-[11px] text-[#a8a29e] pt-1">
              {t.demoNote}
            </p>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-[#e8e1d5] space-y-6 sm:space-y-8">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-xl sm:text-3xl font-medium text-[#1c1917]">
              {t.whatDemuseDoes}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] max-w-md mx-auto">
              {t.whatDemuseDoesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-left">
            {/* Feature 1: Live Countdown (wait.gif) */}
            <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 space-y-2.5 shadow-2xs hover:shadow-xs transition-all hover:border-[#1c1917]/30 group">
              <div className="h-11 w-11 rounded-xl bg-[#faf7f2] border border-[#ded7c8] p-1.5 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                <Image
                  src="/animation_icon/wait.gif"
                  alt="Countdown"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
              <h3 className="font-serif text-base font-semibold text-[#1c1917]">
                {t.feature1Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>

            {/* Feature 2: Conflict Detection (binocular.gif) */}
            <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 space-y-2.5 shadow-2xs hover:shadow-xs transition-all hover:border-[#1c1917]/30 group">
              <div className="h-11 w-11 rounded-xl bg-[#faf7f2] border border-[#ded7c8] p-1.5 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                <Image
                  src="/animation_icon/binocular.gif"
                  alt="Conflict Detection"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
              <h3 className="font-serif text-base font-semibold text-[#1c1917]">
                {t.feature2Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>

            {/* Feature 3: Notifications (notification.gif) */}
            <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 space-y-2.5 shadow-2xs hover:shadow-xs transition-all hover:border-[#1c1917]/30 group">
              <div className="h-11 w-11 rounded-xl bg-[#faf7f2] border border-[#ded7c8] p-1.5 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                <Image
                  src="/animation_icon/notification.gif"
                  alt="Notifications"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
              <h3 className="font-serif text-base font-semibold text-[#1c1917]">
                {t.feature3Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature3Desc}
              </p>
            </div>

            {/* Feature 4: Share Timetable (share.gif) */}
            <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 space-y-2.5 shadow-2xs hover:shadow-xs transition-all hover:border-[#1c1917]/30 group">
              <div className="h-11 w-11 rounded-xl bg-[#faf7f2] border border-[#ded7c8] p-1.5 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                <Image
                  src="/animation_icon/share.gif"
                  alt="Share Schedule"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
              <h3 className="font-serif text-base font-semibold text-[#1c1917]">
                {t.feature4Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature4Desc}
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Strip */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="rounded-2xl border border-[#ded7c8] bg-[#1c1917] text-[#faf7f2] p-6 sm:p-10 text-center space-y-4 shadow-sm">
            <h2 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-[#faf7f2]">
              {t.ctaTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#a8a29e] max-w-md mx-auto leading-relaxed">
              {t.ctaSub}
            </p>
            <div className="pt-2">
              <Link href="/register" className="inline-block w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#faf7f2] text-[#1c1917] hover:bg-white border-0 gap-2 font-semibold shadow-xs px-6">
                  <span>{t.ctaButton}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Professional Compact Footer */}
      <footer className="border-t border-[#e8e1d5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            {/* Brand & Creators */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 text-xs text-[#78716c]">
              <div className="flex items-center gap-1.5 font-serif font-semibold text-sm text-[#1c1917]">
                <div className="relative h-5 w-5 rounded-md overflow-hidden border border-[#ded7c8] shrink-0 bg-[#1c1917]">
                  <Image
                    src="/demuse_logo.png"
                    alt="Demuse"
                    width={20}
                    height={20}
                    className="object-cover h-full w-full"
                  />
                </div>
                <span>Demuse</span>
              </div>

              <span className="hidden sm:inline text-[#ded7c8]">/</span>

              <span className="text-[#57534e] flex items-center gap-1">
                <Heart className="h-3 w-3 text-rose-500 shrink-0 inline" />
                <span>{isVi ? "Xây dựng bởi" : "Built by"}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <a
                  href="https://github.com/DongDuong2001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1c1917] hover:underline transition-all"
                >
                  Dong Duong
                </a>
                <span className="text-[#a8a29e]">&</span>
                <a
                  href="https://github.com/mthutt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1c1917] hover:underline transition-all"
                >
                  Thu Tran
                </a>
              </div>
            </div>

            {/* Support Links */}
            <div className="flex items-center justify-center gap-2">
              <a
                href="https://github.com/sponsors/DongDuong2001"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg border border-[#ded7c8] bg-[#faf7f2] hover:bg-[#ede8dc] hover:text-[#1c1917] transition-all text-xs font-medium text-[#57534e]"
              >
                GitHub Sponsors
              </a>
              <a
                href="https://ko-fi.com/dongphuduong"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg border border-[#ded7c8] bg-[#faf7f2] hover:bg-[#ede8dc] hover:text-[#1c1917] transition-all text-xs font-medium text-[#57534e]"
              >
                Ko-fi
              </a>
            </div>
          </div>

          {/* Bottom links & Copyright */}
          <div className="pt-3 border-t border-[#f0eae1] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-[#8c8275] text-center sm:text-left">
            <div className="flex items-center justify-center gap-3.5">
              <Link href="/about" className="hover:text-[#1c1917] transition-colors">
                {isVi ? "Giới thiệu" : "About"}
              </Link>
              <Link href="/privacy" className="hover:text-[#1c1917] transition-colors">
                {t.privacyPolicy}
              </Link>
              <Link href="/terms" className="hover:text-[#1c1917] transition-colors">
                {t.termsOfService}
              </Link>
            </div>

            <span>
              © {new Date().getFullYear()} Demuse · {isVi ? "Dành cho sinh viên & học tập" : "Designed for learners"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
