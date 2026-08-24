import type { BookingStatus, QuoteStatus } from "@/generated/prisma/enums";

import { BOOKING_STATUS_LABELS, cn, QUOTE_STATUS_LABELS, statusTone } from "@/lib/utils";

export function StatusBadge({ status }: { status: QuoteStatus | BookingStatus }) {
  const label =
    status in QUOTE_STATUS_LABELS
      ? QUOTE_STATUS_LABELS[status as QuoteStatus]
      : BOOKING_STATUS_LABELS[status as BookingStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-sm px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-inset",
        statusTone(status),
      )}
    >
      {label}
    </span>
  );
}
