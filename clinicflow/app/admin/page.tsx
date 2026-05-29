import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminClient } from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin — ClinicFlow",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (!profile.is_admin) redirect("/dashboard");

  const supabase = createClient();
  const [{ data: clinics }, { data: patients }, { data: visits }] =
    await Promise.all([
      supabase.from("clinics").select("*").order("created_at", { ascending: false }),
      supabase.from("patients").select("clinic_id"),
      supabase.from("visits").select("clinic_id"),
    ]);

  const patientCounts = new Map<string, number>();
  for (const p of patients ?? []) {
    patientCounts.set(p.clinic_id, (patientCounts.get(p.clinic_id) ?? 0) + 1);
  }
  const visitCounts = new Map<string, number>();
  for (const v of visits ?? []) {
    visitCounts.set(v.clinic_id, (visitCounts.get(v.clinic_id) ?? 0) + 1);
  }

  const rows = (clinics ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    doctorName: c.doctor_name ?? "—",
    city: c.city ?? "—",
    phone: c.phone ?? "—",
    plan: c.plan,
    status: c.subscription_status,
    createdAt: c.created_at,
    patients: patientCounts.get(c.id) ?? 0,
    visits: visitCounts.get(c.id) ?? 0,
  }));

  return <AdminClient clinics={rows} adminName={profile.full_name ?? "Admin"} />;
}
