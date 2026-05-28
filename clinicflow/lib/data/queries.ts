import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getClinicOrRedirect } from "@/lib/auth";
import type {
  ClinicRow,
  PatientRow,
  VisitRow,
  GenderDb,
} from "@/lib/database.types";

// ─────────────────────────────────────────────────────────────────────────
// App-facing shapes (mapped from DB rows so screens stay clean)
// ─────────────────────────────────────────────────────────────────────────

export type Gender = GenderDb;
export type VisitStatus = "waiting" | "in-progress" | "completed";

/** A patient's clinic-facing view of their clinic. */
export type ClinicView = {
  id: string;
  clinicName: string;
  doctorName: string;
  doctorTitle: string;
  city: string;
  openUntil: string;
  phone: string;
};

/** One row in today's queue — a visit joined with its patient. */
export type QueueEntry = {
  visitId: string;
  patientId: string;
  name: string;
  phone: string;
  age: number | null;
  gender: Gender | null;
  token: number | null;
  slot: string | null;
  status: VisitStatus;
  reason: string | null;
  isNew: boolean;
};

/** A follow-up joined with its patient, with a derived display status. */
export type FollowUpView = {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  due: string; // YYYY-MM-DD
  tag: string;
  note: string | null;
  status: "due" | "missed" | "scheduled" | "done";
  daysOverdue: number;
};

/** A single past visit, app-shaped. */
export type VisitView = {
  id: string;
  date: string; // ISO timestamp (created_at / completed_at)
  diagnoses: string[];
  notes: string | null;
  hasPrescription: boolean;
  prescriptionPath: string | null;
};

/** Everything the patient profile screen needs. */
export type PatientProfile = {
  id: string;
  name: string;
  phone: string;
  age: number | null;
  gender: Gender | null;
  reason: string | null;
  isNew: boolean;
  lastVisitAt: string | null;
  visits: VisitView[];
  diagnoses: string[];
};

export type DashboardStats = {
  patientsToday: number;
  waiting: number;
  inProgress: number;
  completed: number;
  newPatients: number;
  pendingFollowUps: number;
};

// ─────────────────────────────────────────────────────────────────────────
// Date helpers (clinic operates in Asia/Karachi, matching the DB defaults)
// ─────────────────────────────────────────────────────────────────────────

/** Today's date in the clinic's timezone, as YYYY-MM-DD. */
export function todayKarachi(): string {
  // en-CA formats as YYYY-MM-DD.
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
}

/** YYYY-MM-DD `offsetDays` from today in Asia/Karachi. */
export function dateKarachi(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
}

function diffDays(fromIso: string, toIso: string): number {
  const a = new Date(`${fromIso}T00:00:00`).getTime();
  const b = new Date(`${toIso}T00:00:00`).getTime();
  return Math.round((a - b) / 86_400_000);
}

// ─────────────────────────────────────────────────────────────────────────
// Mappers
// ─────────────────────────────────────────────────────────────────────────

function toClinicView(row: ClinicRow): ClinicView {
  return {
    id: row.id,
    clinicName: row.name,
    doctorName: row.doctor_name ?? "Doctor",
    doctorTitle: row.doctor_title ?? "",
    city: row.city ?? "",
    openUntil: row.open_until ?? "",
    phone: row.phone ?? "",
  };
}

function deriveFollowUpStatus(
  due: string,
  stored: string,
): FollowUpView["status"] {
  if (stored === "done") return "done";
  const today = todayKarachi();
  if (due < today) return "missed";
  if (due === today) return "due";
  return "scheduled";
}

// ─────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────

/** The signed-in doctor's clinic, mapped for display. Cached per request. */
export const getClinicView = cache(async (): Promise<ClinicView> => {
  const clinic = await getClinicOrRedirect();
  return toClinicView(clinic);
});

/** Today's queue: every visit dated today, joined to its patient. */
export const getTodayQueue = cache(async (): Promise<QueueEntry[]> => {
  const supabase = createClient();
  const today = todayKarachi();

  const { data: visits } = await supabase
    .from("visits")
    .select("*")
    .eq("visit_date", today)
    .order("token", { ascending: true });

  if (!visits || visits.length === 0) return [];

  const patientIds = Array.from(new Set(visits.map((v) => v.patient_id)));
  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .in("id", patientIds);

  const byId = new Map<string, PatientRow>(
    (patients ?? []).map((p) => [p.id, p]),
  );

  return visits.map((v) => {
    const p = byId.get(v.patient_id);
    return {
      visitId: v.id,
      patientId: v.patient_id,
      name: p?.name ?? "Unknown patient",
      phone: p?.phone ?? "",
      age: p?.age ?? null,
      gender: p?.gender ?? null,
      token: v.token,
      slot: v.slot,
      status: v.status,
      reason: v.reason ?? p?.reason ?? null,
      isNew: p?.is_new ?? false,
    };
  });
});

/** All open (not-done) follow-ups, joined to patients, status derived. */
export const getFollowUps = cache(async (): Promise<FollowUpView[]> => {
  const supabase = createClient();
  const today = todayKarachi();

  const { data: rows } = await supabase
    .from("follow_ups")
    .select("*")
    .neq("status", "done")
    .order("due_date", { ascending: true });

  if (!rows || rows.length === 0) return [];

  const patientIds = Array.from(new Set(rows.map((f) => f.patient_id)));
  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .in("id", patientIds);

  const byId = new Map<string, PatientRow>(
    (patients ?? []).map((p) => [p.id, p]),
  );

  return rows.map((f) => {
    const p = byId.get(f.patient_id);
    const status = deriveFollowUpStatus(f.due_date, f.status);
    return {
      id: f.id,
      patientId: f.patient_id,
      patientName: p?.name ?? "Unknown patient",
      phone: p?.phone ?? "",
      due: f.due_date,
      tag: f.tag ?? "Review",
      note: f.note,
      status,
      daysOverdue: status === "missed" ? diffDays(today, f.due_date) : 0,
    };
  });
});

/** Completed visits per day for the last 7 days (oldest → newest). */
export const getWeeklyVisits = cache(async (): Promise<number[]> => {
  const supabase = createClient();
  const start = dateKarachi(-6);

  const { data: visits } = await supabase
    .from("visits")
    .select("visit_date, status")
    .gte("visit_date", start)
    .eq("status", "completed");

  const buckets: Record<string, number> = {};
  for (let i = -6; i <= 0; i++) buckets[dateKarachi(i)] = 0;
  for (const v of visits ?? []) {
    if (v.visit_date in buckets) buckets[v.visit_date] += 1;
  }
  return Object.keys(buckets)
    .sort()
    .map((k) => buckets[k]);
});

export type PatientListItem = {
  id: string;
  name: string;
  phone: string;
  age: number | null;
  gender: Gender | null;
  reason: string | null;
  isNew: boolean;
  lastVisitAt: string | null;
};

/** All patients for this clinic, most-recently-seen first. */
export const getPatients = cache(async (): Promise<PatientListItem[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("patients")
    .select("*")
    .order("last_visit_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    phone: p.phone,
    age: p.age,
    gender: p.gender,
    reason: p.reason,
    isNew: p.is_new,
    lastVisitAt: p.last_visit_at,
  }));
});

/** Small counts for the sidebar / bottom-nav badges. */
export const getNavCounts = cache(
  async (): Promise<{ queue: number; pending: number }> => {
    const supabase = createClient();
    const today = todayKarachi();
    const [queueRes, pendingRes] = await Promise.all([
      supabase
        .from("visits")
        .select("id", { count: "exact", head: true })
        .eq("visit_date", today)
        .neq("status", "completed"),
      supabase
        .from("follow_ups")
        .select("id", { count: "exact", head: true })
        .neq("status", "done")
        .lte("due_date", today),
    ]);
    return { queue: queueRes.count ?? 0, pending: pendingRes.count ?? 0 };
  },
);

function computeStats(
  queue: QueueEntry[],
  followUps: FollowUpView[],
): DashboardStats {
  return {
    patientsToday: queue.length,
    waiting: queue.filter((q) => q.status === "waiting").length,
    inProgress: queue.filter((q) => q.status === "in-progress").length,
    completed: queue.filter((q) => q.status === "completed").length,
    newPatients: queue.filter((q) => q.isNew).length,
    pendingFollowUps: followUps.filter(
      (f) => f.status === "due" || f.status === "missed",
    ).length,
  };
}

/** Aggregate everything the home dashboard needs in one call. */
export async function getDashboard() {
  const [clinic, queue, followUps, weekly] = await Promise.all([
    getClinicView(),
    getTodayQueue(),
    getFollowUps(),
    getWeeklyVisits(),
  ]);
  return { clinic, queue, followUps, weekly, stats: computeStats(queue, followUps) };
}

/** A single patient with full visit history. Returns null if not found. */
export const getPatientProfile = cache(
  async (id: string): Promise<PatientProfile | null> => {
    const supabase = createClient();

    const { data: patient } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (!patient) return null;

    const { data: visitRows } = await supabase
      .from("visits")
      .select("*")
      .eq("patient_id", id)
      .order("visit_date", { ascending: false })
      .order("created_at", { ascending: false });

    const visits: VisitView[] = (visitRows ?? []).map((v) => ({
      id: v.id,
      date: v.completed_at ?? `${v.visit_date}T00:00:00`,
      diagnoses: v.diagnoses ?? [],
      notes: v.notes,
      hasPrescription: Boolean(v.prescription_path),
      prescriptionPath: v.prescription_path,
    }));

    const diagnoses = Array.from(
      new Set(visits.flatMap((v) => v.diagnoses)),
    );

    return {
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      reason: patient.reason,
      isNew: patient.is_new,
      lastVisitAt: patient.last_visit_at,
      visits,
      diagnoses,
    };
  },
);

export type ActiveVisit = {
  visit: {
    id: string;
    status: VisitStatus;
    token: number | null;
    reason: string | null;
    diagnoses: string[];
    notes: string | null;
    hasPrescription: boolean;
  };
  patient: {
    id: string;
    name: string;
    phone: string;
    age: number | null;
    gender: Gender | null;
  };
  visitNumber: number;
  lastVisitAt: string | null;
};

/** Load a single visit by id, with its patient and visit-count context. */
export const getActiveVisit = cache(
  async (visitId: string): Promise<ActiveVisit | null> => {
    const supabase = createClient();

    const { data: visit } = await supabase
      .from("visits")
      .select("*")
      .eq("id", visitId)
      .single();

    if (!visit) return null;

    const { data: patient } = await supabase
      .from("patients")
      .select("*")
      .eq("id", visit.patient_id)
      .single();

    if (!patient) return null;

    const { count } = await supabase
      .from("visits")
      .select("id", { count: "exact", head: true })
      .eq("patient_id", patient.id);

    return {
      visit: {
        id: visit.id,
        status: visit.status,
        token: visit.token,
        reason: visit.reason,
        diagnoses: visit.diagnoses ?? [],
        notes: visit.notes,
        hasPrescription: Boolean(visit.prescription_path),
      },
      patient: {
        id: patient.id,
        name: patient.name,
        phone: patient.phone,
        age: patient.age,
        gender: patient.gender,
      },
      visitNumber: count ?? 1,
      lastVisitAt: patient.last_visit_at,
    };
  },
);
