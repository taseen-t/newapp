"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { X } from "lucide-react";
import { Field, Input } from "@/components/ui/input";
import { SubmitButton, FormBanner } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { updatePatient, type UpdatePatientState } from "@/app/actions/patients";
import type { PatientProfile } from "@/lib/data/queries";

const initial: UpdatePatientState = {};

export function EditPatientModal({
  patient,
  onClose,
}: {
  patient: PatientProfile;
  onClose: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, action] = useFormState(updatePatient, initial);

  useEffect(() => {
    if (state.ok) {
      toast("Patient details updated.", "success");
      onClose();
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl border border-border bg-white p-6 shadow-float sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-[20px]">Edit patient</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="patientId" value={patient.id} />

          <Field label="Full name">
            <Input name="name" defaultValue={patient.name} required autoFocus />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone">
              <Input
                name="phone"
                type="tel"
                defaultValue={patient.phone}
                required
              />
            </Field>
            <Field label="Age" optional>
              <Input
                name="age"
                inputMode="numeric"
                defaultValue={patient.age != null ? String(patient.age) : ""}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Gender" optional>
              <select
                name="gender"
                defaultValue={patient.gender ?? ""}
                className="h-12 w-full rounded-xl border border-border bg-white px-3 text-[15px] text-foreground transition-all focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="">—</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </Field>
            <Field label="Reason" optional>
              <Input name="reason" defaultValue={patient.reason ?? ""} />
            </Field>
          </div>

          {state.error ? <FormBanner error={state.error} /> : null}

          <div className="mt-1 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-xl border border-border bg-white text-[14px] font-semibold text-foreground/70 transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <SubmitButton className="flex-1">Save changes</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
