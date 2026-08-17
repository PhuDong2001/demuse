"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Plus, Sparkles, Logout, User, Calendar, BookOpen, Settings } from "reicon-react";
import { Button } from "../ui/Button";
import { logoutAction } from "@/actions/auth.actions";
import { getInitials } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

interface AppHeaderProps {
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  } | null;
  academicTerm?: string | null;
  onOpenAddModal?: () => void;
}

export function AppHeader({ user, academicTerm, onOpenAddModal }: AppHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.today, icon: Sparkles },
    { href: "/timetable", label: t.timetable, icon: Calendar },
    { href: "/subjects", label: t.courses, icon: BookOpen },
    { href: "/ai", label: t.aiAssistant, icon: Sparkles },
    { href: "/settings", label: t.settings, icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#e8e1d5] bg-[#faf7f2]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand & Term Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-[#ded7c8] shadow-2xs shrink-0">
              <Image
                src="/demuse_logo.png"
                alt="Demuse Logo"
                width={32}
                height={32}
                className="object-cover h-full w-full"
                priority
              />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight text-[#1c1917]">
              Demuse
            </span>
          </Link>

          {academicTerm && (
            <span className="hidden sm:inline-flex items-center rounded-full bg-[#ede8dc] px-2.5 py-0.5 text-xs font-medium text-[#57534e] border border-[#ded7c8]">
              {academicTerm}
            </span>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#ede8dc]/60 p-1 rounded-xl border border-[#ded7c8]/80">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? "bg-white text-[#1c1917] shadow-xs border border-[#ded7c8]"
                    : "text-[#57534e] hover:text-[#1c1917] hover:bg-white/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Cmd+K Search Trigger */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                })
              );
            }}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[#ded7c8] bg-white hover:bg-[#ede8dc] text-xs text-[#78716c] hover:text-[#1c1917] transition-all cursor-pointer shadow-2xs"
            title="Open Command Palette (Cmd + K / Ctrl + K)"
          >
            <span className="text-[11px] font-medium">{language === "vi" ? "Tìm kiếm..." : "Quick search..."}</span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-bold text-[#78716c] bg-[#ede8dc] rounded border border-[#ded7c8]">
              ⌘K
            </kbd>
          </button>

          {/* 4-Language Switcher (VN, EN, FR, DE) */}
          <div className="flex items-center rounded-lg border border-[#ded7c8] bg-white p-0.5 text-[11px] font-semibold">
            {(["vi", "en", "fr", "de"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`px-1.5 py-0.5 rounded uppercase cursor-pointer transition-all ${
                  language === code
                    ? "bg-[#1c1917] text-[#faf7f2] shadow-2xs"
                    : "text-[#78716c] hover:text-[#1c1917]"
                }`}
              >
                {code === "vi" ? "VN" : code.toUpperCase()}
              </button>
            ))}
          </div>

          {onOpenAddModal && (
            <Button
              onClick={onOpenAddModal}
              size="sm"
              className="gap-1.5 font-medium shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.addClass}</span>
              <span className="sm:hidden">{t.addClass}</span>
            </Button>
          )}

          {/* User Profile / Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-[#ede8dc] border border-[#ded7c8] text-xs font-semibold text-[#1c1917] hover:border-[#1c1917] transition-all cursor-pointer overflow-hidden"
                aria-label="User menu"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#ded7c8] bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-[#f0eae1] mb-1">
                      <p className="text-xs font-medium text-[#1c1917] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[#78716c] truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f1e9] rounded-lg transition-colors"
                    >
                      <User className="h-3.5 w-3.5" />
                      {t.settings}
                    </Link>

                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1 cursor-pointer"
                      >
                        <Logout className="h-3.5 w-3.5" />
                        {t.signOut}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
