"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BellRing, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Today", icon: Home },
  { href: "/follow-ups", label: "Follow-ups", icon: BellRing },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/add-patient", label: "Add", icon: Plus },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center px-4 safe-bottom lg:hidden">
      <nav className="pointer-events-auto flex w-full items-center justify-around rounded-full border border-border/70 bg-white/90 px-2 py-2 shadow-card backdrop-blur-md">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(href.split("/").slice(0, 2).join("/"));
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1.5"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-primary-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                className={cn(
                  "relative h-[19px] w-[19px] transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                strokeWidth={2}
              />
              <span
                className={cn(
                  "relative text-[10px] font-medium tracking-tight transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
