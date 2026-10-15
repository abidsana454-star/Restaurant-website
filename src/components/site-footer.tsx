import Link from "next/link";
import { site } from "@/lib/site";
import { Marquee } from "@/components/motion";

const columns = [
  {
    title: "Eat",
    links: [
      { href: "/menu", label: "Full menu" },
      { href: "/order", label: "Order online" },
      { href: "/thali", label: "Build your thali" },
      { href: "/quiz", label: "Find your dish quiz" },
      { href: "/reservations", label: "Reserve a table" },
      { href: "/events", label: "Events & catering" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/journal", label: "Journal" },
      { href: "/gallery", label: "Gallery" },
      { href: "/contact", label: "Contact & directions" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-cream/10 bg-coal">
      <Marquee
        items={[
          "Slow fire, big flavour",
          "Ground spice daily",
          "Since 2014",
          "Karachi · DHA Phase VI",
          "Free delivery over Rs 2,500",
        ]}
      />

      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/60 font-display text-lg text-gold">
              Z
            </span>
            <span className="font-display text-2xl">{site.name}</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/55">{site.blurb}</p>
          <p className="mt-5 text-[0.62rem] uppercase tracking-[0.28em] text-cream/35">
            Serving since {site.established}
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h4 className="eyebrow">{column.title}</h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/65">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
              {column.title === "Eat" ? (
                <li>
                  <Link href="/admin" className="text-cream/40 transition hover:text-gold">
                    Staff dashboard
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="eyebrow">Find us</h4>
          <address className="mt-5 space-y-1 text-sm not-italic text-cream/65">
            <p>{site.address.line1}</p>
            <p>{site.address.line2}</p>
            <p>{site.address.city}</p>
          </address>
          <div className="mt-5 space-y-2 text-sm">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="block text-cream/80 transition hover:text-gold"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="block text-cream/80 transition hover:text-gold"
            >
              {site.email}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-[0.68rem] uppercase tracking-[0.2em] text-cream/45">
            {site.social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-gold"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="rule" />
      <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-[0.68rem] uppercase tracking-[0.2em] text-cream/35 md:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name} {site.suffix}. All rights reserved.
        </p>
        <p>{site.tagline}</p>
      </div>
    </footer>
  );
}
