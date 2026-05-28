"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Field, Input } from "@/components/ui/input";
import { signUp, type AuthState } from "@/app/actions/auth";
import { SubmitButton, FormBanner } from "@/components/ui/form";

const initial: AuthState = {};

export default function SignUpPage() {
  const [state, action] = useFormState(signUp, initial);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h2 className="font-display text-[28px] leading-tight text-foreground">
          Start your clinic
        </h2>
        <p className="mt-1.5 text-[13.5px] text-muted-foreground">
          Create your account — 14-day free trial, no card required.
        </p>
      </div>

      <form action={action} className="flex flex-col gap-5">
        <FormBanner error={state.error} message={state.message} />

        <Field label="Your name">
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Dr. Imran Khan"
            required
          />
        </Field>

        <Field label="Email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@clinic.pk"
            required
          />
        </Field>

        <Field label="Password" hint="At least 6 characters">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </Field>

        <SubmitButton>Create account</SubmitButton>
      </form>

      <p className="text-center text-[13px] text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
