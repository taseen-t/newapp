import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { OnboardingForm } from "./OnboardingForm";

export const metadata = { title: "Set up your clinic — ClinicFlow" };

export default async function OnboardingPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.clinic_id) redirect("/dashboard");

  return <OnboardingForm defaultDoctorName={profile.full_name ?? ""} />;
}
