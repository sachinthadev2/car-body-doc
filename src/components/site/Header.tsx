"use client";

import { Menu, Phone, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { business, mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${business.name} home`}>
      <span className="relative flex size-10 items-center justify-center bg-brand-500 text-white transition-transform duration-300 group-hover:scale-105">
        <span className="font-display text-xl font-bold leading-none">CB</span>
        <span className="absolute -bottom-px left-0 h-1 w-full bg-black/30" />
      </span>
      <span className="leading-none">
        <span className="display block text-xl text-white sm:text-2xl">
          Car Body <span className="text-brand-500">Doc</span>
        </span>
        {!compact && (
          <span className="mt-0.5 block font-display text-[10px] uppercase tracking-[0.28em] text-white/45">
            {business.promise}
          </span>
        )}
      </span>
    </Link>
  );
}

export function Header({ user }: { user: { name: string; role: string } | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled
          ? "border-hairline bg-ink/95 shadow-lg shadow-black/40 backdrop-blur"
          : "border-transparent bg-gradient-to-b from-ink/90 to-transparent backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 transition-all duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-[68px]" : "h-[84px]",
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-display text-base uppercase tracking-wide transition-colors",
                "link-draw",
                pathname.startsWith(item.href) ? "text-brand-500" : "text-white/75 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={business.phoneHref}
            className="flex items-center gap-2 font-display text-lg font-semibold text-white transition-colors hover:text-brand-400"
          >
            <Phone className="size-4 text-brand-500" />
            {business.phoneDisplay}
          </a>
          <Link
            href={user ? (user.role === "ADMIN" ? "/admin" : "/account") : "/login"}
            className="flex size-9 items-center justify-center rounded-sm border border-hairline text-white/60 transition-colors hover:border-brand-500 hover:text-white"
            aria-label={user ? "My account" : "Log in"}
          >
            <User className="size-4" />
          </Link>
          <ButtonLink href="/quote" size="sm" className="sheen">
            Free Quote
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-sm border border-hairline text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="anim-in border-t border-hairline bg-panel lg:hidden" style={{ animationDuration: "350ms" }}>
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block border-b border-hairline py-3.5 font-display text-lg uppercase text-white/85"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={user ? (user.role === "ADMIN" ? "/admin" : "/account") : "/login"}
              className="block border-b border-hairline py-3.5 font-display text-lg uppercase text-white/85"
            >
              {user ? "My Account" : "Log In"}
            </Link>
            <div className="mt-5 grid gap-3">
              <ButtonLink href="/quote" size="md">
                Get A Free Quote
              </ButtonLink>
              <a
                href={business.phoneHref}
                className="flex items-center justify-center gap-2 border border-white/25 px-6 py-3 font-display text-lg uppercase text-white"
              >
                <Phone className="size-4 text-brand-500" />
                {business.phoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
