"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Submit button that shows a spinner while the form action is pending. */
export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-semibold text-white shadow-soft transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

/** Inline error / status banner for forms. */
export function FormBanner({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  if (!error && !message) return null;
  return (
    <div
      role={error ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-[13px] leading-relaxed",
        error
          ? "border-danger/20 bg-danger-soft/50 text-danger"
          : "border-primary/20 bg-primary-soft/60 text-primary",
      )}
    >
      {error ?? message}
    </div>
  );
}
