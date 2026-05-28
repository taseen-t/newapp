import { getDashboard } from "@/lib/data/queries";
import { HomeClient } from "./HomeClient";

export default async function HomePage() {
  const { clinic, queue, followUps, stats, weekly } = await getDashboard();
  return (
    <HomeClient
      queue={queue}
      followUps={followUps}
      stats={stats}
      weekly={weekly}
      city={clinic.city}
    />
  );
}
