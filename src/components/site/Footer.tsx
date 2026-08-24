import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { business, serviceAreas, services } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-panel">
      <div className="stripes h-1.5 w-full opacity-80" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="display text-2xl text-white">
              Car Body <span className="text-brand-500">Doc</span>
            </div>
            <p className="mt-1 font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
              {business.tagline} &middot; {business.promise}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-white/55">
              Fully mobile smash repairs, spray painting and paint correction across greater {business.baseCity}. We
              bring the workshop to your driveway.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={business.socials.facebook}
                className="flex size-9 items-center justify-center border border-hairline text-white/60 transition-colors hover:border-brand-500 hover:text-white"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href={business.socials.instagram}
                className="flex size-9 items-center justify-center border border-hairline text-white/60 transition-colors hover:border-brand-500 hover:text-white"
                aria-label="Instagram"
              >
                ig
              </a>
            </div>
          </div>

          <div>
            <h3 className="display text-lg text-white">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="text-white/55 transition-colors hover:text-brand-400">
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/quote" className="text-white/55 transition-colors hover:text-brand-400">
                  Free Quote
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-white/55 transition-colors hover:text-brand-400">
                  Book a Job
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="display text-lg text-white">Areas We Cover</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {serviceAreas.map((area) => (
                <li key={area.region} className="text-white/55">
                  {area.region}
                </li>
              ))}
              <li>
                <Link href="/service-areas" className="text-brand-400 hover:text-brand-500">
                  See all suburbs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="display text-lg text-white">Get In Touch</h3>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <a href={business.phoneHref} className="font-display text-xl text-white hover:text-brand-400">
                  {business.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <a href={`mailto:${business.email}`} className="text-white/55 hover:text-white">
                  {business.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <span className="text-white/55">
                  Mobile service across {business.baseCity}, {business.addressRegion}
                </span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <span className="text-white/55">
                  {business.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {year} {business.name}. ABN {business.abn}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/admin/login" className="hover:text-white">
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
