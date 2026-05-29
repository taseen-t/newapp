"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import {
  ChevronRight,
  Building2,
  Stethoscope,
  MapPin,
  Clock,
  Phone,
  LogOut,
  BadgeCheck,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Field, Input } from "@/components/ui/input";
import { SubmitButton, FormBanner } from "@/components/ui/form";
import { updateClinic, type SettingsState } from "@/app/actions/settings";
import { signOut } from "@/app/actions/auth";

type ClinicSettings = {
  clinicName: string;
  doctorName: string;
  doctorTitle: string;
  city: string;
  openUntil: string;
  phone: string;
  plan: string;
  subscriptionStatus: string;
};

const initial: SettingsState = {};

export function SettingsClient({ clinic }: { clinic: ClinicSettings }) {
  const [state, action] = useFormState(updateClinic, initial);

  return (
    <AppShell>
      <TopBar title="Settings" subtitle="Your clinic & profile" />

      {/* Desktop breadcrumb */}
      <div className="-mx-10 mb-7 hidden border-b border-border px-10 pb-4 lg:flex lg:items-center lg:gap-2 xl:-mx-14 xl:px-14">
        <Link
          href="/dashboard"
          className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className="text-[12.5px] font-medium text-foreground">Settings</span>
      </div>

      <div className="hidden lg:mb-7 lg:block">
        <h1 className="font-display text-[36px] leading-[1.05]">Settings</h1>
        <p className="text-[13.5px] text-muted-foreground">
          Update your clinic details and profile. Changes show across the app
          right away.
        </p>
      </div>

      <div className="px-5 pb-12 pt-2 lg:max-w-2xl lg:px-0 lg:pt-0">
        {/* Plan card */}
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <BadgeCheck className="h-5 w-5" strokeWidth={2} />
            </span>
            <div className="flex flex-col">
              <span className="text-[13.5px] font-semibold capitalize">
                {clinic.plan} plan
              </span>
              <span className="text-[11.5px] capitalize text-muted-foreground">
                {clinic.subscriptionStatus} · free during beta
              </span>
            </div>
          </div>
          <Link
            href="/#pricing"
            className="text-[12.5px] font-medium text-primary transition-colors hover:text-primary/80"
          >
            View plans
          </Link>
        </div>

        {/* Edit form */}
        <form
          action={action}
          className="flex flex-col gap-5 rounded-3xl border border-border bg-white p-6 shadow-soft"
        >
          {state.error ? (
            <FormBanner error={state.error} />
          ) : state.ok ? (
            <FormBanner message="Saved. Your changes are live." />
          ) : null}

          <Field label="Clinic name">
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="clinicName"
                className="pl-11"
                defaultValue={clinic.clinicName}
                required
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
                  defaultValue={clinic.doctorName}
                  placeholder="Dr. Imran Khan"
                />
              </div>
            </Field>
            <Field label="Specialty" optional>
              <Input
                name="doctorTitle"
                defaultValue={clinic.doctorTitle}
                placeholder="General Physician"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="City" optional>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="city"
                  className="pl-11"
                  defaultValue={clinic.city}
                  placeholder="Lahore"
                />
              </div>
            </Field>
            <Field label="Open until" optional>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="openUntil"
                  className="pl-11"
                  defaultValue={clinic.openUntil}
                  placeholder="8:00 PM"
                />
              </div>
            </Field>
          </div>

          <Field
            label="Clinic phone"
            optional
            hint="Shown to patients on follow-ups"
          >
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="phone"
                type="tel"
                className="pl-11"
                defaultValue={clinic.phone}
                placeholder="+92 300 0000000"
              />
            </div>
          </Field>

          <SubmitButton className="mt-1">Save changes</SubmitButton>
        </form>

        {/* Sign out */}
        <button
          onClick={() => signOut()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-[13.5px] font-medium text-foreground/70 transition-colors hover:bg-muted lg:w-auto lg:px-5"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
          Sign out
        </button>
      </div>

      <BottomNav />
    </AppShell>
  );
}
