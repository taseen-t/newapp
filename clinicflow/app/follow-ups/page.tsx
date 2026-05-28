"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  CalendarClock,
  AlertCircle,
  Check,
  Filter,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Avatar } from "@/components/ui/avatar";
import { followUps, type DiagnosisTag } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "due", label: "Due", count: followUps.filter((f) => f.status === "due").length },
  { key: "missed", label: "Missed", count: followUps.filter((f) => f.status === "missed").length },
  { key: "scheduled", label: "Scheduled", count: followUps.filter((f) => f.status === "scheduled").length },
] as const;

const TAG_FILTERS: DiagnosisTag[] = [
  "Diabetes",
  "BP Review",
  "Post-op",
  "Vaccination",
  "Thyroid",
  "Cholesterol",
];

export default function FollowUpsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("due");
  const [activeTag, setActiveTag] = useState<DiagnosisTag | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());

  const list = followUps.filter(
    (f) => f.status === tab && (!activeTag || f.tag === activeTag),
  );

  return (
    <AppShell>
      <TopBar
        title="Follow-ups"
        subtitle="Keep patients coming back"
        action={
          <button
            aria-label="Filter"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted"
          >
            <Filter className="h-[18px] w-[18px]" />
          </button>
        }
      />

      {/* Desktop breadcrumb */}
      <div className="-mx-10 mb-7 hidden border-b border-border px-10 pb-4 lg:flex lg:items-center lg:gap-2 xl:-mx-14 xl:px-14">
        <Link
          href="/"
          className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className="text-[12.5px] font-medium text-foreground">Follow-ups</span>
      </div>

      <div className="hidden lg:mb-7 lg:flex lg:items-end lg:justify-between lg:gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Retention
          </span>
          <h1 className="font-display text-[36px] leading-[1.05]">
            Follow-ups
          </h1>
          <p className="text-[13.5px] text-muted-foreground">
            One-tap WhatsApp reminders. Keep continuity simple.
          </p>
        </div>
      </div>

      <div className="px-5 pt-2 lg:px-0 lg:pt-0">
        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-6 lg:max-w-3xl"
        >
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-whatsapp/15 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Today
              </span>
              <div className="flex items-baseline gap-2">
                <span className="num-tabular text-[56px] font-semibold leading-none text-foreground">
                  {followUps.filter((f) => f.status === "due").length}
                </span>
                <span className="text-[14px] font-medium text-muted-foreground">
                  reminders to send
                </span>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-whatsapp text-white shadow-float">
              <MessageCircle className="h-6 w-6" strokeWidth={2.2} />
            </div>
          </div>
          <button className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp py-3.5 text-[14px] font-semibold text-white shadow-soft transition-all hover:brightness-110 active:scale-[0.98]">
            <MessageCircle className="h-4 w-4" strokeWidth={2.4} />
            Send all on WhatsApp
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 rounded-2xl border border-border/70 bg-muted/50 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-medium transition-colors",
                tab === t.key ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="fu-tab"
                  className="absolute inset-0 rounded-xl bg-white shadow-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{t.label}</span>
              <span
                className={cn(
                  "relative inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9.5px] font-semibold",
                  tab === t.key
                    ? t.key === "missed"
                      ? "bg-danger-soft text-danger"
                      : "bg-primary-soft text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tag chips */}
        <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors",
              activeTag === null
                ? "border-foreground bg-foreground text-white"
                : "border-border bg-white text-foreground/70 hover:bg-muted",
            )}
          >
            All
          </button>
          {TAG_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(activeTag === t ? null : t)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                activeTag === t
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-foreground/70 hover:bg-muted",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* List */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={tab + (activeTag ?? "")}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="mt-4 flex flex-col gap-2.5 pb-8 lg:grid lg:grid-cols-2 lg:gap-3 xl:grid-cols-3"
          >
            {list.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-soft text-success">
                  <Check className="h-5 w-5" strokeWidth={2.4} />
                </div>
                <p className="mt-3 text-[14px] font-semibold tracking-tight">
                  All clear
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  No follow-ups in this view.
                </p>
              </div>
            )}

            {list.map((f, i) => {
              const isSent = sent.has(f.id);
              const isMissed = f.status === "missed";
              return (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl border bg-white p-3.5 shadow-soft transition-all",
                    isMissed
                      ? "border-danger/20 bg-danger-soft/30"
                      : "border-border/70",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={f.patientName} size="lg" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[14.5px] font-semibold tracking-tight">
                          {f.patientName}
                        </span>
                        {isMissed && (
                          <span className="flex items-center gap-0.5 rounded-full bg-danger-soft px-1.5 py-0.5 text-[9.5px] font-semibold uppercase text-danger">
                            <AlertCircle className="h-2.5 w-2.5" strokeWidth={2.6} />
                            {f.daysOverdue}d overdue
                          </span>
                        )}
                      </div>
                      <span className="truncate text-[11.5px] text-muted-foreground">
                        {f.phone}
                      </span>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10.5px] font-medium text-primary">
                          {f.tag}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10.5px] text-muted-foreground">
                          <CalendarClock className="h-3 w-3" />
                          {new Date(f.due).toLocaleDateString("en-PK", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                      {f.note && (
                        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-foreground/70">
                          {f.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <button
                      onClick={() => {
                        setSent((s) => new Set(s).add(f.id));
                      }}
                      disabled={isSent}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-semibold transition-all",
                        isSent
                          ? "bg-success-soft text-success"
                          : "bg-whatsapp text-white shadow-soft hover:brightness-110 active:scale-[0.98]",
                      )}
                    >
                      {isSent ? (
                        <>
                          <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                          Sent on WhatsApp
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.4} />
                          Send reminder
                        </>
                      )}
                    </button>
                    <button className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2.5 text-[12px] font-medium text-foreground/70 transition-colors hover:bg-muted">
                      <CalendarClock className="h-3.5 w-3.5" strokeWidth={2.2} />
                      Reschedule
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav />
    </AppShell>
  );
}
