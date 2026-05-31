"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import {
  CalendarPlus,
  CalendarDays,
  Clock,
  Check,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Field, Input } from "@/components/ui/input";
import { SubmitButton, FormBanner } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import type { AppointmentView } from "@/lib/data/queries";
import {
  bookAppointment,
  markAppointmentArrived,
  cancelAppointment,
  type BookApptState,
} from "@/app/actions/appointments";

type PatientLite = { id: string; name: string; phone: string };

const initial: BookApptState = {};

function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
}

function dateLabel(iso: string) {
  const today = todayISO();
  const tomorrow = new Date(`${today}T00:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tISO = tomorrow.toLocaleDateString("en-CA");
  if (iso === today) return "Today";
  if (iso === tISO) return "Tomorrow";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function AppointmentsClient({
  appointments,
  patients,
}: {
  appointments: AppointmentView[];
  patients: PatientLite[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, action] = useFormState(bookAppointment, initial);
  const [showForm, setShowForm] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startAction] = useTransition();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    if (state.ok) {
      toast("Appointment booked.", "success");
      setShowForm(false);
      setName("");
      setPhone("");
      setPatientId("");
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  function pickPatient(id: string) {
    setPatientId(id);
    const p = patients.find((x) => x.id === id);
    if (p) {
      setName(p.name);
      setPhone(p.phone);
    }
  }

  function arrived(id: string, who: string) {
    setBusyId(id);
    startAction(async () => {
      const res = await markAppointmentArrived(id);
      setBusyId(null);
      if (res.error) {
        toast(res.error, "warning");
      } else {
        toast(`${who} added to today's queue.`, "success");
        router.refresh();
      }
    });
  }

  function cancel(id: string) {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Cancel this appointment?")
    ) {
      return;
    }
    setBusyId(id);
    startAction(async () => {
      const res = await cancelAppointment(id);
      setBusyId(null);
      if (res.error) {
        toast(res.error, "warning");
      } else {
        toast("Appointment cancelled.", "info");
        router.refresh();
      }
    });
  }

  const groups: { date: string; items: AppointmentView[] }[] = [];
  for (const a of appointments) {
    const g = groups.find((x) => x.date === a.date);
    if (g) g.items.push(a);
    else groups.push({ date: a.date, items: [a] });
  }

  return (
    <AppShell>
      <TopBar title="Appointments" subtitle={`${appointments.length} upcoming`} />

      {/* Desktop breadcrumb + action */}
      <div className="-mx-10 mb-7 hidden border-b border-border px-10 pb-4 lg:flex lg:items-center lg:justify-between xl:-mx-14 xl:px-14">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-[12.5px] font-medium text-foreground">
            Appointments
          </span>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-[12.5px] font-semibold text-white shadow-soft transition-all hover:brightness-110"
        >
          <CalendarPlus className="h-3.5 w-3.5" strokeWidth={2.4} />
          Book appointment
        </button>
      </div>

      <div className="hidden lg:mb-6 lg:block">
        <h1 className="font-display text-[36px] leading-[1.05]">Appointments</h1>
        <p className="text-[13.5px] text-muted-foreground">
          Book ahead and check patients in — arrivals drop straight into today&apos;s
          queue.
        </p>
      </div>

      <div className="px-5 pb-12 pt-2 lg:max-w-2xl lg:px-0 lg:pt-0">
        {/* Mobile book button */}
        <button
          onClick={() => setShowForm((s) => !s)}
          className="mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[14px] font-semibold text-white shadow-soft transition-all hover:brightness-110 lg:hidden"
        >
          <CalendarPlus className="h-4 w-4" strokeWidth={2.4} />
          Book appointment
        </button>

        {/* Booking form */}
        {showForm && (
          <form
            action={action}
            className="mb-6 flex flex-col gap-4 rounded-3xl border border-border bg-white p-5 shadow-soft"
          >
            <input type="hidden" name="patientId" value={patientId} />

            {patients.length > 0 && (
              <Field label="Existing patient" optional>
                <select
                  value={patientId}
                  onChange={(e) => pickPatient(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-white px-3 text-[15px] text-foreground transition-all focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">New patient…</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.phone}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Patient name"
                  required
                />
              </Field>
              <Field label="Phone" optional>
                <Input
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Date">
                <Input name="date" type="date" defaultValue={todayISO()} required />
              </Field>
              <Field label="Time" optional>
                <Input name="time" placeholder="4:30 PM" />
              </Field>
            </div>

            <Field label="Reason" optional>
              <Input name="reason" placeholder="e.g. Follow-up, fever" />
            </Field>

            {state.error ? <FormBanner error={state.error} /> : null}

            <SubmitButton>Book appointment</SubmitButton>
          </form>
        )}

        {/* List grouped by date */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <CalendarDays className="h-5 w-5" strokeWidth={2} />
            </span>
            <p className="text-[14px] font-semibold tracking-tight">
              No upcoming appointments
            </p>
            <p className="max-w-[280px] text-[12.5px] text-muted-foreground">
              Book one above — when the patient arrives, tap “Arrived” and they
              join today&apos;s queue automatically.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map((g) => (
              <div key={g.date}>
                <h3 className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {dateLabel(g.date)}
                </h3>
                <div className="flex flex-col gap-2.5">
                  {g.items.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-white py-2.5 pl-3 pr-2.5"
                    >
                      <Avatar name={a.name} size="md" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[14px] font-semibold tracking-tight">
                          {a.name}
                        </span>
                        <span className="flex items-center gap-2 truncate text-[11.5px] text-muted-foreground">
                          {a.time && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {a.time}
                            </span>
                          )}
                          {a.reason}
                        </span>
                      </div>

                      {a.status === "arrived" ? (
                        <span className="shrink-0 rounded-md bg-success-soft px-2 py-1 text-[10.5px] font-semibold text-success">
                          In queue
                        </span>
                      ) : (
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            onClick={() => arrived(a.id, a.name)}
                            disabled={busyId === a.id}
                            className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-[12px] font-semibold text-white shadow-soft transition-all hover:brightness-110 disabled:opacity-60"
                          >
                            {busyId === a.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                            )}
                            Arrived
                          </button>
                          <button
                            onClick={() => cancel(a.id)}
                            disabled={busyId === a.id}
                            aria-label="Cancel appointment"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-60"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </AppShell>
  );
}
