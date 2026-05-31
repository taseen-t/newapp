"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getClinicOrRedirect } from "@/lib/auth";

/** Move a waiting visit to in-progress when the doctor opens it. No-op otherwise. */
export async function startVisit(visitId: string) {
  const supabase = createClient();
  await supabase
    .from("visits")
    .update({ status: "in-progress", started_at: new Date().toISOString() })
    .eq("id", visitId)
    .eq("status", "waiting");
  revalidatePath("/dashboard");
}

export type CompleteVisitInput = {
  visitId: string;
  diagnoses: string[];
  notes: string;
  fee?: number | null;
  paid?: boolean;
};

export type CompleteVisitResult = { patientId?: string; error?: string };

/** Finalize a visit: save diagnoses + notes, stamp the patient's last visit. */
export async function completeVisit(
  input: CompleteVisitInput,
): Promise<CompleteVisitResult> {
  const supabase = createClient();
  const { visitId, diagnoses, notes } = input;

  const { data: visit, error } = await supabase
    .from("visits")
    .update({
      status: "completed",
      diagnoses,
      notes: notes.trim() || null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", visitId)
    .select("patient_id")
    .single();

  if (error || !visit) {
    return { error: error?.message ?? "Could not save the visit." };
  }

  await supabase
    .from("patients")
    .update({ last_visit_at: new Date().toISOString(), is_new: false })
    .eq("id", visit.patient_id);

  // Billing (new columns) — best effort so visit completion still works
  // before the features migration is applied.
  const billing: { fee?: number | null; paid?: boolean } = {};
  if (input.fee !== undefined) billing.fee = input.fee;
  if (input.paid !== undefined) billing.paid = input.paid;
  if (Object.keys(billing).length > 0) {
    const { error: bErr } = await supabase
      .from("visits")
      .update(billing)
      .eq("id", visitId);
    if (bErr) console.error("completeVisit billing skipped:", bErr.message);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/patient/${visit.patient_id}`);
  return { patientId: visit.patient_id };
}

/** Mark a single visit's consultation fee as paid (best effort). */
export async function markVisitPaid(
  visitId: string,
): Promise<{ ok?: boolean; error?: string }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("visits")
    .update({ paid: true })
    .eq("id", visitId)
    .select("patient_id")
    .single();
  if (error) return { error: error.message };
  if (data?.patient_id) revalidatePath(`/patient/${data.patient_id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Remove a patient from today's queue (no-show / cancelled). */
export async function cancelVisit(
  visitId: string,
): Promise<{ ok?: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("visits")
    .update({ status: "cancelled" })
    .eq("id", visitId)
    .neq("status", "completed");
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { ok: true };
}

export type UploadResult = { path?: string; error?: string };

/** Upload a handwritten prescription photo to private Storage + link it. */
export async function uploadPrescription(
  formData: FormData,
): Promise<UploadResult> {
  const file = formData.get("file");
  const visitId = String(formData.get("visitId") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "No photo selected." };
  }
  if (!visitId) return { error: "Missing visit." };

  const clinic = await getClinicOrRedirect();
  const supabase = createClient();

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${clinic.id}/${visitId}/${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("prescriptions")
    .upload(path, file, {
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

  if (upErr) return { error: upErr.message };

  const { error: dbErr } = await supabase
    .from("visits")
    .update({ prescription_path: path })
    .eq("id", visitId);

  if (dbErr) return { error: dbErr.message };

  revalidatePath(`/visit/${visitId}`);
  return { path };
}
