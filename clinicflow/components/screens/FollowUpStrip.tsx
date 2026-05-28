"use client";

import { motion } from "framer-motion";
import { MessageCircle, AlertCircle, Check } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { useClinic } from "@/components/providers/ClinicProvider";
import type { FollowUpView } from "@/lib/data/queries";
import { followUpMessage, openExternal, whatsappUrl } from "@/lib/contact";

export function FollowUpStrip({ followUps }: { followUps: FollowUpView[] }) {
  const { toast } = useToast();
  const clinic = useClinic();
  const due = followUps.filter((f) => f.status === "due").slice(0, 3);
  const missed = followUps.find((f) => f.status === "missed");

  function send(f: FollowUpView) {
    openExternal(
      whatsappUrl(f.phone, followUpMessage(f.patientName, f.tag, f.due, clinic)),
    );
    toast(`WhatsApp opened for ${f.patientName}`, "success");
  }

  if (!missed && due.length === 0) {
    return (
      <div className="mx-5 flex items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-soft text-success">
          <Check className="h-4 w-4" strokeWidth={2.4} />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold tracking-tight">
            No reminders right now
          </span>
          <span className="text-[11.5px] text-muted-foreground">
            Follow-ups you schedule will show up here.
          </span>
        </div>
      </div>
    );
  }

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
                {missed.tag}
                {missed.note ? ` · ${missed.note}` : ""}
              </span>
            </div>
          </div>
          <button
            onClick={() => send(missed)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-whatsapp px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-soft transition-all hover:brightness-105"
          >
            <MessageCircle className="h-3 w-3" strokeWidth={2.5} />
            Send WhatsApp
          </button>
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
          <button
            onClick={() => send(f)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-whatsapp-soft px-3 py-1.5 text-[11.5px] font-semibold text-emerald-700 transition-all hover:bg-whatsapp hover:text-white"
          >
            <MessageCircle className="h-3 w-3" strokeWidth={2.5} />
            Remind
          </button>
        </motion.div>
      ))}
    </div>
  );
}
