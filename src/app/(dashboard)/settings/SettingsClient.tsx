"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { NOTIFICATION_INTERVALS } from "@/lib/constants";
import { updateProfileAction, updatePasswordAction, updateNotificationSettingsAction } from "@/actions/settings.actions";
import { updateTimetableAction } from "@/actions/timetable.actions";
import { User, Bell, Lock, Calendar, Check, Volume } from "reicon-react";
import type { NotificationSetting, Timetable } from "@/db/schema";
import { useLanguage } from "@/lib/LanguageContext";

interface SettingsClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  notificationSettings: NotificationSetting;
  timetable: Timetable;
}

export function SettingsClient({
  user,
  notificationSettings,
  timetable,
}: SettingsClientProps) {
  const router = useRouter();
  const { t } = useLanguage();

  // Profile State
  const [name, setName] = React.useState(user.name);
  const [profileSaved, setProfileSaved] = React.useState(false);
  const [isProfileLoading, setIsProfileLoading] = React.useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [passwordSaved, setPasswordSaved] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [isPasswordLoading, setIsPasswordLoading] = React.useState(false);

  // Notification Settings State
  const [notifEnabled, setNotifEnabled] = React.useState(notificationSettings.enabled);
  const [minutesBefore, setMinutesBefore] = React.useState<number>(
    notificationSettings.defaultMinutesBefore
  );
  const [soundEnabled, setSoundEnabled] = React.useState(notificationSettings.soundEnabled);
  const [notifSaved, setNotifSaved] = React.useState(false);
  const [isNotifLoading, setIsNotifLoading] = React.useState(false);

  // Timetable Settings State
  const [ttName, setTtName] = React.useState(timetable.name);
  const [ttTerm, setTtTerm] = React.useState(timetable.academicTerm || "");
  const [ttDescription, setTtDescription] = React.useState(timetable.description || "");
  const [ttSaved, setTtSaved] = React.useState(false);
  const [isTtLoading, setIsTtLoading] = React.useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    try {
      await updateProfileAction({ name });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
      router.refresh();
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordError(null);
    try {
      await updatePasswordAction({ currentPassword, newPassword });
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPasswordSaved(false), 2500);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNotifLoading(true);
    try {
      await updateNotificationSettingsAction({
        enabled: notifEnabled,
        defaultMinutesBefore: minutesBefore as 5 | 10 | 15 | 30 | 60,
        soundEnabled,
      });
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2500);
      router.refresh();
    } finally {
      setIsNotifLoading(false);
    }
  };

  const handleUpdateTimetable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTtLoading(true);
    try {
      await updateTimetableAction(timetable.id, {
        name: ttName,
        academicTerm: ttTerm || undefined,
        description: ttDescription || undefined,
      });
      setTtSaved(true);
      setTimeout(() => setTtSaved(false), 2500);
      router.refresh();
    } finally {
      setIsTtLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="pb-2 border-b border-[#f0eae1]">
        <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1917]">
          {t.preferencesSettings}
        </h1>
        <p className="text-xs text-[#78716c] mt-0.5">
          {t.settingsSub}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#f0eae1]">
            <User className="h-4 w-4 text-[#78716c]" />
            <h2 className="font-serif text-base font-medium text-[#1c1917]">
              {t.studentProfile}
            </h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label={t.fullName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label={t.emailAddress}
              value={user.email}
              disabled
              helperText={t.emailHelper}
            />

            <div className="flex items-center justify-between pt-2">
              {profileSaved ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="h-3.5 w-3.5" /> {t.profileSaved}
                </span>
              ) : <div />}

              <Button type="submit" size="sm" isLoading={isProfileLoading}>
                {t.saveProfile}
              </Button>
            </div>
          </form>
        </div>

        {/* Security / Password Card */}
        <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#f0eae1]">
            <Lock className="h-4 w-4 text-[#78716c]" />
            <h2 className="font-serif text-base font-medium text-[#1c1917]">
              {t.securityPassword}
            </h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {passwordError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
                {passwordError}
              </div>
            )}

            <Input
              label={t.currentPassword}
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label={t.newPassword}
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between pt-2">
              {passwordSaved ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="h-3.5 w-3.5" /> {t.passwordSaved}
                </span>
              ) : <div />}

              <Button type="submit" size="sm" isLoading={isPasswordLoading}>
                {t.updatePassword}
              </Button>
            </div>
          </form>
        </div>

        {/* Notification Settings Card */}
        <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#f0eae1]">
            <Bell className="h-4 w-4 text-[#78716c]" />
            <h2 className="font-serif text-base font-medium text-[#1c1917]">
              {t.classNotificationAlerts}
            </h2>
          </div>

          <form onSubmit={handleUpdateNotifications} className="space-y-4">
            {/* Toggle Enable */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#ded7c8] bg-[#faf7f2]/60">
              <div>
                <p className="text-xs font-semibold text-[#1c1917]">
                  {t.upcomingClassReminders}
                </p>
                <p className="text-[11px] text-[#78716c]">
                  {t.upcomingRemindersSub}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setNotifEnabled(!notifEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  notifEnabled ? "bg-[#1c1917]" : "bg-[#ded7c8]"
                }`}
                role="switch"
                aria-checked={notifEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    notifEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Timing select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e]">
                {t.leadTimeLabel}
              </label>
              <select
                value={minutesBefore}
                onChange={(e) => setMinutesBefore(Number(e.target.value))}
                disabled={!notifEnabled}
                className="w-full rounded-lg border border-[#ded7c8] bg-white px-3 py-2 text-xs text-[#1c1917] focus:border-[#1c1917] focus:outline-none disabled:opacity-50"
              >
                {NOTIFICATION_INTERVALS.map((item) => (
                  <option key={item.minutes} value={item.minutes}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound alert toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#ded7c8] bg-[#faf7f2]/60">
              <div className="flex items-center gap-2">
                <Volume className="h-3.5 w-3.5 text-[#78716c]" />
                <span className="text-xs font-semibold text-[#1c1917]">
                  {t.soundAlert}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                disabled={!notifEnabled}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out disabled:opacity-50 ${
                  soundEnabled && notifEnabled ? "bg-[#1c1917]" : "bg-[#ded7c8]"
                }`}
                role="switch"
                aria-checked={soundEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    soundEnabled && notifEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              {notifSaved ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="h-3.5 w-3.5" /> {t.preferencesSaved}
                </span>
              ) : <div />}

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    if ("Notification" in window) {
                      const permission = await Notification.requestPermission();
                      if (permission === "granted") {
                        if ("serviceWorker" in navigator) {
                          const reg = await navigator.serviceWorker.ready;
                          reg.showNotification("Demuse Class Reminder", {
                            body: "Upcoming lecture in 15 mins (Room 302). Notifications active!",
                            icon: "/demuse/android-chrome-192x192.png",
                            badge: "/demuse/favicon-32x32.png",
                          });
                        } else {
                          new Notification("Demuse Class Reminder", {
                            body: "Upcoming lecture in 15 mins (Room 302).",
                            icon: "/demuse/android-chrome-192x192.png",
                          });
                        }
                      }
                    }
                  }}
                >
                  {t.testPhonePopup}
                </Button>

                <Button type="submit" size="sm" isLoading={isNotifLoading}>
                  {t.savePreferences}
                </Button>
              </div>
            </div>

            {/* iPhone / Mobile Helper Box */}
            <div className="p-3.5 rounded-xl border border-[#ded7c8] bg-[#faf7f2] space-y-1.5 text-xs text-[#6b645b]">
              <p className="font-semibold text-[#1c1917]">
                {t.iphoneTipTitle}
              </p>
              <p className="text-[11px] leading-relaxed text-[#78716c]">
                {t.iphoneTipBody}
              </p>
            </div>
          </form>
        </div>

        {/* Timetable Configuration Card */}
        <div className="rounded-2xl border border-[#ded7c8] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#f0eae1]">
            <Calendar className="h-4 w-4 text-[#78716c]" />
            <h2 className="font-serif text-base font-medium text-[#1c1917]">
              {t.timetableDetails}
            </h2>
          </div>

          <form onSubmit={handleUpdateTimetable} className="space-y-3">
            <Input
              label={t.timetableTitle}
              value={ttName}
              onChange={(e) => setTtName(e.target.value)}
              required
            />
            <Input
              label={t.academicTerm}
              placeholder="e.g. Spring 2026"
              value={ttTerm}
              onChange={(e) => setTtTerm(e.target.value)}
            />
            <Input
              label={t.departmentDesc}
              placeholder="e.g. Computer Science & Design"
              value={ttDescription}
              onChange={(e) => setTtDescription(e.target.value)}
            />

            <div className="flex items-center justify-between pt-2">
              {ttSaved ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="h-3.5 w-3.5" /> Details Saved
                </span>
              ) : <div />}

              <Button type="submit" size="sm" isLoading={isTtLoading}>
                {t.saveTimetable}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
