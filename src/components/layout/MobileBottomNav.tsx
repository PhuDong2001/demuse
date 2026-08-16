"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Calendar, BookOpen, Settings, Plus } from "reicon-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

interface MobileBottomNavProps {
  onOpenAddModal?: () => void;
}

export function MobileBottomNav({ onOpenAddModal }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t.today, icon: Sparkles },
    { href: "/timetable", label: t.timetable, icon: Calendar },
    { href: "/subjects", label: t.courses, icon: BookOpen },
    { href: "/settings", label: t.settings, icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[#e8e1d5] bg-[#faf7f2]/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        {/* Left items */}
        {navItems.slice(0, 2).map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 max-w-[72px] py-1 rounded-xl transition-all",
                isActive
                  ? "text-[#1c1917] font-semibold"
                  : "text-[#78716c] hover:text-[#1c1917]"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 mb-0.5",
                  isActive ? "stroke-[2.5]" : "stroke-[1.75]"
                )}
              />
              <span className="text-[10px] tracking-tight whitespace-nowrap leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Center Quick Add Button */}
        {onOpenAddModal ? (
          <button
            onClick={onOpenAddModal}
            className="flex items-center justify-center h-11 w-11 rounded-full bg-[#1c1917] text-[#faf7f2] shadow-md hover:bg-[#2d2826] active:scale-95 transition-all -mt-3 border-2 border-[#faf7f2]"
            aria-label="Add new class"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        {/* Right items */}
        {navItems.slice(2).map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 max-w-[72px] py-1 rounded-xl transition-all",
                isActive
                  ? "text-[#1c1917] font-semibold"
                  : "text-[#78716c] hover:text-[#1c1917]"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 mb-0.5",
                  isActive ? "stroke-[2.5]" : "stroke-[1.75]"
                )}
              />
              <span className="text-[10px] tracking-tight whitespace-nowrap leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
