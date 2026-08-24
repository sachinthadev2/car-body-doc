import Link from "next/link";

import { StatusBadge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { formatDateOnly, todayDateOnly } from "@/lib/dates";
import { BOOKING_STATUS_LABELS, cn, formatMoney, SERVICE_LABELS, TIME_SLOT_LABELS } from "@/lib/utils";
import type { BookingStatus } from "@/generated/prisma/enums";

const STATUSES = Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; when?: string }>;
}) {
  const { status, when } = await searchParams;
  const activeStatus = STATUSES.includes(status as BookingStatus) ? (status as BookingStatus) : undefined;

  const today = todayDateOnly();

  const bookings = await prisma.booking.findMany({
    where: {
      ...(activeStatus ? { status: activeStatus } : {}),
      ...(when === "upcoming" ? { preferredDate: { gte: today } } : {}),
      ...(when === "past" ? { preferredDate: { lt: today } } : {}),
    },
    orderBy: { preferredDate: when === "past" ? "desc" : "asc" },
    take: 100,
    select: {
      id: true,
      reference: true,
      name: true,
      phone: true,
      addressLine: true,
      suburb: true,
      postcode: true,
      serviceType: true,
      preferredDate: true,
      timeSlot: true,
      status: true,
      priceCents: true,
    },
  });

  return (
    <div className="p-5 sm:p-8">
      <header>
        <h1 className="display text-3xl text-white sm:text-4xl">Bookings</h1>
        <p className="mt-1 text-sm text-white/45">{bookings.length} shown</p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        <Chip href="/admin/bookings" label="All" active={!activeStatus && !when} />
        <Chip href="/admin/bookings?when=upcoming" label="Upcoming" active={when === "upcoming"} />
        <Chip href="/admin/bookings?when=past" label="Past" active={when === "past"} />
        <span className="mx-1 w-px bg-hairline" />
        {STATUSES.map((s) => (
          <Chip key={s} href={`/admin/bookings?status=${s}`} label={BOOKING_STATUS_LABELS[s]} active={activeStatus === s} />
        ))}
      </div>

      <div className="mt-6 overflow-x-auto border border-hairline">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-panel-2 text-[11px] uppercase tracking-widest text-white/40">
            <tr>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline bg-panel">
            {bookings.map((booking) => (
              <tr key={booking.id} className="transition-colors hover:bg-panel-2">
                <td className="px-4 py-3.5">
                  <Link href={`/admin/bookings/${booking.id}`} className="font-display text-base text-brand-500 hover:underline">
                    {booking.reference}
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-white/75">
                  {formatDateOnly(booking.preferredDate)}
                  <span className="block text-[12px] text-white/35">{TIME_SLOT_LABELS[booking.timeSlot]}</span>
                </td>
                <td className="px-4 py-3.5 text-white/75">
                  {booking.name}
                  <a href={`tel:${booking.phone}`} className="block text-[12px] text-white/35 hover:text-white">
                    {booking.phone}
                  </a>
                </td>
                <td className="px-4 py-3.5 text-white/50">
                  {booking.addressLine}
                  <span className="block text-[12px] text-white/35">
                    {booking.suburb} {booking.postcode}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-white/55">{SERVICE_LABELS[booking.serviceType]}</td>
                <td className="px-4 py-3.5 font-medium text-white">{formatMoney(booking.priceCents)}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Link href={`/admin/bookings/${booking.id}`} className="font-display uppercase text-white/50 hover:text-brand-500">
                    Open &rarr;
                  </Link>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-14 text-center text-white/35">
                  No bookings here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Chip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "border px-3.5 py-1.5 font-display text-[13px] uppercase tracking-wide transition-colors",
        active ? "border-brand-500 bg-brand-500 text-white" : "border-hairline text-white/55 hover:border-white/40 hover:text-white",
      )}
    >
      {label}
    </Link>
  );
}
