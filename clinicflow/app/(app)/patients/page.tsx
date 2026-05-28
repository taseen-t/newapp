import { getPatients } from "@/lib/data/queries";
import { PatientsClient } from "./PatientsClient";

export default async function PatientsPage() {
  const patients = await getPatients();
  return <PatientsClient patients={patients} />;
}
