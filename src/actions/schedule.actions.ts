"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/modules/auth/auth.guard";
import {
  createSchedule,
  createClassWithSchedules,
  updateSchedule,
  duplicateSchedule,
  deleteSchedule,
} from "@/modules/schedules/schedules.service";
import {
  createClassModalSchema,
  createScheduleSchema,
  updateScheduleSchema,
  type CreateClassModalInput,
  type CreateScheduleInput,
  type UpdateScheduleInput,
} from "@/modules/schedules/schedules.schema";

export async function createClassAction(input: CreateClassModalInput) {
  const user = await requireAuth();
  const parsed = createClassModalSchema.parse(input);
  const result = await createClassWithSchedules(user.id, parsed);

  revalidatePath("/timetable");
  revalidatePath("/subjects");
  revalidatePath("/");

  return { success: true, ...result };
}

export async function createScheduleSlotAction(input: CreateScheduleInput) {
  const user = await requireAuth();
  const parsed = createScheduleSchema.parse(input);
  const result = await createSchedule(user.id, parsed);

  revalidatePath("/timetable");
  revalidatePath("/");

  return { success: true, schedule: result };
}

export async function updateScheduleAction(
  scheduleId: string,
  input: UpdateScheduleInput
) {
  const user = await requireAuth();
  const parsed = updateScheduleSchema.parse(input);
  const result = await updateSchedule(scheduleId, user.id, parsed);

  revalidatePath("/timetable");
  revalidatePath("/");

  return { success: true, schedule: result };
}

export async function duplicateScheduleAction(
  scheduleId: string,
  targetDayOfWeek?: number
) {
  const user = await requireAuth();
  const result = await duplicateSchedule(scheduleId, user.id, targetDayOfWeek);

  revalidatePath("/timetable");
  revalidatePath("/");

  return { success: true, schedule: result };
}

export async function deleteScheduleAction(scheduleId: string) {
  const user = await requireAuth();
  await deleteSchedule(scheduleId, user.id);

  revalidatePath("/timetable");
  revalidatePath("/subjects");
  revalidatePath("/");

  return { success: true };
}
