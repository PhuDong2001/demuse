"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Search,
  Plus,
  Calendar,
  Sparkles,
  Settings,
  BookOpen,
  Download,
} from "reicon-react";
import { RobotIcon } from "../ui/RobotIcon";

interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenAddClass?: () => void;
  onOpenExport?: () => void;
  onOpenImport?: () => void;
}

export function CommandPalette({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  onOpenAddClass,
  onOpenExport,
  onOpenImport,
}: CommandPaletteProps) {
  const router = useRouter();
  const { setLanguage, language } = useLanguage();
  const isVi = language === "vi";

  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleClose = React.useCallback(() => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  }, [externalOnClose]);

  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K and N, T, etc.)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd + K or Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          setQuery("");
          setSelectedIndex(0);
          if (externalIsOpen === undefined) setInternalIsOpen(true);
        }
        return;
      }

      // If user is typing in an input or textarea, ignore single key shortcuts
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
        return;
      }

      // Quick Single-Key shortcuts
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        onOpenAddClass?.();
      } else if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        onOpenExport?.();
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        router.push("/");
      } else if (e.key === "w" || e.key === "W") {
        e.preventDefault();
        router.push("/timetable");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose, externalIsOpen, onOpenAddClass, onOpenExport, router]);

  // Focus input on open without cascading setState
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const actions = React.useMemo(() => {
    return [
      {
        id: "add-class",
        title: isVi ? "Thêm lịch / tiết mới" : "Add New Event / Class",
        shortcut: "N",
        category: isVi ? "Hành động nhanh" : "Quick Actions",
        icon: Plus,
        perform: () => {
          handleClose();
          onOpenAddClass?.();
        },
      },
      {
        id: "export-wallpaper",
        title: isVi ? "Xuất ảnh hình nền (Lockscreen 9:16)" : "Export Wallpaper (Lockscreen 9:16)",
        shortcut: "E",
        category: isVi ? "Hành động nhanh" : "Quick Actions",
        icon: Download,
        perform: () => {
          handleClose();
          onOpenExport?.();
        },
      },
      {
        id: "import-calendar",
        title: isVi ? "Nhập lịch Google / Apple (.ics)" : "Import iCalendar (.ics)",
        shortcut: "I",
        category: isVi ? "Hành động nhanh" : "Quick Actions",
        icon: Calendar,
        perform: () => {
          handleClose();
          onOpenImport?.();
        },
      },
      {
        id: "nav-today",
        title: isVi ? "Đến Hôm Nay (Dashboard)" : "Go to Today (Dashboard)",
        shortcut: "T",
        category: isVi ? "Điều hướng" : "Navigation",
        icon: Sparkles,
        perform: () => {
          handleClose();
          router.push("/");
        },
      },
      {
        id: "nav-timetable",
        title: isVi ? "Đến Thời khóa biểu tuần" : "Go to Weekly Timetable",
        shortcut: "W",
        category: isVi ? "Điều hướng" : "Navigation",
        icon: Calendar,
        perform: () => {
          handleClose();
          router.push("/timetable");
        },
      },
      {
        id: "nav-ai",
        title: isVi ? "Đến Trợ lý AI (Groq)" : "Go to AI Assistant (Groq)",
        shortcut: "A",
        category: isVi ? "Điều hướng" : "Navigation",
        icon: RobotIcon,
        perform: () => {
          handleClose();
          router.push("/ai");
        },
      },
      {
        id: "nav-courses",
        title: isVi ? "Đến Quản lý môn học" : "Go to Courses",
        shortcut: "C",
        category: isVi ? "Điều hướng" : "Navigation",
        icon: BookOpen,
        perform: () => {
          handleClose();
          router.push("/subjects");
        },
      },
      {
        id: "nav-settings",
        title: isVi ? "Đến Cài đặt & Tài khoản" : "Go to Settings",
        shortcut: "S",
        category: isVi ? "Điều hướng" : "Navigation",
        icon: Settings,
        perform: () => {
          handleClose();
          router.push("/settings");
        },
      },
      {
        id: "toggle-lang-vi",
        title: "Chuyển sang Tiếng Việt",
        shortcut: "VI",
        category: isVi ? "Ngôn ngữ" : "Language",
        icon: Sparkles,
        perform: () => {
          setLanguage("vi");
          handleClose();
        },
      },
      {
        id: "toggle-lang-en",
        title: "Switch to English",
        shortcut: "EN",
        category: isVi ? "Ngôn ngữ" : "Language",
        icon: Sparkles,
        perform: () => {
          setLanguage("en");
          handleClose();
        },
      },
    ];
  }, [isVi, handleClose, onOpenAddClass, onOpenExport, onOpenImport, router, setLanguage]);

  const filteredActions = React.useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.shortcut?.toLowerCase().includes(q)
    );
  }, [actions, query]);

  const handleKeyDownModal = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((idx) => (idx + 1) % Math.max(filteredActions.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((idx) =>
        idx === 0 ? filteredActions.length - 1 : idx - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const act = filteredActions[selectedIndex];
      if (act) act.perform();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1c1917]/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[#ded7c8] shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#f0eae1] bg-[#faf7f2]/60">
          <Search className="h-4 w-4 text-[#78716c] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={
              isVi
                ? "Gõ lệnh hoặc tìm kiếm (vd: Thêm tiết, Xuất ảnh, Cài đặt...)"
                : "Type a command or search (e.g. Add class, Export, Settings...)"
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownModal}
            className="w-full bg-transparent text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-[#78716c] bg-[#ede8dc] rounded border border-[#ded7c8]">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[320px] overflow-y-auto p-2 space-y-1">
          {filteredActions.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#78716c]">
              {isVi ? "Không tìm thấy lệnh phù hợp." : "No matching commands found."}
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const isSelected = idx === selectedIndex;
              const IconComp = action.icon;

              return (
                <div
                  key={action.id}
                  onClick={action.perform}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all select-none ${
                    isSelected
                      ? "bg-[#1c1917] text-white"
                      : "text-[#1c1917] hover:bg-[#faf7f2]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp
                      className={`h-4 w-4 shrink-0 ${
                        isSelected ? "text-white" : "text-[#78716c]"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{action.title}</p>
                      <span
                        className={`text-[10px] ${
                          isSelected ? "text-[#a8a29e]" : "text-[#78716c]"
                        }`}
                      >
                        {action.category}
                      </span>
                    </div>
                  </div>

                  {action.shortcut && (
                    <kbd
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${
                        isSelected
                          ? "bg-stone-800 border-stone-700 text-stone-200"
                          : "bg-[#ede8dc] border-[#ded7c8] text-[#78716c]"
                      }`}
                    >
                      {action.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2 bg-[#faf7f2] border-t border-[#f0eae1] flex items-center justify-between text-[11px] text-[#78716c]">
          <div className="flex items-center gap-3">
            <span>↑↓ {isVi ? "chọn" : "navigate"}</span>
            <span>↵ {isVi ? "thực thi" : "select"}</span>
          </div>
          <span>Demuse Command Center</span>
        </div>
      </div>
    </div>
  );
}
