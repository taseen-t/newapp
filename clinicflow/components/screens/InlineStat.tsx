import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineStatProps {
  label: string;
  value: string;
  delta?: { value: string; direction: "up" | "down" | "flat"; tone: "positive" | "negative" | "neutral" };
  vs?: string;
}

export function InlineStat({ label, value, delta, vs }: InlineStatProps) {
  const DeltaIcon =
    delta?.direction === "down"
      ? ArrowDownRight
      : delta?.direction === "flat"
        ? Minus
        : ArrowUpRight;

  return (
    <div className="flex flex-col gap-1.5 px-5 py-4 lg:px-6">
      <span className="text-[11.5px] font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="num-tabular text-[26px] font-semibold leading-none text-foreground">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[12px] font-medium",
              delta.tone === "positive" && "text-success",
              delta.tone === "negative" && "text-danger",
              delta.tone === "neutral" && "text-muted-foreground",
            )}
          >
            <DeltaIcon className="h-3 w-3" strokeWidth={2.6} />
            {delta.value}
          </span>
        )}
      </div>
      {vs && (
        <span className="text-[11px] text-muted-foreground">{vs}</span>
      )}
    </div>
  );
}
