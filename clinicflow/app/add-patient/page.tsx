"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User2, Phone, Cake, UserRound } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Field, Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function AddPatientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"M" | "F" | null>(null);

  const ready = name.trim().length > 1 && phone.trim().length >= 7;

  return (
    <AppShell withNav={false} narrow>
      <TopBar title="New patient" subtitle="Takes under 10 seconds" />

      <div className="hidden lg:block lg:pb-7">
        <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Registration
        </span>
        <h1 className="mt-2 font-display text-[36px] leading-[1.05] text-balance">
          Register a new patient
        </h1>
        <p className="mt-2 max-w-md text-[13.5px] text-muted-foreground">
          Takes under 10 seconds. The doctor never has to type during the visit.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          toast(`${name.trim()} registered. Starting visit.`, "success");
          router.push("/visit/p3");
        }}
        className="flex h-[calc(100dvh-56px)] flex-col lg:h-auto lg:rounded-3xl lg:border lg:border-border/70 lg:bg-white lg:shadow-card"
      >
        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4 lg:overflow-visible lg:px-8 lg:pb-6 lg:pt-7">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-5 lg:hidden">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-soft">
                  <User2 className="h-[18px] w-[18px] text-primary" strokeWidth={2.2} />
                </div>
                <div className="flex flex-col">
                  <h2 className="font-display text-[20px] leading-tight text-foreground">
                    A new <span className="text-primary">patient</span>
                  </h2>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    We'll start their first visit right after.
                  </p>
                </div>
              </div>
            </div>

            <Field label="Full name">
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  className="pl-11"
                  placeholder="e.g. Hassan Raza"
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
                  placeholder="+92 300 0000000"
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

            <div className="mt-2 flex items-start gap-3 rounded-2xl border border-border bg-primary-soft/40 p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                i
              </span>
              <p className="text-[12.5px] leading-relaxed text-foreground/80">
                Doctor never has to type during the visit. You only capture the
                handwritten prescription as a photo at the end.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="sticky bottom-0 border-t border-border/60 bg-white/90 px-5 py-4 backdrop-blur-md lg:static lg:border-t-0 lg:bg-transparent lg:px-8 lg:pb-8 lg:pt-2 lg:backdrop-blur-none">
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
