import { MessageSquareQuote, Phone } from "lucide-react";
import Link from "next/link";

import { business } from "@/lib/site";

/** Mobile-only bottom bar - the highest converting element on a trades site. */
export function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-hairline bg-panel/95 backdrop-blur lg:hidden">
      <a
        href={business.phoneHref}
        className="flex items-center justify-center gap-2 py-3.5 font-display text-base uppercase tracking-wide text-white"
      >
        <Phone className="size-4 text-brand-500" />
        Call Now
      </a>
      <Link
        href="/quote"
        className="anim-pulse-ring flex items-center justify-center gap-2 bg-brand-500 py-3.5 font-display text-base uppercase tracking-wide text-white"
      >
        <MessageSquareQuote className="size-4" />
        Free Quote
      </Link>
    </div>
  );
}
