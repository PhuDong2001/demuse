"use client";

import * as React from "react";
import { Check } from "reicon-react";
import { SUBJECT_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface ColorPickerProps {
  value: string;
  onChange: (colorId: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const colorList = Object.values(SUBJECT_COLORS);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e]">
          {label}
        </label>
      )}
      <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-10">
        {colorList.map((color) => {
          const isSelected = value === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onChange(color.id)}
              title={color.name}
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer",
                color.bg,
                color.border,
                isSelected
                  ? "ring-2 ring-[#1c1917] ring-offset-2 scale-105"
                  : "hover:scale-105"
              )}
            >
              {isSelected && (
                <Check
                  className="h-4 w-4"
                  style={{ color: color.accent }}
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
