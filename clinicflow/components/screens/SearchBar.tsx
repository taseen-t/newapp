"use client";

import { Search, SlidersHorizontal } from "lucide-react";

export function SearchBar() {
  return (
    <div className="px-5 pt-5">
      <div className="flex items-center gap-2.5 rounded-2xl border border-border/70 bg-white px-4 py-3 shadow-soft transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
        <Search className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={2} />
        <input
          className="flex-1 bg-transparent text-[14px] placeholder:text-muted-foreground focus:outline-none"
          placeholder="Search patient, phone, diagnosis…"
        />
        <button
          aria-label="Filters"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-foreground/60 transition-colors hover:bg-border"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
