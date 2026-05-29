"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  HeartPulse,
  ArrowLeft,
  LogOut,
  Building2,
  Users,
  Stethoscope,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { signOut } from "@/app/actions/auth";
import { updateClinicBilling } from "@/app/actions/admin";
import type { SubscriptionStatus } from "@/lib/database.types";

type ClinicRow = {
  id: string;
  name: string;
  doctorName: string;
  city: string;
  phone: string;
  plan: string;
  status: SubscriptionStatus;
  createdAt: string;
  patients: number;
  visits: number;
};

const PLANS = ["starter", "clinic", "pro"];
const STATUSES: SubscriptionStatus[] = [
  "trialing",
  "active",
  "past_due",
  "canceled",
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AdminClient({
  clinics,
  adminName,
}: {
  clinics: ClinicRow[];
  adminName: string;
}) {
  const { toast } = useToast();
  const [rows, setRows] = useState(clinics);
  const [pending, startTransition] = useTransition();

  const totalPatients = rows.reduce((a, c) => a + c.patients, 0);
  const totalVisits = rows.reduce((a, c) => a + c.visits, 0);
  const activeSubs = rows.filter((c) => c.status === "active").length;

  function patch(id: string, field: "plan" | "status", value: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
    startTransition(async () => {
      const res = await updateClinicBilling({
        clinicId: id,
        plan: field === "plan" ? value : undefined,
        status: field === "status" ? (value as SubscriptionStatus) : undefined,
      });
      if (res.error) toast(res.error, "warning");
      else toast("Clinic updated.", "success");
    });
  }

  return (
    <div className="min-h-dvh bg-muted/20">
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-foreground text-white">
              <HeartPulse className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </span>
            <span className="text-[15.5px] font-semibold tracking-tight">
              ClinicFlow
            </span>
            <span className="rounded-md bg-foreground px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-white">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-[12.5px] font-medium text-foreground/80 transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to app</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-medium text-foreground/70 transition-colors hover:bg-muted"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">
          Registered clinics
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Signed in as {adminName} · manage every clinic on ClinicFlow.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={Building2} label="Clinics" value={rows.length} />
          <Stat icon={Users} label="Patients" value={totalPatients} />
          <Stat icon={Stethoscope} label="Visits" value={totalVisits} />
          <Stat icon={CreditCard} label="Active subs" value={activeSubs} />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Clinic</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Patients</th>
                  <th className="px-4 py-3 font-semibold">Visits</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-[11.5px] text-muted-foreground">
                        {c.doctorName} · {c.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.city}</td>
                    <td className="px-4 py-3 num-tabular">{c.patients}</td>
                    <td className="px-4 py-3 num-tabular">{c.visits}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {fmtDate(c.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <PlanSelect
                        value={c.plan}
                        onChange={(v) => patch(c.id, "plan", v)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        value={c.status}
                        onChange={(v) => patch(c.id, "status", v)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-border lg:hidden">
            {rows.map((c) => (
              <div key={c.id} className="p-4">
                <div className="text-[14px] font-semibold tracking-tight">
                  {c.name}
                </div>
                <div className="text-[12px] text-muted-foreground">
                  {c.doctorName}
                  {c.city !== "—" ? ` · ${c.city}` : ""}
                </div>
                <div className="mt-1 text-[11.5px] text-muted-foreground">
                  {c.patients} patients · {c.visits} visits · joined{" "}
                  {fmtDate(c.createdAt)}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <PlanSelect
                    value={c.plan}
                    onChange={(v) => patch(c.id, "plan", v)}
                  />
                  <StatusSelect
                    value={c.status}
                    onChange={(v) => patch(c.id, "status", v)}
                  />
                </div>
              </div>
            ))}
          </div>

          {rows.length === 0 && (
            <div className="px-4 py-14 text-center text-[13px] text-muted-foreground">
              No clinics registered yet.
            </div>
          )}
        </div>

        <p className="mt-3 h-4 text-[12px] text-muted-foreground">
          {pending ? "Saving…" : ""}
        </p>
      </main>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <p className="mt-3 text-[24px] font-bold leading-none num-tabular">
        {value}
      </p>
      <p className="mt-1 text-[12px] text-muted-foreground">{label}</p>
    </div>
  );
}

const selectClass =
  "h-9 w-full rounded-lg border border-border bg-white px-2.5 text-[12.5px] font-medium capitalize text-foreground transition-colors focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10";

function PlanSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={selectClass}
      aria-label="Plan"
    >
      {PLANS.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: SubscriptionStatus;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={selectClass}
      aria-label="Subscription status"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
