"use client";

import { MoveHorizontal } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Drag-to-reveal before/after comparison. Mouse, touch and keyboard.
 *
 * The handle position is driven by a CSS custom property written straight to
 * the DOM, NOT by React state - re-rendering two next/image layers on every
 * pointermove, plus a getBoundingClientRect per move, is what made this
 * stutter on phones. Bounds are measured once per gesture instead.
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
  const hasTouched = useRef(false);
  /** Container geometry, cached on pointerdown so each move is layout-free. */
  const bounds = useRef({ left: 0, width: 1 });

  const setPosition = useCallback((pct: number) => {
    const el = containerRef.current;
    if (!el) return;
    // Rounded so the DOM never carries float noise like 80.00000000000001%.
    const clamped = Math.round(Math.min(100, Math.max(0, pct)) * 100) / 100;
    // Written straight to the DOM: no React render, so dragging never
    // re-renders the two next/image layers.
    el.style.setProperty("--pos", `${clamped}%`);
    // Keep the keyboard/screen-reader control in step, also render-free.
    if (rangeRef.current) rangeRef.current.value = String(Math.round(clamped));
    // Exactly one render, the first time, to drop the hint and stop the pulse.
    if (!hasTouched.current) {
      hasTouched.current = true;
      setTouched(true);
    }
  }, []);

  const moveTo = useCallback(
    (clientX: number) => {
      const { left, width } = bounds.current;
      setPosition(((clientX - left) / width) * 100);
    },
    [setPosition],
  );

  const cacheBounds = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    bounds.current = { left: rect.left, width: rect.width || 1 };
  }, []);

  return (
    <div
      ref={containerRef}
      // pan-y lets the page still scroll vertically over the image, while
      // horizontal drags belong to us. NOTE: deliberately no data-lenis-prevent -
      // that is for elements with their own scrollbar, and it applies
      // overscroll-behavior:contain, which on a non-scrollable element stops the
      // swipe chaining to the page and makes the whole section feel stuck.
      style={{ ["--pos" as string]: "50%", touchAction: "pan-y" }}
      className={cn(
        "group relative aspect-[4/3] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden bg-panel-2",
        className,
      )}
      onPointerDown={(e) => {
        dragging.current = true;
        // Measure once per gesture, then move. Pointer capture is only an
        // optimisation - if it throws (synthetic or already-released pointers)
        // the drag must still work rather than dying before it starts.
        cacheBounds();
        moveTo(e.clientX);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* capture unavailable - dragging still tracks via pointermove */
        }
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
