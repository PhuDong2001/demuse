import { TimetableSkeleton } from "@/components/feedback/LoadingSkeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-[#ede8dc]/80 rounded-xl" />
      <div className="h-44 w-full bg-white border border-[#ded7c8] rounded-2xl p-6" />
      <TimetableSkeleton />
    </div>
  );
}
