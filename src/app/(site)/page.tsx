import {
  ArrowRight,
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
import { HeroSlider } from "@/components/site/HeroSlider";
import { CountUp, Reveal } from "@/components/site/Reveal";
import { Section, SectionHeading } from "@/components/site/Section";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/images";
import {
  allSuburbs,
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

const marqueeWords = [
  "Smash Repairs",
  "Spray Painting",
  "Dent Removal",
  "Scratch Repair",
  "Buff & Polish",
  "Bumper Repairs",
  "Colour Matching",
  "Paintless Dent Removal",
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    name: business.name,
    description: `Mobile smash repairs across ${business.baseCity}. We come to you.`,
    telephone: business.phoneDisplay,
    email: business.email,
    url: siteUrl,
    image: business.heroImage,
    priceRange: "$$",
    areaServed: serviceAreas.flatMap((a) => a.suburbs).map((s) => ({ "@type": "City", name: `${s}, NSW` })),
    address: {
      "@type": "PostalAddress",
      addressLocality: business.baseCity,
      addressRegion: business.addressRegion,
      addressCountry: "AU",
    },
    openingHours: ["Mo-Fr 07:00-17:00", "Sa 08:00-14:00"],
  };

  const stats = [
    { value: allSuburbs.length, suffix: "+", label: "Sydney suburbs covered" },
    { value: business.serviceRadiusKm, suffix: "km", label: "Travel radius from the city" },
    { value: services.length, suffix: "", label: "Core services on the trailer" },
    { value: 0, suffix: "", label: "Trips to a workshop needed" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HeroSlider />

      {/* ----------------------------------------------------------- Marquee */}
      <div className="marquee-mask overflow-hidden border-y border-hairline bg-brand-600/90 py-3">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={`${word}-${i}`} className="flex items-center gap-10 font-display text-lg uppercase tracking-[0.2em] text-white/90">
              {word}
              <span className="text-white/40">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------- Trust strip */}
      <div className="border-b border-hairline bg-panel">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-hairline px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustPoints.map((point, i) => {
            const Icon = trustIcons[i];
            return (
              <Reveal key={point.title} delay={i * 90} className="flex items-center gap-3.5 px-2 py-7 sm:px-6">
                <Icon className="size-7 shrink-0 text-brand-500" />
                <div>
                  <p className="font-display text-base uppercase leading-tight text-white">{point.title}</p>
                  <p className="text-sm text-white/45">{point.detail}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------- Services */}
      <Section tone="gradient">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
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
          </Reveal>
          <Reveal direction="left" delay={120}>
            <p className="max-w-md text-base leading-relaxed text-white/55">
              Everything on our trailer is set up for on-site repairs - compressor, spray booth, paint mixing and power.
              Four core services cover the vast majority of what a car needs.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = serviceIcons[i];
            return (
              <Reveal key={service.slug} delay={i * 110} direction="up">
                <Link
                  href={`/services/${service.slug}`}
                  className="zoom-parent hover-lift group relative flex h-full flex-col overflow-hidden border border-hairline bg-panel"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/30 to-transparent" />
                    <span className="absolute left-4 top-4 flex size-11 items-center justify-center bg-brand-500/90 text-white backdrop-blur-sm">
                      <Icon className="size-5" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="display text-2xl text-white transition-colors group-hover:text-brand-400">
                      {service.name}
                    </h3>
                    <p className="mt-3 flex-1 text-base leading-relaxed text-white/55">{service.short}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
                      <span className="font-display text-sm uppercase tracking-wide text-white/40">
                        From <span className="text-brand-500">{service.priceFrom}</span>
                      </span>
                      <ArrowRight className="size-4 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-500" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ------------------------------------------------------- How it works */}
      <Section tone="texture" className="relative isolate overflow-hidden">
        <Image src={photos.sprayGun} alt="" fill sizes="100vw" className="object-cover opacity-[0.07]" />
        <div className="relative">
          <Reveal>
            <SectionHeading eyebrow="How it works" title="Three steps, no hassle" align="center" />
          </Reveal>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <Reveal key={step.step} delay={i * 140} className="relative">
                <span className="display text-7xl leading-none text-white/[0.08]">{step.step}</span>
                <span className="mt-4 block h-px w-14 bg-brand-500" />
                <h3 className="display mt-5 text-2xl text-white">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-white/55">{step.detail}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-14 text-center">
            <ButtonLink href="/quote" size="lg" className="sheen group">
              Start With A Photo
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------------ Before/after */}
      <Section tone="glow">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading eyebrow="Recent work" title="Before &amp; after" />
          </Reveal>
          <Reveal direction="left">
            <Link href="/gallery" className="link-draw font-display text-lg uppercase text-brand-500">
              View the full gallery &rarr;
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {gallery.slice(0, 4).map((item, i) => (
            <Reveal key={item.id} delay={(i % 2) * 120} direction="zoom">
              <figure className="hover-lift border border-hairline bg-panel p-3">
                <BeforeAfter before={item.before} after={item.after} alt={item.title} />
                <figcaption className="mt-4 flex items-start justify-between gap-4 px-1 pb-1">
                  <div>
                    <p className="font-display text-lg uppercase text-white">{item.title}</p>
                    <p className="text-sm text-white/50">{item.detail}</p>
                  </div>
                  <span className="shrink-0 border border-hairline px-2.5 py-1 text-[0.72rem] uppercase tracking-wider text-white/45">
                    {item.suburb}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------- Stats */}
      <section className="relative isolate overflow-hidden border-y border-hairline">
        <Image src={photos.blackSedan} alt="" fill sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-ink/88" />
        <div className="carbon absolute inset-0 opacity-30" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 110} className="text-center">
              <p className="display text-5xl text-brand-500 sm:text-6xl">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mx-auto mt-2 max-w-[11rem] text-sm leading-snug text-white/50">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- Why us */}
      <Section tone="panel2">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal direction="right">
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

            <div className="zoom-parent relative mt-10 aspect-[16/10] overflow-hidden border border-hairline">
              <Image
                src={photos.heroSecondary}
                alt="Machine polishing a repaired panel"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/about" variant="outline">
                About Us
              </ButtonLink>
              <ButtonLink href="/service-areas" variant="ghost" className="link-draw">
                Where We Travel &rarr;
              </ButtonLink>
            </div>
          </Reveal>

          <div className="grid gap-px bg-hairline sm:grid-cols-2">
            {whyUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} direction="fade">
                <div className="h-full bg-panel p-6 transition-colors duration-300 hover:bg-panel-2">
                  <CheckCircle2 className="size-5 text-brand-500" />
                  <h3 className="display mt-4 text-xl text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ Service areas */}
      <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
        <Image src={photos.sydney} alt="Sydney" fill sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-ink/90" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Coverage"
              title="We travel across Sydney"
              lead={`From the CBD to Penrith, the Northern Beaches to the Shire - if you are within about ${business.serviceRadiusKm}km of the city, we can get to you.`}
              align="center"
            />
          </Reveal>

          <div className="mt-12 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {serviceAreas.map((area, i) => (
              <Reveal key={area.region} delay={i * 70} direction="fade">
                <div className="h-full bg-panel/95 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-panel-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-brand-500" />
                    <h3 className="font-display text-lg uppercase text-white">{area.region}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">
                    {area.suburbs.slice(0, 6).join(" · ")}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-white/45">
            Not on the list?{" "}
            <a href={business.phoneHref} className="link-draw text-brand-500">
              Give us a call
            </a>{" "}
            - we cover more ground than we can fit here.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ Testimonials */}
      <Section tone="texture">
        <Reveal>
          <SectionHeading eyebrow="Customer reviews" title="What Sydney says" align="center" />
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((review, i) => (
            <Reveal key={review.name} delay={i * 130} direction="up">
              <blockquote className="hover-lift flex h-full flex-col border border-hairline bg-panel-2 p-7">
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, s) => (
                    <Star key={s} className="size-4 fill-brand-500 text-brand-500" />
                  ))}
                </div>
                <p className="mt-5 flex-1 text-base leading-relaxed text-white/70">&ldquo;{review.text}&rdquo;</p>
                <footer className="mt-6 border-t border-hairline pt-4">
                  <p className="font-display text-lg uppercase text-white">{review.name}</p>
                  <p className="text-sm text-white/40">{review.suburb}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------------------- FAQ */}
      <Section tone="gradient">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal direction="right">
            <SectionHeading eyebrow="Questions" title="Good to know" />
            <div className="mt-8 space-y-4 text-base text-white/55">
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
          </Reveal>

          <Reveal direction="left" delay={120}>
            <FaqAccordion items={faqs[0].items.concat(faqs[2].items.slice(0, 2))} />
          </Reveal>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
