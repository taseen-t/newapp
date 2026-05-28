"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  User2,
  Phone,
  Cake,
  UserRound,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Field, Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { addPatient, type AddPatientState } from "@/app/actions/patients";

const initialState: AddPatientState = {};

export default function AddPatientPage() {
  const [state, formAction] = useFormState(addPatient, initialState);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "">("");

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
        action={formAction}
        className="flex h-[calc(100dvh-56px)] flex-col lg:h-auto lg:rounded-3xl lg:border lg:border-border/70 lg:bg-white lg:shadow-card"
      >
        {/* Hidden input mirrors the gender toggle into the FormData. */}
        <input type="hidden" name="gender" value={gender} />

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
                  <User2
                    className="h-[18px] w-[18px] text-primary"
                    strokeWidth={2.2}
                  />
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

            {state.error && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-danger/20 bg-danger-soft/60 p-3.5">
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-danger"
                  strokeWidth={2.4}
                />
                <p className="text-[12.5px] leading-relaxed text-danger">
                  {state.error}
                </p>
              </div>
            )}

            <Field label="Full name">
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  name="name"
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
                  name="phone"
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
                    name="age"
                    inputMode="numeric"
                    className="pl-10"
                    placeholder="—"
                  />
                </div>
              </Field>
              <Field label="Gender" optional>
                <div className="grid grid-cols-2 gap-2">
                  {(["M", "F"] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender((cur) => (cur === g ? "" : g))}
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

            <Field label="Reason for visit" optional>
              <Textarea
                name="reason"
                rows={2}
                placeholder="e.g. Fever and sore throat for 3 days"
              />
            </Field>

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
          <SubmitButton ready={ready} />
        </div>
      </form>
    </AppShell>
  );
}

function SubmitButton({ ready }: { ready: boolean }) {
  const { pending } = useFormStatus();
  const disabled = !ready || pending;
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type="submit"
      disabled={disabled}
      className={cn(
        "flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold transition-all",
        disabled
          ? "bg-muted text-muted-foreground"
          : "bg-primary text-white shadow-float hover:brightness-105",
      )}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
          Saving…
        </>
      ) : (
        <>
          Start visit
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
        </>
      )}
    </motion.button>
  );
}
