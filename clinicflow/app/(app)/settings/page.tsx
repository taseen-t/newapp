import { getClinicOrRedirect } from "@/lib/auth";
import { SettingsClient } from "./SettingsClient";

export const metadata = { title: "Settings — ClinicFlow" };

export default async function SettingsPage() {
  const clinic = await getClinicOrRedirect();
  return (
    <SettingsClient
      clinic={{
        clinicName: clinic.name,
        doctorName: clinic.doctor_name ?? "",
        doctorTitle: clinic.doctor_title ?? "",
        city: clinic.city ?? "",
        openUntil: clinic.open_until ?? "",
        phone: clinic.phone ?? "",
        plan: clinic.plan,
        subscriptionStatus: clinic.subscription_status,
      }}
    />
  );
}
