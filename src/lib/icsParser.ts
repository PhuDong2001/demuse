/**
 * Demuse iCalendar (.ics) RFC 5545 Parser
 * Lightweight, 0 dependencies, fast & reliable for web & server.
 */

export interface ParsedCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  dayOfWeek: number; // 1 = Monday ... 7 = Sunday
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  rrule?: string;
  type: "lecture" | "lab" | "tutorial" | "seminar" | "workshop" | "work" | "meeting" | "study" | "personal";
  color?: string;
  selected: boolean;
}

const BYDAY_TO_NUMBER: Record<string, number> = {
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
  SU: 7,
};

function formatTimeFromDate(d: Date): string {
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function parseIcsDate(val: string): Date | null {
  // Support YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMSS or TZID formatted
  const cleanVal = val.replace(/^.*:/, "").trim();

  // Pattern: 20260817T093000Z or 20260817T093000
  const match = cleanVal.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?/);
  if (match) {
    const [, y, m, d, h, min, s, isUtc] = match;
    if (isUtc) {
      return new Date(
        Date.UTC(
          parseInt(y, 10),
          parseInt(m, 10) - 1,
          parseInt(d, 10),
          parseInt(h, 10),
          parseInt(min, 10),
          s ? parseInt(s, 10) : 0
        )
      );
    }
    return new Date(
      parseInt(y, 10),
      parseInt(m, 10) - 1,
      parseInt(d, 10),
      parseInt(h, 10),
      parseInt(min, 10),
      s ? parseInt(s, 10) : 0
    );
  }

  // All day event: YYYYMMDD
  const dateMatch = cleanVal.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateMatch) {
    const [, y, m, d] = dateMatch;
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), 8, 0);
  }

  return null;
}

function guessEventType(summary: string, description: string = ""): ParsedCalendarEvent["type"] {
  const text = `${summary} ${description}`.toLowerCase();
  if (text.includes("lab") || text.includes("thực hành") || text.includes("tn")) return "lab";
  if (text.includes("meeting") || text.includes("họp") || text.includes("sync") || text.includes("1:1"))
    return "meeting";
  if (text.includes("work") || text.includes("ca làm") || text.includes("shift") || text.includes("công ty"))
    return "work";
  if (text.includes("workshop") || text.includes("seminar") || text.includes("hội thảo")) return "workshop";
  if (text.includes("gym") || text.includes("chạy bộ") || text.includes("fitness") || text.includes("cá nhân"))
    return "personal";
  if (text.includes("study") || text.includes("tự học") || text.includes("ôn tập")) return "study";
  if (text.includes("tutorial") || text.includes("bài tập")) return "tutorial";
  return "lecture";
}

export function parseIcsContent(icsText: string): ParsedCalendarEvent[] {
  // Normalize line unfold (lines starting with space or tab are continuations)
  const unfolded = icsText.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
  const lines = unfolded.split(/\r\n|\r|\n/);

  const events: ParsedCalendarEvent[] = [];
  let inEvent = false;
  let currentEvent: Record<string, string> = {};

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      currentEvent = {};
      continue;
    }

    if (line === "END:VEVENT") {
      inEvent = false;
      if (currentEvent.SUMMARY && currentEvent.DTSTART) {
        const startDate = parseIcsDate(currentEvent.DTSTART);
        let endDate = currentEvent.DTEND ? parseIcsDate(currentEvent.DTEND) : null;

        if (startDate) {
          // Calculate day of week: JS Date getDay(): 0 = Sun, 1 = Mon ... 6 = Sat
          // Demuse format: 1 = Mon, ..., 7 = Sun
          let dayNum = startDate.getDay() === 0 ? 7 : startDate.getDay();

          // Check if RRULE has specific BYDAY
          if (currentEvent.RRULE) {
            const byDayMatch = currentEvent.RRULE.match(/BYDAY=([A-Z,]+)/);
            if (byDayMatch) {
              const firstDay = byDayMatch[1].split(",")[0].trim();
              if (BYDAY_TO_NUMBER[firstDay]) {
                dayNum = BYDAY_TO_NUMBER[firstDay];
              }
            }
          }

          if (!endDate) {
            // Default 1 hour duration
            endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
          }

          const startTime = formatTimeFromDate(startDate);
          let endTime = formatTimeFromDate(endDate);

          // If end time is same as start or earlier, adjust to +1h
          if (endTime <= startTime) {
            const [h, m] = startTime.split(":").map(Number);
            const nextH = Math.min(h + 1, 23).toString().padStart(2, "0");
            endTime = `${nextH}:${m.toString().padStart(2, "0")}`;
          }

          const summary = currentEvent.SUMMARY.replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\n/g, " ");
          const description = currentEvent.DESCRIPTION
            ? currentEvent.DESCRIPTION.replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\n/g, " ")
            : "";
          const location = currentEvent.LOCATION
            ? currentEvent.LOCATION.replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\n/g, " ")
            : "";

          events.push({
            id: `ics-${Math.random().toString(36).substring(2, 9)}`,
            summary,
            description,
            location,
            dayOfWeek: dayNum,
            startTime,
            endTime,
            rrule: currentEvent.RRULE,
            type: guessEventType(summary, description),
            selected: true,
          });
        }
      }
      continue;
    }

    if (inEvent) {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0) {
        const keyWithParams = line.substring(0, colonIdx);
        const value = line.substring(colonIdx + 1);
        const key = keyWithParams.split(";")[0].toUpperCase();
        currentEvent[key] = value;
        if (key === "DTSTART" || key === "DTEND") {
          currentEvent[key] = line; // preserve full string for time zone parsing if needed
        }
      }
    }
  }

  // Deduplicate recurring instances with same summary, day and time
  const uniqueMap = new Map<string, ParsedCalendarEvent>();
  for (const ev of events) {
    const key = `${ev.summary.trim().toLowerCase()}-${ev.dayOfWeek}-${ev.startTime}-${ev.endTime}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, ev);
    }
  }

  return Array.from(uniqueMap.values());
}
