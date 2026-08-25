"use client";

import { useState } from "react";

import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Reveal } from "@/components/site/Reveal";
import { gallery, services } from "@/lib/site";
import { cn, SERVICE_LABELS } from "@/lib/utils";

export function GalleryGrid() {
  const [filter, setFilter] = useState<string>("ALL");
  const items = filter === "ALL" ? gallery : gallery.filter((item) => item.service === filter);

  const tabs = [{ value: "ALL", label: "All work" }, ...services.map((s) => ({ value: s.type as string, label: s.name }))];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={cn(
              "border px-4 py-2 font-display text-sm uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5",
              filter === tab.value
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-hairline text-white/60 hover:border-white/40 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={(i % 2) * 110} direction="zoom">
          <figure className="hover-lift h-full border border-hairline bg-panel p-4">
            <BeforeAfter before={item.before} after={item.after} alt={item.title} />
            <figcaption className="mt-4 px-1 pb-1">
              <div className="flex items-start justify-between gap-4">
                <h3 className="display text-xl text-white">{item.title}</h3>
                <span className="shrink-0 border border-hairline px-2.5 py-1 text-[11px] uppercase tracking-wider text-white/45">
                  {item.suburb}
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-white/55">{item.detail}</p>
              <p className="mt-3 font-display text-[12px] uppercase tracking-widest text-brand-500">
                {SERVICE_LABELS[item.service]}
              </p>
            </figcaption>
          </figure>
          </Reveal>
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-16 text-center text-white/40">No jobs in this category yet - check back soon.</p>
      )}
    </div>
  );
}
