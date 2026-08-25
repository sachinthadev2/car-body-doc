import { ArrowRight, CheckCircle2, Clock, DollarSign, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { BeforeAfter } from "@/components/site/BeforeAfter";
import { CtaBand } from "@/components/site/CtaBand";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionHeading } from "@/components/site/Section";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/images";
import { business, gallery, getService, services } from "@/lib/site";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `Mobile ${service.name} Sydney`,
    description: `${service.blurb} Mobile service across Sydney from ${service.priceFrom}.`,
    openGraph: { images: [service.image] },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const examples = gallery.filter((item) => item.service === service.type);

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={`Mobile ${service.name} in Sydney`}
        lead={service.intro}
        image={service.image}
        imageAlt={service.name}
        crumb={[
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.name },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/quote?service=${service.type}`} size="lg" className="sheen group">
            Quote This Job
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink href={`/book?service=${service.type}`} variant="outline" size="lg">
            Book It In
          </ButtonLink>
        </div>
      </PageHero>

      {/* Key facts */}
      <div className="border-b border-hairline bg-panel-2">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-hairline px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {[
            { icon: DollarSign, label: "Price from", value: service.priceFrom },
            { icon: Clock, label: "Turnaround", value: service.turnaround },
            { icon: MapPin, label: "Where", value: `Anywhere in ${business.baseCity}` },
          ].map((fact, i) => (
            <Reveal key={fact.label} delay={i * 100} direction="fade">
              <div className="flex items-center gap-3 py-6 sm:px-6">
                <fact.icon className="size-6 shrink-0 text-brand-500" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/35">{fact.label}</p>
                  <p className="font-display text-xl text-white">{fact.value}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* What it covers */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <Reveal direction="right">
            <SectionHeading eyebrow="What we cover" title={`${service.name} includes`} />
            <ul className="mt-8 space-y-3">
              {service.covers.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-hairline pb-3 text-base text-white/65 transition-colors hover:text-white"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="left" delay={120}>
            <SectionHeading eyebrow="The process" title="How we do it" />
            <ol className="mt-8 space-y-6">
              {service.process.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="display shrink-0 text-3xl text-brand-500/60">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="display text-xl text-white">{step.title}</h3>
                    <p className="mt-1.5 text-base leading-relaxed text-white/55">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="zoom-parent relative mt-10 aspect-[16/9] overflow-hidden border border-hairline">
              <Image
                src={photos.microfibre}
                alt="Finished panel being wiped down"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            </div>
          </Reveal>
        </div>
      </Section>

      {examples.length > 0 && (
        <Section tone="panel">
          <Reveal>
            <SectionHeading eyebrow="Recent work" title={`${service.name} we have done`} align="center" />
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {examples.map((item, i) => (
              <Reveal key={item.id} delay={i * 120} direction="zoom">
                <figure className="hover-lift border border-hairline bg-panel p-3">
                  <BeforeAfter before={item.before} after={item.after} alt={item.title} />
                  <figcaption className="mt-4 px-1 pb-1">
                    <p className="font-display text-lg uppercase text-white">
                      {item.title} <span className="text-white/35">&middot; {item.suburb}</span>
                    </p>
                    <p className="text-sm text-white/50">{item.detail}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal direction="right">
            <SectionHeading eyebrow="Questions" title={`${service.name} FAQs`} />
          </Reveal>
          <Reveal direction="left" delay={120}>
            <FaqAccordion items={service.faqs} />
          </Reveal>
        </div>
      </Section>

      <CtaBand
        title={`Need ${service.name.toLowerCase()}?`}
        lead="Send a photo and get a fixed price - free, no obligation, usually back the same day."
        image={service.image}
      />
    </>
  );
}
