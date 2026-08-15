import { db } from "@/db";
import { notificationSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { UpdateNotificationSettingsInput } from "./notifications.schema";

export async function getUserNotificationSettings(userId: string) {
  let settings = await db.query.notificationSettings.findFirst({
    where: eq(notificationSettings.userId, userId),
  });

  if (!settings) {
    const [created] = await db
      .insert(notificationSettings)
      .values({
        userId,
        enabled: true,
        defaultMinutesBefore: 15,
        soundEnabled: true,
      })
      .returning();
    settings = created;
  }

  return settings;
}

export async function updateUserNotificationSettings(
  userId: string,
  data: UpdateNotificationSettingsInput
) {
  const existing = await getUserNotificationSettings(userId);

  const [updated] = await db
    .update(notificationSettings)
    .set({
      enabled: data.enabled,
      defaultMinutesBefore: data.defaultMinutesBefore,
      soundEnabled: data.soundEnabled ?? true,
      updatedAt: new Date(),
    })
    .where(eq(notificationSettings.id, existing.id))
    .returning();

  return updated;
}

export interface PreparedNotificationAlert {
  userId: string;
  subjectName: string;
  room?: string | null;
  teacher?: string | null;
  startTime: string;
  triggerTimeMinutesBefore: number;
  message: string;
}

/**
 * Prepares formatted notification payloads suitable for future background worker/scheduler jobs.
 */
export function formatClassNotificationPayload(
  alert: PreparedNotificationAlert
): { title: string; body: string; timestamp: Date } {
  const roomText = alert.room ? ` in Room ${alert.room}` : "";
  const teacherText = alert.teacher ? ` with ${alert.teacher}` : "";
  return {
    title: `Upcoming Class: ${alert.subjectName}`,
    body: `Starts at ${alert.startTime}${roomText}${teacherText} (${alert.triggerTimeMinutesBefore}m reminder)`,
    timestamp: new Date(),
  };
}
