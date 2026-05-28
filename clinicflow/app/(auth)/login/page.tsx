"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Field, Input } from "@/components/ui/input";
import { signIn, type AuthState } from "@/app/actions/auth";
import { SubmitButton, FormBanner } from "@/components/ui/form";

const initial: AuthState = {};

export default function LoginPage() {
  const [state, action] = useFormState(signIn, initial);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h2 className="font-display text-[28px] leading-tight text-foreground">
          Welcome back
        </h2>
        <p className="mt-1.5 text-[13.5px] text-muted-foreground">
          Sign in to your clinic dashboard.
        </p>
      </div>

      <form action={action} className="flex flex-col gap-5">
        <FormBanner error={state.error} message={state.message} />

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

        <Field label="Password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </Field>

        <SubmitButton>Sign in</SubmitButton>
      </form>

      <p className="text-center text-[13px] text-muted-foreground">
        New to ClinicFlow?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
