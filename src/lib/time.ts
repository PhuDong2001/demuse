import { DAYS_OF_WEEK } from "./constants";
import type { Schedule, Subject } from "@/db/schema";

export type ScheduleWithSubject = Schedule & {
  subject: Subject;
};

/**
 * Converts "HH:mm" to total minutes from midnight (00:00 = 0, 23:59 = 1439).
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(":")) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converts minutes from midnight to "HH:mm".
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Formats "09:30" to 24-hour display "09:30" or 12-hour "9:30 AM" if specified.
 */
export function formatTimeDisplay(timeStr: string, is24Hour: boolean = true): string {
  if (!timeStr) return "";
  if (is24Hour) {
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    }
    return timeStr;
  }

  const totalMinutes = timeToMinutes(timeStr);
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  const formattedMin = minutes === 0 ? "00" : minutes.toString().padStart(2, "0");
  return `${hours12}:${formattedMin} ${period}`;
}

/**
 * Formats a time range, e.g. "9:00 AM – 10:30 AM"
 */
export function formatTimeRange(start: string, end: string, is24Hour: boolean = false): string {
  return `${formatTimeDisplay(start, is24Hour)} – ${formatTimeDisplay(end, is24Hour)}`;
}

/**
 * Calculates duration in minutes between start and end.
 */
export function getDurationMinutes(start: string, end: string): number {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  return Math.max(0, endMin - startMin);
}

/**
 * Formats duration nicely, e.g., "1h 30m" or "45m"
 */
export function formatDuration(start: string, end: string): string {
  const mins = getDurationMinutes(start, end);
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hours === 0) return `${remainingMins}m`;
  if (remainingMins === 0) return `${hours}h`;
  return `${hours}h ${remainingMins}m`;
}

/**
 * Checks if two time intervals overlap (strictly overlap with length > 0).
 */
export function checkTimeOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

/**
 * Finds all conflicting schedules for a given candidate slot on a specific day.
 */
export function findConflictingSchedules(
  candidate: { dayOfWeek: number; startTime: string; endTime: string; id?: string },
  existingSchedules: ScheduleWithSubject[]
): ScheduleWithSubject[] {
  return existingSchedules.filter((item) => {
    if (candidate.id && item.id === candidate.id) return false;
    if (item.dayOfWeek !== candidate.dayOfWeek) return false;
    return checkTimeOverlap(candidate.startTime, candidate.endTime, item.startTime, item.endTime);
  });
}

/**
 * Maps JS getDay() (0 = Sunday, 1 = Monday, ..., 6 = Saturday) to Demuse dayOfWeek (1 = Mon, ..., 7 = Sun).
 */
export function getDemuseDayOfWeek(date: Date = new Date()): number {
  const jsDay = date.getDay(); // 0 is Sunday
  return jsDay === 0 ? 7 : jsDay;
}

export interface NextClassStatus {
  state: "ongoing" | "upcoming" | "ended_for_today" | "no_classes_today" | "no_classes_all_week";
  currentSchedule?: ScheduleWithSubject;
  nextSchedule?: ScheduleWithSubject;
  startsInMinutes?: number;
  endsInMinutes?: number;
  message: string;
  subMessage?: string;
  nextDayName?: string;
}

/**
 * Analyzes today's and upcoming schedules relative to the current time.
 */
export function calculateNextClassStatus(
  allSchedules: ScheduleWithSubject[],
  now: Date = new Date()
): NextClassStatus {
  if (!allSchedules || allSchedules.length === 0) {
    return {
      state: "no_classes_all_week",
      message: "No classes scheduled yet",
      subMessage: "Add your subjects to see your daily timetable countdown.",
    };
  }

  const currentDay = getDemuseDayOfWeek(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Today's classes sorted by start time
  const todayClasses = allSchedules
    .filter((s) => s.dayOfWeek === currentDay)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  if (todayClasses.length === 0) {
    // Look ahead to find the next day with classes
    for (let offset = 1; offset <= 7; offset++) {
      const nextDay = ((currentDay - 1 + offset) % 7) + 1;
      const nextDayClasses = allSchedules
        .filter((s) => s.dayOfWeek === nextDay)
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

      if (nextDayClasses.length > 0) {
        const nextClass = nextDayClasses[0];
        const dayInfo = DAYS_OF_WEEK.find((d) => d.number === nextDay);
        const dayLabel = offset === 1 ? "Tomorrow" : dayInfo?.full || "Upcoming";
        return {
          state: "no_classes_today",
          nextSchedule: nextClass,
          nextDayName: dayLabel,
          message: `Free today! Next class is on ${dayLabel}`,
          subMessage: `${nextClass.subject.name} at ${formatTimeDisplay(nextClass.startTime)}`,
        };
      }
    }
  }

  // Check if currently inside a class
  for (const item of todayClasses) {
    const startMin = timeToMinutes(item.startTime);
    const endMin = timeToMinutes(item.endTime);

    if (currentMinutes >= startMin && currentMinutes < endMin) {
      const remaining = endMin - currentMinutes;
      return {
        state: "ongoing",
        currentSchedule: item,
        endsInMinutes: remaining,
        message: `Currently in ${item.subject.name}`,
        subMessage: `${remaining}m remaining · Room ${item.room || item.subject.room || "TBA"}`,
      };
    }
  }

  // Check for upcoming classes today
  const upcomingToday = todayClasses.filter(
    (item) => timeToMinutes(item.startTime) > currentMinutes
  );

  if (upcomingToday.length > 0) {
    const nextClass = upcomingToday[0];
    const startsIn = timeToMinutes(nextClass.startTime) - currentMinutes;

    let countdownText = "";
    if (startsIn < 60) {
      countdownText = `in ${startsIn} min${startsIn === 1 ? "" : "s"}`;
    } else {
      const hours = Math.floor(startsIn / 60);
      const mins = startsIn % 60;
      countdownText = `in ${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }

    return {
      state: "upcoming",
      nextSchedule: nextClass,
      startsInMinutes: startsIn,
      message: `Next up: ${nextClass.subject.name}`,
      subMessage: `Starts ${countdownText} at ${formatTimeDisplay(nextClass.startTime)} · Room ${nextClass.room || nextClass.subject.room || "TBA"}`,
    };
  }

  // All classes today have ended. Find tomorrow's or next available class.
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = ((currentDay - 1 + offset) % 7) + 1;
    const nextDayClasses = allSchedules
      .filter((s) => s.dayOfWeek === nextDay)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    if (nextDayClasses.length > 0) {
      const nextClass = nextDayClasses[0];
      const dayInfo = DAYS_OF_WEEK.find((d) => d.number === nextDay);
      const dayLabel = offset === 1 ? "Tomorrow" : dayInfo?.full || "Upcoming";
      return {
        state: "ended_for_today",
        nextSchedule: nextClass,
        nextDayName: dayLabel,
        message: "You're done for today! Rest well.",
        subMessage: `Next class is ${dayLabel}: ${nextClass.subject.name} at ${formatTimeDisplay(nextClass.startTime)}`,
      };
    }
  }

  return {
    state: "no_classes_all_week",
    message: "No upcoming classes found",
    subMessage: "Add classes to your timetable to see them here.",
  };
}
