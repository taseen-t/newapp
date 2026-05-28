"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Phone,
  CalendarPlus,
  FileText,
  Image as ImageIcon,
  Pill,
  ChevronRight,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section";
import { getPatient, getVisitsForPatient } from "@/lib/mock-data";
import { relativeDay } from "@/lib/utils";

export default function PatientProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const patient = getPatient(params.id) ?? getPatient("p3")!;
  const visits = getVisitsForPatient(patient.id);

  const diagnoses = Array.from(
    new Set(visits.flatMap((v) => v.diagnoses)),
  );

  return (
    <AppShell>
      <TopBar title="Patient" />

      <div className="px-5 pt-2">
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary-soft/60 via-white to-accent-soft/40 p-5"
        >
          <div className="flex items-start gap-3.5">
            <Avatar name={patient.name} size="xl" ring />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-[19px] font-semibold tracking-tight leading-tight">
                {patient.name}
              </span>
              <span className="text-[12.5px] text-muted-foreground">
                {patient.age ? `${patient.age}y` : ""}
                {patient.age && patient.gender ? " · " : ""}
                {patient.gender === "M" ? "Male" : patient.gender === "F" ? "Female" : ""}
              </span>
              <span className="mt-0.5 text-[12px] font-medium tabular-nums text-foreground/70">
                {patient.phone}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <a
              href={`tel:${patient.phone.replace(/\s/g, "")}`}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white py-3 shadow-soft transition-all hover:shadow-card active:scale-[0.98]"
            >
              <Phone className="h-4 w-4 text-foreground/70" strokeWidth={2.2} />
              <span className="text-[11px] font-medium">Call</span>
            </a>
            <button className="flex flex-col items-center gap-1 rounded-2xl bg-whatsapp py-3 text-white shadow-soft transition-all hover:brightness-110 active:scale-[0.98]">
              <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
              <span className="text-[11px] font-medium">WhatsApp</span>
            </button>
            <button className="flex flex-col items-center gap-1 rounded-2xl bg-white py-3 shadow-soft transition-all hover:shadow-card active:scale-[0.98]">
              <CalendarPlus
                className="h-4 w-4 text-foreground/70"
                strokeWidth={2.2}
              />
              <span className="text-[11px] font-medium">Follow-up</span>
            </button>
          </div>

          {/* Memory summary */}
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border/60 bg-white/80 p-3.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11.5px] font-semibold uppercase tracking-wide text-primary">
                Clinic memory
              </span>
              <p className="text-[12.5px] leading-relaxed text-foreground/80">
                Recurring fevers in monsoon. Penicillin allergy (mild). Mother prefers
                evening slots. Last seen for MMR booster.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Diagnosis chips */}
        <section className="mt-6">
          <SectionHeader
            title="Conditions"
            description="Across all visits"
            className="px-1"
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {diagnoses.map((d) => (
              <Badge key={d} tone="primary">
                {d}
              </Badge>
            ))}
            <Badge tone="warning">Penicillin allergy</Badge>
          </div>
        </section>

        {/* Prescription thumbnails */}
        <section className="mt-6">
          <SectionHeader
            title="Prescriptions"
            description={`${visits.length} captured`}
            action={
              <button className="text-[12px] font-medium text-primary">
                View all
              </button>
            }
            className="px-1"
          />
          <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
            {visits.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="relative h-32 w-24 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-amber-50 to-rose-50 shadow-soft"
              >
                <div className="flex h-full flex-col gap-1 p-2.5 text-[8px] italic text-foreground/40">
                  <span className="font-serif text-base not-italic tracking-wide">
                    Rx
                  </span>
                  <span className="h-px w-12 bg-foreground/15" />
                  <span>1. Med A</span>
                  <span>2. Med B</span>
                  <span>3. Rest</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-1.5">
                  <span className="text-[9px] font-medium text-white">
                    {relativeDay(new Date(v.date))}
                  </span>
                </div>
              </motion.div>
            ))}
            <button className="flex h-32 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
              <Pill className="h-4 w-4" strokeWidth={2} />
              <span className="text-[10px] font-medium">View all</span>
            </button>
          </div>
        </section>

        {/* Attachments */}
        <section className="mt-6">
          <SectionHeader
            title="Lab reports & files"
            description="2 attachments"
            className="px-1"
          />
          <div className="mt-3 flex flex-col gap-2">
            {[
              { name: "CBC & LFT report", date: "2026-03-14", icon: FlaskConical },
              { name: "Vaccine card", date: "2025-11-22", icon: FileText },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-white p-3 shadow-soft transition-all hover:border-primary/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon className="h-4 w-4" strokeWidth={2.2} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[13px] font-semibold tracking-tight">
                      {a.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {relativeDay(new Date(a.date))}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Visit timeline */}
        <section className="mt-6 pb-10">
          <SectionHeader
            title="Visit timeline"
            description={`${visits.length} visits in history`}
            className="px-1"
          />
          <div className="relative mt-4 pl-7">
            <span className="absolute left-2.5 top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-border to-border" />
            <div className="flex flex-col gap-5">
              {visits.map((v, i) => {
                const isFirst = i === 0;
                return (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="relative"
                  >
                    <span
                      className={`absolute -left-[26px] top-2 flex h-4 w-4 items-center justify-center rounded-full border-[3px] ${
                        isFirst
                          ? "border-primary bg-white"
                          : "border-white bg-border"
                      } shadow-soft`}
                    >
                      {isFirst && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </span>
                    <div className="rounded-2xl border border-border/70 bg-white p-3.5 shadow-soft">
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-medium text-muted-foreground">
                          {new Date(v.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {isFirst && (
                          <Badge tone="primary" className="text-[9.5px] uppercase">
                            Latest
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {v.diagnoses.map((d) => (
                          <span
                            key={d}
                            className="rounded-full bg-primary-soft px-1.5 py-0.5 text-[10.5px] font-medium text-primary"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                      {v.notes && (
                        <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground/80">
                          {v.notes}
                        </p>
                      )}
                      <div className="mt-2.5 flex items-center gap-3 border-t border-border/50 pt-2 text-[10.5px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Rx photo
                        </span>
                        {v.attachments?.map((a) => (
                          <span key={a.name} className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </AppShell>
  );
}
