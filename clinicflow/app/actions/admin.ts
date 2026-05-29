"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import type { SubscriptionStatus } from "@/lib/database.types";

export type AdminResult = { ok?: boolean; error?: string };

const PLANS = ["starter", "clinic", "pro"];
const STATUSES: SubscriptionStatus[] = [
  "trialing",
  "active",
  "past_due",
  "canceled",
];

/**
 * Platform-admin only: change a clinic's plan / subscription status.
 * Guarded both here (is_admin check) and by the clinics_update_admin RLS policy.
 */
export async function updateClinicBilling(input: {
  clinicId: string;
  plan?: string;
  status?: SubscriptionStatus;
}): Promise<AdminResult> {
  const profile = await getProfile();
  if (!profile?.is_admin) return { error: "Not authorized." };

  const patch: { plan?: string; subscription_status?: SubscriptionStatus } = {};
  if (input.plan && PLANS.includes(input.plan)) patch.plan = input.plan;
  if (input.status && STATUSES.includes(input.status)) {
    patch.subscription_status = input.status;
  }
  if (Object.keys(patch).length === 0) return { error: "Nothing to update." };

  const supabase = createClient();
  const { error } = await supabase
    .from("clinics")
    .update(patch)
    .eq("id", input.clinicId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}
