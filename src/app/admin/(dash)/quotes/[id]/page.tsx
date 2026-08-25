import { ArrowLeft, Calendar, Car, Mail, MapPin, Phone, ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { QuoteReplyForm, QuoteStatusForm } from "@/components/admin/QuoteForms";
import { StatusBadge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { formatDateOnly } from "@/lib/dates";
import { CONTACT_METHOD_LABELS, formatDate, formatDateTime, formatMoney, SERVICE_LABELS } from "@/lib/utils";

export default async function AdminQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const quote = await prisma.quoteRequest.findUnique({
    where: { id },
    include: {
      photos: true,
      booking: { select: { id: true, reference: true, preferredDate: true, status: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!quote) notFound();

  return (
    <div className="p-5 sm:p-8">
      <Link href="/admin/quotes" className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white">
        <ArrowLeft className="size-4" />
        All quote requests
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="display text-3xl text-white sm:text-4xl">{quote.reference}</h1>
            <StatusBadge status={quote.status} />
            {quote.insuranceClaim && (
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-amber-500/15 px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-inset ring-amber-500/30">
                <ShieldAlert className="size-3.5" />
                Insurance claim
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-white/45">
            {SERVICE_LABELS[quote.serviceType]} &middot; received {formatDateTime(quote.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:${quote.phone}`}
            className="inline-flex items-center gap-2 border border-hairline px-4 py-2.5 font-display text-sm uppercase text-white hover:border-brand-500"
          >
            <Phone className="size-4 text-brand-500" />
            {quote.phone}
          </a>
          <a
            href={`mailto:${quote.email}`}
            className="inline-flex items-center gap-2 border border-hairline px-4 py-2.5 font-display text-sm uppercase text-white hover:border-brand-500"
          >
            <Mail className="size-4 text-brand-500" />
            Email
          </a>
        </div>
      </header>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-8">
          {/* Damage */}
          <section className="border border-hairline bg-panel p-6">
            <h2 className="display text-xl text-white">The damage</h2>
            <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-white/65">{quote.description}</p>

            {quote.photos.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {quote.photos.map((photo) => (
                  <a
                    key={photo.id}
                    href={photo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative aspect-square overflow-hidden border border-hairline bg-panel-2"
                  >
                    <Image
                      src={photo.url}
                      alt={photo.filename}
                      fill
                      sizes="240px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-6 border border-dashed border-hairline p-6 text-center text-sm text-white/35">
                No photos supplied.
              </p>
            )}
          </section>

          {/* Details */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="border border-hairline bg-panel p-6">
              <h2 className="display flex items-center gap-2 text-xl text-white">
                <Car className="size-5 text-brand-500" />
                Vehicle
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <Row label="Make &amp; model" value={`${quote.vehicleMake} ${quote.vehicleModel}`} />
                <Row label="Year" value={quote.vehicleYear} />
                <Row label="Colour" value={quote.vehicleColour} />
                <Row label="Paint code" value={quote.paintCode ?? "Not supplied"} />
              </dl>
            </div>

            <div className="border border-hairline bg-panel p-6">
              <h2 className="display flex items-center gap-2 text-xl text-white">
                <MapPin className="size-5 text-brand-500" />
                Customer
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <Row label="Name" value={quote.name} />
                <Row label="Suburb" value={`${quote.suburb} ${quote.postcode}`} />
                <Row label="Phone" value={quote.phone} />
                <Row label="Email" value={quote.email} />
                <Row label="Prefers" value={CONTACT_METHOD_LABELS[quote.contactMethod]} />
                <Row label="Account" value={quote.user ? "Registered" : "Guest"} />
              </dl>
            </div>
          </section>

          {quote.booking ? (
            <section className="border border-emerald-500/30 bg-emerald-500/5 p-6">
              <h2 className="display flex items-center gap-2 text-xl text-white">
                <Calendar className="size-5 text-emerald-400" />
                Booked
              </h2>
              <p className="mt-2 text-base text-white/70">
                {quote.booking.reference} &middot; {formatDateOnly(quote.booking.preferredDate)}{" "}
                <Link href={`/admin/bookings/${quote.booking.id}`} className="ml-2 text-brand-400 hover:underline">
                  Open booking &rarr;
                </Link>
              </p>
            </section>
          ) : null}
        </div>

        {/* Actions */}
        <aside className="space-y-8">
          <section className="border border-brand-500/30 bg-panel p-6">
            <h2 className="display text-xl text-white">
              {quote.quotedAmountCents ? "Update the quote" : "Send a quote"}
            </h2>
            {quote.quotedAmountCents ? (
              <p className="mt-1 text-sm text-white/45">
                Currently quoted {formatMoney(quote.quotedAmountCents)}
                {quote.quotedAt ? ` on ${formatDate(quote.quotedAt)}` : ""}. Sending again emails the customer a new
                price.
              </p>
            ) : (
              <p className="mt-1 text-sm text-white/45">This emails the customer their price and a booking link.</p>
            )}
            <div className="mt-5">
              <QuoteReplyForm quoteId={quote.id} defaultAmount={quote.quotedAmountCents} defaultMessage={quote.quoteMessage} />
            </div>
          </section>

          <section className="border border-hairline bg-panel p-6">
            <h2 className="display text-xl text-white">Status &amp; notes</h2>
            <div className="mt-5">
              <QuoteStatusForm quoteId={quote.id} status={quote.status} adminNotes={quote.adminNotes} />
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
