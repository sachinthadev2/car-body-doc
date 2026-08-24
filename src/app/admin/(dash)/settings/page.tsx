import { CalendarX, Info, Trash2 } from "lucide-react";

import { addBlockedDate, removeBlockedDate } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { business, services } from "@/lib/site";
import { formatDateOnly, toDateInput, todayDateOnly } from "@/lib/dates";

export default async function AdminSettingsPage() {
  const today = todayDateOnly();

  const blocked = await prisma.blockedDate.findMany({
    where: { date: { gte: today } },
    orderBy: { date: "asc" },
  });

  return (
    <div className="p-5 sm:p-8">
      <header>
        <h1 className="display text-3xl text-white sm:text-4xl">Settings</h1>
        <p className="mt-1 text-sm text-white/45">Availability and business details.</p>
      </header>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        {/* Blocked dates */}
        <section className="border border-hairline bg-panel p-6">
          <h2 className="display flex items-center gap-2 text-xl text-white">
            <CalendarX className="size-5 text-brand-500" />
            Days off
          </h2>
          <p className="mt-1 text-[13px] text-white/45">
            Block a date and customers cannot request a booking on it.
          </p>

          <form action={addBlockedDate} className="mt-5 flex flex-wrap gap-3">
            <input
              type="date"
              name="date"
              required
              min={toDateInput(today)}
              className="rounded-sm border border-hairline bg-panel-2 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500"
            />
            <input
              type="text"
              name="reason"
              placeholder="Reason (optional)"
              className="min-w-40 flex-1 rounded-sm border border-hairline bg-panel-2 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500"
            />
            <button type="submit" className="bg-brand-500 px-5 font-display text-sm uppercase text-white hover:bg-brand-600">
              Block
            </button>
          </form>

          <ul className="mt-5 divide-y divide-hairline border-t border-hairline">
            {blocked.map((day) => (
              <li key={day.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-[15px] text-white">{formatDateOnly(day.date)}</p>
                  {day.reason ? <p className="text-[13px] text-white/40">{day.reason}</p> : null}
                </div>
                <form action={removeBlockedDate}>
                  <input type="hidden" name="id" value={day.id} />
                  <button type="submit" className="text-white/35 transition-colors hover:text-brand-500" aria-label="Remove blocked date">
                    <Trash2 className="size-4" />
                  </button>
                </form>
              </li>
            ))}
            {blocked.length === 0 && <li className="py-6 text-center text-sm text-white/30">No upcoming days blocked.</li>}
          </ul>
        </section>

        {/* Business details */}
        <section className="border border-hairline bg-panel p-6">
          <h2 className="display flex items-center gap-2 text-xl text-white">
            <Info className="size-5 text-brand-500" />
            Business details
          </h2>
          <p className="mt-1 text-[13px] text-white/45">
            These live in <code className="text-brand-400">src/lib/site.ts</code> - edit that file to change them across
            the whole site.
          </p>

          <dl className="mt-5 space-y-2.5 text-sm">
            <Row label="Business name" value={business.name} />
            <Row label="Phone" value={business.phoneDisplay} />
            <Row label="Email" value={business.email} />
            <Row label="ABN" value={business.abn} />
            <Row label="Base city" value={`${business.baseCity}, ${business.addressRegion}`} />
            <Row label="Travel radius" value={`${business.serviceRadiusKm}km`} />
          </dl>

          <h3 className="display mt-8 text-lg text-white">Services &amp; prices from</h3>
          <dl className="mt-3 space-y-2.5 text-sm">
            {services.map((service) => (
              <Row key={service.slug} label={service.name} value={service.priceFrom} />
            ))}
          </dl>

          <h3 className="display mt-8 text-lg text-white">Hours</h3>
          <dl className="mt-3 space-y-2.5 text-sm">
            {business.hours.map((hour) => (
              <Row key={hour.days} label={hour.days} value={hour.time} />
            ))}
          </dl>
        </section>
      </div>

      <section className="mt-8 border border-hairline bg-panel p-6">
        <h2 className="display text-xl text-white">Gallery</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-white/55">
          The before and after gallery is intentionally hardcoded for speed. Drop your photos into{" "}
          <code className="text-brand-400">/public/gallery</code> and add or edit entries in the{" "}
          <code className="text-brand-400">gallery</code> array in <code className="text-brand-400">src/lib/site.ts</code>
          . Each entry needs a before image, an after image, a title, a service and a suburb.
        </p>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-hairline pb-2.5">
      <dt className="text-white/40">{label}</dt>
      <dd className="text-right text-white/80">{value}</dd>
    </div>
  );
}
