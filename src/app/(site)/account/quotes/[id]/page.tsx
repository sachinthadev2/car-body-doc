import { ArrowLeft, Car, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/site/PageHero";
import { StatusBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { business } from "@/lib/site";
import { formatDateOnly } from "@/lib/dates";
import { CONTACT_METHOD_LABELS, formatDate, formatDateTime, formatMoney, SERVICE_LABELS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quote Detail",
  robots: { index: false, follow: false },
};

export default async function AccountQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  const quote = await prisma.quoteRequest.findUnique({
    where: { id },
    include: { photos: true, booking: { select: { reference: true, preferredDate: true, status: true } } },
  });

  // Only the owner (by account or by the email they used) can see it.
  if (!quote || (quote.userId !== user.id && quote.email !== user.email)) notFound();

  return (
    <>
      <PageHero
        eyebrow={`Quote ${quote.reference}`}
        title={SERVICE_LABELS[quote.serviceType]}
        crumb={[
          { href: "/account", label: "My Account" },
          { href: `/account/quotes/${quote.id}`, label: quote.reference },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge status={quote.status} />
          <span className="text-sm text-white/45">Sent {formatDateTime(quote.createdAt)}</span>
        </div>
      </PageHero>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white">
          <ArrowLeft className="size-4" />
          Back to my account
        </Link>

        {/* The price */}
        {quote.quotedAmountCents ? (
          <div className="mt-8 border border-brand-500/40 bg-brand-500/5 p-7 sm:p-9">
            <p className="text-[12px] uppercase tracking-widest text-white/45">Your fixed price</p>
            <p className="display mt-1 text-5xl text-white">{formatMoney(quote.quotedAmountCents)}</p>
            {quote.quoteMessage ? (
              <p className="mt-5 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-white/65">{quote.quoteMessage}</p>
            ) : null}
            <p className="mt-4 text-[13px] text-white/40">
              Quoted {quote.quotedAt ? formatDate(quote.quotedAt) : ""} &middot; valid for 30 days
            </p>

            {quote.booking ? (
              <p className="mt-6 border-t border-white/10 pt-5 text-[15px] text-white/70">
                Booked in for {formatDateOnly(quote.booking.preferredDate)} &middot; reference{" "}
                <span className="font-display text-brand-500">{quote.booking.reference}</span>
              </p>
            ) : (
              <div className="mt-7">
                <ButtonLink href={`/book?ref=${quote.reference}`} size="lg">
                  Accept &amp; Book This In
                </ButtonLink>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 border border-hairline bg-panel p-7">
            <p className="display text-2xl text-white">We are on it</p>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-white/55">
              Your request is with us and we are working out a price. Most quotes go out the same day. If you need it
              urgently, call{" "}
              <a href={business.phoneHref} className="text-brand-500 hover:underline">
                {business.phoneDisplay}
              </a>
              .
            </p>
          </div>
        )}

        {/* Details */}
        <div className="mt-10 grid gap-8 md:grid-cols-2">
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
              <Row label="Insurance claim" value={quote.insuranceClaim ? "Yes" : "No"} />
            </dl>
          </div>

          <div className="border border-hairline bg-panel p-6">
            <h2 className="display flex items-center gap-2 text-xl text-white">
              <MapPin className="size-5 text-brand-500" />
              Location &amp; contact
            </h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Row label="Suburb" value={`${quote.suburb} ${quote.postcode}`} />
              <Row label="Name" value={quote.name} />
              <Row label="Phone" value={quote.phone} />
              <Row label="Email" value={quote.email} />
              <Row label="Preferred contact" value={CONTACT_METHOD_LABELS[quote.contactMethod]} />
            </dl>
          </div>
        </div>

        <div className="mt-8 border border-hairline bg-panel p-6">
          <h2 className="display text-xl text-white">What you told us</h2>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-white/60">{quote.description}</p>
        </div>

        {quote.photos.length > 0 && (
          <div className="mt-8">
            <h2 className="display text-xl text-white">Your photos</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {quote.photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative aspect-square overflow-hidden border border-hairline bg-panel-2"
                >
                  <Image src={photo.url} alt={photo.filename} fill className="object-cover" sizes="200px" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
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
