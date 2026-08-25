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

/**
 * Before / after pairs. Colour matched so each pair reads as one car.
 * PLACEHOLDER - replace with photos of your own jobs.
 */
export const galleryPhotos = {
  bumperBefore: u("photo-1745234176689-7d1673f76df6", 1200),
  bumperAfter: u("photo-1608412217889-1ec8ac1d5878", 1200),
  guardBefore: u("photo-1660605674048-a260f510fa28", 1200),
  guardAfter: u("photo-1630933047075-984cbb6e9cf6", 1200),
  scratchBefore: u("photo-1729554981212-6557ef8e4835", 1200),
  scratchAfter: u("photo-1580089469671-f371f7678b34", 1200),
  polishBefore: u("photo-1550565076-b2371ea1a324", 1200),
  polishAfter: u("photo-1618642542397-ef97a739f1d7", 1200),
  dentBefore: u("photo-1673638628559-4ee003847183", 1200),
  dentAfter: u("photo-1621441916074-96050a7b1592", 1200),
  collisionBefore: u("photo-1707510844729-c0a09348f54f", 1200),
  collisionAfter: u("photo-1663589714502-80bf7a6579c2", 1200),
} as const;
