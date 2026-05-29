import type { Metadata } from "next";
import { LandingClient } from "./LandingClient";

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

export default function LandingPage() {
  return <LandingClient />;
}
