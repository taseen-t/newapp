"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useClinic } from "@/components/providers/ClinicProvider";

export function Greeting() {
  const { toast } = useToast();
  const { doctorName } = useClinic();
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateLabel = now.toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex items-start justify-between px-5 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-1"
      >
        <span className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {dateLabel}
        </span>
        <h1 className="font-display text-[26px] leading-[1.1] text-foreground sm:text-[30px]">
          {greeting},
          <br />
          <span className="text-primary">{doctorName}</span>
        </h1>
      </motion.div>
      <button
        aria-label="Notifications"
        onClick={() =>
          toast("1 new follow-up overdue — head to the Follow-ups tab.")
        }
        className="relative mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition-colors hover:bg-muted"
      >
        <Bell className="h-[17px] w-[17px]" strokeWidth={2} />
        <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent" />
      </button>
    </div>
  );
}
