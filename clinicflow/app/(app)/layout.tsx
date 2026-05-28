import { getClinicOrRedirect } from "@/lib/auth";

/**
 * Gate for the authenticated app. Redirects to /login if signed out, or to
 * /onboarding if the account hasn't created a clinic yet. Every page in this
 * route group can assume a valid session + clinic.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getClinicOrRedirect();
  return <>{children}</>;
}
