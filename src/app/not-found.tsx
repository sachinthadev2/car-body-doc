import Link from "next/link";

import { business } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 text-center">
      <p className="display text-[22vw] leading-none text-brand-500/15 sm:text-[12rem]">404</p>
      <h1 className="display -mt-6 text-4xl text-white sm:text-5xl">Wrong turn</h1>
      <p className="mt-4 max-w-md text-white/55">
        That page does not exist. Head back to the home page, or call us on{" "}
        <a href={business.phoneHref} className="text-brand-500 hover:underline">
          {business.phoneDisplay}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="bg-brand-500 px-6 py-3 font-display text-base uppercase tracking-wide text-white hover:bg-brand-600">
          Back Home
        </Link>
        <Link
          href="/quote"
          className="border border-white/25 px-6 py-3 font-display text-base uppercase tracking-wide text-white hover:border-brand-500"
        >
          Get A Quote
        </Link>
      </div>
    </main>
  );
}
