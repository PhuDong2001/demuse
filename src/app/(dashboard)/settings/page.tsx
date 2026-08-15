import { requireAuth } from "@/modules/auth/auth.guard";
import { getUserProfile } from "@/modules/users/users.service";
import { getUserNotificationSettings } from "@/modules/notifications/notifications.service";
import { getDefaultTimetable } from "@/modules/timetables/timetables.service";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const authUser = await requireAuth();

  const [userProfile, notificationSettings, timetable] = await Promise.all([
    getUserProfile(authUser.id),
    getUserNotificationSettings(authUser.id),
    getDefaultTimetable(authUser.id),
  ]);

  if (!timetable) {
    return null;
  }

  return (
    <SettingsClient
      user={userProfile}
      notificationSettings={notificationSettings}
      timetable={timetable}
    />
  );
}
