"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  CalendarPlus,
  Users,
  Search,
  Phone,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SearchBar } from "@/components/screens/SearchBar";
import { AddPatientFab } from "@/components/screens/AddPatientFab";
import { Avatar } from "@/components/ui/avatar";
import { relativeDay } from "@/lib/utils";
import type { PatientListItem } from "@/lib/data/queries";

function meta(p: PatientListItem): string {
  return [
    p.age ? `${p.age}y` : "",
    p.gender === "M" ? "Male" : p.gender === "F" ? "Female" : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

export function PatientsClient({ patients }: { patients: PatientListItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) =>
      [p.name, p.phone, p.reason ?? ""].some((field) =>
        field.toLowerCase().includes(q),
      ),
    );
  }, [query, patients]);

  const empty = patients.length === 0;

  return (
    <AppShell>
      <TopBar title="Patients" subtitle={`${patients.length} on record`} />

      {/* Desktop breadcrumb */}
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
            Patients
          </span>
        </div>
        <Link
          href="/add-patient"
          className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-[12.5px] font-semibold text-white shadow-soft transition-all hover:brightness-110"
        >
          <CalendarPlus className="h-3.5 w-3.5" strokeWidth={2.4} />
          Add patient
        </Link>
      </div>

      <div className="hidden lg:mb-6 lg:flex lg:flex-col lg:gap-1">
        <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Clinic memory
        </span>
        <h1 className="font-display text-[36px] leading-[1.05]">Patients</h1>
        <p className="text-[13.5px] text-muted-foreground">
          Every patient your clinic has seen, most recent first.
        </p>
      </div>

      {/* Mobile search */}
      <div className="lg:hidden">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Desktop search */}
      <div className="hidden lg:mb-5 lg:block">
        <div className="flex h-11 w-full max-w-md items-center gap-2.5 rounded-xl border border-border bg-white px-3.5 transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
          <Search className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient, phone, diagnosis…"
            className="flex-1 bg-transparent text-[13.5px] placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="px-5 pb-10 pt-4 lg:px-0 lg:pt-0">
        {empty ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Users className="h-5 w-5" strokeWidth={2} />
            </div>
            <p className="text-[14px] font-semibold tracking-tight">
              No patients yet
            </p>
            <p className="max-w-[280px] text-[12.5px] text-muted-foreground">
              Register your first patient and they'll be remembered here for
              every future visit.
            </p>
            <Link
              href="/add-patient"
              className="mt-1 flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-[13px] font-semibold text-white shadow-soft transition-all hover:brightness-110"
            >
              <CalendarPlus className="h-3.5 w-3.5" strokeWidth={2.4} />
              Add patient
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center">
            <p className="text-[13px] text-muted-foreground">
              No patients match "
              <span className="font-medium text-foreground">{query}</span>"
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 lg:grid lg:grid-cols-2 lg:gap-3 xl:grid-cols-3">
            {filtered.map((p, i) => {
              const m = meta(p);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <Link
                    href={`/patient/${p.id}`}
                    className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-white p-3.5 shadow-soft transition-all hover:border-primary/30 hover:shadow-card"
                  >
                    <Avatar name={p.name} size="lg" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[14px] font-semibold tracking-tight">
                          {p.name}
                        </span>
                        {p.isNew && (
                          <span className="rounded-full bg-primary-soft px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary">
                            New
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 truncate text-[11.5px] text-muted-foreground">
                        <Phone className="h-3 w-3" strokeWidth={2} />
                        {p.phone}
                        {m ? ` · ${m}` : ""}
                      </span>
                      <span className="mt-0.5 text-[11px] text-muted-foreground/80">
                        {p.lastVisitAt
                          ? `Last seen ${relativeDay(new Date(p.lastVisitAt)).toLowerCase()}`
                          : "Not seen yet"}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AddPatientFab />
      <BottomNav />
    </AppShell>
  );
}
