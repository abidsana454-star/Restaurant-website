import type { Metadata } from "next";
import Image from "next/image";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { IMG } from "@/db/seed-data";
import { eventPackages, site, venueSpaces } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events & Catering",
  description:
    "From a private room for twelve to full wedding catering for 800 guests. Live tandoor counters, staffing and crockery included.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events & catering"
        title={
          <>
            Twelve people or eight hundred,{" "}
            <span className="italic text-gold">we have done both</span>
          </>
        }
        description="440+ events since 2014. Live tandoor counters, full staffing, crockery and site survey included — with a menu tasting before you commit."
        image={IMG.guests}
      />

      {/* PACKAGES */}
      <section className="shell py-24">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Packages"
            title={
              <>
                Three ways to <span className="italic text-gold">daawat</span>
              </>
            }
            description="Every package is a starting point. Amna will rebuild the menu around your family's preferences."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {eventPackages.map((pack, index) => (
            <Reveal key={pack.name} delay={index * 100} className="h-full">
              <div
                className={`card relative flex h-full flex-col p-8 transition duration-500 hover:-translate-y-1.5 ${
                  pack.featured ? "!border-gold/45" : "hover:border-gold/30"
                }`}
              >
                {pack.featured ? (
                  <span className="tag absolute -top-3 left-8 !bg-gold !text-ink">
                    Most booked
                  </span>
                ) : null}
                <p className="eyebrow !text-[0.6rem]">{pack.guests}</p>
                <h3 className="display mt-3 text-2xl">{pack.name}</h3>
                <p className="mt-2 font-display text-lg text-gold">{pack.price}</p>
                <ul className="mt-7 flex-1 space-y-3 text-sm text-cream/60">
                  {pack.includes.map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="mt-0.5 text-gold">◆</span>
                      {line}
                    </li>
                  ))}
                </ul>
                <a href="#enquire" className="btn-ghost mt-8">
                  Request proposal
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VENUE SPACES */}
      <section className="relative border-y border-cream/10 bg-coal py-24">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Our spaces"
              title={
                <>
                  Host it here, or we come to{" "}
                  <span className="italic text-gold">you</span>
                </>
              }
              description="Four rooms in-house, plus full off-site catering anywhere in Karachi."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {venueSpaces.map((space, index) => (
              <Reveal key={space.name} delay={index * 80}>
                <div className="card h-full p-7">
                  <p className="tag inline-block">{space.capacity}</p>
                  <h3 className="display mt-4 text-xl">{space.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/55">{space.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Reveal>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem]">
                <Image
                  src={IMG.tandoor}
                  alt="Live tandoor counter at an event"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <p className="glass absolute bottom-5 left-5 px-5 py-3 text-xs text-cream/75">
                  Live tandoor counter — assembled on site in 90 minutes
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <SectionHeading
                eyebrow="How it runs"
                title={
                  <>
                    Six weeks out to the last{" "}
                    <span className="italic text-gold">plate</span>
                  </>
                }
              />
              <ol className="mt-8 space-y-5 text-sm">
                {[
                  "Site visit and headcount, then a written proposal within 48 hours.",
                  "Menu tasting for six people at the restaurant, on us.",
                  "Timeline, floor plan and staffing schedule confirmed in writing.",
                  "On the day: an event manager, a chef on the counter, and one server per eight guests.",
                ].map((line, index) => (
                  <li key={line} className="flex gap-4 border-l border-gold/30 pl-5">
                    <span className="font-display text-xs text-gold">
                      0{index + 1}
                    </span>
                    <span className="leading-relaxed text-cream/65">{line}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-9 flex flex-wrap gap-4">
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="btn-gold">
                  Call the events desk
                </a>
                <a
                  href={`mailto:${site.eventsEmail}`}
                  className="btn-ghost"
                >
                  {site.eventsEmail}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <section id="enquire" className="shell scroll-mt-28 py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Get a proposal"
              title={
                <>
                  Let&apos;s plan it <span className="italic text-gold">properly</span>
                </>
              }
              description="Fill in what you know. Even a rough guest count is enough for us to come back with real numbers."
            />
            <div className="card mt-8 p-7">
              <p className="eyebrow !text-[0.6rem]">Recent events</p>
              <ul className="mt-4 space-y-3 text-sm text-cream/60">
                <li>◆ Nikkah, 320 guests — Beachview marquee</li>
                <li>◆ Corporate dinner, 90 guests — Mezzanine hall</li>
                <li>◆ Aqiqa, 45 guests — Private room + terrace</li>
                <li>◆ Mehndi, 560 guests — off-site, four counters</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <EnquiryForm variant="event" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
