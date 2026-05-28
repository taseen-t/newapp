"use client";

import { motion } from "framer-motion";
import { Bell, Stethoscope } from "lucide-react";

export function Greeting() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex items-center justify-between px-5 pt-5">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col"
      >
        <span className="text-[12px] font-medium text-muted-foreground">
          {greeting}
        </span>
        <div className="flex items-center gap-1.5">
          <h1 className="text-[22px] font-semibold tracking-tight leading-tight">
            Dr. Khan
          </h1>
          <span className="text-[22px]">·</span>
          <span className="flex items-center gap-1 text-[14px] text-muted-foreground">
            <Stethoscope className="h-3.5 w-3.5" strokeWidth={2} />
            Clinic
          </span>
        </div>
      </motion.div>
      <div className="flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-white text-foreground/70 transition-colors hover:bg-muted"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>
      </div>
    </div>
  );
}
