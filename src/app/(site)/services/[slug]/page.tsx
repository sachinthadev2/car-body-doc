import { CheckCircle2, Clock, DollarSign, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BeforeAfter } from "@/components/site/BeforeAfter";
import { CtaBand } from "@/components/site/CtaBand";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { ButtonLink } from "@/components/ui/Button";
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
        crumb={[
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.name },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/quote?service=${service.type}`} size="lg">
            Quote This Job
          </ButtonLink>
          <ButtonLink href={`/book?service=${service.type}`} variant="outline" size="lg">
            Book It In
          </ButtonLink>
        </div>
      </PageHero>

      {/* Key facts */}
      <div className="border-b border-hairline bg-panel-2">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-hairline px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-5 sm:pr-6">
            <DollarSign className="size-6 shrink-0 text-brand-500" />
            <div>
              <p className="text-[12px] uppercase tracking-widest text-white/35">Price from</p>
              <p className="font-display text-xl text-white">{service.priceFrom}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-5 sm:px-6">
            <Clock className="size-6 shrink-0 text-brand-500" />
            <div>
              <p className="text-[12px] uppercase tracking-widest text-white/35">Turnaround</p>
              <p className="font-display text-xl text-white">{service.turnaround}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-5 sm:pl-6">
            <MapPin className="size-6 shrink-0 text-brand-500" />
            <div>
              <p className="text-[12px] uppercase tracking-widest text-white/35">Where</p>
              <p className="font-display text-xl text-white">Anywhere in {business.baseCity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* What it covers */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="What we cover" title={`${service.name} includes`} />
            <ul className="mt-8 space-y-3">
              {service.covers.map((item) => (
                <li key={item} className="flex items-start gap-3 border-b border-hairline pb-3 text-[15px] text-white/65">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading eyebrow="The process" title="How we do it" />
            <ol className="mt-8 space-y-6">
              {service.process.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="display shrink-0 text-3xl text-brand-500/60">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="display text-xl text-white">{step.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/55">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {examples.length > 0 && (
        <Section tone="panel">
          <SectionHeading eyebrow="Recent work" title={`${service.name} we have done`} align="center" />
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {examples.map((item) => (
              <figure key={item.id}>
                <BeforeAfter before={item.before} after={item.after} alt={item.title} />
                <figcaption className="mt-4">
                  <p className="font-display text-lg uppercase text-white">
                    {item.title} <span className="text-white/35">&middot; {item.suburb}</span>
                  </p>
                  <p className="text-sm text-white/50">{item.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Questions" title={`${service.name} FAQs`} />
          <FaqAccordion items={service.faqs} />
        </div>
      </Section>

      <CtaBand title={`Need ${service.name.toLowerCase()}?`} lead={`Send a photo and get a fixed price - free, no obligation, usually back the same day.`} />
    </>
  );
}
