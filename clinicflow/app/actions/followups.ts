"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getClinicOrRedirect } from "@/lib/auth";
import { dateKarachi } from "@/lib/data/queries";

export type ScheduleFollowUpInput = {
  patientId: string;
  tag?: string;
  note?: string;
  inDays?: number;
};

export type ScheduleFollowUpResult = { due?: string; error?: string };

/** Create a follow-up reminder for a patient, default 7 days out. */
export async function scheduleFollowUp(
  input: ScheduleFollowUpInput,
): Promise<ScheduleFollowUpResult> {
  const clinic = await getClinicOrRedirect();
  const supabase = createClient();
  const due = dateKarachi(input.inDays ?? 7);

  const { error } = await supabase.from("follow_ups").insert({
    clinic_id: clinic.id,
    patient_id: input.patientId,
    due_date: due,
    tag: input.tag?.trim() || null,
    note: input.note?.trim() || null,
    status: "scheduled",
  });

  if (error) return { error: error.message };

  revalidatePath("/follow-ups");
  revalidatePath("/");
  return { due };
}

/** Mark a follow-up as done (e.g. after the patient returns). */
export async function markFollowUpDone(
  id: string,
): Promise<{ ok?: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("follow_ups")
    .update({ status: "done" })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/follow-ups");
  revalidatePath("/");
  return { ok: true };
}
