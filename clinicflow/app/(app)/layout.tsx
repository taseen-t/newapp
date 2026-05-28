import { getClinicOrRedirect, getProfile } from "@/lib/auth";
import { getNavCounts } from "@/lib/data/queries";
import { ClinicProvider } from "@/components/providers/ClinicProvider";
import { initials } from "@/lib/utils";

/**
 * Gate for the authenticated app. Redirects to /login if signed out, or to
 * /onboarding if the account hasn't created a clinic yet. Every page in this
 * route group can assume a valid session + clinic, and read it via useClinic().
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clinic, profile, counts] = await Promise.all([
    getClinicOrRedirect(),
    getProfile(),
    getNavCounts(),
  ]);
  const doctorName = clinic.doctor_name ?? profile?.full_name ?? "Doctor";

  return (
    <ClinicProvider
      value={{
        id: clinic.id,
        clinicName: clinic.name,
        doctorName,
        doctorTitle: clinic.doctor_title ?? "",
        city: clinic.city ?? "",
        openUntil: clinic.open_until ?? "",
        phone: clinic.phone ?? "",
        initials: initials(doctorName),
        queueCount: counts.queue,
        pendingCount: counts.pending,
      }}
    >
      {children}
    </ClinicProvider>
  );
}
