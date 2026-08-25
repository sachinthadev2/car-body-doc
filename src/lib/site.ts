import type { ServiceType } from "@/generated/prisma/enums";

import { galleryPhotos, photos } from "@/lib/images";

/**
 * Single source of truth for everything about the business.
 * Update the details here and they change across the whole site.
 */
export const business = {
  name: "Car Body Doc",
  tagline: "Mobile Smash Repairs",
  promise: "We Come To You",
  phoneDisplay: "0423 485 813",
  phoneHref: "tel:+61423485813",
  email: "info@carbodydoc.com.au",
  abn: "00 000 000 000",
  baseCity: "Sydney",
  addressRegion: "NSW",
  serviceRadiusKm: 50,
  /** Swap these for real photos: drop files in /public and update the paths. */
  heroImage: photos.hero,
  trailerImage: photos.maskedCar,
  hours: [
    { days: "Monday - Friday", time: "7:00am - 5:00pm" },
    { days: "Saturday", time: "8:00am - 2:00pm" },
    { days: "Sunday", time: "Closed (call-outs by arrangement)" },
  ],
  socials: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
  },
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type Service = {
  slug: string;
  type: ServiceType;
  name: string;
  short: string;
  blurb: string;
  priceFrom: string;
  turnaround: string;
  image: string;
  intro: string;
  covers: string[];
  process: { title: string; detail: string }[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "smash-repairs",
    type: "SMASH_REPAIRS",
    name: "Smash Repairs",
    short: "Panel damage from bumps, scrapes and collisions - repaired at your place.",
    blurb:
      "Bumper bars, guards, doors and quarter panels repaired and refinished on site. No tow truck, no workshop queue.",
    priceFrom: "$350",
    turnaround: "Most jobs done in 1 day",
    image: photos.smashRepairs,
    intro:
      "Been in a knock? Most non-structural collision damage can be repaired right where your car is parked. We bring the full mobile workshop to your driveway, street or workplace car park and hand the car back the same day in most cases.",
    covers: [
      "Bumper bar cracks, scuffs and dents",
      "Guard, door and quarter panel damage",
      "Car park bingles and reverse-into-a-pole jobs",
      "Plastic bumper repairs and re-texturing",
      "Panel alignment and clip replacement",
      "Colour-matched refinishing and blending",
    ],
    process: [
      { title: "Assess", detail: "We check the damage in person or from your photos and confirm the fixed price." },
      { title: "Prep", detail: "Panel is stripped back, dents pulled, filled and sanded flat." },
      { title: "Paint", detail: "Colour matched to your paint code and sprayed in the mobile booth." },
      { title: "Finish", detail: "Clear coat, cut and polish, then blended into the surrounding panels." },
    ],
    faqs: [
      {
        q: "Can you repair structural or chassis damage?",
        a: "No. Anything involving chassis rails, airbags or suspension needs a full workshop with a chassis bench. We tell you straight away if that is what you are looking at and point you in the right direction.",
      },
      {
        q: "Do you handle insurance work?",
        a: "Yes. We can provide a written quote for your insurer, and plenty of customers choose to pay us direct because the repair comes in under their excess.",
      },
    ],
  },
  {
    slug: "spray-paint",
    type: "SPRAY_PAINT",
    name: "Spray Paint",
    short: "Colour-matched spray painting and refinishing, done on site.",
    blurb:
      "Factory paint codes matched with a computerised mixing system, sprayed in a mobile booth and blended so you cannot see the join.",
    priceFrom: "$300",
    turnaround: "Same day for single panels",
    image: photos.sprayPaint,
    intro:
      "Faded clear coat, key marks, mismatched bumpers or a panel that has been resprayed badly by someone else - we colour match to your factory paint code and refinish the panel on site with automotive two-pack.",
    covers: [
      "Single panel and full bumper respray",
      "Colour matching from your paint code",
      "Clear coat peel and sun damage",
      "Mirror caps, spoilers and body kits",
      "Wheel arch and sill refinishing",
      "Blending into adjacent panels for an invisible repair",
    ],
    process: [
      { title: "Match", detail: "We read your paint code and mix the exact colour, including pearls and metallics." },
      { title: "Mask", detail: "Everything around the repair is masked and the area is sealed off." },
      { title: "Spray", detail: "Base coat then two-pack clear, applied in the enclosed mobile booth." },
      { title: "Cure & Polish", detail: "Force cured, then cut and polished to a factory finish." },
    ],
    faqs: [
      {
        q: "Will the new paint match the rest of the car?",
        a: "Yes. We match to the factory code and then blend into the neighbouring panels so any slight fade in your original paint is accounted for.",
      },
      {
        q: "Can you spray in my driveway?",
        a: "In most cases yes. The mobile booth contains overspray. We just need a reasonably flat, accessible spot with a little room around the car.",
      },
    ],
  },
  {
    slug: "buff-and-polish",
    type: "BUFF_POLISH",
    name: "Buff & Polish",
    short: "Machine cut and polish that lifts dull, swirled and scratched paint.",
    blurb:
      "A proper machine cut and polish that removes swirl marks, oxidation and light scratches, then seals the paint.",
    priceFrom: "$180",
    turnaround: "2 - 4 hours",
    image: photos.buffPolish,
    intro:
      "Paint looking flat, chalky or covered in swirls from the automatic car wash? A machine cut and polish removes the damaged top layer of clear coat and brings back the gloss - a huge difference before selling or handing back a lease car.",
    covers: [
      "Swirl marks and hologram removal",
      "Oxidised and chalky paint restoration",
      "Light scratch and water spot removal",
      "Headlight restoration",
      "Pre-sale and end-of-lease detailing",
      "Paint sealant for lasting protection",
    ],
    process: [
      { title: "Wash", detail: "Full decontamination wash and clay bar to lift bonded contaminants." },
      { title: "Cut", detail: "Machine compound to level the clear coat and remove defects." },
      { title: "Polish", detail: "Refining polish to bring up depth and gloss." },
      { title: "Protect", detail: "Sealant applied to protect the finish for months, not weeks." },
    ],
    faqs: [
      {
        q: "Will polishing remove every scratch?",
        a: "If you can catch it with a fingernail it is through the clear coat and needs paint. Anything lighter than that usually polishes out completely.",
      },
      {
        q: "How long does the finish last?",
        a: "With the sealant we apply and normal hand washing, expect 6 to 12 months of solid gloss.",
      },
    ],
  },
  {
    slug: "dent-and-scratch-removal",
    type: "DENT_SCRATCH",
    name: "Dent & Scratch Removal",
    short: "Door dings, trolley dents and key scratches sorted in a couple of hours.",
    blurb:
      "Small dents and scratches fixed fast and affordably - the everyday damage that is not worth an insurance claim.",
    priceFrom: "$150",
    turnaround: "1 - 3 hours",
    image: photos.dentScratch,
    intro:
      "Shopping centre door dings, trolley dents, key scratches down the side, scuffed bumper corners. These are the jobs panel shops do not want and charge a fortune for. They are exactly what a mobile setup is built for.",
    covers: [
      "Door dings and trolley dents",
      "Paintless dent removal where the paint is intact",
      "Key scratches and scrape marks",
      "Scuffed bumper corners and mirror caps",
      "Stone chip touch-ups",
      "Alloy wheel scuff repairs",
    ],
    process: [
      { title: "Inspect", detail: "We work out whether it is a paintless pull or needs filling and paint." },
      { title: "Repair", detail: "Dent massaged out or filled and shaped back to the original contour." },
      { title: "Refinish", detail: "Colour matched, sprayed and clear coated where paint is involved." },
      { title: "Polish", detail: "Cut and polished so the repair disappears into the panel." },
    ],
    faqs: [
      {
        q: "What is paintless dent removal?",
        a: "If the paint is not broken we can often massage the dent out from behind the panel with specialist tools. No filler, no paint, and it keeps your original factory finish.",
      },
      {
        q: "Is it worth claiming on insurance?",
        a: "Usually not. Most of these repairs come in well under a typical excess, and you keep your no-claim bonus.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function serviceByType(type: ServiceType) {
  return services.find((s) => s.type === type);
}

/** Options for the service dropdowns in the forms. */
export const serviceOptions: { value: ServiceType; label: string }[] = [
  ...services.map((s) => ({ value: s.type, label: s.name })),
  { value: "OTHER" as ServiceType, label: "Something else / not sure" },
];

export const howItWorks = [
  {
    step: "01",
    title: "Send us photos",
    detail:
      "Fill in the quote form with a few photos of the damage. Takes two minutes from your phone in the car park.",
  },
  {
    step: "02",
    title: "Get a fixed price",
    detail:
      "We come back with a firm, no-obligation price - usually the same day. No surprise charges later.",
  },
  {
    step: "03",
    title: "We come to you",
    detail:
      "Pick a day and we turn up at your home or workplace with the fully equipped trailer and get it done.",
  },
];

export const whyUs = [
  {
    title: "No towing, no drop-off",
    detail: "Your car never leaves your driveway. No hire car, no lifts to the workshop, no lost days.",
  },
  {
    title: "Cheaper than a panel shop",
    detail: "No workshop rent and no big overheads, so the savings go straight into your quote.",
  },
  {
    title: "Fully equipped mobile setup",
    detail: "Compressor, spray booth, paint mixing and power all travel with us. We are self-sufficient on site.",
  },
  {
    title: "Fixed, honest quotes",
    detail: "The price we quote is the price you pay. If we find something extra we call you first.",
  },
  {
    title: "Factory colour matching",
    detail: "Computerised paint matching to your exact code, including pearls, metallics and tri-coats.",
  },
  {
    title: "Work guaranteed",
    detail: "Every repair is backed by our workmanship guarantee. If it is not right, we come back.",
  },
];

export const trustPoints = [
  { title: "Mobile Service", detail: "We come to you" },
  { title: "Free Quotes", detail: "Photo quotes, same day" },
  { title: "Insurance Welcome", detail: "Written quotes provided" },
  { title: "Work Guaranteed", detail: "Backed workmanship" },
];

/** Sydney coverage. Add or remove suburbs here. */
export const serviceAreas = [
  {
    region: "Sydney CBD & Inner City",
    suburbs: ["Sydney CBD", "Surry Hills", "Redfern", "Alexandria", "Zetland", "Mascot", "Pyrmont", "Glebe", "Ultimo"],
  },
  {
    region: "Inner West",
    suburbs: ["Newtown", "Marrickville", "Leichhardt", "Balmain", "Ashfield", "Burwood", "Strathfield", "Concord", "Five Dock"],
  },
  {
    region: "Eastern Suburbs",
    suburbs: ["Bondi", "Bondi Junction", "Randwick", "Coogee", "Maroubra", "Waverley", "Double Bay", "Kensington", "Rosebery"],
  },
  {
    region: "North Shore & Northern Beaches",
    suburbs: ["North Sydney", "Chatswood", "Mosman", "Lane Cove", "Ryde", "Epping", "Hornsby", "Manly", "Dee Why", "Brookvale"],
  },
  {
    region: "Western Sydney",
    suburbs: ["Parramatta", "Blacktown", "Castle Hill", "Baulkham Hills", "Merrylands", "Auburn", "Penrith", "Rooty Hill", "Seven Hills"],
  },
  {
    region: "South & Sutherland Shire",
    suburbs: ["Hurstville", "Kogarah", "Rockdale", "Bankstown", "Miranda", "Sutherland", "Cronulla", "Caringbah", "Sylvania"],
  },
  {
    region: "South West Sydney",
    suburbs: ["Liverpool", "Fairfield", "Cabramatta", "Ingleburn", "Campbelltown", "Camden", "Narellan", "Casula"],
  },
  {
    region: "North West Sydney",
    suburbs: ["Rouse Hill", "Kellyville", "Bella Vista", "Norwest", "Cherrybrook", "Glenwood", "Stanhope Gardens", "The Ponds"],
  },
];

export const allSuburbs = serviceAreas.flatMap((a) => a.suburbs).sort();

/**
 * Gallery is intentionally hardcoded - drop your real photos into
 * /public/gallery and update the paths below. No admin screen needed.
 */
export type GalleryItem = {
  id: string;
  title: string;
  service: ServiceType;
  suburb: string;
  before: string;
  after: string;
  detail: string;
};

export const gallery: GalleryItem[] = [
  {
    id: "g1",
    title: "Rear bumper scrape",
    service: "SMASH_REPAIRS",
    suburb: "Parramatta",
    before: galleryPhotos.bumperBefore,
    after: galleryPhotos.bumperAfter,
    detail: "Cracked and scuffed rear bumper repaired, re-textured and resprayed on site in one day.",
  },
  {
    id: "g2",
    title: "Front guard respray",
    service: "SPRAY_PAINT",
    suburb: "Bondi",
    before: galleryPhotos.guardBefore,
    after: galleryPhotos.guardAfter,
    detail: "Sun-damaged clear coat stripped back and refinished in factory pearl white.",
  },
  {
    id: "g3",
    title: "Key scratch down both doors",
    service: "DENT_SCRATCH",
    suburb: "Chatswood",
    before: galleryPhotos.scratchBefore,
    after: galleryPhotos.scratchAfter,
    detail: "Deep key scratch filled, colour matched and blended across two doors.",
  },
  {
    id: "g4",
    title: "Swirled black paint",
    service: "BUFF_POLISH",
    suburb: "Liverpool",
    before: galleryPhotos.polishBefore,
    after: galleryPhotos.polishAfter,
    detail: "Two-stage machine cut and polish removed years of car wash swirls, then sealed the paint.",
  },
  {
    id: "g5",
    title: "Trolley dent in door",
    service: "DENT_SCRATCH",
    suburb: "Hurstville",
    before: galleryPhotos.dentBefore,
    after: galleryPhotos.dentAfter,
    detail: "Paintless dent removal on a shopping centre trolley dent - original paint untouched.",
  },
  {
    id: "g6",
    title: "Corner park collision",
    service: "SMASH_REPAIRS",
    suburb: "Penrith",
    before: galleryPhotos.collisionBefore,
    after: galleryPhotos.collisionAfter,
    detail: "Front corner panel reshaped, filled and refinished at the customer workplace.",
  },
];

export const testimonials = [
  {
    name: "Sarah M.",
    suburb: "Marrickville",
    rating: 5,
    text: "Reversed into a pole and thought it would cost a fortune. They came to my work, fixed the bumper in the car park while I was in meetings and it looks brand new. Half what the panel shop quoted.",
  },
  {
    name: "Dimitri K.",
    suburb: "Blacktown",
    rating: 5,
    text: "Sent photos in the morning, had a price back by lunch, booked in for the Saturday. Turned up on time and the colour match on my metallic grey is perfect. Cannot fault them.",
  },
  {
    name: "Rachel T.",
    suburb: "Cronulla",
    rating: 5,
    text: "End of lease and the car was covered in scratches and swirls. The cut and polish saved me a big return penalty. Honest, great work, would use again.",
  },
];

export const faqs = [
  {
    category: "General",
    items: [
      {
        q: "What does mobile smash repair actually mean?",
        a: "We bring the workshop to you. The trailer carries a compressor, generator, spray booth, paint mixing system and every tool needed to strip, repair, paint and polish a panel on site - at your home, workplace or anywhere your car is parked.",
      },
      {
        q: "How long does a repair take?",
        a: "Most single-panel repairs are done in a day. Dent and scratch jobs are often 1 to 3 hours. We tell you the exact timeframe when we quote.",
      },
      {
        q: "What kinds of damage cannot be repaired on site?",
        a: "Structural or chassis damage, airbag deployment, major panel replacement and anything needing a chassis alignment bench. We tell you upfront if your job falls into that category.",
      },
    ],
  },
  {
    category: "Mobile Service",
    items: [
      {
        q: "What do you need at my place?",
        a: "A flat, accessible parking space with a bit of room around the car. We carry our own power, so we do not need to plug into your house, though we can if it is easier.",
      },
      {
        q: "Can you work in an apartment car park?",
        a: "Usually yes, as long as there is ventilation and building management is fine with it. An outdoor visitor space or street parking works too.",
      },
      {
        q: "What if it rains on my booking day?",
        a: "Paint work needs dry conditions. If the weather turns we call you and move the booking to the next suitable day at no charge.",
      },
      {
        q: "Which areas of Sydney do you cover?",
        a: "All of greater Sydney - CBD, Inner West, Eastern Suburbs, North Shore, Northern Beaches, Western Sydney, the Sutherland Shire and South West. If you are outside that radius, give us a call and we will see what we can do.",
      },
    ],
  },
  {
    category: "Pricing & Insurance",
    items: [
      {
        q: "How much will my repair cost?",
        a: "Dent and scratch work starts around $150, polishing from $180, spray work from $300 and collision repairs from $350. Send photos through the quote form and we will give you a firm price - free, with no obligation.",
      },
      {
        q: "Do you work with insurance companies?",
        a: "Yes. We provide written quotes you can lodge with your insurer. That said, a lot of our work comes in under the typical excess, so paying us direct keeps your no-claim bonus intact.",
      },
      {
        q: "How do I pay?",
        a: "Card, bank transfer or cash on completion. Payment is due once you are happy with the finished job.",
      },
    ],
  },
  {
    category: "Paint & Warranty",
    items: [
      {
        q: "How do you match my car colour?",
        a: "We read your factory paint code off the compliance plate and mix that exact formula, then blend into the surrounding panels so any fade in your original paint is accounted for.",
      },
      {
        q: "Is the repair guaranteed?",
        a: "Yes. All workmanship is guaranteed. If the paint lifts, flakes or the repair fails, we come back and put it right.",
      },
      {
        q: "How soon can I wash the car afterwards?",
        a: "Hand wash after 7 days, and hold off on wax or a high pressure wash for about 30 days while the paint fully cures.",
      },
    ],
  },
];

export const mainNav = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/**
 * Home page hero rotator. Add or remove an entry and the slider adapts -
 * three works best, four is the sensible maximum before people stop watching.
 */
export type HeroSlide = {
  id: string;
  image: string;
  eyebrow: string;
  /** White headline lines, followed by the red accent line. */
  lines: string[];
  accent: string;
  lead: string;
  cta: { href: string; label: string };
  points: string[];
};

export const heroSlides: HeroSlide[] = [
  {
    id: "mobile",
    image: photos.hero,
    eyebrow: "Servicing all of Sydney",
    lines: ["Mobile Smash", "Repairs."],
    accent: "We Come To You.",
    lead: "Dents, scratches, bumper damage and paintwork repaired at your home or workplace. No towing, no workshop queue, no lost day.",
    cta: { href: "/quote", label: "Get A Free Quote" },
    points: ["Same day quotes", "Fixed pricing", "Insurance work welcome", "Work guaranteed"],
  },
  {
    id: "dents",
    image: photos.smashRepairs,
    eyebrow: "Dent & scratch work from $150",
    lines: ["Dents & Scratches", "Gone In Hours."],
    accent: "Not Days.",
    lead: "Trolley dents, key scratches and scuffed bumper corners sorted in your driveway - usually in under three hours, and well under a typical insurance excess.",
    cta: { href: "/services/dent-and-scratch-removal", label: "Dent & Scratch Repair" },
    points: ["Paintless dent removal", "No claim needed", "1 - 3 hour turnaround", "Keep your no-claim bonus"],
  },
  {
    id: "paint",
    image: photos.sprayPaint,
    eyebrow: "Computerised colour matching",
    lines: ["Factory Colour", "Matched Paint."],
    accent: "Sprayed On Site.",
    lead: "An enclosed mobile booth, computerised paint mixing and two-pack automotive clear - the same finish as a workshop, in your driveway.",
    cta: { href: "/services/spray-paint", label: "See Spray Painting" },
    points: ["Pearls & metallics", "Blended into panels", "Single panels same day", "Force cured on site"],
  },
];
