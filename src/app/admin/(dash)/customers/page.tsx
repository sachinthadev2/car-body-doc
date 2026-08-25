import { Search } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const users = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: { select: { quoteRequests: true, bookings: true } },
    },
  });

  // Guests who never registered still matter - surface them from their quotes.
  const guests = await prisma.quoteRequest.groupBy({
    by: ["email", "name", "phone"],
    where: { userId: null },
    _count: { _all: true },
    orderBy: { _count: { email: "desc" } },
    take: 50,
  });

  return (
    <div className="p-5 sm:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl text-white sm:text-4xl">Customers</h1>
          <p className="mt-1 text-sm text-white/45">
            {users.length} registered &middot; {guests.length} guest contacts
          </p>
        </div>

        <form className="flex w-full max-w-sm gap-2" action="/admin/customers">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Name, email or phone"
              className="w-full rounded-sm border border-hairline bg-panel-2 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500"
            />
          </div>
          <button type="submit" className="bg-brand-500 px-4 font-display text-sm uppercase text-white hover:bg-brand-600">
            Search
          </button>
        </form>
      </header>

      <section className="mt-8">
        <h2 className="display text-xl text-white">Registered accounts</h2>
        <div className="mt-4 overflow-x-auto border border-hairline">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-panel-2 text-[0.72rem] uppercase tracking-widest text-white/40">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Quotes</th>
                <th className="px-4 py-3">Bookings</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-panel">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-panel-2">
                  <td className="px-4 py-3.5 text-white/80">{user.name}</td>
                  <td className="px-4 py-3.5 text-white/55">
                    <a href={`mailto:${user.email}`} className="hover:text-brand-400">
                      {user.email}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 text-white/55">
                    {user.phone ? (
                      <a href={`tel:${user.phone}`} className="hover:text-brand-400">
                        {user.phone}
                      </a>
                    ) : (
                      <span className="text-white/25">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-white/70">{user._count.quoteRequests}</td>
                  <td className="px-4 py-3.5 text-white/70">{user._count.bookings}</td>
                  <td className="px-4 py-3.5 text-white/45">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/35">
                    No registered customers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="display text-xl text-white">Guest enquiries</h2>
        <p className="mt-1 text-sm text-white/40">People who quoted without creating an account.</p>
        <div className="mt-4 overflow-x-auto border border-hairline">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-panel-2 text-[0.72rem] uppercase tracking-widest text-white/40">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Requests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-panel">
              {guests.map((guest) => (
                <tr key={`${guest.email}-${guest.phone}`} className="transition-colors hover:bg-panel-2">
                  <td className="px-4 py-3.5 text-white/80">{guest.name}</td>
                  <td className="px-4 py-3.5 text-white/55">
                    <a href={`mailto:${guest.email}`} className="hover:text-brand-400">
                      {guest.email}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 text-white/55">
                    <a href={`tel:${guest.phone}`} className="hover:text-brand-400">
                      {guest.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 text-white/70">{guest._count._all}</td>
                </tr>
              ))}
              {guests.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-white/35">
                    No guest enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
