"use client";

import * as React from "react";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "info" | "success" | "warning";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    // Fallback: log so we don't crash if a button fires outside the provider
    return {
      toast: (msg: string) => console.log("[toast]", msg),
    };
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismiss = (id: number) =>
    setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-4 sm:bottom-4 sm:left-auto sm:right-4 sm:items-end safe-bottom">
        {items.map((t) => {
          const Icon =
            t.tone === "success"
              ? CheckCircle2
              : t.tone === "warning"
                ? AlertCircle
                : Info;
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border bg-white p-3 shadow-card",
                "animate-[slide-up_0.2s_cubic-bezier(0.16,1,0.3,1)]",
                t.tone === "success" && "border-success/30",
                t.tone === "warning" && "border-warning/30",
                t.tone === "info" && "border-border",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  t.tone === "success" && "text-success",
                  t.tone === "warning" && "text-amber-600",
                  t.tone === "info" && "text-primary",
                )}
                strokeWidth={2.2}
              />
              <span className="flex-1 text-[13px] leading-snug text-foreground">
                {t.message}
              </span>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
