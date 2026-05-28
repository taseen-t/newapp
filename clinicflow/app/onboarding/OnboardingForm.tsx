"use client";

import { useFormState } from "react-dom";
import { HeartPulse, Building2, MapPin, Phone, Clock, Stethoscope } from "lucide-react";
import { Field, Input } from "@/components/ui/input";
import { SubmitButton, FormBanner } from "@/components/ui/form";
import { createClinic, type OnboardingState } from "@/app/actions/onboarding";

const initial: OnboardingState = {};

export function OnboardingForm({
  defaultDoctorName,
}: {
  defaultDoctorName: string;
}) {
  const [state, action] = useFormState(createClinic, initial);

  return (
    <div className="min-h-dvh w-full bg-muted/30">
      <div className="bg-plus-grid pointer-events-none absolute inset-x-0 top-0 h-64 text-primary/[0.06]" />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[540px] flex-col px-6 py-10 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <HeartPulse className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="text-[16px] font-semibold tracking-tight">
            ClinicFlow
          </span>
        </div>

        <div className="mt-10">
          <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Step 1 of 1
          </span>
          <h1 className="mt-2 font-display text-[30px] leading-[1.08] text-balance">
            Set up your clinic
          </h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            A few details and you're in. You can change all of this later.
          </p>
        </div>

        <form
          action={action}
          className="mt-7 flex flex-col gap-5 rounded-3xl border border-border/70 bg-white p-6 shadow-card sm:p-7"
        >
          <FormBanner error={state.error} />

          <Field label="Clinic name">
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="clinicName"
                className="pl-11"
                placeholder="e.g. Khan Clinic"
                required
                autoFocus
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Doctor's name">
              <div className="relative">
                <Stethoscope className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="doctorName"
                  className="pl-11"
                  placeholder="Dr. Imran Khan"
                  defaultValue={defaultDoctorName}
                />
              </div>
            </Field>
            <Field label="Specialty" optional>
              <Input name="doctorTitle" placeholder="General Physician" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="City" optional>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input name="city" className="pl-11" placeholder="Lahore" />
              </div>
            </Field>
            <Field label="Open until" optional>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input name="openUntil" className="pl-11" placeholder="8:00 PM" />
              </div>
            </Field>
          </div>

          <Field label="Clinic phone" optional hint="Shown to patients on follow-ups">
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="phone"
                type="tel"
                className="pl-11"
                placeholder="+92 300 0000000"
              />
            </div>
          </Field>

          <SubmitButton className="mt-1">Create clinic & continue</SubmitButton>
        </form>
      </div>
    </div>
  );
}
