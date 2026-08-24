import {
  BadgeCheck,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BeforeAfter } from "@/components/site/BeforeAfter";
import { CtaBand } from "@/components/site/CtaBand";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Section, SectionHeading } from "@/components/site/Section";
import { ButtonLink } from "@/components/ui/Button";
import {
  business,
  faqs,
  gallery,
  howItWorks,
  serviceAreas,
  services,
  siteUrl,
  testimonials,
  trustPoints,
  whyUs,
} from "@/lib/site";

const serviceIcons = [Car, SprayCan, Sparkles, Wrench];
const trustIcons = [Truck, BadgeCheck, ShieldCheck, Star];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    name: business.name,
    description: `Mobile smash repairs across ${business.baseCity}. We come to you.`,
    telephone: business.phoneDisplay,
    email: business.email,
    url: siteUrl,
    image: `${siteUrl}${business.heroImage}`,
    priceRange: "$$",
    areaServed: serviceAreas.flatMap((a) => a.suburbs).map((s) => ({ "@type": "City", name: `${s}, NSW` })),
    address: { "@type": "PostalAddress", addressLocality: business.baseCity, addressRegion: business.addressRegion, addressCountry: "AU" },
    openingHours: ["Mo-Fr 07:00-17:00", "Sa 08:00-14:00"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={business.heroImage}
          alt="Car Body Doc mobile smash repair trailer"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="hero-vignette absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8 lg:pb-36 lg:pt-40">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 border border-brand-500/40 bg-brand-500/10 px-3 py-1.5 font-display text-[12px] uppercase tracking-[0.22em] text-brand-400">
              <MapPin className="size-3.5" />
              Servicing all of {business.baseCity}
            </p>

            <h1 className="display mt-6 text-[13vw] leading-[0.88] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Mobile Smash
              <br />
              Repairs.
              <br />
              <span className="text-brand-500">We Come To You.</span>
            </h1>

            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-white/70 sm:text-lg">
              Dents, scratches, bumper damage and paintwork repaired at your home or workplace. No towing, no workshop
              queue, no lost day. Send a photo and get a fixed price back today.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/quote" size="lg">
                Get A Free Quote
              </ButtonLink>
              <a
                href={business.phoneHref}
                className="inline-flex items-center justify-center gap-2.5 rounded-sm border border-white/25 bg-black/30 px-8 py-4 font-display text-lg font-semibold uppercase tracking-wide text-white backdrop-blur transition-colors hover:border-brand-500"
              >
                <Phone className="size-5 text-brand-500" />
                {business.phoneDisplay}
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
              {["Same day quotes", "Fixed pricing", "Insurance work welcome", "Work guaranteed"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle2 className="size-4 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Trust strip */}
      <div className="border-y border-hairline bg-panel">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-hairline px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustPoints.map((point, i) => {
            const Icon = trustIcons[i];
            return (
              <div key={point.title} className="flex items-center gap-3.5 px-2 py-6 sm:px-6">
                <Icon className="size-7 shrink-0 text-brand-500" />
                <div>
                  <p className="font-display text-base uppercase leading-tight text-white">{point.title}</p>
                  <p className="text-[13px] text-white/45">{point.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------- Services */}
      <Section>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Panel &amp; paint work,
                <br />
                done at your place
              </>
            }
          />
          <p className="max-w-md text-[15px] leading-relaxed text-white/55">
            Everything on our trailer is set up for on-site repairs - compressor, spray booth, paint mixing and power.
            Four core services cover the vast majority of what a car needs.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = serviceIcons[i];
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative flex flex-col bg-panel p-7 transition-colors hover:bg-panel-2"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-brand-500 transition-transform duration-200 group-hover:scale-x-100" />
                <Icon className="size-9 text-brand-500" />
                <h3 className="display mt-6 text-2xl text-white">{service.name}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/55">{service.short}</p>
                <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
                  <span className="font-display text-sm uppercase tracking-wide text-white/40">
                    From <span className="text-brand-500">{service.priceFrom}</span>
                  </span>
                  <span className="font-display text-sm uppercase tracking-wide text-white/70 transition-colors group-hover:text-brand-500">
                    Details &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ------------------------------------------------------- How it works */}
      <Section tone="panel">
        <SectionHeading eyebrow="How it works" title="Three steps, no hassle" align="center" />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {howItWorks.map((step) => (
            <div key={step.step} className="relative">
              <span className="display text-6xl text-white/10">{step.step}</span>
              <h3 className="display mt-2 text-2xl text-white">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/55">{step.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <ButtonLink href="/quote" size="lg">
            Start With A Photo
          </ButtonLink>
        </div>
      </Section>

      {/* ------------------------------------------------------ Before/after */}
      <Section>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Recent work" title="Before &amp; after" />
          <Link href="/gallery" className="font-display text-lg uppercase text-brand-500 hover:text-brand-400">
            View the full gallery &rarr;
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {gallery.slice(0, 4).map((item) => (
            <figure key={item.id}>
              <BeforeAfter before={item.before} after={item.after} alt={item.title} />
              <figcaption className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg uppercase text-white">{item.title}</p>
                  <p className="text-sm text-white/50">{item.detail}</p>
                </div>
                <span className="shrink-0 border border-hairline px-2.5 py-1 text-[11px] uppercase tracking-wider text-white/45">
                  {item.suburb}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------- Why us */}
      <Section tone="panel" className="carbon">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Why Car Body Doc"
              title={
                <>
                  The workshop
                  <br />
                  comes to you
                </>
              }
              lead="A mobile setup means no tow truck, no drop-off, no hire car and no week-long wait. Same trade skills, same paint, a fraction of the disruption."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/about" variant="outline">
                About Us
              </ButtonLink>
              <ButtonLink href="/service-areas" variant="ghost">
                Where We Travel &rarr;
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-px bg-hairline sm:grid-cols-2">
            {whyUs.map((item) => (
              <div key={item.title} className="bg-panel p-6">
                <CheckCircle2 className="size-5 text-brand-500" />
                <h3 className="display mt-4 text-xl text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ Service areas */}
      <Section>
        <SectionHeading
          eyebrow="Coverage"
          title="We travel across Sydney"
          lead={`From the CBD to Penrith, the Northern Beaches to the Shire - if you are within about ${business.serviceRadiusKm}km of the city, we can get to you.`}
          align="center"
        />
        <div className="mt-12 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {serviceAreas.map((area) => (
            <div key={area.region} className="bg-panel p-6">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-brand-500" />
                <h3 className="font-display text-lg uppercase text-white">{area.region}</h3>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-white/45">{area.suburbs.slice(0, 6).join(" · ")}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-white/45">
          Not on the list?{" "}
          <a href={business.phoneHref} className="text-brand-500 hover:text-brand-400">
            Give us a call
          </a>{" "}
          - we cover more ground than we can fit here.
        </p>
      </Section>

      {/* ------------------------------------------------------ Testimonials */}
      <Section tone="panel">
        <SectionHeading eyebrow="Customer reviews" title="What Sydney says" align="center" />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((review) => (
            <blockquote key={review.name} className="flex flex-col border border-hairline bg-panel-2 p-7">
              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-brand-500 text-brand-500" />
                ))}
              </div>
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-white/70">&ldquo;{review.text}&rdquo;</p>
              <footer className="mt-6 border-t border-hairline pt-4">
                <p className="font-display text-lg uppercase text-white">{review.name}</p>
                <p className="text-[13px] text-white/40">{review.suburb}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------------------- FAQ */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Questions" title="Good to know" />
            <div className="mt-8 space-y-4 text-[15px] text-white/55">
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-brand-500" />
                Most repairs are finished the same day we arrive.
              </p>
              <p className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-brand-500" />
                Prefer to talk it through? Call {business.phoneDisplay}.
              </p>
            </div>
            <ButtonLink href="/faq" variant="outline" size="sm" className="mt-8">
              All FAQs
            </ButtonLink>
          </div>
          <FaqAccordion items={faqs[0].items.concat(faqs[2].items.slice(0, 2))} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
