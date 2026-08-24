import type { Metadata } from "next";

import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${business.name} collects, uses and protects your personal information.`,
};

const sections = [
  {
    title: "What we collect",
    body: [
      "When you request a quote, make a booking, create an account or send us a message we collect your name, email address, phone number, the suburb and address where the work will happen, details about your vehicle, and any photos or notes you send us about the damage.",
      "We also collect basic technical information such as your IP address and browser type through standard server logs.",
    ],
  },
  {
    title: "Why we collect it",
    body: [
      "We use your information to prepare quotes, schedule and carry out repairs, contact you about your job, issue invoices, and keep a record of work we have done on your vehicle.",
      "We may also use your contact details to follow up on a quote you have not responded to. You can ask us to stop at any time.",
    ],
  },
  {
    title: "Who we share it with",
    body: [
      "We do not sell your personal information. We share it only where it is needed to do the job: with your insurer if you ask us to quote on a claim, with paint or parts suppliers where a specific product is required, and with the service providers who run our website, database and email systems.",
      "We may disclose information where we are required to by law.",
    ],
  },
  {
    title: "Photos of your vehicle",
    body: [
      "Photos you send us are used to assess and quote the repair. We may use before and after photos of completed work in our gallery or on social media, with identifying details such as number plates removed. If you would prefer we did not, just tell us and we will not.",
    ],
  },
  {
    title: "Storage and security",
    body: [
      "Your information is stored on secured, access-controlled servers. Passwords are stored as one-way hashes and are never visible to us. We keep records for as long as needed to service warranty claims and meet our tax and legal obligations.",
    ],
  },
  {
    title: "Accessing or deleting your information",
    body: [
      `You can ask to see the personal information we hold about you, correct it, or have it deleted. Email ${business.email} or call ${business.phoneDisplay} and we will action it.`,
    ],
  },
  {
    title: "Cookies",
    body: [
      "This site uses a single essential cookie to keep you logged in to your account. It is not used for advertising or cross-site tracking.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lead={`How ${business.name} handles your personal information, in plain English.`}
        crumb={[{ href: "/privacy", label: "Privacy" }]}
      />

      <Section>
        <div className="max-w-3xl space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="display text-2xl text-white">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[15px] leading-relaxed text-white/60">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          <div className="border border-hairline bg-panel p-6">
            <h2 className="display text-xl text-white">Questions about privacy</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/60">
              Contact us at{" "}
              <a href={`mailto:${business.email}`} className="text-brand-500 hover:underline">
                {business.email}
              </a>{" "}
              or call{" "}
              <a href={business.phoneHref} className="text-brand-500 hover:underline">
                {business.phoneDisplay}
              </a>
              . If you are not happy with our response you can raise it with the Office of the Australian Information
              Commissioner.
            </p>
          </div>

          <p className="border-t border-hairline pt-6 text-[13px] text-white/35">
            This policy is a starting point and should be reviewed by your own legal adviser before launch.
          </p>
        </div>
      </Section>
    </>
  );
}
