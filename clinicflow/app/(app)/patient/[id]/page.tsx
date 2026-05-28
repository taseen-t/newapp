import { notFound } from "next/navigation";
import { getPatientProfile } from "@/lib/data/queries";
import { PatientClient } from "./PatientClient";

export default async function PatientProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const patient = await getPatientProfile(params.id);
  if (!patient) notFound();
  return <PatientClient patient={patient} />;
}
