import { db } from "@/db";
import { subjects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { getTimetableById } from "../timetables/timetables.service";
import type { CreateSubjectInput, UpdateSubjectInput } from "./subjects.schema";

export async function getSubjectsByTimetable(timetableId: string, _userId?: string) {
  return db.query.subjects.findMany({
    where: eq(subjects.timetableId, timetableId),
    orderBy: [desc(subjects.createdAt)],
    with: {
      schedules: true,
    },
  });
}

export async function getSubjectById(subjectId: string, userId: string) {
  const subject = await db.query.subjects.findFirst({
    where: eq(subjects.id, subjectId),
    with: {
      timetable: true,
      schedules: true,
    },
  });

  if (!subject) {
    throw new NotFoundError("Subject not found.");
  }

  if (subject.timetable.userId !== userId) {
    throw new ForbiddenError("Access denied to this subject.");
  }

  return subject;
}

export async function createSubject(userId: string, data: CreateSubjectInput) {
  // Verify timetable ownership
  await getTimetableById(data.timetableId, userId);

  const [newSubject] = await db
    .insert(subjects)
    .values({
      timetableId: data.timetableId,
      name: data.name,
      code: data.code || null,
      teacher: data.teacher || null,
      room: data.room || null,
      color: data.color || "sage",
      note: data.note || null,
    })
    .returning();

  return newSubject;
}

export async function updateSubject(
  subjectId: string,
  userId: string,
  data: UpdateSubjectInput
) {
  await getSubjectById(subjectId, userId);

  const [updated] = await db
    .update(subjects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(subjects.id, subjectId))
    .returning();

  return updated;
}

export async function deleteSubject(subjectId: string, userId: string) {
  await getSubjectById(subjectId, userId);

  await db.delete(subjects).where(eq(subjects.id, subjectId));

  return { success: true };
}
