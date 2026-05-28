import * as React from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  withNav?: boolean;
}

export function AppShell({
  children,
  className,
  withNav = true,
}: AppShellProps) {
  return (
    <div className="min-h-dvh w-full bg-muted/40">
      <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-background shadow-[0_0_0_1px_rgba(15,23,42,0.04)] sm:my-6 sm:min-h-[calc(100dvh-3rem)] sm:rounded-[32px] sm:shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)]">
        <main
          className={cn(
            "relative flex-1 overflow-hidden sm:rounded-[32px]",
            withNav && "pb-24",
            className,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
