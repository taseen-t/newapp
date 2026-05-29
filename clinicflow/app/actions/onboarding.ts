"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type OnboardingState = { error?: string };

export async function createClinic(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const name = String(formData.get("clinicName") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const doctorName = String(formData.get("doctorName") ?? "").trim();
  const doctorTitle = String(formData.get("doctorTitle") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const openUntil = String(formData.get("openUntil") ?? "").trim();

  if (name.length < 2) {
    return { error: "Enter your clinic's name." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.rpc("create_clinic", {
    p_name: name,
    p_city: city || null,
    p_doctor_name: doctorName || null,
    p_doctor_title: doctorTitle || null,
    p_phone: phone || null,
    p_open_until: openUntil || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
