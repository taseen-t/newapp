import Link from "next/link";
import { HeartPulse, ShieldCheck, MessageCircle, Brain } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Clinic memory",
    sub: "Every patient's history, one tap away.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp follow-ups",
    sub: "Bring patients back without lifting a finger.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    sub: "Your clinic's data is isolated and secure.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full bg-muted/30 lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden overflow-hidden bg-gradient-hero p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="bg-plus-grid pointer-events-none absolute inset-0 text-primary/10" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-soft">
            <HeartPulse className="h-5 w-5 text-primary" strokeWidth={2.2} />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-foreground">
            ClinicFlow
          </span>
        </Link>

        <div className="relative">
          <h1 className="font-display text-[40px] leading-[1.08] text-balance text-foreground">
            A calm operating system for your clinic.
          </h1>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-foreground/70">
            Register patients in seconds, keep the memory of every visit, and
            follow up on WhatsApp — built for clinics in Pakistan.
          </p>

          <ul className="mt-9 flex flex-col gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-primary shadow-soft">
                    <Icon className="h-4 w-4" strokeWidth={2.2} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[13.5px] font-semibold text-foreground">
                      {f.title}
                    </span>
                    <span className="text-[12.5px] text-foreground/60">
                      {f.sub}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative text-[12px] text-foreground/50">
          14-day free trial · No card required to start
        </p>
      </aside>

      {/* Form side */}
      <main className="flex min-h-dvh flex-col px-6 py-10 sm:px-10 lg:px-14">
        <Link
          href="/"
          className="flex items-center gap-2 lg:hidden"
          aria-label="ClinicFlow home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <HeartPulse className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </span>
          <span className="text-[16px] font-semibold tracking-tight">
            ClinicFlow
          </span>
        </Link>

        <div className="flex flex-1 flex-col justify-center py-10">
          <div className="mx-auto w-full max-w-[400px]">{children}</div>
        </div>
      </main>
    </div>
  );
}
