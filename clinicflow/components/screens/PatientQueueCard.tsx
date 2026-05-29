import Link from "next/link";
import { ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { QueueEntry } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

interface Props {
  entry: QueueEntry;
}

const statusConfig = {
  waiting: {
    label: "Waiting",
    className: "text-amber-700",
    dot: "bg-amber-500",
  },
  "in-progress": {
    label: "In visit",
    className: "text-primary",
    dot: "bg-primary",
  },
  completed: {
    label: "Done",
    className: "text-success",
    dot: "bg-success",
  },
} as const;

export function PatientQueueCard({ entry }: Props) {
  const cfg = statusConfig[entry.status];

  const meta = [
    entry.age ? `${entry.age}y` : "",
    entry.gender === "M" ? "Male" : entry.gender === "F" ? "Female" : "",
    entry.slot ?? "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="group relative flex items-center gap-3 rounded-2xl border border-border bg-white py-2.5 pl-3 pr-2.5 transition-colors hover:border-primary/30">
      {/* Patient info → opens the profile (does NOT start the visit) */}
      <Link
        href={`/patient/${entry.patientId}`}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        {/* Token */}
        <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-soft text-primary">
          <span className="text-[8.5px] font-semibold uppercase leading-none tracking-wider text-primary/60">
            Token
          </span>
          <span className="mt-0.5 text-[16px] font-bold leading-none">
            {entry.token ?? "—"}
          </span>
        </div>

        <Avatar name={entry.name} size="md" />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[14.5px] font-semibold tracking-tight">
              {entry.name}
            </span>
            {entry.isNew && (
              <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[9px] font-semibold uppercase text-accent">
                New
              </span>
            )}
          </div>
          {(meta || entry.reason) && (
            <span className="truncate text-[12px] text-muted-foreground">
              {meta}
              {meta && entry.reason ? " · " : ""}
              {entry.reason}
            </span>
          )}
          <span
            className={cn(
              "mt-1 inline-flex items-center gap-1 text-[10.5px] font-medium",
              cfg.className,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
            {cfg.label}
          </span>
        </div>
      </Link>

      {/* Action — explicit and doctor-driven. Starting a visit only happens here. */}
      {entry.status === "waiting" && (
        <Link
          href={`/visit/${entry.visitId}`}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-primary px-3.5 py-2.5 text-[12.5px] font-semibold text-white shadow-soft transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Play className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
          Start visit
        </Link>
      )}

      {entry.status === "in-progress" && (
        <Link
          href={`/visit/${entry.visitId}`}
          className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border border-primary/30 bg-primary-soft px-3.5 py-2.5 text-[12.5px] font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Resume
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}

      {entry.status === "completed" && (
        <Link
          href={`/patient/${entry.patientId}`}
          className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border border-border px-3 py-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          View
        </Link>
      )}
    </div>
  );
}
