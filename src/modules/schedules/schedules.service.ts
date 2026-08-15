import { db } from "@/db";
import { schedules, subjects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NotFoundError, ForbiddenError, ConflictError } from "@/lib/errors";
import { getSubjectById } from "../subjects/subjects.service";
import { getTimetableById } from "../timetables/timetables.service";
import { findConflictingSchedules, type ScheduleWithSubject } from "@/lib/time";
import type {
  CreateScheduleInput,
  UpdateScheduleInput,
  CreateClassModalInput,
} from "./schedules.schema";

export async function getScheduleById(scheduleId: string, userId: string) {
  const schedule = await db.query.schedules.findFirst({
    where: eq(schedules.id, scheduleId),
    with: {
      subject: {
        with: {
          timetable: true,
        },
      },
    },
  });

  if (!schedule) {
    throw new NotFoundError("Schedule not found.");
  }

  if (schedule.subject.timetable.userId !== userId) {
    throw new ForbiddenError("Access denied to this schedule.");
  }

  return schedule as ScheduleWithSubject & { subject: typeof schedule.subject & { timetable: typeof schedule.subject.timetable } };
}

export async function getTimetableSchedulesWithSubject(
  timetableId: string,
  userId?: string
): Promise<ScheduleWithSubject[]> {
  // If userId is provided, verify ownership; if not, public view handles checking
  if (userId) {
    await getTimetableById(timetableId, userId);
  }

  const allSubjects = await db.query.subjects.findMany({
    where: eq(subjects.timetableId, timetableId),
    with: {
      schedules: {
        orderBy: [asc(schedules.dayOfWeek), asc(schedules.startTime)],
      },
    },
  });

  const result: ScheduleWithSubject[] = [];
  for (const sub of allSubjects) {
    for (const sch of sub.schedules) {
      result.push({
        ...sch,
        subject: sub,
      });
    }
  }

  // Sort by dayOfWeek then startTime
  result.sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
    return a.startTime.localeCompare(b.startTime);
  });

  return result;
}

export async function createSchedule(userId: string, data: CreateScheduleInput) {
  const subject = await getSubjectById(data.subjectId, userId);

  // Check conflicts in the same timetable
  const existingSchedules = await getTimetableSchedulesWithSubject(
    subject.timetableId,
    userId
  );
  const conflicts = findConflictingSchedules(
    {
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    },
    existingSchedules
  );

  if (conflicts.length > 0) {
    const conflictNames = conflicts.map((c) => c.subject.name).join(", ");
    throw new ConflictError(
      `Time slot conflicts with existing class: ${conflictNames} (${conflicts[0].startTime} - ${conflicts[0].endTime})`
    );
  }

  const [newSchedule] = await db
    .insert(schedules)
    .values({
      subjectId: data.subjectId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room || subject.room || null,
      type: data.type || "lecture",
    })
    .returning();

  return newSchedule;
}

export async function updateSchedule(
  scheduleId: string,
  userId: string,
  data: UpdateScheduleInput
) {
  const current = await getScheduleById(scheduleId, userId);
  const targetSubjectId = data.subjectId || current.subjectId;
  const targetDay = data.dayOfWeek ?? current.dayOfWeek;
  const targetStart = data.startTime ?? current.startTime;
  const targetEnd = data.endTime ?? current.endTime;

  // Check conflicts
  const existingSchedules = await getTimetableSchedulesWithSubject(
    current.subject.timetableId,
    userId
  );
  const conflicts = findConflictingSchedules(
    {
      id: scheduleId,
      dayOfWeek: targetDay,
      startTime: targetStart,
      endTime: targetEnd,
    },
    existingSchedules
  );

  if (conflicts.length > 0) {
    const conflictNames = conflicts.map((c) => c.subject.name).join(", ");
    throw new ConflictError(
      `Time slot conflicts with: ${conflictNames} (${conflicts[0].startTime} - ${conflicts[0].endTime})`
    );
  }

  const [updated] = await db
    .update(schedules)
    .set({
      subjectId: targetSubjectId,
      dayOfWeek: targetDay,
      startTime: targetStart,
      endTime: targetEnd,
      room: data.room !== undefined ? data.room : current.room,
      type: data.type ?? current.type,
      updatedAt: new Date(),
    })
    .where(eq(schedules.id, scheduleId))
    .returning();

  return updated;
}

export async function duplicateSchedule(
  scheduleId: string,
  userId: string,
  targetDayOfWeek?: number
) {
  const current = await getScheduleById(scheduleId, userId);
  const nextDay = targetDayOfWeek || (current.dayOfWeek % 7) + 1;

  // Check conflicts on the target day
  const existingSchedules = await getTimetableSchedulesWithSubject(
    current.subject.timetableId,
    userId
  );
  const conflicts = findConflictingSchedules(
    {
      dayOfWeek: nextDay,
      startTime: current.startTime,
      endTime: current.endTime,
    },
    existingSchedules
  );

  if (conflicts.length > 0) {
    throw new ConflictError(
      `Cannot duplicate: time slot on day ${nextDay} conflicts with ${conflicts[0].subject.name}`
    );
  }

  const [duplicated] = await db
    .insert(schedules)
    .values({
      subjectId: current.subjectId,
      dayOfWeek: nextDay,
      startTime: current.startTime,
      endTime: current.endTime,
      room: current.room,
      type: current.type,
    })
    .returning();

  return duplicated;
}

export async function deleteSchedule(scheduleId: string, userId: string) {
  await getScheduleById(scheduleId, userId);
  await db.delete(schedules).where(eq(schedules.id, scheduleId));
  return { success: true };
}

/**
 * Unified helper to create/link a subject and create all specified day schedules in one flow.
 */
export async function createClassWithSchedules(
  userId: string,
  data: CreateClassModalInput
) {
  await getTimetableById(data.timetableId, userId);

  let subjectId = data.subjectId;

  if (!subjectId) {
    // Create new subject
    const [newSub] = await db
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
    subjectId = newSub.id;
  } else {
    // Update existing subject details if provided
    await db
      .update(subjects)
      .set({
        name: data.name,
        code: data.code || null,
        teacher: data.teacher || null,
        room: data.room || null,
        color: data.color || "sage",
        note: data.note || null,
        updatedAt: new Date(),
      })
      .where(eq(subjects.id, subjectId));
  }

  // Create schedules for each selected day
  const createdSchedules = [];
  for (const day of data.daysOfWeek) {
    const [sch] = await db
      .insert(schedules)
      .values({
        subjectId,
        dayOfWeek: day,
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room || null,
        type: data.type || "lecture",
      })
      .returning();
    createdSchedules.push(sch);
  }

  return {
    subjectId,
    schedules: createdSchedules,
  };
}
