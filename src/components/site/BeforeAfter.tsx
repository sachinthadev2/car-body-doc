"use client";

import { MoveHorizontal } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Drag-to-reveal before/after comparison. Works with mouse, touch and keyboard.
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
  const [position, setPosition] = useState(50);
  const [touched, setTouched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    setTouched(true);
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-[8/5] w-full cursor-ew-resize select-none overflow-hidden bg-panel-2",
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
      <Image src={after} alt={`${alt} - after repair`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before} alt={`${alt} - before repair`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 bg-black/75 px-2.5 py-1 font-display text-[11px] uppercase tracking-widest text-brand-400 backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 bg-black/75 px-2.5 py-1 font-display text-[11px] uppercase tracking-widest text-emerald-400 backdrop-blur-sm">
        After
      </span>

      {/* "drag me" nudge - disappears the moment they touch it */}
      {!touched && (
        <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-3.5 py-1.5 text-[11px] uppercase tracking-widest text-white/80 backdrop-blur-sm transition-opacity duration-300">
          Drag to compare
        </span>
      )}

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-brand-500 shadow-[0_0_18px_rgba(225,20,20,0.7)]"
        style={{ left: `${position}%` }}
      >
        <div
          className={cn(
            "absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-black/60 ring-4 ring-brand-500/20",
            !touched && "anim-slider-hint",
          )}
        >
          <MoveHorizontal className="size-5" />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => {
          setTouched(true);
          setPosition(Number(e.target.value));
        }}
        aria-label={`${alt} before and after slider`}
        className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
