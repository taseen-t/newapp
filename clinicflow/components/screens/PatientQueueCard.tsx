"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Clock3, CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { Patient } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface Props {
  patient: Patient;
  index: number;
}

export function PatientQueueCard({ patient, index }: Props) {
  const status = patient.status ?? "waiting";
  const statusMap = {
    waiting: {
      label: "Waiting",
      icon: Clock3,
      className: "bg-warning-soft text-amber-700",
    },
    "in-progress": {
      label: "In visit",
      icon: Sparkles,
      className: "bg-primary-soft text-primary",
    },
    completed: {
      label: "Done",
      icon: CheckCircle2,
      className: "bg-success-soft text-success",
    },
  } as const;

  const StatusIcon = statusMap[status].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.04 * index, ease: "easeOut" }}
    >
      <Link
        href={status === "completed" ? `/patient/${patient.id}` : `/visit/${patient.id}`}
        className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-white p-3 pr-2.5 shadow-soft transition-all hover:border-primary/30 hover:shadow-card active:scale-[0.99]"
      >
        <div className="relative flex shrink-0 flex-col items-center">
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-primary-soft/70 text-primary">
            <span className="text-[9px] font-medium uppercase leading-none text-primary/60">
              Token
            </span>
            <span className="text-[15px] font-bold leading-tight">
              {patient.token}
            </span>
          </div>
        </div>

        <Avatar name={patient.name} size="md" />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[14.5px] font-semibold tracking-tight">
              {patient.name}
            </span>
            {patient.isNew && (
              <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[9px] font-semibold uppercase text-accent">
                New
              </span>
            )}
          </div>
          <span className="truncate text-[12px] text-muted-foreground">
            {patient.age ? `${patient.age}y` : ""}
            {patient.age && patient.gender ? " · " : ""}
            {patient.gender === "M" ? "Male" : patient.gender === "F" ? "Female" : ""}
            {(patient.age || patient.gender) && patient.reason ? " · " : ""}
            {patient.reason}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[11.5px] font-medium tabular-nums text-foreground/80">
            {patient.slot}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
              statusMap[status].className,
            )}
          >
            <StatusIcon className="h-2.5 w-2.5" strokeWidth={2.5} />
            {statusMap[status].label}
          </span>
        </div>
        <ChevronRight className="ml-0.5 h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
