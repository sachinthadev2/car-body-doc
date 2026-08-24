import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  tone = "ink",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "ink" | "panel" | "panel2";
  id?: string;
}) {
  const tones = { ink: "bg-ink", panel: "bg-panel", panel2: "bg-panel-2" };
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2 className={cn("display rule text-3xl text-white sm:text-4xl lg:text-[2.75rem]", align === "center" && "rule-center")}>
        {title}
      </h2>
      {lead ? <p className="mt-6 text-[17px] leading-relaxed text-white/60">{lead}</p> : null}
    </div>
  );
}
