import { db } from "@/db";
import { timetables } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { generateShareToken } from "@/lib/utils";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import type { CreateTimetableInput, UpdateTimetableInput } from "./timetables.schema";

export async function getUserTimetables(userId: string) {
  return db.query.timetables.findMany({
    where: eq(timetables.userId, userId),
    orderBy: [desc(timetables.isDefault), desc(timetables.createdAt)],
    with: {
      subjects: {
        with: {
          schedules: true,
        },
      },
    },
  });
}

export async function getDefaultTimetable(userId: string) {
  let timetable = await db.query.timetables.findFirst({
    where: and(eq(timetables.userId, userId), eq(timetables.isDefault, true)),
    with: {
      subjects: {
        with: {
          schedules: true,
        },
      },
    },
  });

  // Fallback to any timetable owned by user
  if (!timetable) {
    timetable = await db.query.timetables.findFirst({
      where: eq(timetables.userId, userId),
      with: {
        subjects: {
          with: {
            schedules: true,
          },
        },
      },
    });
  }

  // If user has zero timetables, create one
  if (!timetable) {
    const [created] = await db
      .insert(timetables)
      .values({
        userId,
        name: "My Semester Timetable",
        academicTerm: "Current Semester",
        isPublic: false,
        isDefault: true,
        shareToken: generateShareToken(),
      })
      .returning();

    return db.query.timetables.findFirst({
      where: eq(timetables.id, created.id),
      with: {
        subjects: {
          with: {
            schedules: true,
          },
        },
      },
    });
  }

  return timetable;
}

export async function getTimetableById(timetableId: string, userId: string) {
  const timetable = await db.query.timetables.findFirst({
    where: and(eq(timetables.id, timetableId), eq(timetables.userId, userId)),
    with: {
      subjects: {
        with: {
          schedules: true,
        },
      },
    },
  });

  if (!timetable) {
    throw new NotFoundError("Timetable not found or access denied.");
  }

  return timetable;
}

export async function getPublicTimetableByShareToken(shareToken: string) {
  const timetable = await db.query.timetables.findFirst({
    where: eq(timetables.shareToken, shareToken),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      subjects: {
        with: {
          schedules: true,
        },
      },
    },
  });

  if (!timetable) {
    throw new NotFoundError("Shared timetable not found.");
  }

  if (!timetable.isPublic) {
    throw new ForbiddenError("This timetable is currently private.");
  }

  return timetable;
}

export async function createTimetable(userId: string, data: CreateTimetableInput) {
  const [newTimetable] = await db
    .insert(timetables)
    .values({
      userId,
      name: data.name,
      description: data.description,
      academicTerm: data.academicTerm,
      isPublic: data.isPublic ?? false,
      isDefault: false,
      shareToken: generateShareToken(),
    })
    .returning();

  return newTimetable;
}

export async function updateTimetable(
  timetableId: string,
  userId: string,
  data: UpdateTimetableInput
) {
  // Verify ownership
  await getTimetableById(timetableId, userId);

  if (data.isDefault) {
    // Unset other defaults for this user
    await db
      .update(timetables)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(timetables.userId, userId));
  }

  const [updated] = await db
    .update(timetables)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(timetables.id, timetableId), eq(timetables.userId, userId)))
    .returning();

  return updated;
}

export async function toggleTimetablePublic(timetableId: string, userId: string, isPublic?: boolean) {
  const current = await getTimetableById(timetableId, userId);
  const nextPublic = isPublic !== undefined ? isPublic : !current.isPublic;

  const [updated] = await db
    .update(timetables)
    .set({
      isPublic: nextPublic,
      updatedAt: new Date(),
    })
    .where(and(eq(timetables.id, timetableId), eq(timetables.userId, userId)))
    .returning();

  return updated;
}

export async function regenerateShareToken(timetableId: string, userId: string) {
  await getTimetableById(timetableId, userId);

  const [updated] = await db
    .update(timetables)
    .set({
      shareToken: generateShareToken(),
      updatedAt: new Date(),
    })
    .where(and(eq(timetables.id, timetableId), eq(timetables.userId, userId)))
    .returning();

  return updated;
}

export async function deleteTimetable(timetableId: string, userId: string) {
  await getTimetableById(timetableId, userId);

  await db
    .delete(timetables)
    .where(and(eq(timetables.id, timetableId), eq(timetables.userId, userId)));

  return { success: true };
}
