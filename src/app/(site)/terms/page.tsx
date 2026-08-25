import type { Metadata } from "next";

import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply to quotes, bookings and repairs carried out by ${business.name}.`,
};

const sections = [
  {
    title: "Quotes",
    body: [
      "Quotes given from photos are an estimate based on the information supplied. If the damage on arrival is materially different to the photos - hidden damage, cracked mounts, previous repairs - we will tell you the revised price before starting any work. You are free to decline at that point at no cost.",
      "Written quotes are valid for 30 days from the date issued.",
    ],
  },
  {
    title: "Bookings and access",
    body: [
      "Bookings are confirmed by email or phone. You are responsible for making sure the vehicle is accessible on the day, with reasonable clearance around it, and that any building or strata permission needed has been obtained.",
      "If we arrive and cannot access the vehicle or carry out the work safely, a call-out fee may apply.",
    ],
  },
  {
    title: "Weather and rescheduling",
    body: [
      "Paint and refinishing work requires dry conditions. If weather makes the work unsafe or would compromise the finish we will reschedule at no charge to the next suitable day.",
      "We ask for at least 24 hours notice if you need to cancel or move a booking.",
    ],
  },
  {
    title: "Scope of work",
    body: [
      "We carry out cosmetic and non-structural panel, paint and paint-correction work. We do not perform structural or chassis repairs, airbag or safety system work, or any repair requiring a chassis alignment bench. Where a job falls outside what can be safely done on site we will say so and recommend a workshop.",
      "We do not certify vehicles as roadworthy and our work does not constitute a safety inspection.",
    ],
  },
  {
    title: "Payment",
    body: [
      "Payment is due on completion unless otherwise agreed in writing. We accept card, bank transfer and cash. Ownership of any parts supplied remains with us until payment is received in full.",
    ],
  },
  {
    title: "Warranty",
    body: [
      "Workmanship on repairs we carry out is guaranteed against defects such as paint lifting, flaking or colour failure caused by our application. The guarantee does not cover new damage, stone chips, accident damage, neglect, or deterioration of surrounding original paint.",
      "Newly painted panels should be hand washed only for the first 7 days, and kept clear of wax, polish and high pressure washing for 30 days while the paint cures. Damage caused by not following this is not covered.",
    ],
  },
  {
    title: "Liability",
    body: [
      "Nothing in these terms excludes any rights you have under the Australian Consumer Law. Beyond those rights, our liability is limited to re-performing the work or refunding the amount paid for it.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        lead={`The terms that apply when ${business.name} quotes or carries out work on your vehicle.`}
        crumb={[{ href: "/terms", label: "Terms" }]}
      />

      <Section>
        <div className="max-w-3xl space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="display text-2xl text-white">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-relaxed text-white/60">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          <p className="border-t border-hairline pt-6 text-sm text-white/35">
            These terms are a starting point and should be reviewed by your own legal adviser before launch.
          </p>
        </div>
      </Section>
    </>
  );
}
