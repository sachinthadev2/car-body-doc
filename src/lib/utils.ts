import type { BookingStatus, QuoteStatus, ServiceType } from "@/generated/prisma/enums";

/** Tiny classnames helper - keeps conditional Tailwind classes readable. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const AUD = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

export function formatMoney(cents: number | null | undefined) {
  if (cents === null || cents === undefined) return "—";
  return AUD.format(cents / 100);
}

export function dollarsToCents(value: string | number) {
  const n = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Human reference shown to customers, e.g. CBD-Q-8F3K2A. */
export function makeReference(kind: "Q" | "B") {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CBD-${kind}-${out}`;
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  SMASH_REPAIRS: "Smash Repairs",
  SPRAY_PAINT: "Spray Paint",
  BUFF_POLISH: "Buff & Polish",
  DENT_SCRATCH: "Dent & Scratch Removal",
  OTHER: "Something Else",
};

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  QUOTED: "Quoted",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  CLOSED: "Closed",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const TIME_SLOT_LABELS = {
  MORNING: "Morning (7am - 12pm)",
  AFTERNOON: "Afternoon (12pm - 5pm)",
} as const;

export const CONTACT_METHOD_LABELS = {
  PHONE: "Phone call",
  SMS: "Text message",
  EMAIL: "Email",
} as const;

export function statusTone(status: QuoteStatus | BookingStatus) {
  switch (status) {
    case "NEW":
    case "PENDING":
      return "bg-red-500/15 text-red-300 ring-red-500/30";
    case "REVIEWING":
    case "IN_PROGRESS":
      return "bg-amber-500/15 text-amber-300 ring-amber-500/30";
    case "QUOTED":
    case "CONFIRMED":
      return "bg-sky-500/15 text-sky-300 ring-sky-500/30";
    case "ACCEPTED":
    case "COMPLETED":
      return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30";
    default:
      return "bg-zinc-500/15 text-zinc-400 ring-zinc-500/30";
  }
}
