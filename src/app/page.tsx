import { getCurrentUser } from "@/modules/auth/auth.guard";
import { getDefaultTimetable } from "@/modules/timetables/timetables.service";
import { getSubjectsByTimetable } from "@/modules/subjects/subjects.service";
import { getTimetableSchedulesWithSubject } from "@/modules/schedules/schedules.service";
import { DashboardClient } from "./(dashboard)/DashboardClient";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { LandingPageClient } from "./LandingPageClient";

export default async function HomePage() {
  const user = await getCurrentUser();

  // If user is already authenticated, show their personal planner workspace directly
  if (user) {
    const timetable = await getDefaultTimetable(user.id);
    if (timetable) {
      const [subjectsList, schedulesList] = await Promise.all([
        getSubjectsByTimetable(timetable.id, user.id),
        getTimetableSchedulesWithSubject(timetable.id, user.id),
      ]);

      return (
        <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c1917]">
          <AppHeader
            user={user}
            academicTerm={timetable.academicTerm || "Spring 2026"}
          />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            <DashboardClient
              user={user}
              timetable={timetable}
              subjects={subjectsList}
              schedules={schedulesList}
            />
          </main>
          <MobileBottomNav />
        </div>
      );
    }
  }

  // If unauthenticated, display the bilingual product landing page
  return <LandingPageClient />;
}
