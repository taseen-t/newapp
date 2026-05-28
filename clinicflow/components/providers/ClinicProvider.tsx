"use client";

import { createContext, useContext } from "react";
import type { ClinicView } from "@/lib/data/queries";

export type ClinicContextValue = ClinicView & {
  /** Doctor's initials, for the avatar chip. */
  initials: string;
  /** Patients still in today's queue (waiting + in-progress). */
  queueCount: number;
  /** Follow-ups due or overdue. */
  pendingCount: number;
};

const ClinicContext = createContext<ClinicContextValue | null>(null);

export function ClinicProvider({
  value,
  children,
}: {
  value: ClinicContextValue;
  children: React.ReactNode;
}) {
  return (
    <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
  );
}

/** Read the current clinic anywhere inside the (app) route group. */
export function useClinic(): ClinicContextValue {
  const ctx = useContext(ClinicContext);
  if (!ctx) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return ctx;
}
