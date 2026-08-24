"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-5 text-left"
            >
              <span className={cn("font-display text-lg uppercase transition-colors sm:text-xl", isOpen ? "text-brand-500" : "text-white")}>
                {item.q}
              </span>
              <Plus
                className={cn(
                  "mt-1 size-5 shrink-0 transition-transform duration-200",
                  isOpen ? "rotate-45 text-brand-500" : "text-white/40",
                )}
              />
            </button>
            <div className={cn("grid transition-all duration-200", isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <p className="max-w-3xl text-[15px] leading-relaxed text-white/60">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
