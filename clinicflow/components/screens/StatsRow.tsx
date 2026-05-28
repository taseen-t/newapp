"use client";

import { motion } from "framer-motion";
import { Users, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { todayStats } from "@/lib/mock-data";

const stats = [
  {
    label: "Patients today",
    value: todayStats.patientsToday,
    icon: Users,
    accent: "from-teal-50 to-white",
    iconBg: "bg-primary-soft text-primary",
    trend: "+2 vs yesterday",
  },
  {
    label: "Pending follow-ups",
    value: todayStats.pendingFollowUps,
    icon: Clock,
    accent: "from-amber-50 to-white",
    iconBg: "bg-warning-soft text-amber-600",
    trend: "Due today",
  },
  {
    label: "Completed visits",
    value: todayStats.completedVisits,
    icon: CheckCircle2,
    accent: "from-sky-50 to-white",
    iconBg: "bg-accent-soft text-accent",
    trend: "29% of queue",
  },
];

export function StatsRow() {
  return (
    <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto px-5">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 * i, ease: "easeOut" }}
            className={`relative flex min-w-[150px] flex-col gap-3 rounded-2xl border border-border/70 bg-gradient-to-b ${s.accent} p-4 shadow-soft`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}
              >
                <Icon className="h-[17px] w-[17px]" strokeWidth={2.2} />
              </div>
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/60" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[26px] font-semibold tracking-tight leading-none">
                {s.value}
              </span>
              <span className="text-[11.5px] font-medium text-muted-foreground">
                {s.label}
              </span>
            </div>
            <span className="text-[10.5px] text-muted-foreground/80">
              {s.trend}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
