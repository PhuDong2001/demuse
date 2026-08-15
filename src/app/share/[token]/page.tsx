import { getPublicTimetableByShareToken } from "@/modules/timetables/timetables.service";
import { getTimetableSchedulesWithSubject } from "@/modules/schedules/schedules.service";
import { SharePublicClient } from "./SharePublicClient";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface SharePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;

  let timetableData = null;
  let schedulesData = null;

  try {
    const timetable = await getPublicTimetableByShareToken(token);
    const schedules = await getTimetableSchedulesWithSubject(timetable.id);
    timetableData = timetable;
    schedulesData = schedules;
  } catch {
    timetableData = null;
  }

  if (!timetableData || !schedulesData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#faf7f2] text-[#1c1917]">
        <div className="max-w-md p-8 rounded-2xl border border-[#ded7c8] bg-white shadow-xs space-y-4">
          <div className="h-12 w-12 rounded-full bg-[#ede8dc] text-[#57534e] flex items-center justify-center mx-auto font-serif text-xl font-bold">
            D
          </div>
          <h1 className="font-serif text-xl font-medium text-[#1c1917]">
            Timetable Not Accessible
          </h1>
          <p className="text-xs text-[#78716c] leading-relaxed">
            This timetable link is either invalid, expired, or has been set to private by its author.
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button size="sm" variant="primary">
                Return to Demuse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <SharePublicClient timetable={timetableData} schedules={schedulesData} />;
}
