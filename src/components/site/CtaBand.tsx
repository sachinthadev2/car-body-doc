import { Phone } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { business } from "@/lib/site";

export function CtaBand({
  title = "Got damage? Send us a photo.",
  lead = "Free, no-obligation quotes across Sydney - usually back to you the same day.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-600">
      <div className="carbon absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-14 text-center sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
        <div>
          <h2 className="display text-3xl text-white sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-xl text-white/80">{lead}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/quote" variant="light" size="lg" className="whitespace-nowrap">
            Get A Free Quote
          </ButtonLink>
          <a
            href={business.phoneHref}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-white/50 px-8 py-4 font-display text-lg font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
          >
            <Phone className="size-5" />
            {business.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
