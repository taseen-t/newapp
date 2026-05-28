import { notFound } from "next/navigation";
import { getActiveVisit } from "@/lib/data/queries";
import { VisitClient } from "./VisitClient";

export default async function ActiveVisitPage({
  params,
}: {
  params: { id: string };
}) {
  const active = await getActiveVisit(params.id);
  if (!active) notFound();
  return <VisitClient active={active} />;
}
