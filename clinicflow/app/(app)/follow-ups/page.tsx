import { getFollowUps } from "@/lib/data/queries";
import { FollowUpsClient } from "./FollowUpsClient";

export default async function FollowUpsPage() {
  const followUps = await getFollowUps();
  return <FollowUpsClient followUps={followUps} />;
}
