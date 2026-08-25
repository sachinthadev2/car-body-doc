import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";

import { Reveal } from "@/components/site/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/images";
import { business } from "@/lib/site";

export function CtaBand({
  title = "Got damage? Send us a photo.",
  lead = "Free, no-obligation quotes across Sydney - usually back to you the same day.",
  image = photos.headlight,
}: {
  title?: string;
  lead?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-brand-600/85 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
      <div className="carbon absolute inset-0 opacity-25" />
      <div className="stripes absolute inset-x-0 top-0 h-1 opacity-70" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-9 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
        <Reveal direction="right" className="max-w-2xl">
          <h2 className="display text-3xl text-white sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-white/85">{lead}</p>
        </Reveal>

        <Reveal direction="left" delay={120} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/quote" variant="light" size="lg" className="sheen group whitespace-nowrap">
            Get A Free Quote
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <a
            href={business.phoneHref}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-white/60 px-8 py-4 font-display text-lg font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <Phone className="size-5" />
            {business.phoneDisplay}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
