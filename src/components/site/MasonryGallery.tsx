"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Reveal } from "@/components/site/Reveal";
import { showcase } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Mosaic collage of workshop photography, with a lightbox. */
export function MasonryGallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback((delta: number) => {
    setActive((current) => {
      if (current === null) return current;
      return (current + delta + showcase.length) % showcase.length;
    });
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    // Stop the page scrolling behind the lightbox.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active, close, step]);

  return (
    <>
      <div className="grid auto-rows-[110px] grid-cols-2 gap-3 sm:auto-rows-[130px] sm:gap-4 lg:grid-cols-4">
        {showcase.map((item, i) => (
          <Reveal key={item.src} delay={(i % 4) * 80} direction="zoom" className={cn(item.span, "min-h-0")}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View ${item.alt}`}
              className="zoom-parent group relative h-full w-full overflow-hidden border border-hairline bg-panel-2"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-95" />

              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-left">
                <span className="translate-y-2 text-sm font-medium leading-snug text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.alt}
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Expand className="size-4" />
                </span>
              </span>

              <span className="absolute inset-0 border-2 border-brand-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </Reveal>
        ))}
      </div>

      {/* ------------------------------------------------------------ Lightbox */}
      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image"
          data-lenis-prevent
          className="anim-in-fade fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          style={{ animationDuration: "220ms" }}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full border border-hairline text-white transition-colors hover:border-brand-500 hover:bg-brand-500"
          >
            <X className="size-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous image"
            className="absolute left-3 flex size-11 items-center justify-center rounded-full border border-hairline text-white transition-colors hover:border-brand-500 hover:bg-brand-500 sm:left-6"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next image"
            className="absolute right-3 flex size-11 items-center justify-center rounded-full border border-hairline text-white transition-colors hover:border-brand-500 hover:bg-brand-500 sm:right-6"
          >
            <ChevronRight className="size-5" />
          </button>

          <figure className="relative max-h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-hairline">
              <Image
                src={showcase[active].src}
                alt={showcase[active].alt}
                fill
                sizes="90vw"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 text-base text-white/70">
              <span>{showcase[active].alt}</span>
              <span className="shrink-0 text-white/40">
                {active + 1} / {showcase.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
