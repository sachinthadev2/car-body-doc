import type { Metadata } from "next";

import { CtaBand } from "@/components/site/CtaBand";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { photos } from "@/lib/images";
import { faqs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "How mobile smash repairs work, what we can and cannot fix on site, pricing, insurance, paint matching and warranty - answered.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="FAQ"
        title="Questions, answered"
        lead="The things people ask us most. If yours is not here, call us - we would rather talk it through than have you guessing."
        crumb={[{ href: "/faq", label: "FAQ" }]}
        image={photos.booth}
        imageAlt="Mobile spray booth"
      />

      <Section>
        <div className="space-y-16">
          {faqs.map((group) => (
            <div key={group.category} className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr]">
              <h2 className="display rule text-3xl text-white">{group.category}</h2>
              <FaqAccordion items={group.items} />
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Still not sure?"
        lead="Send a photo through and we will tell you exactly what your car needs."
        image={photos.sprayPaint}
      />
    </>
  );
}
