"use client";

import { MoveHorizontal } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Drag-to-reveal before/after comparison. Mouse, touch and keyboard.
 *
 * The handle position is driven by a CSS custom property written straight to
 * the DOM inside a rAF, NOT by React state - re-rendering two next/image
 * elements on every pointermove is what made this stutter on phones.
 */
export function BeforeAfter({
  before,
  after,
  alt,
  className,
}: {
  before: string;
  after: string;
  alt: string;
  className?: string;
}) {
  const [touched, setTouched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const frame = useRef(0);
  const pending = useRef(50);
  const hasTouched = useRef(false);

  const flush = useCallback(() => {
    frame.current = 0;
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--pos", `${pending.current}%`);
    // Keep the (keyboard/screen-reader) range in step without a React render.
    if (rangeRef.current) rangeRef.current.value = String(Math.round(pending.current));
  }, []);

  const setPosition = useCallback(
    (pct: number) => {
      pending.current = Math.min(100, Math.max(0, pct));
      if (!frame.current) frame.current = requestAnimationFrame(flush);
      // One render, the first time, to drop the hint and stop the pulse.
      if (!hasTouched.current) {
        hasTouched.current = true;
        setTouched(true);
      }
    },
    [flush],
  );

  const moveTo = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPosition(((clientX - rect.left) / rect.width) * 100);
    },
    [setPosition],
  );

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      // pan-y lets the page still scroll vertically over the image, while
      // horizontal drags belong to us instead of fighting the browser.
      style={{ ["--pos" as string]: "50%", touchAction: "pan-y" }}
      // Lenis handles touch for the whole page; it must keep its hands off here.
      data-lenis-prevent
      className={cn(
        "group relative aspect-[4/3] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden bg-panel-2",
        className,
      )}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) moveTo(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <Image
        src={after}
        alt={`${alt} - after repair`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="pointer-events-none object-cover"
        draggable={false}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}
      >
        <Image
          src={before}
          alt={`${alt} - before repair`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="pointer-events-none object-cover"
          draggable={false}
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 bg-black/75 px-2.5 py-1 font-display text-[0.72rem] uppercase tracking-widest text-brand-400 backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 bg-black/75 px-2.5 py-1 font-display text-[0.72rem] uppercase tracking-widest text-emerald-400 backdrop-blur-sm">
        After
      </span>

      {/* "drag me" nudge - disappears the moment they touch it */}
      {!touched && (
        <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-3.5 py-1.5 text-[0.72rem] uppercase tracking-widest text-white/80 backdrop-blur-sm">
          Drag to compare
        </span>
      )}

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-brand-500 shadow-[0_0_18px_rgba(225,20,20,0.7)]"
        style={{ left: "var(--pos)" }}
      >
        {/*
          Safe to centre with translate now: the pulse keyframe animates `scale`
          only. It used to animate `transform: translate(-50%,-50%) scale()`,
          which stacked on top of this translate and shoved the handle off the
          line until you first dragged it.
        */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-black/60 ring-4 ring-brand-500/20",
            !touched && "anim-slider-hint",
          )}
        >
          <MoveHorizontal className="size-5" />
        </div>
      </div>

      {/*
        Keyboard/AT control. pointer-events-none so it can never swallow a
        touch drag - it used to overlay the bottom strip of the image.
      */}
      <input
        ref={rangeRef}
        type="range"
        min={0}
        max={100}
        defaultValue={50}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={`${alt} - drag to compare before and after`}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 w-full opacity-0 focus-visible:opacity-100"
      />
    </div>
  );
}
