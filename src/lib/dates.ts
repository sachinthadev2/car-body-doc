/**
 * Booking dates are calendar dates, not instants - "Tuesday the 26th" means the
 * same thing regardless of the server's timezone. We store them as UTC midnight
 * in a Postgres DATE column and always read and format them in UTC, so a date
 * can never drift a day when it is written, read back and saved again.
 */

/** "2026-08-26" -> Date at UTC midnight. */
export function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

/** Date -> "2026-08-26" for a <input type="date"> value. */
export function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Today as a UTC-midnight date, for "from today onwards" comparisons. */
export function todayDateOnly() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

/** Formats a calendar date without letting the local timezone shift it. */
export function formatDateOnly(date: Date | string) {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
