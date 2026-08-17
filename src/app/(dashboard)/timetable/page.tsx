import type { Metadata } from "next";
import { requireAuth } from "@/modules/auth/auth.guard";
import {
  getUserTimetables,
  getDefaultTimetable,
  getTimetableById,
} from "@/modules/timetables/timetables.service";
import { getSubjectsByTimetable } from "@/modules/subjects/subjects.service";
import { getTimetableSchedulesWithSubject } from "@/modules/schedules/schedules.service";
import { TimetableClient } from "./TimetableClient";

export const metadata: Metadata = {
  title: "Weekly Timetable",
};

interface TimetablePageProps {
  searchParams: Promise<{ timetableId?: string; week?: string }>;
}

export default async function TimetablePage({ searchParams }: TimetablePageProps) {
  const user = await requireAuth();
  const params = await searchParams;
  const allTimetables = await getUserTimetables(user.id);

  let activeTimetable = allTimetables[0] ? allTimetables[0] : await getDefaultTimetable(user.id);

  if (params.timetableId) {
    try {
      const found = await getTimetableById(params.timetableId, user.id);
      if (found) activeTimetable = found;
    } catch {
      // Fallback
    }
  }

  if (!activeTimetable) {
    const created = await getDefaultTimetable(user.id);
    if (!created) return null;
    activeTimetable = created;
  }

  const [subjectsList, schedulesList] = await Promise.all([
    getSubjectsByTimetable(activeTimetable.id, user.id),
    getTimetableSchedulesWithSubject(activeTimetable.id, user.id),
  ]);

  return (
    <TimetableClient
      timetable={activeTimetable}
      allTimetables={allTimetables}
      subjects={subjectsList}
      schedules={schedulesList}
    />
  );
}
