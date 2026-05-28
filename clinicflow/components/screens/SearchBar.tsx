"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface SearchBarProps {
  value?: string;
  onChange?: (v: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { toast } = useToast();
  const controlled = onChange !== undefined;

  return (
    <div className="px-5 pt-5">
      <div className="flex items-center gap-2.5 rounded-2xl border border-border/70 bg-white px-4 py-3 shadow-soft transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
        <Search className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={2} />
        <input
          className="flex-1 bg-transparent text-[14px] placeholder:text-muted-foreground focus:outline-none"
          placeholder="Search patient, phone, diagnosis…"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
        />
        {controlled && value && value.length > 0 ? (
          <button
            aria-label="Clear search"
            onClick={() => onChange?.("")}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-foreground/60 transition-colors hover:bg-border"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.4} />
          </button>
        ) : (
          <button
            aria-label="Filters"
            onClick={() => toast("Filters coming next sprint.")}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-foreground/60 transition-colors hover:bg-border"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        )}
      </div>
    </div>
  );
}
