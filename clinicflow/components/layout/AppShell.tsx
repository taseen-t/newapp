import * as React from "react";
import { cn } from "@/lib/utils";
import { SideNav } from "./SideNav";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  withNav?: boolean;
  /** When true, content has a max width on desktop (good for forms). */
  narrow?: boolean;
}

export function AppShell({
  children,
  className,
  withNav = true,
  narrow = false,
}: AppShellProps) {
  return (
    <div className="relative min-h-dvh w-full bg-muted/40 lg:flex">
      {/* Subtle paper grain — atmospheric texture, desktop only */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden bg-paper opacity-[0.35] lg:block" />
      <SideNav />

      {/* Single container — mobile phone-frame styles, overridden to fluid on lg+ */}
      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-background shadow-[0_0_0_1px_rgba(15,23,42,0.04)]",
          "sm:my-6 sm:min-h-[calc(100dvh-3rem)] sm:rounded-[32px] sm:shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)]",
          "lg:my-0 lg:mx-0 lg:max-w-none lg:flex-1 lg:rounded-none lg:bg-transparent lg:shadow-none",
        )}
      >
        <main
          className={cn(
            "relative flex-1 overflow-hidden sm:rounded-[32px] lg:overflow-visible lg:rounded-none",
            withNav && "pb-24 lg:pb-0",
            !narrow && "lg:px-10 lg:py-7 xl:px-14",
            narrow && "lg:mx-auto lg:w-full lg:max-w-[640px] lg:px-10 lg:py-10",
            className,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
