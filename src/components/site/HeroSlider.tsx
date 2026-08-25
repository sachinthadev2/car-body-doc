"use client";

import { ArrowRight, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { business, heroSlides } from "@/lib/site";
import { cn } from "@/lib/utils";

const INTERVAL = 7000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Auto-advance. Restarts whenever the slide changes, so manual navigation
  // gives you a full interval rather than a stub of one.
  useEffect(() => {
    if (paused || reduced || heroSlides.length < 2) return;
    timer.current = setTimeout(() => go(index + 1), INTERVAL);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, paused, reduced, go]);

  // Don't rotate while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <section
      className="relative isolate flex min-h-[calc(100dvh-var(--header-h)-var(--callbar-h)-1px)] flex-col justify-center overflow-hidden pb-[calc(1.5rem+var(--callbar-h))] lg:pb-0"
      aria-roledescription="carousel"
      aria-label="Car Body Doc services"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Every slide stays mounted and crossfades - no flash of empty background */}
      {heroSlides.map((item, i) => (
        <div
          key={item.id}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={item.image}
            alt={i === index ? `${item.lines.join(" ")} ${item.accent}` : ""}
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn("object-cover object-center", i === index && "anim-ken-burns")}
          />
        </div>
      ))}

      <div className="hero-vignette absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/50 to-ink/10" />

      {/*
        Every slide's copy is mounted and stacked in a single grid cell, so the
        hero is always as tall as the LONGEST slide and the height never changes
        as it rotates. Only the active one is visible; the rest are inert so
        their links can't be tabbed to, and only the active headline is an <h1>
        so the page still has exactly one.
      */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pb-[clamp(5.25rem,10vh,6.5rem)]">
        <div className="grid">
          {heroSlides.map((item, i) => {
            const active = i === index;
            const Heading = active ? "h1" : "p";
            const anim = (delay: number) =>
              active ? { className: "anim-in", style: { animationDelay: `${delay}ms` } } : { className: "" };

            return (
              <div
                // Re-keying on activation replays the entrance animation.
                key={`${item.id}-${active}`}
                inert={!active}
                aria-hidden={!active}
                className={cn(
                  "col-start-1 row-start-1 max-w-3xl transition-opacity duration-700 ease-out",
                  active ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <p
                  {...anim(60)}
                  className={cn(
                    anim(60).className,
                    "inline-flex items-center gap-2 border border-brand-500/40 bg-brand-500/10 px-3 py-1.5 font-display text-xs uppercase tracking-[0.22em] text-brand-400 backdrop-blur-sm",
                  )}
                >
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
                  </span>
                  {item.eyebrow}
                </p>

                <Heading className="display mt-5 text-[max(2.25rem,min(13vw,6.2vh+1.2vw,5.5rem))] leading-[0.88] text-white">
                  {item.lines.map((line, l) => (
                    <span key={line} {...anim(140 + l * 90)} className={cn(anim(0).className, "block")}>
                      {line}
                    </span>
                  ))}
                  <span
                    {...anim(140 + item.lines.length * 90)}
                    className={cn(anim(0).className, "block text-brand-500")}
                  >
                    {item.accent}
                  </span>
                </Heading>

                <p {...anim(420)} className={cn(anim(0).className, "mt-5 max-w-xl text-[clamp(0.95rem,1.9vh,1.15rem)] leading-relaxed text-white/75")}>
                  {item.lead}
                </p>

                <div {...anim(510)} className={cn(anim(0).className, "mt-7 flex flex-col gap-3 sm:flex-row")}>
                  <ButtonLink href={item.cta.href} size="lg" className="sheen group" tabIndex={active ? undefined : -1}>
                    {item.cta.label}
                    <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </ButtonLink>
                  <a
                    href={business.phoneHref}
                    tabIndex={active ? undefined : -1}
                    className="inline-flex items-center justify-center gap-2.5 rounded-sm border border-white/25 bg-black/40 px-8 py-4 font-display text-lg font-semibold uppercase tracking-wide text-white backdrop-blur transition-all duration-300 hover:border-brand-500 hover:bg-black/60"
                  >
                    <Phone className="size-5 text-brand-500" />
                    {business.phoneDisplay}
                  </a>
                </div>

                <ul {...anim(600)} className={cn(anim(0).className, "hero-points mt-7 flex flex-wrap gap-x-6 gap-y-2.5")}>
                  {item.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-white/65">
                      <CheckCircle2 className="size-4 text-brand-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------ Controls
        On mobile these sit in normal flow underneath the copy. They used to be
        pinned to the hero's bottom edge, but the call bar is `fixed` - it
        covers the bottom of the SCREEN, not of the hero - so pinned controls
        ended up underneath it and on top of the trust points. From lg up there
        is no call bar, so they pin to the bottom as before.
      */}
      {heroSlides.length > 1 && (
        <>
          <div className="relative z-10 mx-auto mt-8 flex w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:absolute lg:inset-x-0 lg:bottom-8 lg:mt-0 lg:px-8">
            <div className="flex items-center gap-2.5">
              {heroSlides.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show slide ${i + 1}: ${item.accent}`}
                  aria-current={i === index}
                  className="group relative h-1 overflow-hidden rounded-full bg-white/25 transition-all duration-300"
                  style={{ width: i === index ? 56 : 22 }}
                >
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 bg-brand-500",
                      i === index ? "w-full" : "w-0 group-hover:w-full",
                      i === index && !paused && !reduced ? "origin-left" : "",
                    )}
                    style={
                      i === index && !paused && !reduced
                        ? { animation: `cbd-slide-progress ${INTERVAL}ms linear forwards` }
                        : undefined
                    }
                  />
                </button>
              ))}
            </div>

            <span className="ml-1 font-display text-sm tracking-widest text-white/45">
              {String(index + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
            </span>

            <div className="ml-auto hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous slide"
                className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition-colors hover:border-brand-500 hover:bg-brand-500"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next slide"
                className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition-colors hover:border-brand-500 hover:bg-brand-500"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          <span className="anim-scroll-hint pointer-events-none absolute bottom-20 left-1/2 hidden -translate-x-1/2 text-white/40 lg:block">
            <ChevronDown className="size-7" />
          </span>
        </>
      )}
    </section>
  );
}
