"use client";

import { ArrowRight, Menu, Phone, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { business, mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${business.name} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/carbodydoclogo.webp"
        alt="Car Body Doc Logo"
        className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-15"
      />
    </Link>
  );
}

export function Header({ user }: { user: { name: string; role: string } | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const accountHref = user ? (user.role === "ADMIN" ? "/admin" : "/account") : "/login";

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the drawer is open: lock scrolling, close on Escape, move focus in.
  useEffect(() => {
    if (!open) return;

    // Lenis drives its own scroll, so pausing it is what actually stops the page.
    window.__lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
    };
  }, [open]);

  return (
    <>
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
                  "link-draw font-display text-base uppercase tracking-wide transition-colors",
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
              href={accountHref}
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
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="flex size-10 items-center justify-center rounded-sm border border-hairline text-white transition-colors hover:border-brand-500 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/*
        The drawer lives OUTSIDE <header> on purpose. The header uses
        backdrop-filter, which makes it a containing block for position:fixed -
        a drawer nested inside would be trapped in the header's box instead of
        filling the viewport.
      */}
      <div
        className={cn(
          "drawer-backdrop fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        data-lenis-prevent
        className={cn(
          "drawer-panel fixed inset-y-0 right-0 z-[70] flex w-[86%] max-w-sm flex-col border-l border-hairline bg-panel shadow-2xl shadow-black/70 transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Close menu"
            className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-hairline text-white transition-colors hover:border-brand-500 hover:bg-brand-500"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-3">
          {mainNav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${120 + i * 45}ms` : "0ms" }}
              className={cn(
                "flex items-center justify-between border-b border-hairline py-4 font-display text-xl uppercase transition-all duration-500",
                open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
                pathname.startsWith(item.href) ? "text-brand-500" : "text-white/85",
              )}
            >
              {item.label}
              <ArrowRight className="size-4 text-white/25" />
            </Link>
          ))}

          <Link
            href={accountHref}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${120 + mainNav.length * 45}ms` : "0ms" }}
            className={cn(
              "flex items-center justify-between border-b border-hairline py-4 font-display text-xl uppercase text-white/85 transition-all duration-500",
              open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
            )}
          >
            {user ? "My Account" : "Log In"}
            <User className="size-4 text-white/25" />
          </Link>
        </nav>

        <div className="space-y-3 border-t border-hairline p-5">
          <ButtonLink href="/quote" size="md" className="sheen w-full" onClick={() => setOpen(false)}>
            Get A Free Quote
          </ButtonLink>
          <a
            href={business.phoneHref}
            className="flex items-center justify-center gap-2 border border-white/25 px-6 py-3 font-display text-lg uppercase text-white transition-colors hover:border-brand-500"
          >
            <Phone className="size-4 text-brand-500" />
            {business.phoneDisplay}
          </a>
          <p className="pt-1 text-center text-sm text-white/35">
            Mobile smash repairs across {business.baseCity}
          </p>
        </div>
      </aside>
    </>
  );
}
