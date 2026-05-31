"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Search,
  ArrowRight,
  ChevronRight,
  Calendar,
  Bell,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useToast } from "@/components/ui/toast";
import { BottomNav } from "@/components/layout/BottomNav";
import { Greeting } from "@/components/screens/Greeting";
import { SearchBar } from "@/components/screens/SearchBar";
import { StatsRow } from "@/components/screens/StatsRow";
import { InlineStat } from "@/components/screens/InlineStat";
import { VisitsChart } from "@/components/screens/VisitsChart";
import { StatusBreakdown } from "@/components/screens/StatusBreakdown";
import { PatientQueueCard } from "@/components/screens/PatientQueueCard";
import { FollowUpStrip } from "@/components/screens/FollowUpStrip";
import { AddPatientFab } from "@/components/screens/AddPatientFab";
import type {
  QueueEntry,
  FollowUpView,
  DashboardStats,
  RevenueStats,
} from "@/lib/data/queries";

interface HomeClientProps {
  queue: QueueEntry[];
  followUps: FollowUpView[];
  stats: DashboardStats;
  weekly: number[];
  revenue: RevenueStats;
  city: string;
}

export function HomeClient({
  queue,
  followUps,
  stats,
  weekly,
  revenue,
  city,
}: HomeClientProps) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const dueFollowUps = followUps.filter((f) => f.status !== "scheduled");
  const dateLabel = new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const filteredQueue = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return queue;
    return queue.filter((p) =>
      [p.name, p.phone, p.reason ?? ""].some((field) =>
        field.toLowerCase().includes(q),
      ),
    );
  }, [query, queue]);

  const queueEmpty = queue.length === 0;

  return (
    <AppShell>
      {/* ============ MOBILE ============ */}
      <div className="relative lg:hidden">
        <div className="absolute inset-x-0 top-0 h-72 -z-10 gradient-mesh" />
        <Greeting />
        <SearchBar value={query} onChange={setQuery} />
        <StatsRow stats={stats} />
        <div className="mt-4 px-5">
          <RevenueRow revenue={revenue} />
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <div className="flex items-end justify-between px-6">
            <div>
              <h2 className="font-display text-[22px] leading-tight">
                Today's queue
              </h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {queue.length} patients · {stats.waiting} waiting
              </p>
            </div>
            <Link
              href="/patients"
              className="inline-flex items-center gap-0.5 text-[12px] font-medium text-primary"
            >
              All patients
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-3 px-5">
            {queueEmpty ? (
              <EmptyQueue />
            ) : filteredQueue.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border py-8 text-center">
                <p className="text-[13px] text-muted-foreground">
                  No patients match "
                  <span className="font-medium text-foreground">{query}</span>"
                </p>
              </div>
            ) : (
              filteredQueue.map((p) => (
                <PatientQueueCard key={p.visitId} entry={p} />
              ))
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 pb-10">
          <div className="flex items-end justify-between px-6">
            <div>
              <h2 className="font-display text-[22px] leading-tight">
                Follow-ups
              </h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                WhatsApp in one tap
              </p>
            </div>
            <Link
              href="/follow-ups"
              className="inline-flex items-center gap-0.5 text-[12px] font-medium text-primary"
            >
              See all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <FollowUpStrip followUps={followUps} />
        </div>

        <AddPatientFab />
      </div>

      {/* ============ DESKTOP (Pulse-style) ============ */}
      <div className="hidden lg:block">
        {/* Top breadcrumb / search / actions row */}
        <div className="-mx-10 mb-7 flex items-center justify-between border-b border-border px-10 pb-4 xl:-mx-14 xl:px-14">
          <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">Today</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                toast("Search coming up — global ⌘K search is on the roadmap.")
              }
              className="flex h-9 w-72 items-center gap-2 rounded-lg border border-border bg-white px-3 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="flex-1 text-left">Search anything</span>
              <kbd className="rounded border border-border bg-muted/50 px-1 text-[10px]">
                ⌘K
              </kbd>
            </button>
            {city && (
              <button
                onClick={() =>
                  toast(`Only your ${city} clinic is connected on this plan.`)
                }
                className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-[12.5px] font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>{city}</span>
                <ChevronRight className="h-3 w-3 rotate-90 text-muted-foreground" />
              </button>
            )}
            <button
              aria-label="Notifications"
              onClick={() =>
                toast(
                  stats.pendingFollowUps > 0
                    ? `${stats.pendingFollowUps} follow-ups need attention — see the Follow-ups tab.`
                    : "You're all caught up on follow-ups.",
                )
              }
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-foreground/70 transition-colors hover:bg-muted"
            >
              <Bell className="h-3.5 w-3.5" />
              {stats.pendingFollowUps > 0 && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </button>
          </div>
        </div>

        {/* Page header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-[32px] leading-[1.1] text-foreground">
              Clinic overview
            </h1>
            <p className="text-[13.5px] text-muted-foreground">
              Live view of today's queue, follow-ups, and clinic memory.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast("Date range picker coming next sprint.")}
              className="flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-3.5 text-[12.5px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              {dateLabel}
            </button>
            <Link
              href="/add-patient"
              className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-[12.5px] font-semibold text-white shadow-soft transition-all hover:brightness-110"
            >
              <CalendarPlus className="h-3.5 w-3.5" strokeWidth={2.4} />
              Add patient
            </Link>
          </div>
        </div>

        {/* Inline stat row (5 metrics) */}
        <div className="mt-6 grid grid-cols-2 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-white sm:grid-cols-3 lg:grid-cols-5">
          <InlineStat
            label="Patients today"
            value={String(stats.patientsToday)}
            vs="in today's queue"
          />
          <InlineStat
            label="Waiting"
            value={String(stats.waiting)}
            vs="still to be seen"
          />
          <InlineStat
            label="Completed visits"
            value={String(stats.completed)}
            vs="discharged today"
          />
          <InlineStat
            label="Pending follow-ups"
            value={String(stats.pendingFollowUps)}
            vs="due or overdue"
          />
          <InlineStat
            label="New patients"
            value={String(stats.newPatients)}
            vs="first-time visits"
          />
        </div>

        <div className="mt-6">
          <RevenueRow revenue={revenue} />
        </div>

        {/* Chart + breakdown */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          <VisitsChart data={weekly} />
          <StatusBreakdown stats={stats} />
        </div>

        {/* Queue + Follow-ups */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[14.5px] font-semibold tracking-tight">
                  Today's queue
                </h3>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {queue.length} patients · {stats.waiting} waiting
                </p>
              </div>
              <Link
                href="/patients"
                className="inline-flex items-center gap-0.5 text-[12px] font-medium text-primary transition-colors hover:text-primary/80"
              >
                All patients
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {queueEmpty ? (
                <EmptyQueue />
              ) : (
                queue.map((p) => <PatientQueueCard key={p.visitId} entry={p} />)
              )}
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[14.5px] font-semibold tracking-tight">
                  Follow-ups
                </h3>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  WhatsApp in one tap
                </p>
              </div>
              <Link
                href="/follow-ups"
                className="inline-flex items-center gap-0.5 text-[12px] font-medium text-primary transition-colors hover:text-primary/80"
              >
                See all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {dueFollowUps.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border bg-muted/30 py-6 text-center text-[12px] text-muted-foreground">
                  No follow-ups need attention.
                </p>
              ) : (
                dueFollowUps.slice(0, 4).map((f) => (
                  <Link
                    key={f.id}
                    href="/follow-ups"
                    className={`group flex items-center gap-3 rounded-xl border p-2.5 transition-all hover:border-primary/30 ${
                      f.status === "missed"
                        ? "border-danger/15 bg-danger-soft/30"
                        : "border-border bg-white"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-[11.5px] font-semibold text-primary">
                      {f.patientName
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[12.5px] font-semibold tracking-tight">
                        {f.patientName}
                      </span>
                      <span className="truncate text-[10.5px] text-muted-foreground">
                        {f.tag}
                        {f.note ? ` · ${f.note}` : ""}
                      </span>
                    </div>
                    {f.status === "missed" ? (
                      <span className="rounded-md bg-danger-soft px-1.5 py-0.5 text-[9.5px] font-semibold text-danger">
                        {f.daysOverdue}d
                      </span>
                    ) : (
                      <span className="rounded-md bg-whatsapp-soft px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-700">
                        Today
                      </span>
                    )}
                  </Link>
                ))
              )}
              <Link
                href="/follow-ups"
                className="mt-0.5 flex h-9 items-center justify-center rounded-lg border border-dashed border-border text-[11.5px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                View all follow-ups
              </Link>
            </div>
          </section>
        </div>
      </div>

      <BottomNav />
    </AppShell>
  );
}

function EmptyQueue() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
      <p className="text-[14px] font-semibold tracking-tight">
        No patients yet today
      </p>
      <p className="max-w-[260px] text-[12.5px] text-muted-foreground">
        Register your first patient and they'll appear here in the queue.
      </p>
      <Link
        href="/add-patient"
        className="mt-1 flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-[13px] font-semibold text-white shadow-soft transition-all hover:brightness-110"
      >
        <CalendarPlus className="h-3.5 w-3.5" strokeWidth={2.4} />
        Add patient
      </Link>
    </div>
  );
}

function RevenueRow({ revenue }: { revenue: RevenueStats }) {
  const fmt = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;
  const items = [
    { label: "Earned today", value: fmt(revenue.today), tone: "text-foreground" },
    { label: "This month", value: fmt(revenue.month), tone: "text-primary" },
    {
      label: "Unpaid today",
      value: fmt(revenue.unpaidToday),
      tone:
        revenue.unpaidToday > 0 ? "text-amber-600" : "text-muted-foreground",
    },
  ];
  return (
    <div className="grid grid-cols-3 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-white">
      {items.map((it) => (
        <div key={it.label} className="px-3 py-3 text-center">
          <p
            className={`num-tabular text-[15px] font-bold leading-none sm:text-[17px] ${it.tone}`}
          >
            {it.value}
          </p>
          <p className="mt-1 text-[10.5px] text-muted-foreground">{it.label}</p>
        </div>
      ))}
    </div>
  );
}
