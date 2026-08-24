import type { Metadata } from "next";

import { CtaBand } from "@/components/site/CtaBand";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";

export const metadata: Metadata = {
  title: "Before & After Gallery",
  description:
    "Real mobile smash repair, spray painting, dent and scratch removal jobs done across Sydney. Drag the slider to see the before and after.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Before &amp; after"
        lead="Every one of these was repaired on site - in a driveway, a work car park or on the street. Drag the slider to see the difference."
        crumb={[{ href: "/gallery", label: "Gallery" }]}
      />

      <Section>
        <GalleryGrid />
      </Section>

      <CtaBand title="Want yours to look like that?" lead="Send a photo of the damage and we will tell you exactly what it takes." />
    </>
  );
}
