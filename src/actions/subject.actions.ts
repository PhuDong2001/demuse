"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/modules/auth/auth.guard";
import {
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/modules/subjects/subjects.service";
import {
  createSubjectSchema,
  updateSubjectSchema,
  type CreateSubjectInput,
  type UpdateSubjectInput,
} from "@/modules/subjects/subjects.schema";

export async function createSubjectAction(input: CreateSubjectInput) {
  const user = await requireAuth();
  const parsed = createSubjectSchema.parse(input);
  const result = await createSubject(user.id, parsed);

  revalidatePath("/subjects");
  revalidatePath("/timetable");
  revalidatePath("/");

  return { success: true, subject: result };
}

export async function updateSubjectAction(subjectId: string, input: UpdateSubjectInput) {
  const user = await requireAuth();
  const parsed = updateSubjectSchema.parse(input);
  const result = await updateSubject(subjectId, user.id, parsed);

  revalidatePath("/subjects");
  revalidatePath("/timetable");
  revalidatePath("/");

  return { success: true, subject: result };
}

export async function deleteSubjectAction(subjectId: string) {
  const user = await requireAuth();
  await deleteSubject(subjectId, user.id);

  revalidatePath("/subjects");
  revalidatePath("/timetable");
  revalidatePath("/");

  return { success: true };
}
