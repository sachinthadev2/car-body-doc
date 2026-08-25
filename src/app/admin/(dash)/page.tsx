import { CalendarDays, DollarSign, FileText, Mail, TrendingUp } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { todayDateOnly } from "@/lib/dates";
import { formatDate, formatDateTime, formatMoney, SERVICE_LABELS, TIME_SLOT_LABELS } from "@/lib/utils";

export default async function AdminDashboard() {
  const now = new Date();
  // Booking dates are calendar dates (UTC midnight), so the windows are too.
  const today = todayDateOnly();
  const startOfWeek = new Date(today);
  startOfWeek.setUTCDate(today.getUTCDate() - ((today.getUTCDay() + 6) % 7));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7);
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const [newQuotes, pendingBookings, weekJobs, unread, completedValue, recentQuotes, todayJobs] = await Promise.all([
    prisma.quoteRequest.count({ where: { status: { in: ["NEW", "REVIEWING"] } } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({
      where: { preferredDate: { gte: startOfWeek, lt: endOfWeek }, status: { in: ["CONFIRMED", "IN_PROGRESS", "COMPLETED"] } },
    }),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.booking.aggregate({
      _sum: { priceCents: true },
      where: { status: "COMPLETED", completedAt: { gte: startOfWeek } },
    }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        reference: true,
        name: true,
        suburb: true,
        serviceType: true,
        status: true,
        createdAt: true,
        quotedAmountCents: true,
      },
    }),
    prisma.booking.findMany({
      where: { preferredDate: { gte: today, lt: tomorrow } },
      orderBy: { timeSlot: "asc" },
      select: {
        id: true,
        reference: true,
        name: true,
        phone: true,
        addressLine: true,
        suburb: true,
        serviceType: true,
        timeSlot: true,
        status: true,
      },
    }),
  ]);

  const stats = [
    { label: "New quote requests", value: newQuotes, icon: FileText, href: "/admin/quotes" },
    { label: "Bookings to confirm", value: pendingBookings, icon: CalendarDays, href: "/admin/bookings" },
    { label: "Jobs this week", value: weekJobs, icon: TrendingUp, href: "/admin/bookings" },
    { label: "Unread messages", value: unread, icon: Mail, href: "/admin/messages" },
  ];

  return (
    <div className="p-5 sm:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl text-white sm:text-4xl">Dashboard</h1>
          <p className="mt-1 text-sm text-white/45">{formatDate(now)}</p>
        </div>
        <div className="flex items-center gap-2 border border-hairline bg-panel px-4 py-2.5">
          <DollarSign className="size-4 text-brand-500" />
          <div>
            <p className="text-[0.72rem] uppercase tracking-widest text-white/35">Completed this week</p>
            <p className="font-display text-lg text-white">{formatMoney(completedValue._sum.priceCents ?? 0)}</p>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group border border-hairline bg-panel p-5 transition-colors hover:border-brand-500/50"
          >
            <div className="flex items-start justify-between">
              <stat.icon className="size-5 text-brand-500" />
              <span className="display text-4xl text-white">{stat.value}</span>
            </div>
            <p className="mt-3 text-sm text-white/45 group-hover:text-white/70">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Recent quotes */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="display text-xl text-white">Latest quote requests</h2>
            <Link href="/admin/quotes" className="text-sm text-brand-500 hover:text-brand-400">
              View all &rarr;
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto border border-hairline">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-panel-2 text-[0.72rem] uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-4 py-3">Ref</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline bg-panel">
                {recentQuotes.map((quote) => (
                  <tr key={quote.id} className="transition-colors hover:bg-panel-2">
                    <td className="px-4 py-3">
                      <Link href={`/admin/quotes/${quote.id}`} className="font-display text-base text-brand-500 hover:underline">
                        {quote.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-white/75">
                      {quote.name}
                      <span className="block text-xs text-white/35">{quote.suburb}</span>
                    </td>
                    <td className="px-4 py-3 text-white/55">{SERVICE_LABELS[quote.serviceType]}</td>
                    <td className="px-4 py-3 text-white/45">{formatDateTime(quote.createdAt)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={quote.status} />
                    </td>
                  </tr>
                ))}
                {recentQuotes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-white/35">
                      No quote requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Today */}
        <section>
          <h2 className="display text-xl text-white">Today&apos;s jobs</h2>
          <div className="mt-4 space-y-3">
            {todayJobs.map((job) => (
              <Link
                key={job.id}
                href={`/admin/bookings/${job.id}`}
                className="block border border-hairline bg-panel p-4 transition-colors hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base uppercase text-white">{job.name}</p>
                    <p className="text-sm text-white/45">
                      {job.addressLine}, {job.suburb}
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-hairline pt-3 text-xs text-white/45">
                  <span className="text-brand-400">{TIME_SLOT_LABELS[job.timeSlot]}</span>
                  <span>{SERVICE_LABELS[job.serviceType]}</span>
                  <a href={`tel:${job.phone}`} className="hover:text-white">
                    {job.phone}
                  </a>
                </div>
              </Link>
            ))}
            {todayJobs.length === 0 && (
              <p className="border border-dashed border-hairline bg-panel p-8 text-center text-sm text-white/35">
                Nothing booked for today.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
