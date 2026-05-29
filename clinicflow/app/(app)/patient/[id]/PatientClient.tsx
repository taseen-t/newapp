"use client";

import Link from "next/link";
import { useTransition } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Phone,
  CalendarPlus,
  Image as ImageIcon,
  Pill,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { SectionHeader } from "@/components/ui/section";
import { useClinic } from "@/components/providers/ClinicProvider";
import { openExternal, telUrl, whatsappUrl } from "@/lib/contact";
import { relativeDay } from "@/lib/utils";
import type { PatientProfile } from "@/lib/data/queries";
import { scheduleFollowUp } from "@/app/actions/followups";

function genderLabel(gender: PatientProfile["gender"]): string {
  return gender === "M" ? "Male" : gender === "F" ? "Female" : "";
}

export function PatientClient({ patient }: { patient: PatientProfile }) {
  const { toast } = useToast();
  const clinic = useClinic();
  const [scheduling, startScheduling] = useTransition();

  const { visits, diagnoses } = patient;
  const ageGender = [
    patient.age ? `${patient.age}y` : "",
    genderLabel(patient.gender),
  ]
    .filter(Boolean)
    .join(" · ");
  const lastSeen = patient.lastVisitAt
    ? relativeDay(new Date(patient.lastVisitAt))
    : null;
  const rxVisits = visits.filter((v) => v.hasPrescription);

  const memory = (() => {
    if (visits.length === 0) {
      return "No visits recorded yet. This patient was just registered.";
    }
    const parts = [
      `${visits.length} visit${visits.length === 1 ? "" : "s"} on record.`,
    ];
    if (lastSeen) parts.push(`Last seen ${lastSeen.toLowerCase()}.`);
    if (diagnoses.length > 0) {
      parts.push(`Recurring: ${diagnoses.slice(0, 3).join(", ")}.`);
    }
    return parts.join(" ");
  })();

  function openWhatsApp() {
    const first = patient.name.split(" ")[0];
    const message = `Assalam-o-Alaikum ${first}, this is from ${clinic.clinicName}. Following up on your recent visit — please let me know how you're feeling. — ${clinic.doctorName}`;
    openExternal(whatsappUrl(patient.phone, message));
    toast(`WhatsApp opened for ${patient.name}`, "success");
  }

  function onScheduleFollowUp() {
    startScheduling(async () => {
      const res = await scheduleFollowUp({ patientId: patient.id });
      if (res.error || !res.due) {
        toast(res.error ?? "Could not schedule the follow-up.", "warning");
        return;
      }
      const when = new Date(res.due).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "long",
      });
      toast(`Follow-up set for ${patient.name} on ${when}.`, "success");
    });
  }

  return (
    <AppShell>
      <TopBar title="Patient" />

      {/* Desktop breadcrumb */}
      <div className="-mx-10 mb-7 hidden border-b border-border px-10 pb-4 lg:flex lg:items-center lg:gap-2 xl:-mx-14 xl:px-14">
        <Link
          href="/dashboard"
          className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <Link
          href="/patients"
          className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Patients
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className="text-[12.5px] font-medium text-foreground">
          {patient.name}
        </span>
      </div>

      <div className="hidden lg:mb-7 lg:flex lg:items-end lg:justify-between lg:gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Patient memory · {visits.length} visit{visits.length === 1 ? "" : "s"}
          </span>
          <h1 className="font-display text-[36px] leading-[1.05]">
            {patient.name}
          </h1>
          <p className="text-[13.5px] text-muted-foreground">
            {ageGender}
            {ageGender && lastSeen ? " · " : ""}
            {lastSeen ? `Last seen ${lastSeen.toLowerCase()}` : "First-time patient"}
          </p>
        </div>
      </div>

      <div className="px-5 pt-2 lg:grid lg:grid-cols-[360px_1fr] lg:items-start lg:gap-8 lg:px-0 lg:pt-0">
        {/* Hero card — sticky on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-6 lg:sticky lg:top-6"
        >
          <div className="flex flex-col items-start gap-4 lg:items-center lg:text-center">
            <Avatar
              name={patient.name}
              size="xl"
              ring
              className="h-20 w-20 text-lg"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1 lg:items-center">
              <h2 className="font-display text-[26px] leading-tight text-foreground lg:text-[28px]">
                {patient.name}
              </h2>
              <span className="text-[12.5px] text-muted-foreground">
                {ageGender || "Details not recorded"}
              </span>
              <span className="mt-0.5 text-[12px] font-medium tabular-nums text-foreground/70">
                {patient.phone}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <a
              href={telUrl(patient.phone)}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white py-3 shadow-soft transition-all hover:shadow-card active:scale-[0.98]"
            >
              <Phone className="h-4 w-4 text-foreground/70" strokeWidth={2.2} />
              <span className="text-[11px] font-medium">Call</span>
            </a>
            <button
              onClick={openWhatsApp}
              className="flex flex-col items-center gap-1 rounded-2xl bg-whatsapp py-3 text-white shadow-soft transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
              <span className="text-[11px] font-medium">WhatsApp</span>
            </button>
            <button
              onClick={onScheduleFollowUp}
              disabled={scheduling}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white py-3 shadow-soft transition-all hover:shadow-card active:scale-[0.98] disabled:opacity-60"
            >
              {scheduling ? (
                <Loader2
                  className="h-4 w-4 animate-spin text-foreground/70"
                  strokeWidth={2.2}
                />
              ) : (
                <CalendarPlus
                  className="h-4 w-4 text-foreground/70"
                  strokeWidth={2.2}
                />
              )}
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
                {memory}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="lg:flex lg:flex-col">
          {/* Diagnosis chips */}
          <section className="mt-6 lg:mt-0">
            <SectionHeader
              title="Conditions"
              description="Across all visits"
              className="px-1"
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {diagnoses.length > 0 ? (
                diagnoses.map((d) => (
                  <Badge key={d} tone="primary">
                    {d}
                  </Badge>
                ))
              ) : (
                <p className="text-[12.5px] text-muted-foreground">
                  No conditions recorded yet.
                </p>
              )}
            </div>
          </section>

          {/* Prescription thumbnails */}
          <section className="mt-6">
            <SectionHeader
              title="Prescriptions"
              description={`${rxVisits.length} captured`}
              className="px-1"
            />
            {rxVisits.length > 0 ? (
              <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
                {rxVisits.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="relative flex h-32 w-24 shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary-soft/50 to-accent-soft/40 shadow-soft"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-soft">
                      <Pill className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-1.5">
                      <span className="text-[9px] font-medium text-white">
                        {relativeDay(new Date(v.date))}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex flex-col items-center gap-1.5 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-8 text-center">
                <Pill className="h-5 w-5 text-muted-foreground" strokeWidth={1.8} />
                <p className="text-[12.5px] text-muted-foreground">
                  No prescriptions captured yet.
                </p>
              </div>
            )}
          </section>

          {/* Visit timeline */}
          <section className="mt-6 pb-10">
            <SectionHeader
              title="Visit timeline"
              description={`${visits.length} visit${visits.length === 1 ? "" : "s"} in history`}
              className="px-1"
            />
            {visits.length > 0 ? (
              <div className="relative mt-4 pl-7">
                <span className="absolute bottom-2 left-2.5 top-2 w-px bg-gradient-to-b from-primary/60 via-border to-border" />
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
                              {new Date(v.date).toLocaleDateString("en-PK", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            {isFirst && (
                              <Badge
                                tone="primary"
                                className="text-[9.5px] uppercase"
                              >
                                Latest
                              </Badge>
                            )}
                          </div>
                          {v.diagnoses.length > 0 && (
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
                          )}
                          {v.notes && (
                            <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground/80">
                              {v.notes}
                            </p>
                          )}
                          {v.hasPrescription && (
                            <div className="mt-2.5 flex items-center gap-3 border-t border-border/50 pt-2 text-[10.5px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" />
                                Rx photo
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center gap-1.5 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
                <p className="text-[13px] font-semibold tracking-tight">
                  No visits yet
                </p>
                <p className="max-w-[260px] text-[12.5px] text-muted-foreground">
                  Once you complete a visit, it will appear here as part of this
                  patient's history.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      <BottomNav />
    </AppShell>
  );
}
