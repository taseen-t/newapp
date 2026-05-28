import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { BottomNav } from "@/components/layout/BottomNav";
import { Greeting } from "@/components/screens/Greeting";
import { SearchBar } from "@/components/screens/SearchBar";
import { StatsRow } from "@/components/screens/StatsRow";
import { PatientQueueCard } from "@/components/screens/PatientQueueCard";
import { FollowUpStrip } from "@/components/screens/FollowUpStrip";
import { AddPatientFab } from "@/components/screens/AddPatientFab";
import { SectionHeader } from "@/components/ui/section";
import { patients } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <AppShell>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-72 -z-10 gradient-mesh" />

        <Greeting />
        <SearchBar />
        <StatsRow />

        <div className="mt-7 flex flex-col gap-3">
          <SectionHeader
            title="Today's queue"
            description={`${patients.length} patients · 5 waiting`}
            action={
              <Link
                href="/visit/p3"
                className="text-[12px] font-medium text-primary"
              >
                View all
              </Link>
            }
            className="px-6"
          />
          <div className="flex flex-col gap-2 px-5">
            {patients.map((p, i) => (
              <PatientQueueCard key={p.id} patient={p} index={i} />
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 pb-10">
          <SectionHeader
            title="Follow-up reminders"
            description="Send WhatsApp in one tap"
            action={
              <Link
                href="/follow-ups"
                className="text-[12px] font-medium text-primary"
              >
                See all
              </Link>
            }
            className="px-6"
          />
          <FollowUpStrip />
        </div>

        <AddPatientFab />
      </div>
      <BottomNav />
    </AppShell>
  );
}
