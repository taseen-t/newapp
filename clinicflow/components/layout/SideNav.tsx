"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BellRing,
  Users,
  Settings,
  Shield,
  Plus,
  Search,
  ChevronsUpDown,
  Activity,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClinic } from "@/components/providers/ClinicProvider";
import { useToast } from "@/components/ui/toast";
import { signOut } from "@/app/actions/auth";

export function SideNav() {
  const pathname = usePathname();
  const { toast } = useToast();
  const clinic = useClinic();

  const clinicGroup = [
    {
      href: "/dashboard",
      label: "Today",
      icon: Home,
      badge: clinic.queueCount > 0 ? String(clinic.queueCount) : undefined,
    },
    {
      href: "/follow-ups",
      label: "Follow-ups",
      icon: BellRing,
      badge: clinic.pendingCount > 0 ? String(clinic.pendingCount) : undefined,
      badgeTone: "danger" as const,
    },
  ];

  const patientsGroup = [
    { href: "/patients", label: "Patients", icon: Users },
    { href: "#", label: "Vitals", icon: Activity },
  ];

  const settingsGroup = [
    { href: "/settings", label: "Settings", icon: Settings },
    ...(clinic.isAdmin
      ? [{ href: "/admin", label: "Admin", icon: Shield }]
      : []),
  ];

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    const root = href.split("/").slice(0, 2).join("/");
    return pathname?.startsWith(root);
  }

  return (
    <aside className="hidden h-dvh shrink-0 flex-col border-r border-border bg-white lg:flex lg:w-[248px]">
      {/* Brand row */}
      <div className="flex h-16 items-center gap-2.5 px-4">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground shadow-soft">
          <HeartPulse className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </div>
        <span className="text-[15.5px] font-semibold tracking-tight text-foreground">
          ClinicFlow
        </span>
        <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-accent">
          Beta
        </span>
      </div>

      {/* Add patient CTA + search */}
      <div className="px-3 pb-3">
        <Link
          href="/add-patient"
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] bg-primary text-[13px] font-semibold text-white shadow-soft transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={3} />
          Add patient
        </Link>
        <button
          onClick={() =>
            toast("Search coming up — global ⌘K search is on the roadmap.")
          }
          className="mt-2 flex h-9 w-full items-center gap-2 rounded-[10px] border border-border bg-muted/50 px-2.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search anything…</span>
          <kbd className="rounded border border-border bg-white px-1 py-0 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 pt-2">
        <NavGroup title="Clinic">
          {clinicGroup.map((it) => (
            <NavItem key={it.label} {...it} active={isActive(it.href)} />
          ))}
        </NavGroup>

        <NavGroup title="Patients">
          {patientsGroup.map((it) => (
            <NavItem
              key={it.label}
              {...it}
              active={isActive(it.href)}
              onComingSoon={
                it.href === "#"
                  ? () => toast(`${it.label} module coming next sprint.`)
                  : undefined
              }
            />
          ))}
        </NavGroup>

        <NavGroup title="Settings">
          {settingsGroup.map((it) => (
            <NavItem
              key={it.label}
              {...it}
              active={isActive(it.href)}
              onComingSoon={
                it.href === "#"
                  ? () => toast(`${it.label} module coming next sprint.`)
                  : undefined
              }
            />
          ))}
        </NavGroup>
      </nav>

      {/* Status pill */}
      <div className="px-3">
        <div className="flex items-center gap-2 rounded-[10px] border border-border bg-success-soft/60 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-success/60" />
            <span className="relative h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="flex-1 text-[11.5px] font-medium text-foreground">
            Clinic open
          </span>
          {clinic.openUntil && (
            <span className="text-[10.5px] text-muted-foreground">
              until {clinic.openUntil}
            </span>
          )}
        </div>
      </div>

      {/* Profile */}
      <div className="border-t border-border p-3 mt-3">
        <button
          onClick={() => signOut()}
          title="Sign out"
          className="flex w-full items-center gap-2.5 rounded-[10px] p-1.5 text-left transition-colors hover:bg-muted"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary-soft text-[11.5px] font-semibold text-primary">
            {clinic.initials}
          </div>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-[12.5px] font-semibold text-foreground">
              {clinic.doctorName}
            </span>
            <span className="truncate text-[10.5px] text-muted-foreground">
              {clinic.doctorTitle || clinic.clinicName}
            </span>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </aside>
  );
}

function NavGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
        {title}
      </span>
      {children}
    </div>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  badge,
  badgeTone,
  active,
  onComingSoon,
}: {
  href: string;
  label: string;
  icon: typeof Stethoscope;
  badge?: string;
  badgeTone?: "danger";
  active: boolean;
  onComingSoon?: () => void;
}) {
  const className = cn(
    "group relative flex h-9 items-center gap-2.5 rounded-[10px] px-3 text-[13px] font-medium transition-colors",
    active
      ? "bg-primary-soft text-primary"
      : "text-foreground/70 hover:bg-muted hover:text-foreground",
  );

  const inner = (
    <>
      <Icon
        className={cn(
          "h-[16px] w-[16px] shrink-0",
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
        strokeWidth={2}
      />
      <span className="flex-1">{label}</span>
      {badge && (
        <span
          className={cn(
            "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-md px-1 text-[10.5px] font-semibold",
            badgeTone === "danger"
              ? "bg-danger text-white"
              : active
                ? "bg-white text-primary"
                : "bg-muted text-muted-foreground",
          )}
        >
          {badge}
        </span>
      )}
    </>
  );

  if (onComingSoon) {
    return (
      <button onClick={onComingSoon} className={cn(className, "w-full text-left")}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
