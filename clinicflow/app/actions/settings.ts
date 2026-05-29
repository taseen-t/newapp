"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getClinicOrRedirect } from "@/lib/auth";

export type SettingsState = { error?: string; ok?: boolean };

/**
 * Doctor edits their clinic + profile details. RLS only lets a member update
 * their own clinic, so no extra ownership check is needed. Used with useFormState.
 */
export async function updateClinic(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const clinic = await getClinicOrRedirect();

  const name = String(formData.get("clinicName") ?? "").trim();
  const doctorName = String(formData.get("doctorName") ?? "").trim();
  const doctorTitle = String(formData.get("doctorTitle") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const openUntil = String(formData.get("openUntil") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (name.length < 2) return { error: "Enter your clinic's name." };

  const supabase = createClient();
  const { error } = await supabase
    .from("clinics")
    .update({
      name,
      doctor_name: doctorName || null,
      doctor_title: doctorTitle || null,
      city: city || null,
      open_until: openUntil || null,
      phone: phone || null,
    })
    .eq("id", clinic.id);

  if (error) return { error: error.message };

  // Keep the auth profile's display name in sync with the doctor name.
  if (doctorName) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ full_name: doctorName })
        .eq("id", user.id);
    }
  }

  // Refresh the whole app shell so the sidebar/header pick up new clinic info.
  revalidatePath("/", "layout");
  return { ok: true };
}
