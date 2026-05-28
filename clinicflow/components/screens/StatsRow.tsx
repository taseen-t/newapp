"use client";

import { motion } from "framer-motion";
import { Users, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import type { DashboardStats } from "@/lib/data/queries";

export function StatsRow({ stats }: { stats: DashboardStats }) {
  return (
    <div className="mt-5 px-5 lg:mt-0 lg:px-0">
      {/* Bento layout: 1 hero card + 2 supporting cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
        {/* Hero metric — spans 2 cols on mobile, 1 on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative col-span-2 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/85 p-5 text-primary-foreground shadow-card lg:col-span-1"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-accent/30 blur-xl" />

          <div className="relative flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Users className="h-4 w-4" strokeWidth={2.2} />
            </div>
            {stats.newPatients > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
                <ArrowUpRight className="h-2.5 w-2.5" strokeWidth={3} />
                {stats.newPatients} new
              </span>
            )}
          </div>

          <div className="relative mt-6 flex items-baseline gap-2">
            <span className="num-tabular text-[60px] font-semibold leading-none tracking-tight">
              {stats.patientsToday}
            </span>
            <span className="text-[11px] text-white/70">today</span>
          </div>
          <span className="relative mt-1 block text-[12px] font-medium text-white/85">
            Patients in queue
          </span>

          {/* Mini sparkline */}
          <div className="relative mt-4 flex items-end gap-1">
            {[4, 6, 5, 7, 8, 6, 9, 7, 11].map((h, i) => (
              <motion.span
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="block w-[7px] origin-bottom rounded-sm bg-white/40"
                style={{ height: h * 2 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Supporting metric 1 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.07 }}
          className="flex flex-col justify-between rounded-3xl border border-border bg-white p-4 shadow-soft lg:p-5"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Clock className="h-4 w-4" strokeWidth={2.2} />
            </div>
            {stats.pendingFollowUps > 0 && (
              <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[9.5px] font-semibold uppercase text-amber-700">
                Due
              </span>
            )}
          </div>
          <div className="mt-5">
            <span className="num-tabular text-[40px] font-semibold leading-none text-foreground">
              {stats.pendingFollowUps}
            </span>
            <span className="mt-1 block text-[11.5px] font-medium text-muted-foreground">
              Pending follow-ups
            </span>
          </div>
        </motion.div>

        {/* Supporting metric 2 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="flex flex-col justify-between rounded-3xl border border-border bg-white p-4 shadow-soft lg:p-5"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-soft text-success">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-5">
            <span className="num-tabular text-[40px] font-semibold leading-none text-foreground">
              {stats.completed}
            </span>
            <span className="mt-1 block text-[11.5px] font-medium text-muted-foreground">
              Completed visits
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
