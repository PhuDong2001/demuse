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
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c1917]">
      {/* Header */}
      <header className="border-b border-[#e8e1d5] bg-[#faf7f2]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-xs border border-[#ded7c8] bg-[#1c1917] flex items-center justify-center">
              <Image
                src="/demuse_logo.png"
                alt="Demuse Logo"
                width={36}
                height={36}
                className="object-cover h-full w-full"
                priority
              />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#1c1917] leading-none">
              Demuse
            </span>
          </Link>

          {/* Navigation & Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 4-Language Switcher (VN, EN, FR, DE) */}
            <div className="flex items-center rounded-lg border border-[#ded7c8] bg-white p-0.5 text-xs font-semibold">
              {(["vi", "en", "fr", "de"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`px-2 py-1 rounded cursor-pointer transition-all ${
                    language === code
                      ? "bg-[#1c1917] text-[#faf7f2] shadow-xs"
                      : "text-[#78716c] hover:text-[#1c1917]"
                  }`}
                >
                  {code === "vi" ? "Tiếng Việt" : code === "en" ? "English" : code === "fr" ? "Français" : "Deutsch"}
                </button>
              ))}
            </div>

            <Link
              href="/login"
              className="text-xs font-semibold text-[#57534e] hover:text-[#1c1917] px-3 py-2 rounded-lg hover:bg-[#ede8dc] transition-all"
            >
              {t.signIn}
            </Link>

            <Link href="/register">
              <Button size="sm" variant="primary" className="gap-1.5 shadow-xs">
                <span>{t.getStarted}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section — Clean & Concise */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 text-center space-y-5">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1c1917] max-w-2xl mx-auto leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-[#6b645b] max-w-xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
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
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#e8e1d5] space-y-8">
          <div className="text-center space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1c1917]">
              {t.whatDemuseDoes}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] max-w-md mx-auto">
              {t.whatDemuseDoesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 space-y-2.5 shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-[#ede8dc] flex items-center justify-center text-[#1c1917]">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-[#1c1917]">
                {t.feature1Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 space-y-2.5 shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-[#ede8dc] flex items-center justify-center text-[#1c1917]">
                <Sliders className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-[#1c1917]">
                {t.feature2Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 space-y-2.5 shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-[#ede8dc] flex items-center justify-center text-[#1c1917]">
                <Bell className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-[#1c1917]">
                {t.feature3Title}
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                {t.feature3Desc}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ded7c8] bg-white p-5 space-y-2.5 shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-[#ede8dc] flex items-center justify-center text-[#1c1917]">
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
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-[#ded7c8] bg-[#1c1917] text-[#faf7f2] p-6 sm:p-8 text-center space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#faf7f2]">
              {t.ctaTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#a8a29e] max-w-sm mx-auto leading-relaxed">
              {t.ctaSub}
            </p>
            <div className="pt-1">
              <Link href="/register">
                <Button size="md" className="bg-[#faf7f2] text-[#1c1917] hover:bg-white border-0 gap-2 font-semibold shadow-xs">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716c]">
            <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-4 text-[#78716c]">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                {t.httpOnly}
              </span>
              <span>© {new Date().getFullYear()} {t.rights}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
