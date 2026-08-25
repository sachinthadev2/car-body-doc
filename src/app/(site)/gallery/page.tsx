import type { Metadata } from "next";

import { CtaBand } from "@/components/site/CtaBand";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { MasonryGallery } from "@/components/site/MasonryGallery";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionHeading } from "@/components/site/Section";
import { photos } from "@/lib/images";

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
        title="The work, up close"
        lead="Every one of these was done on site - in a driveway, a work car park or on the street. Tap any photo to open it full size."
        crumb={[{ href: "/gallery", label: "Gallery" }]}
        image={photos.paintDetail}
        imageAlt="Close up of a freshly finished panel"
      />

      <Section>
        <MasonryGallery />
      </Section>

      <Section tone="panel">
        <Reveal>
          <SectionHeading
            eyebrow="Before &amp; after"
            title="Drag to see the difference"
            lead="Same panel, same day. Drag the red handle across each photo to compare the damage with the finished repair."
            align="center"
          />
        </Reveal>
        <div className="mt-12">
          <GalleryGrid />
        </div>
      </Section>

      <CtaBand
        title="Want yours to look like that?"
        lead="Send a photo of the damage and we will tell you exactly what it takes."
        image={photos.blackCar}
      />
    </>
  );
}
