"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getClinicOrRedirect } from "@/lib/auth";
import { todayKarachi } from "@/lib/data/queries";

export type AddPatientState = { error?: string };

/**
 * Registers a new patient and adds them to today's waiting queue (a visit
 * row with status `waiting`), then returns to the dashboard. The doctor
 * starts the visit explicitly from the queue when the patient is present.
 * (Add-patient is the receptionist's job; starting a visit is the doctor's.)
 * Used with useFormState.
 */
export async function addPatient(
  _prev: AddPatientState,
  formData: FormData,
): Promise<AddPatientState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const ageRaw = String(formData.get("age") ?? "").trim();
  const genderRaw = String(formData.get("gender") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  if (name.length < 2) return { error: "Enter the patient's full name." };
  if (phone.replace(/\D+/g, "").length < 7) {
    return { error: "Enter a valid phone number." };
  }

  const ageNum = ageRaw ? Number(ageRaw) : null;
  const age = ageNum != null && Number.isFinite(ageNum) ? ageNum : null;
  const gender = genderRaw === "M" || genderRaw === "F" ? genderRaw : null;

  const clinic = await getClinicOrRedirect();
  const supabase = createClient();

  const { data: patient, error: pErr } = await supabase
    .from("patients")
    .insert({
      clinic_id: clinic.id,
      name,
      phone,
      age,
      gender,
      reason: reason || null,
      is_new: true,
    })
    .select("id")
    .single();

  if (pErr || !patient) {
    return { error: pErr?.message ?? "Could not save the patient." };
  }

  // Assign the next token for today's queue.
  const today = todayKarachi();
  const { data: last } = await supabase
    .from("visits")
    .select("token")
    .eq("visit_date", today)
    .order("token", { ascending: false })
    .limit(1)
    .maybeSingle();
  const token = (last?.token ?? 0) + 1;

  const slot = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Karachi",
    hour: "numeric",
    minute: "2-digit",
  });

  const { data: visit, error: vErr } = await supabase
    .from("visits")
    .insert({
      clinic_id: clinic.id,
      patient_id: patient.id,
      status: "waiting",
      token,
      slot,
      reason: reason || null,
    })
    .select("id")
    .single();

  if (vErr || !visit) {
    return { error: vErr?.message ?? "Could not start the visit." };
  }

  // Patient is now waiting in today's queue. Back to the dashboard so the
  // receptionist can add the next patient; the doctor starts the visit later.
  revalidatePath("/");
  redirect("/");
}
