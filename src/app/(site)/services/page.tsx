import type { Metadata } from "next";
import { Car, CheckCircle2, Clock, Sparkles, SprayCan, Wrench } from "lucide-react";
import Link from "next/link";

import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mobile Car Body Repair Services in Sydney",
  description:
    "Smash repairs, spray painting, buff and polish, dent and scratch removal - all done on site anywhere in Sydney. Fixed prices, free photo quotes.",
};

const icons = [Car, SprayCan, Sparkles, Wrench];

const comparison = [
  { point: "Your car leaves home", shop: "Yes - drop off or tow", us: "No - we come to you" },
  { point: "Time without the car", shop: "3 to 7 days typical", us: "A few hours to a day" },
  { point: "Hire car needed", shop: "Often", us: "Never" },
  { point: "Overheads in the price", shop: "Workshop rent and staff", us: "Minimal - trailer only" },
  { point: "Best suited to", shop: "Structural and major repairs", us: "Panel, paint and cosmetic work" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Panel and paint work, wherever your car is parked"
        lead="Four core services cover almost everything a car needs short of structural repair. Every one of them is done on site, at your home or workplace, anywhere in Sydney."
        crumb={[{ href: "/services", label: "Services" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/quote" size="lg">
            Get A Free Quote
          </ButtonLink>
          <ButtonLink href="/book" variant="outline" size="lg">
            Book A Job
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-px bg-hairline lg:grid-cols-2">
          {services.map((service, i) => {
            const Icon = icons[i];
            return (
              <article key={service.slug} className="group bg-panel p-8 transition-colors hover:bg-panel-2 lg:p-10">
                <div className="flex items-start justify-between gap-6">
                  <Icon className="size-10 text-brand-500" />
                  <div className="text-right">
                    <p className="font-display text-[11px] uppercase tracking-widest text-white/35">From</p>
                    <p className="display text-2xl text-brand-500">{service.priceFrom}</p>
                  </div>
                </div>

                <h2 className="display mt-6 text-3xl text-white">{service.name}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/60">{service.blurb}</p>

                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {service.covers.slice(0, 4).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[14px] text-white/55">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-5">
                  <span className="flex items-center gap-2 text-[13px] text-white/45">
                    <Clock className="size-4 text-brand-500" />
                    {service.turnaround}
                  </span>
                  <Link
                    href={`/services/${service.slug}`}
                    className="font-display text-base uppercase tracking-wide text-white transition-colors group-hover:text-brand-500"
                  >
                    Full details &rarr;
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section tone="panel">
        <SectionHeading
          eyebrow="Mobile vs workshop"
          title="Why people choose mobile"
          lead="A panel shop is the right call for structural damage. For everything else, a mobile repair saves you days and usually a decent chunk of money."
        />

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline">
                <th className="py-4 pr-4 font-display text-sm uppercase tracking-wide text-white/40">&nbsp;</th>
                <th className="py-4 pr-4 font-display text-lg uppercase text-white/70">Panel shop</th>
                <th className="py-4 font-display text-lg uppercase text-brand-500">Car Body Doc</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.point} className="border-b border-hairline">
                  <td className="py-4 pr-4 text-[14px] text-white/45">{row.point}</td>
                  <td className="py-4 pr-4 text-[15px] text-white/70">{row.shop}</td>
                  <td className="py-4 text-[15px] font-medium text-white">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <CtaBand title="Not sure which service you need?" lead="Send a photo and we will tell you straight - including if you would be better off at a workshop." />
    </>
  );
}
