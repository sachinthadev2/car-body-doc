import Link from "next/link";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lead,
  crumb,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  crumb?: { href: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-panel">
      <div className="carbon absolute inset-0 opacity-60" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-brand-500/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {crumb ? (
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-[13px] text-white/40">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            {crumb.map((item) => (
              <span key={item.href} className="flex items-center gap-2">
                <span className="text-white/20">/</span>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        ) : null}

        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="display max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl">{title}</h1>
        {lead ? <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/60">{lead}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
