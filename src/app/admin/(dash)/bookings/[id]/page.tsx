import { ArrowLeft, Car, Mail, MapPin, Navigation, Phone, StickyNote } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingUpdateForm } from "@/components/admin/BookingUpdateForm";
import { StatusBadge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { formatDateOnly, toDateInput } from "@/lib/dates";
import { formatDateTime, formatMoney, SERVICE_LABELS, TIME_SLOT_LABELS } from "@/lib/utils";

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      quoteRequest: { select: { id: true, reference: true, quotedAmountCents: true, description: true } },
      user: { select: { id: true, name: true } },
    },
  });

  if (!booking) notFound();

  const mapQuery = encodeURIComponent(`${booking.addressLine}, ${booking.suburb} NSW ${booking.postcode}`);

  return (
    <div className="p-5 sm:p-8">
      <Link href="/admin/bookings" className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white">
        <ArrowLeft className="size-4" />
        All bookings
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="display text-3xl text-white sm:text-4xl">{booking.reference}</h1>
            <StatusBadge status={booking.status} />
          </div>
          <p className="mt-2 text-sm text-white/45">
            {SERVICE_LABELS[booking.serviceType]} &middot; {formatDateOnly(booking.preferredDate)} &middot;{" "}
            {TIME_SLOT_LABELS[booking.timeSlot]}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:${booking.phone}`}
            className="inline-flex items-center gap-2 border border-hairline px-4 py-2.5 font-display text-sm uppercase text-white hover:border-brand-500"
          >
            <Phone className="size-4 text-brand-500" />
            {booking.phone}
          </a>
          <a
            href={`mailto:${booking.email}`}
            className="inline-flex items-center gap-2 border border-hairline px-4 py-2.5 font-display text-sm uppercase text-white hover:border-brand-500"
          >
            <Mail className="size-4 text-brand-500" />
            Email
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-hairline px-4 py-2.5 font-display text-sm uppercase text-white hover:border-brand-500"
          >
            <Navigation className="size-4 text-brand-500" />
            Directions
          </a>
        </div>
      </header>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-8">
          <section className="grid gap-8 md:grid-cols-2">
            <div className="border border-hairline bg-panel p-6">
              <h2 className="display flex items-center gap-2 text-xl text-white">
                <MapPin className="size-5 text-brand-500" />
                Where we go
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <Row label="Customer" value={booking.name} />
                <Row label="Address" value={booking.addressLine} />
                <Row label="Suburb" value={`${booking.suburb} ${booking.postcode}`} />
                <Row label="Phone" value={booking.phone} />
                <Row label="Email" value={booking.email} />
                <Row label="Account" value={booking.user ? "Registered" : "Guest"} />
              </dl>
            </div>

            <div className="border border-hairline bg-panel p-6">
              <h2 className="display flex items-center gap-2 text-xl text-white">
                <Car className="size-5 text-brand-500" />
                Vehicle &amp; job
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <Row label="Vehicle" value={`${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel}`} />
                <Row label="Colour" value={booking.vehicleColour} />
                <Row label="Service" value={SERVICE_LABELS[booking.serviceType]} />
                <Row label="Agreed price" value={formatMoney(booking.priceCents)} />
                <Row label="Requested" value={formatDateTime(booking.createdAt)} />
              </dl>
            </div>
          </section>

          {booking.notes ? (
            <section className="border border-hairline bg-panel p-6">
              <h2 className="display flex items-center gap-2 text-xl text-white">
                <StickyNote className="size-5 text-brand-500" />
                Customer notes
              </h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-white/65">{booking.notes}</p>
            </section>
          ) : null}

          {booking.quoteRequest ? (
            <section className="border border-hairline bg-panel p-6">
              <h2 className="display text-xl text-white">From quote {booking.quoteRequest.reference}</h2>
              <p className="mt-2 text-base text-white/60">
                Quoted {formatMoney(booking.quoteRequest.quotedAmountCents)}
                <Link href={`/admin/quotes/${booking.quoteRequest.id}`} className="ml-2 text-brand-400 hover:underline">
                  Open quote &rarr;
                </Link>
              </p>
              <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-relaxed text-white/45">
                {booking.quoteRequest.description}
              </p>
            </section>
          ) : null}
        </div>

        <aside>
          <section className="border border-brand-500/30 bg-panel p-6">
            <h2 className="display text-xl text-white">Manage booking</h2>
            <div className="mt-5">
              <BookingUpdateForm
                bookingId={booking.id}
                status={booking.status}
                preferredDate={toDateInput(booking.preferredDate)}
                timeSlot={booking.timeSlot}
                priceCents={booking.priceCents}
                adminNotes={booking.adminNotes}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-hairline pb-2.5">
      <dt className="text-white/40">{label}</dt>
      <dd className="text-right text-white/80">{value}</dd>
    </div>
  );
}
