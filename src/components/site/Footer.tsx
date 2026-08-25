import { CalendarClock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { NewsletterForm } from "@/components/site/NewsletterForm";
import { Reveal } from "@/components/site/Reveal";
import { business, services } from "@/lib/site";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Service" },
  { href: "/gallery", label: "Gallery" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/contact", label: "Contact Us" },
];

const moreLinks = [
  { href: "/book", label: "Appointment" },
  { href: "/quote", label: "Free Quote" },
  { href: "/faq", label: "FA Question" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink">
      {/* ------------------------------------------------------- Newsletter */}
      <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        {/* Oversized ghost word sitting behind the copy */}
        <span
          aria-hidden
          className="display pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 select-none whitespace-nowrap text-[18vw] leading-none text-white/[0.045] sm:top-4 lg:text-[9rem]"
        >
          Newsletter
        </span>

        <Reveal className="relative grid items-center gap-8 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <h2 className="display text-2xl leading-tight text-white sm:text-3xl">
            Sign up for our newsletter to get weekly updates on exclusive offers and discounts!
          </h2>
          <NewsletterForm />
        </Reveal>
      </div>

      {/* ------------------------------------------------------------ Main */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-brand-500/70 via-brand-500/30 to-transparent" />

        <div className="grid gap-12 py-14 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <Reveal>
            <Link href="/" className="group flex items-center gap-3">
              <span className="flex size-10 items-center justify-center bg-brand-500 font-display text-xl font-bold leading-none text-white transition-transform duration-300 group-hover:scale-105">
                CB
              </span>
              <span className="display text-2xl text-white">
                Car Body <span className="text-brand-500">Doc</span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-base leading-relaxed text-white/55">
              Fully mobile smash repairs, spray painting and paint correction across greater {business.baseCity}. We
              bring the workshop to your driveway - no towing, no drop-off, no lost days.
            </p>

            <a href={business.phoneHref} className="group mt-8 flex items-center gap-4">
              <span className="anim-pulse-ring flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                <Phone className="size-6" />
              </span>
              <span className="display text-3xl text-white transition-colors group-hover:text-brand-400 sm:text-4xl">
                {business.phoneDisplay}
              </span>
            </a>
          </Reveal>

          {/* Quick links */}
          <Reveal delay={80}>
            <h3 className="font-display text-lg uppercase tracking-wide text-white">Quick Links</h3>
            <ul className="mt-6 space-y-3.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw text-base text-white/55 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Services + more */}
          <Reveal delay={140}>
            <h3 className="font-display text-lg uppercase tracking-wide text-white">Our Services</h3>
            <ul className="mt-6 space-y-3.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="link-draw text-base text-white/55 transition-colors hover:text-white"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              {moreLinks.slice(0, 1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw text-base text-white/55 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Location & contact */}
          <Reveal delay={200}>
            <h3 className="font-display text-lg uppercase tracking-wide text-white">Location &amp; Contact</h3>
            <ul className="mt-6 space-y-5 text-base">
              <li className="flex gap-3">
                <MapPin className="mt-1 size-5 shrink-0 text-brand-500" />
                <span className="text-white/60">
                  Mobile service across {business.baseCity},
                  <br />
                  {business.addressRegion}, Australia
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-1 size-5 shrink-0 text-brand-500" />
                <a href={`mailto:${business.email}`} className="text-white/60 transition-colors hover:text-white">
                  {business.email}
                </a>
              </li>
              <li className="flex gap-3">
                <CalendarClock className="mt-1 size-5 shrink-0 text-brand-500" />
                <span className="text-white/60">
                  {business.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-500/30 to-brand-500/70" />

        {/* --------------------------------------------------------- Bottom */}
        <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-white/45">
            Copyright {year}, All Rights reserved &middot; ABN {business.abn}
          </p>

          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="mr-2 text-sm text-white/30 transition-colors hover:text-white/70">
              Staff Login
            </Link>
            <Social href={business.socials.facebook} label="Facebook">
              <path d="M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V11H8v3h2v7h3v-7h2.2l.5-3H13v-1.2c0-.5.2-.8.5-.8Z" />
            </Social>
            <Social href={business.socials.instagram} label="Instagram">
              <path d="M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.9-7.8a1.07 1.07 0 1 1-2.15 0 1.07 1.07 0 0 1 2.15 0ZM16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5Zm3.4 13a3.4 3.4 0 0 1-3.4 3.4H8A3.4 3.4 0 0 1 4.6 16V8A3.4 3.4 0 0 1 8 4.6h8A3.4 3.4 0 0 1 19.4 8v8Z" />
            </Social>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** lucide-react v1 dropped brand marks, so socials use inline paths. */
function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="flex size-10 items-center justify-center rounded-full border border-hairline text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500 hover:text-white"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4.5" aria-hidden>
        {children}
      </svg>
    </a>
  );
}
