import Link from "next/link";
import type { Metadata } from "next";
import {
  HeartPulse,
  ArrowRight,
  Check,
  Clock3,
  NotebookText,
  Camera,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  Users,
  Sparkles,
  Apple,
  Play,
  LifeBuoy,
  Mail,
  Star,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "ClinicFlow — A calm operating system for your clinic",
  description:
    "Run the daily queue, remember every patient, capture handwritten prescriptions, and follow up on WhatsApp. Built for solo doctors and small clinics in Pakistan.",
  openGraph: {
    title: "ClinicFlow — A calm OS for your clinic",
    description:
      "Queue, patient memory, prescription photos, and WhatsApp follow-ups — from one phone. Made for clinics in Pakistan.",
    type: "website",
  },
};

const WHATSAPP_SUPPORT = "https://wa.me/923000000000";
const SUPPORT_EMAIL = "support@clinicflow.app";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <TrustStrip />
        <Features />
        <Teams />
        <HowItWorks />
        <Pricing />
        <DownloadApp />
        <Support />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ─────────────────────────── Header ─────────────────────────── */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground shadow-soft">
            <HeartPulse className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </span>
          <span className="text-[16px] font-semibold tracking-tight">
            ClinicFlow
          </span>
          <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-accent">
            Beta
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13.5px] font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
          <a href="#download" className="transition-colors hover:text-foreground">
            Mobile app
          </a>
          <a href="#support" className="transition-colors hover:text-foreground">
            Support
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="hidden h-9 items-center rounded-lg px-3 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-muted sm:flex"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-white shadow-soft transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Start free
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-hero" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-primary shadow-soft">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-primary/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Made for clinics in Pakistan
          </span>

          <h1 className="mt-5 font-display text-[40px] leading-[1.05] text-balance sm:text-[52px] lg:text-[58px]">
            A calm operating system for your clinic
          </h1>

          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground sm:text-[16.5px]">
            ClinicFlow helps solo doctors and small clinics run the daily queue,
            remember every patient, capture handwritten prescriptions, and follow
            up on WhatsApp — all from one phone.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white shadow-float transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Start free
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
            <a
              href="#how"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 text-[15px] font-semibold text-foreground/80 transition-colors hover:bg-muted"
            >
              See how it works
            </a>
          </div>

          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" strokeWidth={2.5} />
              Free during beta
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" strokeWidth={2.5} />
              Works on any Android
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" strokeWidth={2.5} />
              Ready in 2 minutes
            </span>
          </p>
        </div>

        <HeroMock />
      </div>
    </section>
  );
}

function HeroMock() {
  const rows = [
    { token: 1, name: "Hassan Raza", initials: "HR", status: "waiting" as const },
    { token: 2, name: "Fatima Khan", initials: "FK", status: "in-progress" as const },
    { token: 3, name: "Bilal Ahmed", initials: "BA", status: "completed" as const },
  ];
  const statusUi = {
    waiting: { label: "Waiting", dot: "bg-amber-500", text: "text-amber-700" },
    "in-progress": { label: "In visit", dot: "bg-primary", text: "text-primary" },
    completed: { label: "Done", dot: "bg-success", text: "text-success" },
  };

  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <div className="absolute -right-6 -top-6 hidden h-24 w-24 rounded-3xl bg-accent-soft blur-2xl lg:block" />
      <div className="relative overflow-hidden rounded-[28px] border border-border bg-white p-5 shadow-float">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-[19px] leading-none">Today&apos;s queue</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              3 patients · 1 waiting
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[10.5px] font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Clinic open
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {rows.map((r) => {
            const s = statusUi[r.status];
            return (
              <div
                key={r.token}
                className="flex items-center gap-3 rounded-2xl border border-border bg-white py-2.5 pl-3 pr-2.5"
              >
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <span className="text-[7.5px] font-semibold uppercase leading-none tracking-wider text-primary/60">
                    Token
                  </span>
                  <span className="mt-0.5 text-[15px] font-bold leading-none num-tabular">
                    {r.token}
                  </span>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground/70">
                  {r.initials}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[13.5px] font-semibold tracking-tight">
                    {r.name}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10.5px] font-medium ${s.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </div>
                {r.status === "waiting" ? (
                  <span className="flex shrink-0 items-center gap-1 rounded-xl bg-primary px-3 py-2 text-[11.5px] font-semibold text-white">
                    <Play className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                    Start
                  </span>
                ) : r.status === "in-progress" ? (
                  <span className="shrink-0 rounded-xl border border-primary/30 bg-primary-soft px-3 py-2 text-[11.5px] font-semibold text-primary">
                    Resume
                  </span>
                ) : (
                  <span className="shrink-0 rounded-xl border border-border px-3 py-2 text-[11.5px] font-medium text-muted-foreground">
                    View
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { k: "Today", v: "12" },
            { k: "Follow-ups", v: "4" },
            { k: "New", v: "3" },
          ].map((m) => (
            <div
              key={m.k}
              className="rounded-2xl border border-border bg-muted/40 px-3 py-2.5 text-center"
            >
              <p className="text-[18px] font-bold num-tabular leading-none">{m.v}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{m.k}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Trust strip ─────────────────────────── */

function TrustStrip() {
  const items = [
    "No more patient diaries",
    "WhatsApp follow-ups",
    "Handwritten Rx, digitized",
    "Works on low data",
  ];
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 lg:px-8">
        {items.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground"
          >
            <Check className="h-4 w-4 text-primary" strokeWidth={2.4} />
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── Features ─────────────────────────── */

function Features() {
  const features = [
    {
      icon: Clock3,
      title: "Today's queue & tokens",
      body: "Check patients in, assign tokens, and see who's waiting, in-visit, or done — at a glance.",
    },
    {
      icon: NotebookText,
      title: "Patient memory",
      body: "Every visit, diagnosis, and note in one timeline. Never ask 'have we met before?' again.",
    },
    {
      icon: Camera,
      title: "Snap the prescription",
      body: "Keep writing by hand. Photograph the Rx and it's saved to the visit, searchable forever.",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp follow-ups",
      body: "One tap sends a follow-up reminder on WhatsApp, in the language your patient reads.",
    },
    {
      icon: Smartphone,
      title: "Works on any phone",
      body: "Mobile-first and light. No installs, no training — open the link and you're running.",
    },
    {
      icon: ShieldCheck,
      title: "Private by design",
      body: "Each clinic's data is isolated and secured at the database level. Only your team can see it.",
    },
  ];

  return (
    <section id="features" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionIntro
          eyebrow="Everything in one place"
          title="The day-to-day, made calm"
          desc="ClinicFlow covers the real work of a busy clinic — without the paperwork, training, or expensive hardware."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <f.icon className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Teams ─────────────────────────── */

function Teams() {
  const points = [
    "Front-desk staff add patients to the queue and assign tokens.",
    "Doctors start the visit, write notes, and capture the prescription.",
    "Everyone shares one live view of the clinic — no double entry.",
  ];
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wide text-primary">
            <Users className="h-3.5 w-3.5" strokeWidth={2.2} />
            Built for teams
          </span>
          <h2 className="mt-4 font-display text-[30px] leading-tight text-balance sm:text-[36px]">
            Your front desk and your doctors, in sync
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            ClinicFlow separates the receptionist&apos;s job from the doctor&apos;s.
            Reception checks patients in; the doctor starts the visit only when
            the patient is in the room. One clinic, one shared queue.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-[14px] leading-relaxed text-foreground/80">
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-3xl border border-border bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3">
            {[
              { role: "Front desk", name: "Reception", initials: "RD", tone: "bg-accent-soft text-accent" },
              { role: "Doctor", name: "Dr. Imran Khan", initials: "IK", tone: "bg-primary-soft text-primary" },
              { role: "Doctor", name: "Dr. Sana Tariq", initials: "ST", tone: "bg-primary-soft text-primary" },
            ].map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-3 rounded-2xl border border-border bg-white px-3.5 py-3"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-semibold ${m.tone}`}>
                  {m.initials}
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="text-[13.5px] font-semibold tracking-tight">
                    {m.name}
                  </span>
                  <span className="text-[11.5px] text-muted-foreground">{m.role}</span>
                </div>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Active
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[11.5px] text-muted-foreground">
            Staff accounts roll out with the Clinic plan.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── How it works ─────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Reception adds the patient",
      body: "They join today's queue with a token — no paper register, no waiting list confusion.",
    },
    {
      n: "2",
      title: "Doctor starts the visit",
      body: "Tap Start when the patient is in the room. Write notes and snap the handwritten Rx.",
    },
    {
      n: "3",
      title: "Follow up on WhatsApp",
      body: "ClinicFlow remembers the visit and nudges you to check in — one tap, straight to WhatsApp.",
    },
  ];
  return (
    <section id="how" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionIntro
          eyebrow="How it works"
          title="From walk-in to follow-up in three steps"
          desc="The whole visit, captured without slowing the doctor down."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-3xl border border-border bg-white p-6 shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-[18px] font-bold text-white shadow-soft num-tabular">
                {s.n}
              </span>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Pricing ─────────────────────────── */

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "Rs 0",
      cadence: "during beta",
      highlight: false,
      desc: "Everything a solo doctor needs to get started.",
      features: [
        "1 doctor account",
        "Unlimited patients & visits",
        "Today's queue & tokens",
        "Prescription photo capture",
        "WhatsApp follow-ups",
      ],
      cta: "Start free",
      href: "/signup",
    },
    {
      name: "Clinic",
      price: "Rs 1,500",
      cadence: "per month",
      highlight: true,
      desc: "For a clinic with a front desk and growing patient memory.",
      features: [
        "Everything in Free",
        "Front-desk staff accounts",
        "Patient history & search",
        "Priority WhatsApp support",
      ],
      cta: "Start free",
      href: "/signup",
    },
    {
      name: "Pro",
      price: "Rs 3,500",
      cadence: "per month",
      highlight: false,
      desc: "For multi-doctor clinics that want reporting and exports.",
      features: [
        "Everything in Clinic",
        "Multiple doctors",
        "Reports & data export",
        "Dedicated support",
      ],
      cta: "Talk to us",
      href: `mailto:${SUPPORT_EMAIL}`,
    },
  ];

  return (
    <section id="pricing" className="scroll-mt-20 bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionIntro
          eyebrow="Simple pricing"
          title="Free while we're in beta"
          desc="Start free today. Paid plans bill in rupees via JazzCash & Easypaisa as they roll out — no card needed."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-3xl border bg-white p-6 ${
                t.highlight
                  ? "border-primary/40 shadow-float ring-1 ring-primary/20 lg:-mt-3 lg:mb-3"
                  : "border-border shadow-soft"
              }`}
            >
              {t.highlight && (
                <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  <Star className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                  Popular
                </span>
              )}
              <h3 className="text-[15px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t.name}
              </h3>
              <div className="mt-3 flex items-end gap-1.5">
                <span className="font-display text-[34px] leading-none">
                  {t.price}
                </span>
                <span className="mb-1 text-[12.5px] text-muted-foreground">
                  {t.cadence}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {t.desc}
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px]">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-success"
                      strokeWidth={2.5}
                    />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.href}
                className={`mt-6 flex h-11 items-center justify-center gap-1.5 rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98] ${
                  t.highlight
                    ? "bg-primary text-white shadow-soft hover:brightness-110"
                    : "border border-border bg-white text-foreground hover:bg-muted"
                }`}
              >
                {t.cta}
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[12px] text-muted-foreground">
          Prices in PKR. During beta, every plan is free — you won&apos;t be charged.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────── Download app ─────────────────────────── */

function DownloadApp() {
  return (
    <section id="download" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-border bg-gradient-hero p-8 lg:p-12">
          <div className="absolute inset-0 -z-0 bg-plus-grid text-primary/10" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11.5px] font-semibold text-primary shadow-soft">
                <Smartphone className="h-3.5 w-3.5" strokeWidth={2.2} />
                Take it with you
              </span>
              <h2 className="mt-4 font-display text-[30px] leading-tight text-balance sm:text-[36px]">
                Use it on the web today. Native apps are coming.
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                ClinicFlow runs in any mobile browser — add it to your home
                screen and it opens like an app. Dedicated iOS and Android apps
                are on the way.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/signup"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[14.5px] font-semibold text-white shadow-soft transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  Open the web app
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </Link>
                <StoreBadge
                  icon={Apple}
                  top="Coming soon to"
                  bottom="the App Store"
                />
                <StoreBadge
                  icon={Play}
                  top="Coming soon to"
                  bottom="Google Play"
                />
              </div>
            </div>

            <div className="mx-auto w-full max-w-[230px]">
              <div className="rounded-[32px] border-[6px] border-foreground/85 bg-white p-3 shadow-float">
                <div className="rounded-[20px] bg-gradient-to-b from-primary-soft/60 to-white p-4">
                  <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-foreground/15" />
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                      <HeartPulse className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                    <span className="text-[13px] font-semibold">ClinicFlow</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      { w: "w-full", c: "bg-primary-soft" },
                      { w: "w-4/5", c: "bg-muted" },
                      { w: "w-full", c: "bg-muted" },
                      { w: "w-3/5", c: "bg-muted" },
                    ].map((b, i) => (
                      <div
                        key={i}
                        className={`h-9 rounded-xl ${b.c} ${b.w}`}
                      />
                    ))}
                  </div>
                  <div className="mt-4 h-11 rounded-xl bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoreBadge({
  icon: Icon,
  top,
  bottom,
}: {
  icon: typeof Apple;
  top: string;
  bottom: string;
}) {
  return (
    <span className="flex h-12 cursor-default items-center gap-2.5 rounded-xl border border-border bg-white/90 px-4 text-left opacity-90">
      <Icon className="h-5 w-5 text-foreground" strokeWidth={1.8} />
      <span className="flex flex-col leading-tight">
        <span className="text-[9.5px] uppercase tracking-wide text-muted-foreground">
          {top}
        </span>
        <span className="text-[13px] font-semibold text-foreground">{bottom}</span>
      </span>
    </span>
  );
}

/* ─────────────────────────── Support ─────────────────────────── */

function Support() {
  const channels = [
    {
      icon: MessageCircle,
      title: "WhatsApp us",
      body: "The fastest way to reach us. We reply Mon–Sat, 9am–9pm PKT.",
      action: "Chat on WhatsApp",
      href: WHATSAPP_SUPPORT,
      tone: "text-whatsapp",
      bg: "bg-whatsapp-soft",
    },
    {
      icon: Mail,
      title: "Email support",
      body: "Questions about your account, billing, or data? Drop us a line.",
      action: SUPPORT_EMAIL,
      href: `mailto:${SUPPORT_EMAIL}`,
      tone: "text-primary",
      bg: "bg-primary-soft",
    },
    {
      icon: LifeBuoy,
      title: "Help & onboarding",
      body: "New to ClinicFlow? We'll help you set up your clinic in minutes.",
      action: "Get a hand",
      href: WHATSAPP_SUPPORT,
      tone: "text-accent",
      bg: "bg-accent-soft",
    },
  ];
  return (
    <section id="support" className="scroll-mt-20 bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionIntro
          eyebrow="Support"
          title="Real people, in your time zone"
          desc="We're a small team building for Pakistani clinics. When you need us, we're a message away."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="group flex flex-col rounded-3xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.bg} ${c.tone}`}>
                <c.icon className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight">
                {c.title}
              </h3>
              <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
                {c.body}
              </p>
              <span className={`mt-4 inline-flex items-center gap-1 text-[13px] font-semibold ${c.tone}`}>
                {c.action}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Final CTA ─────────────────────────── */

function FinalCta() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-14 text-center shadow-float lg:py-20">
          <div className="absolute inset-0 bg-plus-grid text-white/10" />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11.5px] font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
              Free during beta
            </span>
            <h2 className="mt-4 font-display text-[32px] leading-tight text-white text-balance sm:text-[40px]">
              Bring calm to your clinic
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/85">
              Set up your clinic in two minutes and run today's queue from your
              phone. No card, no training, no risk.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-primary shadow-soft transition-all hover:brightness-95 active:scale-[0.98]"
              >
                Start free
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
              <Link
                href="/login"
                className="flex h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Footer ─────────────────────────── */

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground shadow-soft">
                <HeartPulse className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </span>
              <span className="text-[16px] font-semibold tracking-tight">
                ClinicFlow
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              A calm operating system for solo doctors and small clinics in
              Pakistan.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "Mobile app", href: "#download" },
              { label: "Login", href: "/login" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "Support", href: "#support" },
              { label: "WhatsApp", href: WHATSAPP_SUPPORT },
              { label: "Email", href: `mailto:${SUPPORT_EMAIL}` },
              { label: "Start free", href: "/signup" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-[12px] text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} ClinicFlow. All rights reserved.</span>
          <span className="inline-flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
            Made for clinics in Pakistan
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[12px] font-semibold uppercase tracking-wide text-foreground">
        {title}
      </h4>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────── Shared ─────────────────────────── */

function SectionIntro({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-[30px] leading-tight text-balance sm:text-[38px]">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        {desc}
      </p>
    </div>
  );
}
