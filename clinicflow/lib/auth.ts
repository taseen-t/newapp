import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ClinicRow, ProfileRow } from "@/lib/database.types";

/** Current authenticated user (or null). Cached per request. */
export const getUser = cache(async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Current user's profile row (or null). Cached per request. */
export const getProfile = cache(async (): Promise<ProfileRow | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data;
});

/**
 * Returns the caller's clinic. Redirects to /login if signed out, or to
 * /onboarding if the account has no clinic yet. Use this to gate the app.
 */
export const getClinicOrRedirect = cache(async (): Promise<ClinicRow> => {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("clinic_id")
    .eq("id", user.id)
    .single();

  if (!profile?.clinic_id) redirect("/onboarding");

  const { data: clinic } = await supabase
    .from("clinics")
    .select("*")
    .eq("id", profile.clinic_id)
    .single();

  if (!clinic) redirect("/onboarding");
  return clinic;
});
