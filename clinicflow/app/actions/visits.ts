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

  revalidatePath("/dashboard");
  revalidatePath(`/patient/${visit.patient_id}`);
  return { patientId: visit.patient_id };
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
