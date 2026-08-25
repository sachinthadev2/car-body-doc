"use client";

import { CalendarDays, FileText, LayoutDashboard, LogOut, Mail, MessageSquare, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/actions/auth";
import { business } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/quotes", label: "Quote Requests", icon: FileText },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/leads", label: "Chat Leads", icon: MessageSquare },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  name,
  counts,
}: {
  name: string;
  counts: { quotes: number; bookings: number; messages: number; leads: number };
}) {
  const pathname = usePathname();

  const badges: Record<string, number> = {
    "/admin/quotes": counts.quotes,
    "/admin/bookings": counts.bookings,
    "/admin/messages": counts.messages,
    "/admin/leads": counts.leads,
  };

  return (
    <aside className="flex flex-col border-b border-hairline bg-panel lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="border-b border-hairline p-5">
        <Link href="/admin" className="flex items-center">
          <img src="/carbodydoclogo.webp" alt="Car Body Doc Logo" className="h-10 w-auto object-contain" />
        </Link>
        <p className="mt-0.5 font-display text-[10px] uppercase tracking-[0.25em] text-white/35">Admin panel</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const badge = badges[item.href] ?? 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-sm px-3 py-2.5 text-sm transition-colors",
                active ? "bg-brand-500 text-white" : "text-white/60 hover:bg-panel-2 hover:text-white",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-white/25 text-white" : "bg-brand-500/20 text-brand-400",
                  )}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hairline p-4 lg:mt-auto">
        <p className="truncate text-sm text-white/70">{name}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link href="/" className="text-sm text-white/40 hover:text-white">
            View site &rarr;
          </Link>
          <form action={logout}>
            <button type="submit" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-brand-400">
              <LogOut className="size-3.5" />
              Log out
            </button>
          </form>
        </div>
        <p className="mt-3 text-[0.72rem] text-white/25">{business.phoneDisplay}</p>
      </div>
    </aside>
  );
}
