import type { Metadata } from "next";
import { requireAuth } from "@/modules/auth/auth.guard";
import { getDefaultTimetable } from "@/modules/timetables/timetables.service";
import { AIChatClient } from "./AIChatClient";

export const metadata: Metadata = {
  title: "AI Assistant",
};

export default async function AIPage() {
  const user = await requireAuth();
  const timetable = await getDefaultTimetable(user.id);

  return (
    <AIChatClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
      }}
      timetableId={timetable?.id}
    />
  );
}
