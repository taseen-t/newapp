import Link from "next/link";
import { ChevronRight, Clock3, Sparkles, CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { QueueEntry } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

interface Props {
  entry: QueueEntry;
}

const statusConfig = {
  waiting: {
    label: "Waiting",
    icon: Clock3,
    className: "text-amber-700",
    dot: "bg-amber-500",
  },
  "in-progress": {
    label: "In visit",
    icon: Sparkles,
    className: "text-primary",
    dot: "bg-primary",
  },
  completed: {
    label: "Done",
    icon: CheckCircle2,
    className: "text-success",
    dot: "bg-success",
  },
} as const;

export function PatientQueueCard({ entry }: Props) {
  const cfg = statusConfig[entry.status];
  const href =
    entry.status === "completed"
      ? `/patient/${entry.patientId}`
      : `/visit/${entry.visitId}`;

  return (
    <Link
      href={href}
      className="group relative flex items-center gap-3.5 rounded-2xl border border-border bg-white py-3.5 pl-3 pr-3.5 transition-colors hover:border-primary/30"
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
        <span className="truncate text-[12px] text-muted-foreground">
          {entry.age ? `${entry.age}y` : ""}
          {entry.age && entry.gender ? " · " : ""}
          {entry.gender === "M" ? "Male" : entry.gender === "F" ? "Female" : ""}
          {(entry.age || entry.gender) && entry.reason ? " · " : ""}
          {entry.reason}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        {entry.slot && (
          <span className="num-tabular text-[12px] font-medium text-foreground/80">
            {entry.slot}
          </span>
        )}
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10.5px] font-medium",
            cfg.className,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
          {cfg.label}
        </span>
      </div>
      <ChevronRight className="ml-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
    </Link>
  );
}
