-- ============================================================
-- ClinicFlow — multi-tenant schema (isolation enforced by RLS)
-- Paste into Supabase → SQL Editor → Run, on a fresh project.
-- Safe to re-run: uses if-not-exists / drop-if-exists guards.
-- ============================================================

create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- ============================================================
-- Tables
-- ============================================================

-- Tenant. One clinic per doctor account (team members can be added later).
create table if not exists public.clinics (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  city                text,
  doctor_name         text,
  doctor_title        text,
  phone               text,
  open_until          text,
  -- Billing (Phase 2 — JazzCash / Easypaisa)
  plan                text not null default 'starter',
  subscription_status text not null default 'trialing'
                      check (subscription_status in ('trialing','active','past_due','canceled')),
  trial_ends_at       timestamptz not null default (now() + interval '14 days'),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- One profile per auth user, linked to a clinic.
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  clinic_id  uuid references public.clinics(id) on delete set null,
  full_name  text,
  role       text not null default 'doctor' check (role in ('doctor','staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.patients (
  id            uuid primary key default gen_random_uuid(),
  clinic_id     uuid not null references public.clinics(id) on delete cascade,
  name          text not null,
  phone         text not null,
  age           int  check (age is null or (age >= 0 and age < 200)),
  gender        text check (gender is null or gender in ('M','F')),
  reason        text,
  is_new        boolean not null default true,
  last_visit_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.visits (
  id                uuid primary key default gen_random_uuid(),
  clinic_id         uuid not null references public.clinics(id) on delete cascade,
  patient_id        uuid not null references public.patients(id) on delete cascade,
  visit_date        date not null default (timezone('Asia/Karachi', now()))::date,
  status            text not null default 'waiting'
                    check (status in ('waiting','in-progress','completed')),
  token             int,
  slot              text,
  reason            text,
  diagnoses         text[] not null default '{}',
  notes             text,
  prescription_path text,           -- storage path: <clinic_id>/<visit_id>/<file>
  started_at        timestamptz,
  completed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.follow_ups (
  id         uuid primary key default gen_random_uuid(),
  clinic_id  uuid not null references public.clinics(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  visit_id   uuid references public.visits(id) on delete set null,
  due_date   date not null,
  tag        text,
  note       text,
  status     text not null default 'scheduled'
             check (status in ('scheduled','due','missed','done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_patients_clinic    on public.patients(clinic_id);
create index if not exists idx_visits_clinic_date  on public.visits(clinic_id, visit_date);
create index if not exists idx_visits_patient      on public.visits(patient_id);
create index if not exists idx_followups_clinic    on public.follow_ups(clinic_id, due_date);

-- ============================================================
-- Helper: current user's clinic_id.
-- SECURITY DEFINER so it can be called inside RLS policies
-- without recursing through the profiles policy.
-- ============================================================
create or replace function public.auth_clinic_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select clinic_id from public.profiles where id = auth.uid()
$$;

-- ============================================================
-- Auto-create a profile row when a new auth user signs up.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Onboarding RPC: create a clinic and join the caller to it.
-- Atomic; bypasses RLS via SECURITY DEFINER.
-- ============================================================
create or replace function public.create_clinic(
  p_name         text,
  p_city         text default null,
  p_doctor_name  text default null,
  p_doctor_title text default null,
  p_phone        text default null,
  p_open_until   text default null
)
returns public.clinics
language plpgsql security definer set search_path = public
as $$
declare
  v_clinic public.clinics;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.clinics (name, city, doctor_name, doctor_title, phone, open_until)
  values (p_name, p_city, p_doctor_name, p_doctor_title, p_phone, p_open_until)
  returning * into v_clinic;

  update public.profiles
     set clinic_id = v_clinic.id,
         full_name = coalesce(full_name, p_doctor_name)
   where id = auth.uid();

  return v_clinic;
end;
$$;

grant execute on function public.create_clinic(text,text,text,text,text,text) to authenticated;

-- ============================================================
-- updated_at maintenance
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_clinics_updated   on public.clinics;
create trigger trg_clinics_updated   before update on public.clinics    for each row execute function public.set_updated_at();
drop trigger if exists trg_patients_updated  on public.patients;
create trigger trg_patients_updated  before update on public.patients   for each row execute function public.set_updated_at();
drop trigger if exists trg_visits_updated    on public.visits;
create trigger trg_visits_updated    before update on public.visits     for each row execute function public.set_updated_at();
drop trigger if exists trg_followups_updated on public.follow_ups;
create trigger trg_followups_updated before update on public.follow_ups for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.clinics    enable row level security;
alter table public.profiles   enable row level security;
alter table public.patients   enable row level security;
alter table public.visits     enable row level security;
alter table public.follow_ups enable row level security;

-- profiles: a user sees / edits only their own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- clinics: members read / update their own clinic (inserts go through create_clinic)
drop policy if exists "clinics_select_member" on public.clinics;
create policy "clinics_select_member" on public.clinics
  for select using (id = public.auth_clinic_id());
drop policy if exists "clinics_update_member" on public.clinics;
create policy "clinics_update_member" on public.clinics
  for update using (id = public.auth_clinic_id()) with check (id = public.auth_clinic_id());

-- patients / visits / follow_ups: every row scoped to the caller's clinic
drop policy if exists "patients_all_clinic" on public.patients;
create policy "patients_all_clinic" on public.patients
  for all using (clinic_id = public.auth_clinic_id())
  with check (clinic_id = public.auth_clinic_id());

drop policy if exists "visits_all_clinic" on public.visits;
create policy "visits_all_clinic" on public.visits
  for all using (clinic_id = public.auth_clinic_id())
  with check (clinic_id = public.auth_clinic_id());

drop policy if exists "followups_all_clinic" on public.follow_ups;
create policy "followups_all_clinic" on public.follow_ups
  for all using (clinic_id = public.auth_clinic_id())
  with check (clinic_id = public.auth_clinic_id());

-- ============================================================
-- Storage: private bucket for handwritten prescription photos.
-- Files live under  <clinic_id>/<visit_id>/<filename>
-- ============================================================
insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', false)
on conflict (id) do nothing;

drop policy if exists "rx_select_clinic" on storage.objects;
create policy "rx_select_clinic" on storage.objects
  for select using (
    bucket_id = 'prescriptions'
    and (storage.foldername(name))[1] = public.auth_clinic_id()::text
  );

drop policy if exists "rx_insert_clinic" on storage.objects;
create policy "rx_insert_clinic" on storage.objects
  for insert with check (
    bucket_id = 'prescriptions'
    and (storage.foldername(name))[1] = public.auth_clinic_id()::text
  );

drop policy if exists "rx_update_clinic" on storage.objects;
create policy "rx_update_clinic" on storage.objects
  for update using (
    bucket_id = 'prescriptions'
    and (storage.foldername(name))[1] = public.auth_clinic_id()::text
  );

drop policy if exists "rx_delete_clinic" on storage.objects;
create policy "rx_delete_clinic" on storage.objects
  for delete using (
    bucket_id = 'prescriptions'
    and (storage.foldername(name))[1] = public.auth_clinic_id()::text
  );
