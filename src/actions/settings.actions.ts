"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/modules/auth/auth.guard";
import { updateUserProfile, updateUserPassword } from "@/modules/users/users.service";
import { updateUserNotificationSettings } from "@/modules/notifications/notifications.service";
import {
  updateProfileSchema,
  updatePasswordSchema,
  type UpdateProfileInput,
  type UpdatePasswordInput,
} from "@/modules/users/users.schema";
import {
  updateNotificationSettingsSchema,
  type UpdateNotificationSettingsInput,
} from "@/modules/notifications/notifications.schema";

export async function updateProfileAction(input: UpdateProfileInput) {
  const user = await requireAuth();
  const parsed = updateProfileSchema.parse(input);
  const updated = await updateUserProfile(user.id, parsed);

  revalidatePath("/settings");
  revalidatePath("/");

  return { success: true, user: updated };
}

export async function updatePasswordAction(input: UpdatePasswordInput) {
  const user = await requireAuth();
  const parsed = updatePasswordSchema.parse(input);
  await updateUserPassword(user.id, parsed);

  return { success: true };
}

export async function updateNotificationSettingsAction(
  input: UpdateNotificationSettingsInput
) {
  const user = await requireAuth();
  const parsed = updateNotificationSettingsSchema.parse(input);
  const updated = await updateUserNotificationSettings(user.id, parsed);

  revalidatePath("/settings");
  return { success: true, settings: updated };
}
