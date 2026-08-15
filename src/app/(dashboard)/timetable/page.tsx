import { requireAuth } from "@/modules/auth/auth.guard";
import { getDefaultTimetable } from "@/modules/timetables/timetables.service";
import { getSubjectsByTimetable } from "@/modules/subjects/subjects.service";
import { getTimetableSchedulesWithSubject } from "@/modules/schedules/schedules.service";
import { TimetableClient } from "./TimetableClient";

export default async function TimetablePage() {
  const user = await requireAuth();
  const timetable = await getDefaultTimetable(user.id);

  if (!timetable) {
    return null;
  }

  const [subjectsList, schedulesList] = await Promise.all([
    getSubjectsByTimetable(timetable.id, user.id),
    getTimetableSchedulesWithSubject(timetable.id, user.id),
  ]);

  return (
    <TimetableClient
      timetable={timetable}
      subjects={subjectsList}
      schedules={schedulesList}
    />
  );
}
