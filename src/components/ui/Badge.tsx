import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "subtle" | "success" | "warning";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full transition-colors whitespace-nowrap";

  const variants = {
    default: "bg-[#ede8dc] text-[#292524] border border-[#d8cfbe]",
    outline: "bg-transparent border border-[#d8cfbe] text-[#57534e]",
    subtle: "bg-[#f5f1e9] text-[#78716c]",
    success: "bg-[#edf4ee] text-[#244229] border border-[#b8d4bb]",
    warning: "bg-[#faf5e8] text-[#534015] border border-[#eadcb9]",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 leading-4 gap-1",
    md: "text-xs px-2.5 py-1 leading-4 gap-1.5",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
