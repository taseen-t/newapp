"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getClinicOrRedirect } from "@/lib/auth";
import { todayKarachi } from "@/lib/data/queries";

export type BookApptState = { error?: string; ok?: boolean };

/** Book a future appointment — for an existing patient or a new name + phone. */
export async function bookAppointment(
  _prev: BookApptState,
  formData: FormData,
): Promise<BookApptState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const patientId = String(formData.get("patientId") ?? "").trim();

  if (name.length < 2) return { error: "Enter the patient's name." };
  if (!date) return { error: "Pick a date for the appointment." };

  const clinic = await getClinicOrRedirect();
  const supabase = createClient();
  const { error } = await supabase.from("appointments").insert({
    clinic_id: clinic.id,
    patient_id: patientId || null,
    name,
    phone: phone || null,
    appt_date: date,
    appt_time: time || null,
    reason: reason || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/appointments");
  return { ok: true };
}

/** Cancel an appointment. */
export async function cancelAppointment(
  id: string,
): Promise<{ ok?: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/appointments");
  return { ok: true };
}

/** Patient arrived → find/create the patient and add them to today's queue. */
export async function markAppointmentArrived(
  id: string,
): Promise<{ visitId?: string; error?: string }> {
  const clinic = await getClinicOrRedirect();
  const supabase = createClient();

  const { data: appt, error: aErr } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single();
  if (aErr || !appt) return { error: aErr?.message ?? "Appointment not found." };

  let patientId = appt.patient_id;
  if (!patientId) {
    const { data: p, error: pErr } = await supabase
      .from("patients")
      .insert({
        clinic_id: clinic.id,
        name: appt.name,
        phone: appt.phone ?? "",
        reason: appt.reason ?? null,
        is_new: true,
      })
      .select("id")
      .single();
    if (pErr || !p) {
      return { error: pErr?.message ?? "Could not create the patient." };
    }
    patientId = p.id;
  }

  // Assign the next token for today's queue (same logic as add-patient).
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
      patient_id: patientId,
      status: "waiting",
      token,
      slot,
      reason: appt.reason ?? null,
    })
    .select("id")
    .single();
  if (vErr || !visit) {
    return { error: vErr?.message ?? "Could not add to the queue." };
  }

  await supabase
    .from("appointments")
    .update({ status: "arrived", visit_id: visit.id, patient_id: patientId })
    .eq("id", id);

  revalidatePath("/appointments");
  revalidatePath("/dashboard");
  return { visitId: visit.id };
}
