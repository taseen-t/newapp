/** Strip all non-digits from a phone number for use in wa.me / tel: URLs. */
export function digitsOnly(phone: string): string {
  return phone.replace(/\D+/g, "");
}

/** Build a tel: URL. */
export function telUrl(phone: string): string {
  return `tel:+${digitsOnly(phone)}`;
}

/** Build a wa.me URL with an optional prefilled message. */
export function whatsappUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${digitsOnly(phone)}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Default follow-up reminder template. */
export function followUpMessage(
  patientName: string,
  tag: string,
  due: string,
  clinic: { clinicName: string; doctorName: string },
): string {
  const firstName = patientName.split(" ")[0];
  const date = new Date(due).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
  });
  return `Assalam-o-Alaikum ${firstName}, this is from ${clinic.clinicName}. Friendly reminder for your ${tag} follow-up on ${date}. Please reply with a convenient time and we'll book you in. — ${clinic.doctorName}`;
}

/** Open a URL in a new tab safely. */
export function openExternal(url: string) {
  if (typeof window === "undefined") return;
  window.open(url, "_blank", "noopener,noreferrer");
}
