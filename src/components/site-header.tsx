"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { useCart } from "@/components/cart-context";

const nav = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/thali", label: "Build a Thali" },
  { href: "/quiz", label: "Find Your Dish" },
  { href: "/reservations", label: "Tables" },
  { href: "/events", label: "Events" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "Story" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

const mobileNav = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order online" },
  { href: "/thali", label: "Build a thali" },
  { href: "/quiz", label: "Find your dish 🎯" },
  { href: "/reservations", label: "Book a table" },
  { href: "/events", label: "Events & catering" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "Our story" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, lastAdded } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!lastAdded) return;
    setBump(true);
    const timer = window.setTimeout(() => setBump(false), 500);
    return () => window.clearTimeout(timer);
  }, [lastAdded]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-cream/10 bg-ink/90 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center rounded-full border border-gold/60 text-gold transition duration-500 group-hover:rotate-[18deg] group-hover:bg-gold group-hover:text-ink">
            <span className="font-display text-lg leading-none">Z</span>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl tracking-wide">{site.name}</span>
            <span className="block text-[0.55rem] uppercase tracking-[0.32em] text-cream/45">
              {site.suffix}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {nav.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[0.74rem] uppercase tracking-[0.16em] transition ${
                  active ? "text-gold" : "text-cream/65 hover:text-cream"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/quiz"
            className="hidden text-[0.7rem] uppercase tracking-[0.16em] text-gold/90 transition hover:text-gold lg:block"
          >
            🎯 Find your dish
          </Link>
          <Link
            href="/order"
            aria-label={`Bag with ${count} items`}
            className={`relative grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-sm transition hover:border-gold hover:text-gold ${
              bump ? "scale-110 border-gold text-gold" : ""
            }`}
          >
            <span aria-hidden>🛍</span>
            {count > 0 ? (
              <span className="pulse-ring absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[0.6rem] font-bold text-ink">
                {count}
              </span>
            ) : null}
          </Link>
          <Link href="/reservations" className="btn-gold hidden !px-6 !py-3 md:inline-flex">
            Book a table
          </Link>
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 xl:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-cream transition ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-5 bg-cream transition ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-cream transition ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Scroll progress */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-gold via-gold-soft to-gold transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className={`overflow-hidden border-t border-cream/10 bg-ink/97 backdrop-blur-xl transition-all duration-500 xl:hidden ${
          open ? "max-h-[44rem]" : "max-h-0"
        }`}
      >
        <nav className="shell flex flex-col py-3">
          {mobileNav.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-cream/5 py-4 text-sm uppercase tracking-[0.2em] text-cream/80 transition hover:text-gold"
              style={{ transitionDelay: `${index * 20}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-wrap gap-3 py-5">
            <Link href="/reservations" className="btn-gold">
              Book a table
            </Link>
            <Link href="/thali" className="btn-ghost">
              Build a thali
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
