-- ============================================================
-- ClinicFlow — platform admin add-on
-- Run in Supabase → SQL Editor → Run (after schema.sql). Idempotent.
-- Lets a designated "platform admin" account view & manage every clinic.
-- ============================================================

-- 1) Admin flag on profiles
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- 2) Helper: is the current user a platform admin?
--    SECURITY DEFINER so it can be used inside RLS policies safely.
create or replace function public.is_platform_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  )
$$;

-- 3) Admin RLS policies (these OR with the existing per-clinic member policies)

-- Clinics: admins read & manage all
drop policy if exists "clinics_select_admin" on public.clinics;
create policy "clinics_select_admin" on public.clinics
  for select using (public.is_platform_admin());

drop policy if exists "clinics_update_admin" on public.clinics;
create policy "clinics_update_admin" on public.clinics
  for update using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- Patients & visits: admins can read across clinics (for counts in the panel)
drop policy if exists "patients_select_admin" on public.patients;
create policy "patients_select_admin" on public.patients
  for select using (public.is_platform_admin());

drop policy if exists "visits_select_admin" on public.visits;
create policy "visits_select_admin" on public.visits
  for select using (public.is_platform_admin());

-- ============================================================
-- 4) Make YOURSELF an admin — replace the email below, then run:
--
--   update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'you@example.com');
-- ============================================================
