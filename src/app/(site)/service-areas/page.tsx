import { Car, MapPin, Navigation } from "lucide-react";
import type { Metadata } from "next";

import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionHeading } from "@/components/site/Section";
import { photos } from "@/lib/images";
import { business, serviceAreas } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sydney Service Areas",
  description:
    "Mobile smash repairs across greater Sydney - CBD, Inner West, Eastern Suburbs, North Shore, Northern Beaches, Western Sydney, Sutherland Shire and South West.",
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Coverage"
        title="Mobile smash repairs across Sydney"
        lead={`We travel roughly ${business.serviceRadiusKm}km out from the city in every direction. Home, work, fleet yard or apartment car park - if we can park next to the car, we can repair it.`}
        crumb={[{ href: "/service-areas", label: "Service Areas" }]}
        image={photos.sydney}
        imageAlt="Sydney harbour skyline"
      />

      <Section>
        <div className="grid gap-px bg-hairline lg:grid-cols-2">
          {serviceAreas.map((area, i) => (
            <Reveal key={area.region} delay={(i % 2) * 100} direction="fade">
            <div className="h-full bg-panel p-7 transition-colors duration-300 hover:bg-panel-2 lg:p-9">
              <div className="flex items-center gap-2.5">
                <MapPin className="size-5 text-brand-500" />
                <h2 className="display text-2xl text-white">{area.region}</h2>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {area.suburbs.map((suburb) => (
                  <li
                    key={suburb}
                    className="border border-hairline px-3 py-1.5 text-[13px] text-white/55 transition-colors hover:border-brand-500/50 hover:text-white"
                  >
                    {suburb}
                  </li>
                ))}
              </ul>
            </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="panel">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionHeading eyebrow="Travel" title="How call-outs work" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            <div className="hover-lift border border-hairline bg-panel-2 p-6">
              <Navigation className="size-6 text-brand-500" />
              <h3 className="display mt-4 text-xl text-white">No call-out fee</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                Travel inside our standard Sydney coverage is included in the quoted price. What we quote is what you pay.
              </p>
            </div>
            <div className="hover-lift border border-hairline bg-panel-2 p-6">
              <Car className="size-6 text-brand-500" />
              <h3 className="display mt-4 text-xl text-white">Outside the radius?</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                Central Coast, Wollongong, Blue Mountains and the Hawkesbury - give us a call. We regularly travel further
                for bigger jobs or a few cars in one spot.
              </p>
            </div>
            <div className="hover-lift border border-hairline bg-panel-2 p-6">
              <MapPin className="size-6 text-brand-500" />
              <h3 className="display mt-4 text-xl text-white">Fleets and dealers</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                We service fleet yards, dealerships and rental depots across Sydney with volume pricing. Ask us for a rate
                card.
              </p>
            </div>
            <div className="hover-lift border border-hairline bg-panel-2 p-6">
              <Navigation className="size-6 text-brand-500" />
              <h3 className="display mt-4 text-xl text-white">Apartment buildings</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                Basement car park, visitor bay or the street out front - we work in all of them. Just check with building
                management first.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Are we in your area?"
        lead="Tell us your suburb and we will confirm straight away."
        image={photos.sydneyDusk}
      />
    </>
  );
}
