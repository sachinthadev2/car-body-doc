import type { Metadata } from "next";

import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Car Body Doc Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  const [quotes, bookings, messages] = await Promise.all([
    prisma.quoteRequest.count({ where: { status: { in: ["NEW", "REVIEWING"] } } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { handled: false } }),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-ink lg:flex-row">
      <Sidebar name={admin.name} counts={{ quotes, bookings, messages }} />
      <main className="min-w-0 flex-1 lg:h-screen lg:overflow-y-auto">{children}</main>
    </div>
  );
}
