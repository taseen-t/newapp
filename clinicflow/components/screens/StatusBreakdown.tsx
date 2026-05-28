"use client";

import { motion } from "framer-motion";
import { Clock3, Sparkles, CheckCircle2, MoreHorizontal } from "lucide-react";
import { patients } from "@/lib/mock-data";

export function StatusBreakdown() {
  const total = patients.length;
  const counts = {
    waiting: patients.filter((p) => p.status === "waiting").length,
    inProgress: patients.filter((p) => p.status === "in-progress").length,
    completed: patients.filter((p) => p.status === "completed").length,
  };

  const rows = [
    {
      label: "Waiting",
      sub: `${counts.waiting} patients in queue`,
      count: counts.waiting,
      pct: Math.round((counts.waiting / total) * 100),
      icon: Clock3,
      barClass: "bg-amber-500",
      iconClass: "bg-warning-soft text-amber-600",
    },
    {
      label: "In visit",
      sub: `${counts.inProgress} with the doctor`,
      count: counts.inProgress,
      pct: Math.round((counts.inProgress / total) * 100),
      icon: Sparkles,
      barClass: "bg-primary",
      iconClass: "bg-primary-soft text-primary",
    },
    {
      label: "Completed",
      sub: `${counts.completed} discharged today`,
      count: counts.completed,
      pct: Math.round((counts.completed / total) * 100),
      icon: CheckCircle2,
      barClass: "bg-success",
      iconClass: "bg-success-soft text-success",
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[14.5px] font-semibold tracking-tight">
            Queue status
          </h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Live breakdown of today's queue
          </p>
        </div>
        <button
          aria-label="More"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${r.iconClass}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="truncate text-[13px] font-semibold text-foreground">
                    {r.label}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {r.sub}
                  </span>
                </div>
                <span className="text-[14px] font-semibold tabular-nums tracking-tight text-foreground">
                  {r.pct}%
                </span>
              </div>
              <div className="ml-[46px] h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.pct}%` }}
                  transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
                  className={`h-full rounded-full ${r.barClass}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
