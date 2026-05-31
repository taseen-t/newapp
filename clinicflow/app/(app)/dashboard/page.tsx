import { getDashboard } from "@/lib/data/queries";
import { HomeClient } from "../HomeClient";

export default async function DashboardPage() {
  const { clinic, queue, followUps, stats, weekly, revenue } =
    await getDashboard();
  return (
    <HomeClient
      queue={queue}
      followUps={followUps}
      stats={stats}
      weekly={weekly}
      revenue={revenue}
      city={clinic.city}
    />
  );
}
