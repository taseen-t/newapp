"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Mic,
  Square,
  Check,
  Plus,
  X,
  Sparkles,
  ImageIcon,
  ScanLine,
  Pill,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { getPatient } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SUGGESTED_DIAGNOSES = [
  "Fever",
  "URTI",
  "Diabetes",
  "BP Review",
  "Cough",
  "Headache",
];

export default function ActiveVisitPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const patient = getPatient(params.id) ?? getPatient("p3")!;

  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>(["Fever"]);
  const [tagInput, setTagInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [hasPrescription, setHasPrescription] = useState(false);

  function toggleTag(t: string) {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function addTagFromInput() {
    const v = tagInput.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags([...tags, v]);
    setTagInput("");
  }

  function toggleRecord() {
    setRecording((r) => !r);
    if (!recording) {
      const start = Date.now();
      const id = window.setInterval(() => {
        setVoiceSeconds(Math.floor((Date.now() - start) / 1000));
      }, 200);
      (window as unknown as { __vid: number }).__vid = id;
    } else {
      window.clearInterval((window as unknown as { __vid: number }).__vid);
    }
  }

  return (
    <AppShell withNav={false}>
      <TopBar
        title={`Visit · Token ${patient.token ?? 3}`}
        subtitle="In progress"
      />

      <div className="px-5 pb-8 pt-3">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary-soft/70 via-white to-accent-soft/40 p-4"
        >
          <div className="flex items-center gap-3.5">
            <Avatar name={patient.name} size="lg" ring />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[16px] font-semibold tracking-tight">
                {patient.name}
              </span>
              <span className="truncate text-[12px] text-muted-foreground">
                {patient.age ? `${patient.age}y` : ""}
                {patient.age && patient.gender ? " · " : ""}
                {patient.gender === "M" ? "Male" : patient.gender === "F" ? "Female" : ""}
                {" · "}
                {patient.phone}
              </span>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-semibold uppercase text-primary shadow-soft">
              <span className="h-1.5 w-1.5 animate-ping-soft rounded-full bg-primary" />
              <span className="-ml-0.5">Live</span>
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3 border-t border-white pt-3 text-[11.5px]">
            <span className="flex items-center gap-1 text-muted-foreground">
              Visit no.
              <span className="font-semibold text-foreground/80">5</span>
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              Last visit
              <span className="font-semibold text-foreground/80">2 mo ago</span>
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              Reason
              <span className="font-semibold text-foreground/80">Fever</span>
            </span>
          </div>
        </motion.div>

        {/* Quick notes */}
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between px-1">
            <h3 className="text-[13.5px] font-semibold tracking-tight">
              Quick notes
            </h3>
            <span className="text-[11px] text-muted-foreground">
              Optional · keep it short
            </span>
          </div>
          <Textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Patient reports headache, light-headedness since 2 days…"
            className="bg-muted/30"
          />
        </section>

        {/* Diagnosis tags */}
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between px-1">
            <h3 className="text-[13.5px] font-semibold tracking-tight">
              Diagnosis
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {tags.length} tagged
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-white p-3">
            {tags.map((t) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[12px] font-medium text-primary"
              >
                {t}
                <button
                  onClick={() => toggleTag(t)}
                  className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-primary/70 hover:bg-primary/10"
                  aria-label={`Remove ${t}`}
                >
                  <X className="h-2.5 w-2.5" strokeWidth={3} />
                </button>
              </motion.span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTagFromInput();
                }
              }}
              className="flex-1 min-w-[100px] bg-transparent text-[12.5px] placeholder:text-muted-foreground focus:outline-none"
              placeholder="Add diagnosis…"
            />
          </div>
          <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto px-1">
            {SUGGESTED_DIAGNOSES.filter((s) => !tags.includes(s)).map((s) => (
              <button
                key={s}
                onClick={() => toggleTag(s)}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 text-[11.5px] text-foreground/70 transition-colors hover:border-primary/30 hover:bg-primary-soft hover:text-primary"
              >
                <Plus className="h-2.5 w-2.5" strokeWidth={2.5} />
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Voice note */}
        <section className="mt-6">
          <button
            onClick={toggleRecord}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border p-3.5 transition-all",
              recording
                ? "border-danger/30 bg-danger-soft/40"
                : "border-border/70 bg-white hover:bg-muted",
            )}
          >
            <div
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-2xl transition-colors",
                recording ? "bg-danger text-white" : "bg-primary-soft text-primary",
              )}
            >
              {recording ? (
                <Square className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              ) : (
                <Mic className="h-[18px] w-[18px]" strokeWidth={2.2} />
              )}
              {recording && (
                <span className="absolute inset-0 animate-ping-soft rounded-2xl bg-danger/40" />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start text-left">
              <span className="text-[13.5px] font-semibold tracking-tight">
                {recording ? "Recording voice note" : "Add voice note"}
              </span>
              <span className="text-[11.5px] text-muted-foreground">
                {recording
                  ? `${String(Math.floor(voiceSeconds / 60)).padStart(2, "0")}:${String(voiceSeconds % 60).padStart(2, "0")} · tap to stop`
                  : "Useful for verbal advice you gave the patient"}
              </span>
            </div>
            {recording && (
              <div className="flex items-center gap-1">
                {[3, 5, 4, 6, 3].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{ scaleY: [0.6, 1.2, 0.7, 1.4, 0.8] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.08,
                    }}
                    className="block w-[3px] rounded-full bg-danger"
                    style={{ height: h * 4 }}
                  />
                ))}
              </div>
            )}
          </button>
        </section>

        {/* PRESCRIPTION — visual focus */}
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between px-1">
            <h3 className="text-[13.5px] font-semibold tracking-tight">
              Capture prescription
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
              <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
              The important one
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!hasPrescription ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative overflow-hidden rounded-3xl border border-dashed border-primary/30 bg-gradient-to-br from-primary-soft/40 via-white to-accent-soft/30 p-6"
              >
                <div className="absolute inset-0 bg-grid opacity-[0.35]" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-card"
                    >
                      <ScanLine
                        className="h-9 w-9 text-primary"
                        strokeWidth={1.7}
                      />
                    </motion.div>
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-soft">
                      <Pill className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                  </div>
                  <h4 className="mt-4 text-[17px] font-semibold tracking-tight">
                    Snap the handwritten Rx
                  </h4>
                  <p className="mt-1 max-w-[260px] text-[12.5px] leading-relaxed text-muted-foreground">
                    Doctor writes by hand as always. We just save the photo and
                    link it to this visit.
                  </p>
                  <div className="mt-5 flex w-full max-w-[300px] flex-col gap-2.5">
                    <button
                      onClick={() => setHasPrescription(true)}
                      className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-[14px] font-semibold text-white shadow-float transition-all hover:brightness-105 active:scale-[0.98]"
                    >
                      <Camera className="h-[18px] w-[18px]" strokeWidth={2.2} />
                      Capture photo
                    </button>
                    <button
                      onClick={() => setHasPrescription(true)}
                      className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-white text-[13px] font-semibold text-foreground/80 transition-colors hover:bg-muted"
                    >
                      <Upload className="h-4 w-4" strokeWidth={2.2} />
                      Upload from gallery
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="filled"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-3xl border border-border/70 bg-white p-3"
              >
                <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col gap-1.5 px-6 font-[var(--font-inter)] text-sm italic text-foreground/40">
                      <span className="font-serif text-2xl tracking-wide">Rx</span>
                      <span className="h-px w-32 bg-foreground/15" />
                      <span>1. Tab. Paracetamol 500mg</span>
                      <span className="text-foreground/30">  ½–1 tab SOS</span>
                      <span>2. Plenty of fluids</span>
                      <span>3. Review in 3 days</span>
                    </div>
                  </div>
                  <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-success shadow-soft">
                    <Check className="h-4 w-4" strokeWidth={2.6} />
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Rx_05282026.jpg · 1.2 MB
                  </div>
                  <button
                    onClick={() => setHasPrescription(false)}
                    className="text-[12px] font-medium text-danger"
                  >
                    Retake
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-border/60 bg-white/90 px-5 py-4 backdrop-blur-md">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/patient/${patient.id}`)}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-foreground text-[15px] font-semibold text-white shadow-float transition-all hover:brightness-110"
        >
          <Check className="h-4 w-4" strokeWidth={2.6} />
          Complete visit
        </motion.button>
      </div>
    </AppShell>
  );
}
