/**
 * Every photograph on the site, in one place.
 *
 * These are Unsplash stock photos used as a high-quality stand-in. Swap any
 * entry for your own photo by replacing the value with a local path
 * ("/photos/my-shot.jpg") or a Cloudinary URL - nothing else needs to change.
 *
 * IMPORTANT: the `gallery` before/after pairs in src/lib/site.ts are stock cars,
 * not jobs we have done. Replace them with real photos of your own work before
 * the site goes live.
 */

const UNSPLASH = "https://images.unsplash.com";

/** Builds a sized, cropped Unsplash URL. next/image re-optimises from here. */
function u(id: string, width = 1600) {
  return `${UNSPLASH}/${id}?w=${width}&q=80&auto=format&fit=crop`;
}

export const photos = {
  /** Detailer working on a car outdoors - the "we come to you" promise. */
  hero: u("photo-1607860115477-7b3700e055b6", 2000),
  /** Machine polisher biting into dark paint. */
  heroSecondary: u("photo-1620584898989-d39f7f9ed1b7"),

  /** Panel tech working on a bumper. */
  smashRepairs: u("photo-1628577478162-d4d00467c627"),
  /** Painter in a full suit with a spray gun. */
  sprayPaint: u("photo-1666009387246-65e8ad8e7103"),
  /** Spray gun laying colour on a panel. */
  sprayGun: u("photo-1666009419871-c8bee023574e"),
  /** Dual action polisher on a headlight and guard. */
  buffPolish: u("photo-1620584899131-a5ff5f8fbb03"),
  /** Dent in a dark panel, water beaded on it. */
  dentScratch: u("photo-1550565076-b2371ea1a324"),

  /** Empty booth - used for the mobile setup story. */
  booth: u("photo-1512080482556-ea648017576c"),
  /** Masked up car mid-repair. */
  maskedCar: u("photo-1676035291793-645c307e5a4e"),
  /** Hands on the tools. */
  handsOnTools: u("photo-1618783129985-dd97dbe4ad99"),
  /** Detailer portrait. */
  detailer: u("photo-1632823471808-08b572e7381c"),
  /** Curve of freshly finished paint. */
  paintDetail: u("photo-1610092708835-af669294f3f3"),
  /** Microfibre on a finished panel. */
  microfibre: u("photo-1587742379711-0083b22a7ba1"),
  /** Deep scratches down a door - used on the quote page. */
  scratchedDoor: u("photo-1720628132037-1c58fa783bec"),

  /** Sydney, for the coverage pages. */
  sydney: u("photo-1515482758760-9535c2f0a18c", 2000),
  sydneyDusk: u("photo-1561488111-5d800fd56b8a"),

  /** Finished cars, for CTA and section backgrounds. */
  blackCar: u("photo-1669882571612-4a9c7822cd4c"),
  blackSedan: u("photo-1609521233053-345bfa8b6f17"),
  headlight: u("photo-1616591938558-fb03d845567b"),
} as const;

export const galleryPhotos = {
  bumperBefore: "/gallery/bumper-before.webp",
  bumperAfter: "/gallery/bumper-after.webp",
  guardBefore: "/gallery/guard-before.webp",
  guardAfter: "/gallery/guard-after.webp",
  scratchBefore: "/gallery/scratch-before.webp",
  scratchAfter: "/gallery/scratch-after.webp",
  polishBefore: "/gallery/polish-before.webp",
  polishAfter: "/gallery/polish-after.webp",
  dentBefore: "/gallery/dent-before.webp",
  dentAfter: "/gallery/dent-after.webp",
  collisionBefore: "/gallery/collision-before.webp",
  collisionAfter: "/gallery/collision-after.webp",
} as const;

/**
 * Mosaic shown on the gallery page. `span` controls the tile size in the
 * masonry grid - keep a mix of tall, wide and square for the collage look.
 */
export type ShowcaseItem = { src: string; alt: string; span: string };

export const showcase: ShowcaseItem[] = [
  { src: u("photo-1628577478162-d4d00467c627", 1200), alt: "Panel technician repairing a bumper", span: "col-span-1 row-span-2" },
  { src: u("photo-1652987086612-d948b775d358", 1200), alt: "Detailing a repaired sports car", span: "col-span-1 row-span-2" },
  { src: u("photo-1620584898989-d39f7f9ed1b7", 1600), alt: "Machine polishing dark paintwork", span: "col-span-2 row-span-2" },
  { src: u("photo-1666009387246-65e8ad8e7103", 1200), alt: "Spray painting a panel on site", span: "col-span-1 row-span-3" },
  { src: u("photo-1632823469901-5d2cfff5ba50", 1200), alt: "Cutting and polishing a finished panel", span: "col-span-1 row-span-2" },
  { src: u("photo-1610092708835-af669294f3f3", 1200), alt: "Close up of a colour matched respray", span: "col-span-1 row-span-3" },
  { src: u("photo-1676035291793-645c307e5a4e", 1200), alt: "Masked up vehicle ready for paint", span: "col-span-1 row-span-2" },
  { src: u("photo-1587742379711-0083b22a7ba1", 1600), alt: "Final wipe down after a repair", span: "col-span-2 row-span-2" },
  { src: u("photo-1618783129985-dd97dbe4ad99", 1200), alt: "Hands on the tools in the mobile workshop", span: "col-span-1 row-span-2" },
];
