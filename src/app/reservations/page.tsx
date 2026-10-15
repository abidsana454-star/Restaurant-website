import type { Metadata } from "next";
import Link from "next/link";
import { ReservationForm } from "@/components/reservation-form";
import { PageHero } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { IMG } from "@/db/seed-data";
import { reservationPolicies, site, venueSpaces } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reservations",
  description:
    "Book a table at Zaiqa Kitchen & Grill — terrace, mezzanine, chef's counter or private room.",
};

export default function ReservationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reservations"
        title={
          <>
            Tell us when. <span className="italic text-gold">We&apos;ll handle the rest.</span>
          </>
        }
        description="Pick a room, tell us the occasion and we will have the bread coming out warm. No booking fee, no deposit."
        image={IMG.guests}
      />

      <section className="shell grid gap-10 py-20 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
        <Reveal>
          <ReservationForm />
        </Reveal>

        <div className="space-y-6 lg:sticky lg:top-28">
          <Reveal delay={90}>
            <div className="card p-7">
              <p className="eyebrow">Pick a room</p>
              <ul className="mt-5 space-y-4 text-sm">
                {venueSpaces.map((space) => (
                  <li key={space.name} className="border-b border-cream/5 pb-4 last:border-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-base">{space.name}</span>
                      <span className="text-[0.6rem] uppercase tracking-[0.18em] text-gold">
                        {space.capacity}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-cream/50">{space.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="card p-7">
              <p className="eyebrow">Opening hours</p>
              <ul className="mt-5 space-y-3 text-sm">
                {site.hours.map((entry) => (
                  <li key={entry.day} className="flex justify-between gap-3 border-b border-cream/5 pb-3">
                    <span className="text-cream/80">{entry.day}</span>
                    <span className={entry.value === "Closed" ? "text-clay" : "text-gold"}>
                      {entry.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={210}>
            <div className="card p-7">
              <p className="eyebrow">Table policy</p>
              <ul className="mt-5 space-y-3.5 text-sm leading-relaxed text-cream/60">
                {reservationPolicies.map((policy) => (
                  <li key={policy} className="flex gap-3">
                    <span className="text-gold">◆</span>
                    {policy}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="card grain relative overflow-hidden p-7">
              <p className="eyebrow">Prefer to talk?</p>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="display mt-4 block text-2xl text-gold transition hover:text-gold-soft"
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.reservationsEmail}`}
                className="mt-3 block text-sm text-cream/60 transition hover:text-gold"
              >
                {site.reservationsEmail}
              </a>
              <Link href="/events" className="btn-ghost mt-6 !px-5 !py-2.5 !text-[0.62rem]">
                Booking for 9+ guests?
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
