import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Desktop-only page header. Hidden on mobile (use TopBar there). */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "hidden lg:flex lg:items-end lg:justify-between lg:gap-6 lg:pb-6",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        {eyebrow && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
        )}
        <h1 className="text-[26px] font-semibold tracking-tight leading-none">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
