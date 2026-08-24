import { Camera, Search } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { cn, formatDateTime, formatMoney, QUOTE_STATUS_LABELS, SERVICE_LABELS } from "@/lib/utils";
import type { QuoteStatus } from "@/generated/prisma/enums";

const STATUSES = Object.keys(QUOTE_STATUS_LABELS) as QuoteStatus[];

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const activeStatus = STATUSES.includes(status as QuoteStatus) ? (status as QuoteStatus) : undefined;

  const quotes = await prisma.quoteRequest.findMany({
    where: {
      ...(activeStatus ? { status: activeStatus } : {}),
      ...(q
        ? {
            OR: [
              { reference: { contains: q, mode: "insensitive" as const } },
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { phone: { contains: q } },
              { suburb: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      reference: true,
      name: true,
      phone: true,
      suburb: true,
      serviceType: true,
      status: true,
      createdAt: true,
      quotedAmountCents: true,
      insuranceClaim: true,
      _count: { select: { photos: true } },
    },
  });

  return (
    <div className="p-5 sm:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl text-white sm:text-4xl">Quote requests</h1>
          <p className="mt-1 text-sm text-white/45">{quotes.length} shown</p>
        </div>

        <form className="flex w-full max-w-sm gap-2" action="/admin/quotes">
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Reference, name, phone, suburb"
              className="w-full rounded-sm border border-hairline bg-panel-2 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500"
            />
          </div>
          <button type="submit" className="bg-brand-500 px-4 font-display text-sm uppercase text-white hover:bg-brand-600">
            Search
          </button>
        </form>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip href="/admin/quotes" label="All" active={!activeStatus} />
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            href={`/admin/quotes?status=${s}`}
            label={QUOTE_STATUS_LABELS[s]}
            active={activeStatus === s}
          />
        ))}
      </div>

      <div className="mt-6 overflow-x-auto border border-hairline">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-panel-2 text-[11px] uppercase tracking-widest text-white/40">
            <tr>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Photos</th>
              <th className="px-4 py-3">Quoted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline bg-panel">
            {quotes.map((quote) => (
              <tr key={quote.id} className="transition-colors hover:bg-panel-2">
                <td className="px-4 py-3.5">
                  <Link href={`/admin/quotes/${quote.id}`} className="font-display text-base text-brand-500 hover:underline">
                    {quote.reference}
                  </Link>
                  {quote.insuranceClaim && (
                    <span className="ml-2 rounded-sm bg-amber-500/15 px-1.5 py-0.5 text-[10px] uppercase text-amber-300">
                      Insurance
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-white/75">
                  {quote.name}
                  <span className="block text-[12px] text-white/35">
                    {quote.suburb} &middot; {quote.phone}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-white/55">{SERVICE_LABELS[quote.serviceType]}</td>
                <td className="px-4 py-3.5 text-white/45">{formatDateTime(quote.createdAt)}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-white/45">
                    <Camera className="size-3.5" />
                    {quote._count.photos}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-medium text-white">{formatMoney(quote.quotedAmountCents)}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={quote.status} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Link href={`/admin/quotes/${quote.id}`} className="font-display uppercase text-white/50 hover:text-brand-500">
                    Open &rarr;
                  </Link>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-14 text-center text-white/35">
                  Nothing here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "border px-3.5 py-1.5 font-display text-[13px] uppercase tracking-wide transition-colors",
        active ? "border-brand-500 bg-brand-500 text-white" : "border-hairline text-white/55 hover:border-white/40 hover:text-white",
      )}
    >
      {label}
    </Link>
  );
}
