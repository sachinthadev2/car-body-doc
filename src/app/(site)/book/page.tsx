import { CalendarDays, CheckCircle2, Info } from "lucide-react";
import type { Metadata } from "next";

import { BookingForm } from "@/components/forms/BookingForm";
import { PageHero } from "@/components/site/PageHero";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { photos } from "@/lib/images";
import { business } from "@/lib/site";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book a Mobile Repair",
  description:
    "Lock in a day and we will come to your home or workplace anywhere in Sydney. Morning or afternoon slots, seven days a week by arrangement.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; service?: string }>;
}) {
  const { ref, service } = await searchParams;
  const user = await getCurrentUser();

  // If they arrived from a quote email, pull the details across.
  const quote = ref
    ? await prisma.quoteRequest.findUnique({
        where: { reference: ref.toUpperCase() },
        select: {
          reference: true,
          name: true,
          email: true,
          phone: true,
          suburb: true,
          postcode: true,
          serviceType: true,
          vehicleMake: true,
          vehicleModel: true,
          vehicleYear: true,
          vehicleColour: true,
          quotedAmountCents: true,
        },
      })
    : null;

  return (
    <>
      <PageHero
        eyebrow="Book a job"
        title="Pick a day, we come to you"
        lead="Tell us where the car will be and when suits. We will confirm your slot by email, usually within a couple of hours during business hours."
        crumb={[{ href: "/book", label: "Book" }]}
        image={photos.blackCar}
        imageAlt="Finished car at dusk"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="border border-hairline bg-panel p-6 sm:p-9">
            {quote ? (
              <div className="mb-8 flex items-start gap-3 border border-emerald-500/30 bg-emerald-500/5 p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                <div className="text-sm">
                  <p className="text-white">
                    Booking against quote <span className="font-display text-brand-500">{quote.reference}</span>
                  </p>
                  {quote.quotedAmountCents ? (
                    <p className="mt-1 text-white/55">Quoted price: {formatMoney(quote.quotedAmountCents)}</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <BookingForm
              quoteReference={quote?.reference}
              defaultService={quote?.serviceType ?? service}
              prefill={{
                name: quote?.name ?? user?.name,
                email: quote?.email ?? user?.email,
                phone: quote?.phone ?? user?.phone ?? undefined,
                suburb: quote?.suburb,
                postcode: quote?.postcode,
                vehicleMake: quote?.vehicleMake,
                vehicleModel: quote?.vehicleModel,
                vehicleYear: quote?.vehicleYear,
                vehicleColour: quote?.vehicleColour,
              }}
            />
          </div>

          <aside className="space-y-8">
            <div className="border border-hairline bg-panel p-6">
              <h2 className="display flex items-center gap-2 text-xl text-white">
                <CalendarDays className="size-5 text-brand-500" />
                Booking slots
              </h2>
              <ul className="mt-4 space-y-3 text-[14px] text-white/55">
                <li>
                  <span className="font-display text-base uppercase text-white">Morning</span> - we arrive between 7am and
                  8am, done by early afternoon.
                </li>
                <li>
                  <span className="font-display text-base uppercase text-white">Afternoon</span> - we arrive around midday,
                  done by late afternoon.
                </li>
              </ul>
              <div className="mt-5 border-t border-hairline pt-4 text-[13px] text-white/45">
                {business.hours.map((h) => (
                  <p key={h.days}>
                    {h.days}: {h.time}
                  </p>
                ))}
              </div>
            </div>

            <div className="border border-hairline bg-panel p-6">
              <h2 className="display flex items-center gap-2 text-xl text-white">
                <Info className="size-5 text-brand-500" />
                Before we arrive
              </h2>
              <ul className="mt-4 space-y-2.5 text-[14px] text-white/55">
                <li className="flex gap-2.5">
                  <span className="text-brand-500">&bull;</span> Park somewhere flat with a metre or so of clearance around
                  the car.
                </li>
                <li className="flex gap-2.5">
                  <span className="text-brand-500">&bull;</span> Give the panel a quick wash if you can - not essential.
                </li>
                <li className="flex gap-2.5">
                  <span className="text-brand-500">&bull;</span> Let us know about gate codes, permits or building rules.
                </li>
                <li className="flex gap-2.5">
                  <span className="text-brand-500">&bull;</span> Paint work needs dry weather. We will call and move it if
                  the forecast turns.
                </li>
              </ul>
            </div>

            <div className="border border-hairline bg-panel-2 p-6 text-center">
              <p className="text-[13px] uppercase tracking-widest text-white/40">Need it sooner?</p>
              <a href={business.phoneHref} className="display mt-2 block text-3xl text-brand-500 hover:text-brand-400">
                {business.phoneDisplay}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
