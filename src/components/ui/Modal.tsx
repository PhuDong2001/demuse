"use client";

import * as React from "react";
import { X } from "reicon-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1c1917]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal / Sheet Container */}
      <div
        className={cn(
          "relative w-full bg-white rounded-t-2xl sm:rounded-2xl border border-[#ded7c8] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[85vh]",
          maxWidths[maxWidth]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#f0eae1] bg-[#faf7f2]/50">
          <div>
            <h2 className="text-lg font-serif font-medium text-[#1c1917] tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-[#78716c] mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] transition-colors -mr-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
