import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  lead,
  crumb,
  image,
  imageAlt,
  align = "left",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  crumb?: { href: string; label: string }[];
  /** Background photograph. Falls back to the carbon texture when omitted. */
  image?: string;
  imageAlt?: string;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-hairline bg-panel">
      {image ? (
        <>
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className="anim-ken-burns object-cover object-center"
          />
          <div className={cn("absolute inset-0", align === "center" ? "photo-scrim-soft" : "photo-scrim")} />
        </>
      ) : (
        <>
          <div className="carbon absolute inset-0 opacity-60" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-brand-500/10 to-transparent" />
        </>
      )}

      {/* thin red rule along the bottom edge */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-brand-500 via-brand-500/30 to-transparent" />

      <div
        className={cn(
          "relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8",
          image && "py-20 sm:py-32",
          align === "center" && "text-center",
        )}
      >
        {crumb ? (
          <nav
            aria-label="Breadcrumb"
            className={cn(
              "anim-in mb-5 flex flex-wrap items-center gap-2 text-[13px] text-white/45",
              align === "center" && "justify-center",
            )}
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            {crumb.map((item) => (
              <span key={item.href} className="flex items-center gap-2">
                <span className="text-white/20">/</span>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        ) : null}

        {eyebrow ? (
          <p className="eyebrow anim-in mb-3" style={{ animationDelay: "80ms" }}>
            {eyebrow}
          </p>
        ) : null}

        <h1
          className={cn(
            "display anim-in max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl",
            align === "center" && "mx-auto",
          )}
          style={{ animationDelay: "150ms" }}
        >
          {title}
        </h1>

        {lead ? (
          <p
            className={cn(
              "anim-in mt-6 max-w-2xl text-[17px] leading-relaxed text-white/65",
              align === "center" && "mx-auto",
            )}
            style={{ animationDelay: "240ms" }}
          >
            {lead}
          </p>
        ) : null}

        {children ? (
          <div className="anim-in mt-9" style={{ animationDelay: "330ms" }}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
