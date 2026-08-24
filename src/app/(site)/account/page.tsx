import { CalendarDays, FileText, LogOut, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { logout } from "@/actions/auth";
import { PageHero } from "@/components/site/PageHero";
import { StatusBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateOnly } from "@/lib/dates";
import { formatDate, formatMoney, SERVICE_LABELS, TIME_SLOT_LABELS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await requireUser();

  const [quotes, bookings] = await Promise.all([
    prisma.quoteRequest.findMany({
      where: { OR: [{ userId: user.id }, { email: user.email }] },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reference: true,
        serviceType: true,
        status: true,
        quotedAmountCents: true,
        createdAt: true,
        vehicleMake: true,
        vehicleModel: true,
      },
    }),
    prisma.booking.findMany({
      where: { OR: [{ userId: user.id }, { email: user.email }] },
      orderBy: { preferredDate: "desc" },
      select: {
        id: true,
        reference: true,
        serviceType: true,
        status: true,
        preferredDate: true,
        timeSlot: true,
        suburb: true,
        priceCents: true,
      },
    }),
  ]);

  return (
    <>
      <PageHero eyebrow="My account" title={`Hi ${user.name.split(" ")[0]}`} lead="Everything you have sent us, and where it is up to.">
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/quote" size="md">
            <Plus className="size-4" />
            New Quote Request
          </ButtonLink>
          <ButtonLink href="/book" variant="outline" size="md">
            Book A Job
          </ButtonLink>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 font-display text-base uppercase tracking-wide text-white/70 transition-colors hover:border-brand-500 hover:text-white"
            >
              <LogOut className="size-4" />
              Log Out
            </button>
          </form>
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Quotes */}
        <section>
          <h2 className="display flex items-center gap-2.5 text-2xl text-white">
            <FileText className="size-6 text-brand-500" />
            Quote requests
          </h2>

          {quotes.length === 0 ? (
            <EmptyState
              message="No quote requests yet."
              cta={{ href: "/quote", label: "Get a free quote" }}
            />
          ) : (
            <div className="mt-6 overflow-x-auto border border-hairline">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-panel-2 text-[11px] uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Sent</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline bg-panel">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="transition-colors hover:bg-panel-2">
                      <td className="px-4 py-3.5 font-display text-base text-brand-500">{quote.reference}</td>
                      <td className="px-4 py-3.5 text-white/70">{SERVICE_LABELS[quote.serviceType]}</td>
                      <td className="px-4 py-3.5 text-white/50">
                        {quote.vehicleMake} {quote.vehicleModel}
                      </td>
                      <td className="px-4 py-3.5 text-white/50">{formatDate(quote.createdAt)}</td>
                      <td className="px-4 py-3.5 font-medium text-white">{formatMoney(quote.quotedAmountCents)}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={quote.status} />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link href={`/account/quotes/${quote.id}`} className="font-display uppercase text-white/60 hover:text-brand-500">
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Bookings */}
        <section>
          <h2 className="display flex items-center gap-2.5 text-2xl text-white">
            <CalendarDays className="size-6 text-brand-500" />
            Bookings
          </h2>

          {bookings.length === 0 ? (
            <EmptyState message="No bookings yet." cta={{ href: "/book", label: "Book a job" }} />
          ) : (
            <div className="mt-6 overflow-x-auto border border-hairline">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-panel-2 text-[11px] uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Where</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline bg-panel">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="transition-colors hover:bg-panel-2">
                      <td className="px-4 py-3.5 font-display text-base text-brand-500">{booking.reference}</td>
                      <td className="px-4 py-3.5 text-white/70">{SERVICE_LABELS[booking.serviceType]}</td>
                      <td className="px-4 py-3.5 text-white/50">
                        {formatDateOnly(booking.preferredDate)}
                        <span className="block text-[12px] text-white/35">{TIME_SLOT_LABELS[booking.timeSlot]}</span>
                      </td>
                      <td className="px-4 py-3.5 text-white/50">{booking.suburb}</td>
                      <td className="px-4 py-3.5 font-medium text-white">{formatMoney(booking.priceCents)}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Profile */}
        <section>
          <h2 className="display text-2xl text-white">Your details</h2>
          <dl className="mt-6 grid gap-px border border-hairline bg-hairline sm:grid-cols-3">
            <div className="bg-panel p-5">
              <dt className="text-[11px] uppercase tracking-widest text-white/40">Name</dt>
              <dd className="mt-1 text-white">{user.name}</dd>
            </div>
            <div className="bg-panel p-5">
              <dt className="text-[11px] uppercase tracking-widest text-white/40">Email</dt>
              <dd className="mt-1 text-white">{user.email}</dd>
            </div>
            <div className="bg-panel p-5">
              <dt className="text-[11px] uppercase tracking-widest text-white/40">Phone</dt>
              <dd className="mt-1 text-white">{user.phone ?? "Not supplied"}</dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}

function EmptyState({ message, cta }: { message: string; cta: { href: string; label: string } }) {
  return (
    <div className="mt-6 border border-dashed border-hairline bg-panel p-10 text-center">
      <p className="text-white/50">{message}</p>
      <Link href={cta.href} className="mt-4 inline-block font-display text-lg uppercase text-brand-500 hover:text-brand-400">
        {cta.label} &rarr;
      </Link>
    </div>
  );
}
