"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export function AddPatientFab() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
      className="pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center px-5"
    >
      <Link
        href="/add-patient"
        className="pointer-events-auto group flex items-center gap-2 rounded-full bg-foreground px-5 py-3.5 text-[13.5px] font-semibold text-white shadow-float transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
          <Plus className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        Add patient
      </Link>
    </motion.div>
  );
}
