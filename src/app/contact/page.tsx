import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry-form";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description:
    "Find Zaiqa in DHA Phase VI, Karachi. Call, email, WhatsApp or send us a message.",
};

export default function ContactPage() {
  const contactCards = [
    {
      label: "Reservations",
      value: site.phone,
      href: `tel:${site.phone.replace(/\s/g, "")}`,
      note: "Front desk, noon till close",
    },
    {
      label: "Events desk",
      value: site.eventsEmail,
      href: `mailto:${site.eventsEmail}`,
      note: "Bookings of 9 guests or more",
    },
    {
      label: "General",
      value: site.email,
      href: `mailto:${site.email}`,
      note: "Feedback, careers, press",
    },
  ];

  return (
    <>
      <section className="shell pb-8 pt-36">
        <p className="eyebrow rise-in">Contact</p>
        <h1
          className="display rise-in mt-5 max-w-2xl text-4xl sm:text-5xl lg:text-[3.6rem]"
          style={{ animationDelay: "80ms" }}
        >
          We are on Bukhari Lane,{" "}
          <span className="italic text-gold">second turning</span>
        </h1>
        <p
          className="rise-in mt-6 max-w-xl text-cream/60"
          style={{ animationDelay: "160ms" }}
        >
          Free parking behind the building. Wheelchair-accessible entrance on the ground
          floor. Ask for the events desk for bookings over nine guests.
        </p>
      </section>

      <section className="shell py-12">
        <div className="grid gap-5 sm:grid-cols-3">
          {contactCards.map((card, index) => (
            <Reveal key={card.label} delay={index * 90}>
              <a href={card.href} className="card block h-full p-7 transition hover:border-gold/35">
                <p className="eyebrow !text-[0.58rem]">{card.label}</p>
                <p className="mt-3 font-display text-lg text-cream transition hover:text-gold">
                  {card.value}
                </p>
                <p className="mt-2 text-xs text-cream/45">{card.note}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell grid gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-6">
          <Reveal>
            <div className="card overflow-hidden">
              <iframe
                title="Zaiqa location map"
                src={site.mapQuery}
                loading="lazy"
                className="h-80 w-full border-0 grayscale-[40%]"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-7">
                <address className="space-y-1 text-sm not-italic text-cream/70">
                  <p>{site.address.line1}</p>
                  <p>{site.address.line2}</p>
                  <p>{site.address.city}</p>
                </address>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost !px-5 !py-2.5 !text-[0.62rem]"
                  >
                    WhatsApp
                  </a>
                  <Link
                    href="/reservations"
                    className="btn-gold !px-5 !py-2.5 !text-[0.62rem]"
                  >
                    Book a table
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card p-7">
              <p className="eyebrow">Opening hours</p>
              <ul className="mt-5 space-y-3 text-sm">
                {site.hours.map((entry) => (
                  <li
                    key={entry.day}
                    className="flex justify-between gap-4 border-b border-cream/5 pb-3"
                  >
                    <span className="text-cream/75">{entry.day}</span>
                    <span className={entry.value === "Closed" ? "text-clay" : "text-gold"}>
                      {entry.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="card p-7">
              <p className="eyebrow">Follow along</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {site.social.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost !px-5 !py-2.5 !text-[0.62rem]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={210}>
            <div className="card p-7">
              <SectionHeading
                eyebrow="Other things"
                title={
                  <>
                    Looking for something{" "}
                    <span className="italic text-gold">specific?</span>
                  </>
                }
              />
              <div className="mt-6 grid gap-3 text-sm">
                {[
                  { href: "/events", label: "Catering & private events" },
                  { href: "/order", label: "Delivery and pickup" },
                  { href: "/journal", label: "Kitchen journal" },
                  { href: "/admin", label: "Staff dashboard" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl border border-cream/10 px-4 py-3 text-cream/70 transition hover:border-gold/40 hover:text-gold"
                  >
                    {link.label}
                    <span>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <EnquiryForm variant="general" />
        </Reveal>
      </section>
    </>
  );
}
