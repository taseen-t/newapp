"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User2, Phone, Cake, UserRound } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Field, Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AddPatientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"M" | "F" | null>(null);

  const ready = name.trim().length > 1 && phone.trim().length >= 7;

  return (
    <AppShell withNav={false}>
      <TopBar title="New patient" subtitle="Takes under 10 seconds" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          router.push("/visit/p3");
        }}
        className="flex h-[calc(100dvh-56px)] flex-col"
      >
        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-gradient-to-br from-primary-soft/60 to-accent-soft/40 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft">
                <User2 className="h-5 w-5 text-primary" strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold tracking-tight">
                  Register a new patient
                </span>
                <span className="text-[12px] text-muted-foreground">
                  We'll start their first visit right after.
                </span>
              </div>
            </div>

            <Field label="Full name">
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  className="pl-11"
                  placeholder="e.g. Aarav Mehta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </Field>

            <Field label="Phone number" hint="Used for WhatsApp follow-ups">
              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="tel"
                  className="pl-11"
                  placeholder="+91 / +92"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </Field>

            <div className="grid grid-cols-[110px_1fr] gap-4">
              <Field label="Age" optional>
                <div className="relative">
                  <Cake className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    inputMode="numeric"
                    className="pl-10"
                    placeholder="—"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Gender" optional>
                <div className="grid grid-cols-2 gap-2">
                  {(["M", "F"] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender(g)}
                      className={cn(
                        "flex h-12 items-center justify-center rounded-xl border text-[13.5px] font-medium transition-all",
                        gender === g
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-white text-foreground/70 hover:bg-muted",
                      )}
                    >
                      {g === "M" ? "Male" : "Female"}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-dashed border-border bg-muted/30 p-4">
              <span className="text-[12px] font-semibold tracking-tight">
                Tip
              </span>
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Doctor never has to type during the visit. You only capture the
                handwritten prescription as a photo at the end.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="sticky bottom-0 border-t border-border/60 bg-white/90 px-5 py-4 backdrop-blur-md">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!ready}
            className={cn(
              "flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold transition-all",
              ready
                ? "bg-primary text-white shadow-float hover:brightness-105"
                : "bg-muted text-muted-foreground",
            )}
          >
            Start visit
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </motion.button>
        </div>
      </form>
    </AppShell>
  );
}
