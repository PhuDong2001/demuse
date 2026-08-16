import type { Metadata } from "next";
import { requireAuth } from "@/modules/auth/auth.guard";
import { getDefaultTimetable } from "@/modules/timetables/timetables.service";
import { getSubjectsByTimetable } from "@/modules/subjects/subjects.service";
import { SubjectsClient } from "./SubjectsClient";

export const metadata: Metadata = {
  title: "Courses",
};

export default async function SubjectsPage() {
  const user = await requireAuth();
  const timetable = await getDefaultTimetable(user.id);

  if (!timetable) {
    return null;
  }

  const subjectsList = await getSubjectsByTimetable(timetable.id, user.id);

  return <SubjectsClient timetable={timetable} subjects={subjectsList} />;
}
