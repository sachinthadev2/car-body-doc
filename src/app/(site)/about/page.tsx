import { CheckCircle2, Truck, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionHeading } from "@/components/site/Section";
import { photos } from "@/lib/images";
import { business, whyUs } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Car Body Doc is a fully mobile smash repair business servicing greater Sydney. Qualified trade work, factory colour matching, done at your home or workplace.",
};

const kit = [
  "Enclosed mobile spray booth",
  "On-board generator and compressor",
  "Computerised paint mixing system",
  "Two-pack automotive paint and clears",
  "Paintless dent removal tooling",
  "Dual action polishers and compounds",
  "Infrared curing lamps",
  "Full masking and containment gear",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A panel shop that fits on a trailer"
        lead={`Car Body Doc is a fully mobile smash repair operation servicing greater ${business.baseCity}. Same trade skills and same materials as a workshop - we just bring them to your driveway instead of asking you to give up your car for a week.`}
        crumb={[{ href: "/about", label: "About" }]}
        image={photos.handsOnTools}
        imageAlt="Hands working on a vehicle repair"
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal direction="right">
            <div className="zoom-parent relative aspect-[4/3] overflow-hidden border border-hairline">
              <Image
                src={business.trailerImage}
                alt="A car masked up mid-repair on site"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="zoom-parent relative aspect-square overflow-hidden border border-hairline">
                <Image src={photos.sprayPaint} alt="Spray painting a panel" fill sizes="25vw" className="object-cover" />
              </div>
              <div className="zoom-parent relative aspect-square overflow-hidden border border-hairline">
                <Image src={photos.buffPolish} alt="Machine polishing a panel" fill sizes="25vw" className="object-cover" />
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={120}>
            <SectionHeading eyebrow="Our story" title="Built for the jobs panel shops do not want" />
            <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-white/60">
              <p>
                Most damage on the road is not a write-off. It is a scraped bumper, a trolley dent, a key mark down the
                door, a guard that has lost its clear coat. Real damage, worth fixing - but not worth losing your car for
                a week or burning an insurance claim over.
              </p>
              <p>
                That is the gap Car Body Doc fills. We took everything a small panel shop needs to repair and refinish a
                panel and packed it onto a trailer: compressor, generator, enclosed spray booth, paint mixing, curing
                lamps and the tools. Then we started driving it to customers instead of the other way around.
              </p>
              <p>
                Today we work across the whole {business.baseCity} basin - CBD apartment car parks, suburban driveways,
                fleet yards and office car parks. Most jobs are quoted from a photo, booked for a day that suits, and
                finished before you knock off work.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="hover-lift border border-hairline bg-panel p-5">
                <Truck className="size-6 text-brand-500" />
                <p className="display mt-3 text-2xl text-white">100% mobile</p>
                <p className="text-[13px] text-white/45">No workshop, no drop-off, no towing</p>
              </div>
              <div className="hover-lift border border-hairline bg-panel p-5">
                <Wrench className="size-6 text-brand-500" />
                <p className="display mt-3 text-2xl text-white">Trade qualified</p>
                <p className="text-[13px] text-white/45">Proper prep, proper paint, proper finish</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="panel" className="relative isolate overflow-hidden">
        <Image src={photos.booth} alt="" fill sizes="100vw" className="object-cover opacity-[0.07]" />
        <div className="relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal direction="right">
            <SectionHeading
              eyebrow="On the trailer"
              title="Everything a panel needs, on site"
              lead="Being mobile only works if the setup is genuinely self-sufficient. Ours is - we do not need your power, your water or your garage."
            />
          </Reveal>
          <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {kit.map((item, i) => (
              <Reveal key={item} delay={i * 60} direction="fade" as="li">
                <span className="flex items-start gap-3 text-[15px] text-white/60">
                  <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-brand-500" />
                  {item}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading eyebrow="Our promise" title="How we work" align="center" />
        </Reveal>
        <div className="mt-12 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} direction="fade">
              <div className="h-full bg-panel p-7 transition-colors duration-300 hover:bg-panel-2">
                <CheckCircle2 className="size-5 text-brand-500" />
                <h3 className="display mt-4 text-xl text-white">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/50">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Let us take a look"
        lead="Send a photo of the damage and we will give you a straight answer and a fixed price."
        image={photos.paintDetail}
      />
    </>
  );
}
