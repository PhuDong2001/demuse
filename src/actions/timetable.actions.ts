"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/modules/auth/auth.guard";
import {
  createTimetable,
  updateTimetable,
  toggleTimetablePublic,
  regenerateShareToken,
  deleteTimetable,
} from "@/modules/timetables/timetables.service";
import {
  createTimetableSchema,
  updateTimetableSchema,
  type CreateTimetableInput,
  type UpdateTimetableInput,
} from "@/modules/timetables/timetables.schema";

export async function createTimetableAction(input: CreateTimetableInput) {
  const user = await requireAuth();
  const parsed = createTimetableSchema.parse(input);
  const created = await createTimetable(user.id, parsed);
  revalidatePath("/timetable");
  revalidatePath("/");
  return { success: true, timetable: created };
}

export async function updateTimetableAction(timetableId: string, input: UpdateTimetableInput) {
  const user = await requireAuth();
  const parsed = updateTimetableSchema.parse(input);
  const updated = await updateTimetable(timetableId, user.id, parsed);
  revalidatePath("/timetable");
  revalidatePath("/");
  return { success: true, timetable: updated };
}

export async function toggleShareAction(timetableId: string, isPublic?: boolean) {
  const user = await requireAuth();
  const updated = await toggleTimetablePublic(timetableId, user.id, isPublic);
  revalidatePath("/timetable");
  revalidatePath(`/share/${updated.shareToken}`);
  return { success: true, isPublic: updated.isPublic, shareToken: updated.shareToken };
}

export async function regenerateShareTokenAction(timetableId: string) {
  const user = await requireAuth();
  const updated = await regenerateShareToken(timetableId, user.id);
  revalidatePath("/timetable");
  return { success: true, shareToken: updated.shareToken };
}

export async function deleteTimetableAction(timetableId: string) {
  const user = await requireAuth();
  await deleteTimetable(timetableId, user.id);
  revalidatePath("/timetable");
  revalidatePath("/");
  return { success: true };
}

export async function setDefaultTimetableAction(timetableId: string) {
  const user = await requireAuth();
  const updated = await updateTimetable(timetableId, user.id, { isDefault: true });
  revalidatePath("/timetable");
  revalidatePath("/");
  return { success: true, timetable: updated };
}
