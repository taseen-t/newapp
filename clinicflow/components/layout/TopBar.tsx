"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  action?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export function TopBar({
  title,
  subtitle,
  backHref,
  action,
  transparent,
  className,
}: TopBarProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between gap-2 px-3",
        transparent ? "bg-transparent" : "glass border-b border-border/60",
        className,
      )}
    >
      <button
        onClick={() => (backHref ? router.push(backHref) : router.back())}
        aria-label="Back"
        className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted active:bg-muted/80"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
      </button>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {title && (
          <h1 className="text-[15px] font-semibold tracking-tight leading-tight">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-[11px] text-muted-foreground leading-tight">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex h-10 w-10 items-center justify-center">
        {action ?? (
          <button
            aria-label="More"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
