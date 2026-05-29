// Hand-maintained to mirror supabase/schema.sql.
// (Regenerate later with: supabase gen types typescript --project-id <ref>)

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";
export type VisitStatusDb = "waiting" | "in-progress" | "completed";
export type FollowUpStatusDb = "scheduled" | "due" | "missed" | "done";
export type GenderDb = "M" | "F";

export interface ClinicRow {
  id: string;
  name: string;
  city: string | null;
  doctor_name: string | null;
  doctor_title: string | null;
  phone: string | null;
  open_until: string | null;
  plan: string;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileRow {
  id: string;
  clinic_id: string | null;
  full_name: string | null;
  role: "doctor" | "staff";
  is_admin: boolean;
  created_at: string;
}

export interface PatientRow {
  id: string;
  clinic_id: string;
  name: string;
  phone: string;
  age: number | null;
  gender: GenderDb | null;
  reason: string | null;
  is_new: boolean;
  last_visit_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisitRow {
  id: string;
  clinic_id: string;
  patient_id: string;
  visit_date: string;
  status: VisitStatusDb;
  token: number | null;
  slot: string | null;
  reason: string | null;
  diagnoses: string[];
  notes: string | null;
  prescription_path: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FollowUpRow {
  id: string;
  clinic_id: string;
  patient_id: string;
  visit_id: string | null;
  due_date: string;
  tag: string | null;
  note: string | null;
  status: FollowUpStatusDb;
  created_at: string;
  updated_at: string;
}

type Insertable<T, Optional extends keyof T> = Omit<T, Optional> &
  Partial<Pick<T, Optional>>;

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: ClinicRow;
        Insert: Insertable<
          ClinicRow,
          | "id"
          | "city"
          | "doctor_name"
          | "doctor_title"
          | "phone"
          | "open_until"
          | "plan"
          | "subscription_status"
          | "trial_ends_at"
          | "created_at"
          | "updated_at"
        >;
        Update: Partial<ClinicRow>;
      };
      profiles: {
        Row: ProfileRow;
        Insert: Insertable<ProfileRow, "clinic_id" | "full_name" | "role" | "is_admin" | "created_at">;
        Update: Partial<ProfileRow>;
      };
      patients: {
        Row: PatientRow;
        Insert: Insertable<
          PatientRow,
          | "id"
          | "age"
          | "gender"
          | "reason"
          | "is_new"
          | "last_visit_at"
          | "created_at"
          | "updated_at"
        >;
        Update: Partial<PatientRow>;
      };
      visits: {
        Row: VisitRow;
        Insert: Insertable<
          VisitRow,
          | "id"
          | "visit_date"
          | "status"
          | "token"
          | "slot"
          | "reason"
          | "diagnoses"
          | "notes"
          | "prescription_path"
          | "started_at"
          | "completed_at"
          | "created_at"
          | "updated_at"
        >;
        Update: Partial<VisitRow>;
      };
      follow_ups: {
        Row: FollowUpRow;
        Insert: Insertable<
          FollowUpRow,
          | "id"
          | "visit_id"
          | "tag"
          | "note"
          | "status"
          | "created_at"
          | "updated_at"
        >;
        Update: Partial<FollowUpRow>;
      };
    };
    Functions: {
      auth_clinic_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      create_clinic: {
        Args: {
          p_name: string;
          p_city?: string | null;
          p_doctor_name?: string | null;
          p_doctor_title?: string | null;
          p_phone?: string | null;
          p_open_until?: string | null;
        };
        Returns: ClinicRow;
      };
      is_platform_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Views: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
