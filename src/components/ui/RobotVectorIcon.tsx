import * as React from "react";

export function RobotVectorIcon({ className = "h-4 w-4", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Antenna */}
      <path d="M12 2v3" />
      <circle cx="12" cy="2" r="1" fill="currentColor" />
      {/* Robot Head Body */}
      <rect x="4" y="6" width="16" height="13" rx="3" />
      {/* Ears */}
      <path d="M2 11h2" />
      <path d="M20 11h2" />
      {/* Eyes */}
      <circle cx="9" cy="11" r="1.5" fill="currentColor" />
      <circle cx="15" cy="11" r="1.5" fill="currentColor" />
      {/* Mouth */}
      <path d="M9 15h6" />
    </svg>
  );
}
