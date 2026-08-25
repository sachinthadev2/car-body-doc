import { Camera, Clock, ShieldCheck, Star } from "lucide-react";
import type { Metadata } from "next";

import { QuoteForm } from "@/components/forms/QuoteForm";
import { PageHero } from "@/components/site/PageHero";
import { photos } from "@/lib/images";
import { business, howItWorks, testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Send photos of the damage and get a fixed price for mobile smash repairs, spray painting, dent and scratch removal anywhere in Sydney. Free, no obligation.",
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Free quote"
        title="Send a photo, get a fixed price"
        lead="Two minutes of your time. We look at the photos personally and come back with a firm price - usually the same day, no obligation to book."
        crumb={[{ href: "/quote", label: "Free Quote" }]}
        image={photos.scratchedDoor}
        imageAlt="Scratches down a car door"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="border border-hairline bg-panel p-6 sm:p-9">
            <QuoteForm defaultService={service} />
          </div>

          <aside className="space-y-8">
            <div className="border border-hairline bg-panel p-6">
              <h2 className="display text-xl text-white">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {howItWorks.map((step) => (
                  <li key={step.step} className="flex gap-4">
                    <span className="display text-2xl text-brand-500/50">{step.step}</span>
                    <div>
                      <p className="font-display text-base uppercase text-white">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/50">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border border-hairline bg-panel p-6">
              <h2 className="display text-xl text-white">Photo tips</h2>
              <ul className="mt-4 space-y-3 text-[0.95rem] text-white/55">
                <li className="flex gap-3">
                  <Camera className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  One wide shot of the whole panel, one close up of the damage.
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  Daylight if you can - shade beats direct sun and flash.
                </li>
                <li className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  Include the paint code from the compliance plate if you have it.
                </li>
              </ul>
            </div>

            <div className="border border-brand-500/30 bg-brand-500/5 p-6">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-brand-500 text-brand-500" />
                ))}
              </div>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-white/70">&ldquo;{testimonials[1].text}&rdquo;</p>
              <p className="mt-4 font-display text-base uppercase text-white">
                {testimonials[1].name} <span className="text-white/40">&middot; {testimonials[1].suburb}</span>
              </p>
            </div>

            <div className="border border-hairline bg-panel-2 p-6 text-center">
              <p className="text-sm uppercase tracking-widest text-white/40">Rather talk it through?</p>
              <a href={business.phoneHref} className="display mt-2 block text-3xl text-brand-500 hover:text-brand-400">
                {business.phoneDisplay}
              </a>
              <p className="mt-2 text-sm text-white/40">Mon - Fri 7am to 5pm, Sat 8am to 2pm</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
