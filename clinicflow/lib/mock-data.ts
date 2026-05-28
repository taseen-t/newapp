export type Gender = "M" | "F";

export type DiagnosisTag =
  | "Diabetes"
  | "BP Review"
  | "Post-op"
  | "Vaccination"
  | "Fever"
  | "Hypertension"
  | "Thyroid"
  | "Asthma"
  | "Cold"
  | "Cholesterol";

export type VisitStatus = "waiting" | "in-progress" | "completed";

export type Visit = {
  id: string;
  patientId: string;
  date: string; // ISO
  diagnoses: DiagnosisTag[];
  notes?: string;
  prescriptionImage?: string;
  attachments?: { name: string; type: "lab" | "image" | "report" }[];
};

export type Patient = {
  id: string;
  name: string;
  phone: string;
  age?: number;
  gender?: Gender;
  token?: number;
  slot?: string;
  status?: VisitStatus;
  reason?: string;
  isNew?: boolean;
  lastVisit?: string;
};

export type FollowUp = {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  due: string; // ISO
  tag: DiagnosisTag;
  status: "due" | "missed" | "scheduled";
  note?: string;
  daysOverdue?: number;
};

export const clinic = {
  doctorName: "Dr. Imran Khan",
  doctorTitle: "General Physician",
  clinicName: "Khan Clinic",
  city: "Lahore",
  openUntil: "8:00 PM",
};

export const patients: Patient[] = [
  {
    id: "p1",
    name: "Hassan Raza",
    phone: "+92 300 4521789",
    age: 42,
    gender: "M",
    token: 1,
    slot: "9:30 AM",
    status: "completed",
    reason: "Diabetes review",
    lastVisit: "2026-04-12",
  },
  {
    id: "p2",
    name: "Fatima Khan",
    phone: "+92 321 8765432",
    age: 56,
    gender: "F",
    token: 2,
    slot: "9:45 AM",
    status: "completed",
    reason: "BP follow-up",
    lastVisit: "2026-04-30",
  },
  {
    id: "p3",
    name: "Bilal Ahmed",
    phone: "+92 333 1122334",
    age: 8,
    gender: "M",
    token: 3,
    slot: "10:00 AM",
    status: "in-progress",
    reason: "Fever, sore throat",
    isNew: true,
  },
  {
    id: "p4",
    name: "Ayesha Iqbal",
    phone: "+92 321 9876543",
    age: 34,
    gender: "F",
    token: 4,
    slot: "10:15 AM",
    status: "waiting",
    reason: "Thyroid review",
    lastVisit: "2026-02-18",
  },
  {
    id: "p5",
    name: "Imran Sheikh",
    phone: "+92 345 6677889",
    age: 67,
    gender: "M",
    token: 5,
    slot: "10:30 AM",
    status: "waiting",
    reason: "Post-op check",
    lastVisit: "2026-05-20",
  },
  {
    id: "p6",
    name: "Zainab Malik",
    phone: "+92 312 4455667",
    age: 29,
    gender: "F",
    token: 6,
    slot: "10:45 AM",
    status: "waiting",
    reason: "Cold and cough",
    isNew: true,
  },
  {
    id: "p7",
    name: "Sana Tariq",
    phone: "+92 333 5566778",
    age: 51,
    gender: "F",
    token: 7,
    slot: "11:00 AM",
    status: "waiting",
    reason: "Cholesterol review",
    lastVisit: "2026-03-05",
  },
];

export const visits: Visit[] = [
  {
    id: "v1",
    patientId: "p3",
    date: "2026-05-28T10:00:00",
    diagnoses: ["Fever"],
    notes:
      "Mild viral fever. Hydration advised. Recheck in 3 days if no improvement.",
  },
  {
    id: "v2",
    patientId: "p3",
    date: "2026-03-14T11:20:00",
    diagnoses: ["Vaccination"],
    notes: "MMR booster administered. No adverse reaction.",
    attachments: [{ name: "Vaccine Card", type: "report" }],
  },
  {
    id: "v3",
    patientId: "p3",
    date: "2025-11-22T10:10:00",
    diagnoses: ["Cold"],
    notes: "Upper respiratory infection. Symptomatic care prescribed.",
  },
  {
    id: "v4",
    patientId: "p3",
    date: "2025-08-05T09:50:00",
    diagnoses: ["Fever"],
    notes: "Routine check-up. All vitals normal.",
  },
];

export const followUps: FollowUp[] = [
  {
    id: "f1",
    patientId: "p1",
    patientName: "Hassan Raza",
    phone: "+92 300 4521789",
    due: "2026-05-28",
    tag: "Diabetes",
    status: "due",
    note: "HbA1c review",
  },
  {
    id: "f2",
    patientId: "p2",
    patientName: "Fatima Khan",
    phone: "+92 321 8765432",
    due: "2026-05-28",
    tag: "BP Review",
    status: "due",
    note: "Monthly check-in",
  },
  {
    id: "f3",
    patientId: "p5",
    patientName: "Imran Sheikh",
    phone: "+92 345 6677889",
    due: "2026-05-27",
    tag: "Post-op",
    status: "due",
    note: "2-week post knee surgery",
  },
  {
    id: "f4",
    patientId: "p7",
    patientName: "Sana Tariq",
    phone: "+92 333 5566778",
    due: "2026-05-22",
    tag: "Cholesterol",
    status: "missed",
    daysOverdue: 6,
    note: "Lipid panel pending",
  },
  {
    id: "f5",
    patientId: "p4",
    patientName: "Ayesha Iqbal",
    phone: "+92 321 9876543",
    due: "2026-05-20",
    tag: "Thyroid",
    status: "missed",
    daysOverdue: 8,
    note: "TSH recheck",
  },
  {
    id: "f6",
    patientId: "p6",
    patientName: "Zainab Malik",
    phone: "+92 312 4455667",
    due: "2026-06-04",
    tag: "Vaccination",
    status: "scheduled",
    note: "Tdap booster",
  },
];

export const todayStats = {
  patientsToday: 7,
  pendingFollowUps: 3,
  completedVisits: 2,
  avgWaitMinutes: 8,
  newPatients: 2,
};

// 7-day visit history for sparkline
export const weeklyVisits = [4, 6, 5, 7, 8, 6, 9];

export function getPatient(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

export function getVisitsForPatient(id: string): Visit[] {
  return visits
    .filter((v) => v.patientId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
