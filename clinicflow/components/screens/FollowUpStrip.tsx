"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, AlertCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { followUps } from "@/lib/mock-data";

export function FollowUpStrip() {
  const due = followUps.filter((f) => f.status === "due").slice(0, 3);
  const missed = followUps.find((f) => f.status === "missed");

  return (
    <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5">
      {missed && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="relative flex min-w-[230px] flex-col gap-2.5 overflow-hidden rounded-2xl border border-danger/20 bg-danger-soft/60 p-3.5"
        >
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-danger" strokeWidth={2.4} />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-danger">
              Missed · {missed.daysOverdue}d overdue
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Avatar name={missed.patientName} size="md" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[13px] font-semibold tracking-tight">
                {missed.patientName}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {missed.tag} · {missed.note}
              </span>
            </div>
          </div>
          <Link
            href="/follow-ups"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-whatsapp px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-soft transition-all hover:brightness-105"
          >
            <MessageCircle className="h-3 w-3" strokeWidth={2.5} />
            Send WhatsApp
          </Link>
        </motion.div>
      )}

      {due.map((f, i) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 * (i + 1) }}
          className="relative flex min-w-[210px] flex-col gap-2.5 rounded-2xl border border-border/70 bg-white p-3.5 shadow-soft"
        >
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
            Due today
          </span>
          <div className="flex items-center gap-2.5">
            <Avatar name={f.patientName} size="md" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[13px] font-semibold tracking-tight">
                {f.patientName}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {f.tag}
              </span>
            </div>
          </div>
          <Link
            href="/follow-ups"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-whatsapp-soft px-3 py-1.5 text-[11.5px] font-semibold text-emerald-700 transition-all hover:bg-whatsapp hover:text-white"
          >
            <MessageCircle className="h-3 w-3" strokeWidth={2.5} />
            Remind
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
