-- ============================================================
-- ClinicFlow — feature add-ons:
--   1) Billing: consultation fee + paid flag
--   2) Queue control: cancel / no-show a visit
--   3) Appointments (future bookings that become visits on arrival)
-- Run in Supabase → SQL Editor → Run (after schema.sql). Idempotent.
-- ============================================================

-- 1) Billing -------------------------------------------------
alter table public.visits
  add column if not exists fee  integer,
  add column if not exists paid boolean not null default false;

-- Optional per-clinic default consultation fee (prefills the fee field)
alter table public.clinics
  add column if not exists default_fee integer;

-- 2) Queue control: allow a visit to be cancelled -----------
alter table public.visits drop constraint if exists visits_status_check;
alter table public.visits
  add constraint visits_status_check
  check (status in ('waiting', 'in-progress', 'completed', 'cancelled'));

-- 3) Appointments -------------------------------------------
create table if not exists public.appointments (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid not null references public.clinics(id) on delete cascade,
  patient_id  uuid references public.patients(id) on delete set null,
  name        text not null,
  phone       text,
  appt_date   date not null,
  appt_time   text,
  reason      text,
  status      text not null default 'scheduled'
              check (status in ('scheduled', 'arrived', 'done', 'cancelled')),
  visit_id    uuid references public.visits(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_appointments_clinic_date
  on public.appointments(clinic_id, appt_date);

alter table public.appointments enable row level security;

drop policy if exists "appointments_all_clinic" on public.appointments;
create policy "appointments_all_clinic" on public.appointments
  for all using (clinic_id = public.auth_clinic_id())
  with check (clinic_id = public.auth_clinic_id());

drop trigger if exists trg_appointments_updated on public.appointments;
create trigger trg_appointments_updated before update on public.appointments
  for each row execute function public.set_updated_at();
