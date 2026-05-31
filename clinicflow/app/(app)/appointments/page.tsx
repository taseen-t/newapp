import { getUpcomingAppointments, getPatients } from "@/lib/data/queries";
import { AppointmentsClient } from "./AppointmentsClient";

export const metadata = { title: "Appointments — ClinicFlow" };

export default async function AppointmentsPage() {
  const [appointments, patients] = await Promise.all([
    getUpcomingAppointments(),
    getPatients(),
  ]);
  return (
    <AppointmentsClient
      appointments={appointments}
      patients={patients.map((p) => ({
        id: p.id,
        name: p.name,
        phone: p.phone,
      }))}
    />
  );
}
