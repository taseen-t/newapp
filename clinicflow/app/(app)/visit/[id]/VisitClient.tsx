"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
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
  ChevronRight,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { cn, relativeDay } from "@/lib/utils";
import type { ActiveVisit } from "@/lib/data/queries";
import { startVisit, completeVisit, uploadPrescription } from "@/app/actions/visits";

const SUGGESTED_DIAGNOSES = [
  "Fever",
  "URTI",
  "Diabetes",
  "BP Review",
  "Cough",
  "Headache",
];

const STATUS_LABEL: Record<ActiveVisit["visit"]["status"], string> = {
  waiting: "Waiting",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function VisitClient({ active }: { active: ActiveVisit }) {
  const { visit, patient, visitNumber, lastVisitAt } = active;
  const router = useRouter();
  const { toast } = useToast();

  const [notes, setNotes] = useState(visit.notes ?? "");
  const [tags, setTags] = useState<string[]>(visit.diagnoses);
  const [tagInput, setTagInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [hasPrescription, setHasPrescription] = useState(visit.hasPrescription);
  const [rxName, setRxName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [completing, startCompleting] = useTransition();
  const [fee, setFee] = useState(visit.fee != null ? String(visit.fee) : "");
  const [paid, setPaid] = useState(visit.paid);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  // When the doctor opens a waiting visit, move it to in-progress.
  useEffect(() => {
    if (visit.status === "waiting") {
      startVisit(visit.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function onFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("visitId", visit.id);
    const res = await uploadPrescription(fd);
    setUploading(false);
    if (res.error) {
      toast(res.error, "warning");
      return;
    }
    setRxName(file.name);
    setHasPrescription(true);
    toast("Prescription saved to this visit.", "success");
  }

  function onComplete() {
    startCompleting(async () => {
      const feeNum = fee.trim() ? Number(fee) : null;
      const res = await completeVisit({
        visitId: visit.id,
        diagnoses: tags,
        notes,
        fee: feeNum != null && Number.isFinite(feeNum) ? Math.round(feeNum) : null,
        paid,
      });
      if (res.error || !res.patientId) {
        toast(res.error ?? "Could not complete the visit.", "warning");
        return;
      }
      toast(`Visit saved for ${patient.name}.`, "success");
      router.push(`/patient/${res.patientId}`);
    });
  }

  const ageGender = [
    patient.age ? `${patient.age}y` : "",
    patient.gender === "M" ? "Male" : patient.gender === "F" ? "Female" : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <AppShell withNav={false}>
      <TopBar
        title={`Visit · Token ${visit.token ?? "—"}`}
        subtitle={STATUS_LABEL[visit.status]}
      />

      {/* Desktop breadcrumb bar */}
      <div className="-mx-10 mb-7 hidden border-b border-border px-10 pb-4 lg:flex lg:items-center lg:gap-2 xl:-mx-14 xl:px-14">
        <Link
          href="/dashboard"
          className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <Link
          href="/dashboard"
          className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Today's queue
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className="text-[12.5px] font-medium text-foreground">
          {patient.name}
        </span>
      </div>

      <div className="hidden lg:mb-6 lg:flex lg:items-end lg:justify-between lg:gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Token {visit.token ?? "—"} · {STATUS_LABEL[visit.status]}
          </span>
          <h1 className="font-display text-[36px] leading-[1.05] text-balance">
            Active visit
          </h1>
          <p className="text-[13.5px] text-muted-foreground">
            Capture what mattered. The doctor stays focused on the patient.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/60 px-3 py-1.5 text-[11.5px] font-semibold text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-primary/60" />
            <span className="relative h-2 w-2 rounded-full bg-primary" />
          </span>
          Live consultation
        </span>
      </div>

      <div className="px-5 pb-8 pt-3 lg:px-0 lg:pb-0 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-5"
        >
          <div className="flex items-center gap-4">
            <Avatar name={patient.name} size="xl" ring />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-display text-[24px] leading-tight text-foreground">
                {patient.name}
              </span>
              <span className="truncate text-[12px] text-muted-foreground">
                {ageGender}
                {ageGender && patient.phone ? " · " : ""}
                {patient.phone}
              </span>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-semibold uppercase text-primary shadow-soft">
              <span className="h-1.5 w-1.5 animate-ping-soft rounded-full bg-primary" />
              <span className="-ml-0.5">Live</span>
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-white pt-3 text-[11.5px]">
            <span className="flex items-center gap-1 text-muted-foreground">
              Visit no.
              <span className="font-semibold text-foreground/80">
                {visitNumber}
              </span>
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              Last visit
              <span className="font-semibold text-foreground/80">
                {lastVisitAt ? relativeDay(new Date(lastVisitAt)) : "First time"}
              </span>
            </span>
            {visit.reason && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  Reason
                  <span className="font-semibold text-foreground/80">
                    {visit.reason}
                  </span>
                </span>
              </>
            )}
          </div>
        </motion.div>

        <div className="lg:mt-6 lg:grid lg:grid-cols-2 lg:gap-6">
          <div className="lg:flex lg:flex-col lg:gap-6">
            {/* Quick notes */}
            <section className="mt-6 lg:mt-0">
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
                <AnimatePresence>
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
                </AnimatePresence>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTagFromInput();
                    }
                  }}
                  className="min-w-[100px] flex-1 bg-transparent text-[12.5px] placeholder:text-muted-foreground focus:outline-none"
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

            {/* Voice note (local only for now) */}
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
                    recording
                      ? "bg-danger text-white"
                      : "bg-primary-soft text-primary",
                  )}
                >
                  {recording ? (
                    <Square
                      className="h-4 w-4"
                      fill="currentColor"
                      strokeWidth={0}
                    />
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
          </div>

          {/* PRESCRIPTION — visual focus */}
          <section className="mt-6 lg:mt-0 lg:sticky lg:top-6">
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="text-[13.5px] font-semibold tracking-tight">
                Capture prescription
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
                The important one
              </span>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFilePicked}
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFilePicked}
            />

            <AnimatePresence mode="wait">
              {!hasPrescription ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="relative overflow-hidden rounded-3xl border border-dashed border-primary/30 bg-gradient-to-br from-primary-soft/40 via-white to-accent-soft/30 p-6"
                >
                  <div className="absolute inset-0 bg-plus-grid text-primary/15" />
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
                    <h4 className="mt-4 font-display text-[22px] leading-tight text-balance">
                      Snap the{" "}
                      <span className="text-primary">handwritten</span> Rx
                    </h4>
                    <p className="mt-1 max-w-[260px] text-[12.5px] leading-relaxed text-muted-foreground">
                      Doctor writes by hand as always. We just save the photo and
                      link it to this visit.
                    </p>
                    <div className="mt-5 flex w-full max-w-[300px] flex-col gap-2.5">
                      <button
                        onClick={() => cameraRef.current?.click()}
                        disabled={uploading}
                        className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-[14px] font-semibold text-white shadow-float transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
                      >
                        {uploading ? (
                          <Loader2
                            className="h-[18px] w-[18px] animate-spin"
                            strokeWidth={2.2}
                          />
                        ) : (
                          <Camera
                            className="h-[18px] w-[18px]"
                            strokeWidth={2.2}
                          />
                        )}
                        {uploading ? "Uploading…" : "Capture photo"}
                      </button>
                      <button
                        onClick={() => galleryRef.current?.click()}
                        disabled={uploading}
                        className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-white text-[13px] font-semibold text-foreground/80 transition-colors hover:bg-muted disabled:opacity-60"
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
                  <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-soft/50 to-accent-soft/40">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-success shadow-soft">
                        <Check className="h-7 w-7" strokeWidth={2.6} />
                      </span>
                      <span className="text-[12.5px] font-semibold text-foreground/70">
                        Prescription saved
                      </span>
                    </div>
                    <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-success shadow-soft">
                      <Check className="h-4 w-4" strokeWidth={2.6} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between px-1">
                    <div className="flex min-w-0 items-center gap-2 text-[12px] text-muted-foreground">
                      <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {rxName ?? "Attached to this visit"}
                      </span>
                    </div>
                    <button
                      onClick={() => galleryRef.current?.click()}
                      disabled={uploading}
                      className="shrink-0 text-[12px] font-medium text-primary disabled:opacity-60"
                    >
                      {uploading ? "Uploading…" : "Replace"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 border-t border-border/60 bg-white/90 px-5 py-4 backdrop-blur-md lg:static lg:mt-6 lg:flex-row lg:items-center lg:gap-4 lg:border-t-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        {/* Consultation fee + paid */}
        <div className="flex items-center gap-2 lg:mr-auto">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-muted-foreground">
              Rs
            </span>
            <input
              inputMode="numeric"
              value={fee}
              onChange={(e) => setFee(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Fee"
              className="num-tabular h-12 w-[110px] rounded-xl border border-border bg-white pl-9 pr-3 text-[14px] focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10 lg:h-11"
            />
          </div>
          <button
            type="button"
            onClick={() => setPaid((p) => !p)}
            className={cn(
              "flex h-12 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 text-[13px] font-semibold transition-colors lg:h-11",
              paid
                ? "border-success/30 bg-success-soft text-success"
                : "border-border bg-white text-muted-foreground hover:bg-muted",
            )}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
            {paid ? "Paid" : "Mark paid"}
          </button>
        </div>

        <motion.button
          whileTap={{ scale: completing ? 1 : 0.98 }}
          onClick={onComplete}
          disabled={completing}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-foreground text-[15px] font-semibold text-white shadow-float transition-all hover:brightness-110 disabled:opacity-70 lg:h-12 lg:w-auto lg:px-6"
        >
          {completing ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.6} />
          ) : (
            <Check className="h-4 w-4" strokeWidth={2.6} />
          )}
          {completing ? "Saving…" : "Complete visit"}
        </motion.button>
      </div>
    </AppShell>
  );
}
