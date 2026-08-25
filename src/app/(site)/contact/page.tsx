import { Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/images";
import { business, serviceAreas } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Call ${business.phoneDisplay} or send us a message. Mobile smash repairs across Sydney, seven days by arrangement.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        lead="Quickest way to a price is the quote form with photos. For anything else, call us or drop a message below."
        crumb={[{ href: "/contact", label: "Contact" }]}
        image={photos.detailer}
        imageAlt="Technician at work"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <a href={business.phoneHref} className="block border border-hairline bg-panel p-7 transition-colors hover:border-brand-500">
              <Phone className="size-6 text-brand-500" />
              <p className="mt-4 text-sm uppercase tracking-widest text-white/40">Call us</p>
              <p className="display text-3xl text-white">{business.phoneDisplay}</p>
              <p className="mt-1 text-sm text-white/45">Fastest answer during business hours</p>
            </a>

            <a href={`mailto:${business.email}`} className="block border border-hairline bg-panel p-7 transition-colors hover:border-brand-500">
              <Mail className="size-6 text-brand-500" />
              <p className="mt-4 text-sm uppercase tracking-widest text-white/40">Email</p>
              <p className="font-display text-xl text-white">{business.email}</p>
              <p className="mt-1 text-sm text-white/45">We reply within a few hours</p>
            </a>

            <div className="border border-hairline bg-panel p-7">
              <Clock className="size-6 text-brand-500" />
              <p className="mt-4 text-sm uppercase tracking-widest text-white/40">Hours</p>
              <ul className="mt-2 space-y-1.5 text-base text-white/65">
                {business.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4">
                    <span>{h.days}</span>
                    <span className="text-white/45">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-hairline bg-panel p-7">
              <MapPin className="size-6 text-brand-500" />
              <p className="mt-4 text-sm uppercase tracking-widest text-white/40">Where we work</p>
              <p className="mt-1 text-base leading-relaxed text-white/65">
                Fully mobile across greater {business.baseCity}: {serviceAreas.map((a) => a.region).join(", ")}.
              </p>
              <ButtonLink href="/service-areas" variant="outline" size="sm" className="mt-5">
                See All Suburbs
              </ButtonLink>
            </div>
          </div>

          <div>
            <div className="border border-hairline bg-panel p-6 sm:p-9">
              <h2 className="display flex items-center gap-2.5 text-2xl text-white">
                <MessageSquare className="size-6 text-brand-500" />
                Send a message
              </h2>
              <p className="mt-2 text-[0.95rem] text-white/50">
                After a price? The{" "}
                <a href="/quote" className="text-brand-500 hover:underline">
                  quote form
                </a>{" "}
                with photos will get you an answer much faster.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
