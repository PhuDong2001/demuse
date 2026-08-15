"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/LanguageContext";
import {
  ArrowRight,
  Clock,
  Share,
  Sliders,
  Bell,
  Lock,
} from "reicon-react";

export function LandingPageClient() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c1917] overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-[#e8e1d5] bg-[#faf7f2]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-xl overflow-hidden shadow-xs border border-[#ded7c8] bg-[#1c1917] flex items-center justify-center shrink-0">
              <Image
                src="/demuse_logo.png"
                alt="Demuse Logo"
                width={36}
                height={36}
                className="object-cover h-full w-full"
                priority
              />
            </div>
            <span className="font-serif text-lg sm:text-2xl font-medium tracking-tight text-[#1c1917] leading-none">
              Demuse
            </span>
          </Link>

          {/* Navigation & Language Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* 4-Language Switcher (Compact code badges on mobile, full labels on desktop) */}
            <div className="flex items-center rounded-lg border border-[#ded7c8] bg-white p-0.5 text-[11px] sm:text-xs font-semibold shrink-0">
              {(["vi", "en", "fr", "de"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer transition-all ${
                    language === code
                      ? "bg-[#1c1917] text-[#faf7f2] shadow-2xs"
                      : "text-[#78716c] hover:text-[#1c1917]"
                  }`}
                >
                  <span className="sm:hidden uppercase">{code === "vi" ? "VN" : code}</span>
                  <span className="hidden sm:inline">
                    {code === "vi" ? "Tiếng Việt" : code === "en" ? "English" : code === "fr" ? "Français" : "Deutsch"}
                  </span>
                </button>
              ))}
            </div>

            <Link
              href="/login"
              className="text-xs font-semibold text-[#57534e] hover:text-[#1c1917] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-[#ede8dc] transition-all shrink-0"
            >
              {t.signIn}
            </Link>

            <Link href="/register" className="shrink-0">
              <Button size="sm" variant="primary" className="gap-1 sm:gap-1.5 shadow-xs px-2.5 sm:px-3 py-1 text-xs">
                <span>{t.getStarted}</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 sm:pt-20 sm:pb-16 text-center space-y-4 sm:space-y-5">
          <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1c1917] max-w-2xl mx-auto leading-tight">
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

            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6">
                <span>{t.signIn}</span>
              </Button>
            </Link>
          </div>

          <p className="text-[11px] text-[#a8a29e] pt-1">
            {t.demoNote}
          </p>
        </section>

        {/* Feature Highlights Grid */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-t border-[#e8e1d5] space-y-6 sm:space-y-8">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-xl sm:text-3xl font-medium text-[#1c1917]">
              {t.whatDemuseDoes}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] max-w-md mx-auto">
              {t.whatDemuseDoesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-left">
            <div className="rounded-2xl border border-[#ded7c8] bg-white p-4 sm:p-5 space-y-2 shadow-2xs">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-[#ede8dc] flex items-center justify-center text-[#1c1917]">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-[#1c1917]">
                {t.feature1Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ded7c8] bg-white p-4 sm:p-5 space-y-2 shadow-2xs">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-[#ede8dc] flex items-center justify-center text-[#1c1917]">
                <Sliders className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-[#1c1917]">
                {t.feature2Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ded7c8] bg-white p-4 sm:p-5 space-y-2 shadow-2xs">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-[#ede8dc] flex items-center justify-center text-[#1c1917]">
                <Bell className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-[#1c1917]">
                {t.feature3Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature3Desc}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ded7c8] bg-white p-4 sm:p-5 space-y-2 shadow-2xs">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-[#ede8dc] flex items-center justify-center text-[#1c1917]">
                <Share className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-[#1c1917]">
                {t.feature4Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature4Desc}
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Strip */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="rounded-2xl border border-[#ded7c8] bg-[#1c1917] text-[#faf7f2] p-5 sm:p-8 text-center space-y-3.5">
            <h2 className="font-serif text-xl sm:text-3xl font-medium tracking-tight text-[#faf7f2]">
              {t.ctaTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#a8a29e] max-w-sm mx-auto leading-relaxed">
              {t.ctaSub}
            </p>
            <div className="pt-1">
              <Link href="/register" className="inline-block w-full sm:w-auto">
                <Button size="md" className="w-full sm:w-auto bg-[#faf7f2] text-[#1c1917] hover:bg-white border-0 gap-2 font-semibold shadow-xs">
                  <span>{t.ctaButton}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e1d5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
          {/* Main Footer Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#78716c] text-center md:text-left">
            <div className="flex items-center justify-center gap-2">
              <div className="relative h-6 w-6 rounded-md overflow-hidden border border-[#ded7c8] shrink-0">
                <Image
                  src="/demuse_logo.png"
                  alt="Demuse Logo"
                  width={24}
                  height={24}
                  className="object-cover h-full w-full"
                />
              </div>
              <span className="font-serif font-semibold text-[#1c1917]">Demuse</span>
              <span className="text-[#a8a29e]">· {t.footerDesc}</span>
            </div>

            {/* Sponsorship Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a8a29e] w-full sm:w-auto">
                {t.supportProject}:
              </span>
              <a
                href="https://github.com/sponsors/DongDuong2001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#ded7c8] bg-[#faf7f2] hover:bg-[#ede8dc] hover:text-[#1c1917] transition-colors text-xs font-medium text-[#57534e]"
              >
                <span>{t.githubSponsors}</span>
              </a>
              <a
                href="https://ko-fi.com/dongphuduong"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#ded7c8] bg-[#faf7f2] hover:bg-[#ede8dc] hover:text-[#1c1917] transition-colors text-xs font-medium text-[#57534e]"
              >
                <span>{t.kofi}</span>
              </a>
            </div>
          </div>

          {/* Bottom Security & Rights Bar */}
          <div className="pt-3 border-t border-[#f0eae1] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#a8a29e] text-center sm:text-left">
            <div className="flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                {t.httpOnly}
              </span>
              <Link href="/privacy" className="hover:text-[#1c1917] hover:underline transition-colors">
                {t.privacyPolicy}
              </Link>
              <Link href="/terms" className="hover:text-[#1c1917] hover:underline transition-colors">
                {t.termsOfService}
              </Link>
            </div>
            <span>© {new Date().getFullYear()} {t.rights}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
