"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { motion, MotionConfig, type Variants } from "framer-motion";
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
  ChevronDown,
} from "lucide-react";

const WHATSAPP_SUPPORT = "https://wa.me/923000000000";
const SUPPORT_EMAIL = "support@clinicflow.app";

const IMG = {
  hero: "https://images.unsplash.com/photo-1631558556874-1d127211f574?auto=format&fit=crop&w=2000&q=80",
  queue:
    "https://images.unsplash.com/photo-1631815590058-860e4f83c1e8?auto=format&fit=crop&w=1200&q=80",
  memory:
    "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1200&q=80",
  rx: "https://images.unsplash.com/photo-1652787542567-f86c0b4c0269?auto=format&fit=crop&w=1200&q=80",
  whatsapp:
    "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?auto=format&fit=crop&w=1200&q=80",
  team: "https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&w=1200&q=80",
};

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const fromLeft: Variants = {
  hidden: { opacity: 0, x: -90 },
  show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
};
const fromRight: Variants = {
  hidden: { opacity: 0, x: 90 },
  show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
};
const pop: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const VIEW = { once: true, amount: 0.3 } as const;

export function LandingClient() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-background text-foreground">
        <SiteHeader />
        <main>
          <Hero />
          <Spotlights />
          <HowItWorks />
          <Pricing />
          <DownloadApp />
          <Support />
          <FinalCta />
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────── Header ─────────────────────────── */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-foreground/80 backdrop-blur-md supports-[backdrop-filter]:bg-foreground/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-white shadow-soft">
            <HeartPulse className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </span>
          <span className="text-[16px] font-semibold tracking-tight">ClinicFlow</span>
          <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-white/90">
            Beta
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13.5px] font-medium text-white/70 md:flex">
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
          <a href="#download" className="transition-colors hover:text-white">Mobile app</a>
          <a href="#support" className="transition-colors hover:text-white">Support</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="hidden h-9 items-center rounded-lg px-3 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/10 sm:flex"
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
    <section className="relative -mt-16 flex min-h-[100svh] items-center overflow-hidden">
      {/* Full-bleed image */}
      <img
        src={IMG.hero}
        alt="Doctor talking with a patient during a clinic consultation"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      {/* Dark scrim for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/65 to-foreground/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent" />

      {/* Hero text is visible by default (no JS gate) with a robust CSS
          stagger — the requested slide/fade/stagger animations live in the
          scrolling sections below. */}
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-28 lg:px-8 lg:pt-32">
        <h1 className="max-w-3xl animate-slide-up font-display text-[40px] leading-[1.05] text-white text-balance motion-reduce:animate-none sm:text-[56px] lg:text-[66px]">
          A calm operating system for your clinic
        </h1>

        <p className="mt-6 max-w-xl animate-slide-up text-[16px] leading-relaxed text-white/85 [animation-delay:90ms] [animation-fill-mode:backwards] motion-reduce:animate-none sm:text-[17.5px]">
          Run the daily queue, remember every patient, capture handwritten
          prescriptions, and follow up on WhatsApp — all from one phone. Built
          for clinics across Pakistan.
        </p>

        <div className="mt-8 flex animate-slide-up flex-col gap-3 [animation-delay:180ms] [animation-fill-mode:backwards] motion-reduce:animate-none sm:flex-row sm:items-center">
          <Link
            href="/signup"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white shadow-float transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Start free
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </Link>
          <a
            href="#features"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            See how it works
          </a>
        </div>

        <div className="mt-6 flex animate-slide-up flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px] text-white/80 [animation-delay:270ms] [animation-fill-mode:backwards] motion-reduce:animate-none">
          {["Free during beta", "Works on any Android", "Ready in 2 minutes"].map(
            (t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-300" strokeWidth={2.6} />
                {t}
              </span>
            ),
          )}
        </div>
      </div>

      <a
        href="#features"
        aria-label="Scroll to features"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}

/* ─────────────────────── Feature spotlights ─────────────────────── */

type Spotlight = {
  img: string;
  alt: string;
  badge: string;
  icon: typeof Clock3;
  title: string;
  body: string;
  points: string[];
};

const SPOTLIGHTS: Spotlight[] = [
  {
    img: IMG.queue,
    alt: "Doctor attending to a patient in a clinic",
    badge: "Daily queue",
    icon: Clock3,
    title: "Today's queue, always in order",
    body: "Check patients in, assign tokens, and see who's waiting, in a visit, or done — at a glance, on any screen.",
    points: [
      "Token-based check-in",
      "Live waiting / in-visit / done",
      "Search any patient instantly",
    ],
  },
  {
    img: IMG.memory,
    alt: "Clinician reviewing patient records on a laptop",
    badge: "Patient memory",
    icon: NotebookText,
    title: "Remember every patient",
    body: "Every visit, diagnosis, and note in one timeline — so you know the history before the patient even sits down.",
    points: ["Full visit history", "Diagnoses & notes", "No more paper files"],
  },
  {
    img: IMG.rx,
    alt: "Notebook, stethoscope and laptop on a desk",
    badge: "Prescriptions",
    icon: Camera,
    title: "Keep writing by hand — we'll remember it",
    body: "Photograph the handwritten prescription and it's saved to the visit forever, searchable any time you need it.",
    points: [
      "Snap & attach in seconds",
      "Linked to the visit",
      "Private, secure storage",
    ],
  },
  {
    img: IMG.whatsapp,
    alt: "Hand holding a smartphone",
    badge: "Follow-ups",
    icon: MessageCircle,
    title: "Bring patients back on WhatsApp",
    body: "One tap sends a follow-up reminder on WhatsApp, in the language your patient reads. No copy-pasting numbers.",
    points: ["One-tap reminders", "Urdu or English", "Never lose a follow-up"],
  },
  {
    img: IMG.team,
    alt: "Medical team together in a clinic",
    badge: "Built for teams",
    icon: Users,
    title: "Front desk and doctors, in sync",
    body: "Reception checks patients in; the doctor starts the visit when the patient is in the room. One shared, live queue.",
    points: ["Roles for staff & doctors", "One live clinic view", "No double entry"],
  },
];

function Spotlights() {
  return (
    <section id="features" className="scroll-mt-16">
      {SPOTLIGHTS.map((s, i) => (
        <SpotlightRow key={s.title} {...s} reverse={i % 2 === 1} />
      ))}
    </section>
  );
}

function SpotlightRow({
  img,
  alt,
  badge,
  icon: Icon,
  title,
  body,
  points,
  reverse,
}: Spotlight & { reverse: boolean }) {
  return (
    <div className={reverse ? "bg-muted/30" : "bg-background"}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* Image — slides in from its side */}
        <motion.div
          variants={reverse ? fromRight : fromLeft}
          initial="hidden"
          whileInView="show"
          viewport={VIEW}
          className={reverse ? "lg:order-2" : ""}
        >
          <div className="relative overflow-hidden rounded-[28px] border border-border bg-white shadow-card">
            <img
              src={img}
              alt={alt}
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/5" />
          </div>
        </motion.div>

        {/* Text — staggers in */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEW}
          className={reverse ? "lg:order-1" : ""}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wide text-primary"
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
            {badge}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-[28px] leading-tight text-balance sm:text-[34px]"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-3 text-[15px] leading-relaxed text-muted-foreground"
          >
            {body}
          </motion.p>
          <motion.ul variants={stagger} className="mt-6 flex flex-col gap-3">
            {points.map((p) => (
              <motion.li
                key={p}
                variants={fadeUp}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-[14px] leading-relaxed text-foreground/80">
                  {p}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────── How it works ─────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Reception adds the patient",
      body: "They join today's queue with a token — no paper register, no waiting-list confusion.",
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
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionIntro
          eyebrow="How it works"
          title="From walk-in to follow-up in three steps"
          desc="The whole visit, captured without slowing the doctor down."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEW}
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {steps.map((s) => (
            <motion.div
              key={s.n}
              variants={pop}
              className="rounded-3xl border border-border bg-white p-6 shadow-soft"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-[18px] font-bold text-white shadow-soft num-tabular">
                {s.n}
              </span>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
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
    <section id="pricing" className="scroll-mt-16 bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionIntro
          eyebrow="Simple pricing"
          title="Free while we're in beta"
          desc="Start free today. Paid plans bill in rupees via JazzCash & Easypaisa as they roll out — no card needed."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-5 lg:grid-cols-3"
        >
          {tiers.map((t) => (
            <motion.div
              key={t.name}
              variants={pop}
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
                <span className="font-display text-[34px] leading-none">{t.price}</span>
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
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
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
            </motion.div>
          ))}
        </motion.div>
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
    <section id="download" className="scroll-mt-16 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-border bg-gradient-hero p-8 lg:p-12">
          <div className="absolute inset-0 bg-plus-grid text-primary/10" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={VIEW}
            >
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11.5px] font-semibold text-primary shadow-soft"
              >
                <Smartphone className="h-3.5 w-3.5" strokeWidth={2.2} />
                Take it with you
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="mt-4 font-display text-[30px] leading-tight text-balance sm:text-[36px]"
              >
                Use it on the web today. Native apps are coming.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground"
              >
                ClinicFlow runs in any mobile browser — add it to your home
                screen and it opens like an app. Dedicated iOS and Android apps
                are on the way.
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              >
                <Link
                  href="/signup"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[14.5px] font-semibold text-white shadow-soft transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  Open the web app
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </Link>
                <StoreBadge icon={Apple} top="Coming soon to" bottom="the App Store" />
                <StoreBadge icon={Play} top="Coming soon to" bottom="Google Play" />
              </motion.div>
            </motion.div>

            <motion.div
              variants={fromRight}
              initial="hidden"
              whileInView="show"
              viewport={VIEW}
              className="mx-auto w-full max-w-[230px]"
            >
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
                      <div key={i} className={`h-9 rounded-xl ${b.c} ${b.w}`} />
                    ))}
                  </div>
                  <div className="mt-4 h-11 rounded-xl bg-primary" />
                </div>
              </div>
            </motion.div>
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
    <section id="support" className="scroll-mt-16 bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionIntro
          eyebrow="Support"
          title="Real people, in your time zone"
          desc="We're a small team building for Pakistani clinics. When you need us, we're a message away."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEW}
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          {channels.map((c) => (
            <motion.a
              key={c.title}
              variants={pop}
              href={c.href}
              className="group flex flex-col rounded-3xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.bg} ${c.tone}`}>
                <c.icon className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
                {c.body}
              </p>
              <span className={`mt-4 inline-flex items-center gap-1 text-[13px] font-semibold ${c.tone}`}>
                {c.action}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Final CTA ─────────────────────────── */

function FinalCta() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <motion.div
          variants={pop}
          initial="hidden"
          whileInView="show"
          viewport={VIEW}
          className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-14 text-center shadow-float lg:py-20"
        >
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
        </motion.div>
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
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-white shadow-soft">
                <HeartPulse className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </span>
              <span className="text-[16px] font-semibold tracking-tight">ClinicFlow</span>
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
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      className="mx-auto max-w-2xl text-center"
    >
      <motion.span
        variants={fadeUp}
        className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className="mt-2 font-display text-[30px] leading-tight text-balance sm:text-[38px]"
      >
        {title}
      </motion.h2>
      <motion.p
        variants={fadeUp}
        className="mt-3 text-[15px] leading-relaxed text-muted-foreground"
      >
        {desc}
      </motion.p>
    </motion.div>
  );
}
