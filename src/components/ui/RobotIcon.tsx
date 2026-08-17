import * as React from "react";
import Image from "next/image";

interface RobotIconProps {
  className?: string;
  size?: number;
}

export function RobotIcon({ className = "h-5 w-5", size = 24 }: RobotIconProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-white overflow-hidden shadow-2xs shrink-0 border border-[#e8e1d5] ${className}`}
    >
      <Image
        src="/animation_icon/chat-bot.gif"
        alt="AI Assistant"
        width={size}
        height={size}
        className="h-full w-full object-cover rounded-full"
        unoptimized
      />
    </span>
  );
}

